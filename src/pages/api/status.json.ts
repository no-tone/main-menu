import type { APIRoute } from "astro";
import { env as cloudflareEnv } from "cloudflare:workers";
import { APPS } from "../../apps";

export const prerender = false;

type Status = "up" | "down" | "unknown";

const PROBE_TIMEOUT_MS = 2500;
const TAILSCALE_TOKEN_URL = "https://api.tailscale.com/api/v2/oauth/token";

type RuntimeEnv = Record<string, unknown>;

type TailnetDevice = {
  name?: string;
  hostname?: string;
  addresses?: string[];
  online?: boolean;
  lastSeen?: string;
};

const env = cloudflareEnv as unknown as RuntimeEnv;

function envString(env: RuntimeEnv, key: string) {
  const value = env[key];
  return typeof value === "string" ? value.trim() : "";
}

function basicAuth(username: string, password: string) {
  return `Basic ${btoa(`${username}:${password}`)}`;
}

function probePath(url: URL) {
  return url.hostname === "pass.no-tone.com" ? "/favicon.ico" : "/";
}

async function probe(href: string): Promise<Status> {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return "unknown";
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);

  try {
    const response = await fetch(new URL(probePath(url), url), {
      cache: "no-store",
      redirect: "manual",
      signal: controller.signal,
    });

    return response.status < 500 ? "up" : "down";
  } catch {
    return "down";
  } finally {
    clearTimeout(timer);
  }
}

async function getTailscaleToken(env: RuntimeEnv): Promise<string | null> {
  const clientId = envString(env, "TAILSCALE_OAUTH_CLIENT_ID");
  const clientSecret = envString(env, "TAILSCALE_OAUTH_CLIENT_SECRET");
  if (!clientId || !clientSecret) return null;

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    scope: envString(env, "TAILSCALE_OAUTH_SCOPE") || "devices:core:read",
  });

  const response = await fetch(TAILSCALE_TOKEN_URL, {
    method: "POST",
    headers: {
      authorization: basicAuth(clientId, clientSecret),
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) return null;
  const data = (await response.json()) as { access_token?: string };
  return data.access_token ?? null;
}

function findDevice(devices: TailnetDevice[], target: string) {
  const needle = target.trim().toLowerCase();
  if (!needle) return null;
  return (
    devices.find((device) => {
      const names = [
        device.hostname,
        device.name,
        ...(device.addresses ?? []),
      ].filter(Boolean);
      return names.some((name) => {
        const value = String(name).toLowerCase();
        return value === needle || value.startsWith(`${needle}.`);
      });
    }) ?? null
  );
}

async function getTailnetDevice(env: RuntimeEnv) {
  const tailnet = envString(env, "TAILSCALE_TAILNET");
  const target = envString(env, "TAILSCALE_STATUS_DEVICE");
  if (!tailnet || !target) return null;

  const token = await getTailscaleToken(env);
  if (!token) return null;

  const response = await fetch(
    `https://api.tailscale.com/api/v2/tailnet/${encodeURIComponent(
      tailnet,
    )}/devices`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) return null;
  const data = (await response.json()) as { devices?: TailnetDevice[] };
  const device = findDevice(data.devices ?? [], target);
  if (!device) return null;

  return {
    name: device.hostname ?? device.name ?? target,
    online: Boolean(device.online),
    lastSeen: device.lastSeen ?? null,
  };
}

export const GET: APIRoute = async () => {
  const [apps, tailnetDevice] = await Promise.all([
    Promise.all(
      APPS.map(async (app) => ({
        name: app.name,
        href: app.href,
        status: await probe(app.href),
      })),
    ),
    getTailnetDevice(env),
  ]);

  return new Response(
    JSON.stringify({
      generatedAt: new Date().toISOString(),
      apps,
      tailnet: {
        device: tailnetDevice,
      },
    }),
    {
      headers: {
        "cache-control": "no-store",
        "content-type": "application/json; charset=utf-8",
      },
    },
  );
};
