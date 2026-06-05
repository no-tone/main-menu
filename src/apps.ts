export type AppTag =
	| "Self-Hosted"
	| "Personal"
	| "Network"
	| "Media"
	| "Monitoring"
	| "Security"
	| "Ops";

export type App = {
	name: string;
	href: string;
	tags: AppTag[];
	iconUrl: string;
};

export const APPS: App[] = [
	{
		name: "Tailscale",
		href: "https://login.tailscale.com/admin/",
		tags: ["Network"],
		iconUrl:
			"https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/tailscale-light.webp",
	},
	{
		name: "Nginx",
		href: "https://proxy.no-tone.com",
		tags: ["Ops", "Network", "Self-Hosted"],
		iconUrl:
			"https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/nginx-proxy-manager.webp",
	},
	{
		name: "Portainer",
		href: "https://ports.no-tone.com",
		tags: ["Ops", "Self-Hosted"],
		iconUrl:
			"https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/portainer-dark.webp",
	},
	{
		name: "Vaultwarden",
		href: "https://pass.no-tone.com",
		tags: ["Security", "Self-Hosted"],
		iconUrl:
			"https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/vaultwarden-light.webp",
	},
	{
		name: "Joplin",
		href: "https://notes.no-tone.com",
		tags: ["Personal", "Self-Hosted"],
		iconUrl:
			"https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/joplin.png",
	},
	{
		name: "Immich",
		href: "https://photos.no-tone.com",
		tags: ["Media", "Self-Hosted"],
		iconUrl:
			"https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/immich.webp",
	},
	{
		name: "OpenCloud",
		href: "https://drive.no-tone.com",
		tags: ["Media", "Self-Hosted"],
		iconUrl:
			"https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/open-cloud-dark.webp",
	},
	{
		name: "Grafana",
		href: "https://monitor.no-tone.com",
		tags: ["Monitoring", "Ops", "Self-Hosted"],
		iconUrl:
			"https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/grafana.webp",
	},
	{
		name: "Prometheus",
		href: "https://targets.no-tone.com",
		tags: ["Monitoring", "Ops", "Self-Hosted"],
		iconUrl:
			"https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/prometheus.webp",
	},
];

export const ALL_TAGS: AppTag[] = Array.from(
	new Set(APPS.flatMap((app) => app.tags)),
).sort() as AppTag[];
