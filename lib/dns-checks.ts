import { DnsCheck } from "./types";

// Deterministic DNS analysis from domain string
// In production: replace with real dns.promises lookups + blacklist API calls
export function analyzeDomain(domain: string): { score: number; checks: DnsCheck[] } {
  const h = domain.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const s = h % 97;

  const spf   = s % 7 !== 0;
  const dkim  = s % 5 !== 0;
  const dmarc = s % 3 !== 0;
  const bl    = s % 11 === 0;
  const rdns  = s % 9 !== 0;
  const tls   = s % 13 !== 0;

  const checks: DnsCheck[] = [
    {
      label: "SPF Record",
      status: spf ? "pass" : "fail",
      value: spf ? `v=spf1 include:_spf.${domain} ~all` : "No SPF record",
      detail: spf
        ? "SPF record found. Receiving servers can verify your sending source."
        : "No SPF record. Any server can send email claiming to be from your domain.",
    },
    {
      label: "DKIM Signature",
      status: dkim ? "pass" : "warn",
      value: dkim ? `default._domainkey.${domain} — 2048-bit` : "Selector not found",
      detail: dkim
        ? "DKIM signing active. Emails are cryptographically authenticated."
        : "DKIM not detected. Emails cannot prove they haven't been tampered with.",
    },
    {
      label: "DMARC Policy",
      status: dmarc ? "pass" : "fail",
      value: dmarc ? `v=DMARC1; p=quarantine; rua=mailto:dmarc@${domain}` : "No DMARC record",
      detail: dmarc
        ? "DMARC policy set to quarantine. Domain is protected against spoofing."
        : "No DMARC record. Domain is vulnerable to spoofing and phishing abuse.",
    },
    {
      label: "Blacklist Status",
      status: bl ? "fail" : "pass",
      value: bl ? "Listed on Spamhaus PBL, SURBL" : "Clean across 47 RBLs",
      detail: bl
        ? "Your IP or domain is blacklisted. This is the primary cause of spam folder delivery."
        : "Not listed on any major blacklist databases.",
    },
    {
      label: "Reverse DNS",
      status: rdns ? "pass" : "warn",
      value: rdns ? `PTR → mail.${domain}` : "No PTR record",
      detail: rdns
        ? "Reverse DNS resolves correctly. Sending IP maps to a valid hostname."
        : "No reverse DNS record. Some strict mail servers will reject without this.",
    },
    {
      label: "TLS Encryption",
      status: tls ? "pass" : "warn",
      value: tls ? "STARTTLS · TLS 1.3" : "TLS 1.0 only (deprecated)",
      detail: tls
        ? "STARTTLS active with TLS 1.3. Email content is encrypted in transit."
        : "Only deprecated TLS 1.0 detected. Upgrade for security compliance.",
    },
  ];

  const passW = checks.filter(c => c.status === "pass").length * 16;
  const warnW = checks.filter(c => c.status === "warn").length * 6;
  const base  = bl ? 12 + (s % 22) : 44 + (s % 44);
  const score = Math.min(100, Math.max(5, base + passW + warnW - (bl ? 20 : 0)));

  return { score, checks };
}
