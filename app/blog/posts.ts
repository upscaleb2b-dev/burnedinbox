export interface Post {
  slug: string;
  title: string;
  category: string;
  readTime: number;
  excerpt: string;
  body: string;
}

export const posts: Post[] = [

{
  slug: "why-cold-emails-suddenly-going-to-spam",
  title: "Why Your Cold Emails Suddenly Started Going to Spam",
  category: "Spam & Placement",
  readTime: 9,
  excerpt: "Everything was working fine. Then, seemingly overnight, your open rates collapsed and replies dried up. Here's how to systematically figure out what broke.",
  body: `
<p>You didn't change anything. Same copy, same list, same sending setup. But suddenly your open rates are half what they were, replies have stopped, and when you send a test to yourself it lands in spam. This happens to almost every cold email operator at some point. The good news: it's almost always diagnosable.</p>

<h2>The three root causes</h2>
<p>Sudden spam placement almost always comes from one of three places: something broke in your technical setup, your domain or IP reputation declined, or your sending behavior triggered filters. Most operators assume it's copy or content — but that's usually wrong. Spam filters care far more about <strong>who is sending</strong> than what the email says.</p>

<h2>Step 1: Check your authentication first</h2>
<p>Before anything else, verify that SPF, DKIM, and DMARC are still intact. DNS records occasionally get accidentally deleted, especially after domain renewals or nameserver changes. A broken DKIM signature will immediately tank deliverability across every major provider.</p>
<ul>
<li>Check SPF: look for a <code>v=spf1</code> TXT record on your domain</li>
<li>Check DKIM: verify the selector your ESP uses is still published</li>
<li>Check DMARC: confirm a <code>v=DMARC1</code> record exists</li>
</ul>
<p>Use the free <a href="/tools/spf">SPF checker</a>, <a href="/tools/dkim">DKIM checker</a>, and <a href="/tools/dmarc">DMARC lookup</a> tools to run this in under two minutes.</p>

<h2>Step 2: Check the blacklists</h2>
<p>Your domain or sending IP may have been listed on a real-time blacklist (RBL). This can happen suddenly — one spam complaint, a list quality issue, or a sudden volume spike can trigger a listing. Spamhaus, Barracuda, and SURBL are the ones that matter most for cold email inboxing.</p>
<p>Run a <a href="/tools/blacklist">blacklist check</a> against your sending domain and your sending IP. If you're listed, that's likely the primary cause.</p>

<h2>Step 3: Run an inbox placement test</h2>
<p>Don't assume it's spam without confirming. Run an actual <a href="/test">inbox placement test</a> to see exactly where your emails are landing across Gmail and Outlook. You may find it's promotions tab rather than spam — which has different causes and different fixes.</p>

<h2>Step 4: Check if your sending volume changed</h2>
<p>Did you scale up recently? Add more sequences? Move a client onto a domain? Sudden volume spikes are one of the most common spam triggers. Email providers watch sending patterns closely. A domain that went from 20 to 200 sends per day overnight looks suspicious regardless of content quality.</p>

<h2>Step 5: Check your tracking domain</h2>
<p>A misconfigured tracking domain — particularly one proxied through Cloudflare — will break click tracking and can affect deliverability. Also check if your tracking domain shares a reputation with a domain that has issues. Use the <a href="/tools/tracking-domain">tracking domain checker</a>.</p>

<h2>Step 6: Look at recent sending behavior</h2>
<p>High bounce rates are a red flag that providers respond to quickly. If you sent to a stale list recently or had a large batch of hard bounces, that can trigger spam filtering within days. Check your ESP's bounce report.</p>

<h2>The fastest diagnosis path</h2>
<ol>
<li>Run auth checks (SPF, DKIM, DMARC)</li>
<li>Run blacklist check on domain and IP</li>
<li>Run placement test</li>
<li>Review bounce rates over the last 14 days</li>
<li>Check if tracking domain is correctly configured</li>
<li>Look at volume changes over the same period</li>
</ol>

<h2>When to replace instead of repair</h2>
<p>If your domain has been sending aggressively for months, is blacklisted on critical RBLs like Spamhaus, and has a history of high bounce rates — repair is a long road. The domain's reputation history follows it. In these cases, standing up fresh infrastructure with pre-warmed inboxes is often faster than trying to rehabilitate a damaged domain. If your campaigns can't pause during a 4–8 week recovery, replacement is usually the right call.</p>

<blockquote><p>If the issue turns out to be reputation damage rather than a minor setup error, repairing may take time. For agencies that need replacement infrastructure quickly, prewarmed inboxes from providers like <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> can reduce downtime while damaged assets recover.</p></blockquote>
`
},

{
  slug: "how-to-tell-if-inboxes-burned-or-something-else",
  title: "How to Tell if Your Inboxes Are Burned or if Something Else Broke",
  category: "Emergency",
  readTime: 8,
  excerpt: "Burned inbox and broken setup look almost identical on the surface. The fix is completely different. Here's how to tell which one you're dealing with.",
  body: `
<p>Deliverability drops almost always get blamed on burned inboxes. But a large percentage of the time, the real culprit is something technical — a broken DNS record, a misconfigured tracking domain, or a sending limit that got hit. Getting this diagnosis right saves you from replacing infrastructure you didn't need to replace.</p>

<h2>The key distinction</h2>
<p>A <strong>burned inbox</strong> means the sending account or domain has accumulated enough negative reputation signals that providers are actively filtering its mail. A <strong>broken setup</strong> means something in the technical configuration stopped working — authentication failed, a record disappeared, or a new setting broke something that was previously fine.</p>
<p>Both cause the same symptom: emails landing in spam or not being delivered. But the fix is completely different.</p>

<h2>Signals that point to a broken setup</h2>
<ul>
<li>Deliverability dropped suddenly overnight with no change in sending behavior</li>
<li>The issue affects all inboxes on a domain simultaneously (not gradually)</li>
<li>You recently changed nameservers, renewed your domain, or updated DNS</li>
<li>Authentication checks show a failure or mismatch</li>
<li>Your ESP recently updated their DKIM selectors</li>
<li>You moved to a new sending tool and didn't reconfigure tracking</li>
</ul>

<h2>Signals that point to a burned inbox</h2>
<ul>
<li>Gradual decline over 2–4 weeks, not a sudden drop</li>
<li>High bounce rates in recent campaigns</li>
<li>Spam complaints from recipients</li>
<li>Listed on a major RBL like Spamhaus or Barracuda</li>
<li>Domain has been sending aggressively for months without rotation</li>
<li>Open rates collapsed even for warm prospects who previously engaged</li>
</ul>

<h2>The diagnostic process</h2>

<h3>Step 1: Check authentication</h3>
<p>Go to your <a href="/tools/spf">SPF</a>, <a href="/tools/dkim">DKIM</a>, and <a href="/tools/dmarc">DMARC</a> records right now. If any are missing or malformed, that's your culprit. This takes two minutes and should always be the first check.</p>

<h3>Step 2: Check the blacklists</h3>
<p>Run your domain and sending IP through the <a href="/tools/blacklist">blacklist checker</a>. A listing on Spamhaus ZEN or DBL is a clear sign of reputation damage, not just a technical glitch.</p>

<h3>Step 3: Check your tracking domain</h3>
<p>Use the <a href="/tools/tracking-domain">tracking domain checker</a>. If your tracking domain is proxied through Cloudflare (orange cloud), pointing nowhere, or has SSL issues, this could explain spam placement without any inbox being actually burned.</p>

<h3>Step 4: Run a placement test</h3>
<p>Send an actual test through your normal sending setup. The <a href="/test">inbox placement test</a> will show you exactly where the email lands and include the authentication results from the receiving server.</p>

<h3>Step 5: Check the redirect</h3>
<p>If your domain doesn't redirect properly, some spam filters flag it. Run the <a href="/tools/redirect">redirect checker</a> on your sending domain.</p>

<h2>Reading the results</h2>
<p>If auth checks pass, blacklists are clean, and the placement test shows spam — you're dealing with reputation damage. The inbox is burned or at risk.</p>
<p>If auth checks fail or show errors — fix those first. Many operators have replaced perfectly good domains because they didn't check that DKIM had silently broken.</p>

<h2>When to replace</h2>
<p>If you confirm it's reputation damage (not a setup issue), and the domain has been in active use for more than 3 months with a history of spam complaints or blacklistings — replacing is usually faster than repairing. Run the <a href="/tools/repair-or-replace">repair-or-replace calculator</a> to get a recommendation based on your specific situation.</p>
`
},

{
  slug: "first-24-hours-after-inboxes-burned",
  title: "What To Do in the First 24 Hours After Your Cold Email Inboxes Get Burned",
  category: "Emergency",
  readTime: 10,
  excerpt: "The first 24 hours after a deliverability crisis determine how fast you recover. Here's the exact triage order — what to stop, what to check, and what to do next.",
  body: `
<p>Your campaigns just died. Open rates are at the floor, you're getting spam reports, or your placement test just showed spam across the board. Here's what to do — in order — in the next 24 hours.</p>

<h2>Hour 0–1: Stop the bleeding</h2>
<p>The most important thing you can do in the first hour is <strong>pause sending from affected infrastructure</strong>. Every email you send from a burning domain makes the reputation worse. Continuing to send while you diagnose is like patching a leak with water still flowing.</p>
<ul>
<li>Pause all active sequences on the affected inboxes</li>
<li>Do not start new campaigns on the same domains</li>
<li>Do not attempt to "test" by sending more emails to see if it improves</li>
</ul>

<h2>Hour 1–2: Run the diagnostic stack</h2>
<p>With sending paused, run every diagnostic check in parallel. This tells you whether you're dealing with a technical break or actual reputation damage — and the fix is very different.</p>

<h3>Authentication check</h3>
<p>Check SPF, DKIM, and DMARC on every affected domain. Do this first — a broken auth record will cause spam placement regardless of reputation. Use the <a href="/tools/spf">SPF checker</a>, <a href="/tools/dkim">DKIM checker</a>, and <a href="/tools/dmarc">DMARC lookup</a>.</p>

<h3>Blacklist check</h3>
<p>Run your domain and sending IPs through the <a href="/tools/blacklist">blacklist checker</a>. Note which lists you're on and what severity they are. Spamhaus is critical — others are less urgent.</p>

<h3>Placement test</h3>
<p>Run a <a href="/test">placement test</a> using a clean test email to get the raw server verdict. The authentication results in the headers will tell you exactly what the receiving server saw.</p>

<h3>Tracking domain check</h3>
<p>Check your <a href="/tools/tracking-domain">tracking domain</a>. A broken or Cloudflare-proxied tracking domain is a common cause of sudden placement drops that looks like a burned inbox.</p>

<h2>Hour 2–4: Triage and classify</h2>
<p>Once you have diagnostic results, classify each affected inbox into one of three buckets:</p>
<ul>
<li><strong>Technical issue only</strong> — auth broken, tracking misconfigured, no blacklisting. Fix the technical issue and retest before deciding anything else.</li>
<li><strong>Reputation damage, recoverable</strong> — minor blacklisting, short sending history, no spam complaints. Pause, fix auth, request delisting, reduce volume for 2 weeks.</li>
<li><strong>Reputation damage, replace</strong> — Spamhaus listing, long history of aggressive sending, spam complaints. Begin replacement process immediately.</li>
</ul>

<h2>Hour 4–8: Fix what's fixable</h2>
<p>For technical issues, fix them now. DNS changes propagate in minutes to hours. Once auth is fixed, rerun the placement test. Many "burned inboxes" come back to life the moment DKIM is repaired.</p>
<p>For blacklisted domains: submit delisting requests to each blacklist you're on. Spamhaus, Barracuda, and most others have self-service delisting forms. Note: they won't delist you if the underlying problem isn't fixed first.</p>

<h2>Hour 8–24: Decide on replacement</h2>
<p>If you're managing client campaigns that can't pause for 3–6 weeks while reputation recovers, you need replacement infrastructure running within 24 hours. This is where the math matters — setting up and warming new inboxes from scratch takes weeks. Pre-warmed inboxes can be deployed the same day.</p>

<div class="checklist">
<h4>24-hour recovery checklist</h4>
<ul>
<li>Pause all sending from affected inboxes</li>
<li>Check SPF, DKIM, DMARC on all affected domains</li>
<li>Run blacklist check on domains and IPs</li>
<li>Run inbox placement test</li>
<li>Check tracking domain configuration</li>
<li>Check redirect on sending domain</li>
<li>Classify each inbox: technical / recoverable / replace</li>
<li>Fix any broken auth records</li>
<li>Submit blacklist delisting requests</li>
<li>Decide on replacement infrastructure if needed</li>
<li>Set up monitoring so this doesn't happen silently again</li>
</ul>
</div>

<h2>What not to do</h2>
<p>Don't keep sending. Don't try "low volume" sends to see if it helps. Don't immediately delete and recreate inboxes without diagnosing first. And don't assume it's the copy — content is rarely the primary cause of sudden spam placement.</p>

<blockquote><p>If the issue is reputation damage and campaigns can't pause, replacement infrastructure is often the fastest path back. <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> provides pre-warmed inboxes that can be deployed same-day while your damaged domains recover. But run the checks above first — you may find it's a technical issue that resolves in hours.</p></blockquote>
`
},

{
  slug: "google-workspace-emails-go-to-spam",
  title: "Why Google Workspace Emails Go to Spam in Cold Email Campaigns",
  category: "Google Workspace",
  readTime: 9,
  excerpt: "Google Workspace is the most popular cold email infrastructure — and the most scrutinized by Gmail's spam filters. Here's what causes placement failures and how to fix them.",
  body: `
<p>Google Workspace accounts dominate cold email sending. They're trusted, easy to set up, and have relatively generous sending limits. But that same ubiquity means Gmail's spam filters are specifically tuned to detect cold email patterns from Google Workspace accounts. If your GWS emails are landing in spam, here's what's actually happening.</p>

<h2>Why Google Workspace is more exposed than you think</h2>
<p>Gmail's filters know that Google Workspace is commonly used for cold email. They analyze sending patterns, engagement rates, and authentication consistency across the entire GWS ecosystem. A domain that sends mostly to non-engaged recipients, at regular intervals, with low reply rates, matches a pattern Gmail has seen millions of times.</p>

<h2>The most common causes of GWS spam placement</h2>

<h3>1. Missing or broken DKIM</h3>
<p>Google Workspace requires you to enable and publish a DKIM key. It doesn't happen automatically. Many operators set up GWS but forget to activate DKIM — or activate it but never verify the DNS record was published correctly. Check yours with the <a href="/tools/dkim">DKIM checker</a>. If your selector is <code>google</code> and no record is found, DKIM is not active.</p>

<h3>2. Weak DMARC policy</h3>
<p>A missing DMARC record won't immediately cause spam placement, but combined with other signals it matters. More importantly, <code>p=none</code> with no reporting set up means you're flying blind on authentication failures. Check your <a href="/tools/dmarc">DMARC record</a>.</p>

<h3>3. Sending too fast too early</h3>
<p>Google Workspace accounts have a reputation that builds over time. New GWS inboxes that start sending 15 emails per day immediately are flagged. The safe starting limit is 2–3 per day, ramping up over 3–4 weeks. The <a href="/tools/send-limits">sending limit planner</a> shows the correct ramp for GWS specifically.</p>

<h3>4. Low engagement signals</h3>
<p>Gmail tracks what recipients do with email from your domain. If nobody opens, nobody replies, and nobody marks as not-spam — the filter learns to discard it. Engagement history is hard to build quickly and easy to damage.</p>

<h3>5. Domain-level reputation, not just inbox</h3>
<p>If multiple inboxes on the same domain are sending aggressively, the domain reputation declines even if individual inbox limits are respected. Keep a maximum of 3 inboxes per domain and spread them across different campaigns.</p>

<h3>6. Tracking domain issues</h3>
<p>If your tracking domain is on the same domain as your sending domain, click tracking can affect your sending reputation. Use a completely separate domain for tracking. Check with the <a href="/tools/tracking-domain">tracking domain checker</a>.</p>

<h2>The correct GWS setup for cold email</h2>
<ol>
<li>New domain purchased at least 30 days before first send</li>
<li>SPF record: <code>v=spf1 include:_spf.google.com ~all</code></li>
<li>DKIM: enabled in Google Admin and DNS record published (selector: <code>google</code>)</li>
<li>DMARC: at minimum <code>v=DMARC1; p=none; rua=mailto:your@email.com</code></li>
<li>Domain redirects correctly (http → https, root and www)</li>
<li>Warmup: 21+ days before live sends, with engagement</li>
<li>Send limits: 2–3 per day in week 1, ramping to 15 by week 4</li>
</ol>

<h2>Recovery for a damaged GWS setup</h2>
<p>If your GWS inboxes are already in spam, the recovery path depends on how long they've been sending and how severe the damage is. Check if you're blacklisted, fix any auth issues, reduce sending volume dramatically (or pause entirely), and wait. GWS reputation recovery typically takes 4–8 weeks of low-volume, high-engagement sending.</p>

<h2>When to replace GWS inboxes</h2>
<p>If the domain has been sending aggressively for months, is blacklisted, and client campaigns can't pause — replacement is faster than recovery. The <a href="/tools/recovery-time">recovery time estimator</a> can help you compare timelines.</p>

<blockquote><p>For agencies that need to maintain campaign continuity while GWS inboxes recover, having pre-warmed replacement inboxes ready to deploy is the fastest path. <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> is one option. But first, use the <a href="/tools/repair-or-replace">repair-or-replace calculator</a> to determine if recovery is viable for your timeline.</p></blockquote>
`
},

{
  slug: "microsoft-365-deliverability-fixes",
  title: "Microsoft 365 Deliverability Fixes for Cold Email Agencies",
  category: "Microsoft 365",
  readTime: 9,
  excerpt: "Microsoft 365 has stricter spam filtering and lower sending limits than Google Workspace. Here's what causes deliverability failures and how to fix them.",
  body: `
<p>Microsoft 365 accounts are increasingly popular for cold email — partly because GWS inboxes are harder to get and partly because M365 domains can look more corporate. But M365 has its own set of deliverability challenges, and Outlook's spam filters are notably more aggressive than Gmail's in certain areas.</p>

<h2>Why M365 is different from GWS for cold email</h2>
<p>Microsoft's filtering infrastructure (Exchange Online Protection, or EOP) uses different signals than Gmail. It's particularly aggressive about filtering based on <strong>sending IP reputation</strong> and <strong>authentication alignment</strong>. It also has lower sending limits — 10 sends per inbox per day is the safe ceiling for cold email, compared to 15 for GWS.</p>

<h2>Common causes of M365 spam placement</h2>

<h3>1. Missing or wrong SPF record</h3>
<p>M365 requires a specific SPF record: <code>v=spf1 include:spf.protection.outlook.com -all</code>. Using <code>~all</code> (softfail) instead of <code>-all</code> (hardfail) is technically permissible but can weaken your position with some filters. More commonly, operators forget to update SPF when adding M365 to an existing domain. Check yours at <a href="/tools/spf">/tools/spf</a>.</p>

<h3>2. DKIM not enabled</h3>
<p>DKIM signing is not enabled by default in M365. You must activate it in the Microsoft 365 Defender portal. The selectors are <code>selector1</code> and <code>selector2</code>. Use the <a href="/tools/dkim">DKIM checker</a> to confirm they're published and valid.</p>

<h3>3. Sending above safe limits</h3>
<p>M365's safe sending limit for cold email is 10 per inbox per day. Exceeding this risks account flagging. With M365, the per-account limits are enforced more strictly than with GWS. Use the <a href="/tools/send-limits">sending limit planner</a> to build your ramp correctly.</p>

<h3>4. New domain with no history</h3>
<p>Microsoft weighs domain age heavily. New domains sending cold email immediately are at significant risk of EOP filtering. The minimum recommended age is 30 days, with 60–90 days being safer for M365 specifically.</p>

<h3>5. Outlook-to-Outlook filtering</h3>
<p>When your recipient also uses Outlook/M365, Microsoft's filtering applies at both ends. This creates double-filtering that makes deliverability harder. For campaigns targeting corporate Outlook users, GWS inboxes often perform better than M365-to-M365.</p>

<h3>6. Poor sending IP reputation</h3>
<p>M365 shared IPs can have variable reputation. If Microsoft's shared sending infrastructure has recent abuse from other tenants, your email can be caught. This is more of an issue with lower-tier M365 plans that use shared IP pools.</p>

<h2>The M365 setup checklist</h2>
<ol>
<li>SPF: <code>v=spf1 include:spf.protection.outlook.com -all</code></li>
<li>DKIM: enabled in M365 Defender, both selectors published in DNS</li>
<li>DMARC: <code>v=DMARC1; p=none; rua=mailto:your@email.com</code> minimum</li>
<li>Domain age: 30+ days minimum, 60+ preferred</li>
<li>Sending limits: max 10/inbox/day, ramp over 3+ weeks</li>
<li>Max 3 inboxes per domain</li>
</ol>

<h2>Diagnosing M365 placement failures</h2>
<p>Run a <a href="/test">placement test</a> and check the authentication results in the headers. If DKIM shows as a failure, that's your primary fix. If auth is clean but placement is still spam, it's a reputation issue requiring a slower recovery approach.</p>

<h2>When to stop trying to save an M365 setup</h2>
<p>M365 accounts that have been sending aggressively and are flagged by Microsoft are extremely difficult to recover. Microsoft's filtering is less transparent than Google's, and the delisting process for M365-flagged domains is slower. If a client campaign is active and the M365 setup is damaged, replacement is often the faster path.</p>

<blockquote><p>If you need replacement sending infrastructure while an M365 setup recovers, the key is having pre-warmed inboxes ready to deploy without a warmup period. <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> is one source for this. Run the diagnostics above first to confirm you're dealing with reputation damage and not a fixable auth issue.</p></blockquote>
`
},

{
  slug: "spf-dkim-dmarc-cold-email-fix-guide",
  title: "SPF, DKIM, and DMARC for Cold Email: The Simple Fix Guide",
  category: "DNS & Auth",
  readTime: 8,
  excerpt: "Authentication errors are the most common and most fixable cause of cold email spam placement. Here's what each record does, how to check it, and exactly how to fix it.",
  body: `
<p>Most cold email deliverability problems trace back to authentication. SPF, DKIM, and DMARC form the foundation of email trust — without them, providers have no technical reason to believe your email is legitimate. Here's what each one does and how to fix common problems.</p>

<h2>What each record actually does</h2>

<h3>SPF (Sender Policy Framework)</h3>
<p>SPF is a DNS record that lists which servers are authorized to send email for your domain. When a receiving server gets your email, it checks whether the sending server's IP is in your SPF record. If it's not, the email fails SPF — which is a strong spam signal.</p>

<h3>DKIM (DomainKeys Identified Mail)</h3>
<p>DKIM adds a cryptographic signature to every email you send. The receiving server looks up your public key in DNS and uses it to verify the signature. If the signature is valid, the email hasn't been tampered with and genuinely came from an authorized source. A broken DKIM signature is one of the most damaging authentication failures for cold email.</p>

<h3>DMARC (Domain-based Message Authentication, Reporting & Conformance)</h3>
<p>DMARC ties SPF and DKIM together and tells receiving servers what to do when authentication fails. It also gives you visibility through aggregate reports. Without DMARC, you don't know when your domain is being spoofed or when authentication is silently failing.</p>

<h2>Diagnosing authentication problems</h2>
<p>Use the <a href="/tools/spf">SPF checker</a>, <a href="/tools/dkim">DKIM checker</a>, and <a href="/tools/dmarc">DMARC lookup</a> to verify each record. Then run a <a href="/test">placement test</a> — the test email's headers will show exactly what the receiving server saw for each auth check.</p>

<h2>SPF: common errors and fixes</h2>

<h3>Missing SPF record</h3>
<p>No SPF record means no authorization. Add one immediately. For Google Workspace: <code>v=spf1 include:_spf.google.com ~all</code>. For M365: <code>v=spf1 include:spf.protection.outlook.com -all</code>.</p>

<h3>Multiple SPF records</h3>
<p>A domain can only have one SPF record. If you have two <code>v=spf1</code> TXT records, authentication will fail. Merge them into a single record.</p>

<h3>Too many DNS lookups</h3>
<p>SPF has a 10 DNS lookup limit. Using multiple <code>include:</code> statements can exceed this. If you're over the limit, use SPF flattening to reduce lookups.</p>

<h3>Softfail vs hardfail</h3>
<p><code>~all</code> (softfail) means unauthorized senders are flagged but not rejected. <code>-all</code> (hardfail) means they're rejected. For most cold email setups, <code>~all</code> is appropriate. <code>+all</code> (passall) is dangerous — it authorizes every server, which means SPF provides no protection.</p>

<h2>DKIM: common errors and fixes</h2>

<h3>DKIM not enabled with your ESP</h3>
<p>Most ESPs require you to explicitly enable DKIM. In Google Workspace, go to Admin > Apps > Google Workspace > Gmail > Authenticate email. For M365, go to Microsoft 365 Defender > Email & Collaboration > Policies & Rules > DKIM.</p>

<h3>Wrong selector</h3>
<p>The selector is the prefix before <code>._domainkey.yourdomain.com</code>. GWS uses <code>google</code>. M365 uses <code>selector1</code> and <code>selector2</code>. Custom SMTP tools use their own. Use the <a href="/tools/dkim">DKIM checker</a> to auto-discover which selectors are present.</p>

<h3>Key not published in DNS</h3>
<p>You can activate DKIM in your ESP but forget to add the DNS record. The DKIM checker will tell you if the record exists and if the key is valid.</p>

<h3>Short key length</h3>
<p>1024-bit DKIM keys are considered weak. 2048-bit is the current standard. If your key is 1024-bit, rotate to a 2048-bit key through your ESP.</p>

<h2>DMARC: setup and common mistakes</h2>

<h3>No DMARC record</h3>
<p>A missing DMARC record means you're not getting any authentication reporting and you're not signaling a policy to receivers. Add at minimum: <code>v=DMARC1; p=none; rua=mailto:your@email.com</code></p>

<h3>Policy set too aggressively too early</h3>
<p>Starting with <code>p=reject</code> before you've verified all your sending sources will block legitimate email. Start with <code>p=none</code>, monitor reports for 2–4 weeks, then move to <code>p=quarantine</code> and eventually <code>p=reject</code>.</p>

<h2>The auth setup checklist</h2>
<div class="checklist">
<h4>Authentication checklist</h4>
<ul>
<li>SPF record exists with correct include for your ESP</li>
<li>Only one SPF record on the domain</li>
<li>SPF has fewer than 10 DNS lookups</li>
<li>DKIM enabled in your ESP</li>
<li>DKIM DNS record published and valid</li>
<li>DKIM key is 2048-bit</li>
<li>DMARC record exists</li>
<li>DMARC rua tag points to a monitored email</li>
</ul>
</div>
`
},

{
  slug: "inbox-placement-test-before-blaming-copy",
  title: "How to Run an Inbox Placement Test Before You Blame the Copy",
  category: "Spam & Placement",
  readTime: 7,
  excerpt: "Low open rates get blamed on copy, subject lines, and personalization. Most of the time it's an infrastructure problem. Here's how to find out before you rewrite everything.",
  body: `
<p>When open rates drop, the reflex is to rewrite the subject line. Change the opener. Shorten the email. Test a new angle. Sometimes that's right. But if your emails are landing in spam or promotions, no amount of copywriting will fix the delivery problem. The copy never gets seen.</p>

<h2>What an inbox placement test actually tells you</h2>
<p>An inbox placement test sends a real email through your sending infrastructure — using your actual domain, inbox, and tracking setup — and checks where it lands across email providers. The result tells you:</p>
<ul>
<li>Whether the email reached inbox, promotions, or spam</li>
<li>What SPF, DKIM, and DMARC returned on the receiving end</li>
<li>Whether your authentication is working as configured</li>
<li>Whether your sending infrastructure is clean</li>
</ul>
<p>This is different from preview tools or spam word checkers — those analyze the content. A placement test analyzes the actual delivery signal.</p>

<h2>When to run a placement test</h2>
<ul>
<li>Before launching any new campaign on a domain</li>
<li>When open rates drop unexpectedly</li>
<li>After changing your ESP or sending tool</li>
<li>After updating DNS records</li>
<li>After onboarding a new client's domain</li>
<li>Monthly as a routine check on active sending domains</li>
</ul>

<h2>How to run the test</h2>
<p>Use the <a href="/test">free inbox placement test</a> at BurnedInbox. The process is:</p>
<ol>
<li>Enter your domain</li>
<li>Get a seed email address to send to</li>
<li>Send a real email from your actual sending setup to that address</li>
<li>Wait for the result (usually 2–3 minutes)</li>
<li>See where it landed and review the auth results</li>
</ol>
<p>Important: send the test the same way you send campaigns — same inbox, same ESP, same tracking setup. A test sent differently won't reflect your actual campaign delivery.</p>

<h2>Reading the results</h2>

<h3>Inbox</h3>
<p>Your email reached the primary inbox. Authentication is working. This doesn't mean your campaigns are performing — it means the infrastructure is clean. Open rate problems at this point are content, timing, or list quality issues.</p>

<h3>Promotions</h3>
<p>Common for Gmail. Promotions tab placement is often caused by HTML-heavy emails, multiple links, or marketing-style content. Also can be caused by low engagement history. Not a crisis, but worth optimizing.</p>

<h3>Spam</h3>
<p>Something is wrong with your infrastructure or reputation. Check the authentication results in the test output. If SPF, DKIM, or DMARC failed — fix those first. If auth passed but you're still in spam — it's a reputation issue.</p>

<h2>What to do based on results</h2>

<h3>Auth failure + spam</h3>
<p>Fix authentication first. Use the <a href="/tools/spf">SPF checker</a>, <a href="/tools/dkim">DKIM checker</a>, and <a href="/tools/dmarc">DMARC lookup</a>. Then retest. Many spam placements resolve immediately once auth is fixed.</p>

<h3>Auth pass + spam</h3>
<p>Reputation issue. Check the <a href="/tools/blacklist">blacklist checker</a>. If you're listed, request delisting after fixing the root cause. If you're not listed, the reputation damage is softer and will take longer to recover.</p>

<h3>Auth pass + promotions</h3>
<p>Reduce HTML complexity, reduce link count, try plain text. Also consider whether your email looks too much like marketing — cold email should feel personal, not broadcast.</p>

<h2>The mistake everyone makes</h2>
<p>Operators spend hours AB testing subject lines while their emails are in spam. The test takes three minutes. Run it first, then decide whether to rewrite the copy.</p>
`
},

{
  slug: "how-long-to-recover-burned-email-domain",
  title: "How Long Does It Take to Recover a Burned Email Domain?",
  category: "Warmup & Recovery",
  readTime: 8,
  excerpt: "Recovery timelines vary wildly depending on what's damaged. Here's a realistic framework for estimating how long repair will take — and when it's not worth waiting.",
  body: `
<p>The honest answer is: it depends on what's broken. A domain with a minor reputation issue that's off one minor blacklist might recover in two weeks. A domain that's been sending aggressively for six months, is on Spamhaus, and has a history of complaints might never fully recover — or might take 3–4 months to see meaningful improvement.</p>

<h2>The factors that determine recovery time</h2>

<h3>Severity of blacklisting</h3>
<p>Being listed on Spamhaus ZEN or DBL is the most serious. These are checked by virtually every major mail server and require manual review and explicit removal. After removal, reputation rebuilds slowly — typically 4–8 weeks before you see full inbox placement again.</p>
<p>Minor blacklists (UCEPROTECT L2/L3, JustSpam) often delist automatically after 1–2 weeks of clean sending. Critical ones (Spamhaus, Barracuda) require manual delisting requests.</p>

<h3>Length of sending history</h3>
<p>A domain that's been sending for two months recovers faster than one that's been in use for a year. The longer and more aggressive the sending history, the deeper the reputation damage.</p>

<h3>Whether authentication was broken</h3>
<p>If your spam placement was caused by broken authentication (DKIM key disappeared, SPF record deleted), recovery can happen within days once the record is fixed. This is the fastest recovery scenario — sometimes 48–72 hours after fixing auth.</p>

<h3>Spam complaint volume</h3>
<p>Every spam complaint is logged. High complaint rates are slow to recover from because they signal active recipient dissatisfaction, not just sending pattern anomalies. A domain with a significant complaint history may take 8–12 weeks of clean, low-volume sending to see full recovery.</p>

<h3>Whether you continue sending during recovery</h3>
<p>Continuing to send from a damaged domain during recovery extends the recovery timeline. Every send reinforces the negative patterns. For meaningful recovery, pause or dramatically reduce sending volume on damaged infrastructure.</p>

<h2>Realistic recovery timelines</h2>

<h3>Authentication fix only (1–3 days)</h3>
<p>If the issue was a broken DNS record — DKIM key deleted, SPF record corrupted — recovery is fast. Fix the record, verify it propagates, retest. Many operators see inbox placement restore within 24–72 hours.</p>

<h3>Minor blacklisting (1–3 weeks)</h3>
<p>Listed on non-critical RBLs, short sending history, no spam complaints. Delist, pause sending for one week, resume at low volume. Retest weekly.</p>

<h3>Moderate reputation damage (4–8 weeks)</h3>
<p>Spamhaus listing, moderate sending history, some spam complaints. Delist, fix auth, pause for 2 weeks, resume at 20% of normal volume, ramp slowly over 6 weeks. Retest every 2 weeks.</p>

<h3>Severe reputation damage (8–16 weeks)</h3>
<p>Multiple critical blacklists, high complaint history, aggressive sending pattern over many months. Recovery is possible but slow. Some domains never fully recover to primary inbox placement at cold email volumes.</p>

<h2>Recovery vs replacement: the math</h2>
<p>If you have active client campaigns, the question isn't just "can this domain recover?" — it's "can this domain recover faster than the campaign needs to run?" If a campaign has 3,000 prospects to contact in the next 4 weeks and recovery takes 8 weeks, replacement is the only viable option.</p>
<p>Use the <a href="/tools/recovery-time">recovery time estimator</a> to compare repair vs warmup vs pre-warmed replacement timelines for your specific situation.</p>

<blockquote><p>For agencies managing active client campaigns, the relevant question is always about campaign continuity. If the recovery timeline is longer than the campaign window, <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> provides pre-warmed infrastructure that can be deployed same-day while damaged domains recover in the background.</p></blockquote>
`
},

{
  slug: "recover-burned-inbox-or-replace",
  title: "Can You Recover a Burned Inbox or Should You Replace It?",
  category: "Warmup & Recovery",
  readTime: 8,
  excerpt: "The repair vs replace decision is the most important call you make when deliverability breaks. Here's the framework for getting it right.",
  body: `
<p>Most operators default to replacement when something goes wrong. But many damaged inboxes are recoverable — and replacing when you don't need to wastes money and time. The key is knowing which situation you're actually in.</p>

<h2>The repair case</h2>
<p>Repair is the right move when:</p>
<ul>
<li>The issue is technical (broken auth, misconfigured tracking) — not reputation</li>
<li>The domain is less than 3 months old with no spam complaints</li>
<li>Blacklisting is on a minor RBL, not Spamhaus or Barracuda</li>
<li>Campaigns can pause for 2–4 weeks during recovery</li>
<li>The affected inbox pool is small relative to your total sending capacity</li>
</ul>
<p>If you're in this situation, run the <a href="/tools/spf">auth checks</a>, fix what's broken, request any delisting, and pause sending for 1–2 weeks. Retest with a <a href="/test">placement test</a> before resuming.</p>

<h2>The replace case</h2>
<p>Replacement is the right move when:</p>
<ul>
<li>The domain is blacklisted on Spamhaus, Barracuda, or SURBL</li>
<li>The domain has a long history of aggressive sending (6+ months)</li>
<li>There are documented spam complaints in the ESP dashboard</li>
<li>Campaigns cannot pause — active clients need continuity</li>
<li>Auth checks pass but spam placement persists after 2 weeks</li>
<li>The domain was purchased from a questionable source with unknown history</li>
</ul>

<h2>The math on replacement</h2>
<p>The hidden cost of replacement is warmup time. A new domain needs 30+ days of warmup before it can safely send cold email at normal volumes. That's 30 days where you're paying for infrastructure that isn't generating results.</p>
<p>Pre-warmed inboxes eliminate the warmup period. The cost is higher upfront, but the time-to-full-deployment is measured in hours rather than weeks. For agencies with active campaigns, this math almost always favors pre-warmed over fresh.</p>

<h2>The mixed scenario</h2>
<p>Most agencies deal with a mixed situation — some inboxes recoverable, some not. A sensible approach:</p>
<ol>
<li>Run diagnostics on every affected inbox</li>
<li>Classify each: fixable technical / recoverable reputation / replace</li>
<li>Fix technical issues immediately</li>
<li>Pause reputation-damaged inboxes and begin recovery process</li>
<li>Replace only the inboxes that are clearly cooked</li>
<li>Add backup capacity so the next failure doesn't stop campaigns</li>
</ol>

<h2>How to make the call</h2>
<p>Use the <a href="/tools/repair-or-replace">repair-or-replace calculator</a> — input your auth status, placement results, blacklist status, number of affected inboxes, and campaign urgency. It outputs a recommendation and the action steps for each scenario.</p>

<blockquote><p>If the recommendation is replacement and you have active client campaigns, <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> is one source for pre-warmed inboxes that can be deployed without a warmup period. Run the diagnostics first so you know exactly how many inboxes need replacing and which can be recovered.</p></blockquote>
`
},

{
  slug: "warm-up-new-inboxes-without-burning-them",
  title: "How to Warm Up New Inboxes Without Burning Them Again",
  category: "Warmup & Recovery",
  readTime: 9,
  excerpt: "Most inbox burning happens during or immediately after warmup. Here's the right process — and the mistakes that turn a fresh inbox into a burned one within weeks.",
  body: `
<p>The irony of inbox warmup is that it's also the period of highest risk. New inboxes with no sending history are fragile. The wrong move early in the warmup process can damage an inbox before it ever runs a real campaign. Here's how to do it right.</p>

<h2>What warmup actually does</h2>
<p>Warming up an inbox builds a sending history that email providers use to calibrate trust. Providers track your sending patterns, volume trends, bounce rates, and engagement signals. A warmed inbox has enough positive history that it gets the benefit of the doubt when filtering decisions are made.</p>
<p>The key insight: warmup doesn't just prepare the inbox — it actively builds reputation. Which means doing it wrong actively builds bad reputation.</p>

<h2>The correct warmup process</h2>

<h3>Before you start sending</h3>
<p>Authentication must be configured before the first warmup email. If you warm up without SPF, DKIM, and DMARC, every warmup email contributes to an unverified sending record. Check with the <a href="/tools/warmup-ready">warmup readiness checker</a> before starting.</p>
<ul>
<li>SPF record published and correct for your ESP</li>
<li>DKIM enabled and DNS record live</li>
<li>DMARC record published (p=none is fine)</li>
<li>Domain is 30+ days old</li>
<li>Redirect is working correctly</li>
</ul>

<h3>Volume ramp</h3>
<p>The safe ramp for cold email inboxes:</p>
<ul>
<li>Week 1: 2–3 sends per day</li>
<li>Week 2: 5–7 sends per day</li>
<li>Week 3: 8–12 sends per day</li>
<li>Week 4+: up to provider limit (15 for GWS, 10 for M365)</li>
</ul>
<p>Never jump the ramp. A sudden spike — even within provider limits — looks anomalous and can trigger filtering.</p>

<h3>Engagement matters more than volume</h3>
<p>Warmup tools that just send email back and forth between accounts are building a thin, artificial engagement history. Real engagement signals — actual opens from real accounts, replies, not-spam clicks — are much more valuable. If you have any existing warm contacts, a few real exchanges during the warmup period significantly improves the quality of the reputation being built.</p>

<h3>Monitor throughout</h3>
<p>Run a <a href="/test">placement test</a> at the end of week 2 and week 4. If you're already in spam during warmup, stop and diagnose before continuing. Continuing to send while in spam is making the damage worse.</p>

<h2>Warmup mistakes that burn inboxes</h2>

<h3>Starting live sends before warmup is complete</h3>
<p>Sending 200 cold emails to a list on day 7 of warmup will almost certainly cause spam placement. The inbox doesn't have enough positive history to absorb the volume and engagement signals of a real campaign.</p>

<h3>High bounce rates early</h3>
<p>Sending to a stale or unverified list during warmup creates bounce rates that permanently damage a new inbox. Warmup sends should go to verified contacts or warmup tool networks with known deliverability.</p>

<h3>Spam complaints during warmup</h3>
<p>Any spam complaint during warmup is disproportionately damaging because the sending history is short and the complaint rate (complaints per send) looks very high. Never send cold outreach during the warmup period.</p>

<h3>Sending at irregular times</h3>
<p>Warmup sends at 3am or in unusual bursts look like automated spam behavior. Send during business hours with natural variation.</p>

<h2>Checking warmup readiness</h2>
<p>Before going live with a campaign, use the <a href="/tools/warmup-ready">warmup readiness checker</a>. It evaluates the key signals — auth configuration, domain age, warmup duration, engagement history, and spam signals — and tells you whether the inbox is ready or what's still missing.</p>

<blockquote><p>If you need inboxes ready to send today — without a warmup period — pre-warmed inboxes from providers like <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> skip the entire warmup process. They're delivered with an established sending history and can be used for live campaigns immediately. This is especially useful after burning inboxes when you can't wait 4–6 weeks for fresh ones to warm up.</p></blockquote>
`
},

{
  slug: "dns-error-killing-deliverability",
  title: "How to Check if a DNS Error Is Killing Your Deliverability",
  category: "DNS & Auth",
  readTime: 7,
  excerpt: "DNS errors are invisible. Your email tool shows no errors, your sequences run normally, and your emails land in spam. Here's how to find what broke.",
  body: `
<p>DNS errors are the most frustrating cause of deliverability problems because they're completely invisible to your ESP. Your campaigns run normally, the send counts look right, and nothing shows as broken — but your emails are landing in spam because a DNS record silently stopped working.</p>

<h2>Why DNS breaks without warning</h2>
<p>DNS records don't expire on their own, but they break in several ways: domain renewal issues can cause records to disappear, nameserver migrations can fail to transfer records, ESP updates can change required selectors, and accidental deletion is more common than it sounds. None of these events show up as an error in your sending tool.</p>

<h2>The DNS records that affect email delivery</h2>

<h3>SPF (critical)</h3>
<p>A missing or malformed SPF record means your sending server isn't authorized. Receiving servers will either reject or heavily filter your email. Check: <code>dig TXT yourdomain.com</code> or use the <a href="/tools/spf">SPF checker</a>.</p>

<h3>DKIM (critical)</h3>
<p>The DKIM public key record must match what your ESP is signing with. If the key was rotated in your ESP but not updated in DNS, every email has an invalid signature. Check: <code>dig TXT selector._domainkey.yourdomain.com</code> or use the <a href="/tools/dkim">DKIM checker</a> which auto-discovers selectors.</p>

<h3>DMARC (important)</h3>
<p>A missing DMARC record doesn't immediately cause spam placement, but signals to receivers that the domain owner isn't monitoring authentication. Some filters weight this. Check: <code>dig TXT _dmarc.yourdomain.com</code> or use the <a href="/tools/dmarc">DMARC lookup</a>.</p>

<h3>MX (for reply routing)</h3>
<p>If your sending domain's MX records are missing or wrong, replies to your cold email will bounce. This increases the appearance that the domain is used only for sending and not monitored. Check: <a href="/tools/mx">MX checker</a>.</p>

<h3>Tracking domain CNAME (important)</h3>
<p>If your tracking domain's CNAME record is broken, click tracking fails and may cause delivery errors with some ESPs. Check: <a href="/tools/tracking-domain">tracking domain checker</a>.</p>

<h2>The complete DNS audit process</h2>

<h3>Step 1: Check each auth record</h3>
<p>Use the <a href="/dns">DNS checker</a> to look up SPF, DKIM, DMARC, and MX records for your sending domain. Make a note of what's there and compare to what should be there per your ESP's setup guide.</p>

<h3>Step 2: Check the tracking domain</h3>
<p>Run the <a href="/tools/tracking-domain">tracking domain checker</a> on your tracking subdomain. Confirm the CNAME is pointing to the right destination and SSL is working.</p>

<h3>Step 3: Run a placement test</h3>
<p>Send an actual test through your real sending setup with the <a href="/test">placement test</a>. The headers will show exactly what authentication passed or failed on the receiving end — this is the most reliable way to confirm what the receiving server actually saw.</p>

<h3>Step 4: Check redirect</h3>
<p>Sending domains should redirect correctly. Use the <a href="/tools/redirect">redirect checker</a> to confirm http redirects to https and both root and www work.</p>

<h2>Common DNS scenarios and fixes</h2>

<h3>Scenario: DKIM suddenly failing</h3>
<p>Most common cause: ESP rotated DKIM keys and you need to update the DNS record. Log into your ESP, find the current DKIM key, and update or add the DNS record with the new key. Alternatively, some ESPs auto-rotate and the new selector just needs to be published.</p>

<h3>Scenario: SPF failing despite correct record</h3>
<p>Your ESP may have changed their sending infrastructure. Check their current SPF documentation to confirm the <code>include:</code> value is still correct. Also check for duplicate SPF records — only one <code>v=spf1</code> record is allowed.</p>

<h3>Scenario: Everything looks correct but still in spam</h3>
<p>Auth passes but placement is spam — this is a reputation issue, not a DNS issue. Check the <a href="/tools/blacklist">blacklist checker</a> and assess whether the domain needs recovery time or replacement.</p>

<div class="checklist">
<h4>DNS audit checklist</h4>
<ul>
<li>SPF record exists with correct include for your ESP</li>
<li>Only one SPF TXT record (no duplicates)</li>
<li>SPF has under 10 DNS lookups</li>
<li>DKIM record exists for your ESP's selector</li>
<li>DKIM key is 2048-bit RSA or Ed25519</li>
<li>DMARC record exists with rua tag</li>
<li>MX records are present and resolving</li>
<li>Tracking domain CNAME is correct</li>
<li>Tracking domain SSL is working</li>
<li>Domain redirect working (http → https)</li>
</ul>
</div>
`
},

{
  slug: "cold-email-spam-checklist-21-reasons",
  title: "Cold Email Spam Checklist: 21 Reasons Your Emails Aren't Hitting Inbox",
  category: "Spam & Placement",
  readTime: 10,
  excerpt: "A systematic checklist covering every technical, reputation, and behavioral reason cold emails land in spam — organized by category and priority.",
  body: `
<p>When cold emails land in spam, it's rarely one thing. Usually it's a combination of factors that each contribute a small signal — and together tip the filter. This checklist covers all 21 causes, organized by how fixable they are.</p>

<h2>Authentication issues (fix first)</h2>

<p><strong>1. Missing SPF record.</strong> Without SPF, your sending server isn't authorized. This is the most basic authentication failure. Check with the <a href="/tools/spf">SPF checker</a> and add the correct record for your ESP immediately.</p>

<p><strong>2. Broken DKIM signature.</strong> DKIM key not published, wrong selector, or key rotated without updating DNS. Use the <a href="/tools/dkim">DKIM checker</a> to confirm the key exists and is valid.</p>

<p><strong>3. No DMARC record.</strong> Signals that the sender doesn't monitor authentication. Add at minimum <code>v=DMARC1; p=none; rua=mailto:your@email.com</code>.</p>

<p><strong>4. SPF softfail treated as failure.</strong> Some receivers treat <code>~all</code> (softfail) as a negative signal. If possible, use <code>-all</code> (hardfail) once you've verified all authorized sending sources.</p>

<p><strong>5. Multiple SPF records.</strong> Only one <code>v=spf1</code> record is allowed. Having two causes authentication failure. Merge them.</p>

<h2>Domain and IP reputation issues</h2>

<p><strong>6. Listed on Spamhaus ZEN or DBL.</strong> Critical blacklisting that affects delivery to virtually every major provider. Run the <a href="/tools/blacklist">blacklist checker</a> to confirm and submit a delisting request after fixing the root cause.</p>

<p><strong>7. Listed on Barracuda or SURBL.</strong> High-severity blacklisting that significantly impacts inboxing. Same fix as above.</p>

<p><strong>8. Young domain (under 30 days).</strong> New domains have no reputation history. Providers apply extra filtering. Wait at minimum 30 days before cold email sends, 60 days ideally.</p>

<p><strong>9. Domain used primarily for outbound only.</strong> Domains that only send and never receive look like spam infrastructure. Ensure MX records are configured and replies are routing somewhere real.</p>

<p><strong>10. No or broken redirect.</strong> Sending domains should redirect to a real website. A domain that points nowhere or redirects to something suspicious signals spam infrastructure. Check with the <a href="/tools/redirect">redirect checker</a>.</p>

<h2>Sending behavior issues</h2>

<p><strong>11. Volume spike.</strong> Suddenly increasing send volume — even within provider limits — triggers filtering. Always ramp gradually. New inboxes should start at 2–3/day and ramp over 3–4 weeks.</p>

<p><strong>12. High bounce rate.</strong> More than 2–3% hard bounce rate is a serious spam signal. Clean your lists before sending. Verify emails before adding to sequences.</p>

<p><strong>13. Low engagement rate.</strong> If nobody opens, clicks, or replies — providers learn the mail isn't wanted. High-volume sending to low-engagement lists compounds over time.</p>

<p><strong>14. Sending to role accounts.</strong> Emails to info@, admin@, support@ have high spam complaint rates and low engagement. Remove these from cold email lists.</p>

<p><strong>15. Irregular sending patterns.</strong> Sends at 3am, massive batch sends followed by silence, or sends that don't match normal business email patterns all look automated and suspicious.</p>

<h2>Infrastructure issues</h2>

<p><strong>16. Tracking domain proxied through Cloudflare.</strong> The single most common infrastructure mistake. Cloudflare proxying breaks click tracking and can affect deliverability. Set your tracking domain CNAME to DNS Only (grey cloud). Check with the <a href="/tools/tracking-domain">tracking domain checker</a>.</p>

<p><strong>17. Tracking domain on same domain as sending domain.</strong> Click tracking on your primary sending domain risks contaminating your sending reputation with tracking behavior. Use a completely separate domain.</p>

<p><strong>18. No PTR record for sending IP.</strong> Enterprise mail filters check that the sending IP has a reverse DNS record. SMTP setups especially need this. Check with the <a href="/tools/rdns">reverse DNS checker</a>.</p>

<p><strong>19. Sending from more than 3 inboxes per domain.</strong> Too many inboxes per domain concentrates sending patterns and increases domain-level spam signals. Maximum 3 inboxes per domain is the standard guidance.</p>

<h2>Content and technical email issues</h2>

<p><strong>20. Too many links or images.</strong> HTML-heavy emails with multiple tracking links, images, and buttons look like marketing email to spam filters. Cold email should be plain text or near-plain text with at most one link.</p>

<p><strong>21. Spam trigger words in subject or body.</strong> While content is less important than authentication and reputation, certain words and patterns still contribute to filtering. Run the <a href="/tools/subject-check">subject line spam tester</a> to check for obvious triggers.</p>

<h2>How to use this checklist</h2>
<p>Work through the list in order. Authentication issues are the highest priority and the easiest to fix. Reputation issues take longer. Behavior issues require process changes. Use the <a href="/tools/burn-score">burn score calculator</a> to get an overall health rating before and after fixing issues.</p>
`
},

{
  slug: "keep-client-campaigns-running-when-infra-breaks",
  title: "How to Keep Client Campaigns Running When Your Sending Infra Breaks",
  category: "Agency",
  readTime: 9,
  excerpt: "When client campaign infrastructure fails, you have two problems: fixing the technical issue and keeping the campaign running. Here's how to manage both simultaneously.",
  body: `
<p>Deliverability failures during an active client campaign are an agency's worst situation. You're managing technical triage and client communication at the same time, with revenue at risk. Here's how to handle it without losing the client or the campaign.</p>

<h2>First: triage before you communicate</h2>
<p>Before telling the client anything, spend 30 minutes running diagnostics. Nothing is worse than telling a client "your inboxes are burned" only to discover 20 minutes later it was a broken DKIM record that took 5 minutes to fix. Know what you're dealing with before escalating.</p>
<p>Run the diagnostic stack in parallel:</p>
<ul>
<li><a href="/tools/spf">SPF</a>, <a href="/tools/dkim">DKIM</a>, <a href="/tools/dmarc">DMARC</a> checks</li>
<li><a href="/tools/blacklist">Blacklist check</a> on domain and IP</li>
<li><a href="/test">Inbox placement test</a></li>
<li><a href="/tools/tracking-domain">Tracking domain check</a></li>
</ul>
<p>This takes about 10 minutes. Classify the issue: technical (fixable fast) or reputation (needs time or replacement).</p>

<h2>Scenario A: Technical issue</h2>
<p>If auth is broken, a record is missing, or the tracking domain is misconfigured — fix it before pausing the campaign. A technical fix often resolves the placement issue within hours. Retest before resuming sends.</p>

<h2>Scenario B: Reputation damage</h2>
<p>If it's reputation damage — blacklisted, spam complaints, gradual decline — you have a harder decision. The options are:</p>
<ol>
<li><strong>Pause the campaign</strong> while the domain recovers (weeks)</li>
<li><strong>Continue on damaged infrastructure</strong> and accept lower placement (not recommended)</li>
<li><strong>Move the campaign to backup infrastructure</strong> and recover the damaged domain in parallel</li>
</ol>
<p>Option 3 is the professional approach. It requires having backup infrastructure available — which is why every agency should maintain a spare pool of pre-warmed inboxes.</p>

<h2>The backup infrastructure model</h2>
<p>Agencies that never lose campaigns have backup capacity ready before they need it. The standard approach:</p>
<ul>
<li>Maintain 20–30% more inbox capacity than current campaigns require</li>
<li>Keep backup domains pre-warmed and not actively sending</li>
<li>When primary inboxes fail, migrate the campaign to backup inboxes within hours</li>
<li>Begin recovery of damaged inboxes in background</li>
</ul>
<p>The cost of maintaining backup capacity is significantly less than the cost of losing a client campaign. Use the <a href="/tools/infra-calc">infrastructure calculator</a> to determine how much backup capacity your campaign portfolio needs.</p>

<h2>Client communication framework</h2>
<p>Be honest, be technical, and have a solution ready before you call.</p>

<p><strong>What not to say:</strong> "Your inboxes got burned." This is vague, alarming, and makes it sound like permanent damage.</p>

<p><strong>What to say:</strong> "We identified a deliverability issue affecting [X] of your sending accounts. We've diagnosed the root cause as [technical issue / reputation damage]. We're moving the campaign to backup infrastructure now so sends can continue, and we're working on recovering the affected accounts in parallel. I'll send you a technical summary today and an update in 48 hours."</p>

<h2>Running campaigns on backup infrastructure</h2>
<p>When migrating to backup inboxes mid-campaign:</p>
<ul>
<li>Exclude any prospects who already received emails from the damaged inboxes</li>
<li>Maintain the same sending limits on the new inboxes (don't spike volume)</li>
<li>Run a placement test on the backup inboxes before sending any campaign emails</li>
<li>Monitor open rates and bounce rates closely for the first 48 hours</li>
</ul>

<blockquote><p>Agencies that rely on <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> for backup capacity can migrate campaigns within hours because the inboxes are already warmed and ready to send. Without pre-warmed backup infrastructure, recovery takes weeks — which is almost never acceptable for active client campaigns.</p></blockquote>
`
},

{
  slug: "recovery-vs-replacement-prewarmed-inboxes",
  title: "Recovery vs Replacement: When Prewarmed Inboxes Make More Sense",
  category: "Warmup & Recovery",
  readTime: 8,
  excerpt: "The decision to repair or replace is fundamentally about time. Here's how to make the calculation correctly — including the hidden costs most operators ignore.",
  body: `
<p>Every damaged inbox forces a choice: invest time in recovery or invest money in replacement. Most operators default to one without properly calculating the other. Here's how to think about it.</p>

<h2>The cost of recovery</h2>
<p>Recovery is not free. It requires:</p>
<ul>
<li><strong>Technical fix time</strong>: diagnosing and fixing auth issues, submitting blacklist removals, cleaning lists</li>
<li><strong>Recovery period</strong>: 2–12 weeks depending on damage severity, during which the inbox sends at reduced volume or not at all</li>
<li><strong>Campaign revenue at risk</strong>: for each week a campaign is paused or underperforming, client results decline</li>
<li><strong>Monitoring time</strong>: recovery isn't passive — you're retesting, adjusting, and watching metrics throughout</li>
</ul>

<h2>The cost of replacement</h2>
<p>Replacement costs:</p>
<ul>
<li><strong>Domain purchase</strong>: typically $10–20 per domain</li>
<li><strong>Inbox setup</strong>: monthly cost of new accounts</li>
<li><strong>Warmup time</strong>: 4–6 weeks if warming from scratch, or upfront cost of pre-warmed inboxes</li>
<li><strong>Campaign migration</strong>: time to reconfigure sequences on new infrastructure</li>
</ul>

<h2>When recovery wins</h2>
<p>Recovery makes more sense when:</p>
<ul>
<li>The issue is a fixable technical problem (broken auth, misconfigured tracking)</li>
<li>Campaigns can pause without significant client impact</li>
<li>The damaged inbox pool is small (under 10% of total capacity)</li>
<li>Blacklisting is on minor RBLs that self-clear within 1–2 weeks</li>
</ul>

<h2>When replacement wins</h2>
<p>Replacement makes more sense when:</p>
<ul>
<li>Active client campaigns need continuous sending</li>
<li>Recovery timeline exceeds the campaign window</li>
<li>Domain is on Spamhaus or has significant complaint history</li>
<li>The inbox has been sending for 6+ months without rotation</li>
<li>Multiple inboxes failed simultaneously (suggesting systemic infrastructure problems)</li>
</ul>

<h2>The pre-warmed inbox calculation</h2>
<p>The comparison that most operators miss is fresh replacement vs pre-warmed replacement. If you replace with fresh inboxes, you're looking at:</p>
<ul>
<li>Domain purchase + setup: day 1</li>
<li>Warmup period: 4–6 weeks</li>
<li>First real campaign send: week 5–7</li>
</ul>
<p>If you replace with pre-warmed inboxes:</p>
<ul>
<li>Deploy: day 1</li>
<li>First real campaign send: day 1 (or day 2 after configuration)</li>
<li>Cost difference: higher upfront, but weeks of campaign revenue preserved</li>
</ul>
<p>For agencies managing active client campaigns, this math almost always favors pre-warmed over fresh. The cost of 4–6 weeks of campaign downtime typically far exceeds the premium for pre-warmed infrastructure.</p>

<h2>The hybrid approach</h2>
<p>The most operationally mature approach is running recovery and replacement in parallel:</p>
<ol>
<li>Immediately deploy pre-warmed replacement inboxes to maintain campaign continuity</li>
<li>Simultaneously begin recovery process on damaged inboxes</li>
<li>Retire recovered inboxes into the backup pool (not back into active campaigns immediately)</li>
<li>Use recovered inboxes for lower-risk campaigns before returning them to primary rotation</li>
</ol>

<p>Use the <a href="/tools/repair-or-replace">repair-or-replace calculator</a> to input your specific situation and get a structured recommendation. Also use the <a href="/tools/recovery-time">recovery time estimator</a> to compare how long each path takes.</p>

<blockquote><p>For agencies that need to keep campaigns running while damaged infrastructure recovers, <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> provides pre-warmed inboxes that can be deployed same-day. This is the fastest path to campaign continuity without waiting through a warmup period.</p></blockquote>
`
},

{
  slug: "cold-email-disaster-recovery-sop",
  title: "The Cold Email Disaster Recovery SOP Every Agency Should Have",
  category: "Agency",
  readTime: 11,
  excerpt: "Every cold email agency will eventually face a deliverability crisis. The agencies that handle it well are the ones who planned for it in advance. Here's the SOP.",
  body: `
<p>Deliverability crises aren't a question of if — they're a question of when. Domains burn, inboxes get flagged, and clients get angry. The agencies that survive these moments without losing clients are the ones who have a documented response process before the crisis happens.</p>

<h2>Part 1: Prevention infrastructure</h2>
<p>The best disaster recovery starts before disaster hits.</p>

<h3>Monitoring baseline</h3>
<p>Run weekly placement tests on every active sending domain. This catches problems before they become crises. A domain that's been steadily in promotions for two weeks is a warning sign; a domain that suddenly drops to spam is a crisis. Weekly testing gives you the early warning signal.</p>

<h3>Backup inbox pool</h3>
<p>Maintain a reserve of pre-warmed inboxes equal to 25–30% of your active inbox pool. These should be warmed, configured correctly, and ready to deploy within hours. This is your emergency capacity — don't use it for normal campaigns.</p>

<h3>Infrastructure segregation</h3>
<p>Never put all of one client's campaigns on the same domain. Spread each client across multiple domains and keep different clients on different domain pools. When one domain fails, it only affects part of one client's campaign — not everything.</p>

<h3>Documentation</h3>
<p>Every client domain should have documented: auth configuration, sending limits, warmup date, sending history, and the current backup infrastructure designated for that client.</p>

<h2>Part 2: Crisis detection</h2>

<h3>Alert triggers</h3>
<p>Define what triggers a deliverability incident for your agency:</p>
<ul>
<li>Open rate drops more than 30% week-over-week on any domain</li>
<li>Bounce rate exceeds 3% in any campaign</li>
<li>Placement test shows spam on any active sending domain</li>
<li>Client reports emails going to spam</li>
<li>ESP dashboard shows sending account warnings</li>
</ul>

<h3>Immediate response (first 30 minutes)</h3>
<ol>
<li>Pause all sequences on the affected infrastructure</li>
<li>Run the full diagnostic stack: auth checks, blacklist check, placement test, tracking domain check</li>
<li>Classify the issue: technical / reputation-recoverable / reputation-replace</li>
<li>Do not communicate with client until classification is complete</li>
</ol>

<h2>Part 3: Resolution paths</h2>

<h3>Path A: Technical fix (resolution in hours)</h3>
<ol>
<li>Fix the broken auth record or tracking configuration</li>
<li>Verify DNS propagation</li>
<li>Rerun placement test to confirm fix</li>
<li>Resume sending if placement test passes</li>
<li>Send client a brief update: issue identified and resolved, no campaign impact</li>
</ol>

<h3>Path B: Reputation recovery (resolution in 2–8 weeks)</h3>
<ol>
<li>Move campaign to backup infrastructure immediately</li>
<li>Submit blacklist delisting requests with documentation</li>
<li>Reduce or halt sending on damaged domain</li>
<li>Begin 2-week pause on damaged inboxes</li>
<li>Retest after 2 weeks; if clean, resume at 20% volume and ramp over 4 weeks</li>
<li>Send client a technical summary (see communication template below)</li>
</ol>

<h3>Path C: Full replacement (resolution in hours with pre-warmed, or 4–6 weeks with fresh)</h3>
<ol>
<li>Deploy backup pre-warmed inboxes to client campaign</li>
<li>Migrate campaign sequences to new infrastructure</li>
<li>Run placement test on new infrastructure before first send</li>
<li>Begin blacklist removal on retired infrastructure (for future use)</li>
<li>Send client update: infrastructure upgraded, campaign continuing</li>
</ol>

<h2>Part 4: Client communication templates</h2>

<h3>Initial communication (within 2 hours of detection)</h3>
<p><em>"We've identified a technical issue affecting deliverability on one of your sending domains. We're investigating and will have a full update within 2 hours. Sequences are paused on the affected domain while we assess."</em></p>

<h3>Technical summary (within 24 hours)</h3>
<p><em>"Root cause: [specific issue — e.g., DKIM key rotation by our ESP wasn't reflected in DNS]. Impact: emails sent from [domain] between [dates] may have had reduced placement rates. Resolution: [fix applied]. Campaign status: migrated to backup infrastructure, sends continuing normally. No action needed from you."</em></p>

<h2>Part 5: Post-mortem</h2>
<p>After every incident, document:</p>
<ul>
<li>What happened and when it was detected</li>
<li>How long between failure and detection</li>
<li>How long between detection and resolution</li>
<li>Campaign impact (emails sent during failure, estimated placement drop)</li>
<li>What would have caught this earlier</li>
<li>What process change prevents this</li>
</ul>
<p>Most agencies experience the same failure modes multiple times because they don't run post-mortems. One documented incident review is worth more than any amount of monitoring setup.</p>

<div class="checklist">
<h4>Pre-crisis readiness checklist</h4>
<ul>
<li>Weekly placement tests scheduled for all active domains</li>
<li>Backup inbox pool maintained at 25–30% of active pool</li>
<li>Each client's domains documented with auth config and limits</li>
<li>Alert triggers defined and monitored</li>
<li>Client communication templates written and accessible</li>
<li>Path A / B / C resolution playbooks documented</li>
<li>Designated person responsible for incident response</li>
</ul>
</div>

<blockquote><p>Agencies that handle crises best are the ones with pre-warmed backup infrastructure already deployed. <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> is one source for pre-warmed inboxes that can be migrated to within hours. The time to set this up is before a crisis — not during one.</p></blockquote>
`
},

{
  slug: "cold-email-setup-checklist-domain-dns-tracking",
  title: "Cold Email Setup Checklist: Domain, DNS, Tracking, and Sending Health",
  category: "DNS & Auth",
  readTime: 8,
  excerpt: "A complete technical setup checklist for cold email infrastructure — everything to verify before the first send.",
  body: `
<p>Most cold email deliverability problems are setup problems. The domain wasn't old enough, DKIM wasn't enabled, the tracking domain was proxied through Cloudflare, or the sending limits were set too high too early. This checklist covers everything to verify before launching campaigns on any domain.</p>

<h2>Domain basics</h2>
<div class="checklist">
<h4>Domain checklist</h4>
<ul>
<li>Domain is 30+ days old (60+ preferred for cold email)</li>
<li>Domain has a visible, working website or redirect to one</li>
<li>Root domain redirects: http → https, root and www both work</li>
<li>SSL certificate is valid and not expiring soon</li>
<li>Domain was purchased from a reputable registrar (not resold/aged domain with unknown history)</li>
<li>Domain expiry is 12+ months away</li>
</ul>
</div>
<p>Check redirect and expiry with <a href="/tools/redirect">redirect checker</a> and <a href="/tools/domain-expiry">domain expiry checker</a>.</p>

<h2>Authentication setup</h2>
<div class="checklist">
<h4>Authentication checklist</h4>
<ul>
<li>SPF record published: verify with <a href="/tools/spf">SPF checker</a></li>
<li>SPF includes the correct source for your ESP</li>
<li>Only one SPF record on the domain</li>
<li>SPF has under 10 DNS lookups</li>
<li>DKIM enabled in your ESP dashboard</li>
<li>DKIM DNS record published and valid: verify with <a href="/tools/dkim">DKIM checker</a></li>
<li>DKIM key is 2048-bit</li>
<li>DMARC record published with rua email: verify with <a href="/tools/dmarc">DMARC lookup</a></li>
<li>MX records configured for reply routing: verify with <a href="/tools/mx">MX checker</a></li>
</ul>
</div>

<h2>Tracking domain setup</h2>
<div class="checklist">
<h4>Tracking domain checklist</h4>
<ul>
<li>Tracking domain is a completely separate domain from sending domain</li>
<li>Tracking domain CNAME points to correct ESP destination</li>
<li>Tracking domain is NOT proxied through Cloudflare (grey cloud, not orange)</li>
<li>Tracking domain has valid SSL</li>
<li>Tracking domain does not have MX records (tracking only, not receiving)</li>
</ul>
</div>
<p>Verify with the <a href="/tools/tracking-domain">tracking domain checker</a>.</p>

<h2>Sending infrastructure setup</h2>
<div class="checklist">
<h4>Sending setup checklist</h4>
<ul>
<li>Maximum 3 inboxes per sending domain</li>
<li>Each inbox has been warmed for 21+ days</li>
<li>Sending limits configured within safe caps (GWS: 15/day, M365: 10/day, Azure: 2/day)</li>
<li>Reply routing tested and working</li>
<li>Bounce notification routing configured</li>
<li>Unsubscribe/opt-out mechanism in place</li>
</ul>
</div>

<h2>Pre-send health checks</h2>
<div class="checklist">
<h4>Pre-launch checklist</h4>
<ul>
<li>Domain not listed on any major blacklist: check with <a href="/tools/blacklist">blacklist checker</a></li>
<li>Inbox placement test passes (inbox or promotions, not spam): test at <a href="/test">/test</a></li>
<li>Sending IP has PTR record: check with <a href="/tools/rdns">rDNS checker</a> (especially for custom SMTP)</li>
<li>List has been cleaned and verified before first send</li>
<li>Sequence daily send caps are within warmup limits</li>
</ul>
</div>

<h2>Running the full setup audit</h2>
<p>The <a href="/tools/launch-checklist">interactive launch checklist</a> combines all of these checks in one place with links to each tool. Work through it before launching any new domain or after making significant infrastructure changes.</p>
`
},

{
  slug: "google-workspace-deliverability-problems-causes-fixes",
  title: "Google Workspace Deliverability Problems: Causes, Fixes, and Recovery",
  category: "Google Workspace",
  readTime: 10,
  excerpt: "A comprehensive guide to every Google Workspace deliverability issue — from initial setup problems to long-term reputation recovery.",
  body: `
<p>Google Workspace is the dominant platform for cold email infrastructure — which means Google's spam filters are specifically tuned to recognize cold email patterns from GWS accounts. This guide covers every common GWS deliverability problem, what causes each one, and how to fix it.</p>

<h2>Category 1: Initial setup problems</h2>

<h3>DKIM not enabled</h3>
<p>The most common GWS setup error. DKIM doesn't activate automatically when you set up GWS — you must enable it in the Admin Console and publish the DNS record. Without DKIM, every email from the domain fails signature verification.</p>
<p><strong>Fix:</strong> Google Admin Console → Apps → Google Workspace → Gmail → Authenticate email. Enable DKIM, then publish the provided TXT record to your DNS. The selector is <code>google</code>. Verify with the <a href="/tools/dkim">DKIM checker</a>.</p>

<h3>Wrong SPF record</h3>
<p>GWS requires: <code>v=spf1 include:_spf.google.com ~all</code>. Operators sometimes use an outdated or incorrect include, or accidentally include both GWS and another provider without merging the records.</p>
<p><strong>Fix:</strong> Use the <a href="/tools/spf">SPF checker</a> to verify. If the include is wrong, update the record. If there are multiple SPF records, merge them.</p>

<h3>Domain too new</h3>
<p>Google applies extra scrutiny to domains that start sending immediately after creation. The recommended minimum age before cold email is 30 days; 60 days is more conservative and safer.</p>
<p><strong>Fix:</strong> Wait. There's no shortcut for domain age. Use the time to complete the rest of setup and warmup correctly.</p>

<h2>Category 2: Warmup and sending problems</h2>

<h3>Sending too fast in early weeks</h3>
<p>New GWS inboxes that hit their maximum limit (15/day) on week 1 trigger Gmail's anomaly detection. The safe ramp is 3 → 7 → 12 → 15 per day over 4 weeks.</p>
<p><strong>Fix:</strong> Use the <a href="/tools/send-limits">sending limit planner</a> to configure the correct per-week limits. If you're already over-sending, pause for 3–5 days and resume at the correct volume.</p>

<h3>Too many inboxes per domain</h3>
<p>Running 5–10 inboxes on a single GWS domain concentrates spam signals at the domain level. Gmail sees the domain sending much higher volumes than any individual inbox account suggests.</p>
<p><strong>Fix:</strong> Maximum 3 inboxes per domain. For higher volume needs, add more domains rather than more inboxes per domain.</p>

<h3>Warmup tool interactions only</h3>
<p>Warmup tools that exchange emails only between warmup tool accounts build thin reputation signals. Gmail's filters are sophisticated enough to recognize mechanical warmup patterns.</p>
<p><strong>Fix:</strong> Supplement tool-based warmup with real email interactions — even just a few real exchanges with actual contacts during the warmup period significantly improves reputation quality.</p>

<h2>Category 3: Campaign-triggered problems</h2>

<h3>High bounce rates</h3>
<p>Sending to unverified or stale lists from a GWS inbox damages the sending address reputation quickly. Google tracks bounce rates at the sender level.</p>
<p><strong>Fix:</strong> Verify email lists before every campaign. Remove bounced addresses immediately. Keep hard bounce rate below 2%.</p>

<h3>Spam complaints</h3>
<p>When recipients mark your email as spam in Gmail, it directly signals to Google that your domain's email is unwanted. Google aggregates this data at the domain level.</p>
<p><strong>Fix:</strong> Improve list quality and targeting. Ensure unsubscribe works. Consider checking Google Postmaster Tools if you have enough volume — it shows complaint rates.</p>

<h3>Low engagement</h3>
<p>Gmail tracks what happens to emails from your domain. If nobody opens, nobody replies, and nobody marks as not-spam — Gmail learns your email isn't wanted.</p>
<p><strong>Fix:</strong> Better targeting reduces this over time. Short-term, there's no quick fix for engagement history.</p>

<h2>Category 4: Recovery</h2>

<h3>Recovery for auth-only issues</h3>
<p>If the spam placement was caused by broken DKIM or SPF — fix the record, wait 24–48 hours for propagation, then retest. Recovery is fast (days, not weeks).</p>

<h3>Recovery for reputation damage</h3>
<p>If auth is fine but placement is spam, it's reputation damage. The recovery process:</p>
<ol>
<li>Pause sending on the affected domain for 2 weeks</li>
<li>Fix any auth issues identified in the diagnosis</li>
<li>Submit blacklist delisting requests if listed</li>
<li>Resume at 20–30% of normal volume</li>
<li>Ramp slowly over 6–8 weeks</li>
<li>Retest with a placement test every 2 weeks</li>
</ol>

<h3>When to replace GWS inboxes</h3>
<p>Replace when: the domain is blacklisted on Spamhaus, has a 6+ month history of aggressive sending, has documented spam complaints, and campaigns need to continue. Use the <a href="/tools/repair-or-replace">repair-or-replace calculator</a> to make the call.</p>
`
},

{
  slug: "microsoft-365-cold-email-setup",
  title: "How to Set Up Microsoft 365 for Better Cold Email Inboxing",
  category: "Microsoft 365",
  readTime: 8,
  excerpt: "M365 has different setup requirements than Google Workspace. Here's the correct configuration and the mistakes that cause M365 cold emails to land in spam.",
  body: `
<p>Microsoft 365 setup for cold email has several non-obvious requirements that catch operators off guard. The default M365 configuration is optimized for internal business email, not outbound cold email. Here's what to change and verify.</p>

<h2>The correct M365 authentication setup</h2>

<h3>SPF record</h3>
<p>M365 requires a specific SPF include: <code>v=spf1 include:spf.protection.outlook.com -all</code>. Note the <code>-all</code> rather than <code>~all</code> — Microsoft's own documentation recommends hardfail for M365 domains. If you're sending through additional infrastructure (like a warmup tool), add their include before the <code>-all</code>: <code>v=spf1 include:_spf.google.com include:spf.protection.outlook.com -all</code> (if you ever forward through other services).</p>

<h3>DKIM setup</h3>
<p>DKIM is not enabled by default in M365. You must enable it in Microsoft 365 Defender:</p>
<ol>
<li>Go to security.microsoft.com</li>
<li>Email & Collaboration → Policies & Rules → Threat Policies → DKIM</li>
<li>Select your domain → Enable</li>
<li>Publish both CNAME records Microsoft provides to your DNS (selector1 and selector2)</li>
</ol>
<p>Verify publication with the <a href="/tools/dkim">DKIM checker</a> — look for selector1 and selector2.</p>

<h3>DMARC record</h3>
<p>Add: <code>v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com</code>. Start with none and monitor. Verify with <a href="/tools/dmarc">DMARC lookup</a>.</p>

<h2>M365-specific sending limits</h2>
<p>M365 has lower safe sending limits for cold email than GWS:</p>
<ul>
<li>Maximum recommended: 10 sends per inbox per day for cold email</li>
<li>Week 1 warmup: 2–3 per day</li>
<li>Week 2: 4–6 per day</li>
<li>Week 3: 7–9 per day</li>
<li>Week 4+: 10 per day</li>
</ul>
<p>Microsoft's technical limit is higher, but the safe cold email limit is much lower. Use the <a href="/tools/send-limits">sending limit planner</a> with M365 selected to configure your warmup ramp.</p>

<h2>Domain requirements for M365 cold email</h2>

<h3>Domain age</h3>
<p>Microsoft applies stricter filtering to new domains than Google does. The minimum recommended domain age for M365 cold email is 30–60 days. New M365 accounts on fresh domains are very likely to land in spam during the first few weeks.</p>

<h3>MX record configuration</h3>
<p>When you set up M365, your domain's MX record should point to Microsoft's mail servers (<code>yourdomain-com.mail.protection.outlook.com</code>). This is typically set up automatically during M365 setup, but verify it with the <a href="/tools/mx">MX checker</a>.</p>

<h3>Reply handling</h3>
<p>Ensure the M365 inbox is actually monitored or has forwarding configured. Sending domains that never receive replies are flagged as spam infrastructure. Set up a catch-all or monitor the inbox actively.</p>

<h2>Common M365 cold email problems</h2>

<h3>Outlook filtering Outlook</h3>
<p>When both sender and recipient use Microsoft products, the filtering is applied twice — once at send and once at receive via Exchange Online Protection. M365-to-M365 delivery is notably harder than M365-to-Gmail. If your target audience is heavy Outlook users, consider whether GWS might outperform M365 for those sequences.</p>

<h3>ATP Safe Links interference</h3>
<p>Microsoft's Advanced Threat Protection can rewrite and scan links in emails. If your tracking domain isn't configured correctly or doesn't respond fast enough, ATP can cause link failures. Ensure your tracking domain has fast response times and valid SSL.</p>

<h3>Conditional access policies</h3>
<p>Some M365 accounts have conditional access policies that restrict sending behavior. If your account was set up with enterprise-level security policies, those might interfere with cold email sending patterns. Check with your IT administrator or M365 admin console.</p>

<h2>Verifying your M365 setup</h2>
<p>Use the <a href="/tools/launch-checklist">launch checklist</a> to verify all setup elements before sending. For M365 specifically, pay extra attention to DKIM — it's the most commonly misconfigured element and has the largest impact on M365 deliverability.</p>
`
},

{
  slug: "tracking-domains-redirects-technical-mistakes",
  title: "Tracking Domains, Redirects, and Technical Mistakes That Hurt Inboxing",
  category: "DNS & Auth",
  readTime: 8,
  excerpt: "Tracking domains and redirects are where cold email infrastructure silently breaks. Here are the most common technical mistakes and exactly how to fix them.",
  body: `
<p>Authentication gets the attention, but tracking domains and redirects cause an enormous amount of quiet deliverability damage. These are configuration issues that don't show obvious errors — they just gradually hurt your placement until campaigns stop working.</p>

<h2>Tracking domain mistakes</h2>

<h3>Mistake 1: Proxied through Cloudflare</h3>
<p>This is the most common tracking domain mistake. When you set up a tracking domain CNAME in Cloudflare with the proxy enabled (orange cloud icon), Cloudflare intercepts the traffic before it reaches your ESP's tracking server. This breaks click and open tracking — and some ESPs will throw errors or disable tracking for the domain.</p>
<p><strong>Fix:</strong> In Cloudflare, click the orange cloud next to your tracking domain CNAME. It should turn grey (DNS Only). This disables proxying and lets traffic flow directly to your ESP. Verify with the <a href="/tools/tracking-domain">tracking domain checker</a>.</p>

<h3>Mistake 2: Tracking on the same domain as sending</h3>
<p>Using a subdomain of your sending domain (like <code>track.yoursendingdomain.com</code>) for tracking links means that click tracking behavior is associated with your sending domain's reputation. Bad tracking signals affect sending reputation.</p>
<p><strong>Fix:</strong> Purchase a completely separate domain (not a subdomain) for tracking. Something generic works fine — the domain doesn't need to match your brand. Set it up with the correct CNAME for your ESP.</p>

<h3>Mistake 3: No SSL on tracking domain</h3>
<p>If your tracking domain doesn't have a valid SSL certificate, tracking links will be <code>http://</code> rather than <code>https://</code>. Many email clients and security tools flag HTTP links in email as suspicious. Some ESPs will also show errors for invalid SSL on tracking domains.</p>
<p><strong>Fix:</strong> Ensure your tracking domain has a valid SSL certificate. This is usually handled automatically by your ESP when the CNAME is correctly configured. Verify with the <a href="/tools/tracking-domain">tracking domain checker</a>.</p>

<h3>Mistake 4: Tracking domain sharing reputation with problematic domain</h3>
<p>If you're using the same tracking domain across many different sending domains — especially across different clients — a reputation problem with one client's sends can affect tracking for all of them.</p>
<p><strong>Fix:</strong> Ideally, each client has their own tracking domain. At minimum, high-risk clients (aggressive volume, questionable list quality) should be on their own tracking infrastructure.</p>

<h2>Redirect mistakes</h2>

<h3>Mistake 5: Sending domain doesn't redirect at all</h3>
<p>A domain that doesn't respond to HTTP requests looks like it's not a real website. Spam filters use this as a negative signal. Your sending domain should redirect to something — even a simple landing page is fine.</p>
<p><strong>Fix:</strong> Set up a redirect from your sending domain to your main business website, or create a simple landing page. Check that the redirect works with the <a href="/tools/redirect">redirect checker</a>.</p>

<h3>Mistake 6: HTTP doesn't redirect to HTTPS</h3>
<p>All email links should resolve over HTTPS. If your domain doesn't force HTTPS, some links in your emails may be flagged. Also a basic hygiene issue that affects trust signals.</p>
<p><strong>Fix:</strong> Ensure both <code>http://yourdomain.com</code> and <code>http://www.yourdomain.com</code> redirect to <code>https://yourdomain.com</code>. Verify with the <a href="/tools/redirect">redirect checker</a>.</p>

<h3>Mistake 7: Redirect chains</h3>
<p>Multiple redirects before reaching the final destination slow down link resolution and can look suspicious to security tools. Email security scanners that follow redirect chains may flag long chains as suspicious.</p>
<p><strong>Fix:</strong> Ensure your redirect goes directly from http to https without intermediate redirects. A chain like http → http://www → https://www → https is unnecessarily long and should be collapsed.</p>

<h3>Mistake 8: Redirect pointing to a broken or parked page</h3>
<p>Sending domains that redirect to parked domain pages or 404 pages signal that the domain was purchased and configured without a real business purpose — classic spam infrastructure behavior.</p>
<p><strong>Fix:</strong> Ensure the destination of your redirect is a real, working page. A simple redirect to your business homepage is sufficient.</p>

<h2>Running the full technical check</h2>
<p>The <a href="/tools/tracking-domain">tracking domain checker</a> and <a href="/tools/redirect">redirect checker</a> handle most of these in one pass. For a comprehensive technical audit, work through the <a href="/tools/launch-checklist">launch checklist</a> which includes all of these elements with links to each specific tool.</p>
`
},

{
  slug: "domain-warmup-after-infra-reset",
  title: "Domain Warm-Up for Cold Email: What to Do After an Infra Reset",
  category: "Warmup & Recovery",
  readTime: 8,
  excerpt: "Resetting your sending infrastructure — new domains, new inboxes — is the right move when existing infra is burned. Here's how to build the new setup correctly from day one.",
  body: `
<p>You've made the decision to replace burned infrastructure with fresh domains and inboxes. Done correctly, you'll have campaigns running cleanly within 4–6 weeks. Done wrong, you'll burn the new infrastructure before campaigns even start. Here's the right approach.</p>

<h2>Before you buy new domains</h2>
<p>The most important thing to do before purchasing replacement domains is understanding <em>why</em> the previous infrastructure burned. If you don't fix the root cause — list quality, sending volume, authentication issues, or tracking configuration — you'll burn the new domains on the same timeline as the old ones.</p>

<p>Root causes to identify and fix before reset:</p>
<ul>
<li>Was list quality the problem? (high bounce rates, complaints)</li>
<li>Was sending volume too high? (volume spikes, too many inboxes per domain)</li>
<li>Was tracking configured incorrectly? (Cloudflare proxy, domain sharing)</li>
<li>Was authentication broken? (missing DKIM, SPF issues)</li>
</ul>

<h2>New domain selection and setup</h2>

<h3>Domain selection</h3>
<ul>
<li>Buy from reputable registrars (Namecheap, GoDaddy, Google Domains)</li>
<li>Avoid aged domains with unknown history unless from a verified source</li>
<li>The domain doesn't need to be creative — it needs to be clean</li>
<li>Create a basic website or redirect to your business site</li>
<li>Set up professional email hosting (GWS, M365, or custom SMTP)</li>
</ul>

<h3>Authentication setup (day 1)</h3>
<p>Do this before any warmup send:</p>
<ol>
<li>SPF: <code>v=spf1 include:[your-esp-include] ~all</code></li>
<li>DKIM: enable in your ESP, publish DNS record, verify with <a href="/tools/dkim">DKIM checker</a></li>
<li>DMARC: <code>v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com</code></li>
<li>MX: configure for reply receipt</li>
<li>Redirect: http → https, both root and www</li>
</ol>
<p>Verify all of these before the first warmup email. Use the <a href="/tools/warmup-ready">warmup readiness checker</a>.</p>

<h3>Tracking domain setup</h3>
<p>Set up a fresh tracking domain — separate from your sending domain. Configure the CNAME for your ESP without Cloudflare proxying. Verify SSL is working. Check with the <a href="/tools/tracking-domain">tracking domain checker</a>.</p>

<h2>The warmup process</h2>

<h3>Week 1 (days 1–7)</h3>
<ul>
<li>2–3 emails per day per inbox</li>
<li>Use warmup tool to establish initial sending pattern</li>
<li>Supplement with real exchanges where possible</li>
<li>Monitor bounce rates — should be near zero at this stage</li>
</ul>

<h3>Week 2–3 (days 8–21)</h3>
<ul>
<li>Ramp to 5–8 emails per day</li>
<li>Continue warmup tool sends</li>
<li>Run a placement test at end of week 2</li>
<li>If test shows spam — pause and diagnose immediately</li>
</ul>

<h3>Week 4+ (days 22+)</h3>
<ul>
<li>Ramp to provider limit (GWS: 15/day, M365: 10/day)</li>
<li>Run placement test before first live campaign</li>
<li>Start campaigns at 50% of normal volume for the first week</li>
<li>Monitor bounce and open rates closely</li>
</ul>

<h2>What to do with old infrastructure</h2>
<p>Don't abandon burned domains — use them productively:</p>
<ul>
<li>Submit blacklist delisting requests immediately</li>
<li>Fix any authentication issues</li>
<li>Let them sit for 4–8 weeks while new infrastructure warms up</li>
<li>After delisting is confirmed and reputation has had time to recover, add to backup pool</li>
<li>Use recovered domains for lower-risk sequences (follow-ups, not initial outreach)</li>
</ul>

<blockquote><p>If your campaign timeline can't accommodate a 4–6 week warmup, pre-warmed inboxes from <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> are the alternative. They skip the warmup period entirely — but the infrastructure hygiene (auth, tracking, limits) still needs to be correct for them to maintain their placement quality.</p></blockquote>
`
},

{
  slug: "agency-build-backup-infrastructure",
  title: "How Cold Email Agencies Should Build Backup Infrastructure Before Disaster Hits",
  category: "Agency",
  readTime: 9,
  excerpt: "The agencies that handle deliverability crises without losing clients are the ones with backup infrastructure already in place. Here's how to build it.",
  body: `
<p>Every cold email agency that operates at scale will eventually face a deliverability crisis. A domain gets burned, a batch of inboxes gets flagged, or an ESP changes their sending infrastructure and breaks something. How quickly you can recover depends almost entirely on whether you prepared in advance.</p>

<h2>The case for pre-built backup infrastructure</h2>
<p>Most agencies don't build backup capacity until after they've lost a client campaign. That's the wrong time to learn the lesson. The math is simple:</p>
<ul>
<li>A domain that burns and needs a fresh warmup costs you 4–6 weeks of campaign downtime</li>
<li>A pre-warmed backup domain costs you the monthly account fee, sitting idle until needed</li>
<li>One client campaign lost to preventable downtime costs far more than months of idle backup infrastructure</li>
</ul>

<h2>How much backup capacity to maintain</h2>
<p>The standard guidance for cold email agencies:</p>
<ul>
<li><strong>25–30% backup</strong>: If you have 100 active inboxes across clients, maintain 25–30 warmed backup inboxes</li>
<li><strong>Per-client minimum</strong>: Each client's campaign should have at least one backup domain ready</li>
<li><strong>High-volume clients</strong>: Clients with 20+ active inboxes should have 30–40% backup capacity</li>
</ul>
<p>Use the <a href="/tools/infra-calc">infrastructure calculator</a> to determine the right numbers for your portfolio size.</p>

<h2>Backup infrastructure requirements</h2>
<p>Backup inboxes only work as emergency capacity if they're actually ready to deploy immediately. That means:</p>
<ul>
<li><strong>Fully warmed</strong>: at least 21 days of warmup, ideally 30+</li>
<li><strong>Auth configured</strong>: SPF, DKIM, DMARC all verified and working</li>
<li><strong>Correctly limited</strong>: not currently sending at or near daily limits</li>
<li><strong>Tested</strong>: placement test passing before they're needed</li>
<li><strong>Documented</strong>: you know exactly which backup inbox is designated for which client</li>
</ul>

<h2>Building the backup pool</h2>

<h3>Option A: Maintain your own warmed domains</h3>
<p>Buy extra domains, set them up correctly, warm them, and keep them in a low-volume maintenance state (2–3 sends per day from the warmup tool). This preserves the sending history without using the capacity. Cost: domain + hosting fees + warmup tool sends. Benefit: full control, immediate deployment.</p>

<h3>Option B: Pre-warmed infrastructure from providers</h3>
<p>Purchase pre-warmed inboxes from providers who maintain warmed infrastructure. This eliminates the warmup wait but has a higher upfront cost per inbox. Benefit: deploy same-day, no warmup management required. Best for agencies that need emergency capacity now or want to offload warmup management.</p>

<h3>Option C: Hybrid</h3>
<p>Maintain a small pool of your own warmed domains (for minor issues and client-specific replacements) plus a relationship with a pre-warmed provider (for major crises requiring fast deployment). This gives you coverage across the risk spectrum.</p>

<h2>Maintaining backup infrastructure without degrading it</h2>
<p>The failure mode of option A is letting backup infrastructure go stale. If you warm up backup inboxes and then don't send anything for 2–3 months, the sending history fades and they're effectively cold again. Maintain backup inboxes with:</p>
<ul>
<li>2–3 warmup tool sends per day (keeps the history active)</li>
<li>Monthly placement test to confirm they're still inbox-placing</li>
<li>Quarterly rotation: retire the oldest backup inboxes and add fresh ones</li>
</ul>

<h2>Deploying backup infrastructure</h2>
<p>When you need to deploy backup capacity:</p>
<ol>
<li>Run a placement test on backup inboxes before activating them</li>
<li>Configure the ESP sequences with the backup inboxes</li>
<li>Exclude any prospects who already received email from the failed inboxes</li>
<li>Start at 50% of the backup inbox's daily limit for the first day</li>
<li>Monitor bounce and placement closely for 48 hours</li>
</ol>

<blockquote><p>Agencies that use <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> for their backup pool get pre-warmed inboxes that can be deployed within hours and don't require ongoing warmup maintenance. This is the most operationally efficient approach for agencies managing large client portfolios where downtime is not acceptable.</p></blockquote>
`
},

{
  slug: "real-cost-burned-inboxes-agencies",
  title: "The Real Cost of Burned Inboxes for Cold Email Agencies",
  category: "Agency",
  readTime: 7,
  excerpt: "Most agencies underestimate what a deliverability crisis actually costs. Here's the complete calculation — including the costs most people don't account for.",
  body: `
<p>When a batch of inboxes burns, the obvious cost is the lost infrastructure. But that's usually the smallest part of the total cost. Here's what a deliverability crisis actually costs an agency when you add it all up.</p>

<h2>The direct costs</h2>

<h3>Infrastructure replacement cost</h3>
<p>New domains ($10–20 each), new inbox accounts ($6–15/month each), setup time (30–60 minutes per domain). For an agency replacing 20 burned domains with 3 inboxes each: $200–400 in domains, $360–900/month in new accounts, and 10–20 hours of setup time.</p>

<h3>Warmup period cost</h3>
<p>During the 4–6 week warmup period for fresh replacement domains, those inboxes can't run client campaigns. If you're paying for accounts that aren't generating results, that's a direct cost. Plus ongoing warmup tool fees during this period.</p>

<h2>The indirect costs (usually larger)</h2>

<h3>Campaign performance loss</h3>
<p>For every week a campaign runs on burned infrastructure, you're paying for sends that don't convert. If open rates are 50% of normal, you're effectively running half a campaign and paying full price. If campaigns are paused entirely, results stop while fixed costs continue.</p>

<h3>Client campaign timeline impact</h3>
<p>If a client hired you to generate 50 meetings in 3 months and you lose 6 weeks to a deliverability crisis, you either deliver half the promised results or extend the campaign timeline. Both have cost implications — either reduced fees, contract disputes, or damaged client relationships.</p>

<h3>Client churn risk</h3>
<p>A deliverability crisis that causes visible campaign failure is one of the top reasons cold email clients churn. Losing a client worth $3,000–8,000/month to a $500 infrastructure problem is a bad trade.</p>

<h3>Team time</h3>
<p>Diagnosing, replacing, and managing through a deliverability crisis takes significant team time — often 10–30 hours per incident for a typical agency. At any reasonable hourly rate, this is a significant cost that never appears in the infrastructure line item.</p>

<h2>The full cost calculation</h2>
<p>For a mid-sized cold email agency running campaigns for 10 clients:</p>
<ul>
<li>Direct infrastructure replacement: $500–1,500</li>
<li>Warmup period opportunity cost: $2,000–5,000 in delayed campaign results</li>
<li>Team time: 20–40 hours × hourly rate</li>
<li>Client churn risk: potentially one client at $3,000–8,000/month</li>
</ul>
<p>A realistic total for a significant incident: $10,000–25,000 in combined costs and lost revenue.</p>

<h2>The cost of prevention vs the cost of crisis</h2>
<p>The prevention cost for the same agency:</p>
<ul>
<li>Backup infrastructure (25% extra capacity): $150–400/month</li>
<li>Weekly placement testing: 2–3 hours/month of team time</li>
<li>Pre-warmed inbox access for emergency deployment: $200–600 one-time per incident</li>
</ul>
<p>Total prevention cost: under $1,000/month. Crisis cost: $10,000–25,000 per incident. The math is straightforward.</p>

<h2>What good operational hygiene looks like</h2>
<ul>
<li>Weekly placement tests on all active domains (use <a href="/test">free placement test</a>)</li>
<li>Backup capacity maintained at 25–30% of active pool</li>
<li>Auth checks after any DNS or ESP change</li>
<li>Documented response SOP so team knows what to do immediately</li>
<li>Monthly infrastructure audit using the <a href="/tools/launch-checklist">launch checklist</a></li>
</ul>

<blockquote><p>The most cost-effective approach to inbox burning is preventing unnecessary campaign downtime through pre-warmed backup infrastructure. <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> provides pre-warmed inboxes for emergency deployment — the cost of one incident prevented typically covers months of backup infrastructure cost.</p></blockquote>
`
},

{
  slug: "explain-deliverability-problems-to-clients",
  title: "How to Explain Deliverability Problems to Clients Without Losing Trust",
  category: "Agency",
  readTime: 7,
  excerpt: "Deliverability problems are technical. Clients aren't. Here's how to communicate what happened, what it means, and what you're doing about it — without losing the relationship.",
  body: `
<p>The moment you realize a client's inboxes have a deliverability problem, you have two tasks: fix the problem and manage the client relationship. Most agency operators are strong at the first and weak at the second. Here's how to handle both.</p>

<h2>Timing: diagnose before you communicate</h2>
<p>Don't call the client the moment you detect an issue. Spend 30–60 minutes running diagnostics first. Know whether you're dealing with a fixable technical issue (DKIM broke) or reputation damage (domain burned). The conversation is completely different for each.</p>

<p>A fixable technical issue that you solve before the client notices isn't an incident — it's proactive maintenance. You might never need to tell them. A reputation issue that requires campaign pausing is an incident that requires clear communication.</p>

<h2>What clients actually care about</h2>
<p>Clients don't care about DKIM selectors or RBL listings. They care about:</p>
<ul>
<li>Is my campaign still running?</li>
<li>Am I still getting meetings?</li>
<li>Will this affect my results this month?</li>
<li>Is this my fault?</li>
<li>What are you going to do about it?</li>
</ul>
<p>Your communication should answer these questions clearly, in plain language, before they ask them.</p>

<h2>The communication framework</h2>

<h3>Initial notification (within 2 hours of detection)</h3>
<p>Short, factual, with a clear timeline for full update:</p>
<blockquote><p>"Hi [Client], we've identified a technical issue affecting email deliverability on your campaign. We're diagnosing it now and will have a full update and resolution plan to you within 2 hours. Sends are paused on the affected accounts while we assess. I'll reach out as soon as we know more."</p></blockquote>

<h3>Technical summary (within 24 hours)</h3>
<p>This should cover: what happened, what you're doing, campaign impact, and next steps. Key principles:</p>
<ul>
<li>Take ownership, don't make excuses</li>
<li>Give a plain-English explanation of the technical cause</li>
<li>Be specific about impact (which campaigns, what timeframe)</li>
<li>Be specific about resolution (what you're doing and by when)</li>
<li>If the campaign is continuing on backup infrastructure, lead with that</li>
</ul>

<h3>Template for auth/technical issue</h3>
<blockquote><p>"We identified that a DKIM authentication record for your sending domain stopped working on [date] — this is a technical configuration issue that can happen after email provider updates. As a result, emails sent between [date] and [date] may have had reduced inbox placement. We've fixed the record, verified the fix is working, and campaign sends have resumed. I'm attaching a technical summary for your records. No action needed from you."</p></blockquote>

<h3>Template for reputation damage / infrastructure replacement</h3>
<blockquote><p>"We identified that the sending domain [domain] has developed a deliverability issue related to its reputation with email providers. This can happen as a result of aggressive sending patterns over time. We've moved your campaign to a fresh set of sending accounts, which are already running. The affected domain is going through a recovery process that will take 4–6 weeks. Your campaign continuity is not impacted. I'm scheduling a call to walk you through what we're doing and what we're changing to prevent this going forward."</p></blockquote>

<h2>What not to say</h2>
<ul>
<li>Don't say "your inboxes are burned" without context — it sounds irreversible</li>
<li>Don't blame the email provider, your ESP, or external factors exclusively</li>
<li>Don't promise specific recovery timelines you can't guarantee</li>
<li>Don't give more technical detail than they need — it creates more questions than answers</li>
</ul>

<h2>After resolution: the prevention conversation</h2>
<p>Once the issue is resolved, have a brief call covering:</p>
<ul>
<li>What caused the issue</li>
<li>What you've changed to reduce the risk going forward</li>
<li>What monitoring you've added</li>
<li>What backup capacity you now maintain</li>
</ul>
<p>This conversation is actually an opportunity to demonstrate sophistication and professionalism. Clients who see that you have a serious response process and post-incident review are more likely to trust you with larger campaigns, not less.</p>
`
},

{
  slug: "why-agencies-wait-too-long-replace-burned-accounts",
  title: "Why Most Agencies Wait Too Long to Replace Burned Sending Accounts",
  category: "Agency",
  readTime: 7,
  excerpt: "The decision to replace burned infrastructure is almost always made too late. Here's why — and how to recognize when replacement is overdue.",
  body: `
<p>Burned inboxes don't announce themselves dramatically. They degrade gradually. Open rates slip. Reply rates fall. Placement tests show promotions, then spam. Most agencies keep running campaigns on declining infrastructure for weeks longer than they should, hoping it will improve. Here's why that happens and how to break the pattern.</p>

<h2>Why agencies delay</h2>

<h3>Sunk cost bias</h3>
<p>A domain that was purchased, warmed for 4 weeks, and has been running campaigns for 3 months represents a real investment. Replacing it feels like writing off that investment. But the cost of the replaced domain is already spent — the relevant question is what you're losing by continuing to use it.</p>

<h3>Optimism about recovery</h3>
<p>"Let's see if it gets better." This is natural, but it's often wrong. A domain that's been steadily declining for 3 weeks is unlikely to spontaneously recover. Spam filters don't forget recent behavior, and continuing to send makes the signal worse, not better.</p>

<h3>Underestimating campaign impact</h3>
<p>It's easy to assume that 40% inbox placement is still 40% of results. But it's usually much less. Spam placement doesn't just reduce opens — it accelerates reputation damage, triggers more filtering, and burns through list quality faster (because you're sending more to get the same result).</p>

<h3>Fear of the warmup period</h3>
<p>Replacing means new domains and another 4–6 week warmup. This real cost makes agencies delay. But the delay just extends the period of poor campaign performance, often making it worse than the warmup period would have been.</p>

<h2>The signals that mean replacement is overdue</h2>

<h3>Placement test shows spam</h3>
<p>If your <a href="/test">placement test</a> shows spam and this has been true for more than 2 weeks despite fixing auth — replace. The reputation damage is real and not self-correcting.</p>

<h3>Open rates below 20% on confirmed working content</h3>
<p>If the same content and targeting was working at 40%+ open rates before and is now under 20% — deliverability is the problem, not the copy. Three weeks below 20% with no improvement is a replacement signal.</p>

<h3>Listed on Spamhaus</h3>
<p>A Spamhaus listing is the clearest signal that the domain has a serious reputation problem. Even after delisting, recovery to full cold email inbox placement takes weeks and sometimes months. For active client campaigns, replacement is usually faster.</p>

<h3>Bounce rate above 4%</h3>
<p>Sustained bounce rates above 4% mean you're sending to too many invalid addresses, which is damaging the inbox faster than it was warming. Stop sending and evaluate whether the domain is recoverable.</p>

<h3>Multiple campaigns failing simultaneously on same domain pool</h3>
<p>If every campaign on a domain or domain pool is underperforming at the same time — it's the infrastructure, not the campaign. Replace the infrastructure.</p>

<h2>The right replacement threshold</h2>
<p>Our recommendation: if a domain shows spam placement on a placement test <em>and</em> auth checks pass <em>and</em> it's been more than 2 weeks since the issue started — replace. Don't wait for Spamhaus to confirm what the placement test is already telling you.</p>

<p>Use the <a href="/tools/burn-score">burn score calculator</a> to input your current signals and get an objective assessment. The calculator factors in placement, auth status, blacklisting, bounce rates, and domain age to give you a clear recommendation.</p>

<blockquote><p>The decision to replace should be made on campaign performance math, not on attachment to existing infrastructure. If you need pre-warmed replacement infrastructure that can be deployed without a warmup period, <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> is worth evaluating. But the decision to replace should come first — from data, not from a sales conversation.</p></blockquote>
`
},

{
  slug: "outlook-spam-diagnosis-fixes",
  title: "Outlook Spam Problems in Cold Email: Diagnosis and Fixes",
  category: "Microsoft 365",
  readTime: 8,
  excerpt: "Outlook's spam filters behave differently from Gmail. Here's how to diagnose Outlook-specific deliverability failures and what to fix.",
  body: `
<p>Cold emailers often focus on Gmail deliverability because Gmail is the most visible. But Outlook (including M365 and Outlook.com) uses different filtering logic — and understanding those differences matters if a significant portion of your prospect list uses Microsoft products.</p>

<h2>How Outlook filtering is different from Gmail</h2>

<h3>IP reputation weighted more heavily</h3>
<p>Outlook/Exchange Online Protection (EOP) places more weight on sending IP reputation than Gmail does. If your ESP's IP pool has had recent abuse from other customers, your email can be filtered even if your own sending history is clean.</p>

<h3>Domain reputation and IP reputation evaluated separately</h3>
<p>Gmail tends to weight domain reputation heavily. Microsoft evaluates both domain and IP reputation somewhat independently. This means a clean domain on a problematic shared IP can still have Outlook delivery issues.</p>

<h3>Stricter about organizational email patterns</h3>
<p>Microsoft's filters are tuned for enterprise environments. Email that looks too automated, lacks proper organizational signals (professional domain, clear sender identity), or doesn't follow patterns Microsoft associates with legitimate business email is more aggressively filtered.</p>

<h2>Common Outlook-specific spam placement causes</h2>

<h3>Missing or incorrect DKIM</h3>
<p>Microsoft's EOP is notably strict about DKIM. A failed DKIM signature has a much stronger negative impact on Outlook delivery than on Gmail. Verify both selector1 and selector2 are published with the <a href="/tools/dkim">DKIM checker</a>.</p>

<h3>SPF alignment issues</h3>
<p>Outlook checks that the SPF-authenticated domain aligns with the From header domain. If you're sending from a different domain than the one in your From address (common with some sending tools), alignment will fail even if SPF passes.</p>

<h3>Microsoft SafeLinks interference</h3>
<p>If your recipient's Microsoft account has SafeLinks enabled, all links in your email get scanned. If your tracking domain has SSL issues, is on a reputation list, or responds slowly — SafeLinks can cause delivery problems.</p>

<h3>Sending from a new domain to Outlook users</h3>
<p>Microsoft applies extra scrutiny to email from domains with short histories when sending to Outlook users. The first 30–60 days of a new domain on Outlook recipients are the highest-risk period.</p>

<h3>Shared IP pool issues with some ESPs</h3>
<p>Some ESPs that use shared IP pools for outbound may have those IPs on Microsoft's Sender Reputation Data (SNDS). You can check your sending IP on Microsoft's SNDS (Sender Network Data Services) — if it's flagged, you may need to use a dedicated IP or different sending infrastructure for Outlook-heavy lists.</p>

<h2>Diagnosing Outlook delivery failures</h2>

<h3>Step 1: Check authentication</h3>
<p>Verify DKIM (both selectors for M365), SPF alignment, and DMARC with the <a href="/tools/dkim">DKIM checker</a>, <a href="/tools/spf">SPF checker</a>, and <a href="/tools/dmarc">DMARC lookup</a>.</p>

<h3>Step 2: Run a placement test</h3>
<p>The <a href="/test">placement test</a> sends to a seed inbox and shows where the email lands. Check the headers in the result for Microsoft-specific filtering signals (<code>X-MS-Exchange-Organization</code> headers indicate Microsoft filtering decisions).</p>

<h3>Step 3: Check blacklists</h3>
<p>Run the <a href="/tools/blacklist">blacklist checker</a> on both domain and sending IP. Look specifically at the Spamhaus listings — Microsoft's EOP subscribes to Spamhaus feeds.</p>

<h3>Step 4: Check SNDS</h3>
<p>Go to sendersupport.microsoft.com and check your sending IP's reputation in Microsoft's Sender Network Data Services. If your IP shows as problematic, that's a primary cause of Outlook delivery failure.</p>

<h2>Fixes for Outlook-specific problems</h2>
<ul>
<li><strong>DKIM not working</strong>: enable and verify both selectors through M365 Defender</li>
<li><strong>IP reputation issues</strong>: request dedicated IP from your ESP, or switch to a sending infrastructure with better Outlook IP reputation</li>
<li><strong>SafeLinks interference</strong>: ensure tracking domain has fast response times and valid SSL</li>
<li><strong>New domain filtering</strong>: wait and build sending history; consider starting with non-Outlook prospects while warming domain</li>
</ul>
`
},

{
  slug: "google-workspace-setup-cold-email-correctly",
  title: "How to Set Up Google Workspace Correctly for Cold Email",
  category: "Google Workspace",
  readTime: 8,
  excerpt: "Step-by-step GWS setup for cold email — from domain purchase through first campaign send. Every setting that matters.",
  body: `
<p>Getting Google Workspace set up correctly for cold email has about a dozen steps that all need to be right. Skip one and you're running campaigns with a configuration problem that will show up weeks later as spam placement. Here's the complete setup guide.</p>

<h2>Step 1: Domain selection and purchase</h2>
<ul>
<li>Buy a new domain (or use a domain with at least 30 days of age)</li>
<li>Domain should be related to your business or client's industry — not an obvious spam pattern</li>
<li>Set up a basic redirect to your main website from the sending domain</li>
<li>Ensure redirect is http → https and both root and www work (<a href="/tools/redirect">verify here</a>)</li>
</ul>

<h2>Step 2: Google Workspace account setup</h2>
<ul>
<li>Create a GWS account on the domain (Business Starter is sufficient for cold email)</li>
<li>Use a professional email address format: firstname@domain.com or firstname.lastname@domain.com</li>
<li>Maximum 3 email accounts per domain for cold email</li>
<li>Connect the domain to GWS and verify ownership via DNS</li>
</ul>

<h2>Step 3: SPF configuration</h2>
<p>Add this TXT record to your domain DNS:</p>
<p><code>v=spf1 include:_spf.google.com ~all</code></p>
<p>Verify with the <a href="/tools/spf">SPF checker</a>. If you're also sending through other services, add their includes before the <code>~all</code>. Never have more than one <code>v=spf1</code> record.</p>

<h2>Step 4: DKIM activation</h2>
<ol>
<li>Google Admin Console → Apps → Google Workspace → Gmail → Authenticate email</li>
<li>Select your domain</li>
<li>Click "Generate new record"</li>
<li>Copy the provided DNS record (it's a TXT record for <code>google._domainkey.yourdomain.com</code>)</li>
<li>Add this record to your domain DNS</li>
<li>Wait 10–15 minutes for DNS to propagate</li>
<li>Return to Google Admin and click "Start authentication"</li>
<li>Verify with the <a href="/tools/dkim">DKIM checker</a> — check the "google" selector</li>
</ol>

<h2>Step 5: DMARC setup</h2>
<p>Add this TXT record for <code>_dmarc.yourdomain.com</code>:</p>
<p><code>v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com</code></p>
<p>Start with <code>p=none</code> — this monitors without filtering. After 2–4 weeks of clean data, you can move to <code>p=quarantine</code>. Verify with the <a href="/tools/dmarc">DMARC lookup</a>.</p>

<h2>Step 6: Tracking domain setup</h2>
<ul>
<li>Purchase a separate domain (not a subdomain of your sending domain)</li>
<li>Add the CNAME record your ESP specifies (e.g., <code>track.yourcoldemaildomain.com CNAME [esp-tracking-host]</code>)</li>
<li>In Cloudflare: set to DNS Only (grey cloud, not orange)</li>
<li>Verify CNAME and SSL with the <a href="/tools/tracking-domain">tracking domain checker</a></li>
</ul>

<h2>Step 7: Warmup configuration</h2>
<ul>
<li>Connect the GWS inbox to your warmup tool</li>
<li>Set sending limits in your warmup tool: 3 per day in week 1</li>
<li>Run warmup for 21 days minimum before any live sends</li>
<li>Week 1: 3/day → Week 2: 6/day → Week 3: 10/day → Week 4: 15/day</li>
</ul>

<h2>Step 8: Pre-launch verification</h2>
<p>Before the first live send, run:</p>
<ul>
<li><a href="/test">Inbox placement test</a> — confirm inbox placement, check auth results in output</li>
<li><a href="/tools/blacklist">Blacklist check</a> — confirm clean</li>
<li><a href="/tools/warmup-ready">Warmup readiness check</a> — confirm all signals are green</li>
</ul>
<p>If the placement test shows spam, stop. Diagnose before sending any campaign emails.</p>

<h2>Step 9: Campaign configuration</h2>
<ul>
<li>Configure your ESP to use the GWS inbox (SMTP or API depending on tool)</li>
<li>Set daily send limit in your ESP to 15 (GWS max for cold email)</li>
<li>Ensure the From address matches the GWS account</li>
<li>Configure tracking to use your separate tracking domain</li>
<li>Set reply routing to the GWS inbox</li>
</ul>
<p>Use the <a href="/tools/launch-checklist">launch checklist</a> to verify all of these before the first campaign send.</p>
`
},

{
  slug: "keep-sending-damaged-domain-consequences",
  title: "What Happens if You Keep Sending From a Damaged Domain",
  category: "Warmup & Recovery",
  readTime: 7,
  excerpt: "The temptation to keep sending while hoping deliverability improves is understandable. Here's what actually happens when you do.",
  body: `
<p>When deliverability drops, the temptation is to keep sending and see if it gets better. Sometimes it does — especially if the issue was a temporary technical problem. But if the issue is reputation damage, continuing to send from a damaged domain makes the problem significantly worse. Here's the mechanism.</p>

<h2>How damage compounds</h2>

<h3>Each send reinforces the negative signal</h3>
<p>Email providers use sending patterns to calibrate their models. Every time you send from a domain that's already in spam, you're adding another data point that confirms the pattern. The filter that sees 100 emails landing in spam from your domain is more confident in its filtering decision than the one that saw 50.</p>

<h3>Increased spam complaints</h3>
<p>When emails land in spam, some recipients see them and manually mark them as spam — reinforcing the filter decision. But other recipients never see them and also never report them as legitimate. The net effect: your spam complaint rate stays high while your signal that emails are wanted stays low.</p>

<h3>Bounce rate acceleration</h3>
<p>When a domain is flagged, some mail servers will start rejecting connections outright rather than delivering to spam. These rejections sometimes count as bounces in your ESP. The result: your bounce rate increases as a consequence of spam placement, which then damages your reputation further.</p>

<h3>List quality degradation</h3>
<p>If you're continuing to send to a cold list while in spam, you're burning through your list without getting any results. Prospects who've now received 3 unanswered cold emails (that they never saw) have been wasted. You can't re-contact them effectively on the new, clean domain later without looking like you're contacting them for the first time again.</p>

<h2>The correct behavior after detecting spam placement</h2>
<ol>
<li>Stop sending immediately from the affected infrastructure</li>
<li>Diagnose the root cause (auth, blacklisting, or broader reputation damage)</li>
<li>Fix any technical issues</li>
<li>If it's reputation damage, decide: recover (pause and wait) or replace</li>
<li>If replacing, migrate campaign to backup infrastructure before resuming</li>
<li>Do not resume on the damaged domain until it passes a placement test</li>
</ol>

<h2>How long to pause for recovery</h2>
<p>For minor reputation issues (not blacklisted, short sending history): pause for 1–2 weeks, then resume at 20% of normal volume.</p>
<p>For moderate issues (listed on minor RBLs): pause until delisted, then pause an additional 2 weeks, then ramp very slowly.</p>
<p>For severe issues (Spamhaus listing, complaint history): pause for 4+ weeks minimum. Recovery is slow. Consider whether replacement is faster for active campaigns.</p>

<h2>Testing before resuming</h2>
<p>Before resuming any sends from a domain that was in spam, run a <a href="/test">placement test</a>. Only resume if the placement test shows inbox or promotions. Resuming while still in spam restarts the damage cycle. Use the <a href="/tools/burn-score">burn score</a> to track improvement over the recovery period.</p>

<blockquote><p>If campaigns need to continue during recovery, migrating to backup infrastructure is the only good option. Don't keep sending from a damaged domain because you don't have an alternative — the damage you cause is worse than the short-term campaign interruption. <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> provides pre-warmed alternatives that can be deployed without a warmup period.</p></blockquote>
`
},

{
  slug: "agency-rotate-inboxes-deliverability-slipping",
  title: "How Agencies Should Rotate Inboxes When Deliverability Starts Slipping",
  category: "Agency",
  readTime: 8,
  excerpt: "Inbox rotation is how agencies extend the lifespan of sending infrastructure and avoid reaching crisis points. Here's the rotation framework that works.",
  body: `
<p>The best way to deal with burned inboxes is to never fully burn them in the first place. Proactive inbox rotation — cycling inboxes out of active use before they're damaged — keeps deliverability stable and avoids the crisis-and-replacement cycle that most agencies eventually face.</p>

<h2>Why inboxes degrade over time</h2>
<p>Even with perfect authentication and good list quality, inboxes accumulate reputation signals over time. After 3–6 months of cold email sending, most inboxes will show some decline in placement quality. This is normal — it's not a crisis, but it's a signal to act.</p>

<h2>The rotation model</h2>

<h3>Active pool</h3>
<p>Inboxes currently running campaigns. At full sending limits. Monitored weekly with placement tests.</p>

<h3>Cooldown pool</h3>
<p>Inboxes that showed early warning signs (placement dropping, open rates declining). Removed from active campaigns. Running only warmup-level sends (2–3/day) to maintain history. Being monitored for recovery.</p>

<h3>Backup pool</h3>
<p>Freshly warmed inboxes not yet in active use. Ready to deploy when active inboxes need to rotate out. Should always be 20–30% of active pool size.</p>

<h3>Recovery pool</h3>
<p>Damaged inboxes being rehabilitated. Not sending at all, or minimal sends. Being tested monthly to track recovery progress.</p>

<h2>Rotation triggers</h2>
<p>Move an inbox from active to cooldown when:</p>
<ul>
<li>Placement test shows promotions consistently for 2 weeks (was previously inbox)</li>
<li>Open rates drop more than 25% week-over-week without a list quality explanation</li>
<li>The inbox has been in active cold email use for 4+ months (proactive rotation)</li>
<li>Bounce rate exceeds 3% in any campaign</li>
</ul>
<p>Move from cooldown to recovery when:</p>
<ul>
<li>Placement test shows spam</li>
<li>Inbox is listed on any blacklist</li>
<li>Placement hasn't improved after 3 weeks in cooldown</li>
</ul>

<h2>Rotation schedule</h2>
<p>For a stable agency operation:</p>
<ul>
<li><strong>Monthly</strong>: run placement tests on all active inboxes, identify early warning signals</li>
<li><strong>Quarterly</strong>: proactively rotate out any inbox that's been active for 4+ months, replace with fresh backup pool inboxes</li>
<li><strong>Annually</strong>: full infrastructure audit, retire domains that have accumulated too much negative history regardless of current placement</li>
</ul>

<h2>The early warning system</h2>
<p>Rotation only works if you catch problems early. Set up monitoring:</p>
<ul>
<li>Weekly placement tests on all active sending domains (takes ~5 minutes per domain with the <a href="/test">free placement test</a>)</li>
<li>Open rate tracking broken down by sending domain (not just by campaign)</li>
<li>Bounce rate alerts when exceeding 2.5%</li>
</ul>
<p>Catching a domain at the promotions stage rather than the spam stage gives you a much wider recovery window and avoids emergency replacement situations.</p>

<h2>Building the rotation into client pricing</h2>
<p>Proactive rotation has costs: replacement domain purchase, inbox fees, and some warmup period. Build these into client campaign pricing as infrastructure maintenance — typically 10–15% of total monthly campaign cost. Clients who understand they're paying for proper infrastructure management have better results and longer relationships than clients running the absolute minimum infrastructure.</p>

<blockquote><p>Agencies using <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> for their backup pool can execute rotation faster — pre-warmed inboxes can be deployed immediately rather than requiring 4–6 weeks of warmup. This makes proactive rotation operationally feasible even for smaller agencies that can't maintain large in-house warmup operations.</p></blockquote>
`
},

{
  slug: "authentication-errors-make-good-email-look-bad",
  title: "Why Authentication Errors Make Good Cold Email Look Bad",
  category: "DNS & Auth",
  readTime: 6,
  excerpt: "The best-written cold email lands in spam if authentication fails. Here's why authentication matters more than content for deliverability.",
  body: `
<p>Spam filters don't read your email first. They check credentials first. A perfectly written cold email from a legitimate sender will land in spam if the authentication signals say it shouldn't be trusted. Understanding this changes how you think about deliverability.</p>

<h2>What spam filters actually check first</h2>
<p>Modern spam filters evaluate email in layers. The first layer is always technical authentication — before any content analysis, the filter checks:</p>
<ol>
<li>Is the sending server authorized to send for this domain? (SPF)</li>
<li>Does the cryptographic signature verify? (DKIM)</li>
<li>Do these two checks align with what the domain owner specified? (DMARC)</li>
</ol>
<p>If any of these fail, the filter immediately has reason to be suspicious — regardless of what the email says. The content analysis happens later, and with a lower threshold if auth already failed.</p>

<h2>The trust cascade</h2>
<p>Think of email authentication as a trust cascade:</p>
<ul>
<li><strong>Auth pass + clean reputation</strong>: email gets evaluated primarily on content and engagement history — best placement outcome</li>
<li><strong>Auth pass + questionable reputation</strong>: email is evaluated carefully, borderline cases go to spam</li>
<li><strong>Auth fail + clean reputation</strong>: significant negative signal regardless of content quality</li>
<li><strong>Auth fail + questionable reputation</strong>: spam, almost certainly</li>
</ul>
<p>The practical implication: fixing authentication is almost always the highest-leverage deliverability improvement you can make. It raises the ceiling on what good content and reputation can achieve.</p>

<h2>How auth errors happen silently</h2>
<p>Authentication errors are particularly dangerous because they often happen without any visible signal in your ESP. Your sending tool shows the email as sent. The sequence progresses normally. Nothing appears broken. But on the receiving end, every email is failing authentication and getting filtered.</p>
<p>Common silent failure modes:</p>
<ul>
<li>DKIM key rotated by your ESP but DNS record not updated</li>
<li>SPF record accidentally deleted during domain renewal</li>
<li>Nameserver migration that didn't transfer all DNS records</li>
<li>DMARC record published but with a typo that makes it invalid</li>
</ul>

<h2>Checking authentication results from the receiver side</h2>
<p>The most reliable way to see what the receiving server actually saw is to run a <a href="/test">placement test</a> and read the headers in the result. The authentication results header shows exactly what SPF, DKIM, and DMARC returned — from the receiver's perspective. This is more reliable than checking your DNS records directly, because it captures the full end-to-end verification including what your ESP is actually signing with.</p>

<h2>The content quality trap</h2>
<p>Operators who focus on content quality while ignoring authentication are solving the wrong problem. Even highly personalized, well-targeted cold email will underperform if auth is broken. Conversely, well-authenticated email from a clean domain performs measurably better than the same email from a domain with auth issues — even when the content is identical.</p>
<p>Fix authentication first. Then optimize content. Not the other way around.</p>

<h2>Quick auth fix guide</h2>
<p>Run the <a href="/tools/spf">SPF checker</a>, <a href="/tools/dkim">DKIM checker</a>, and <a href="/tools/dmarc">DMARC lookup</a>. For any failures:</p>
<ul>
<li>SPF missing: add the correct record for your ESP</li>
<li>DKIM missing: re-enable in your ESP and re-publish the DNS record</li>
<li>DMARC missing: add <code>v=DMARC1; p=none; rua=mailto:you@domain.com</code></li>
</ul>
<p>Re-run the placement test after fixing. Auth issues almost always resolve within 24–48 hours of the DNS change propagating.</p>
`
},

{
  slug: "google-workspace-spam-after-scaling",
  title: "Google Workspace Spam Issues After Scaling? Here's What Changed",
  category: "Google Workspace",
  readTime: 7,
  excerpt: "Many GWS cold email setups work well at low volume and break at scale. Here's what changes when you scale and how to maintain deliverability.",
  body: `
<p>One of the most frustrating cold email patterns: GWS campaigns work well for weeks or months, you scale up volume or add more clients, and then deliverability collapses. Here's why this happens and what to do.</p>

<h2>Why scale breaks things</h2>

<h3>Domain-level volume aggregation</h3>
<p>Gmail doesn't just look at individual inbox sending behavior — it aggregates signals at the domain level. If you have 5 inboxes on one domain, each sending 15 emails per day, Gmail sees a domain sending 75 emails per day. That's high enough to trigger more aggressive pattern analysis.</p>
<p>The solution: maximum 3 inboxes per domain, and keep different clients on different domain pools.</p>

<h3>Engagement rate dilution</h3>
<p>When you scale up volume, engagement rates (opens, replies) often stay relatively flat while the send count increases. The result: your engagement rate decreases as a percentage of sends. Gmail tracks this ratio. An inbox that was generating 40% open rates at 10/day and drops to 30% at 15/day is signaling declining engagement quality.</p>

<h3>List quality degradation at scale</h3>
<p>Scaling usually means adding more list sources — and lower-quality list sources. More bounces, more complaints, more role accounts (info@, contact@). Any of these will accelerate the damage to GWS inboxes at scale.</p>

<h3>Warmup shortcuts</h3>
<p>When agencies scale quickly, they often add new inboxes without proper warmup. Inboxes that were run through a 2-week warmup instead of a 4-week warmup start campaign sends earlier than they should, with insufficient reputation history to absorb the sending volume.</p>

<h2>Diagnosing whether scale is the cause</h2>
<p>Compare your metrics before and after scaling:</p>
<ul>
<li>Did open rates decline when volume increased?</li>
<li>Did you add inboxes to existing domains rather than new domains?</li>
<li>Did you add new list sources when scaling?</li>
<li>Were new inboxes warmed for the full 21–30 days?</li>
</ul>
<p>Run a <a href="/test">placement test</a> on each affected domain separately to see which ones are causing the placement issues.</p>

<h2>Fixing scale-related problems</h2>

<h3>Consolidate inboxes per domain</h3>
<p>If you have 5+ inboxes on any single GWS domain — reduce to 3. Migrate the extra inboxes to fresh domains. Yes, this requires setting up new domains and going through warmup again. It's the right fix.</p>

<h3>Review list quality</h3>
<p>Audit bounce rates across all campaigns. If any domain or list source is generating >3% bounces, pause that list and clean it before continuing. Remove role accounts, catch-alls, and unverified addresses.</p>

<h3>Review sending limits</h3>
<p>Use the <a href="/tools/send-limits">sending limit planner</a> to verify that your per-inbox sending limits are within the safe GWS range. If you scaled by increasing limits rather than adding inboxes, reduce limits and add domains instead.</p>

<h3>Enforce warmup standards</h3>
<p>Any new inbox being added to the pool needs 21+ days of warmup before live sends. No exceptions. Check new inboxes with the <a href="/tools/warmup-ready">warmup readiness checker</a> before activating for campaigns.</p>

<h2>Structural recommendation for agencies scaling GWS</h2>
<ul>
<li>Hard limit: 3 inboxes per domain</li>
<li>Client separation: each client has their own domain pool</li>
<li>Warmup standard: minimum 21 days, test before activating</li>
<li>Volume ramp: add new domains to increase volume, not more inboxes per domain</li>
<li>Monitoring: weekly placement tests on all active domains</li>
</ul>
`
},

{
  slug: "recover-damaged-google-workspace-setup",
  title: "How to Recover a Damaged Google Workspace Sending Setup",
  category: "Google Workspace",
  readTime: 8,
  excerpt: "GWS sending setups that have been damaged by spam placement, blacklisting, or aggressive sending can often be recovered — if you follow the right process.",
  body: `
<p>A damaged GWS setup doesn't necessarily mean you need to replace everything. Depending on the severity of the damage, structured recovery can bring inboxes back to acceptable placement within 4–8 weeks. Here's the recovery process.</p>

<h2>Step 1: Full diagnostic</h2>
<p>Before doing anything, understand exactly what's damaged:</p>
<ul>
<li>Run <a href="/tools/spf">SPF</a>, <a href="/tools/dkim">DKIM</a>, <a href="/tools/dmarc">DMARC</a> checks on every domain</li>
<li>Run <a href="/tools/blacklist">blacklist checks</a> on domains and IPs</li>
<li>Run <a href="/test">placement tests</a> on each domain to see current state</li>
<li>Check Google Postmaster Tools (postmaster.google.com) if you have access — it shows domain reputation and spam rates</li>
</ul>
<p>Create a spreadsheet: each domain, its current placement test result, blacklist status, and auth status. This is your recovery baseline.</p>

<h2>Step 2: Fix authentication on everything</h2>
<p>Before any recovery work, ensure every domain has correct auth. A domain can't recover reputation while authentication is broken. Fix any SPF errors, re-enable DKIM where needed, and verify DMARC.</p>

<h2>Step 3: Classify and prioritize</h2>
<p>Not every damaged domain has the same recovery path:</p>
<ul>
<li><strong>Auth-only issue</strong>: fix auth, retest. Often resolves within 48–72 hours.</li>
<li><strong>Minor reputation damage</strong> (not blacklisted, short history): 2–4 week pause, then slow ramp</li>
<li><strong>Moderate damage</strong> (minor blacklisting, medium sending history): 4–6 week recovery process</li>
<li><strong>Severe damage</strong> (Spamhaus, complaint history, long aggressive history): 8+ weeks or replace</li>
</ul>

<h2>Step 4: Pause sending on damaged domains</h2>
<p>Pause all cold email sending on damaged domains immediately. Don't reduce — pause. The exception: you can maintain 2–3 warmup-level sends per day to keep some sending history active. But campaign sends must stop.</p>

<h2>Step 5: Submit blacklist delisting requests</h2>
<p>For each blacklist where your domain or IP appears:</p>
<ul>
<li>Spamhaus: spamhaus.org → removal request form. Requires explaining what caused the listing and what you've changed.</li>
<li>Barracuda: barracudacentral.org/rbl → self-service lookup and removal request</li>
<li>SURBL: surbl.org → contact form</li>
<li>Others: most have self-service removal forms</li>
</ul>
<p>Important: do not submit removal requests until you've fixed the root cause. Most blacklists re-list immediately if the issue continues.</p>

<h2>Step 6: Resume at low volume</h2>
<p>After 2–4 weeks of pause (or after confirmed delisting), resume at low volume:</p>
<ul>
<li>Start at 2–3 sends per day per inbox (same as warmup level)</li>
<li>Focus on your most engaged prospects — people who have previously opened or clicked</li>
<li>Avoid cold, unverified lists during the recovery period</li>
<li>Ramp up by 1–2 sends per week if placement tests show improvement</li>
</ul>

<h2>Step 7: Monitor weekly</h2>
<p>Run a placement test every week during recovery. Track the progression: spam → promotions → inbox. This typically takes 4–8 weeks for moderate damage. Use the <a href="/tools/burn-score">burn score calculator</a> to track signals as they improve.</p>

<h2>Recovery timelines</h2>
<ul>
<li>Auth-only: 1–3 days after fix</li>
<li>Minor reputation: 2–4 weeks</li>
<li>Moderate damage: 4–8 weeks</li>
<li>Severe damage: 8–16 weeks, if recoverable</li>
</ul>

<h2>When to abandon recovery and replace</h2>
<p>If a domain is still in spam after 8 weeks of following this recovery process, and you've confirmed auth is correct and blacklisting was resolved — the domain's reputation history may be too negative to fully recover at cold email volumes. At this point, replace. The recovered domain can join a recovery pool for low-risk use cases (follow-ups, warm contacts) but shouldn't return to primary cold email duty.</p>
`
},

{
  slug: "microsoft-365-when-to-stop-trying-replace",
  title: "When to Stop Trying to Save a Microsoft 365 Setup and Replace It",
  category: "Microsoft 365",
  readTime: 7,
  excerpt: "M365 setups can be harder to recover than GWS when they get damaged. Here's how to know when recovery is realistic and when replacement is the only path.",
  body: `
<p>Microsoft 365 deliverability problems are notoriously persistent. When a GWS inbox develops a reputation issue, the path to recovery is relatively clear and documented. When an M365 setup gets damaged, the recovery process is slower, less transparent, and more likely to result in a recommendation to replace rather than repair.</p>

<h2>Why M365 is harder to recover</h2>

<h3>Less transparency in filtering decisions</h3>
<p>Google provides Postmaster Tools — a dashboard that shows domain reputation, spam rates, and other signals. Microsoft's equivalent (SNDS) is less comprehensive and doesn't give the same level of visibility into why emails are being filtered.</p>

<h3>Microsoft's block lists are conservative</h3>
<p>Getting off Microsoft's internal block lists requires direct engagement with their support team (or through the Sender Support portal). The process is slower and less predictable than most other blacklist removals.</p>

<h3>M365-to-M365 sending dynamics</h3>
<p>When your M365 account has a reputation issue and you're sending to Outlook/M365 recipients — you're being filtered by Microsoft at both ends. This double-filtering makes recovery much harder than GWS, where Gmail's filters are only applied at the receive end.</p>

<h2>Signs that M365 recovery is unlikely</h2>
<ul>
<li>You've been actively sending for 4+ months from the affected accounts</li>
<li>You've had spam complaints logged in your ESP dashboard</li>
<li>Microsoft's SNDS shows your sending IP as "Red" (high complaint rate)</li>
<li>The domain has been rejected by Microsoft Defender ATP</li>
<li>You've been through the Microsoft delisting process and been re-listed within 30 days</li>
<li>Open rates to Outlook recipients specifically are dramatically lower than Gmail recipients</li>
</ul>

<h2>The M365 recovery process (when to try)</h2>
<p>Recovery is worth attempting when:</p>
<ul>
<li>The domain is less than 3 months old</li>
<li>No documented spam complaints</li>
<li>Not listed on Spamhaus or Microsoft's internal lists</li>
<li>Auth is broken but reputation is otherwise intact</li>
</ul>
<p>If these conditions are met, the recovery process is: fix auth, pause for 2 weeks, submit Microsoft Sender Support request if blocked, resume at low volume, ramp slowly over 6–8 weeks.</p>

<h2>When replacement beats recovery</h2>
<p>Replace M365 inboxes when:</p>
<ul>
<li>Active client campaigns can't wait 6–10 weeks for recovery</li>
<li>SNDS shows Red IP rating for your sending infrastructure</li>
<li>You've been listed on Spamhaus</li>
<li>Multiple M365 accounts on the same domain are all failing simultaneously</li>
<li>The issue has persisted for more than 4 weeks despite correct auth and reduced volume</li>
</ul>

<h2>Replacement strategy for M365</h2>
<p>When replacing M365 infrastructure:</p>
<ul>
<li>Consider whether GWS might outperform M365 for your target audience (often yes, unless recipients are predominantly corporate Outlook users)</li>
<li>Purchase fresh domains — don't reuse damaged ones on new accounts</li>
<li>Set up auth correctly before any warmup (including both DKIM selectors)</li>
<li>Warm over 30 days minimum for M365 — longer than GWS</li>
<li>Start at 2–3 sends/day, ramp to 10 maximum over 4 weeks</li>
</ul>

<p>Use the <a href="/tools/repair-or-replace">repair-or-replace calculator</a> with your M365 specifics to get a structured recommendation. And run the <a href="/tools/recovery-time">recovery time estimator</a> to compare how long repair vs replacement will actually take.</p>

<blockquote><p>If replacement is the right call and campaigns are active, <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> can provide pre-warmed inboxes that bypass the warmup period. This is particularly valuable for M365 setups where the warmup timeline is longer than GWS and recovery is less predictable.</p></blockquote>
`
},

{
  slug: "cold-email-domain-reputation",
  title: "What Is Domain Reputation and Why It Determines Your Inbox Placement",
  category: "Spam & Placement",
  readTime: 8,
  excerpt: "Domain reputation is the invisible score that determines where your cold emails land. Here's how it works, what damages it, and how to protect it.",
  body: `
<p>Inbox placement decisions are made before anyone reads your email. By the time a receiving server processes your message, it has already evaluated a reputation score attached to your sending domain. Understanding how that score is built — and what damages it — is the foundation of cold email deliverability.</p>

<h2>What domain reputation actually is</h2>
<p>Domain reputation isn't a single number stored somewhere. It's a dynamic assessment made by each receiving provider based on signals they've collected about your domain. Gmail's reputation assessment of your domain is different from Outlook's — they use different signals weighted differently. But they're evaluating the same underlying behaviors.</p>

<h2>What builds domain reputation</h2>

<h3>Authentication consistency</h3>
<p>Domains that consistently pass SPF, DKIM, and DMARC checks build a record of authentication reliability. This is the baseline — you need this for the other signals to matter.</p>

<h3>Sending consistency</h3>
<p>Domains that send at predictable volumes and times look like legitimate senders. Irregular patterns (large batches, long gaps, then more large batches) look like automated spam behavior.</p>

<h3>Engagement history</h3>
<p>Gmail in particular tracks engagement signals — opens, replies, not-spam clicks, and other interactions — and uses them to calibrate reputation. A domain whose emails are regularly opened and replied to builds positive reputation signals over time.</p>

<h3>Bounce rate history</h3>
<p>A domain with consistently low bounce rates (under 2%) builds a record of sending to verified, valid addresses. A domain with regular high bounce rates signals poor list quality — a common spam characteristic.</p>

<h3>Complaint history</h3>
<p>Spam complaint rates are weighted heavily by both Google and Microsoft. Even a small number of complaints relative to send volume creates a negative signal that persists for weeks or months.</p>

<h2>What damages domain reputation</h2>
<ul>
<li><strong>Sudden volume spikes</strong>: sending 10x normal volume overnight triggers anomaly detection</li>
<li><strong>High bounce rates</strong>: anything above 3–4% starts creating negative signals</li>
<li><strong>Spam complaints</strong>: even 0.1% complaint rates are significant</li>
<li><strong>Authentication failures</strong>: failed SPF or DKIM checks signal that the domain may be compromised or misconfigured</li>
<li><strong>Blacklisting</strong>: being listed on major RBLs is both a symptom and an accelerant of reputation damage</li>
<li><strong>Sending to role accounts or catch-alls</strong>: these have high complaint rates and no real engagement</li>
</ul>

<h2>How reputation is measured in practice</h2>
<p>Google Postmaster Tools (postmaster.google.com) shows your domain reputation as one of four levels: Bad, Low, Medium, or High. Getting to High is the goal for cold email. Most cold email domains operate at Medium — enough for reasonable inbox placement when other signals are good.</p>
<p>Microsoft's equivalent is less granular but accessible through SNDS (sendersupport.microsoft.com).</p>

<h2>Protecting reputation proactively</h2>
<ul>
<li>Rotate inboxes before they accumulate too much negative history (every 4–6 months)</li>
<li>Never send to unverified or stale lists</li>
<li>Keep sending volume within safe daily limits (<a href="/tools/send-limits">sending limit planner</a>)</li>
<li>Run weekly placement tests to catch decline early</li>
<li>Maintain a maximum of 3 inboxes per domain</li>
<li>Ensure authentication is always correctly configured</li>
</ul>

<h2>Reputation and the new domain problem</h2>
<p>New domains have no reputation — which is almost as bad as having bad reputation. Filters treat unknown domains with extra skepticism. This is why warmup (building a sending history before campaigns) is necessary, and why the age of a domain matters. You can't shortcut the trust-building process — you can only do it correctly and wait.</p>
`
},

{
  slug: "email-header-analysis-deliverability",
  title: "Reading Email Headers to Diagnose Deliverability Problems",
  category: "DNS & Auth",
  readTime: 7,
  excerpt: "Email headers contain everything a receiving server saw when processing your email. Learning to read them is the fastest way to diagnose deliverability problems.",
  body: `
<p>Email headers are the technical log of everything that happened to your email between send and delivery. They show you exactly what authentication results the receiving server saw, how the email was routed, and what filtering decisions were made. Knowing how to read them is a superpower for deliverability diagnosis.</p>

<h2>How to get email headers</h2>
<p><strong>Gmail:</strong> Open the email → three dots menu → "Show original." The raw headers are at the top of the message source.</p>
<p><strong>Outlook:</strong> Open the email → File → Properties → Internet headers.</p>
<p><strong>Apple Mail:</strong> View → Message → All Headers.</p>
<p>Alternatively, use the <a href="/tools/header-parser">email header parser</a> — paste the headers and get a structured breakdown of routing, auth results, and issues.</p>

<h2>The key headers to understand</h2>

<h3>Authentication-Results</h3>
<p>This is the most important header for deliverability diagnosis. It shows what SPF, DKIM, and DMARC returned from the receiving server's perspective.</p>
<p>Good result: <code>spf=pass dkim=pass dmarc=pass</code></p>
<p>Problem: <code>spf=fail dkim=neutral dmarc=fail</code></p>
<p>Even if your DNS records look correct, a failing authentication-results header means something isn't working end-to-end. The header shows you what the receiver actually saw.</p>

<h3>Received headers</h3>
<p>Multiple <code>Received:</code> headers show the routing path — each server that handled the email adds one. Reading them from bottom to top shows the path from sender to recipient. An unusual number of hops (5+) or unexpected intermediaries can indicate routing issues.</p>

<h3>X-Spam-Status / X-Spam-Score</h3>
<p>Many receiving servers add a spam score header. A score above 5 typically triggers filtering. If you see a high score and auth is passing — it's a content or reputation issue, not an auth issue.</p>

<h3>X-MS-Exchange headers</h3>
<p>Microsoft Outlook/M365 adds several proprietary headers that indicate how EOP processed the message. These can show if the email hit a specific Microsoft filter.</p>

<h3>Return-Path</h3>
<p>The Return-Path header shows where bounce notifications are sent. If this doesn't match your sending domain or shows an unexpected ESP domain, it can affect spam filtering (SPF alignment depends on this matching your domain).</p>

<h2>Common header patterns and what they mean</h2>

<h3>DKIM=neutral</h3>
<p>The DKIM signature exists but couldn't be verified. This usually means the DNS record wasn't found — the selector in the email doesn't match any published DKIM key. Check with the <a href="/tools/dkim">DKIM checker</a>.</p>

<h3>SPF=softfail</h3>
<p>The sending server wasn't in the authorized list but SPF is set to softfail (<code>~all</code>). This is a yellow flag. Some receivers treat softfail as a negative signal in combination with other issues.</p>

<h3>DMARC=fail</h3>
<p>Neither SPF nor DKIM aligned with the From domain. This is a strong signal that something in your sending setup isn't aligned correctly. Check that your From address domain matches what SPF and DKIM are signing for.</p>

<h3>Long routing chain</h3>
<p>If your email passes through 5+ servers before reaching the recipient, something unusual is happening with routing. Legitimate cold email should have 2–3 hops at most.</p>

<h2>Using the header parser</h2>
<p>Paste your email headers into the <a href="/tools/header-parser">email header parser</a>. It extracts the authentication results, routing path, spam scores, and key headers into a structured view, and flags any issues automatically. This is faster than reading raw headers and catches things that are easy to miss.</p>
`
},

{
  slug: "what-low-inbox-placement-means-agency-campaigns",
  title: "What Low Inbox Placement Actually Means for Agency Campaigns",
  category: "Spam & Placement",
  readTime: 7,
  excerpt: "Low inbox placement doesn't just reduce open rates — it has compounding effects on campaign performance, domain reputation, and client relationships. Here's the full picture.",
  body: `
<p>When cold email placement drops from inbox to promotions or spam, the obvious impact is lower open rates. But that's just the beginning. Low inbox placement has compounding effects that agencies often underestimate until they're deep in a campaign failure.</p>

<h2>The direct impact on campaign metrics</h2>

<h3>Open rates</h3>
<p>Promotions tab placement typically reduces open rates by 50–70% compared to primary inbox. Spam folder placement reduces them by 90%+ — only the most diligent prospects check spam and manually open cold email. For a campaign targeting 60% open rate in inbox, that's 6–20% in spam. All downstream metrics collapse with it.</p>

<h3>Reply rates</h3>
<p>Reply rates drop faster than open rates when placement degrades. Even prospects who find and open the email in spam are less likely to reply — the spam folder context makes the email feel less legitimate regardless of content quality.</p>

<h3>Meeting rates</h3>
<p>If a campaign was generating 2 meetings per 100 contacts in inbox, expect 0.2–0.4 per 100 contacts in spam. The funnel doesn't just shrink — it effectively breaks.</p>

<h2>The compounding effects</h2>

<h3>Sending to spam accelerates reputation decline</h3>
<p>Every send to spam reinforces the filter model that your domain's email is unwanted. The more you send while in spam, the harder recovery becomes. It's a feedback loop: spam placement → more sends to investigate → worse reputation → worse placement.</p>

<h3>Prospect list degradation</h3>
<p>When emails are going to spam, you're burning through your prospect list without getting results. A prospect who received 4 cold emails they never saw is effectively wasted — they've been contacted and you got no response, but they also never had a fair chance to respond.</p>

<h3>Retargeting problems</h3>
<p>When you eventually fix the deliverability issue and want to recontact people who didn't respond — you don't know which ones never saw the email and which ones actually ignored it. This makes follow-up strategy harder.</p>

<h2>The impact on client relationships</h2>

<h3>Invisible underperformance</h3>
<p>The insidious thing about spam placement is that the campaign appears to be running normally in your ESP. Sends are going out, bounces are normal, nothing looks broken. But results are 80% worse than they should be. This creates a difficult client conversation — explaining why 5 weeks of "working" campaigns produced almost nothing.</p>

<h3>Timeline impact</h3>
<p>If a campaign is supposed to generate 30 meetings in 90 days and spends 4 weeks in spam, you might generate 5–8 meetings in that period instead. The remaining 22–25 meetings need to come from the remaining 60 days — requiring significantly higher daily performance that may not be achievable.</p>

<h2>How to catch placement problems early</h2>
<p>The only way to catch placement problems before they damage campaigns is proactive monitoring:</p>
<ul>
<li>Weekly <a href="/test">placement tests</a> on all active sending domains</li>
<li>Open rate tracking broken down by sending domain (not just by campaign)</li>
<li>Bounce rate alerts at the domain level</li>
<li>Monthly auth checks on all active domains</li>
</ul>
<p>Catching a domain at the promotions stage rather than the spam stage gives you time to fix the issue before it becomes a campaign failure.</p>
`
},

{
  slug: "spf-vs-dkim-vs-dmarc-which-breaking-emails",
  title: "SPF vs DKIM vs DMARC: Which One Is Breaking Your Emails?",
  category: "DNS & Auth",
  readTime: 7,
  excerpt: "Authentication failures are the most fixable deliverability problem. Here's how to identify exactly which record is causing your spam placement.",
  body: `
<p>SPF, DKIM, and DMARC all deal with email authentication but they do different things, fail in different ways, and have different impacts on delivery. When you have an authentication-related deliverability problem, identifying which specific record is failing is the fastest path to the right fix.</p>

<h2>Quick diagnostic: what does the placement test show?</h2>
<p>Run a <a href="/test">placement test</a> and look at the authentication results in the output. The receiving server's verdict tells you which checks passed and which failed. This is more reliable than checking your DNS records directly, because it shows end-to-end results including what your ESP is actually doing.</p>

<h2>SPF failures</h2>

<h3>What SPF does</h3>
<p>SPF checks whether the server that sent your email is authorized to send for your domain. It does this by looking up your domain's SPF record and checking if the sending server's IP is listed.</p>

<h3>When SPF fails</h3>
<ul>
<li>Missing SPF record entirely</li>
<li>SPF record doesn't include your ESP's servers</li>
<li>Multiple SPF records (only one is allowed)</li>
<li>SPF has more than 10 DNS lookups</li>
<li>You're sending through an ESP or tool that's not in your SPF record</li>
</ul>

<h3>Impact of SPF failure</h3>
<p>Moderate to high impact on its own. Combined with DKIM failure, very high impact. Spam filters weight SPF failure as a significant negative signal.</p>

<h3>Fix</h3>
<p>Use the <a href="/tools/spf">SPF checker</a> to identify the issue. Most SPF failures resolve by adding the correct include for your ESP or removing duplicate records.</p>

<h2>DKIM failures</h2>

<h3>What DKIM does</h3>
<p>DKIM adds a cryptographic signature to outgoing email. The receiving server verifies this signature against the public key in your DNS. A valid DKIM signature confirms the email came from an authorized source and hasn't been modified.</p>

<h3>When DKIM fails</h3>
<ul>
<li>DKIM not enabled in your ESP</li>
<li>DKIM enabled but DNS record not published</li>
<li>DNS record published but ESP is using a different selector than what's in DNS</li>
<li>DKIM key was rotated in your ESP but DNS wasn't updated</li>
</ul>

<h3>Impact of DKIM failure</h3>
<p>High impact. DKIM is the most important individual auth check for cold email deliverability. A DKIM failure causes immediate spam placement on most providers. This is the highest-priority fix when auth is broken.</p>

<h3>Fix</h3>
<p>Use the <a href="/tools/dkim">DKIM checker</a> — it auto-discovers selectors. If no key is found, DKIM isn't published. Re-enable it in your ESP and add the DNS record. If the key is found but verification fails, the key may not match what your ESP is signing with — regenerate the key in your ESP and update DNS.</p>

<h2>DMARC failures</h2>

<h3>What DMARC does</h3>
<p>DMARC tells receiving servers what to do when SPF or DKIM fails. It also requires alignment — the domain in your From address must match the domain that SPF and DKIM are authenticated for. DMARC failure means either the alignment check failed or SPF and DKIM both failed.</p>

<h3>When DMARC fails</h3>
<ul>
<li>No DMARC record (this shows as "no DMARC" not "fail" — impact varies)</li>
<li>Both SPF and DKIM failed</li>
<li>Alignment failure: sending from a different domain than what SPF/DKIM authenticate</li>
</ul>

<h3>Impact of DMARC failure</h3>
<p>If DMARC is set to <code>p=reject</code> or <code>p=quarantine</code>, a DMARC failure can cause immediate rejection or spam placement. If <code>p=none</code>, the DMARC failure itself doesn't directly filter the email — but the underlying SPF/DKIM failures that caused it do.</p>

<h3>Fix</h3>
<p>Use the <a href="/tools/dmarc">DMARC lookup</a>. If DMARC is failing due to alignment, ensure your From address domain matches your sending domain exactly. If it's failing because SPF and DKIM failed — fix SPF and DKIM first, then DMARC will pass.</p>

<h2>The order of priority</h2>
<ol>
<li><strong>DKIM</strong>: fix first, highest impact</li>
<li><strong>SPF</strong>: fix second, high impact especially in combination with DKIM</li>
<li><strong>DMARC</strong>: fix third, important for alignment and reporting</li>
</ol>
<p>After fixing, rerun the placement test to confirm all three pass. Don't assume DNS changes took effect immediately — allow 10–15 minutes for propagation, then test.</p>
`
},

{
  slug: "cold-email-domain-readiness-check-15-minutes",
  title: "How to Audit a Cold Email Domain Setup in 15 Minutes",
  category: "DNS & Auth",
  readTime: 6,
  excerpt: "A 15-minute checklist for auditing any cold email domain setup before launching campaigns or diagnosing deliverability problems.",
  body: `
<p>Whether you're onboarding a new client, launching a new domain, or diagnosing a deliverability problem — a complete domain audit should take about 15 minutes if you know what to check and have the right tools. Here's the exact process.</p>

<h2>Minutes 0–3: Authentication checks</h2>

<p><strong>SPF check (1 minute)</strong>: Open the <a href="/tools/spf">SPF checker</a>. Enter the sending domain. Confirm: SPF record exists, includes the correct ESP source, no duplicate records, under 10 lookups. Note any failures.</p>

<p><strong>DKIM check (1 minute)</strong>: Open the <a href="/tools/dkim">DKIM checker</a>. Enter the domain (leave selector blank for auto-discovery). Confirm: at least one DKIM record found, key is valid, key is 2048-bit. Note the selector name.</p>

<p><strong>DMARC check (1 minute)</strong>: Open the <a href="/tools/dmarc">DMARC lookup</a>. Confirm: record exists, rua tag is set to a real email address, policy is set (p=none is fine for new domains).</p>

<h2>Minutes 3–6: Infrastructure checks</h2>

<p><strong>Blacklist check (1.5 minutes)</strong>: Open the <a href="/tools/blacklist">blacklist checker</a>. Enter the domain. Confirm: clean on all 16 RBLs. If any hits, note the blacklist name and severity.</p>

<p><strong>Redirect check (1 minute)</strong>: Open the <a href="/tools/redirect">redirect checker</a>. Enter the domain. Confirm: all four variants work (http and https, root and www), no redirect chains, final destination is SSL.</p>

<p><strong>Domain expiry (0.5 minutes)</strong>: Open the <a href="/tools/domain-expiry">domain expiry checker</a>. Confirm: domain has 6+ months until expiry. Flag anything under 30 days as urgent.</p>

<h2>Minutes 6–10: Tracking and sending setup</h2>

<p><strong>Tracking domain check (2 minutes)</strong>: Open the <a href="/tools/tracking-domain">tracking domain checker</a>. Enter the tracking subdomain. Confirm: CNAME is set, NOT proxied through Cloudflare, SSL is working.</p>

<p><strong>MX records (1 minute)</strong>: Open the <a href="/tools/mx">MX checker</a>. Confirm: MX records exist and point to correct mail server. Sending domains should receive mail (important for reply routing and domain legitimacy signals).</p>

<p><strong>rDNS check (1 minute) — for custom SMTP only</strong>: Open the <a href="/tools/rdns">reverse DNS checker</a>. Enter the sending IP. Confirm: PTR record exists and forward-confirms. Skip if using GWS or M365 shared infrastructure.</p>

<h2>Minutes 10–13: Live test</h2>

<p><strong>Inbox placement test (3 minutes)</strong>: Run the <a href="/test">placement test</a>. This tests the full end-to-end sending path using the actual sending infrastructure. Result shows: where it lands (inbox/promotions/spam), authentication results as seen by the receiver. This is the most important check — it integrates everything above into a real-world result.</p>

<h2>Minutes 13–15: Warmup status</h2>

<p><strong>Warmup readiness (2 minutes)</strong>: Use the <a href="/tools/warmup-ready">warmup readiness checker</a>. Answer the questions about domain age, warmup duration, engagement, and spam signals. Confirms whether the inbox is ready for live sends.</p>

<h2>Scoring the audit</h2>
<p>After 15 minutes, you should know:</p>
<ul>
<li>Auth status: pass/fail for SPF, DKIM, DMARC</li>
<li>Reputation status: blacklist clean or issues noted</li>
<li>Infrastructure status: redirect, tracking, MX all working</li>
<li>Readiness status: warmup complete or still in progress</li>
<li>Live placement: inbox, promotions, or spam</li>
</ul>
<p>Any failures in auth or blacklist status are critical fixes. Infrastructure issues are important fixes. Warmup status determines launch readiness.</p>

<p>Use the <a href="/tools/launch-checklist">launch checklist</a> to track all of these in one place with links to each tool.</p>
`
},

{
  slug: "inbox-placement-test-guide-cold-email-agencies",
  title: "Inbox Placement Test Guide for Cold Email Agencies",
  category: "Spam & Placement",
  readTime: 8,
  excerpt: "How to use inbox placement testing as a systematic agency operation — not just a one-time diagnostic, but an ongoing quality control process.",
  body: `
<p>Most agencies run an inbox placement test when something goes wrong. The better approach is treating placement testing as a routine operational process — a weekly check that catches problems before they become crises and keeps campaign performance predictable.</p>

<h2>What placement tests actually measure</h2>
<p>An inbox placement test sends a real email through your actual sending infrastructure and checks where it lands. The result includes:</p>
<ul>
<li>Folder verdict: inbox, promotions, or spam</li>
<li>Authentication results: SPF, DKIM, and DMARC as seen by the receiver</li>
<li>Header analysis: what the receiving server logged</li>
</ul>
<p>This is fundamentally different from spam word checkers or preview tools — those analyze content. A placement test analyzes your actual delivery signal, end-to-end, through your real infrastructure.</p>

<h2>When to run placement tests</h2>

<h3>Routine schedule</h3>
<ul>
<li><strong>Weekly</strong>: all active sending domains, especially high-volume clients</li>
<li><strong>Before any new campaign launch</strong>: confirm domain is in good standing</li>
<li><strong>After any DNS or ESP changes</strong>: confirm changes didn't break anything</li>
<li><strong>After onboarding a new client's domain</strong>: establish baseline before campaigns</li>
<li><strong>After the warmup period</strong>: confirm inbox placement before going live</li>
</ul>

<h3>Diagnostic use</h3>
<ul>
<li><strong>When open rates drop</strong>: before changing copy or targeting</li>
<li><strong>When bounce rates increase</strong>: confirm whether placement is also affected</li>
<li><strong>When a client reports emails in spam</strong>: verify and capture the server verdict</li>
<li><strong>During recovery</strong>: track improvement every 1–2 weeks</li>
</ul>

<h2>How to run tests correctly</h2>
<p>The test must use the same infrastructure as your real campaigns. This means:</p>
<ul>
<li>Send from the same inbox account you use for campaigns</li>
<li>Send through the same ESP or sending tool</li>
<li>Use the same tracking domain</li>
<li>Send with the same From address and email format</li>
</ul>
<p>A test sent from a different account or through a different channel won't reflect your actual campaign delivery.</p>

<h2>Reading test results</h2>

<h3>Inbox + auth pass</h3>
<p>Ideal result. Infrastructure is working correctly. If campaigns are still underperforming, the issue is content, targeting, or timing — not deliverability.</p>

<h3>Promotions + auth pass</h3>
<p>Infrastructure is working but email looks like marketing content to Gmail. Consider: reducing HTML complexity, reducing link count, making email more personal. Not a crisis but worth optimizing.</p>

<h3>Spam + auth fail</h3>
<p>Fix authentication first. Check SPF, DKIM, DMARC. Often resolves within 24–48 hours of fixing DNS records.</p>

<h3>Spam + auth pass</h3>
<p>Reputation issue. Check blacklists. If clean on blacklists, it's softer reputation damage from sending behavior. Recovery path: pause or reduce volume, wait, retest in 2 weeks.</p>

<h2>Building placement testing into your agency workflow</h2>

<h3>Standardize the process</h3>
<p>Create a standard template: what domain is being tested, when, what the result was, what action was taken. Track this over time for each client domain.</p>

<h3>Define alert thresholds</h3>
<p>Any spam result → immediate triage. Promotions result on a domain that was previously inbox → investigate within 48 hours. Same result for 3 consecutive weeks → escalate to client.</p>

<h3>Include in client reporting</h3>
<p>Monthly placement test results are a tangible deliverable that demonstrates proactive infrastructure management. Clients who see regular placement monitoring are more confident in your agency's operational capability.</p>

<h2>Running the test</h2>
<p>Use the <a href="/test">free inbox placement test</a>. The process takes about 3 minutes: enter your domain, send a test email to the provided address, see where it lands. Run it from the same inbox you use for campaigns for accurate results.</p>
`
},

{
  slug: "burned-domain-vs-burned-inbox",
  title: "Burned Domain vs Burned Inbox: How to Tell the Difference",
  category: "Emergency",
  readTime: 7,
  excerpt: "Domain-level damage and inbox-level damage require completely different responses. Here's how to diagnose which one you're dealing with.",
  body: `
<p>When deliverability collapses, operators often say "my inboxes are burned." But sometimes the problem is the domain, not the individual inboxes. And sometimes it's both. Distinguishing between these matters because the fix is different — and replacing the wrong thing wastes time and money.</p>

<h2>Domain-level reputation damage</h2>
<p>Domain reputation is associated with your full domain (e.g., <code>yourcompany.com</code>). Every inbox on a domain shares that domain's reputation. If the domain itself has a reputation problem, all inboxes on it are affected — regardless of which specific inbox sent what.</p>

<p>Signs of domain-level damage:</p>
<ul>
<li>All inboxes on the domain are in spam simultaneously</li>
<li>Even new inboxes added to the domain immediately have placement problems</li>
<li>Domain is blacklisted on major RBLs (Spamhaus, Barracuda)</li>
<li>The problem started around the same time for all inboxes on the domain</li>
</ul>

<h2>Inbox-level reputation damage</h2>
<p>Individual inbox (account) reputation is specific to the email address — e.g., <code>john@yourcompany.com</code>. An inbox can develop bad reputation while the domain remains relatively clean, particularly if one inbox was sending more aggressively or to lower-quality lists than others.</p>

<p>Signs of inbox-level damage:</p>
<ul>
<li>One or two specific inboxes are failing while others on the same domain are fine</li>
<li>The affected inboxes were sending at higher volumes or to riskier lists</li>
<li>Placement test fails for specific inboxes but passes for others on the same domain</li>
</ul>

<h2>How to diagnose</h2>

<h3>Step 1: Test each inbox separately</h3>
<p>Run a <a href="/test">placement test</a> for each inbox on each domain. Send the test from each specific inbox account, not just from the domain in general. Compare results.</p>

<h3>Step 2: Check blacklists</h3>
<p>Run the <a href="/tools/blacklist">blacklist checker</a> on the domain itself and on the sending IP. Domain blacklisting = domain problem. IP blacklisting = may affect all inboxes using that IP.</p>

<h3>Step 3: Check auth at domain level</h3>
<p>Authentication (SPF, DKIM, DMARC) is domain-level. If auth is broken, every inbox on that domain is affected equally.</p>

<h2>The three scenarios and responses</h2>

<h3>Domain damaged, inbox OK</h3>
<p>If domain reputation is the issue (blacklisted, auth failed), you have domain-level work to do. Fix auth, request delisting. All inboxes on this domain are affected. During recovery, migrate campaigns to different domains if continuity is needed.</p>

<h3>Inbox damaged, domain OK</h3>
<p>If specific inboxes are the problem but the domain is clean, you may be able to retire only the affected inboxes and add fresh ones on the same domain. This is the more favorable scenario — the domain reputation survives and recovery is faster.</p>

<h3>Both damaged</h3>
<p>The most common crisis scenario — aggressive sending has damaged both the domain and individual inboxes. In this case, the domain needs full recovery or replacement, and individual inbox history doesn't matter because the domain itself is the primary problem.</p>

<h2>The decision tree</h2>
<ul>
<li>Are all inboxes on one domain failing? → Domain problem → check domain blacklists and auth</li>
<li>Are specific inboxes failing but others on the same domain are fine? → Inbox problem → consider retiring specific inboxes</li>
<li>Is a whole domain pool failing across multiple domains? → Check if IPs are shared, check if there's a common ESP issue</li>
</ul>
<p>Use the <a href="/tools/burn-score">burn score calculator</a> for each domain and inbox combination to get a structured assessment.</p>
`
},

{
  slug: "cold-email-deliverability-collapsed-triage",
  title: "Cold Email Deliverability Collapsed: The Step-by-Step Triage Checklist",
  category: "Emergency",
  readTime: 8,
  excerpt: "Total deliverability collapse across all campaigns needs a different response than a single domain issue. Here's the systematic triage process.",
  body: `
<p>When deliverability collapses across multiple campaigns simultaneously, the cause is usually something systemic — a shared IP issue, an ESP change, a widespread DNS problem, or something affecting your entire infrastructure. Here's how to triage it systematically.</p>

<h2>First 15 minutes: scope the problem</h2>

<h3>Is it one domain or all domains?</h3>
<p>Run placement tests on 3–5 different sending domains. If only one domain is failing — it's a domain-specific issue. If multiple domains are failing simultaneously — it's systemic.</p>

<h3>Is it a provider-specific issue?</h3>
<p>Run placement tests and note which email provider is failing. Is it only Gmail? Only Outlook? Both? Provider-specific failure may indicate a blacklisting with that provider's network specifically.</p>

<h3>When did it start?</h3>
<p>Check your open rate data going back 2–4 weeks. When exactly did things start declining? What changed around that time — new ESP tool, new lists, new clients, DNS changes, warmup tool changes? The timing is often the clue.</p>

<h2>15–30 minutes: run the full diagnostic stack</h2>

<h3>Authentication — all affected domains</h3>
<p>Check SPF, DKIM, and DMARC on every affected domain. A systemic auth failure (e.g., your ESP rotated DKIM keys across all customers) would affect all domains simultaneously and explain a collapse. Use the <a href="/tools/dkim">DKIM checker</a> for each domain.</p>

<h3>Blacklist check — domains and IPs</h3>
<p>Check your sending domains and sending IPs. If multiple IPs from your ESP are blacklisted simultaneously, it could be an ESP-level problem rather than your domain's issue specifically. Run the <a href="/tools/blacklist">blacklist check</a> on both domain and IP for each setup.</p>

<h3>Tracking domain check — all tracking domains</h3>
<p>Has your tracking domain's CNAME been modified, had SSL expire, or started being proxied? A tracking domain issue can affect delivery across every campaign using that tracking setup. Check with the <a href="/tools/tracking-domain">tracking domain checker</a>.</p>

<h2>30–60 minutes: identify the root cause</h2>

<h3>ESP change</h3>
<p>Contact your ESP support. Ask if they've made any infrastructure changes in the last 2 weeks — IP pool changes, DKIM key rotation, sending limit policy changes. This is a common cause of synchronized cross-domain failures.</p>

<h3>List source quality change</h3>
<p>Did you add a new list source recently? A new client with a poor-quality list? A purchased list? High bounce rates or spam complaints from a new source can damage multiple inboxes simultaneously if those inboxes all sent to the bad list.</p>

<h3>Sending tool change</h3>
<p>Did you change your sending tool or warmup tool? New tools sometimes have different IP pools with existing reputation issues.</p>

<h2>60+ minutes: triage and assign</h2>
<p>Classify each affected domain:</p>
<ul>
<li>Technical fix needed (auth, tracking) — assign fix immediately</li>
<li>ESP-level issue — engage ESP support</li>
<li>Reputation damage recoverable — pause and begin recovery</li>
<li>Replacement needed — begin replacement process</li>
</ul>

<h2>Communication during triage</h2>
<p>If clients are actively expecting campaign sends during triage:</p>
<ul>
<li>Send a brief status message within 2 hours of detection</li>
<li>Don't promise resolution timelines you can't guarantee</li>
<li>Pause campaign sends until root cause is identified</li>
<li>Move to backup infrastructure if available</li>
</ul>

<div class="checklist">
<h4>Systemic deliverability triage checklist</h4>
<ul>
<li>Test 3+ domains to confirm scope (single vs systemic)</li>
<li>Note which providers are failing (Gmail, Outlook, or both)</li>
<li>Identify when decline started and what changed</li>
<li>Check DKIM on all affected domains</li>
<li>Check SPF on all affected domains</li>
<li>Check blacklists on domains and IPs</li>
<li>Check tracking domain status</li>
<li>Contact ESP support about infrastructure changes</li>
<li>Classify each domain: fix / recover / replace</li>
<li>Move to backup infrastructure if available</li>
<li>Send client status update within 2 hours</li>
</ul>
</div>
`
},

{
  slug: "emergency-cold-email-infrastructure-agency",
  title: "Emergency Cold Email Infrastructure: What Every Agency Should Have Ready",
  category: "Agency",
  readTime: 7,
  excerpt: "Emergency infrastructure isn't about having extras sitting around — it's about having the right things ready so you can respond to crises in hours, not weeks.",
  body: `
<p>When a deliverability crisis hits at 9am on a Monday with client campaigns live, having emergency infrastructure already in place is the difference between resolving the problem in hours and losing a client campaign entirely. Here's what "emergency infrastructure" actually means and how to build it.</p>

<h2>What emergency infrastructure is</h2>
<p>Emergency cold email infrastructure is a set of warmed, configured, tested sending assets that can be deployed within hours — without waiting for warmup, without new DNS setup, without waiting for DKIM to propagate. It's not spare hardware or extra server capacity. It's spare inboxes with established sending history, ready to absorb campaign traffic immediately.</p>

<h2>The components</h2>

<h3>Pre-warmed inboxes</h3>
<p>The core of emergency infrastructure. Inboxes that have been warmed for 30+ days, have auth configured correctly, have passing placement tests, and are not currently at daily sending limits. These can receive campaign traffic within hours of decision.</p>
<p>Recommended size: 20–30% of your active inbox pool. If you're running 100 active inboxes, maintain 20–30 emergency inboxes.</p>

<h3>Pre-configured domains</h3>
<p>Domains with auth fully configured (SPF, DKIM, DMARC), redirect working, tracking domain set up and tested. These domains have been through warmup with the inboxes on them. Not currently in active campaign use.</p>
<p>Recommended: at least 2 per active client, plus a general pool for new clients or spillover.</p>

<h3>Tracking domain</h3>
<p>A spare tracking domain fully configured and tested. Separate from your primary tracking domain so that if the primary has issues, you can switch tracking quickly without reconfiguring DNS.</p>

<h3>Tested access credentials</h3>
<p>Emergency infrastructure is useless if you can't access it quickly under pressure. All login credentials, ESP API keys, and DNS access for emergency domains should be documented and accessible to whoever handles incidents.</p>

<h2>Maintaining emergency infrastructure</h2>
<p>The maintenance cost of keeping emergency infrastructure ready is low but real:</p>
<ul>
<li>2–3 warmup sends per day from each emergency inbox (keeps sending history active)</li>
<li>Monthly placement test on emergency domains (ensure they're still inbox-placing)</li>
<li>Quarterly full auth check on emergency domains</li>
<li>Annual refresh: retire oldest emergency inboxes, add fresh ones</li>
</ul>

<h2>Deploying emergency infrastructure</h2>
<p>When you need to activate emergency infrastructure:</p>
<ol>
<li>Run a placement test on the emergency inboxes first — confirm they're still clean</li>
<li>Configure your ESP sequences with the emergency inboxes</li>
<li>Start at 50% of normal daily limits for the first day (don't spike volume)</li>
<li>Exclude any prospects who already received email from the failed inboxes</li>
<li>Monitor bounce rates and open rates for first 48 hours</li>
<li>Alert affected clients with a brief status: "Campaign migrated to backup infrastructure, sends continuing"</li>
</ol>

<h2>The business case for emergency infrastructure</h2>
<p>A reasonable cold email agency with 10 clients might have 80 active inboxes. Emergency infrastructure at 25% is 20 extra inboxes — roughly $120–300/month extra in account fees. One prevented client crisis (lost campaign results, client churn) is worth 6–24 months of that maintenance cost. The math strongly favors preparation.</p>

<blockquote><p>For agencies that don't want to maintain their own warming operations for backup capacity, <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> provides pre-warmed inboxes that can be deployed without warmup time. This is the equivalent of on-demand emergency infrastructure — available when needed without the overhead of maintaining idle warmed accounts. Run the <a href="/tools/infra-calc">infrastructure calculator</a> to determine how much backup capacity your portfolio needs.</p></blockquote>
`
},

{
  slug: "what-to-pause-when-reply-rates-die",
  title: "What to Pause First When Reply Rates Suddenly Die",
  category: "Emergency",
  readTime: 6,
  excerpt: "When reply rates collapse, the wrong response is to pause everything and start over. Here's the systematic approach to identifying what specifically caused the drop.",
  body: `
<p>Reply rates suddenly dropping is one of the most common cold email crises. And one of the most misdiagnosed. The reflex is to blame the copy, rewrite the sequence, and start fresh. But when reply rates die suddenly — not gradually — it's almost always an infrastructure or deliverability issue, not a content issue.</p>

<h2>Why sudden drops are almost always infrastructure</h2>
<p>Copy doesn't suddenly get worse. Your targeting doesn't suddenly get worse. If reply rates drop by 50%+ over 1–2 weeks with no meaningful changes to the campaign, the most likely explanation is that emails stopped reaching the inbox.</p>
<p>The math: if you were getting 3% reply rate and it dropped to 1%, and open rates dropped from 35% to 12% — you didn't suddenly write 3x worse copy. Your emails are in spam.</p>

<h2>Step 1: Check open rates broken down by domain</h2>
<p>Before anything else, look at open rates segmented by sending domain. If the drop is concentrated on specific domains while others are fine — it's a domain issue. If it's across all domains — it's systemic.</p>

<h2>Step 2: Run placement tests immediately</h2>
<p>Run a <a href="/test">placement test</a> on every domain that shows a significant open rate drop. Don't guess — get the actual delivery verdict. This takes 3 minutes per domain and gives you definitive evidence.</p>

<h2>Step 3: Check authentication</h2>
<p>Run <a href="/tools/dkim">DKIM</a>, <a href="/tools/spf">SPF</a>, and <a href="/tools/dmarc">DMARC</a> checks on affected domains. Did any record change recently? An ESP DKIM key rotation that wasn't reflected in DNS would cause a sudden, widespread reply rate drop.</p>

<h2>Step 4: What to pause</h2>
<p>Based on the diagnostic results:</p>

<h3>If placement test shows spam → pause those specific domains</h3>
<p>Don't pause everything. Pause the domains that are failing. Move their campaigns to clean domains while you investigate.</p>

<h3>If auth checks show failures → pause and fix</h3>
<p>Fix the auth issue first. Don't pause indefinitely — fix, verify, retest, resume.</p>

<h3>If everything looks clean</h3>
<p>If auth passes and placement tests show inbox — the reply rate drop is a content or targeting issue. Only then is it time to look at copy, timing, targeting, and sequence structure.</p>

<h2>What not to pause</h2>
<ul>
<li>Don't pause all domains when only some are affected</li>
<li>Don't stop using your ESP without investigating first</li>
<li>Don't abandon sequences that are performing on clean domains</li>
</ul>

<h2>The false urgency trap</h2>
<p>When reply rates die, the temptation is to do something immediately — rewrite everything, switch tools, change the whole approach. But hasty changes made without diagnostic data often make things worse. Run the 15-minute <a href="/tools/launch-checklist">domain audit</a> first. Then make targeted changes based on what you find.</p>
`
},

{
  slug: "open-rates-drop-deliverability-breaks",
  title: "Why Open Rates Drop When Deliverability Breaks",
  category: "Spam & Placement",
  readTime: 6,
  excerpt: "Open rates are the first visible symptom of deliverability problems. Here's the mechanism — and how to tell if the cause is delivery or something else.",
  body: `
<p>Open rates are the most commonly tracked metric in cold email — and the most misleading when deliverability is the problem. Understanding the relationship between deliverability and open rates helps you diagnose problems faster and avoid the expensive mistake of optimizing copy when infrastructure is the real issue.</p>

<h2>How deliverability affects open rates</h2>
<p>Open rate = (emails opened) ÷ (emails delivered). When deliverability breaks:</p>
<ul>
<li>Emails are delivered to spam → nobody sees them → nobody opens them</li>
<li>Opens from spam are rare (some prospects check spam and open) but far below primary inbox rates</li>
<li>The denominator (delivered) may stay the same, but the numerator (opened) collapses</li>
</ul>
<p>A cold email that was generating 35% open rates in inbox might get 5–8% open rates in spam. The email, the copy, the targeting, and the subject line are all identical. Only the folder changed.</p>

<h2>Deliverability drop vs copy decline</h2>
<p>The key diagnostic question: did open rates drop suddenly or gradually?</p>

<h3>Sudden drop (over 1–2 weeks)</h3>
<p>Almost always infrastructure or deliverability. A sudden drop suggests something broke — auth record disappeared, domain got blacklisted, tracking domain broke. Check with a <a href="/test">placement test</a> immediately.</p>

<h3>Gradual decline (over 4–8 weeks)</h3>
<p>Can be deliverability (gradual reputation decline from sustained sending) or content/targeting fatigue. Run a placement test to confirm which category you're in. If placement shows inbox, it's a content/targeting issue. If placement shows promotions or spam, the gradual decline has been a deliverability issue building over time.</p>

<h2>The open rate floor by placement</h2>
<p>Understanding typical open rates by placement helps you diagnose quickly:</p>
<ul>
<li>Primary inbox: 35–55% open rate for well-targeted cold email</li>
<li>Promotions tab: 15–25% (email is seen but in a lower-attention context)</li>
<li>Spam folder: 3–8% (only the most diligent prospects check spam)</li>
</ul>
<p>If your open rates are below 15%, you're almost certainly in promotions or spam — regardless of what your ESP's dashboard shows as "delivered."</p>

<h2>Open rate tracking limitations</h2>
<p>Open rate tracking is itself an imperfect measurement. Some email clients block tracking pixels by default (Apple Mail Privacy Protection strips open data for a significant portion of recipients). This means:</p>
<ul>
<li>Open rates may be overcounted (Apple Mail counts every email as opened) or undercounted (non-Apple email clients blocking pixels)</li>
<li>Open rate trends are more useful than absolute numbers — a trend from 35% to 15% is meaningful even if the absolute numbers are inaccurate</li>
</ul>
<p>Reply rate is a more reliable signal — it's harder to fake and doesn't depend on tracking pixels. If reply rates drop in parallel with open rates, that's strong evidence of a real problem. If open rates drop but reply rates hold — it may be tracking pixel issues rather than deliverability.</p>

<h2>What to do when open rates drop</h2>
<ol>
<li>Run a <a href="/test">placement test</a> on affected domains</li>
<li>Check auth status (<a href="/tools/spf">SPF</a>, <a href="/tools/dkim">DKIM</a>, <a href="/tools/dmarc">DMARC</a>)</li>
<li>Check the <a href="/tools/blacklist">blacklist status</a> of your domain and sending IP</li>
<li>If placement shows inbox and auth is clean — evaluate content and targeting</li>
<li>If placement shows spam — fix the infrastructure issue before changing any copy</li>
</ol>
`
},

{
  slug: "gmail-filtering-cold-email-check",
  title: "How to Check Whether Gmail Is Filtering Your Outreach",
  category: "Spam & Placement",
  readTime: 7,
  excerpt: "Gmail uses sophisticated filtering that varies by recipient. Here's how to test whether your outreach is making it to Gmail inboxes and what to do when it's not.",
  body: `
<p>Gmail is the primary email provider for most cold email targets in North America. It's also the provider with the most sophisticated spam filtering. Knowing whether Gmail specifically is filtering your outreach — and why — is essential for campaign performance.</p>

<h2>How to confirm Gmail filtering is the problem</h2>

<h3>Method 1: Inbox placement test</h3>
<p>The <a href="/test">placement test</a> uses a seed Gmail address. If the test shows spam, Gmail is filtering your email. Check the authentication results in the test output — this tells you whether Gmail saw SPF, DKIM, and DMARC as passing or failing.</p>

<h3>Method 2: Segment open rates by recipient domain</h3>
<p>In your ESP analytics, filter your campaign open rates to show only @gmail.com recipients. If Gmail open rates are significantly lower than non-Gmail recipients on the same campaign — Gmail filtering is the specific issue.</p>

<h3>Method 3: Send a test to your own Gmail</h3>
<p>Send an email from your cold email infrastructure to a Gmail address you control. Check: which folder did it land in? View the original headers — what do the authentication results show?</p>

<h2>Gmail filtering signals</h2>

<h3>Using Google Postmaster Tools</h3>
<p>If your domain sends enough volume to Gmail, you can register it in Google Postmaster Tools (postmaster.google.com). This shows:</p>
<ul>
<li>Domain reputation: Bad / Low / Medium / High</li>
<li>IP reputation: for your sending IPs</li>
<li>Spam rate: percentage of emails marked as spam by Gmail users</li>
<li>Authentication: SPF/DKIM/DMARC pass rates</li>
<li>Delivery errors: specific error codes from Gmail servers</li>
</ul>
<p>This data is delayed 1–2 days but provides the most authoritative view of what Google actually thinks of your domain.</p>

<h3>What Gmail looks for</h3>
<p>Gmail's spam filtering is multi-layered. The order of evaluation (roughly):</p>
<ol>
<li>Authentication: SPF, DKIM, DMARC</li>
<li>Sender reputation: domain and IP history</li>
<li>Content signals: links, images, formatting, language patterns</li>
<li>Recipient behavior: what previous recipients did with email from this sender</li>
</ol>

<h2>Common causes of Gmail-specific filtering</h2>

<h3>Failed authentication</h3>
<p>Gmail weights DKIM heavily. A failed DKIM signature is the most common cause of Gmail spam placement. Check with the <a href="/tools/dkim">DKIM checker</a>.</p>

<h3>Low domain reputation</h3>
<p>New domains or domains with short positive history get filtered more aggressively by Gmail. This is why warmup matters — you're building the reputation history that Gmail uses to filter.</p>

<h3>High unsubscribe or spam rate</h3>
<p>Gmail tracks when recipients mark your email as spam or use Gmail's unsubscribe feature. A spam rate above 0.1% is a threshold where Gmail starts applying more aggressive filtering. Above 0.3%, filtering becomes severe.</p>

<h3>Content patterns</h3>
<p>Gmail recognizes patterns in cold email content — certain phrases, link patterns, formatting styles. Emails that look too much like known spam templates get filtered regardless of authentication. Plain text emails generally perform better than HTML-heavy emails for cold outreach.</p>

<h2>Fixing Gmail-specific problems</h2>
<ul>
<li>DKIM failing: re-enable and re-publish in Google Workspace Admin</li>
<li>Low reputation on new domain: extend warmup, build more engagement history</li>
<li>High spam rate: improve list quality and targeting, ensure unsubscribe works</li>
<li>Content filtering: simplify to plain text, reduce link count, avoid template-like formatting</li>
</ul>

<h2>Monitoring Gmail deliverability ongoing</h2>
<p>For any high-volume sending domain:</p>
<ul>
<li>Register in Google Postmaster Tools (requires DNS verification)</li>
<li>Weekly <a href="/test">placement tests</a> to catch changes early</li>
<li>Monitor open rates segmented by @gmail.com recipients</li>
</ul>
`
},

{
  slug: "link-reputation-cold-email",
  title: "How Link Reputation Affects Cold Email Deliverability",
  category: "Spam & Placement",
  readTime: 6,
  excerpt: "Links in cold email are scanned by spam filters. A single bad link can cause spam placement even when everything else is configured correctly.",
  body: `
<p>Most cold email operators focus on domain reputation and authentication when diagnosing spam placement. Links are often overlooked — but a single URL in your email that's on a reputation list, resolves to a suspicious domain, or is flagged by a security scanner can cause spam placement regardless of everything else being correct.</p>

<h2>How link reputation filtering works</h2>
<p>Spam filters check every link in your email against multiple reputation databases. If any link resolves to a domain that's on a URL reputation list (like SURBL, URIBL, or Google Safe Browsing), the email is flagged. This check happens at the receiving server, so it's invisible to your ESP.</p>
<p>The most common scenario: a cold email operator embeds a link to their client's website — and the client's website domain has been on a spam reputation list at some point. The operator doesn't know this, campaigns run for weeks in spam, and the issue is never diagnosed correctly.</p>

<h2>What to check</h2>

<h3>Your tracking domain</h3>
<p>The tracking domain is the most common culprit. Click tracking wraps your links in a redirect through your tracking domain. If that domain is on a reputation list, every tracked link in every email has a reputation problem. Run the <a href="/tools/tracking-domain">tracking domain checker</a>.</p>

<h3>Destination URLs</h3>
<p>The URL you link to — your landing page, your client's website, your calendar booking link — can also be on reputation lists. Run the destination domain through the <a href="/tools/link-check">link reputation checker</a>.</p>

<h3>Shortened URLs</h3>
<p>Shortened URLs (bit.ly, tinyurl, custom short links) are aggressively filtered by spam filters because they hide the final destination. Avoid URL shorteners in cold email entirely.</p>

<h3>Multiple links</h3>
<p>Each link in your email is an additional surface for reputation scanning. Cold email should have a maximum of one link — ideally zero or just a calendar link. Every additional link increases filtering risk.</p>

<h2>Using the link reputation checker</h2>
<p>The <a href="/tools/link-check">link checker</a> extracts all URLs from your email content and checks each one against reputation databases. Paste your email and get a report on which links are clean and which have issues.</p>

<h2>Best practices for links in cold email</h2>
<ul>
<li>Maximum one link per email — ideally your calendar link</li>
<li>Never use URL shorteners</li>
<li>Use a dedicated tracking domain separate from all sending domains</li>
<li>Check your tracking domain monthly</li>
<li>Check destination domains when onboarding new clients</li>
<li>Plain text links are safer than hyperlinked text (fewer spam signals)</li>
</ul>

<h2>What to do if you find a problem</h2>
<p>If your tracking domain is on a reputation list, you may need to set up a new tracking domain. If a destination URL is on a list, use a different URL or remove the link entirely for the affected campaigns. If a client's domain is the issue, the client may need to address their website's reputation independently — and you may need to avoid linking to it in campaigns until it's resolved.</p>
`
},

{
  slug: "fastest-replace-burned-inboxes",
  title: "The Fastest Way to Replace Burned Inboxes Without Waiting Weeks",
  category: "Emergency",
  readTime: 7,
  excerpt: "The standard replacement path takes 4–6 weeks because of warmup. Here's how to reduce that timeline to hours — and when that's the right move.",
  body: `
<p>Traditional inbox replacement takes 4–6 weeks because you need to purchase domains, set up accounts, configure auth, and go through a full warmup period. When campaigns are actively running and clients are expecting results, that timeline is completely unacceptable. Here's how to get replacement infrastructure running in hours, not weeks.</p>

<h2>Why standard replacement takes weeks</h2>
<p>The bottleneck is warmup. A brand new inbox sent from a domain with no sending history immediately triggers spam filters — the inbox has no reputation, no positive signals, nothing for providers to evaluate. The warmup period builds that history. You can't skip the process, only start it earlier.</p>
<p>This is why the decision to replace needs to be made proactively — not during a crisis when you need campaign continuity in 24 hours.</p>

<h2>The fast path: pre-warmed infrastructure</h2>
<p>Pre-warmed inboxes bypass the warmup bottleneck because the work was done in advance. A pre-warmed inbox has:</p>
<ul>
<li>30+ days of sending history with engagement signals</li>
<li>Authentication configured and verified</li>
<li>Passing placement test results</li>
<li>Sending reputation at a level that supports campaign volume</li>
</ul>
<p>Deploying pre-warmed inboxes to a campaign takes hours, not weeks.</p>

<h2>What you still need to configure</h2>
<p>Even pre-warmed inboxes require some configuration before campaigns can run:</p>
<ul>
<li>Verify the tracking domain is set up correctly for the new inboxes</li>
<li>Connect the inbox to your ESP (SMTP credentials or API)</li>
<li>Run a placement test from the actual sending setup to confirm clean placement</li>
<li>Configure sending limits correctly in your campaign sequences</li>
<li>Exclude prospects who already received email from the failed infrastructure</li>
</ul>

<h2>The sourcing decision</h2>

<h3>Source pre-warmed inboxes from a provider</h3>
<p>Inbox warming providers maintain warmed infrastructure that can be purchased and deployed immediately. The cost is higher per inbox than building your own, but the time savings for emergency situations are significant. <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> is one provider for this.</p>

<h3>Maintain your own pre-warmed backup pool</h3>
<p>The more operationally mature approach: maintain a pool of your own pre-warmed domains at all times. The cost is lower per inbox but requires ongoing maintenance (keeping warmup active, testing placement monthly). When a crisis hits, you have immediate access without depending on a third party.</p>

<h3>Hybrid</h3>
<p>Keep a small internal backup pool for minor incidents. Use a provider like WarmInboxes for major replacements that exceed your backup pool. This gives you immediate coverage for most situations without requiring you to maintain a large idle pool.</p>

<h2>Before you replace: confirm it's necessary</h2>
<p>Replacing when you don't need to is expensive and slow (even pre-warmed). Before activating replacement infrastructure, confirm the issue is reputation damage and not a fixable technical problem. Run the full diagnostic: auth checks, blacklist check, placement test. If auth is broken — fix it first. You might not need to replace anything.</p>

<p>Use the <a href="/tools/repair-or-replace">repair-or-replace calculator</a> to make the call, then use the <a href="/tools/emergency">emergency infrastructure calculator</a> to size what you need.</p>
`
},

{
  slug: "why-looks-fine-in-esp-doesnt-mean-reaching-people",
  title: "Why 'Looks Fine in the ESP' Doesn't Mean Your Emails Are Reaching People",
  category: "Spam & Placement",
  readTime: 6,
  excerpt: "Your sending tool shows green, the sequences are running, and the dashboard looks normal. But your emails might be landing in spam for every recipient. Here's why.",
  body: `
<p>The most common diagnostic mistake in cold email: assuming that because the ESP shows the email as "sent" and "delivered," it's actually reaching the inbox. Delivered means the receiving server accepted the email. It does not mean the email reached the primary inbox. It doesn't even mean the recipient will ever see it.</p>

<h2>What "delivered" actually means</h2>
<p>When your ESP shows 100% delivery rate, it means: every email was accepted by a receiving mail server without a bounce. The receiving server said "yes, I got this." What the receiving server did with it afterward — spam folder, promotions tab, inbox, or even auto-delete — your ESP has no visibility into.</p>
<p>This is a fundamental limitation of SMTP. The sender is notified of bounces (rejections) but not of where accepted email lands.</p>

<h2>The ESP visibility gap</h2>
<p>Your ESP can tell you:</p>
<ul>
<li>✓ Email was sent</li>
<li>✓ Email was accepted by the receiving server (delivered)</li>
<li>✓ Email was opened (via tracking pixel — unreliable for some clients)</li>
<li>✓ Link was clicked (via tracking redirect)</li>
</ul>

<p>Your ESP cannot tell you:</p>
<ul>
<li>✗ Whether the email landed in inbox, promotions, or spam</li>
<li>✗ Whether spam filters silently discarded the email</li>
<li>✗ Whether the recipient's email client stripped tracking and they opened it without your ESP knowing</li>
<li>✗ Whether authentication passed or failed at the receiver</li>
</ul>

<h2>How to actually see where emails land</h2>
<p>There's only one reliable way: send a test email and check where it lands. The <a href="/test">inbox placement test</a> does this by sending through your actual sending infrastructure to a seed inbox and reporting exactly where it landed. This test also shows the authentication results from the receiver's perspective — which SPF, DKIM, and DMARC returned when the email arrived.</p>

<h2>The false sense of security from ESP metrics</h2>
<p>ESP dashboards are optimized to show you good-looking numbers. High delivery rate, decent open rate, normal bounce rate. These metrics can all look acceptable while your emails are landing in spam for 80% of recipients.</p>

<p>A concrete example: if 100 emails are sent, 97 are "delivered" (3 bounced), and 8 are "opened" — the dashboard shows 97% delivery and 8.2% open rate. This looks concerning but not alarming. What it might actually reflect: 80% in spam (with ~5% of those being found and opened by diligent prospects) and 20% in inbox (with normal ~35% open rate). The ESP shows nothing unusual. The campaign is essentially not working.</p>

<h2>Building real visibility</h2>
<ul>
<li>Weekly <a href="/test">placement tests</a> on every active sending domain</li>
<li>Open rate tracking broken down by sending domain (not just by campaign)</li>
<li>Reply rate as a sanity check — replies are harder to fake with tracking manipulation</li>
<li>Google Postmaster Tools registration for Gmail-heavy campaigns</li>
</ul>

<p>Don't trust the ESP dashboard to tell you whether your campaigns are actually working. Trust placement tests. Trust reply rates. Trust domain-segmented open rate trends. The ESP tells you if email was sent. Only external testing tells you where it landed.</p>
`
},

{
  slug: "dmarc-cold-email-what-it-does-why-it-matters",
  title: "DMARC for Cold Email: What It Does and Why It Matters",
  category: "DNS & Auth",
  readTime: 7,
  excerpt: "DMARC is the most misunderstood of the three authentication records. Here's what it actually does, what the settings mean, and how to configure it correctly for cold email.",
  body: `
<p>SPF and DKIM are the authentication mechanisms. DMARC is the policy layer on top — it ties SPF and DKIM together, adds an alignment check, and gives you reporting on what's happening with your domain's email authentication. Without DMARC, you're flying blind on authentication failures and spoofing attempts.</p>

<h2>What DMARC actually does</h2>

<h3>Policy enforcement</h3>
<p>DMARC tells receiving servers what to do when email fails SPF or DKIM: nothing (p=none), quarantine it (p=quarantine), or reject it (p=reject). The policy only matters if SPF or DKIM fail — if both pass, DMARC doesn't interfere.</p>

<h3>Alignment checking</h3>
<p>DMARC adds a check that SPF and DKIM alone don't do: it verifies that the domain in your From address is aligned with the domains that SPF and DKIM authenticated. This closes a spoofing loophole where someone could use your domain in the From address while authenticating through a completely different domain.</p>

<h3>Reporting</h3>
<p>DMARC's most underused feature: it enables aggregate reports (rua) and forensic reports (ruf) that tell you about authentication failures, delivery stats, and spoofing attempts across all email claiming to come from your domain. This is the only way to know if your domain is being spoofed.</p>

<h2>The DMARC record structure</h2>
<p>A basic DMARC record: <code>v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com</code></p>
<ul>
<li><code>v=DMARC1</code>: version, always this value</li>
<li><code>p=none</code>: policy (none / quarantine / reject)</li>
<li><code>rua=mailto:...</code>: where aggregate reports are sent</li>
<li><code>ruf=mailto:...</code>: where forensic reports are sent (optional)</li>
<li><code>pct=100</code>: percentage of failing mail the policy applies to (optional, default 100)</li>
<li><code>adkim=r</code>: DKIM alignment mode (r=relaxed, s=strict)</li>
<li><code>aspf=r</code>: SPF alignment mode (r=relaxed, s=strict)</li>
</ul>

<h2>Choosing the right policy for cold email</h2>

<h3>p=none (start here)</h3>
<p>Monitoring mode. No email is filtered based on DMARC — authentication failures are reported but not acted on. Correct starting point for any new domain. Gives you visibility before you enforce anything.</p>
<p>When to use: always, for new sending domains. Stay here until you've confirmed all legitimate sending sources are passing authentication.</p>

<h3>p=quarantine</h3>
<p>Authentication failures are sent to spam/quarantine. Use this after you've verified all your legitimate sending sources pass authentication. Not typically necessary for cold email sending domains unless you want to signal higher security posture.</p>

<h3>p=reject</h3>
<p>Authentication failures are rejected outright. Strongest protection against spoofing. Only use this when you're 100% confident all legitimate sending passes auth — otherwise you'll block your own email. For cold email sending domains specifically, this is usually too aggressive.</p>

<h2>Common DMARC mistakes in cold email</h2>

<h3>No DMARC record</h3>
<p>Without DMARC, you have no authentication reporting and no policy layer. Some providers treat missing DMARC as a mild negative signal. Add at minimum: <code>v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com</code></p>

<h3>rua pointing to an unmonitored email</h3>
<p>If your rua tag points to an email nobody checks, you're not getting any value from the reporting. Use a real, monitored email for DMARC reports. Tools like DMARC Analyzer or MXToolbox can parse the XML reports into readable summaries.</p>

<h3>Starting with p=reject</h3>
<p>Starting with reject before you've confirmed all sending sources pass authentication will block legitimate email from your own ESP. Always start with p=none and upgrade policy only after validating auth across all sending paths.</p>

<h2>Checking your DMARC record</h2>
<p>Use the <a href="/tools/dmarc">DMARC lookup tool</a> to check your current record, parse all the tags, and identify any configuration issues. The tool shows what policy is in effect and whether the rua tag is correctly formatted.</p>
`
},

{
  slug: "domain-warm-up-cold-email-how-long",
  title: "Domain Warm-Up for Cold Email: How Long Does It Actually Take?",
  category: "Warmup & Recovery",
  readTime: 7,
  excerpt: "The \"just warm up for 2 weeks\" advice is wrong. Here's how long warmup actually takes for cold email and what the shortcuts cost you.",
  body: `
<p>The most common warmup advice in cold email circles is somewhere between "2 weeks is enough" and "30 days minimum." The truth is more nuanced — how long warmup takes depends on your sending provider, your domain age, your sending volumes, and what you're trying to achieve. Here's the real picture.</p>

<h2>Why warmup duration matters</h2>
<p>Warmup is reputation building. You're establishing a sending history that email providers use to make filtering decisions. Go too fast and you look like a spam operation with a volume spike. Too short and you don't have enough history to absorb campaign-level sending without triggering filters.</p>

<h2>Warmup timelines by provider</h2>

<h3>Google Workspace</h3>
<p>Minimum: 21 days. Recommended: 28–35 days. Gmail's reputation system updates relatively quickly — 3 weeks of good sending history is usually enough to support campaign-level volumes. The warmup needs to include engagement signals, not just volume sends.</p>

<h3>Microsoft 365</h3>
<p>Minimum: 30 days. Recommended: 45–60 days. Microsoft is more conservative in evaluating new senders and requires a longer history before treating email favorably. M365 accounts warmed for only 2–3 weeks frequently show spam placement on first campaign sends.</p>

<h3>Custom SMTP / Dedicated IP</h3>
<p>Minimum: 45 days. Recommended: 60–90 days. Building IP reputation from zero is slower than building domain reputation on a shared infrastructure. IP reputation takes longer to establish and providers are slower to trust new IPs.</p>

<h2>The domain age factor</h2>
<p>Warmup alone isn't enough — domain age matters independently. A domain that was registered 2 days ago and warmed for 4 weeks is still a 4-week-old domain. Most providers apply extra scrutiny to domains under 30 days old, and some apply additional filtering to domains under 90 days.</p>
<p>The effective minimum: domain age of 30+ days, plus warmup duration on top of that.</p>

<h2>Signs warmup is complete</h2>
<p>Don't rely only on elapsed time. Confirm warmup completion by checking these signals:</p>
<ul>
<li><a href="/test">Placement test</a> shows inbox (not promotions or spam)</li>
<li>Warmup tool engagement rate is consistent and not declining</li>
<li>No blacklist listings (<a href="/tools/blacklist">blacklist check</a>)</li>
<li>Authentication is passing (<a href="/tools/dkim">DKIM</a>, <a href="/tools/spf">SPF</a>, <a href="/tools/dmarc">DMARC</a> all green)</li>
<li>Domain is at least 30 days old</li>
</ul>
<p>Use the <a href="/tools/warmup-ready">warmup readiness checker</a> to evaluate all these signals in one pass.</p>

<h2>The shortcuts and what they cost</h2>

<h3>Skipping warmup entirely</h3>
<p>Cost: immediate spam placement on campaign launches. The domain's first impression with every provider is a cold email blast with no prior positive history. Most of the emails go to spam. The inbox is effectively burned before campaigns even start.</p>

<h3>Short warmup (7–10 days)</h3>
<p>Cost: often works at very low volumes (2–5 sends/day) but fails when campaign volumes are applied. The inbox doesn't have enough history to absorb the sending pattern of a real campaign. Common outcome: placement degrades after 1–2 weeks of campaigns.</p>

<h3>Warmup tool only, no real engagement</h3>
<p>Cost: warmup tool accounts build thin, artificial reputation signals. Gmail in particular recognizes mechanical warmup patterns. Inboxes that were warmed only with tools may perform worse than expected on real campaigns.</p>

<h2>What to do while waiting for warmup</h2>
<p>Warmup is not passive. While inboxes are warming, use the time to:</p>
<ul>
<li>Verify and clean the list you'll be sending to</li>
<li>Test your copy and sequence with small sends from already-warmed inboxes</li>
<li>Confirm all auth is configured and tested</li>
<li>Run a <a href="/tools/launch-checklist">full setup audit</a></li>
<li>Set up placement test monitoring for when campaigns go live</li>
</ul>

<blockquote><p>If your campaign timeline can't accommodate a full warmup period, pre-warmed inboxes from providers like <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> are the alternative. They ship with established sending history. You still need to configure auth and tracking correctly — but the warmup wait is eliminated.</p></blockquote>
`
},

];
