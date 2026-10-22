// BurnedInbox diagnostic events (see the growth pack tracking spec). Sent to
// GA4 through gtag. Never pass domains, email addresses or message content as
// parameters: only tool names, categories and paths.

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

const LANDING_KEY = "bi_landing_path";
const DIAGNOSIS_KEY = "bi_diagnosis_class";

export type DiagnosisClass =
  | "healthy" | "repair_dns" | "investigate_reputation" | "consider_replacement" | "inconclusive";

export function rememberLanding() {
  try {
    if (!sessionStorage.getItem(LANDING_KEY)) sessionStorage.setItem(LANDING_KEY, location.pathname);
  } catch { /* storage blocked */ }
}

export function rememberDiagnosis(c: DiagnosisClass) {
  try { sessionStorage.setItem(DIAGNOSIS_KEY, c); } catch { /* storage blocked */ }
}

export function lastDiagnosis(): string | undefined {
  try { return sessionStorage.getItem(DIAGNOSIS_KEY) ?? undefined; } catch { return undefined; }
}

export function track(name: string, params: Params = {}) {
  let landing_path: string | undefined;
  try { landing_path = sessionStorage.getItem(LANDING_KEY) ?? undefined; } catch { /* storage blocked */ }
  try { window.gtag?.("event", name, { landing_path, ...params }); } catch { /* never break the page */ }
}
