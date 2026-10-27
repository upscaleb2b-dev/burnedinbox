import type { MetadataRoute } from "next";
import { allPosts } from "./blog/all-posts";
import { GUIDES } from "@/lib/guides";

const BASE = "https://burnedinbox.com";

const TOOL_PAGES = [
  "backup-budget", "burn-cost", "burn-score", "client-capacity", "deliverability-risk", "domain-count", "emergency", "inbox-count", "infra-calc", "launch-checklist", "recovery-time", "repair-or-replace", "replacement-vs-downtime", "send-limits", "sending-capacity", "warmup-ready", "warmup-time-saved",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: BASE,            lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/test`,  lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/blog`,  lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
  ];

  const tools: MetadataRoute.Sitemap = TOOL_PAGES.map((slug) => ({
    url: `${BASE}/tools/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const articles: MetadataRoute.Sitemap = allPosts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const guides: MetadataRoute.Sitemap = [
    { url: `${BASE}/errors`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...GUIDES.filter((g) => !g.path.startsWith("/blog/")).map((g) => ({
      url: `${BASE}${g.path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: g.kind === "landing" ? 0.9 : 0.7,
    })),
  ];

  return [...core, ...tools, ...guides, ...articles];
}
