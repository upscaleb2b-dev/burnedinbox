export type Verdict = "inbox" | "spam" | "missing" | "pending";

export interface DnsCheck {
  label: string;
  status: "pass" | "warn" | "fail";
  value: string;
  detail: string;
}


