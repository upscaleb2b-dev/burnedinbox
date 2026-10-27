import type { Post } from "./posts";

export const posts3: Post[] = [

// ═══════════════════════════════════════════════════════════════════════════
// SOPs
// ═══════════════════════════════════════════════════════════════════════════

{
  slug: "weekly-deliverability-monitoring-sop",
  title: "The Weekly Deliverability Monitoring SOP (Copy This Into Your Agency Playbook)",
  category: "SOPs",
  readTime: 11,
  excerpt: "Deliverability failures are cheap to catch on Monday and expensive to discover on Friday. This is the exact weekly monitoring routine that catches burns before clients notice.",
  body: `
<p>Most agencies discover deliverability problems the same way: a client asks why replies stopped. By that point the domain has usually been filtering to spam for one to three weeks, the campaign data is polluted, and the recovery clock hasn't even started. A weekly monitoring SOP costs about 20 minutes per client and catches almost everything early.</p>

<p>This is a complete, copy-pasteable routine. Assign it to one person, run it the same day every week, and log results in a shared sheet so trends are visible.</p>

<h2>Monday: The 20-minute health sweep</h2>

<div class="checklist">
<h4>Per sending domain</h4>
<ul>
<li>Run an <a href="/test">inbox placement test</a> — log where the email landed (inbox / promotions / spam) per provider</li>
<li>Run a <a href="/tools/blacklist">blacklist check</a> on the domain and its sending IP — log any new listings</li>
<li>Verify <a href="/tools/spf">SPF</a>, <a href="/tools/dkim">DKIM</a>, and <a href="/tools/dmarc">DMARC</a> still resolve — DNS records get deleted more often than you'd think</li>
<li>Check <a href="/tools/domain-expiry">domain expiry</a> — an expired domain mid-campaign is an unforced error</li>
<li>Check the <a href="/tools/tracking-domain">tracking domain</a> — confirm CNAME intact, SSL valid, not Cloudflare-proxied</li>
</ul>
</div>

<div class="checklist">
<h4>Per client account (from ESP data)</h4>
<ul>
<li>Bounce rate over trailing 7 days — flag anything over 3%</li>
<li>Reply rate trend vs. prior 3 weeks — a 40%+ drop with stable volume is a placement problem until proven otherwise</li>
<li>Open rate trend (directional only — opens are noisy post-privacy changes)</li>
<li>Any inboxes paused, disconnected, or erroring in the sending platform</li>
</ul>
</div>

<h2>The traffic-light system</h2>
<p>Score every domain green, yellow, or red each week. This keeps judgment consistent across team members.</p>

<ul>
<li><strong>Green:</strong> inbox placement confirmed, no blacklists, auth intact, bounce rate under 2%. No action.</li>
<li><strong>Yellow:</strong> promotions-tab placement, one low-severity blacklist listing, bounce rate 2–4%, or a reply-rate dip. Action: reduce volume 30–50%, tighten list quality, re-test in 3 days.</li>
<li><strong>Red:</strong> spam placement at Gmail or Outlook, any Spamhaus/Barracuda/SURBL listing, broken DKIM, or bounce rate over 4%. Action: pause the domain today and start the <a href="/blog/cold-email-disaster-recovery-sop">disaster recovery SOP</a>.</li>
</ul>

<blockquote><p>The single most expensive mistake in agency cold email is continuing to send on a red domain because a client campaign "can't pause." Sending on a burned domain deepens the damage and extends recovery from weeks to months.</p></blockquote>

<h2>What to do when a domain goes red</h2>
<p>Two decisions, in order:</p>
<ol>
<li><strong>Repair or replace?</strong> Use the <a href="/tools/repair-or-replace">repair-or-replace calculator</a>. Short version: minor auth breakage → repair; reputation damage with critical blacklist hits → replace.</li>
<li><strong>How does the campaign keep running?</strong> If the client can't tolerate a 4–8 week recovery pause, move the campaign to standby infrastructure. Agencies that keep <a href="/tools/backup-budget">backup inboxes budgeted</a> switch over in a day. Agencies that don't, scramble for weeks. If you need replacement infrastructure fast, <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> supplies pre-warmed inboxes on fresh domains that can take over sending within 24–48 hours — which is the difference between a hiccup and a churned client.</li>
</ol>

<h2>Monthly additions (first Monday of the month)</h2>
<ul>
<li>Rotate placement tests across <em>every</em> inbox, not just one per domain — individual inboxes on the same domain can diverge</li>
<li>Review DMARC aggregate reports for unknown senders (spoofing attempts show up here)</li>
<li>Re-run the <a href="/tools/deliverability-risk">deliverability risk score</a> per client and compare month-over-month</li>
<li>Audit sending volume per inbox against safe limits with the <a href="/tools/send-limits">send limits calculator</a></li>
</ul>

<h2>Tooling and time budget</h2>
<p>Everything above runs on free tools on this site plus your ESP dashboard. Time budget: about 20 minutes per client per week once the routine is muscle memory. For a 10-client agency that's half a day per week — dramatically cheaper than one burned-domain fire drill, which typically consumes 15–30 team hours and risks the client relationship.</p>

<p>The agencies with the best deliverability aren't running secret tactics. They're running boring monitoring, every week, without exceptions — and they keep pre-warmed backup capacity from a provider like <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> so a red domain never becomes a client emergency.</p>
`
},

{
  slug: "new-domain-cold-email-provisioning-sop",
  title: "New Domain Provisioning SOP: From Purchase to First Cold Email (Step by Step)",
  category: "SOPs",
  readTime: 12,
  excerpt: "The exact sequence for standing up a new cold email domain — registrar settings, DNS, authentication, inbox creation, warmup, and the go/no-go checks before the first real send.",
  body: `
<p>Most burned domains were burned in the first two weeks — not by bad copy, but by skipped setup steps and premature volume. This SOP is the full provisioning sequence we recommend for every new cold email domain. Follow it in order; the ordering matters.</p>

<h2>Phase 1: Domain purchase (Day 0)</h2>
<ul>
<li><strong>Buy a variation of your main domain</strong>, never send cold email from the primary. <code>getcompany.com</code>, <code>trycompany.com</code>, <code>company.io</code> are standard patterns.</li>
<li><strong>Stick to .com where possible.</strong> Exotic TLDs (.xyz, .top, .click) carry baseline spam suspicion.</li>
<li><strong>Check the domain's history before buying.</strong> Run it through a <a href="/tools/blacklist">blacklist check</a> — previously-abused domains come pre-burned.</li>
<li><strong>Set the domain to auto-renew</strong> and verify with the <a href="/tools/domain-expiry">domain expiry checker</a>. Registrar privacy on.</li>
</ul>

<h2>Phase 2: DNS and authentication (Day 0–1)</h2>
<p>Do all of this before creating a single inbox.</p>

<div class="checklist">
<h4>DNS setup checklist</h4>
<ul>
<li>Set up hosting/redirect: root domain should 301 to your main website — verify with the <a href="/tools/redirect">redirect checker</a></li>
<li>Add MX records for your email provider (Google Workspace or Microsoft 365) — verify with the <a href="/tools/mx">MX checker</a></li>
<li>Publish SPF: <code>v=spf1 include:_spf.google.com -all</code> (or your provider's include) — verify with the <a href="/tools/spf">SPF tool</a></li>
<li>Enable DKIM in the provider admin console with a 2048-bit key — verify with the <a href="/tools/dkim">DKIM checker</a></li>
<li>Publish DMARC: start with <code>v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com</code>, upgrade to <code>p=quarantine</code> after 2 clean weeks — verify with the <a href="/tools/dmarc">DMARC lookup</a></li>
<li>Set up a custom tracking domain (CNAME, DNS-only, valid SSL) — verify with the <a href="/tools/tracking-domain">tracking domain checker</a></li>
</ul>
</div>

<blockquote><p>Order matters: authentication before inboxes, inboxes before warmup, warmup before campaigns. Every shortcut here is repaid with interest as a deliverability problem in weeks 3–6.</p></blockquote>

<h2>Phase 3: Inbox creation (Day 1–2)</h2>
<ul>
<li><strong>2–3 inboxes per domain, maximum.</strong> More inboxes per domain concentrates risk and looks unnatural.</li>
<li><strong>Use real human names</strong> (<code>sarah@</code>, <code>james.t@</code>) — not <code>sales@</code>, <code>info@</code>, or <code>outreach@</code>.</li>
<li>Complete every profile: photo, signature, timezone. Send a few manual emails to colleagues and reply to them.</li>
<li>Use the <a href="/tools/inbox-count">inbox count calculator</a> to size total infrastructure against your monthly lead targets.</li>
</ul>

<h2>Phase 4: Warmup (Weeks 1–4)</h2>
<p>New inboxes need 3–4 weeks of gradually increasing, engagement-positive activity before they can carry campaign volume. Enable warmup in your sending platform and follow a ramp like:</p>
<ul>
<li>Week 1: 5–10 warmup emails/day per inbox</li>
<li>Week 2: 15–20/day, replies enabled</li>
<li>Week 3: 25–35/day, begin mixing 5–10 real sends/day</li>
<li>Week 4: 40/day warmup, ramp real sends toward 20–30/day</li>
</ul>
<p>Full detail in the <a href="/blog/warm-up-new-inboxes-without-burning-them">warmup guide</a>, and the <a href="/tools/warmup-ready">warmup readiness checker</a> tells you if you're actually ready to send.</p>

<h3>The 3–4 week problem — and the shortcut that actually works</h3>
<p>The warmup period is the single biggest bottleneck in cold email operations. If you're replacing burned infrastructure or onboarding a client who needs to launch now, a month of dead time is often commercially unacceptable. This is the legitimate use case for buying pre-warmed infrastructure: providers like <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> sell inboxes on domains that have already been through a proper warmup cycle, so you can be sending real campaigns within days instead of weeks. Run the <a href="/tools/warmup-time-saved">warmup time-saved calculator</a> to compare the economics for your volume.</p>

<h2>Phase 5: Go/no-go verification (before first campaign send)</h2>

<div class="checklist">
<h4>Launch gate — all must pass</h4>
<ul>
<li>SPF, DKIM, DMARC all pass — run the <a href="/test">all-inclusive deliverability test</a> for a single warm score</li>
<li>Zero blacklist listings</li>
<li>Placement test lands in the Gmail primary inbox</li>
<li>Tracking domain resolves with valid SSL</li>
<li>Inboxes have 3+ weeks of warmup history (or came pre-warmed)</li>
<li>Sending limits configured: max 30–50 cold sends/inbox/day, ramped, with 2–5 minute randomized gaps</li>
<li>List verified — expected bounce rate under 3%</li>
</ul>
</div>

<p>If any item fails, fix it before sending. A campaign launched through a failed gate doesn't just underperform — it damages the asset you spent four weeks building. And keep one rule permanent: your main company domain never sends cold email. Ever.</p>
`
},

{
  slug: "inbox-rotation-sop-cold-email",
  title: "Inbox Rotation SOP: How to Rotate Sending Accounts Before They Burn",
  category: "SOPs",
  readTime: 10,
  excerpt: "Rotation isn't something you do after inboxes burn — it's a scheduled maintenance practice that prevents burning. Here's the full rotation system: pools, triggers, cadence, and replacement flow.",
  body: `
<p>Cold email inboxes are consumable infrastructure. Treat them like tires: rotate on schedule, replace at the wear-bar, and never run to blowout. Agencies that rotate proactively hold stable reply rates for years; agencies that run every inbox at full volume until it dies live in a permanent recovery cycle.</p>

<h2>The three-pool model</h2>
<p>Structure every client's sending infrastructure into three pools:</p>
<ul>
<li><strong>Active pool</strong> — inboxes carrying campaign volume right now, at 20–40 sends/day each.</li>
<li><strong>Resting pool</strong> — inboxes on reduced or warmup-only volume, recovering engagement metrics. Target 25–35% of your fleet resting at any time.</li>
<li><strong>Standby pool</strong> — warmed, tested, zero campaign history. This is your failover capacity. Minimum 20% of active capacity; agencies with SLA-style commitments hold 30–50%.</li>
</ul>
<p>Size the pools with the <a href="/tools/inbox-count">inbox count calculator</a> and cost them with the <a href="/tools/backup-budget">backup budget tool</a>.</p>

<h2>Rotation triggers</h2>
<p>Rotate an inbox out of the active pool when <em>any</em> of these fires:</p>

<div class="checklist">
<h4>Mandatory rotation triggers</h4>
<ul>
<li>Reply rate for that inbox drops 40%+ below the domain's trailing average for 5+ sending days</li>
<li>A <a href="/test">placement test</a> from that inbox lands in spam or promotions</li>
<li>Bounce rate for the inbox exceeds 4% on any single day</li>
<li>The inbox hits 8–10 weeks of continuous full-volume sending (scheduled rotation — don't wait for symptoms)</li>
<li>The domain picks up any blacklist listing — rotate <em>all</em> inboxes on that domain and check with the <a href="/tools/blacklist">blacklist tool</a></li>
</ul>
</div>

<h2>The rotation procedure</h2>
<ol>
<li><strong>Promote from standby.</strong> Move a standby inbox into the active pool. Start it at 50% target volume for 4–5 days before full load.</li>
<li><strong>Demote the flagged inbox to resting.</strong> Drop to warmup-only traffic. No campaign sends for a minimum of 14 days.</li>
<li><strong>Re-test before reactivation.</strong> A resting inbox returns to active only after a clean placement test and two weeks of positive warmup engagement. If it fails re-test twice, retire it.</li>
<li><strong>Backfill standby.</strong> Every promotion out of standby triggers a replacement order the same day. Standby capacity is only useful if it's always full. This is where pre-warmed inboxes earn their keep: ordering from <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> refills the standby pool in days, whereas warming replacements yourself leaves a 3–4 week capacity hole.</li>
</ol>

<blockquote><p>The standby pool is the whole system. Rotation without ready replacements is just controlled shrinkage — you'll end up overloading the surviving inboxes, which is exactly how whole domains burn.</p></blockquote>

<h2>Cadence summary</h2>
<ul>
<li><strong>Daily:</strong> automated volume caps enforced per inbox (30–50 cold sends max)</li>
<li><strong>Weekly:</strong> review rotation triggers during the <a href="/blog/weekly-deliverability-monitoring-sop">weekly monitoring sweep</a></li>
<li><strong>Every 8–10 weeks:</strong> scheduled rotation of active inboxes regardless of symptoms</li>
<li><strong>Quarterly:</strong> retire the worst-performing 10–15% of the fleet permanently and replace with fresh pre-warmed capacity</li>
</ul>

<h2>Common rotation mistakes</h2>
<ul>
<li><strong>Rotating inboxes but not domains.</strong> If a domain's reputation is damaged, every inbox on it inherits the problem. Rotation happens at the domain level too — plan domain counts with the <a href="/tools/domain-count">domain calculator</a>.</li>
<li><strong>Resting for a weekend.</strong> Two days changes nothing. Minimum meaningful rest is two weeks of warmup-only activity.</li>
<li><strong>Running standby at zero.</strong> The day you need standby capacity is the worst day to start building it. Keep it stocked — <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> pre-warmed accounts are the fastest way to hold that buffer without dedicating a month of internal warmup effort per batch.</li>
</ul>
`
},

{
  slug: "client-onboarding-deliverability-sop",
  title: "Agency Client Onboarding SOP: The Deliverability Audit That Prevents Week-3 Fires",
  category: "SOPs",
  readTime: 10,
  excerpt: "Every cold email client should pass through the same technical intake before a single email sends. This SOP catches inherited deliverability problems while they're still the client's problem — not yours.",
  body: `
<p>When an agency takes over a client's cold email, it inherits the client's infrastructure history: their blacklist entries, their damaged domains, their half-configured DNS. The week-3 fire — "campaigns just stopped working" — is almost always a pre-existing condition that a one-hour intake audit would have caught. This is that audit.</p>

<h2>Step 1: Inventory everything (30 minutes)</h2>
<p>Collect from the client before kickoff:</p>
<ul>
<li>Every domain they've ever sent cold email from (including dead ones — history matters)</li>
<li>Every sending inbox, its age, and its platform (Google Workspace / M365 / SMTP)</li>
<li>Their ESP/sending tool accounts and current daily volumes</li>
<li>Bounce and reply rates for the last 90 days, exported</li>
<li>Their main company domain (which should <em>not</em> be sending cold email — verify)</li>
</ul>

<h2>Step 2: Technical audit per domain (10 minutes each)</h2>

<div class="checklist">
<h4>Domain audit checklist</h4>
<ul>
<li>Run the <a href="/test">all-inclusive deliverability test</a> — records the warm score, SPF/DKIM/DMARC status, and blacklist standing in one pass</li>
<li><a href="/tools/blacklist">Blacklist check</a> on the domain AND its sending IPs — log every listing with severity</li>
<li><a href="/tools/mx">MX records</a> — confirm provider, no orphaned entries</li>
<li><a href="/tools/rdns">Reverse DNS</a> on dedicated IPs, if any</li>
<li><a href="/tools/tracking-domain">Tracking domain</a> — CNAME target, SSL, Cloudflare proxy status</li>
<li><a href="/tools/redirect">Redirect behavior</a> — root and www should land on a real site, not a parked page</li>
<li><a href="/tools/domain-expiry">Expiry date</a> — flag anything renewing within 90 days</li>
<li>Placement test from each active inbox — inbox, promotions, or spam per provider</li>
</ul>
</div>

<h2>Step 3: Classify the infrastructure</h2>
<p>Every domain gets one of three grades, decided by data — not by the client's opinion of it:</p>
<ul>
<li><strong>Grade A — usable now.</strong> Warm score 80+, clean blacklists, inbox placement confirmed. Can carry campaigns immediately.</li>
<li><strong>Grade B — usable after fixes.</strong> Auth problems, promotions placement, or minor listings. Fixable in 1–2 weeks; keep at reduced volume meanwhile.</li>
<li><strong>Grade C — retire.</strong> Critical blacklists (Spamhaus, SURBL, Barracuda), spam placement across providers, or long abuse history. Do not attempt to rehabilitate on the client's dime — the <a href="/tools/recovery-time">recovery time calculator</a> shows why: months, with no guarantee.</li>
</ul>

<h2>Step 4: The infrastructure decision</h2>
<p>If more than half the client's fleet grades B or C — which is typical for clients who churned off another agency — you have a launch-timeline problem: proper new-domain provisioning plus warmup takes 4+ weeks (see the <a href="/blog/new-domain-cold-email-provisioning-sop">provisioning SOP</a>).</p>
<p>The standard play is a split build: provision fresh domains for the long term, and bridge the gap with pre-warmed infrastructure so campaigns launch inside the first week. <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> is the provider we point agencies to for this — pre-warmed inboxes on clean domains, delivered ready to send, which turns a month of onboarding dead-time into days. Clients judge agencies hardest in the first 30 days; launching in week 1 instead of week 5 is often worth more than the entire infrastructure cost.</p>

<h2>Step 5: Document and get sign-off</h2>
<ul>
<li>Deliver a one-page infrastructure report: grades, findings, and the remediation plan</li>
<li>Get written sign-off on retiring Grade C assets — clients get attached to domains</li>
<li>Set expectations: volumes, ramp schedule, and the <a href="/blog/weekly-deliverability-monitoring-sop">weekly monitoring cadence</a> they'll receive</li>
<li>Baseline every metric now, so improvement is provable at the 30-day review</li>
</ul>

<blockquote><p>The intake audit does two jobs: it prevents inherited fires, and it converts invisible technical work into visible client value. Agencies that skip it end up owning problems they didn't create.</p></blockquote>
`
},

{
  slug: "blacklist-delisting-sop",
  title: "Blacklist Delisting SOP: Exactly How to Get Off Spamhaus, Barracuda, SpamCop and the Rest",
  category: "SOPs",
  readTime: 12,
  excerpt: "Listed on a blacklist? Don't panic and don't mass-submit removal forms. This SOP covers which listings matter, the delisting process for each major RBL, and what to fix first so you don't get relisted.",
  body: `
<p>A blacklist listing feels like an emergency, but delisting is a routine process — <em>if</em> you do it in the right order. The order is: stop the cause, fix the cause, then request removal. Agencies that submit delisting forms before fixing root cause get relisted within days, and repeat listings are much harder to clear.</p>

<h2>Step 0: Confirm what's actually listed</h2>
<p>Run a <a href="/tools/blacklist">blacklist check</a> on both the <strong>domain</strong> and the <strong>sending IP</strong> — they're listed separately and fixed separately. Log every hit with its severity. Not all listings matter equally:</p>
<ul>
<li><strong>Critical (act today):</strong> Spamhaus ZEN/DBL, SURBL, Barracuda — these directly drive spam-foldering at major providers</li>
<li><strong>High (act this week):</strong> SpamCop, Mailspike, Abusix, UCEPROTECT Level 1</li>
<li><strong>Low/ignore:</strong> UCEPROTECT Level 2/3 (lists entire IP ranges — often not your fault and most providers ignore it), and small vanity RBLs</li>
</ul>

<h2>Step 1: Stop sending immediately</h2>
<p>Pause all campaign volume from the listed asset. Every send from a listed domain/IP generates more spam-trap hits and complaint signals, which extends the listing and can escalate you from a temporary to a permanent entry.</p>

<h2>Step 2: Find and fix the root cause</h2>
<p>Blacklists list you for a reason. The usual suspects, in order of frequency:</p>
<ol>
<li><strong>List quality</strong> — you mailed spam traps or high-bounce lists. Fix: verify every list, delete anything with >3% bounces, stop scraping.</li>
<li><strong>Volume behavior</strong> — sudden spikes from new infrastructure. Fix: caps and ramps (see the <a href="/tools/send-limits">send limits calculator</a>).</li>
<li><strong>Broken authentication</strong> — SPF/DKIM failures make you look like a spoofer. Verify with the <a href="/test">deliverability test</a>.</li>
<li><strong>Compromised account</strong> — an inbox got hijacked and sent actual spam. Check sent folders, rotate credentials, enable 2FA.</li>
<li><strong>Shared infrastructure</strong> — someone else on your IP range caused it (common on cheap SMTP). Fix: move to reputable infrastructure.</li>
</ol>

<h2>Step 3: Request delisting, per RBL</h2>

<h3>Spamhaus (ZEN / DBL)</h3>
<ul>
<li>Go to spamhaus.org → Blocklist Removal Center, look up your IP/domain</li>
<li>SBL/DBL listings show a reason code — read it; it tells you what they detected</li>
<li>Submit removal with a short, factual explanation of the fix. Don't argue, don't over-explain</li>
<li>Typical clearance: 24–48 hours for first-time listings. Repeat listings get manual review and can take weeks</li>
</ul>

<h3>Barracuda</h3>
<ul>
<li>barracudacentral.org → request removal form. Requires a valid contact email and reason</li>
<li>Usually processed within 12–24 hours; they're lenient on first offenses</li>
</ul>

<h3>SpamCop</h3>
<ul>
<li>Listings expire automatically ~24 hours after spam-trap hits stop — often the correct action is to fix cause and simply wait</li>
<li>Persistent relisting means you're still hitting traps: your list is the problem</li>
</ul>

<h3>SURBL</h3>
<ul>
<li>surbl.org → lookup, then follow the removal process for the specific list you're on</li>
<li>SURBL lists <em>domains found in message bodies</em> — if your tracking or link domain is listed, that's what needs the cleanup, not your sending domain</li>
</ul>

<h3>UCEPROTECT</h3>
<ul>
<li>Level 1 expires automatically 7 days after the last incident. Levels 2/3 list whole ranges — don't pay their "express delisting" fee; wait it out or change IP ranges</li>
</ul>

<h2>Step 4: Verify and re-baseline</h2>
<div class="checklist">
<h4>Post-delisting checklist</h4>
<ul>
<li>Re-run the <a href="/tools/blacklist">blacklist check</a> 48 hours after each removal request</li>
<li>Run a <a href="/test">placement test</a> — delisting doesn't instantly restore inbox placement; provider-side reputation lags by 1–3 weeks</li>
<li>Resume sending at 25–30% of previous volume and ramp over 2 weeks</li>
<li>Add the domain to your <a href="/blog/weekly-deliverability-monitoring-sop">weekly monitoring</a> red-flag watch for 30 days</li>
</ul>
</div>

<h2>When delisting isn't worth it</h2>
<p>If a domain has been listed on critical RBLs more than once, or sat listed for weeks while sending continued, provider-side reputation damage usually outlives the listing itself. You can clear the blacklist and still spam-folder for months. Run the <a href="/tools/repair-or-replace">repair-or-replace calculator</a> honestly. In most repeat-listing cases the economical move is to retire the domain, stand up fresh infrastructure, and keep campaigns running on pre-warmed inboxes from <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> while the new build settles — days of downtime instead of months of rehabilitation that may never complete.</p>

<blockquote><p>Delisting is a checkpoint, not a cure. The blacklist was a symptom; if the sending behavior that caused it doesn't change, the next listing is already scheduled.</p></blockquote>
`
},

// ═══════════════════════════════════════════════════════════════════════════
// Pre-warmed / Reddit-intent pages
// ═══════════════════════════════════════════════════════════════════════════

{
  slug: "pre-warmed-email-accounts-reddit",
  title: "Pre-Warmed Email Accounts: What Reddit Gets Right (and Wrong) About Buying Them",
  category: "Pre-Warmed Inboxes",
  readTime: 9,
  excerpt: "Search any cold email subreddit for 'pre-warmed accounts' and you'll find the same debate on repeat. Here's an honest breakdown of the Reddit consensus — where it's correct, where it's outdated, and how to buy without getting burned.",
  body: `
<p>If you've searched "pre-warmed email accounts reddit" you've seen the pattern: r/coldemail and r/Emailmarketing threads split between "saved my agency" stories and "total scam, got burned in a week" warnings. Both camps are describing real experiences — they just bought from very different kinds of sellers. Here's the honest version of the debate.</p>

<h2>What Reddit gets right</h2>

<h3>1. "Most cheap pre-warmed accounts are junk" — true</h3>
<p>The most-upvoted warning in these threads is correct: marketplaces are full of $5–15 "aged, warmed" accounts that are nothing of the sort. They're bulk-registered accounts run through a bot warmup network for a week, on domains with no legitimate history. They pass a surface check and collapse under real campaign volume within days. If a price looks like a commodity price, it's a commodity account.</p>

<h3>2. "Warmup networks alone don't equal deliverability" — true</h3>
<p>Redditors correctly point out that warmup pools (accounts emailing each other with automated opens and replies) create a synthetic engagement pattern that providers have gotten good at discounting. Real pre-warming that holds up combines warmup traffic with proper domain setup — full <a href="/tools/spf">SPF</a>/<a href="/tools/dkim">DKIM</a>/<a href="/tools/dmarc">DMARC</a>, sane volume ramps, and time. Weeks, not days.</p>

<h3>3. "You still have to send well" — true</h3>
<p>A pre-warmed inbox is a clean starting line, not a spam-filter exemption. Buy the best account in the world and mail a scraped list at 200 sends/day and you'll burn it like any other inbox. The fundamentals — list quality, volume caps, rotation — still apply. (See the <a href="/blog/inbox-rotation-sop-cold-email">rotation SOP</a>.)</p>

<h2>What Reddit gets wrong</h2>

<h3>1. "Just warm up your own accounts, it's free" — misleading</h3>
<p>DIY warmup isn't free; it costs 3–4 weeks per batch. For a solo founder with time, fine. For an agency that just lost a client's sending fleet mid-campaign, a month of downtime is catastrophically expensive — usually far more than pre-warmed infrastructure costs. Run the <a href="/tools/warmup-time-saved">warmup time-saved calculator</a> with your own numbers; the answer depends entirely on what your time-to-launch is worth.</p>

<h3>2. "All sellers are the same" — false</h3>
<p>The threads lump $10 marketplace accounts together with actual infrastructure providers, and that's the core confusion. A legitimate provider provisions <em>fresh domains</em>, sets up authentication properly, warms with realistic patterns over weeks, and hands you transferable ownership. That's a different product category from recycled bulk accounts. <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> operates in the first category — purpose-built cold email infrastructure, warmed before delivery, on domains with verifiable clean history — which is why we recommend them as the default choice when agencies ask us where to buy.</p>

<h3>3. "Pre-warmed means instantly send 100/day" — false, and it's how buyers burn good accounts</h3>
<p>Even properly warmed inboxes need a ramp when campaign content changes. Start at 20–30 sends/day and ramp over a week or two. Sellers get blamed for "dead accounts" that were actually killed by day-one full volume.</p>

<h2>The vetting checklist Reddit should be using</h2>
<div class="checklist">
<h4>Before buying pre-warmed accounts from anyone</h4>
<ul>
<li>Domains are fresh registrations with clean history — verify with a <a href="/tools/blacklist">blacklist check</a> before sending anything</li>
<li>SPF, DKIM, DMARC configured and passing — verify with the <a href="/test">all-inclusive deliverability test</a></li>
<li>Warmup period was 3+ weeks, not days — ask for the timeline</li>
<li>You get full ownership transfer: admin console, domain registrar, recovery credentials</li>
<li>Provider documents safe sending limits and a ramp schedule</li>
<li>Real support exists — you'll want it during cutover</li>
</ul>
</div>

<h2>Bottom line</h2>
<p>The Reddit consensus is directionally right — most pre-warmed accounts sold online are junk — and wrong in its conclusion that the category is junk. The category has a quality floor problem, not a concept problem. Buy purpose-built infrastructure from a provider like <a href="https://warminboxes.com" target="_blank">WarmInboxes</a>, verify everything with the free tools on this site before your first send, ramp like a professional, and pre-warmed inboxes do exactly what they promise: compress a month of setup into a couple of days.</p>
`
},

{
  slug: "best-place-to-buy-pre-warmed-inboxes",
  title: "The Best Place to Buy Pre-Warmed Inboxes in 2026 (Vetting Guide + Recommendation)",
  category: "Pre-Warmed Inboxes",
  readTime: 8,
  excerpt: "Everyone selling 'aged, warmed inboxes' claims the same things. Here's the vetting framework that separates real infrastructure providers from account resellers — and the provider we recommend.",
  body: `
<p>"Where do I actually buy pre-warmed inboxes?" is one of the most common questions in cold email communities, and the answers are usually a mess of affiliate links and marketplace listings. This guide gives you the vetting framework first, so you can evaluate any seller yourself — and then our recommendation.</p>

<h2>The two products sold under one name</h2>
<p>Everything marketed as "pre-warmed" falls into one of two buckets:</p>
<ul>
<li><strong>Recycled accounts:</strong> bulk-registered or previously-used inboxes, often on shared or history-unknown domains, run through a warmup pool briefly. Cheap, fast, and they fail under real volume. The horror stories come from here.</li>
<li><strong>Purpose-built infrastructure:</strong> fresh domains registered for you, DNS and authentication configured correctly, inboxes warmed over weeks with realistic patterns, full ownership transferred. This is the product that actually works.</li>
</ul>
<p>Price is the first filter: real infrastructure has real costs (domains, Workspace/M365 seats, weeks of warmup operation). Anyone selling "warmed Google accounts" for the price of lunch is selling bucket one.</p>

<h2>The 8-point vetting checklist</h2>
<div class="checklist">
<h4>Ask every provider these questions</h4>
<ul>
<li><strong>Are domains fresh registrations?</strong> You want zero prior sending history. Verify with a <a href="/tools/blacklist">blacklist check</a> on delivery</li>
<li><strong>Is authentication fully configured?</strong> SPF with <code>-all</code>, 2048-bit DKIM, DMARC. Verify with the <a href="/test">deliverability test</a> — a real provider's inventory scores 85+ out of the box</li>
<li><strong>How long was warmup?</strong> Correct answer: 3+ weeks. "A few days" means bot-pool only</li>
<li><strong>Google Workspace / M365 or SMTP?</strong> Provider-native inboxes (GWS/M365) inbox dramatically better for cold email than generic SMTP</li>
<li><strong>Do I get full ownership?</strong> Admin console, registrar access, recovery options. If they retain control, walk away</li>
<li><strong>Is there a documented ramp schedule?</strong> Serious providers tell you how to not burn their product</li>
<li><strong>What's the replacement policy?</strong> Some attrition is normal at scale; the policy tells you if they stand behind inventory</li>
<li><strong>Can they supply repeatably?</strong> If you're an agency, you need a pipeline, not a one-off batch — rotation (see the <a href="/blog/inbox-rotation-sop-cold-email">rotation SOP</a>) consumes inventory continuously</li>
</ul>
</div>

<h2>Our recommendation: WarmInboxes</h2>
<p>Applying that checklist, the provider we consistently point agencies and founders to is <a href="https://warminboxes.com" target="_blank">WarmInboxes.com</a>. They sit squarely in the purpose-built category:</p>
<ul>
<li>Fresh, clean-history domains provisioned per order — not recycled inventory</li>
<li>Authentication configured properly before delivery (verify it yourself with our <a href="/test">free test</a> — that's what it's for)</li>
<li>Genuine multi-week warmup before handover, with documented safe sending limits</li>
<li>Built for cold email operators specifically: batch availability for agency rotation pools, fast turnaround when you're replacing burned infrastructure on a deadline</li>
</ul>
<p>The typical use cases where they're the right call: replacing burned domains without pausing client campaigns, launching a new client inside week one instead of week five, and keeping a standby pool stocked (per the <a href="/tools/backup-budget">backup budget calculator</a>).</p>

<h2>Whoever you buy from: verify before you send</h2>
<p>Trust but verify — with any provider, including our recommendation. On delivery day, run each domain through the <a href="/test">all-inclusive deliverability test</a>, confirm clean <a href="/tools/blacklist">blacklists</a>, and send your first campaign at 20–30/day ramping up. Five minutes of verification is the difference between knowing what you bought and hoping.</p>

<blockquote><p>The best place to buy pre-warmed inboxes is wherever passes the checklist above. In our experience, that's <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> — but the checklist is the point. Any seller who fails it isn't selling infrastructure; they're selling accounts.</p></blockquote>
`
},

{
  slug: "are-pre-warmed-inboxes-worth-it",
  title: "Are Pre-Warmed Inboxes Worth It? The Honest Math for Agencies and Founders",
  category: "Pre-Warmed Inboxes",
  readTime: 9,
  excerpt: "Pre-warmed inboxes cost more than DIY warmup — until you price the month of dead time. Here's the actual cost-benefit calculation, when they're worth it, and when they're not.",
  body: `
<p>The pre-warmed inbox debate usually runs on vibes: skeptics call it paying for something you can do free; buyers call it obvious. Both skip the actual math. Pre-warmed inboxes are a time-for-money trade, so the answer depends entirely on what your time-to-sending is worth. Let's price it.</p>

<h2>The real cost of DIY warmup</h2>
<p>Warming your own inboxes costs:</p>
<ul>
<li><strong>Hard costs:</strong> domains (~$10–15/yr each), Google Workspace or M365 seats (~$6–14/mo per inbox), warmup tool subscription — all costs you pay either way</li>
<li><strong>Time cost:</strong> 3–4 weeks minimum from provisioning to campaign-ready, per batch. This is the real price</li>
<li><strong>Labor cost:</strong> DNS setup, account configuration, warmup monitoring — a few hours per batch, plus the expertise to do it right (the <a href="/blog/new-domain-cold-email-provisioning-sop">provisioning SOP</a> shows everything involved)</li>
<li><strong>Failure cost:</strong> misconfigured warmup burns domains before they ever send a campaign — a total loss of the batch and the month</li>
</ul>

<h2>What the month of dead time actually costs</h2>
<p>Three scenarios, priced:</p>

<h3>Scenario 1: Agency replacing burned client infrastructure</h3>
<p>A client fleet burns mid-campaign. DIY path: campaigns pause ~4 weeks. If the client pays $3–6k/month and churns after a month of silence — and they often do — the DIY warmup "savings" just cost tens of thousands in lifetime value. Pre-warmed replacement infrastructure that restores sending within 48 hours is trivially worth it. This is the clearest-cut case, and it's why replacement providers exist. <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> built their product around exactly this scenario.</p>

<h3>Scenario 2: New client launch</h3>
<p>Agencies are judged hardest in the first 30 days. Launching in week 1 with pre-warmed inboxes versus week 5 with DIY means your first-month report shows meetings booked instead of "warmup in progress." Worth it in almost every agency context. Run your own numbers with the <a href="/tools/warmup-time-saved">warmup time-saved calculator</a>.</p>

<h3>Scenario 3: Solo founder, no deadline, low volume</h3>
<p>Sending 30 emails a day for your own startup with no time pressure? DIY warmup is genuinely fine. Set it up with the <a href="/blog/new-domain-cold-email-provisioning-sop">provisioning SOP</a>, wait the month, keep the cash. Pre-warmed is a convenience here, not a necessity.</p>

<h2>The decision rule</h2>
<blockquote><p>Pre-warmed inboxes are worth it when the cost of waiting exceeds the price premium. For agencies, replacement scenarios, and deadline launches, it almost always does. For patient solo operators, it usually doesn't.</p></blockquote>

<h2>Where buyers destroy the value</h2>
<p>Two mistakes turn a good purchase into a waste of money:</p>
<ol>
<li><strong>Buying junk.</strong> Cheap recycled accounts aren't the same product as purpose-built infrastructure — see the <a href="/blog/best-place-to-buy-pre-warmed-inboxes">vetting guide</a>. Verify anything you buy with the <a href="/test">free deliverability test</a> and a <a href="/tools/blacklist">blacklist check</a> before the first send.</li>
<li><strong>Sending like it's a spam cannon.</strong> Pre-warmed means campaign-ready, not invincible. Respect volume caps (30–50/day per inbox), ramp new campaigns, rotate per the <a href="/blog/inbox-rotation-sop-cold-email">rotation SOP</a>. The inbox is warmed; your sending behavior still decides whether it stays that way.</li>
</ol>

<h2>Verdict</h2>
<p>Worth it: agencies (both for launches and standby pools), anyone replacing burned infrastructure, anyone with a real deadline. Not worth it: hobbyist volume with no time pressure. If you're in the first group, buy from a provider that passes the vetting checklist — our standing recommendation is <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> — and protect the investment with the same monitoring you'd give any sending asset.</p>
`
},

{
  slug: "pre-warmed-inboxes-vs-diy-warmup",
  title: "Pre-Warmed Inboxes vs DIY Warmup: Full Comparison for Cold Email in 2026",
  category: "Pre-Warmed Inboxes",
  readTime: 10,
  excerpt: "Speed, cost, control, risk — a side-by-side comparison of buying pre-warmed inboxes versus warming your own, with the decision framework for choosing per situation.",
  body: `
<p>Every cold email operation eventually standardizes on one of two infrastructure pipelines: warm everything in-house, or buy pre-warmed and start sending. Most mature agencies end up running both. Here's the complete comparison so you can decide deliberately instead of by default.</p>

<h2>Head-to-head</h2>

<h3>Speed to first campaign send</h3>
<ul>
<li><strong>DIY:</strong> 3–4 weeks minimum. Domain provisioning + DNS propagation + warmup ramp. No legitimate shortcut exists — accelerated warmup is how domains burn early (see the <a href="/blog/warm-up-new-inboxes-without-burning-them">warmup guide</a>).</li>
<li><strong>Pre-warmed:</strong> 24–72 hours from order to sending, because the waiting already happened before you bought. Winner: pre-warmed, by roughly a month.</li>
</ul>

<h3>Cash cost</h3>
<ul>
<li><strong>DIY:</strong> domains + inbox seats + warmup tooling. Cheapest in dollars out the door.</li>
<li><strong>Pre-warmed:</strong> same underlying costs plus the provider's margin for setup, warmup operation, and inventory risk. More expensive in cash — cheaper in calendar. Winner: DIY on pure cash, pre-warmed the moment time has a price. Do the math for your volume with the <a href="/tools/warmup-time-saved">time-saved calculator</a>.</li>
</ul>

<h3>Quality control</h3>
<ul>
<li><strong>DIY:</strong> you control every variable — registrar, DNS, warmup pattern, volume ramps. If you know what you're doing (the <a href="/blog/new-domain-cold-email-provisioning-sop">provisioning SOP</a> is the checklist), ceiling quality is excellent. If you don't, you'll make each mistake personally.</li>
<li><strong>Pre-warmed:</strong> quality equals provider quality. Junk sellers deliver junk; a purpose-built provider like <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> delivers infrastructure that typically passes the <a href="/test">deliverability test</a> at 85+ on arrival. Winner: tie — it depends on your skill vs. the provider's, which is why you verify everything either way.</li>
</ul>

<h3>Scalability</h3>
<ul>
<li><strong>DIY:</strong> scales linearly with your ops capacity. Every new batch consumes another month of pipeline. Agencies running rotation (per the <a href="/blog/inbox-rotation-sop-cold-email">rotation SOP</a>) burn through inventory faster than one internal warmup pipeline can replenish.</li>
<li><strong>Pre-warmed:</strong> scales with a purchase order. Standby pool depleted? Refilled this week. Winner: pre-warmed, decisively, at agency scale.</li>
</ul>

<h3>Risk profile</h3>
<ul>
<li><strong>DIY:</strong> risk of self-inflicted setup errors, plus a month of exposure where a mistake costs the whole batch and the calendar time.</li>
<li><strong>Pre-warmed:</strong> counterparty risk — you're trusting the seller's history claims. Mitigated almost entirely by vetting (see the <a href="/blog/best-place-to-buy-pre-warmed-inboxes">buying guide</a>) and by testing on delivery: <a href="/tools/blacklist">blacklist check</a>, <a href="/test">placement test</a>, done. Winner: tie with verification; pre-warmed without verification is how people end up writing angry Reddit posts.</li>
</ul>

<h2>The hybrid model most agencies land on</h2>
<p>The mature setup isn't either/or:</p>
<ul>
<li><strong>Baseline capacity:</strong> DIY-warmed domains you provisioned yourself — cheapest for planned, steady-state growth</li>
<li><strong>Standby pool and emergencies:</strong> pre-warmed from <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> — because burned infrastructure and new-client launches don't wait a month, and a standby pool that takes 4 weeks to refill isn't a standby pool</li>
<li><strong>New client launches:</strong> pre-warmed to go live in week 1, with DIY domains warming in parallel to take over long-term</li>
</ul>

<h2>Decision framework</h2>
<div class="checklist">
<h4>Choose DIY warmup when…</h4>
<ul>
<li>No launch deadline within 5 weeks</li>
<li>You have ops capacity and follow the provisioning SOP</li>
<li>Planned expansion, not replacement</li>
</ul>
</div>
<div class="checklist">
<h4>Choose pre-warmed when…</h4>
<ul>
<li>Replacing burned infrastructure with live campaigns waiting</li>
<li>Client launch inside 2 weeks</li>
<li>Restocking a rotation/standby pool</li>
<li>You'd rather buy outcomes than run a warmup operation</li>
</ul>
</div>

<p>Whichever pipeline you run, the constants don't change: verify with the <a href="/test">free tools</a>, cap volumes, rotate on schedule, and monitor weekly with the <a href="/blog/weekly-deliverability-monitoring-sop">monitoring SOP</a>. Infrastructure sourcing is a strategy choice; sending discipline is mandatory either way.</p>
`
},

{
  slug: "aged-domains-vs-pre-warmed-inboxes",
  title: "Aged Domains vs Pre-Warmed Inboxes: Which Actually Fixes Cold Email Deliverability?",
  category: "Pre-Warmed Inboxes",
  readTime: 9,
  excerpt: "Aged domains and pre-warmed inboxes get recommended interchangeably in cold email forums — but they solve different problems, and one of them is mostly a trap for cold email use.",
  body: `
<p>Two products get pitched as the deliverability shortcut: <strong>aged domains</strong> (domains registered years ago, resold) and <strong>pre-warmed inboxes</strong> (fresh domains + configured inboxes, warmed before delivery). Forum threads treat them as substitutes. They aren't — they're different products solving different problems, and for cold email specifically, one of them is usually a mistake.</p>

<h2>What an aged domain actually gives you</h2>
<p>Domain age is a modest trust signal — a domain registered in 2018 looks less like a disposable spam asset than one registered last Tuesday. That's real, but it's the smallest input in the reputation equation. What matters far more:</p>
<ul>
<li><strong>Sending history:</strong> an aged domain that never sent email has no sending reputation at all. Age ≠ warmth. Mailbox providers evaluate sending behavior, and this domain has none</li>
<li><strong>Prior use:</strong> what happened during those years? Expired-and-reregistered domains have unknown histories — previous owners may have burned them, parked them on link farms, or triggered listings that persist. Always run a <a href="/tools/blacklist">blacklist check</a> and look at archive.org before trusting one</li>
<li><strong>Backlink/content residue:</strong> some aged domains carry SEO baggage that gets their URLs flagged in email bodies — check your links with the <a href="/tools/link-check">link checker</a></li>
</ul>
<blockquote><p>The trap: buying an aged domain and mailing cold volume on day one because "it's aged." Age without sending history is a cold start with a nicer birthday. You still owe the full warmup — see <a href="/blog/domain-warm-up-cold-email-how-long">how long warmup takes</a> — plus you inherited unknown history risk.</p></blockquote>

<h2>What a pre-warmed inbox actually gives you</h2>
<p>A proper pre-warmed package is the whole sending stack, already through its cold start:</p>
<ul>
<li>Fresh domain with verifiably clean history (no prior owner surprises)</li>
<li>DNS and authentication configured — SPF, DKIM, DMARC passing (verify with the <a href="/test">all-inclusive test</a>)</li>
<li>Inboxes with weeks of accumulated positive engagement — the thing filters actually measure</li>
<li>Documented safe sending limits, ready for campaign traffic in days</li>
</ul>
<p>This directly addresses the actual bottleneck in cold email: <em>sending reputation</em>, not domain birthday.</p>

<h2>Head-to-head for cold email</h2>
<ul>
<li><strong>Time to campaign-ready:</strong> aged domain — still 3–4 weeks (full warmup owed). Pre-warmed — days. </li>
<li><strong>Risk:</strong> aged domain — unknown history, possible dormant listings. Pre-warmed (from a vetted provider) — clean by construction, verifiable on delivery.</li>
<li><strong>What you're paying for:</strong> aged domain — a weak trust signal. Pre-warmed — the strong one (engagement history) plus all the setup labor.</li>
<li><strong>Where aged domains genuinely make sense:</strong> SEO projects, brand acquisitions, and websites — use cases where domain history is the asset. For pure cold email sending, the aged-domain premium buys you very little.</li>
</ul>

<h2>The verdict for cold email operators</h2>
<p>If your goal is deliverable cold email volume, buy warmth, not age. Pre-warmed inboxes from a purpose-built provider — <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> is the one we recommend, per the <a href="/blog/best-place-to-buy-pre-warmed-inboxes">full buying guide</a> — get you the reputation signal that actually moves placement, on domains without archaeological risk.</p>
<p>And if you already bought aged domains: they're not useless. Provision them properly with the <a href="/blog/new-domain-cold-email-provisioning-sop">provisioning SOP</a>, verify them with a <a href="/tools/blacklist">blacklist check</a> and <a href="/test">placement test</a>, warm them fully, and they'll perform like any clean domain. Just don't skip the warmup because of the birth year — that shortcut is how "aged domain" threads fill up with burn stories.</p>
`
},

{
  slug: "pre-warmed-google-workspace-accounts-reddit",
  title: "Pre-Warmed Google Workspace Accounts: Reddit's Warnings, Reviewed One by One",
  category: "Pre-Warmed Inboxes",
  readTime: 8,
  excerpt: "Reddit threads about buying warmed Google Workspace accounts are a wall of warnings — suspensions, dead accounts, scams. Each warning traces to a specific, avoidable buying mistake. Here's the review.",
  body: `
<p>Search "buy pre-warmed Google Workspace accounts reddit" and the results are grim: suspension stories, accounts dead within a week, sellers who vanish. If you stopped there you'd conclude the whole category is radioactive. But read the threads carefully and a pattern emerges — nearly every horror story traces back to one of five specific buying mistakes. Here they are, reviewed one by one.</p>

<h2>Warning 1: "Google suspended all my purchased accounts"</h2>
<p><strong>What actually happened:</strong> the buyer purchased accounts on a <em>shared</em> Workspace tenant, or accounts bulk-registered with fake identity signals. Google's abuse systems suspend at the tenant level — when the seller's tenant gets flagged, every account on it dies together, including yours.</p>
<p><strong>The avoidable mistake:</strong> buying accounts instead of infrastructure. A legitimate provider provisions a <em>dedicated Workspace tenant on your own domain</em> and transfers full admin ownership. Your tenant, your billing, your control — nothing shared with strangers' sending behavior. This is the single most important question to ask any seller, and it's standard practice at <a href="https://warminboxes.com" target="_blank">WarmInboxes</a>.</p>

<h2>Warning 2: "Worked for a week, then straight to spam"</h2>
<p><strong>What actually happened:</strong> the "warmup" was a few days in a bot pool, and the reputation evaporated under real volume. Or — just as common — the buyer took a properly warmed account from 0 to 150 cold sends/day on day one and burned it personally.</p>
<p><strong>The avoidable mistake:</strong> not asking how long warmup ran (correct answer: 3+ weeks), and ignoring ramp discipline on arrival. Verify warmth claims indirectly: run the <a href="/test">all-inclusive deliverability test</a> and a <a href="/tools/blacklist">blacklist check</a> on delivery, then ramp 20–30/day upward per the <a href="/blog/inbox-rotation-sop-cold-email">rotation SOP</a>'s promotion schedule.</p>

<h2>Warning 3: "The domain had a history I didn't know about"</h2>
<p><strong>What actually happened:</strong> the seller used recycled or expired-and-reregistered domains that arrived pre-listed or pre-burned. (Related reading: <a href="/blog/aged-domains-vs-pre-warmed-inboxes">aged domains vs pre-warmed inboxes</a> — age is not the asset people think it is.)</p>
<p><strong>The avoidable mistake:</strong> not verifying domain history before the first send. Two minutes with the <a href="/tools/blacklist">blacklist checker</a> and a look at the domain in archive.org catches this every time.</p>

<h2>Warning 4: "Seller kept access and I got locked out"</h2>
<p><strong>What actually happened:</strong> ownership never actually transferred — the seller retained super-admin or registrar control, then repossessed or lost the assets.</p>
<p><strong>The avoidable mistake:</strong> completing payment without a transfer checklist. Minimum: super-admin credentials on a tenant you control, domain moved to (or registered in) your registrar account, recovery email/phone rotated to yours, 2FA reset. A provider with nothing to hide walks you through this at handover.</p>

<h2>Warning 5: "It's against Google's ToS, you'll lose everything"</h2>
<p><strong>The honest version:</strong> what violates policy is fake-identity account farming and shared-tenant reselling — the junk end of the market, and it's also what gets suspended. Properly provisioned infrastructure — real Workspace subscriptions on dedicated tenants and domains, transferred to you as the paying customer — is ordinary Workspace usage. The distinction Reddit collapses is the same one this whole guide keeps drawing: accounts vs. infrastructure.</p>

<h2>The takeaway</h2>
<p>Reddit's warnings are real experiences with the bottom of the market. Every one of them is avoidable with the <a href="/blog/best-place-to-buy-pre-warmed-inboxes">vetting checklist</a>: dedicated tenant, fresh domains, 3+ week warmup, full ownership transfer, documented limits. Buy from a provider built for this — our recommendation is <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> — verify everything with the free tools on this site, and the horror-thread failure modes simply don't apply to you.</p>
`
},

{
  slug: "what-are-prewarmed-inboxes",
  title: "What Are Prewarmed Inboxes? Costs, Free Domains, Warmup Time and Billing Cycles Explained",
  category: "Pre-Warmed Inboxes",
  readTime: 12,
  excerpt: "Prewarmed inboxes skip the 2-3 week warmup. How they work, what free domains and quarterly billing save (up to 25%), the generic domain trade-off, and how to choose a provider.",
  body: `
<p><strong>Short answer:</strong> a prewarmed inbox is a business email account (Google Workspace, Microsoft 365 or Azure) that has already built sending history before you buy it. It comes on its own domain, with SPF, DKIM and DMARC already configured, so you can start cold email campaigns the day it arrives instead of spending two to three weeks warming a new inbox yourself. The trade-off is that the domain and the inbox names start out generic, not branded to your company.</p>

<p>This guide covers how prewarming works, what you actually get, the real cost of warming inboxes yourself, how free domains and longer billing cycles change the math, and the generic-domain question most buyers don't think about until after they've ordered.</p>

<blockquote><p>Disclosure: BurnedInbox is built by the team behind WarmInboxes, the provider we recommend in this guide. Prices quoted are from WarmInboxes' published price list, checked on 27 October 2026. Check the live price list before you order.</p></blockquote>

<h2>Why new inboxes need warming at all</h2>

<p>Gmail, Outlook and every other mailbox provider judge a sender partly on history. A brand-new inbox on a brand-new domain has none: no record of emails being delivered, opened, replied to, or rescued from spam. With no evidence either way, filters treat the first cold emails from that inbox with suspicion, and a lot of them land in spam or get throttled.</p>

<p>Warming is how an inbox builds that history. It sends a small, gradually increasing number of emails, usually to other inboxes in a warmup network that open them, reply, and mark them as not spam. Over a few weeks the inbox accumulates the kind of positive engagement record that filters expect from a real person, and campaign volume can start.</p>

<p>The problem is the wait. Warming a new inbox properly takes weeks, not days. WarmInboxes' own fresh inboxes are warmed for 14 to 21 days before handover, which is a reasonable benchmark for doing it right. During that time you are paying for the domain, the mailbox seat and usually a warmup tool, and the inbox sends nothing that books a meeting.</p>

<h2>What you actually get with a prewarmed inbox</h2>

<p>A prewarmed inbox moves the waiting to before you buy. From a reputable provider, a prewarmed order should include:</p>

<ul>
<li><strong>Business mailboxes</strong> on Google Workspace, Microsoft 365 or Azure, not consumer Gmail or Outlook.com accounts.</li>
<li><strong>A domain for every few inboxes.</strong> WarmInboxes puts 3 inboxes on each domain, which keeps volume per domain modest.</li>
<li><strong>Authentication already set up:</strong> SPF, DKIM and DMARC published and passing, plus forwarding configured.</li>
<li><strong>Sending history</strong> from a completed warmup, so the inboxes can carry campaign volume immediately, within a safe daily limit.</li>
<li><strong>Fast delivery.</strong> WarmInboxes delivers within 48 to 72 hours of payment, and the inboxes can send the day they land.</li>
</ul>

<p>Before you send a campaign from any new inbox, prewarmed or not, run it through the <a href="/test">free BurnedInbox auth + placement test</a>. Two minutes confirms the authentication is real and the domain isn't on a blacklist.</p>

<h2>The real cost of warming inboxes yourself</h2>

<p>Warming your own inboxes looks free because there's no line item called "warmup". The costs are spread out:</p>

<ul>
<li><strong>Domains.</strong> Usually $12 to $20 each per year at retail. At 3 inboxes per domain, 30 inboxes means 10 domains.</li>
<li><strong>Mailbox seats</strong> for the whole warmup period, while nothing productive is being sent.</li>
<li><strong>A warmup tool subscription,</strong> unless your sending platform includes one.</li>
<li><strong>Setup time:</strong> registering domains, publishing SPF, DKIM and DMARC for each one, creating inboxes, connecting them to your sequencer. The <a href="/blog/new-domain-cold-email-provisioning-sop">full provisioning checklist</a> is a few hours per batch for someone who has done it before.</li>
<li><strong>The wait itself.</strong> Two to three weeks with no pipeline from those inboxes. For an agency, that's a client paying for a campaign that hasn't started. For a founder, it's three weeks of meetings that didn't happen.</li>
</ul>

<p>The wait is usually the biggest cost, and it's the one people leave out. If one month of outbound is worth even a handful of meetings to you, three weeks of dead time costs far more than the inboxes do. You can run your own numbers with the <a href="/tools/warmup-time-saved">warmup time-saved calculator</a>.</p>

<h2>How free domains change the math</h2>

<p>Most inbox providers charge for domains separately, on top of the per-inbox price. WarmInboxes includes the domain free with prewarmed inboxes: each comes on a prewarmed .com or .co domain at no extra charge, and WarmInboxes estimates the saving at $12 to $20 per domain.</p>

<p>At 3 inboxes per domain, that adds up quickly:</p>

<table>
<thead><tr><th>Inboxes</th><th>Domains needed</th><th>Domain cost avoided (at $12–$20 each)</th></tr></thead>
<tbody>
<tr><td>15</td><td>5</td><td>$60 – $100</td></tr>
<tr><td>30</td><td>10</td><td>$120 – $200</td></tr>
<tr><td>90</td><td>30</td><td>$360 – $600</td></tr>
<tr><td>300</td><td>100</td><td>$1,200 – $2,000</td></tr>
</tbody>
</table>

<p>The domain also isn't just a registration. A prewarmed domain arrives with DNS configured and its own sending history, which is the part that takes the time. A new domain you register yourself still has to go through the whole warmup.</p>

<h2>Longer billing cycles: up to 25% cheaper</h2>

<p>WarmInboxes bills prewarmed inboxes per inbox per month, with three billing cycles. Paying for longer up front lowers the monthly rate:</p>

<table>
<thead><tr><th>Billing cycle</th><th>Google Workspace or Microsoft 365, per inbox per month</th><th>Saving vs monthly</th></tr></thead>
<tbody>
<tr><td>Monthly</td><td>$8</td><td>—</td></tr>
<tr><td>Every 2 months</td><td>$7</td><td>12.5%</td></tr>
<tr><td>Quarterly</td><td>$6</td><td>25%</td></tr>
</tbody>
</table>

<p>Azure is priced per tenant rather than per inbox, and a tenant holds up to 100 inboxes: $69 a month on monthly billing, $60 on the two-month cycle, and $50 a month quarterly.</p>

<h3>Worked example: 30 prewarmed Google Workspace inboxes for a year</h3>

<ul>
<li><strong>Monthly billing:</strong> 30 × $8 = $240 a month, or $2,880 a year.</li>
<li><strong>Every 2 months:</strong> 30 × $7 = $210 a month, or $2,520 a year.</li>
<li><strong>Quarterly:</strong> 30 × $6 = $180 a month (charged as $540 every three months), or $2,160 a year.</li>
</ul>

<p>Quarterly saves $720 a year on 30 inboxes compared with monthly billing, and the 10 domains are included on every cycle. At 300 inboxes the same difference is $7,200 a year.</p>

<p>The catch is commitment. Quarterly billing makes sense for inboxes you know you'll keep using: your core sending fleet, or a standby pool you maintain permanently. For a short test, or inboxes you expect to rotate out quickly, monthly gives you more flexibility for a higher rate.</p>

<h2>Cost per email, not just per inbox</h2>

<p>Per-inbox price only tells half the story, because each platform can safely send a different number of cold emails per inbox per day. WarmInboxes publishes a safe daily pace for each, based on 22 sending days a month:</p>

<table>
<thead><tr><th>Platform</th><th>Safe cold sends per inbox per day</th><th>Sends per inbox per month</th><th>Prewarmed cost per send (quarterly)</th></tr></thead>
<tbody>
<tr><td>Google Workspace</td><td>15</td><td>330</td><td>about $0.018</td></tr>
<tr><td>Microsoft 365</td><td>8</td><td>176</td><td>about $0.034</td></tr>
<tr><td>Azure (100 inboxes per tenant)</td><td>2</td><td>44 per inbox, 4,400 per tenant</td><td>about $0.011</td></tr>
</tbody>
</table>

<p>Which platform is cheapest per send isn't the whole decision. Your prospects' providers matter more: if most of your list is on Microsoft 365, sending from Microsoft infrastructure is usually worth the higher cost per send. You can check a list's provider split with the WarmInboxes <a href="https://warminboxes.com/esp-segmenter" target="_blank" rel="noopener">ESP Segmentation tool</a>, and size a fleet for a target volume with the <a href="https://warminboxes.com/calculator" target="_blank" rel="noopener">Infrastructure Calculator</a>.</p>

<h2>The generic domain and generic name question</h2>

<p>This is the part buyers most often misunderstand. Because a prewarmed inbox has to be warmed before anyone buys it, the provider can't know your brand in advance. So prewarmed inboxes come on <strong>generic domains</strong> (brand-neutral names chosen to look like real businesses, not your company name) with <strong>generic inbox names</strong> already set up.</p>

<p>That has real consequences:</p>

<ul>
<li><strong>Prospects see an unfamiliar domain.</strong> An email from a domain that isn't recognisably yours can feel less trustworthy, and it doesn't build your brand.</li>
<li><strong>Replies go to that domain.</strong> You'll want forwarding or a unified inbox so replies reach your team. WarmInboxes configures forwarding as part of setup.</li>
<li><strong>Names may not match your team.</strong> A prospect who looks up "Michael Brown" on LinkedIn should find someone real.</li>
</ul>

<p>It is also exactly why prewarmed inboxes are useful. A generic domain keeps cold outreach separate from your main company domain, so if a campaign goes badly the damage stays on a replaceable domain. You should never send cold email from your primary domain, prewarmed or not.</p>

<h3>How to make generic inboxes work</h3>

<ul>
<li><strong>Rename the inboxes</strong> to match the real people sending. WarmInboxes allows customer-side renaming, and the sending history stays with the mailbox.</li>
<li><strong>Set the display name, signature and profile photo</strong> to match your real team and company.</li>
<li><strong>Point the domain's website at your real site</strong> with a redirect, so anyone who visits the domain lands somewhere legitimate.</li>
<li><strong>Write the email as your company.</strong> The domain is infrastructure; the brand comes from the sender, the signature and the message.</li>
</ul>

<h3>When you want branded domains instead</h3>

<p>If brand matters more than speed, use fresh inboxes on domains you own, for example getyourcompany.com or tryyourcompany.com. WarmInboxes builds these on your domains and warms them for 14 to 21 days before handover, at about $3 to $3.50 per inbox per month plus $20 per domain, once. That's roughly a third of the prewarmed price at volume, in exchange for the wait.</p>

<p>Many teams use both: prewarmed inboxes to start sending now and to keep a standby pool, and fresh branded inboxes for the long-term fleet. The <a href="/blog/pre-warmed-inboxes-vs-diy-warmup">prewarmed vs DIY warmup comparison</a> covers that hybrid model in detail.</p>

<h2>Prewarmed vs fresh vs doing it yourself</h2>

<table>
<thead><tr><th></th><th>Prewarmed (WarmInboxes)</th><th>Fresh (WarmInboxes)</th><th>DIY</th></tr></thead>
<tbody>
<tr><td>Time to first campaign</td><td>48–72 hours</td><td>14–21 days warming, plus delivery</td><td>2–3+ weeks, plus your setup time</td></tr>
<tr><td>Domain</td><td>Free generic .com or .co</td><td>Your own, $20 each once</td><td>Your own, $12–$20 a year each</td></tr>
<tr><td>Inbox price</td><td>$6–$8 per month (Google, M365)</td><td>$3–$3.50 per month</td><td>Your seat price plus warmup tool</td></tr>
<tr><td>Branding</td><td>Generic domain; inboxes can be renamed</td><td>Your brand</td><td>Your brand</td></tr>
<tr><td>Setup work for you</td><td>Connect to your sequencer</td><td>Connect to your sequencer</td><td>Everything</td></tr>
<tr><td>Best for</td><td>Launching now, replacing burned inboxes, standby pools</td><td>Planned scaling on branded domains</td><td>Low volume with no deadline</td></tr>
</tbody>
</table>

<h2>When prewarmed inboxes make sense, and when they don't</h2>

<p><strong>They make sense when:</strong></p>
<ul>
<li>Your current inboxes are burned and campaigns can't pause for weeks while they recover. Run the <a href="/test">placement test</a> first to confirm it's really the infrastructure.</li>
<li>You're launching a new client or product and need to send this week, not next month.</li>
<li>You run a rotation and need standby capacity ready the day an inbox degrades. See the <a href="/blog/inbox-rotation-sop-cold-email">inbox rotation SOP</a>.</li>
<li>You're testing a new market and want to learn quickly before committing to branded domains.</li>
</ul>

<p><strong>They're less useful when:</strong></p>
<ul>
<li>You send a small volume, have no deadline, and are happy to warm your own inboxes.</li>
<li>Your brand requires every email to come from your own domain.</li>
<li>The real problem is your list or your copy. New inboxes won't fix a bad list; they'll just burn faster. Clean the list and check your content first.</li>
</ul>

<h2>How to choose a provider</h2>

<p>The prewarmed inbox market has a quality problem: cheap "warmed" accounts that collapse under real volume are common. Before buying from anyone, check:</p>

<ul>
<li><strong>Real business accounts</strong> on Google Workspace, Microsoft 365 or Azure, with full admin access, not shared or consumer accounts.</li>
<li><strong>Isolated workspaces,</strong> so another customer's sending can't get your tenant suspended.</li>
<li><strong>Clean domains.</strong> Run any domain you receive through a blacklist check before sending.</li>
<li><strong>Verified authentication.</strong> SPF, DKIM and DMARC should pass on arrival. Confirm it with the <a href="/test">BurnedInbox test</a>.</li>
<li><strong>A real warmup period,</strong> measured in weeks, not a few days in a bot network.</li>
<li><strong>Published safe sending limits</strong> and a ramp plan.</li>
<li><strong>Clear pricing</strong>, including whether domains cost extra.</li>
</ul>

<p>The <a href="/blog/best-place-to-buy-pre-warmed-inboxes">full buyer's checklist</a> goes deeper on each point.</p>

<h2>Why we recommend WarmInboxes</h2>

<p>WarmInboxes is the provider we recommend, and as disclosed above, it's built by the same team as BurnedInbox. Measured against the checklist:</p>

<ul>
<li>Prewarmed inboxes on <a href="https://warminboxes.com/google-workspace-inboxes" target="_blank" rel="noopener">Google Workspace</a>, <a href="https://warminboxes.com/microsoft-365-inboxes" target="_blank" rel="noopener">Microsoft 365</a> and Azure, so you can match your prospects' providers.</li>
<li>Free prewarmed .com or .co domains with every prewarmed inbox.</li>
<li>Quarterly billing 25% below monthly on Google and Microsoft 365.</li>
<li>Delivery within 48 to 72 hours, with SPF, DKIM, DMARC and forwarding configured.</li>
<li>Customer-side inbox renaming, so generic inboxes can carry your team's real names.</li>
<li>Fresh inboxes on your own domains when you're ready to scale on your brand.</li>
<li>Built and used by a cold email agency running its own outbound on the same infrastructure.</li>
</ul>

<p>See current plans and pricing at <a href="https://warminboxes.com" target="_blank" rel="noopener">warminboxes.com</a>.</p>

<h2>Your first 30 days with prewarmed inboxes</h2>

<ol>
<li><strong>Verify on arrival.</strong> Run each domain through the <a href="/test">BurnedInbox auth + placement test</a>: authentication passing, no blacklist listings.</li>
<li><strong>Rename and brand.</strong> Real names, display names, signatures, profile photos, and a redirect from the domain to your website.</li>
<li><strong>Connect and ramp.</strong> Connect the inboxes to your sending platform and start at roughly half the safe daily pace for the first week, then build up.</li>
<li><strong>Stay within the safe pace.</strong> Around 15 cold sends per inbox per day on Google Workspace and 8 on Microsoft 365. Exceeding it is the fastest way to burn a good inbox.</li>
<li><strong>Keep warmup running</strong> alongside campaigns, at a low level.</li>
<li><strong>Monitor weekly.</strong> Reply rates per inbox, bounce rates, and a placement test every week. The <a href="/blog/weekly-deliverability-monitoring-sop">weekly monitoring SOP</a> lays it out.</li>
<li><strong>Plan your standby pool.</strong> Decide now how many spare inboxes you'll keep ready, so a burned inbox is a swap, not an emergency.</li>
</ol>

<h2>Frequently asked questions</h2>

<h3>What is a prewarmed inbox?</h3>
<p>A business email inbox that has already completed warmup, so it has sending history and can send cold email on the day you receive it, without the usual two-to-three-week wait.</p>

<h3>How much do prewarmed inboxes cost?</h3>
<p>At WarmInboxes, prewarmed Google Workspace and Microsoft 365 inboxes cost $8 per inbox per month on monthly billing, $7 on two-month billing and $6 on quarterly billing, with domains included. Azure is billed per tenant of up to 100 inboxes: $69, $60 or $50 a month depending on the cycle.</p>

<h3>Are the domains really free?</h3>
<p>Yes, for prewarmed inboxes at WarmInboxes. Each prewarmed inbox comes on a prewarmed .com or .co domain at no extra charge. Fresh inboxes on your own domains are different: those domains cost $20 each, once.</p>

<h3>Why are prewarmed inboxes on generic domains?</h3>
<p>Because the warming happens before you buy, the provider can't use your brand name in advance. The generic domain also protects your main company domain: if a campaign damages a sending domain, your real domain is unaffected.</p>

<h3>Can I change the names on prewarmed inboxes?</h3>
<p>At WarmInboxes, yes. Renaming is included, and the sending history stays with the mailbox. Not every provider allows it, so ask before you buy elsewhere.</p>

<h3>How much can I save with quarterly billing?</h3>
<p>25% on Google Workspace and Microsoft 365 inboxes: $6 instead of $8 per inbox per month. On 30 inboxes that's $720 a year.</p>

<h3>How many emails can a prewarmed inbox send?</h3>
<p>WarmInboxes publishes a safe pace of about 15 cold emails per inbox per day on Google Workspace, 8 on Microsoft 365, and 2 per inbox on a 100-inbox Azure tenant.</p>

<h3>Do prewarmed inboxes guarantee inbox placement?</h3>
<p>No. They give you a clean, warmed starting point. Placement still depends on your list quality, your content and how you send. Test placement before you scale, and keep monitoring after.</p>

<h3>Are prewarmed inboxes worth it?</h3>
<p>When the cost of waiting is higher than the price difference, yes: replacing burned inboxes, launching quickly, or keeping a standby pool. For low volume with no deadline, warming your own is fine. There's a <a href="/blog/are-pre-warmed-inboxes-worth-it">full cost-benefit breakdown here</a>.</p>

<h2>Sources</h2>
<ul>
<li><a href="https://warminboxes.com/price.md" target="_blank" rel="noopener">WarmInboxes price list</a> (prices, billing cycles, safe daily sends, delivery time; checked 27 October 2026)</li>
<li><a href="https://warminboxes.com/blog/prewarmed-inboxes-guide" target="_blank" rel="noopener">WarmInboxes: Complete Guide to Prewarmed Email Inboxes</a> (renaming, domains, warmup process)</li>
<li><a href="https://warminboxes.com/microsoft-365-inboxes" target="_blank" rel="noopener">WarmInboxes: Prewarmed Microsoft 365 Inboxes</a> (domain saving estimate)</li>
</ul>
`
},

];
