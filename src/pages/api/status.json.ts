import type { APIRoute } from "astro";
import { APPS } from "../../apps";

export const prerender = false;

type Status = "up" | "down" | "unknown";

const PROBE_TIMEOUT_MS = 2500;

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

export const GET: APIRoute = async () => {
  const apps = await Promise.all(
    APPS.map(async (app) => ({
      name: app.name,
      href: app.href,
      status: await probe(app.href),
    })),
  );

  return new Response(
    JSON.stringify({
      generatedAt: new Date().toISOString(),
      apps,
    }),
    {
      headers: {
        "cache-control": "no-store",
        "content-type": "application/json; charset=utf-8",
      },
    },
  );
};
