export type Verdict = "inbox" | "spam" | "missing" | "pending";

export interface DnsCheck {
  label: string;
  status: "pass" | "warn" | "fail";
  value: string;
  detail: string;
}

export interface TestSession {
  id: string;
  domain: string;
  seedEmail: string;
  createdAt: number;
  status: "waiting" | "received" | "timeout";
  verdict?: Verdict;
  score?: number;
  dnsChecks?: DnsCheck[];
  folder?: "inbox" | "spam" | "promotions";
}
