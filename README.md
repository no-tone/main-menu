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

The UI combines two signals to show one of `up`, `down`, or `vpn` per tile:

- `/api/status.json` runs in Cloudflare and probes each app URL server-side. Public apps are accurate. Self-hosted apps behind Tailscale always show `down` from the worker, because Cloudflare is not on your tailnet.
- If Tailscale OAuth secrets are configured, `/api/status.json` also reports whether a chosen Tailscale device is online. When that device is offline, self-hosted tiles switch to `down`.
- The browser uses `RTCPeerConnection` ICE candidates to detect a Tailscale CGNAT range (`100.64.0.0/10`) or Tailscale IPv6 prefix (`fd7a:115c:a1e0::/48`) in the visitor's local addresses. If found, the visitor is treated as on the tailnet.

Resolution:

- Worker says `up` → tile is `up`.
- Self-hosted + OAuth device offline → tile is `down`.
- Browser ping succeeds → tile is `up`.
- Public + ping fails → tile is `down`.
- Self-hosted + ping fails + visitor on tailnet → tile is `down` (you can reach it directly, so it is actually broken).
- Self-hosted + ping fails + visitor not on tailnet → tile is `vpn` (worker cannot see tailnet apps, so the only remaining cause is "you need to turn on Tailscale").

Mobile browsers often hide ICE host candidates, so `vpn` vs `down` on mobile can be fuzzy. That is a browser limitation, not something the app can fix.

Tailscale app connectors route tailnet client traffic to configured domains. They do not make a public Cloudflare Worker part of your tailnet. For private origins, use Cloudflare Tunnel/Access.

Optional Tailscale API status:

```bash
TAILSCALE_OAUTH_CLIENT_ID=...
TAILSCALE_OAUTH_CLIENT_SECRET=...
TAILSCALE_OAUTH_SCOPE=devices:core:read
TAILSCALE_TAILNET=sphinx-dojo.ts.net
TAILSCALE_STATUS_DEVICE=tn-lm
```

In Cloudflare, set these as Worker secrets/vars. Do not prefix them with `PUBLIC_`.

Customize your links in the source as needed.

---

## License

No license, this is a personal project.
