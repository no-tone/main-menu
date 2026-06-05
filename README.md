# Main Menu

A super simple web app for quickly accessing links to your self-hosted applications and tools.

Website: [apps.no-tone.com](https://apps.no-tone.com)

<img width="1440" height="900" alt="Image" src="https://github.com/user-attachments/assets/6bdf969f-6a51-45ea-b37e-56ca5c5af0ff" />

---

## What is this?

This is a very minimal dashboard. It displays a menu of your most-used self-hosted apps and related links, all in one place.  
It’s protected by Cloudflare Zero Trust and not meant for public access.

- No user management
- No backend
- No fancy features—just a static menu page
- Private: only accessible via Cloudflare Zero Trust

---

## Getting Started

Install dependencies and start in development mode:

```bash
npm install
npm run dev
```

## Tailnet Status (vpn / up / down)

The UI checks status in two passes:

- `/api/status.json` runs in Cloudflare and probes each app URL server-side.
- The browser still checks whether the client can reach a tailnet-only health URL. That is the only part that can distinguish `vpn` from `down`, because Cloudflare cannot see whether the visitor has Tailscale enabled.

Tailscale app connectors route tailnet client traffic to configured domains. They do not make a public Cloudflare Worker part of your tailnet. For private origins, use Cloudflare Tunnel/Access or keep the client-side tailnet probe below.

On a machine that has Tailscale running, create one:

```bash
sudo tailscale serve --bg --set-path /health 'text:ok'
tailscale serve status
```

Then set:

```bash
PUBLIC_TAILNET_PROBE_URL=https://<device>.your-tailnet.ts.net/health
```

Note: `PUBLIC_*` vars are embedded in client JS (not secret). Keeping `.env` out of git still avoids publishing it in your repo.

Useful commands:

```bash
tailscale serve status
sudo tailscale serve reset
```

If the URL works in terminal but not in the browser (`ERR_NAME_NOT_RESOLVED`), disable Secure DNS / DoH in your browser so it uses the OS resolver (Tailscale DNS).

Customize your links in the source as needed.

---

## License

No license, this is a personal project.
