export interface ToolHandoff {
  path: string;
  name: string;
  warmInboxesName: string;
  warmInboxesUrl: string;
  summary: string;
  whatItIs: string;
  checks: string[];
  useWhen: string[];
  extra?: { label: string; url: string; note: string };
  related: string[];
}

export const TOOL_HANDOFFS: Record<string, ToolHandoff> = {
  spf: {
    path: "/tools/spf",
    name: "SPF Checker",
    warmInboxesName: "SPF Checker",
    warmInboxesUrl: "https://warminboxes.com/spf-checker",
    summary: "Look up a domain's SPF record, validate it, and count the DNS lookups it costs.",
    whatItIs: "SPF (Sender Policy Framework) is a DNS TXT record that lists which servers are allowed to send email for your domain. Receiving servers check it on every message: if the sending server isn't on the list, the email fails SPF and is far more likely to land in spam or be rejected.",
    checks: [
      "Whether the domain publishes an SPF record, and whether it publishes more than one (which breaks SPF entirely)",
      "The default policy — -all (reject), ~all (softfail), ?all or +all",
      "Every include: mechanism, resolved recursively",
      "The total DNS lookup count against SPF's hard limit of 10",
    ],
    useWhen: [
      "You've just set up a new sending domain or added a new tool (Instantly, Smartlead, a CRM) that sends as you",
      "Emails started failing authentication or landing in spam",
      "Your SPF record has grown with many includes and you're near the 10-lookup limit",
    ],
    extra: { label: "Record Generator", url: "https://warminboxes.com/record-generator", note: "Need to build a new SPF record instead? Use the Record Generator, which has presets for every major ESP." },
    related: ["dkim", "dmarc", "dns"],
  },
  dkim: {
    path: "/tools/dkim",
    name: "DKIM Checker",
    warmInboxesName: "DKIM Checker",
    warmInboxesUrl: "https://warminboxes.com/dkim-checker",
    summary: "Find a domain's DKIM selectors and validate the signing key's strength.",
    whatItIs: "DKIM (DomainKeys Identified Mail) adds a cryptographic signature to every email you send. The public key lives in DNS under a selector (for example google._domainkey.yourdomain.com), and receiving servers use it to confirm the message really came from your domain and wasn't altered in transit.",
    checks: [
      "Auto-scans 26 common selectors, so you don't need to know yours first",
      "Whether each key is valid, revoked (empty p=) or in test mode",
      "Key type and length — 2048-bit RSA is the current standard; 1024-bit is weak",
    ],
    useWhen: [
      "You've enabled DKIM in Google Workspace or Microsoft 365 and want to confirm it's published",
      "Headers show dkim=fail or dkim=none on your sent mail",
      "You don't know which selector your sending platform uses",
    ],
    related: ["spf", "dmarc", "bimi"],
  },
  dmarc: {
    path: "/tools/dmarc",
    name: "DMARC Checker",
    warmInboxesName: "DMARC Checker",
    warmInboxesUrl: "https://warminboxes.com/dmarc-checker",
    summary: "Validate a domain's DMARC record and understand its policy, tags and reporting.",
    whatItIs: "DMARC tells receiving servers what to do with email that fails SPF and DKIM alignment — deliver it (p=none), send it to spam (p=quarantine) or reject it (p=reject) — and where to send reports about it. Gmail and Yahoo now require a DMARC record from bulk senders.",
    checks: [
      "Whether a valid v=DMARC1 record exists at _dmarc.yourdomain.com",
      "The policy (p=) and subdomain policy (sp=), and what percentage of mail they apply to",
      "Reporting addresses (rua=, ruf=) and alignment modes (adkim=, aspf=)",
      "Each tag explained in plain English",
    ],
    useWhen: [
      "Setting up a new sending domain — DMARC is required by Gmail and Yahoo for bulk senders",
      "Moving from p=none to p=quarantine or p=reject",
      "Emails fail DMARC even though SPF or DKIM passes",
    ],
    extra: { label: "DMARC Report Analyzer", url: "https://warminboxes.com/dmarc-report-analyzer", note: "Receiving DMARC XML reports? The DMARC Report Analyzer shows who is sending as you and what passed." },
    related: ["spf", "dkim", "bimi"],
  },
  dns: {
    path: "/dns",
    name: "DNS Checker",
    warmInboxesName: "DNS Checker",
    warmInboxesUrl: "https://warminboxes.com/dns-checker",
    summary: "Query any DNS record type for any domain — MX, TXT, CNAME, A, NS and more.",
    whatItIs: "Every part of email delivery runs on DNS: MX records route incoming mail, TXT records hold SPF, DKIM and DMARC, and CNAMEs point tracking domains at your sending platform. A DNS checker shows you exactly what the internet sees for your domain right now.",
    checks: [
      "A, AAAA, MX, TXT, CNAME, NS, SOA, SRV, PTR and CAA records",
      "Record values and TTLs",
      "Whether a record you just added has actually propagated",
    ],
    useWhen: [
      "You've just changed a DNS record and want to confirm it's live",
      "Debugging why a tracking domain, SPF include or MX change isn't working",
      "Auditing a domain before you start sending from it",
    ],
    related: ["mx", "spf", "tracking-domain"],
  },
  mx: {
    path: "/tools/mx",
    name: "MX Lookup",
    warmInboxesName: "MX Lookup",
    warmInboxesUrl: "https://warminboxes.com/mx-lookup",
    summary: "Look up a domain's MX records and identify the mail provider behind them.",
    whatItIs: "MX (Mail Exchange) records tell the world which servers accept email for a domain, and in what priority order. They also reveal who hosts the mailbox — Google Workspace, Microsoft 365, or a security gateway like Mimecast or Proofpoint — which matters when you're planning which inboxes to send from.",
    checks: [
      "Every MX record with its priority, address and TTL",
      "The mail provider behind the domain",
      "Missing or misconfigured MX records that stop a domain receiving replies",
    ],
    useWhen: [
      "Confirming a new sending domain can receive replies",
      "Finding out whether a prospect's company uses Google or Microsoft",
      "Segmenting a lead list by provider — use the Bulk MX Lookup for whole lists",
    ],
    extra: { label: "Bulk MX Lookup", url: "https://warminboxes.com/bulk-mx-lookup", note: "Checking a whole list of domains? Bulk MX Lookup handles up to 100 at once and exports a CSV." },
    related: ["dns", "rdns", "spf"],
  },
  rdns: {
    path: "/tools/rdns",
    name: "Reverse DNS Lookup",
    warmInboxesName: "Reverse DNS Lookup",
    warmInboxesUrl: "https://warminboxes.com/reverse-dns-lookup",
    summary: "Look up the PTR record for an IP and check whether it forward-confirms.",
    whatItIs: "Reverse DNS maps an IP address back to a hostname through a PTR record. Many receiving mail servers check that the sending IP has a PTR record, and that the hostname resolves back to the same IP (forward-confirmed reverse DNS, or FCrDNS). Missing or generic reverse DNS is a common reason mail from dedicated IPs gets rejected.",
    checks: [
      "The PTR record for an IPv4 or IPv6 address",
      "Whether the hostname resolves back to the same IP (FCrDNS)",
      "Generic ISP-style hostnames that look like residential connections",
    ],
    useWhen: [
      "You send from a dedicated IP or your own SMTP server",
      "Bounces mention reverse DNS, PTR or 'cannot resolve' errors",
      "Setting up a new mail server",
    ],
    related: ["mx", "dns", "spf"],
  },
  "tracking-domain": {
    path: "/tools/tracking-domain",
    name: "Tracking Domain Checker",
    warmInboxesName: "Tracking Domain Checker",
    warmInboxesUrl: "https://warminboxes.com/tracking-domain-checker",
    summary: "Check the custom domain your tracked links point at — DNS, certificate and blocklists.",
    whatItIs: "Cold email tools rewrite your links through a tracking domain to count clicks. If you use the platform's shared tracking domain, you share its reputation with every other sender on it; a custom tracking domain keeps that reputation yours. A broken tracking domain — bad CNAME, expired certificate, or a Cloudflare proxy in the way — can silently break links and hurt placement.",
    checks: [
      "The CNAME chain and which platform it points at",
      "The TLS certificate, so tracked links don't throw browser warnings",
      "URL blocklist listings for the domain",
      "Whether the tracking domain is yours or your platform's shared one",
    ],
    useWhen: [
      "Setting up a custom tracking domain in Instantly, Smartlead or Lemlist",
      "Click tracking stopped working, or links show security warnings",
      "Placement dropped and you want to rule out the link domain",
    ],
    related: ["dns", "domain-expiry", "spf"],
  },
  "domain-expiry": {
    path: "/tools/domain-expiry",
    name: "Domain Expiry Checker",
    warmInboxesName: "Domain Expiry Checker",
    warmInboxesUrl: "https://warminboxes.com/domain-expiry-checker",
    summary: "See when a domain expires, who it's registered with, and how urgently it needs renewing.",
    whatItIs: "When a sending domain expires, its DNS stops resolving: SPF, DKIM and MX disappear, every campaign on it fails, and the warmup history you built is at risk. Agencies running dozens of sending domains lose them to forgotten renewals more often than to spam filters.",
    checks: [
      "The expiry date and days remaining",
      "The registrar and nameservers",
      "Domain status codes, such as a renewal grace period or a transfer lock",
    ],
    useWhen: [
      "Auditing a fleet of sending domains",
      "Inheriting domains from a client or a previous agency",
      "Before buying or transferring a domain",
    ],
    related: ["dns", "tracking-domain", "mx"],
  },
  bimi: {
    path: "/tools/bimi",
    name: "BIMI Checker",
    warmInboxesName: "BIMI Checker",
    warmInboxesUrl: "https://warminboxes.com/bimi-checker",
    summary: "Validate your BIMI record, logo SVG, VMC certificate and DMARC enforcement.",
    whatItIs: "BIMI (Brand Indicators for Message Identification) lets supporting mail clients show your brand logo next to your emails in the inbox. It only works when DMARC is enforced (p=quarantine or p=reject), and Gmail additionally requires a Verified Mark Certificate (VMC) or Common Mark Certificate.",
    checks: [
      "The BIMI record at default._bimi.yourdomain.com",
      "Whether the logo is a reachable SVG in the required Tiny PS format",
      "The VMC certificate URL",
      "The DMARC enforcement BIMI depends on",
    ],
    useWhen: [
      "Setting up your logo for Gmail, Yahoo or Apple Mail",
      "Your logo isn't showing even though you've published a BIMI record",
      "After moving DMARC to an enforcing policy",
    ],
    related: ["dmarc", "dkim", "mta-sts"],
  },
  "mta-sts": {
    path: "/tools/mta-sts",
    name: "MTA-STS Checker",
    warmInboxesName: "MTA-STS Checker",
    warmInboxesUrl: "https://warminboxes.com/mta-sts-checker",
    summary: "Validate your MTA-STS record and policy file, and check TLS-RPT reporting.",
    whatItIs: "MTA-STS tells other mail servers that they must use encrypted TLS when delivering email to your domain, which protects inbound mail against downgrade and interception attacks. It needs a DNS record, a policy file served over HTTPS, and ideally a TLS-RPT record so you're told when delivery fails.",
    checks: [
      "The _mta-sts DNS record and its policy id",
      "The policy file at mta-sts.yourdomain.com — mode, MX patterns and max_age",
      "Whether you're in enforce or testing mode",
      "The TLS-RPT record for failure reports",
    ],
    useWhen: [
      "Hardening a primary business domain's inbound mail",
      "Moving MTA-STS from testing to enforce mode",
      "Your security team or a customer audit asks for TLS enforcement",
    ],
    related: ["mx", "dmarc", "bimi"],
  },
};
