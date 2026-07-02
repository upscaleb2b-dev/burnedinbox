import type { MetadataRoute } from "next";
import { posts } from "./blog/posts";
import { posts2 } from "./blog/posts2";
import { posts3 } from "./blog/posts3";

const BASE = "https://burnedinbox.com";

const TOOL_PAGES = [
  "backup-budget", "bimi", "blacklist", "burn-cost", "burn-score",
  "client-capacity", "deliverability-risk", "dkim", "dmarc", "domain-count",
  "domain-expiry", "email-spam", "emergency", "header-parser", "inbox-count",
  "infra-calc", "launch-checklist", "link-check", "mta-sts", "mx", "rdns",
  "recovery-time", "redirect", "repair-or-replace", "replacement-vs-downtime",
  "send-limits", "sending-capacity", "spf", "subject-check", "tracking-domain",
  "warmup-ready", "warmup-time-saved",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: BASE,            lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/test`,  lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/dns`,   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog`,  lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
  ];

  const tools: MetadataRoute.Sitemap = TOOL_PAGES.map((slug) => ({
    url: `${BASE}/tools/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const articles: MetadataRoute.Sitemap = [...posts, ...posts2, ...posts3].map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...core, ...tools, ...articles];
}
