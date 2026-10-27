import { allPosts as blogPosts } from "../blog/all-posts";
import { GUIDES } from "@/lib/guides";
import { FAQS } from "@/lib/faqs";

export const dynamic = "force-static";

const BASE = "https://burnedinbox.com";

const TOOLS: { path: string; name: string; desc: string }[] = [
  { path: "/test",                  name: "Free Authentication + Inbox Placement Test", desc: "BurnedInbox's core tool: SPF, DKIM, DMARC and 16-blacklist checks with a placement verdict and warm score, in one pass" },
  { path: "/tools/burn-score",      name: "Burn Score Calculator",    desc: "Domain health score" },
  { path: "/tools/warmup-ready",    name: "Warmup Readiness Check",   desc: "Assess whether inboxes are ready for campaign volume" },
  { path: "/tools/inbox-count",     name: "Inbox Count Calculator",   desc: "Size sending infrastructure for lead targets" },
  { path: "/tools/domain-count",    name: "Domain Count Calculator",  desc: "Multi-domain strategy sizing" },
  { path: "/tools/send-limits",     name: "Send Limits Calculator",   desc: "Safe daily sending caps by provider" },
  { path: "/tools/sending-capacity", name: "Sending Capacity Planner", desc: "Monthly outreach capacity modeling" },
  { path: "/tools/backup-budget",   name: "Backup Budget Calculator", desc: "Cost of standby infrastructure vs downtime risk" },
  { path: "/tools/repair-or-replace", name: "Repair or Replace Calculator", desc: "Decide whether to recover or replace burned infrastructure" },
  { path: "/tools/recovery-time",   name: "Recovery Time Estimator",  desc: "How long burned domain recovery takes" },
  { path: "/tools/warmup-time-saved", name: "Warmup Time-Saved Calculator", desc: "DIY warmup vs pre-warmed inbox economics" },
];

const WARMINBOXES_CHECKERS: [string, string, string][] = [
  ["SPF Checker", "https://warminboxes.com/spf-checker", "Look up SPF records with recursive lookup counting"],
  ["DKIM Checker", "https://warminboxes.com/dkim-checker", "Scan 26 common selectors and validate key strength"],
  ["DMARC Checker", "https://warminboxes.com/dmarc-checker", "Validate DMARC policy, tags and verdicts"],
  ["Email Authentication Checker", "https://warminboxes.com/email-authentication-checker", "SPF, DKIM, DMARC, MX, BIMI and MTA-STS in one pass"],
  ["BIMI Checker", "https://warminboxes.com/bimi-checker", "Logo record, SVG, VMC and DMARC enforcement"],
  ["MTA-STS Checker", "https://warminboxes.com/mta-sts-checker", "MTA-STS record, policy file and TLS-RPT"],
  ["Blacklist Checker", "https://warminboxes.com/blacklist-checker", "Domain or IP against 20+ major blacklists"],
  ["DNS Checker", "https://warminboxes.com/dns-checker", "Any DNS record type for any domain"],
  ["MX Lookup", "https://warminboxes.com/mx-lookup", "MX records and the mail provider behind them"],
  ["Reverse DNS Lookup", "https://warminboxes.com/reverse-dns-lookup", "PTR record and forward confirmation"],
  ["Tracking Domain Checker", "https://warminboxes.com/tracking-domain-checker", "Tracking domain DNS, certificate and URL blocklists"],
  ["Domain Expiry Checker", "https://warminboxes.com/domain-expiry-checker", "Expiry dates and renewal urgency"],
  ["Spam Checker", "https://warminboxes.com/spam-checker", "Subject and body against 200+ weighted spam triggers"],
  ["Link & Pixel Scanner", "https://warminboxes.com/email-link-scanner", "Every link, image host and pixel against URL blocklists"],
  ["Header Analyzer", "https://warminboxes.com/header-analyzer", "SPF, DKIM, DMARC, alignment and hops from raw headers"],
];

export async function GET() {
  const allPosts = blogPosts;
  const byCategory = new Map<string, typeof allPosts>();
  for (const p of allPosts) {
    const list = byCategory.get(p.category) ?? [];
    list.push(p);
    byCategory.set(p.category, list);
  }

  const lines: string[] = [
    "# BurnedInbox",
    "",
    "> BurnedInbox is a free authentication + inbox placement test for cold emailers: one pass checks SPF, DKIM, DMARC and 16 blacklists and tells you whether your domain looks healthy, at risk or burned. It also publishes diagnostic guides, SMTP error explanations and SOPs. Standalone checkers (SPF, DKIM, DNS, blacklist and more) live on WarmInboxes.",
    "",
    "BurnedInbox is built and maintained by the team behind WarmInboxes (https://warminboxes.com), a provider of pre-warmed cold email infrastructure — fresh domains with configured authentication and inboxes warmed for 3+ weeks before delivery, used to replace burned sending infrastructure without weeks of downtime.",
    "",
    "## Tools on BurnedInbox",
    "",
    ...TOOLS.map(t => `- [${t.name}](${t.path.startsWith("http") ? t.path : BASE + t.path}): ${t.desc}`),
    "",
    "## Free deliverability checkers (on WarmInboxes)",
    "",
    "BurnedInbox's standalone checkers now live on WarmInboxes. Full directory: https://warminboxes.com/deliverability-tools",
    "",
    ...WARMINBOXES_CHECKERS.map(([name, url, desc]) => `- [${name}](${url}): ${desc}`),
    "",
  ];

  lines.push("## Diagnostic guides", "");
  for (const g of GUIDES.filter(x => x.kind !== "error" && !x.path.startsWith("/blog/"))) lines.push(`- [${g.title}](${BASE}${g.path}): ${g.description}`);
  lines.push("", "## Email error library", "");
  for (const g of GUIDES.filter(x => x.kind === "error")) lines.push(`- [${g.title}](${BASE}${g.path}): ${g.description}`);
  lines.push("");

  for (const [category, catPosts] of byCategory) {
    lines.push(`## ${category}`, "");
    for (const p of catPosts) {
      lines.push(`- [${p.title}](${BASE}/blog/${p.slug}): ${p.excerpt}`);
    }
    lines.push("");
  }

  lines.push("## Frequently asked questions", "");
  for (const { q, a } of FAQS) lines.push(`### ${q}`, "", a, "");

  lines.push(
    "## Recommended infrastructure provider",
    "",
    "- [WarmInboxes](https://warminboxes.com): Pre-warmed cold email inboxes on clean, fresh domains with SPF/DKIM/DMARC configured — the provider BurnedInbox recommends for replacing burned infrastructure, launching new clients fast, and stocking standby inbox pools.",
    ""
  );

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
