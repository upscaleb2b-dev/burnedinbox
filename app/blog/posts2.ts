import { Post } from "./posts";

export const posts2: Post[] = [

{
  slug: "google-workspace-cold-email-spam-new-domain",
  title: "Google Workspace Cold Emails Going to Spam After a New Domain Setup",
  category: "Google Workspace",
  readTime: 10,
  excerpt: "You set up a fresh domain and GWS, did warmup, and launched. Your test email is sitting in spam. Here's exactly what's going wrong and how to fix it.",
  body: `
<p>You bought a fresh domain, set up Google Workspace, configured your DNS records, maybe even ran a week or two of warmup. You launch your first cold email campaign and open rates are in the gutter. You send a test to yourself and find it sitting in spam. Everything looks right on paper but Gmail is burying your messages.</p>

<h2>Why this happens</h2>
<p>A brand new domain has zero reputation. Google does not treat zero reputation the same as good reputation — it treats it as unknown, which in practice means suspicion. Authentication tells Gmail the email is really from you. It does not tell Gmail you are worth listening to.</p>
<p>Here is what is actually going wrong in most cases:</p>
<ul>
<li><strong>No sending history.</strong> Gmail has no positive engagement signals to associate with your domain. No opens, no replies, no one adding you to their address book.</li>
<li><strong>Warmup was too short or too shallow.</strong> Running warmup for five days and then blasting 50 cold emails on day six is a pattern Gmail recognizes.</li>
<li><strong>Subtle DNS misconfiguration.</strong> A common issue is SPF records that include too many lookups, or DKIM keys that are only 1024 bits when 2048 is recommended.</li>
<li><strong>Content triggering spam signals.</strong> Links, images, HTML formatting, or tracking pixels in early sends from an unknown domain look like spam regardless of copy quality.</li>
</ul>

<h2>Step-by-step diagnosis</h2>

<h3>Step 1: Confirm authentication actually passes</h3>
<p>Send a test email to a personal Gmail account and open the message. Click the three dots, then "Show original." Look for <code>spf=pass</code>, <code>dkim=pass</code>, and <code>dmarc=pass</code> in the Authentication-Results header. If any show FAIL or NEUTRAL, stop here and fix your DNS first. Use the <a href="/tools/spf">SPF checker</a>, <a href="/tools/dkim">DKIM checker</a>, and <a href="/tools/dmarc">DMARC lookup</a> to verify each one independently.</p>

<h3>Step 2: Check your DKIM key length</h3>
<p>Google recommends 2048-bit DKIM keys. If your domain provider generated a 1024-bit key during setup, consider regenerating. Google Workspace lets you generate 2048-bit keys directly in the Admin Console under Apps → Gmail → Authenticate email. Verify with the <a href="/tools/dkim">DKIM checker</a>.</p>

<h3>Step 3: Check Google Postmaster Tools</h3>
<p>Register your domain at postmaster.google.com. Once there's enough volume, it shows domain reputation and spam rate. A new domain might not have data yet, but if it already shows "Bad" reputation, you moved too fast.</p>

<h3>Step 4: Send a plain text test</h3>
<p>Send a plain text email with no links, no images, no tracking, just a short sentence. If that lands in inbox but your campaign emails land in spam, the problem is your content or tracking setup — not authentication and not domain age.</p>

<h3>Step 5: Check sending volume and ramp</h3>
<p>If you went from zero to more than 20 emails per day within the first week, you likely triggered volume-based filtering. Use the <a href="/tools/send-limits">sending limit planner</a> to configure the correct ramp for GWS specifically.</p>

<h2>The fix path</h2>
<p>If authentication is broken, fix it first. Get SPF, DKIM, and DMARC all passing. Use the <a href="/tools/launch-checklist">launch checklist</a> to verify every element before your next send.</p>
<p>If authentication passes but you have no reputation, slow down. Pull back to 5–10 emails per day from each inbox. Use a warmup tool that generates real opens and replies. Run warmup for at least 2–4 weeks before any cold outreach.</p>
<p>If your content is the trigger, strip everything back to plain text for the first few weeks. No HTML templates, no images, no tracked links. Once inbox placement stabilizes above 80%, you can gradually introduce tracking and light formatting.</p>
<p>Set up a <strong>custom tracking domain</strong> so your open and click tracking does not ride on a shared domain used by thousands of other senders. This isolates your reputation from theirs. Check your tracking domain setup with the <a href="/tools/tracking-domain">tracking domain checker</a>.</p>

<h2>Repair or replace?</h2>
<p>If the domain is less than a week old and you have only sent a small number of emails, the damage is probably minimal. Fix the issues above, pull back volume, run proper warmup, and the domain should recover within 2–3 weeks.</p>
<p>If you already blasted hundreds of emails and Gmail is consistently sending everything to spam, the domain may have developed a negative reputation that takes much longer to recover. In that case, it is often faster to set up a new domain and warm it properly from the start.</p>
<p>For agencies managing multiple clients, having prewarmed inboxes ready to rotate in is what separates a minor setback from a client emergency. <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> provides Google Workspace accounts on properly aged and warmed domains so you can swap in clean infrastructure without starting from scratch.</p>

<div class="checklist">
<h4>Mistakes that make this worse</h4>
<ul>
<li>Starting cold outreach on day one of a new domain with no warmup at all</li>
<li>Sending more than 20 emails per day from a brand new inbox in the first two weeks</li>
<li>Using shared tracking domains from your outreach tool without setting up a custom tracking CNAME</li>
<li>Including links to your main website domain before that domain has any sending reputation</li>
<li>Sending HTML-heavy emails with images and buttons from an unknown domain</li>
<li>Ignoring the spam folder test and assuming low open rates are a copy problem</li>
<li>Buying an expired domain that looks aged but carries a bad reputation from its previous owner</li>
</ul>
</div>
`
},

{
  slug: "gws-spf-dkim-dmarc-pass-still-spam",
  title: "Google Workspace SPF DKIM DMARC All Pass but Emails Still Go to Spam",
  category: "Google Workspace",
  readTime: 9,
  excerpt: "Authentication is clean. Every check passes. But emails still land in spam. Here's why — and what actually needs fixing.",
  body: `
<p>You check message headers and SPF passes, DKIM passes, DMARC passes. Everything is green. But your cold emails are still landing in spam on Gmail. This is the most frustrating deliverability problem because it feels like the rules are broken.</p>

<h2>Why this happens</h2>
<p>Authentication is a gate check, not a quality score. Passing SPF, DKIM, and DMARC tells Gmail the email is legitimately from your domain. It does not tell Gmail the email is wanted. Think of authentication as showing your ID at the door — it proves you are who you claim to be, but it does not mean you are welcome at the party.</p>
<p>Gmail uses hundreds of signals beyond authentication to decide inbox placement. The most important for cold email senders are domain reputation, IP reputation, engagement history, content signals, and complaint rates.</p>

<h2>What's typically going wrong</h2>
<ul>
<li><strong>Domain reputation is Low or Bad.</strong> A new domain or a domain with limited positive engagement history does not get the benefit of the doubt. Check Google Postmaster Tools — reputation levels are High, Medium, Low, or Bad. Low or Bad overrides clean authentication every time.</li>
<li><strong>Sending IP reputation is poor.</strong> If you are on a shared IP, other senders on that same IP may have damaged its reputation.</li>
<li><strong>Spam complaint rate is too high.</strong> Google's threshold is 0.3%, but 0.10% is already the danger zone. Even a small percentage of recipients marking your emails as spam poisons the well for all future sends.</li>
<li><strong>Content looks like spam.</strong> Certain patterns trigger content-based filtering regardless of authentication: excessive links, tracking pixels from shared domains, URL shorteners, certain word combinations, HTML structures that resemble known spam templates.</li>
<li><strong>No positive engagement signals.</strong> Gmail weighs opens, replies, clicks, and whether recipients move your messages out of spam or add you to contacts. A domain with authentication but zero engagement history is still suspicious.</li>
</ul>

<h2>Step-by-step diagnosis</h2>

<h3>Step 1: Check Postmaster Tools</h3>
<p>Go to postmaster.google.com and check domain reputation, IP reputation, and spam rate. If domain reputation shows Low or Bad, that is your answer. If spam rate is above 0.10%, that is contributing directly.</p>

<h3>Step 2: Run a blacklist check</h3>
<p>Run your domain and sending IPs through the <a href="/tools/blacklist">blacklist checker</a>. A blocklist hit will override clean authentication on many providers.</p>

<h3>Step 3: Send a plain text test</h3>
<p>Send a plain text email to a Gmail account you control — no links, no tracking, no HTML. Just two sentences. If it lands in the inbox, your authentication and reputation are probably fine and the problem is your content. If even plain text goes to spam, the issue is domain or IP reputation.</p>

<h3>Step 4: Check your tracking domain</h3>
<p>Use the <a href="/tools/tracking-domain">tracking domain checker</a>. A tracking domain proxied through Cloudflare (orange cloud enabled) or on a shared reputation domain is one of the most common silent spam triggers.</p>

<h2>The fix path</h2>
<p>If domain reputation is the problem, you need to rebuild it. Reduce volume dramatically. Send only to contacts who are most likely to engage. Every open and reply you generate is a positive signal. Stop all cold outreach to unengaged lists until reputation improves. This takes 2–4 weeks of consistent positive signals.</p>
<p>If spam rate is too high, add proper one-click unsubscribe headers immediately. Remove any recipients who have not engaged in previous campaigns. Better targeting is the long-term fix.</p>
<p>If content is the trigger, simplify. Go plain text. Remove all links except one. Write shorter messages — under 100 words. Make them conversational rather than formatted like a newsletter.</p>
<p>If IP reputation is the issue and you are on a shared IP, you either need a dedicated IP or different sending infrastructure. If you route through a third-party outreach tool, check their IP reputation separately from your GWS domain.</p>

<h2>Repair or replace?</h2>
<p>If Postmaster Tools shows domain reputation as Low and you have been sending for less than a month, you can likely repair it by pulling back volume, cleaning your list, and generating positive engagement over 2–3 weeks.</p>
<p>If domain reputation shows Bad and spam rate has been above 0.3% for more than a week, repair is possible but slow — 4–8 weeks of disciplined low-volume sending with high engagement.</p>
<p>For agencies with active client campaigns that can't wait, the practical move is to rotate in clean, prewarmed inboxes from a service like <a href="https://warminboxes.com" target="_blank">WarmInboxes</a>. That lets the damaged domain rest and rebuild while outreach continues uninterrupted on healthy infrastructure.</p>

<div class="checklist">
<h4>Mistakes that make this worse</h4>
<ul>
<li>Increasing volume to compensate for low reply rates</li>
<li>Ignoring Postmaster Tools data because "authentication passes"</li>
<li>Continuing to send to the same list that is generating spam complaints</li>
<li>Adding more links or flashier HTML to try to improve engagement when emails aren't even reaching the inbox</li>
<li>Assuming the problem will fix itself without changing anything</li>
</ul>
</div>
`
},

{
  slug: "google-workspace-deliverability-drops-scaling",
  title: "Why Google Workspace Cold Email Deliverability Drops After Scaling Volume",
  category: "Google Workspace",
  readTime: 9,
  excerpt: "Everything was working. You doubled your sends. Now deliverability has collapsed. Here's the exact mechanism — and how to scale without burning your domains.",
  body: `
<p>Your cold email campaigns were working. Replies were coming in. Open rates looked healthy. Then you increased volume — maybe doubled your daily sends or added more inboxes — and everything fell off a cliff. The campaigns are identical to what worked before. The only thing that changed was volume.</p>

<h2>Why this happens</h2>
<p>Gmail tracks sending volume per domain and per IP address. When volume increases suddenly, Gmail's systems treat it as a risk signal. Spammers and compromised accounts both exhibit sudden volume spikes, so Gmail's default response is to throttle or redirect to spam until the sender proves the new volume is legitimate.</p>
<p>Here is what happens mechanically when you scale too fast:</p>
<ul>
<li>Your domain hits Gmail's internal volume threshold and messages start getting deferred with 4.7.28 SMTP errors, or they get silently routed to spam.</li>
<li>Your engagement rate drops because more emails are going to spam, which means fewer opens and replies per message sent. Gmail interprets this declining engagement as evidence that recipients do not want your mail. It is a feedback loop.</li>
<li>If you added new sending IPs by bringing on new inboxes on different infrastructure, those new IPs have no reputation. Gmail treats them as unknown, which means higher spam filtering rates on the new infrastructure even if your original IPs were fine.</li>
<li>Your spam complaint rate may have increased even slightly. When you send more email, even a consistent complaint percentage represents more absolute complaints.</li>
</ul>

<h2>Step-by-step diagnosis</h2>

<h3>Step 1: Check Postmaster Tools trend</h3>
<p>Check Google Postmaster Tools for your domain reputation trend. Look at the date you increased volume and see if domain reputation dropped from High or Medium to Low around the same time.</p>

<h3>Step 2: Check for SMTP deferral errors</h3>
<p>Check your outreach tool dashboard for 4.7.28 errors. A 4.7.28 error means you have exceeded Gmail's sending quota. Google's guidance says to stop sending for at least 10 minutes when you see this, then resume with a single connection and scale back up one connection at a time.</p>

<h3>Step 3: Check inbox placement</h3>
<p>Run a <a href="/test">placement test</a> from each inbox. If the drop is happening, placement tests will confirm it. Compare results from inboxes added before and after the scale increase to isolate whether new inboxes are the problem.</p>

<h3>Step 4: Check list quality</h3>
<p>When teams scale, they often loosen targeting criteria to fill the larger pipeline. Lower quality leads mean lower engagement which means faster reputation decline. Check your bounce rates using the <a href="/tools/blacklist">blacklist checker</a> on the domain and sending IPs.</p>

<h2>The fix path</h2>
<p>Reduce volume back to where things were working. This is the hardest advice to take but the most effective. Hold at the previous daily send volume while reputation recovers.</p>
<p>If you saw 4.7.28 errors, follow Google's specific guidance: stop for 10 minutes, identify the cause, then resume slowly.</p>
<p>Ramp volume back up over 2–4 weeks. Start new domains at 5–10 emails per day and increase over 4–6 weeks. Even established domains need a gradual ramp when increasing beyond their established baseline. Use the <a href="/tools/send-limits">sending limit planner</a> to set correct per-week limits.</p>
<p>If you added new inboxes, warm them independently before putting them into production campaigns. Each new inbox needs its own warmup period. Check with the <a href="/tools/warmup-ready">warmup readiness checker</a> before activating.</p>

<h2>Repair or replace?</h2>
<p>If you caught the drop quickly and reduced volume within a few days, your domain reputation will likely recover in 1–2 weeks of disciplined sending at lower volume with strong engagement.</p>
<p>If you pushed through the drop for weeks, the damage is deeper. Recovery could take 4–6 weeks and you may need to rest some inboxes entirely.</p>
<p>For agencies with client commitments, the answer is often both: repair the damaged inboxes by resting them or running low-volume warmup, while rotating client campaigns onto clean, prewarmed inboxes from <a href="https://warminboxes.com" target="_blank">WarmInboxes</a>. This maintains campaign continuity without forcing more volume through damaged infrastructure that will only get worse.</p>

<div class="checklist">
<h4>Mistakes that make this worse</h4>
<ul>
<li>Pushing more volume to "make up for" lost replies</li>
<li>Scaling and list-quality degradation at the same time</li>
<li>Adding multiple new inboxes and putting them into full production on day one</li>
<li>Ignoring deferral errors and SMTP 4.7.28 codes</li>
<li>Not separating new infrastructure from established infrastructure during testing</li>
<li>Assuming warmup on one inbox transfers reputation to other inboxes on the same domain</li>
</ul>
</div>
`
},

{
  slug: "gmail-promotions-tab-cold-email",
  title: "Cold Emails Landing in Gmail Promotions Instead of Primary",
  category: "Spam & Placement",
  readTime: 7,
  excerpt: "Promotions tab is not spam — but it's close. Here's what triggers Gmail's tab classifier and how to get your cold emails back into Primary.",
  body: `
<p>Your cold emails are not going to spam. They are arriving in the Promotions tab on Gmail. Open rates are low because most people don't check Promotions regularly, and your outreach is not getting the engagement it needs. Technically the emails are being delivered. Functionally they might as well not be.</p>

<h2>Why this happens</h2>
<p>Gmail's tab sorting system uses machine learning to classify messages into Primary, Social, Promotions, Updates, and Forums. Promotions is where Gmail puts marketing-style email. Cold outreach that looks like marketing email ends up there.</p>
<p>This is separate from spam filtering. Your authentication can be perfect, your domain reputation can be good, and your emails can still land in Promotions because the content pattern matches what Gmail considers promotional material. The biggest triggers are: HTML formatting with styled templates, multiple links, images and logos, tracking pixels, unsubscribe footers that look like marketing footers, and any content pattern that resembles newsletters or promotional blasts.</p>

<h2>Step-by-step diagnosis</h2>

<h3>Step 1: Confirm it's Promotions not spam</h3>
<p>Run a <a href="/test">placement test</a> to get the definitive verdict. Promotions and spam are very different problems with very different fixes. Confirm exactly which you're dealing with before changing anything.</p>

<h3>Step 2: Strip the email to plain text</h3>
<p>Remove all HTML formatting, images, logos, and styled signatures. Send a plain text test and check tab placement. If it moves to Primary, the format is the trigger.</p>

<h3>Step 3: Remove links one at a time</h3>
<p>Tracking pixels count as content that looks like marketing. Remove links progressively to find which ones are contributing. If open tracking is enabled, disable it temporarily and retest.</p>

<h3>Step 4: Check your From name and email format</h3>
<p>Display names that include company names in ALL CAPS, emojis, or subject-like text push toward Promotions. Send from a personal-looking address: firstname@domain.com rather than team@domain.com or outreach@domain.com.</p>

<h2>The fix path</h2>
<p>Write like a human, not a marketing team. Plain text, short paragraphs, conversational tone. One link maximum. No images. No HTML templates.</p>
<p>Use a custom tracking domain if you need open or click tracking. Check your current tracking domain setup with the <a href="/tools/tracking-domain">tracking domain checker</a> — if it's proxied through Cloudflare or sharing reputation with bulk email senders, that's contributing to the classification.</p>
<p>Keep your email signature simple: name, title, company, phone number. No logos, no banners, no social media icons. Every visual element pushes the email toward Promotions classification.</p>
<p>Personalize beyond first name tokens. Reference something specific to the recipient. Gmail's classifier picks up on template patterns — highly templated messages are more likely to be classified as promotional even without HTML.</p>

<h2>Repair or replace?</h2>
<p>Promotions placement is almost always a content and formatting issue rather than a domain or infrastructure issue. You do not need to replace your inboxes. You need to change how your emails look. Adjust your templates, strip formatting, and retest. Promotions tab placement can shift within a few sends once the content signals change.</p>
<p>If you are also seeing spam placement alongside Promotions placement on some test emails, then you have a layered problem where reputation issues are compounding content issues. Follow the spam placement diagnosis flow separately.</p>

<div class="checklist">
<h4>Mistakes that make this worse</h4>
<ul>
<li>Using HTML email templates designed for newsletter-style marketing</li>
<li>Including multiple links, CTAs, or images</li>
<li>Using company logo images in signatures</li>
<li>Sending the exact same template to hundreds of recipients without meaningful personalization</li>
<li>Using default shared tracking domains that Gmail has already associated with bulk marketing</li>
</ul>
</div>
`
},

{
  slug: "fix-gmail-spam-after-domain-migration-gws",
  title: "How to Fix Gmail Spam Issues After Moving Domains to Google Workspace",
  category: "Google Workspace",
  readTime: 8,
  excerpt: "Migration to Google Workspace is a common point where deliverability silently breaks. Here's what changes, what breaks, and exactly how to fix it.",
  body: `
<p>You migrated your email from another provider to Google Workspace. Before the migration, deliverability was fine. After moving to Google Workspace, your emails are going to spam on Gmail or other providers. Nothing about your email content changed. Only the sending infrastructure changed.</p>

<h2>Why this happens</h2>
<p>When you move to Google Workspace, your MX records change, your sending IP changes, and your DNS records need to be reconfigured for the new infrastructure. If any part of this migration is incomplete, your authentication breaks silently — your ESP shows emails as sent, but receiving servers are rejecting authentication.</p>
<p>Common causes after a migration:</p>
<ul>
<li><strong>SPF still references your old email provider.</strong> Your SPF record must include Google Workspace's servers using <code>include:_spf.google.com</code>. Without this, emails sent from GWS fail SPF checks.</li>
<li><strong>DKIM was never set up for GWS.</strong> You need to generate new DKIM keys in the Google Admin console and add them to your DNS. The old provider's DKIM key does not work with GWS's sending infrastructure.</li>
<li><strong>DMARC alignment broke.</strong> After migration, if SPF and DKIM are not both correctly configured for GWS, DMARC fails even if individual checks pass on the old system.</li>
<li><strong>Reputation doesn't transfer.</strong> Your domain had reputation signals tied to your old IP addresses. Those signals do not transfer to Google Workspace's IP pool. You are essentially starting fresh on the new infrastructure.</li>
</ul>

<h2>Step-by-step diagnosis</h2>

<h3>Step 1: Verify SPF includes Google Workspace</h3>
<p>Your SPF record must contain <code>include:_spf.google.com</code>. Check with the <a href="/tools/spf">SPF checker</a>. If the include is missing, add it. If you have the wrong include value from the old provider still in place, update it.</p>

<h3>Step 2: Generate and publish DKIM keys in GWS</h3>
<p>Go to Google Admin Console → Apps → Google Workspace → Gmail → Authenticate email. Generate the key for your domain and add the TXT record to your DNS. Google recommends 2048-bit keys. Verify publication with the <a href="/tools/dkim">DKIM checker</a> — check the "google" selector.</p>

<h3>Step 3: Verify DMARC alignment</h3>
<p>Send a test email and look at the original headers. DMARC requires alignment between the From domain and either the SPF domain or the DKIM domain. Check with the <a href="/tools/dmarc">DMARC lookup</a>.</p>

<h3>Step 4: Allow DNS propagation</h3>
<p>Allow 48–72 hours for DNS propagation after making changes. Test deliverability after propagation is complete, not during it. Use the <a href="/test">inbox placement test</a> to confirm end-to-end authentication results.</p>

<h2>The fix path</h2>
<p>Update all DNS records to reference Google Workspace infrastructure. Remove references to your old provider unless you still actively send from them. Ensure only one SPF record exists on the domain.</p>
<p>Set up DKIM in Google Workspace and publish the key. This is the most commonly missed step in migrations because the old DKIM key simply does not work with GWS's sending infrastructure.</p>
<p>Monitor Postmaster Tools after migration. Your domain reputation may start as unknown on Google's infrastructure even if it was established before. Treat the first 2–4 weeks after migration like a warmup period, sending at lower volume and prioritizing engaged recipients.</p>

<h2>Repair or replace?</h2>
<p>This is almost always repairable. Migration-related spam issues are usually caused by DNS misconfiguration that can be fixed in hours. Once SPF, DKIM, and DMARC are correctly set up for Google Workspace, deliverability should recover within a few days to a week.</p>
<p>If your domain had reputation problems before the migration, the move to Google Workspace will not fix those. Address the underlying reputation issues separately.</p>

<div class="checklist">
<h4>Mistakes that make this worse</h4>
<ul>
<li>Leaving old SPF includes in place alongside Google's include, pushing you over the 10 DNS lookup limit</li>
<li>Forgetting to generate new DKIM keys for Google Workspace</li>
<li>Sending at full volume immediately after migration before DNS has propagated</li>
<li>Not checking DMARC alignment after changing sending infrastructure</li>
<li>Assuming that because you used Google Workspace before on another domain, the setup transfers automatically</li>
</ul>
</div>
`
},

{
  slug: "google-workspace-cold-email-setup-mistakes",
  title: "Google Workspace Cold Email Setup Mistakes That Kill Inbox Placement",
  category: "Google Workspace",
  readTime: 9,
  excerpt: "Most cold email setup guides give you the minimum steps but leave out the details that actually matter for deliverability. Here's what every GWS setup guide misses.",
  body: `
<p>You set up Google Workspace for cold email. You followed a guide, configured DNS, maybe did some warmup. But inbox placement is poor from the start. Emails hit spam, open rates are low, and nothing seems to work the way the guide promised. The setup itself is the problem — but it's not obvious where.</p>

<h2>The most common setup mistakes</h2>

<h3>1. Not setting up DMARC at all</h3>
<p>All senders need SPF or DKIM. But even below the bulk sender threshold, Google recommends always setting up all three authentication records. Not having DMARC removes a layer of trust signaling and means you're flying blind on authentication failures. Add at minimum: <code>v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com</code>. Verify with the <a href="/tools/dmarc">DMARC lookup</a>.</p>

<h3>2. Skipping custom tracking domain setup</h3>
<p>When your outreach tool tracks opens and clicks through a shared domain like <code>track.outreachtool.com</code>, your reputation is tied to every other user on that domain. If anyone on that shared domain is sending spam, it affects your deliverability. Set up a custom CNAME and verify it's not proxied through Cloudflare using the <a href="/tools/tracking-domain">tracking domain checker</a>.</p>

<h3>3. Sending cold email from your primary business domain</h3>
<p>If your cold outreach triggers spam complaints, those complaints damage the reputation of the domain you use for all other business email. Best practice is to use a separate domain for cold outreach — one clearly related to your brand but isolated from your main domain. Check your main domain's health with the <a href="/tools/burn-score">burn score calculator</a>.</p>

<h3>4. Starting outreach before warmup is complete</h3>
<p>A 3-day warmup is not warmup. New inboxes need 2–4 weeks of gradual volume increase with positive engagement signals before they are ready for cold campaigns. Use the <a href="/tools/warmup-ready">warmup readiness checker</a> before activating any inbox for campaigns.</p>

<h3>5. No PTR record verification for custom SMTP</h3>
<p>Google requires that the sending IP has a valid reverse DNS record that resolves to a hostname, and that hostname must resolve back to the same IP. This is handled automatically by Google Workspace, but if you are using any third-party sending infrastructure, verify with the <a href="/tools/rdns">rDNS checker</a>.</p>

<h3>6. Redirect not configured on sending domain</h3>
<p>Sending domains should redirect to a real website. A domain that doesn't respond to HTTP requests looks like spam infrastructure. Check both root and www redirects with the <a href="/tools/redirect">redirect checker</a>.</p>

<h2>Step-by-step audit</h2>
<p>Run through the full <a href="/tools/launch-checklist">launch checklist</a> before sending from any domain. It covers auth, tracking, redirect, warmup status, and placement testing in one pass.</p>
<p>Additionally: send a plain text test email to a personal Gmail account, open the original message, and verify you see <code>spf=pass</code>, <code>dkim=pass</code>, and <code>dmarc=pass</code>. This is the single fastest way to confirm everything is working end-to-end.</p>

<h2>Repair or replace?</h2>
<p>If you caught these issues early and have not sent many cold emails yet, repairing the setup is straightforward. Fix the configuration, warm up properly, and you should be fine.</p>
<p>If you have been sending cold email from a poorly configured setup for weeks and your domain reputation is now damaged, you may need to start fresh on a new domain. For agencies that need to maintain client campaign timelines, <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> provides prewarmed Google Workspace inboxes on properly configured domains so you do not have to wait another 4–6 weeks to start over.</p>

<div class="checklist">
<h4>Mistakes that make this worse</h4>
<ul>
<li>Using the same domain for cold email and client-facing business email</li>
<li>Skipping DMARC because you are below 5,000 sends</li>
<li>Using a shared tracking domain and never checking</li>
<li>Running warmup for only a few days</li>
<li>Going to full sending volume before testing inbox placement</li>
<li>Assuming that because DNS looks right it is right, without actually checking message headers</li>
</ul>
</div>
`
},

{
  slug: "why-new-gws-inboxes-underperform",
  title: "Why New Google Workspace Inboxes Underperform in Cold Email",
  category: "Google Workspace",
  readTime: 8,
  excerpt: "New inboxes performing worse than established ones is expected — but there's a right and wrong way to build them up. Here's the framework.",
  body: `
<p>You spun up a set of new Google Workspace accounts for cold outreach. You configured DNS, maybe ran some warmup. But the new inboxes are performing noticeably worse than your established ones — lower open rates, fewer replies, more spam placement — even when running the same campaigns to similar audiences.</p>

<h2>Why this happens</h2>
<p>New inboxes have no sending history and no engagement history. Gmail has nothing to go on. Even with perfect authentication, a new inbox starts with zero trust. Every email you send from it is evaluated more skeptically than the same email from an inbox that has been sending and receiving engaged replies for months.</p>
<p>Beyond that, domain age matters. If the new inboxes are on a brand new domain registered days or weeks ago, the domain itself has no reputation. Even if it is a subdomain or alternate domain related to your established brand, Gmail treats it independently.</p>
<p>Warmup quality also differs dramatically between tools and approaches. Basic warmup that just sends and opens is less effective than warmup that generates actual replies and varied engagement patterns. Some warmup networks are themselves flagged by Gmail, which means the warmup activity counts against you rather than for you.</p>

<h2>Step-by-step diagnosis</h2>

<h3>Step 1: Compare auth headers between old and new inboxes</h3>
<p>Send test emails from both old and new inboxes to the same personal Gmail account and compare the original message headers. Both should show SPF, DKIM, and DMARC passing. Use the <a href="/tools/dkim">DKIM checker</a> and <a href="/tools/spf">SPF checker</a> to verify.</p>

<h3>Step 2: Check domain age</h3>
<p>If the new inboxes are on a domain registered within the last 30 days, lack of domain history is a significant factor. Check with the <a href="/tools/domain-expiry">domain expiry checker</a> to see registration date.</p>

<h3>Step 3: Check warmup duration and quality</h3>
<p>How long did the new inboxes warm up? What kind of engagement was generated during warmup? Run the <a href="/tools/warmup-ready">warmup readiness checker</a> to assess whether they were actually ready for live sends.</p>

<h3>Step 4: Run placement tests on each inbox separately</h3>
<p>Use the <a href="/test">placement test</a> from each inbox individually to quantify the difference and track improvement over time.</p>

<h2>The fix path</h2>
<p>Extend the warmup period. New inboxes need at least 2–4 weeks of warmup before production sends. Keep warmup running between campaigns even after you start sending.</p>
<p>Reduce volume on new inboxes significantly. Start at 5–10 per day and ramp up by 5–10 more each week based on engagement and placement test results. Use the <a href="/tools/send-limits">sending limit planner</a> with GWS selected to configure the correct ramp.</p>
<p>Give new inboxes your best leads first. The contacts most likely to open and reply should go to your newest inboxes because they need positive engagement signals the most.</p>
<p>Keep new inboxes separate from established ones in your campaign rotation. Do not mix new and old inboxes in the same campaign sequence or you will not be able to identify which inboxes are causing problems.</p>

<h2>Repair or replace?</h2>
<p>New inboxes that underperform are not broken. They are immature. With proper warmup and gradual volume ramp, most new inboxes will reach acceptable performance in 3–6 weeks.</p>
<p>However, if you need inboxes performing at a high level immediately for client campaigns, waiting weeks is not always viable. This is where <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> fills a real operational gap. Instead of spending a month warming up new accounts yourself, you can bring in inboxes that have already been warmed on aged domains with established sending history. They perform from day one because they already have the reputation foundation that takes weeks to build.</p>
`
},

{
  slug: "recover-google-workspace-after-bad-campaign",
  title: "How to Recover Google Workspace Deliverability After a Bad Campaign",
  category: "Google Workspace",
  readTime: 9,
  excerpt: "One bad campaign can tank domain reputation for weeks. Here's the fastest legitimate recovery path — and when to cut your losses.",
  body: `
<p>You sent a campaign that went badly. Maybe the list was bad. Maybe the content triggered spam filters. Maybe you scaled too fast. Now your Google Workspace domain reputation is damaged, emails are going to spam, and your other campaigns on the same domain are suffering too. You need to recover as fast as possible.</p>

<h2>Why this happens</h2>
<p>A bad campaign can damage domain reputation in several ways. High bounce rates from a dirty list signal to Gmail that you are not managing your sending responsibly. Spam complaints from recipients directly tell Gmail to trust you less. A sudden volume spike triggers automated throttling. Content that looks like spam trains Gmail's filters to associate your domain with spam patterns.</p>
<p>Google's documentation notes that maintaining a high spam rate leads to increased spam classification and that it can take time for improvements to reflect positively. The damage is not instant to build and not instant to fix.</p>

<h2>Step-by-step diagnosis</h2>

<h3>Step 1: Check Postmaster Tools immediately</h3>
<p>Look at domain reputation, spam rate, and feedback loop data. Identify when the decline started and correlate it with the campaign in question.</p>

<h3>Step 2: Check bounce rates</h3>
<p>If hard bounce rates were above 2% in the bad campaign, that is a significant negative signal. Clean your lists before any future sends.</p>

<h3>Step 3: Check spam complaint rates</h3>
<p>If the spam rate exceeded 0.3% in Postmaster Tools, you crossed Google's stated threshold. Even at 0.1%, you are in the danger zone.</p>

<h3>Step 4: Check blocklists</h3>
<p>Run your domain and sending IPs through the <a href="/tools/blacklist">blacklist checker</a>. A bad campaign can trigger a listing, which compounds the problem.</p>

<h3>Step 5: Run a placement test</h3>
<p>Use the <a href="/test">inbox placement test</a> to get the current delivery verdict and authentication results from the receiver's perspective.</p>

<h2>The fix path</h2>
<p>Stop all cold outreach from the affected domain immediately. Every additional email sent from a damaged domain while it is in a bad state makes things worse.</p>
<p>Keep warmup running at low volume — 10–20 warmup emails per day. Warmup engagement generates positive signals that help offset the damage. But keep the volume low.</p>
<p>If spam rate is above 0.3%, that needs to drop before anything else will improve. Since you stopped cold outreach, the spam rate should decline as your complaint-generating messages stop going out.</p>
<p>Clean your lists aggressively. Remove all bounced addresses, remove unengaged addresses, and reverify your remaining contacts before any future sends.</p>
<p>After 1–2 weeks of rest with warmup-only activity, run placement tests. If placement is back above 80%, you can resume cold outreach at very low volume (5–10 per day) with your cleanest, most targeted list. Ramp volume back up slowly over 2–4 weeks, monitoring Postmaster Tools and placement tests at each stage.</p>

<h2>Repair or replace?</h2>
<p>If the bad campaign was a one-time event and your domain was healthy before, recovery typically takes 2–4 weeks of rest and low-volume warmup. The domain is repairable.</p>
<p>If the bad campaign was the latest in a pattern of problems, or if Postmaster Tools shows your domain reputation was already declining before this campaign, the domain may be too far gone for a quick recovery.</p>
<p>For agencies with active client campaigns, the recovery timeline is the problem — you cannot tell a client to wait a month. The practical approach is to shift campaigns to clean, prewarmed infrastructure while the damaged domain recovers. <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> exists for exactly this situation: prewarmed Google Workspace inboxes on healthy domains that can absorb your campaign load while you rehab the damaged assets in the background.</p>

<div class="checklist">
<h4>Mistakes that make this worse</h4>
<ul>
<li>Continuing to send through a damaged domain while "waiting for reputation to recover"</li>
<li>Trying to fix the problem by sending more to see if it gets better</li>
<li>Sending follow-up or apology emails to the same list that generated complaints</li>
<li>Not checking Postmaster Tools and guessing at the problem</li>
<li>Switching to a new domain without warming it first, which just creates a new problem</li>
</ul>
</div>
`
},

{
  slug: "gws-warmup-not-translating-campaigns",
  title: "Google Workspace Warmup Working but Campaign Emails Still Go to Spam",
  category: "Google Workspace",
  readTime: 8,
  excerpt: "Warmup metrics look healthy. But real campaign emails go to spam. Here's why warmup success doesn't automatically translate to campaign performance.",
  body: `
<p>You are running warmup on your Google Workspace inboxes. The warmup dashboard shows healthy metrics, messages being sent and received, opens and replies happening. But when you send actual cold outreach emails, they go to spam. The warmup seems to be working for warmup messages but not translating to real campaign performance.</p>

<h2>Why warmup success doesn't equal campaign success</h2>
<p>Warmup activity and cold outreach activity are not the same thing in Gmail's eyes. Warmup generates engagement between your inbox and other inboxes in the warmup network. If those warmup inboxes are all in the same network, Gmail may recognize the pattern and weight the engagement differently than organic engagement from real recipients.</p>
<p>Beyond the warmup network quality, here are the most common reasons warmup success does not translate:</p>
<ul>
<li><strong>Volume mismatch.</strong> If warmup is running at 10 messages per day but you are sending 50 cold emails per day, the positive signals from warmup are overwhelmed by the volume and potential negative signals from cold outreach.</li>
<li><strong>Content difference.</strong> Warmup messages are typically plain text and conversational. Your cold email might contain links, tracking pixels, HTML formatting, or content patterns that Gmail treats differently.</li>
<li><strong>List quality issues.</strong> If even 1–2% of your cold outreach bounces or generates spam complaints, that can undo the reputation benefit of warmup.</li>
<li><strong>Different sending infrastructure.</strong> If your outreach tool sends through different IPs than Google Workspace's native sending, the warmup on Google's IPs does not help the IPs your outreach tool uses.</li>
<li><strong>Poor warmup network quality.</strong> Some warmup tools use networks that Gmail has identified and discounted. The warmup looks active in your dashboard but Gmail is not counting it as positive engagement.</li>
</ul>

<h2>Step-by-step diagnosis</h2>

<h3>Step 1: Send a plain text test</h3>
<p>Send a plain text test email with no links or tracking from the same inbox that is running warmup. Use the <a href="/test">placement test</a>. If it lands in the inbox, your warmup is working and the problem is your campaign content or list quality.</p>

<h3>Step 2: Compare headers between warmup and campaign emails</h3>
<p>Are they routing through the same infrastructure? If your outreach tool sends through different IPs than Google Workspace's native sending, the warmup on Google's IPs does not help.</p>

<h3>Step 3: Check list quality</h3>
<p>What is your bounce rate on recent campaigns? If it is above 2%, your list is dirty enough to undermine warmup. Run the <a href="/tools/blacklist">blacklist check</a> on your domain to see if recent sends have pushed you onto any lists.</p>

<h3>Step 4: Test campaign content elements individually</h3>
<p>Remove links and send. Remove tracking and send. Simplify subject lines and send. Isolate which element is triggering filters. Use the <a href="/tools/subject-check">subject spam tester</a> and <a href="/tools/link-check">link checker</a> to analyze specific elements.</p>

<h2>The fix path</h2>
<p>If warmup is working but campaigns are not, fix the campaigns. Strip content back to plain text, remove tracking temporarily, clean your list until bounces are near zero, and start at very low campaign volume while warmup continues running.</p>
<p>If your outreach tool sends through different infrastructure than Google Workspace, you need to warm up on that specific infrastructure too. Warmup on Google's native SMTP does not build reputation for a third-party tool's sending IPs.</p>
<p>Ensure your warmup and campaign ratios make sense. Your campaign volume should not exceed your warmup volume in the early weeks. As reputation builds, you can gradually increase the ratio.</p>

<h2>Repair or replace?</h2>
<p>If your inbox is genuinely warming up (plain text test emails land in inbox) and the issue is campaign content or list quality, this is a campaign problem, not an inbox problem.</p>
<p>If you have been running warmup for more than 4 weeks and even plain text test emails still hit spam, the inbox or domain may be damaged beyond what warmup can fix. In that case, replacing the inbox is faster than continuing to warm something that is not recovering. <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> provides inboxes that have already been through a full warmup cycle on aged domains, so you can route your campaigns through healthy infrastructure immediately while deciding whether to keep trying to recover the damaged accounts.</p>
`
},

{
  slug: "test-gws-inbox-placement-before-scale",
  title: "The Right Way to Test Google Workspace Inbox Placement Before Scaling",
  category: "Google Workspace",
  readTime: 7,
  excerpt: "Don't find out your emails are going to spam by watching reply rates collapse. Here's how to test placement before burning your best leads.",
  body: `
<p>You have set up Google Workspace for cold email. Warmup has been running. DNS is configured. You think things look good, but you want to verify before you put real campaigns in production. Open rates are not reliable indicators of inbox placement. The only way to know where your emails are landing is to test with seed accounts and check placement directly.</p>

<h2>Why testing before scale matters</h2>
<p>Once you send a campaign to a cold list and those emails go to spam, the damage is done. You do not just lose those leads. The spam placement generates negative engagement signals and potentially spam complaints that further damage your domain reputation. Testing before sending at scale is the cheapest insurance you can buy.</p>

<h2>How to test properly</h2>

<h3>Step 1: Set up seed accounts</h3>
<p>Create test accounts across major providers your audience uses: 2–3 personal Gmail accounts, 1–2 Google Workspace accounts if your targets are on Workspace, 2–3 Outlook.com personal accounts, 1–2 Microsoft 365 business accounts if possible, and 1–2 Yahoo accounts. Do not add these seed addresses to your contacts and do not set up any rules — they should represent a default, unknown recipient experience.</p>

<h3>Step 2: Send realistic test emails</h3>
<p>Use your actual campaign content. Same subject line, body, links, tracking, and signature you plan to use in production. Do not send a generic test message because it will not trigger the same filters as your real campaign. Send from each inbox you plan to use.</p>

<h3>Step 3: Use the placement test tool</h3>
<p>The <a href="/test">inbox placement test</a> sends through your actual sending infrastructure and checks where it lands. The result shows the authentication results from the receiver's perspective — this is more reliable than manual seed testing for confirming end-to-end auth.</p>

<h3>Step 4: Check each seed account manually</h3>
<p>For Gmail: check Primary, Promotions, Social, Updates, and Spam. For Outlook: check Focused, Other, and Junk. For Yahoo: check Inbox and Spam. Record results in a spreadsheet by sending inbox and receiving provider.</p>

<h3>Step 5: Calculate your inbox placement rate</h3>
<p>Count emails that landed in the primary inbox divided by total sent. Target 80% or better before launching production campaigns. Run at least 3 tests over a week — a single test on a single day can be misleading.</p>

<h2>Reading the results</h2>
<p>If all providers show spam: domain or IP reputation issue. Check Postmaster Tools and the <a href="/tools/blacklist">blacklist checker</a>.</p>
<p>If only Gmail shows spam but Outlook and Yahoo are fine: Gmail-specific reputation or content filtering. Check Postmaster Tools for domain-specific data.</p>
<p>If emails land in Promotions on Gmail but inbox on other providers: content formatting issue. Simplify to plain text.</p>
<p>If some inboxes place well and others do not: inbox-specific issue. Some inboxes may not have warmed enough. Check with the <a href="/tools/warmup-ready">warmup readiness checker</a>.</p>

<h2>Repair or replace?</h2>
<p>Testing is about finding problems before they cost you leads. If testing reveals issues, follow the appropriate fix path based on the diagnosis. Most issues found during testing are fixable because you caught them before they caused reputation damage from real campaign sends.</p>
<p>If testing reveals that specific inboxes are consistently performing poorly despite proper setup and warmup, those inboxes may need more warmup time or may need to be replaced entirely. Having a set of tested, prewarmed backup inboxes from <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> means you can swap out underperformers immediately and keep your launch timeline intact.</p>
`
},

{
  slug: "microsoft-365-spam-even-with-auth",
  title: "Microsoft 365 Cold Emails Going to Spam Even With SPF DKIM DMARC",
  category: "Microsoft 365",
  readTime: 9,
  excerpt: "SPF, DKIM, and DMARC all pass. But Outlook is putting your emails in Junk. Here's why Microsoft filters differently — and what actually fixes it.",
  body: `
<p>Your SPF, DKIM, and DMARC all pass. You verified it in message headers. But your cold emails are landing in the Junk folder on Outlook.com and Microsoft 365 accounts. Gmail might be fine. Yahoo might be fine. But Microsoft is filtering you to spam and you cannot figure out why.</p>

<h2>Why authentication alone doesn't solve Microsoft deliverability</h2>
<p>Microsoft joined the bulk sender enforcement game in May 2025 — Outlook.com now requires SPF, DKIM, and DMARC for senders sending 5,000 or more messages per day, with non-compliant senders moved to Junk. But even below that threshold, Microsoft has its own filtering logic that differs significantly from Gmail's.</p>
<p>Microsoft uses SmartScreen filtering and its own sender reputation system. This system weighs factors differently than Gmail:</p>
<ul>
<li><strong>IP reputation carries more weight.</strong> If your sending IP — whether shared through an outreach tool or dedicated — has poor reputation in Microsoft's system, authentication will not override that.</li>
<li><strong>Outlook applies more aggressive content-based filtering</strong> for cold outreach patterns. Messages that look like unsolicited commercial email face higher scrutiny even from authenticated senders.</li>
<li><strong>Microsoft tracks sender behavior independently from Gmail and Yahoo.</strong> Your reputation with Microsoft is built separately. Many cold email operators monitor Gmail Postmaster Tools but completely ignore Microsoft SNDS, letting Outlook deliverability degrade unnoticed.</li>
</ul>

<h2>Step-by-step diagnosis</h2>

<h3>Step 1: Verify authentication headers</h3>
<p>Check message headers on a test email sent to an Outlook.com account. Confirm SPF, DKIM, and DMARC all pass. Use the <a href="/tools/spf">SPF checker</a>, <a href="/tools/dkim">DKIM checker</a>, and <a href="/tools/dmarc">DMARC lookup</a>.</p>

<h3>Step 2: Check your sending IP reputation with Microsoft SNDS</h3>
<p>Sign up at sendersupport.olc.protection.outlook.com and register your IPs. This tells you how Microsoft views your sending IP. A red or yellow status there is often the primary cause of Outlook-specific Junk placement.</p>

<h3>Step 3: Check for Microsoft-specific blocklists</h3>
<p>Microsoft maintains its own blocklist separate from common third-party lists. If your IP is on Microsoft's blocklist, you need to submit a delist request through their support page. Also run the <a href="/tools/blacklist">blacklist checker</a> to cover the major third-party RBLs.</p>

<h3>Step 4: Test content separately</h3>
<p>Send a plain text email with no links or tracking to an Outlook.com account. If it lands in inbox, your content or tracking is the trigger. If plain text also hits Junk, the problem is IP or domain reputation.</p>

<h2>The fix path</h2>
<p>If IP reputation is the issue, you need to either improve it or change IPs. Reducing volume to that IP, increasing engagement rates, and avoiding complaints can improve IP reputation over time. If you are on a shared IP with poor reputation, you may need to request a different IP from your sending provider or switch to a dedicated IP.</p>
<p>If content is triggering Outlook filters, simplify. Plain text performs better on Microsoft than HTML templates. Minimize links. Avoid URL shorteners. Keep formatting clean and simple.</p>
<p>Register with SNDS and JMRP (Junk Mail Reporting Program) to get feedback from Microsoft about how your emails are being received. This is the Outlook equivalent of Gmail Postmaster Tools and is essential for monitoring Microsoft deliverability.</p>

<h2>Repair or replace?</h2>
<p>If IP reputation is the issue, the fastest fix is moving to a different IP. If domain reputation with Microsoft specifically is the issue, reduce volume, generate positive engagement, and wait for reputation to improve over 2–4 weeks.</p>
<p>For agencies managing client campaigns that target companies using Microsoft 365 — which is a huge percentage of B2B targets — Outlook deliverability is not optional. If your current inboxes are performing poorly on Microsoft, rotating in prewarmed inboxes from <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> that have already established positive sending patterns to Outlook recipients can bridge the gap while you diagnose and fix the underlying IP or reputation issue.</p>
`
},

{
  slug: "outlook-filters-cold-email-harder-than-gmail",
  title: "Why Outlook Filters Cold Emails Harder Than Gmail",
  category: "Microsoft 365",
  readTime: 8,
  excerpt: "Same emails, same authentication, same domain — but Outlook kills your deliverability while Gmail is fine. Here's why Microsoft's filters behave differently.",
  body: `
<p>Your cold emails perform reasonably well on Gmail. Open rates are decent, replies come in. But the same campaigns to Outlook and Microsoft 365 recipients show dramatically worse results. Emails land in Junk. Open rates tank. It feels like Outlook has a grudge against cold email.</p>

<h2>Why Outlook and Gmail filter differently</h2>
<p>Outlook and Gmail use fundamentally different filtering philosophies. Gmail uses a machine learning approach that heavily weighs domain reputation and user engagement signals. Outlook uses SmartScreen technology that puts more emphasis on IP reputation, sender behavior patterns, and content-level analysis.</p>
<p>Several specific factors make Outlook harder for cold email:</p>
<ul>
<li><strong>IP reputation carries more weight.</strong> Microsoft maintains its own IP reputation system. A shared IP that is fine for Gmail deliverability might be flagged in Microsoft's system. And because Microsoft processes email for both Outlook.com consumer accounts and Microsoft 365 business accounts, a bad IP reputation affects both audiences.</li>
<li><strong>Microsoft is more aggressive about filtering unknown senders.</strong> Gmail might give a new sender the benefit of the doubt and place them in a tab. Microsoft is more likely to put unknown senders directly in Junk.</li>
<li><strong>Corporate Microsoft 365 environments often have additional filtering layers.</strong> Companies running Exchange Online have admin-level spam policies, connection filters, and mail flow rules that can catch cold emails before they even reach the individual user's mailbox.</li>
<li><strong>Outlook users use the Junk button more readily than Gmail users use the Spam button.</strong> Complaint rates can build faster on Microsoft, which compounds filtering problems quickly.</li>
</ul>

<h2>Step-by-step diagnosis</h2>

<h3>Step 1: Test separately for each provider</h3>
<p>Send the same email from the same inbox to Gmail, Outlook.com, and Yahoo test accounts. Compare placement across all three. Use the <a href="/test">placement test</a> for the definitive verdict.</p>

<h3>Step 2: Check your sending IP reputation with Microsoft SNDS</h3>
<p>This is the most common cause of Outlook-specific problems. Go to sendersupport.olc.protection.outlook.com and check your sending IP's reputation in Microsoft's Sender Network Data Services.</p>

<h3>Step 3: Test content variations</h3>
<p>Send a plain text email with no links to Outlook. If it lands in inbox, your content or tracking is the trigger. Check your links and tracking setup with the <a href="/tools/link-check">link reputation checker</a> and <a href="/tools/tracking-domain">tracking domain checker</a>.</p>

<h3>Step 4: Check blacklists</h3>
<p>Run the <a href="/tools/blacklist">blacklist checker</a> on both domain and sending IP. Microsoft's EOP subscribes to Spamhaus feeds — a Spamhaus listing directly affects Outlook deliverability.</p>

<h2>The fix path</h2>
<p>Register for SNDS and JMRP if you have not already. Monitor your IP reputation with Microsoft separately from Gmail.</p>
<p>If IP reputation is poor, work with your outreach tool to either get a different IP or move to a dedicated IP. On shared infrastructure, this might mean changing providers.</p>
<p>Optimize content for Outlook: plain text with minimal links performs better. Remove marketing-style HTML formatting. Keep signatures simple.</p>
<p>Consider using Microsoft 365 inboxes specifically for reaching Microsoft recipients. Sending from Microsoft infrastructure to Microsoft recipients sometimes performs better because the sending IP is within Microsoft's trusted IP ecosystem.</p>

<h2>Repair or replace?</h2>
<p>If the issue is IP reputation, changing IPs is often faster than trying to rehabilitate a damaged IP. This might mean changing outreach tools or requesting new infrastructure from your current provider.</p>
<p>If you need immediate Outlook performance for B2B campaigns, <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> can provide prewarmed Microsoft 365 inboxes with established sending patterns to Microsoft recipients. This gives you clean infrastructure specifically optimized for the Outlook ecosystem.</p>
`
},

{
  slug: "fix-microsoft-365-cold-email-after-domain-setup",
  title: "How to Fix Microsoft 365 Cold Email Deliverability After Domain Setup",
  category: "Microsoft 365",
  readTime: 8,
  excerpt: "M365 setup for cold email has several non-obvious requirements that catch operators off guard. Here's the complete fix guide.",
  body: `
<p>You set up Microsoft 365 for cold email outreach. DNS records are configured. You start sending and emails are going to Junk on Outlook and sometimes spam on other providers. The setup should be working but something is wrong.</p>

<h2>Why M365 setup problems are different from GWS</h2>
<p>Microsoft 365 setup for cold email has several pitfalls that differ from Google Workspace. The most common: DKIM setup in M365 is not as straightforward as in GWS. Microsoft requires you to publish two CNAME records for DKIM (selector1 and selector2) and then enable DKIM signing in the Microsoft 365 admin center. If you only published the DNS records but did not enable signing, your emails are not DKIM-signed — and the problem is completely invisible in your ESP.</p>

<h2>The complete M365 authentication fix</h2>

<h3>SPF fix</h3>
<p>Your SPF record must include <code>include:spf.protection.outlook.com</code>. If this is missing, add it. If you have the wrong include value from a previous provider, update it. Ensure you have only one SPF record. Verify with the <a href="/tools/spf">SPF checker</a>.</p>

<h3>DKIM fix — the most commonly missed step</h3>
<p>DKIM is not enabled by default in M365. You must enable it in Microsoft 365 Defender:</p>
<ol>
<li>Go to security.microsoft.com</li>
<li>Email and Collaboration → Policies and Rules → Threat Policies → DKIM</li>
<li>Select your domain → Enable</li>
<li>Publish both CNAME records Microsoft provides to your DNS (selector1 and selector2)</li>
</ol>
<p>Verify both selectors are published and active with the <a href="/tools/dkim">DKIM checker</a>.</p>

<h3>DMARC fix</h3>
<p>Add: <code>v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com</code>. Start with none and monitor. Verify with the <a href="/tools/dmarc">DMARC lookup</a>.</p>

<h2>M365-specific sending limits</h2>
<p>M365 has lower safe sending limits for cold email than GWS. Maximum recommended is 10 sends per inbox per day for cold email. New tenants are particularly restricted. If you exceed these limits, Microsoft may throttle or block your sending. Use the <a href="/tools/send-limits">sending limit planner</a> with M365 selected to configure your ramp correctly.</p>

<h2>Step-by-step diagnosis</h2>

<h3>Check if you're using M365 or a third-party tool's infrastructure</h3>
<p>If you are also using a third-party outreach tool alongside Microsoft 365, determine which infrastructure is actually sending your cold emails. The outreach tool may bypass Microsoft's SMTP entirely, meaning your Microsoft DNS setup is not being used for those sends and the problem is elsewhere.</p>

<h3>Test across providers</h3>
<p>Send test emails to accounts across Gmail, Outlook.com, and Yahoo. Use the <a href="/test">placement test</a> for the full authentication result. Check each provider separately — if only Microsoft recipients see Junk placement, it is an Outlook-specific issue.</p>

<h2>Repair or replace?</h2>
<p>If the issues are configuration mistakes, they are straightforward to fix. Correct your DNS, enable DKIM signing in the admin center, and start warmup. Deliverability should improve within a few days to a week.</p>
<p>If you have been sending cold email from a misconfigured M365 setup for weeks and have accumulated reputation damage, recovery takes longer. Reduce volume, fix configuration, and allow 2–4 weeks of low-volume warmup to rebuild.</p>
<p>If you need M365 inboxes performing immediately for B2B campaigns, <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> can provide properly configured and prewarmed Microsoft 365 accounts ready for production.</p>
`
},

{
  slug: "microsoft-365-new-domain-cold-email-problems",
  title: "Microsoft 365 New Domain Cold Email Problems and How to Avoid Them",
  category: "Microsoft 365",
  readTime: 7,
  excerpt: "New domains on M365 face a double reputation challenge. Here's why deliverability starts poor and the exact steps to avoid the most common traps.",
  body: `
<p>You registered a new domain, set up Microsoft 365 on it for cold outreach, and discovered that deliverability is poor out of the gate. Emails land in Junk, get deferred, or get rejected outright. You did the DNS configuration but Microsoft is not treating your new domain well.</p>

<h2>Why new domains on M365 start harder</h2>
<p>New domains on Microsoft 365 face a double reputation challenge: the domain has no history and the M365 tenant is new. Microsoft applies heightened scrutiny to new tenants because spammers regularly spin up M365 accounts for bulk sending. This means new domains on M365 start in a worse position than new domains on some other providers.</p>
<p>Microsoft's outbound sending pool is shared. New tenants are placed on lower-reputation IP pools until they establish a positive sending pattern. If other new tenants on the same pool are sending spam, your deliverability suffers. Sending limits for new M365 tenants are also restrictive by design — Microsoft intentionally caps sending volume for new accounts and increases limits as the tenant matures.</p>

<h2>Step-by-step diagnosis</h2>

<h3>Step 1: Confirm all authentication is correct</h3>
<p>Check SPF, DKIM (both selectors), and DMARC. Check email headers from test emails. For M365, specifically verify DKIM signing is enabled in the Microsoft 365 Defender portal — not just that the DNS records are published. Use the <a href="/tools/dkim">DKIM checker</a> to verify both selector1 and selector2.</p>

<h3>Step 2: Check if you're hitting sending limits</h3>
<p>Check bounce messages for rate-limiting errors. New M365 tenants should start at 5–10 emails per day and ramp over weeks. Use the <a href="/tools/send-limits">sending limit planner</a> to configure the correct limits.</p>

<h3>Step 3: Check domain age</h3>
<p>If the domain was registered within the last 30 days, age is a major factor for Microsoft specifically. Check with the <a href="/tools/domain-expiry">domain expiry checker</a> to see registration date. Microsoft weights domain age more heavily than Google for new sender evaluation.</p>

<h3>Step 4: Check the sending IP reputation</h3>
<p>Check the IP addresses your M365 tenant uses for outbound mail (visible in email headers) against Microsoft SNDS.</p>

<h2>The fix path</h2>
<p>Do not send cold outreach from the domain until you have warmed it for at least 2–4 weeks. Start with internal communication and warmup network engagement only. New M365 tenants should start at 5–10 emails per day and ramp over weeks, not days.</p>
<p>Use domain aging to your advantage. Register domains 30–60 days before you plan to use them. Set up DNS immediately but do not start sending until the domain has some age. Check your domains' current expiry and registration dates with the <a href="/tools/domain-expiry">domain expiry checker</a>.</p>
<p>Keep warmup running continuously. M365 inboxes need sustained engagement signals just like Google Workspace inboxes. Use the <a href="/tools/warmup-ready">warmup readiness checker</a> before activating any inbox for campaigns.</p>

<h2>Repair or replace?</h2>
<p>New domain problems on M365 are usually a patience issue. The domain and tenant need time to build reputation. If you give them that time with proper warmup, they will perform.</p>
<p>If you do not have 4–6 weeks to wait, consider using domains that have already been aged and warmed. <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> provides Microsoft 365 accounts on domains that have been through the maturation process, which eliminates the new-domain penalty entirely.</p>
`
},

{
  slug: "outlook-inbox-placement-drops-volume-increase",
  title: "Why Outlook Inbox Placement Drops After Increasing Sending Volume",
  category: "Microsoft 365",
  readTime: 7,
  excerpt: "Outlook placement was fine at 30/day. You scaled to 80/day and Junk placement spiked. Here's the mechanism and how to scale Microsoft without breaking it.",
  body: `
<p>Your Microsoft 365 or Outlook-bound cold email was performing fine at 20–30 emails per day. You increased to 50 or 80 per day and Outlook placement dropped sharply. Emails that were reaching the inbox are now going to Junk. Gmail may still be fine. The only thing that changed was volume.</p>

<h2>Why Microsoft is more sensitive to volume changes than Gmail</h2>
<p>Microsoft's filtering is highly sensitive to volume changes. Outlook's SmartScreen and reputation system tracks sending patterns per domain and per IP. A sudden increase in volume — especially to Microsoft-hosted recipients — triggers rate limiting and increased spam filtering.</p>
<p>Microsoft tracks volume patterns more aggressively than Gmail for certain sender profiles. If your sending IP is shared (as it is for most M365 tenants), a volume spike from your domain combined with volume from other tenants on the same IP can push the IP over Microsoft's thresholds. Microsoft's 2025 enforcement for Outlook.com high-volume senders adds another layer — if you crossed the 5,000 message threshold without meeting all their requirements, enforcement kicks in.</p>

<h2>Step-by-step diagnosis</h2>

<h3>Step 1: Check SNDS for IP reputation changes</h3>
<p>Check your sending IP reputation in Microsoft SNDS. Look for changes around the time you increased volume. A yellow or red IP status is often the primary cause of Outlook-specific Junk placement.</p>

<h3>Step 2: Check for 4.x.x or 5.x.x error codes</h3>
<p>Check bounced or deferred messages. Microsoft uses specific error codes that indicate throttling vs. blocking. 4xx codes are deferrals (temporary), 5xx codes are rejections (permanent).</p>

<h3>Step 3: Compare Outlook placement before and after volume increase</h3>
<p>Run the <a href="/test">placement test</a> and send to Outlook.com seed accounts specifically. Compare current placement to what it was before the volume increase.</p>

<h3>Step 4: Check if the increase crossed the 5,000 message threshold</h3>
<p>If you crossed the 5,000 message threshold for Microsoft's bulk sender requirements without meeting all their requirements (SPF, DKIM, DMARC, one-click unsubscribe), enforcement kicks in.</p>

<h2>The fix path</h2>
<p>Reduce volume back to where Outlook placement was healthy. Hold there for 1–2 weeks.</p>
<p>Ramp back up more gradually — increase by no more than 10–20% per week while monitoring Outlook placement. Use the <a href="/tools/send-limits">sending limit planner</a> with M365 selected to get the correct ramp schedule.</p>
<p>If you need to send higher volumes to Microsoft recipients, distribute volume across more inboxes rather than pushing more through fewer accounts. Each inbox should stay within a reasonable daily volume — the calculator defaults to 10/day for M365 as the safe ceiling.</p>
<p>Monitor SNDS weekly during any volume ramp.</p>

<h2>Repair or replace?</h2>
<p>If you reduce volume and Outlook placement recovers within a week or two, the issue was volume-related and your domain and IP reputation are recoverable.</p>
<p>If placement does not recover after reducing volume, the reputation damage may be deeper. In that case, you may need to replace some inboxes with fresh, prewarmed accounts. <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> provides M365 inboxes with established sending patterns that can handle the volume you need while your original accounts recover.</p>
`
},

{
  slug: "microsoft-365-cold-email-setup-checklist",
  title: "Microsoft 365 Cold Email Setup Checklist for Better Inboxing",
  category: "Microsoft 365",
  readTime: 8,
  excerpt: "M365 cold email setup has more moving parts than GWS and more opportunities for misconfiguration. Here's the complete setup checklist to get it right from the start.",
  body: `
<p>You want to set up Microsoft 365 for cold email the right way from the start. You have seen too many setups go wrong and want a methodical approach that avoids the common pitfalls.</p>

<h2>Domain preparation</h2>
<div class="checklist">
<h4>Domain checklist</h4>
<ul>
<li>Register your domain at least 30 days before you plan to send cold email (60 days preferred for M365)</li>
<li>Use a dedicated domain for cold outreach, not your primary business domain</li>
<li>Confirm root domain redirects correctly (http → https, both root and www) with the <a href="/tools/redirect">redirect checker</a></li>
<li>Verify SSL certificate is valid and not expiring soon</li>
<li>Check domain expiry is 12+ months away with the <a href="/tools/domain-expiry">domain expiry checker</a></li>
</ul>
</div>

<h2>Microsoft 365 authentication configuration</h2>
<div class="checklist">
<h4>Authentication checklist</h4>
<ul>
<li>SPF record published: <code>v=spf1 include:spf.protection.outlook.com -all</code> — verify with <a href="/tools/spf">SPF checker</a></li>
<li>Only one SPF record on the domain</li>
<li>DKIM: enabled in Microsoft 365 Defender portal (not just DNS records published)</li>
<li>Both selector1 and selector2 CNAME records published in DNS and active — verify with <a href="/tools/dkim">DKIM checker</a></li>
<li>DMARC record published with rua tag — verify with <a href="/tools/dmarc">DMARC lookup</a></li>
<li>MX records configured for reply routing — verify with <a href="/tools/mx">MX checker</a></li>
</ul>
</div>

<h2>Tracking domain setup</h2>
<div class="checklist">
<h4>Tracking checklist</h4>
<ul>
<li>Tracking domain is completely separate from sending domain</li>
<li>Tracking domain CNAME points to correct ESP destination</li>
<li>Tracking domain is NOT proxied through Cloudflare (grey cloud not orange) — verify with <a href="/tools/tracking-domain">tracking domain checker</a></li>
<li>Tracking domain has valid SSL</li>
</ul>
</div>

<h2>Sending infrastructure</h2>
<div class="checklist">
<h4>Sending setup checklist</h4>
<ul>
<li>Maximum 3 inboxes per sending domain</li>
<li>Warmup tool connected and running — use the <a href="/tools/warmup-ready">warmup readiness checker</a> before going live</li>
<li>Sending limits configured: 2–3/day in week 1, ramp to 10/day max for M365 — use <a href="/tools/send-limits">sending limit planner</a></li>
<li>MX records configured so the inbox actually receives mail (important for domain legitimacy signals)</li>
</ul>
</div>

<h2>Pre-launch health checks</h2>
<div class="checklist">
<h4>Pre-launch checklist</h4>
<ul>
<li>Domain not listed on any major blacklist — check with <a href="/tools/blacklist">blacklist checker</a></li>
<li>Inbox placement test passes — test at <a href="/test">/test</a></li>
<li>Register for Microsoft SNDS to monitor IP reputation</li>
<li>Register for JMRP to receive Microsoft complaint feedback</li>
<li>List has been cleaned and verified before first send</li>
</ul>
</div>

<h2>Repair or replace?</h2>
<p>If you follow this checklist, you should not need to repair or replace early. The whole point is avoiding the mistakes that cause damage in the first place.</p>
<p>However, if you need M365 inboxes performing today and cannot wait weeks for this process, <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> provides accounts that have already been through this entire setup and warmup process. This is especially useful for agencies onboarding new clients who need campaigns live within days rather than weeks.</p>
`
},

{
  slug: "when-to-replace-microsoft-365-inboxes",
  title: "When to Replace Microsoft 365 Inboxes Instead of Trying to Fix Them",
  category: "Microsoft 365",
  readTime: 8,
  excerpt: "M365 setups can be harder to recover than GWS when damaged. Here's the framework for knowing when recovery is realistic and when replacement is the only path.",
  body: `
<p>You have been troubleshooting your M365 cold email setup for weeks. You have fixed authentication, reduced volume, simplified content, and run warmup. But inbox placement on Outlook is still poor. You are spending more time on deliverability than on the campaigns themselves.</p>

<h2>Why M365 is harder to recover than GWS</h2>
<p>Some M365 inboxes reach a point where reputation damage is self-reinforcing. Low engagement feeds low reputation which feeds more spam placement which feeds lower engagement. M365 setups are particularly prone to this because:</p>
<ul>
<li><strong>Less transparency in filtering decisions.</strong> Google provides Postmaster Tools with detailed domain reputation data. Microsoft's equivalent (SNDS) is less comprehensive and doesn't give the same level of visibility into why emails are being filtered.</li>
<li><strong>Microsoft's block lists are conservative.</strong> Getting off Microsoft's internal block lists requires direct engagement with their support team. The process is slower and less predictable than most other blacklist removals.</li>
<li><strong>M365-to-M365 sending dynamics.</strong> When your M365 account has a reputation issue and you're sending to Outlook/M365 recipients, you're being filtered by Microsoft at both ends. This double-filtering makes recovery much harder.</li>
</ul>

<h2>Signs that M365 recovery is unlikely</h2>
<ul>
<li>You've been actively working on recovery for more than 4 weeks and Outlook inbox placement is still below 50%</li>
<li>SNDS shows persistent red or yellow status for your sending IP and you cannot change the IP</li>
<li>Your domain has been listed on Microsoft's blocklist more than once after delisting requests</li>
<li>Active client campaigns are suffering and every week of troubleshooting costs revenue</li>
<li>Microsoft has rejected traffic from the domain with 5.7.1 or similar errors indicating active blocking</li>
</ul>

<h2>Signs M365 recovery is still worth trying</h2>
<ul>
<li>Domain is less than 3 months old with no documented spam complaints</li>
<li>Not listed on Spamhaus or Microsoft's internal lists</li>
<li>Auth is broken but reputation is otherwise intact — this is fixable without replacement</li>
<li>SNDS shows yellow (cautious) not red (blocked)</li>
</ul>

<h2>When to replace: the decision framework</h2>
<p>Use the <a href="/tools/repair-or-replace">repair-or-replace calculator</a> with your M365 specifics to get a structured recommendation. Also run the <a href="/tools/recovery-time">recovery time estimator</a> to compare how long repair vs. replacement will actually take.</p>
<p>Replace M365 inboxes when:</p>
<ul>
<li>Active client campaigns can't wait 6–10 weeks for recovery</li>
<li>SNDS shows Red IP rating for your sending infrastructure</li>
<li>You've been listed on Spamhaus</li>
<li>Multiple M365 accounts on the same domain are all failing simultaneously</li>
<li>The issue has persisted for more than 4 weeks despite correct auth and reduced volume</li>
</ul>

<h2>Replacement strategy for M365</h2>
<p>When replacing M365 infrastructure: consider whether GWS might outperform M365 for your target audience (often yes, unless recipients are predominantly corporate Outlook users). Purchase fresh domains aged 30+ days. Configure auth completely before any sending — including enabling DKIM signing in the Microsoft 365 Defender portal. Warm over 30 days minimum for M365 — longer than GWS. Start at 2–3 sends/day, ramp to 10 maximum over 4 weeks.</p>

<blockquote><p>If replacement is the right call and campaigns are active, <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> can provide pre-warmed inboxes that bypass the warmup period. This is particularly valuable for M365 setups where the warmup timeline is longer than GWS and recovery is less predictable.</p></blockquote>
`
},

{
  slug: "microsoft-365-reply-rates-fall-before-bounces",
  title: "Why M365 Reply Rates Fall Before Bounce Rates Rise",
  category: "Microsoft 365",
  readTime: 7,
  excerpt: "Bounce rates look normal. Delivers look fine. But replies are dying. Silent Junk placement is the most misdiagnosed cold email problem. Here's how to catch it.",
  body: `
<p>Your M365 cold email reply rates have been declining over the past few weeks but bounce rates look normal. You are still getting emails delivered. No bounces. But replies are drying up. It feels like a copy or targeting problem but something else might be going on.</p>

<h2>Why this is the most misdiagnosed cold email problem</h2>
<p>This is what silent deliverability degradation looks like. Microsoft does not always bounce messages from senders with declining reputation. Instead, it delivers them to Junk. The recipient never sees the email. They never reply. But you never get a bounce notification.</p>
<p>Your outreach tool shows the email as "delivered" because technically it was accepted by the receiving server. But "delivered" does not mean "in inbox" — it means "accepted by the server," which includes delivery to the Junk folder.</p>
<p>This is why relying solely on bounce rates as a health metric is dangerous. By the time bounces spike, the problem has been building for weeks.</p>

<h2>Step-by-step diagnosis</h2>

<h3>Step 1: Send test emails to Outlook.com accounts you control</h3>
<p>Check if they land in inbox or Junk. This is the fastest way to confirm whether the reply rate drop is a deliverability issue. If you don't have Outlook.com test accounts, set up 2–3 free ones specifically for this purpose.</p>

<h3>Step 2: Run a placement test</h3>
<p>Use the <a href="/test">placement test</a> — it sends through your actual sending infrastructure and shows the delivery verdict. If it shows spam, that confirms Junk placement is the issue.</p>

<h3>Step 3: Check open rates alongside reply rates</h3>
<p>If open rates have dropped proportionally to reply rates, emails are likely going to spam. If open rates are stable but reply rates dropped, it might actually be a copy or targeting issue — not deliverability.</p>

<h3>Step 4: Check SNDS for IP reputation changes</h3>
<p>A declining IP reputation correlates with increasing Junk placement. Look for changes around the time reply rates started dropping.</p>

<h3>Step 5: Review sending volume</h3>
<p>Did volume increase? Volume changes can trigger filtering that manifests as silent placement degradation. Check with the <a href="/tools/send-limits">sending limit planner</a> whether you're within M365-safe limits.</p>

<h2>The fix path</h2>
<p>If tests confirm Junk placement, treat this as a deliverability problem and follow the troubleshooting steps for Microsoft spam folder issues. Reduce volume while you diagnose. Run the <a href="/tools/burn-score">burn score calculator</a> on the affected domain to get an overall health assessment.</p>
<p>Do not change your email copy based on declining reply rates without first confirming that emails are reaching the inbox. Changing copy while emails are going to Junk is a waste of time and adds a confounding variable to your diagnosis.</p>

<h2>Repair or replace?</h2>
<p>If you catch this early (within 1–2 weeks of the reply rate decline starting), reducing volume and running warmup can usually recover placement within 2–3 weeks.</p>
<p>If the decline has been happening for a month or more and reply rates are near zero, the damage is significant. You may need to replace the affected inboxes while the originals rest and recover. <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> can provide immediate M365 replacement capacity so campaigns continue while you address the root cause.</p>
`
},

{
  slug: "run-outlook-inbox-placement-test",
  title: "How to Run an Outlook Inbox Placement Test for Cold Outreach",
  category: "Microsoft 365",
  readTime: 7,
  excerpt: "Most placement testing guides focus on Gmail. But a huge share of your B2B targets are on Outlook. Here's the full process for Outlook-specific placement testing.",
  body: `
<p>You want to test specifically how your cold emails perform on Outlook and Microsoft 365 accounts. Most testing guidance focuses on Gmail, but a large portion of your B2B target audience is on Microsoft-hosted email. If you only test against Gmail, you might have excellent inbox placement on Google while your emails are going straight to Junk for the exact audience you need to reach.</p>

<h2>Why Outlook-specific testing matters</h2>
<p>Microsoft's filtering differs from Gmail's in ways that matter for cold email. Content, IP reputation, and sender patterns are weighted differently. An email that passes Gmail's filters can fail Microsoft's. You need Outlook-specific testing as a separate discipline from Gmail testing.</p>

<h2>Step-by-step Outlook testing process</h2>

<h3>Step 1: Create seed accounts</h3>
<p>Set up 3–5 personal Outlook.com accounts (free accounts at outlook.com). Do not add any contacts or set up any rules. These accounts should reflect a default Outlook configuration. If you have access to a Microsoft 365 business account, create test addresses there too — M365 business accounts may have additional Exchange Online Protection policies that personal Outlook.com accounts do not have.</p>

<h3>Step 2: Use the placement test</h3>
<p>Run the <a href="/test">inbox placement test</a> — it sends through your actual sending infrastructure and shows the full authentication result as the receiving server saw it. This is the fastest way to get a definitive verdict. Also send manually from each inbox you plan to use to your Outlook.com seed accounts, using your actual campaign content.</p>

<h3>Step 3: Check each test account carefully</h3>
<p>Look at the Inbox, Junk Email folder, and Other tab (if Focused Inbox is enabled). Note where each email landed. A few key distinctions:</p>
<ul>
<li><strong>Junk</strong>: deliverability problem — authentication, IP reputation, or content issue</li>
<li><strong>Other tab (Focused Inbox)</strong>: not spam placement, but lower-engagement context. Microsoft's equivalent of Gmail's Promotions tab — better than Junk but worse than Focused inbox for engagement</li>
<li><strong>Focused</strong>: ideal placement</li>
</ul>

<h3>Step 4: Record and trend results</h3>
<p>Track sending inbox, receiving account, placement, and date in a spreadsheet. Repeat over multiple days — run at least 3 rounds over a week to get a reliable baseline.</p>

<h2>Reading the results</h2>
<p>All test emails in inbox: You are in good shape for Outlook recipients. Proceed with your campaign.</p>
<p>Mixed results (some inbox, some Junk): Inconsistency usually points to IP rotation. Your outbound emails may route through different Microsoft IPs on different sends.</p>
<p>All test emails in Junk: Your sending reputation with Microsoft is poor. Diagnose using SNDS, the <a href="/tools/blacklist">blacklist checker</a>, and authentication analysis.</p>
<p>Emails in "Other" tab: Simplify content, personalize more, and send fewer emails to build engagement signals.</p>

<h2>What to do with the results</h2>
<p>For Junk placement: check IP reputation in SNDS, check authentication with the <a href="/tools/dkim">DKIM checker</a> and <a href="/tools/spf">SPF checker</a>, and simplify content.</p>
<p>For inconsistent results: consider whether a dedicated IP or different sending infrastructure would provide more consistent routing.</p>
<p>For "Other" tab placement: adjust content to appear more personal and less automated.</p>

<blockquote><p>If testing reveals that your M365 inboxes consistently underperform for Outlook recipients, <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> provides prewarmed M365 accounts that can serve as benchmarks for what healthy Outlook placement looks like, and can replace underperforming inboxes immediately.</p></blockquote>
`
},

{
  slug: "spf-passes-cold-emails-still-spam",
  title: "SPF Passes but Cold Emails Still Go to Spam",
  category: "DNS & Auth",
  readTime: 7,
  excerpt: "SPF passing is the minimum, not the ceiling. Here's why clean SPF doesn't guarantee inbox placement — and what else needs to be checked.",
  body: `
<p>You check the email headers and SPF shows PASS. Your DNS is configured correctly. SPF is working as designed. But your cold emails still land in spam on Gmail, Outlook, or both. You followed the authentication guides and it did not solve the problem.</p>

<h2>Why SPF is necessary but not sufficient</h2>
<p>SPF is one signal among many. Passing SPF tells the receiving mail server that the sending IP is authorized to send on behalf of your domain. It does not say anything about whether the email is wanted, whether the sender has a good reputation, or whether the content is legitimate.</p>
<p>Here is what SPF does not cover:</p>
<ul>
<li><strong>Domain reputation.</strong> A domain with a bad reputation will see spam placement regardless of SPF.</li>
<li><strong>Content-based filtering.</strong> SPF has nothing to do with what is inside your email.</li>
<li><strong>IP reputation.</strong> SPF proves the IP is authorized. It does not prove the IP has a good reputation.</li>
<li><strong>Engagement history.</strong> Gmail tracks how recipients interact with your messages.</li>
<li><strong>DKIM and DMARC alignment.</strong> SPF alone, without DKIM and DMARC, leaves authentication gaps.</li>
</ul>

<h2>Step-by-step diagnosis</h2>

<h3>Step 1: Confirm DKIM also passes</h3>
<p>SPF alone is the minimum. Check headers for <code>dkim=pass</code>. Use the <a href="/tools/dkim">DKIM checker</a> to verify the record exists and the key is valid.</p>

<h3>Step 2: Check DMARC alignment</h3>
<p>Even if SPF passes, DMARC can fail if the SPF domain does not align with the From header domain. Use the <a href="/tools/dmarc">DMARC lookup</a> to verify your record, then send a test email and check that headers show <code>dmarc=pass</code>.</p>

<h3>Step 3: Check domain reputation in Google Postmaster Tools</h3>
<p>If domain reputation is Low or Bad, that is overriding your clean SPF.</p>

<h3>Step 4: Check blacklists</h3>
<p>Run your domain and sending IPs through the <a href="/tools/blacklist">blacklist checker</a>. A blacklist hit overrides clean authentication on many providers.</p>

<h3>Step 5: Test content by sending a plain text email</h3>
<p>Send a plain text email with no links or tracking to a Gmail account. If it lands in inbox, the problem is content-specific. Use the <a href="/test">placement test</a> for the full end-to-end check.</p>

<h2>The fix path</h2>
<p>Add DKIM if you do not already have it. SPF plus DKIM together is significantly stronger than SPF alone.</p>
<p>Add DMARC if you do not already have it. Even <code>p=none</code> provides a trust signal and enables you to receive reports about your sending.</p>
<p>If domain or IP reputation is the issue, reduce volume, improve targeting, and build engagement over 2–4 weeks.</p>
<p>If content is the trigger, simplify. Strip HTML, remove excess links, go plain text with short conversational messages. Use the <a href="/tools/subject-check">subject spam tester</a> and <a href="/tools/link-check">link checker</a> to analyze specific elements.</p>

<h2>Repair or replace?</h2>
<p>SPF-specific issues are always repairable. If SPF passes but emails still go to spam, the problem is not SPF — it is something else identified in the diagnosis flow above.</p>
<p>If the underlying issue turns out to be domain reputation that is deeply damaged, replacement may be faster than repair. <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> can provide inboxes on domains with established, healthy reputations while your original domain recovers.</p>
`
},

{
  slug: "dkim-passes-deliverability-still-bad",
  title: "DKIM Passes but Deliverability Is Bad: What's Actually Wrong?",
  category: "DNS & Auth",
  readTime: 7,
  excerpt: "DKIM passing is necessary but not sufficient. Here's what's actually causing spam placement when DKIM is clean — and how to fix each scenario.",
  body: `
<p>DKIM passes in your email headers. Your messages are signed correctly. But deliverability is still poor. Emails go to spam, open rates are low, and replies are scarce. DKIM was supposed to help and it does not seem to be doing anything.</p>

<h2>What DKIM does and doesn't do</h2>
<p>DKIM cryptographically signs your messages and lets receiving servers verify that the content has not been modified in transit and that the claimed sending domain authorized the message. DKIM passing means the sending server has the private key for your domain and the message was not tampered with in transit. It does not mean the domain has a good reputation, the content is not spam-like, or recipients want the email.</p>

<h2>What else could be causing the problem</h2>
<ul>
<li><strong>DKIM key length may be short.</strong> Google recommends 2048-bit keys. If your key is 1024-bit, upgrading can help. Verify with the <a href="/tools/dkim">DKIM checker</a>.</li>
<li><strong>DKIM alignment may fail.</strong> DMARC requires that the domain in the DKIM signature (the <code>d=</code> value) matches the domain in the From header. If these do not match, DMARC fails even though DKIM itself passes. Check with the <a href="/tools/dmarc">DMARC lookup</a>.</li>
<li><strong>SPF may be failing.</strong> If DKIM passes but SPF fails and DMARC alignment with DKIM also fails, you have an authentication gap.</li>
<li><strong>Domain or IP reputation issues</strong> independent of authentication — these require checking Postmaster Tools and <a href="/tools/blacklist">blacklist status</a>.</li>
<li><strong>Content signals</strong> triggering spam filters regardless of auth status.</li>
</ul>

<h2>Step-by-step diagnosis</h2>

<h3>Step 1: Check DKIM key length</h3>
<p>Use the <a href="/tools/dkim">DKIM checker</a>. If below 1024 bits, upgrade immediately. If 1024, consider upgrading to 2048. Google recommends 2048 for all new setups.</p>

<h3>Step 2: Check DMARC alignment</h3>
<p>Verify that the DKIM <code>d=</code> domain matches your From header domain. If not, DMARC may fail even though DKIM passes individually. Fix DKIM alignment by ensuring the <code>d=</code> domain matches your From header domain.</p>

<h3>Step 3: Check SPF alongside DKIM</h3>
<p>Both should pass. Use the <a href="/tools/spf">SPF checker</a> to verify SPF is configured correctly and passing.</p>

<h3>Step 4: Check domain reputation</h3>
<p>Check Postmaster Tools for domain reputation and spam rate. DKIM passing with bad domain reputation still results in spam placement.</p>

<h3>Step 5: Run the full placement test</h3>
<p>Use the <a href="/test">placement test</a> to get the receiver's perspective on all authentication checks simultaneously. This is more reliable than checking DNS records individually.</p>

<h2>Repair or replace?</h2>
<p>DKIM-specific issues are repairable by updating key length or fixing alignment — these are DNS and configuration changes, not infrastructure problems.</p>
<p>If the underlying issue is domain reputation, the same repair-or-replace calculus applies as with any reputation problem: fix if early, replace if deeply damaged. <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> provides infrastructure with properly configured DKIM on aged, healthy domains for situations where starting fresh is the faster path.</p>
`
},

{
  slug: "dmarc-aligned-emails-still-spam",
  title: "DMARC Aligned but Emails Still Landing in Spam",
  category: "DNS & Auth",
  readTime: 7,
  excerpt: "SPF passes. DKIM passes. DMARC alignment is clean. Emails still land in spam. Once authentication is maxed out, here's what's actually left to fix.",
  body: `
<p>You check email headers and see DMARC: PASS with proper alignment. SPF passes and aligns. DKIM passes and aligns. Your authentication is as clean as it gets. But emails still go to spam. This is deeply confusing because you have done everything the guides say.</p>

<h2>Why clean authentication doesn't guarantee inbox placement</h2>
<p>DMARC alignment is the authentication ceiling. Once SPF, DKIM, and DMARC all pass with alignment, you have maximized what authentication can do for you. Everything beyond this point is about reputation, content, and recipient behavior.</p>
<p>When DMARC alignment is clean and emails still go to spam, the problem is almost always one of these:</p>
<ul>
<li><strong>Domain reputation is Low or Bad.</strong> Authentication protects reputation but does not create it. A domain that has been sending unwanted email has a bad reputation regardless of authentication.</li>
<li><strong>IP reputation is poor.</strong> Your sending IP may be on a shared pool with senders whose behavior has damaged the pool's reputation.</li>
<li><strong>Spam complaint rate is too high.</strong> Even slightly above 0.10% starts to hurt. Above 0.30% is critical.</li>
<li><strong>Content triggers spam filtering independently.</strong> Certain content patterns, link domains, HTML structures, and formatting trigger content-based filters regardless of authentication.</li>
<li><strong>Negative engagement signals.</strong> Gmail tracks whether recipients open, reply, or engage. A history of low engagement teaches Gmail that your messages are not wanted.</li>
</ul>

<h2>Step-by-step diagnosis</h2>

<h3>Step 1: Check Postmaster Tools</h3>
<p>Domain reputation, IP reputation, and spam rate are the most informative metrics when authentication is clean. This is the most important single step at this point.</p>

<h3>Step 2: Check blacklists</h3>
<p>Run your domain and sending IPs through the <a href="/tools/blacklist">blacklist checker</a>. A blocklist hit can override clean authentication.</p>

<h3>Step 3: Test content</h3>
<p>Send a plain text email with no links to a test Gmail account. If it lands in inbox, the problem is content-based. If plain text also goes to spam, it's reputation. Use the <a href="/test">placement test</a> for the full verdict.</p>

<h3>Step 4: Check PTR records</h3>
<p>Google requires valid forward and reverse DNS. Use the <a href="/tools/rdns">rDNS checker</a> to verify PTR records exist for your sending IP.</p>

<h2>The fix path</h2>
<p>Stop troubleshooting authentication — it's already maxed out. Focus on what authentication cannot fix:</p>
<p>If reputation is the issue, reduce volume and focus on engaged recipients to rebuild. Give it 2–4 weeks of disciplined low-volume sending with high engagement.</p>
<p>If complaints are the issue, add one-click unsubscribe headers, improve targeting, and suppress unengaged contacts.</p>
<p>If content is the issue, strip to plain text, remove tracking temporarily, minimize links, and test iteratively using the <a href="/tools/subject-check">subject spam tester</a> and <a href="/tools/link-check">link checker</a>.</p>

<h2>Repair or replace?</h2>
<p>When authentication is clean, the repair-or-replace decision comes down to domain reputation. If Postmaster Tools shows Medium or Low reputation, repair is possible with 2–4 weeks of effort. If it shows Bad and has been Bad for more than 2 weeks, replacement is often faster.</p>
<p><a href="https://warminboxes.com" target="_blank">WarmInboxes</a> provides inboxes on domains with established positive reputations, which is exactly what you need when your own domain's reputation is the bottleneck and authentication is already maxed out.</p>
`
},

{
  slug: "check-dmarc-alignment-cold-email",
  title: "How to Check DMARC Alignment for Cold Email Domains",
  category: "DNS & Auth",
  readTime: 7,
  excerpt: "DMARC can fail even when SPF and DKIM both pass. Alignment is the missing link — here's how to verify it and fix it when it's broken.",
  body: `
<p>You have DMARC set up and it shows some kind of status in email headers, but you want to verify that alignment is actually working the way it needs to for your cold email infrastructure. DMARC alignment is the mechanism that connects your From header domain to either your SPF domain or your DKIM domain — without it, DMARC can fail even if SPF and DKIM pass individually.</p>

<h2>How DMARC alignment works</h2>
<p><strong>SPF alignment:</strong> The domain in the envelope sender (Return-Path or MAIL FROM) must match the domain in the From header. "Match" can mean exact match (strict alignment) or organizational domain match (relaxed alignment, which is the default).</p>
<p><strong>DKIM alignment:</strong> The domain in the DKIM signature's <code>d=</code> tag must match the domain in the From header. Same strict vs relaxed alignment rules apply.</p>
<p>DMARC passes if <em>either</em> SPF alignment or DKIM alignment passes. It does not require both, but having both aligned is ideal for maximum deliverability.</p>

<h2>Step-by-step verification</h2>

<h3>Step 1: Send a test email to Gmail</h3>
<p>Send a test email from your cold email inbox to a personal Gmail account you control. Open the email in Gmail. Click the three dots, then "Show original."</p>

<h3>Step 2: Check Authentication-Results</h3>
<p>Look for the Authentication-Results header. It will show SPF, DKIM, and DMARC results. Good result: <code>spf=pass dkim=pass dmarc=pass</code>. Problem: <code>dmarc=fail</code> despite SPF and DKIM both passing individually — this means alignment is broken.</p>

<h3>Step 3: Check SPF domain alignment</h3>
<p>Check the Return-Path (envelope sender) domain and compare it to your From header domain. If they match at the organizational domain level (same root domain, subdomains count with relaxed alignment), SPF alignment passes.</p>

<h3>Step 4: Check DKIM domain alignment</h3>
<p>Check the DKIM <code>d=</code> value and compare it to your From header domain. Use the <a href="/tools/dkim">DKIM checker</a> to view the selector and <code>d=</code> value from your domain.</p>

<h3>Step 5: Use the DMARC lookup</h3>
<p>Check your DMARC record with the <a href="/tools/dmarc">DMARC lookup</a>. Verify the alignment settings (aspf and adkim) — relaxed (r) is usually correct and allows subdomains to align with the organizational domain.</p>

<h2>Common alignment problems</h2>
<ul>
<li><strong>Your outreach tool sends email using its own envelope sender domain.</strong> The From header shows your domain, but the Return-Path is something like <code>bounce@outreachtool.com</code>. SPF passes for the outreach tool's domain, but alignment with your From domain fails.</li>
<li><strong>Your DKIM signature uses the outreach tool's domain in the <code>d=</code> tag</strong> rather than your domain. DKIM passes for their domain, but alignment with your From domain fails.</li>
<li><strong>Subdomain mismatch with strict alignment.</strong> If using <code>outreach@cold.yourdomain.com</code> in From but SPF and DKIM are set up for <code>yourdomain.com</code> — relaxed alignment handles this, but strict alignment would fail.</li>
</ul>

<h2>The fix path</h2>
<p>Configure your outreach tool to use your domain as the envelope sender. This often involves adding DNS records that let the tool send on behalf of your domain. Configure your outreach tool to sign with your domain's DKIM key. Most tools support custom DKIM signing.</p>
<p>Use relaxed alignment in your DMARC record (<code>aspf=r; adkim=r</code>). This is the default and allows subdomains to align with the organizational domain.</p>
<p>Test after every change by sending to a Gmail account and checking the original message headers.</p>

<h2>Repair or replace?</h2>
<p>Alignment issues are always repairable through DNS and outreach tool configuration. You do not need to replace infrastructure for alignment problems. Fix the configuration and alignment starts passing immediately after DNS propagation.</p>
`
},

{
  slug: "spf-dkim-dmarc-cold-email-recovery-priority",
  title: "SPF vs DKIM vs DMARC: Which to Fix First for Cold Email Recovery",
  category: "DNS & Auth",
  readTime: 7,
  excerpt: "When deliverability is broken and you're trying to fix it, understanding what each authentication protocol does helps you prioritize. Here's the right order.",
  body: `
<p>Your cold email deliverability is damaged and you are trying to figure out which authentication protocol to focus on first. You have heard conflicting advice about which one matters most. Here's the clear priority order for recovery.</p>

<h2>What each protocol does</h2>
<p><strong>SPF:</strong> Defines which IP addresses are authorized to send email for your domain. It's a list you publish in DNS. Prevents unauthorized servers from sending as you. Does not verify the message content or prove the From address is legitimate.</p>
<p><strong>DKIM:</strong> Adds a cryptographic signature to each email that proves the message was authorized by the domain owner and was not altered in transit. Tied to the message itself, not the sending IP — more robust when emails pass through forwarding or relay services.</p>
<p><strong>DMARC:</strong> Ties SPF and DKIM to your visible From address through alignment. Tells receiving servers what to do with messages that fail authentication. Provides reporting so you can see what's happening with your domain's email authentication.</p>

<h2>Priority order for recovery</h2>

<h3>1. DKIM — fix first, highest impact</h3>
<p>DKIM is arguably the most important individual auth check for deliverability. A broken DKIM signature is one of the most common causes of sudden spam placement. Use the <a href="/tools/dkim">DKIM checker</a> — it auto-discovers selectors and shows you exactly what's published and whether it's valid.</p>

<h3>2. SPF — fix second</h3>
<p>A missing or malformed SPF record means your sending server is not authorized. Check with the <a href="/tools/spf">SPF checker</a>. For Google Workspace: <code>v=spf1 include:_spf.google.com ~all</code>. For M365: <code>v=spf1 include:spf.protection.outlook.com -all</code>.</p>

<h3>3. DMARC — fix third</h3>
<p>DMARC is the enforcement and reporting layer. Add at minimum: <code>v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com</code>. Start with <code>p=none</code> — this monitors without filtering. Only tighten policy after confirming all legitimate sending sources pass authentication. Verify with the <a href="/tools/dmarc">DMARC lookup</a>.</p>

<h2>If all three are set up but deliverability is still poor</h2>
<p>Authentication is probably not the bottleneck. Run the <a href="/test">placement test</a> and check alignment — then check the headers to confirm all three are actually passing end-to-end. If all three pass, shift focus to non-authentication factors: reputation, content, and engagement.</p>

<h2>Common mistakes in the wrong order</h2>
<ul>
<li>Setting up DMARC with <code>p=reject</code> before verifying all legitimate sending sources pass authentication — this causes your own emails to be rejected</li>
<li>Setting up only SPF and thinking authentication is done</li>
<li>Focusing on authentication optimization when the real problem is reputation or content</li>
<li>Adding multiple SPF records to the same domain</li>
<li>Using short DKIM keys (512-bit) when 2048-bit is the current standard</li>
</ul>

<h2>Repair or replace?</h2>
<p>Authentication issues are always repairable through DNS configuration. You never need to replace infrastructure just because of authentication problems. Fix the records, verify they pass with the relevant checkers, and move on to diagnosing other issues.</p>
<p>If the underlying domain reputation is damaged, that is a different question. Clean authentication on a damaged domain helps recovery but does not guarantee it. <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> can provide inboxes on domains with both clean authentication and healthy reputation.</p>
`
},

{
  slug: "fix-multiple-spf-records",
  title: "How to Fix Multiple SPF Records on a Cold Email Domain",
  category: "DNS & Auth",
  readTime: 6,
  excerpt: "Multiple SPF records cause a hard SPF failure. Here's how to find duplicates, merge them correctly, and verify the fix.",
  body: `
<p>You check your DNS and discover you have two or more SPF TXT records. You might have noticed this during a deliverability audit or a tool flagged it. Your SPF might be showing as permerror — which means receiving servers cannot evaluate it at all.</p>

<h2>Why multiple SPF records cause a hard failure</h2>
<p>The SPF specification (RFC 7208) requires exactly one SPF record per domain. If more than one exists, receiving servers return a permerror result, which is treated worse than a soft fail — it indicates a configuration error rather than an unauthorized sender. Permerror means SPF authentication simply fails, which can cascade into DMARC failures.</p>

<h2>Why this happens</h2>
<p>Multiple SPF records commonly occur when:</p>
<ul>
<li>You switched email providers and added the new provider's SPF include without removing the old one</li>
<li>You set up a new outreach tool that required its own SPF include and your DNS provider added it as a new record instead of modifying the existing one</li>
<li>A team member added a record without checking for existing ones</li>
<li>Your domain was migrated between registrars or DNS providers and records were duplicated</li>
</ul>

<h2>Step-by-step fix</h2>

<h3>Step 1: Find all SPF records</h3>
<p>Use the <a href="/tools/spf">SPF checker</a> to look up your domain. It will show all TXT records starting with <code>v=spf1</code>. You should have exactly one. If you see two or more, that is the problem.</p>

<h3>Step 2: Merge all includes into a single record</h3>
<p>Take the includes from all your separate records and merge them into one TXT record. For example, if you had:</p>
<p><code>v=spf1 include:_spf.google.com ~all</code><br>and<br><code>v=spf1 include:spf.outreachtool.com ~all</code></p>
<p>Merge them into: <code>v=spf1 include:_spf.google.com include:spf.outreachtool.com ~all</code></p>

<h3>Step 3: Delete all other SPF records</h3>
<p>You must have exactly one <code>v=spf1</code> TXT record. Delete all others after merging.</p>

<h3>Step 4: Count DNS lookups</h3>
<p>After merging, verify the total DNS lookup count. Each <code>include:</code> adds lookups. You cannot exceed 10 total DNS lookups. If you are over 10, remove unnecessary includes or flatten your SPF record.</p>

<h3>Step 5: Verify the fix</h3>
<p>Wait for DNS propagation (up to 48 hours) and then recheck with the <a href="/tools/spf">SPF checker</a>. Send a test email and confirm headers show <code>spf=pass</code>. Run the <a href="/test">placement test</a> to confirm end-to-end authentication.</p>

<h2>Repair or replace?</h2>
<p>This is always repairable. Multiple SPF records are a DNS configuration error. Fix the records and the problem goes away immediately after propagation. No infrastructure replacement needed.</p>

<div class="checklist">
<h4>Mistakes that make this worse</h4>
<ul>
<li>Adding a new SPF record for each new sending service without checking for existing records</li>
<li>Having your outreach tool "auto-configure" SPF without verifying what was added to DNS</li>
<li>Not checking the total number of DNS lookups after merging records</li>
<li>Deleting the wrong SPF record</li>
</ul>
</div>
`
},

{
  slug: "spf-flattening-cold-email",
  title: "Why SPF Flattening Matters for Cold Email Deliverability",
  category: "DNS & Auth",
  readTime: 6,
  excerpt: "Too many DNS lookups in your SPF record causes a hard failure. Here's how SPF flattening works and when you need it.",
  body: `
<p>Your SPF record exists and includes all the right services, but SPF is showing as permerror or temperror in email headers. Or you are getting inconsistent SPF results. When you investigate, you discover your SPF record exceeds the 10 DNS lookup limit.</p>

<h2>Why the 10 DNS lookup limit matters</h2>
<p>The SPF specification limits the number of DNS lookups to 10. Each <code>include:</code> mechanism in your SPF record triggers additional DNS lookups — and those includes can themselves contain includes that add more lookups. Complex sending setups with multiple email providers, outreach tools, and transactional email services can easily exceed 10 lookups.</p>
<p>When the limit is exceeded, receiving servers return a permerror for SPF. This is treated as a fail condition — your emails lose SPF authentication, which can cause DMARC to fail, which can result in spam placement or rejection.</p>

<h2>How to count your DNS lookups</h2>
<p>Each of these SPF mechanisms counts as a DNS lookup: <code>include</code>, <code>a</code>, <code>mx</code>, <code>ptr</code>, <code>redirect</code>, <code>exists</code>. The <code>ip4</code> and <code>ip6</code> mechanisms do not count as lookups because they reference IP addresses directly. Use the <a href="/tools/spf">SPF checker</a> — it counts your total lookup chain and flags if you are over the limit.</p>

<h2>What SPF flattening is</h2>
<p>SPF flattening replaces <code>include:</code> mechanisms with the actual IP addresses they resolve to. Instead of <code>include:_spf.google.com</code> (which requires multiple lookups), you list the specific IP ranges that Google uses for sending. This reduces DNS lookups because <code>ip4</code> entries do not count.</p>

<h2>The fix path</h2>

<h3>Option 1: Flatten using a tool</h3>
<p>Use an SPF flattening tool to resolve all your includes into IP addresses. Replace your current SPF record with the flattened version that lists IP addresses directly. Important: SPF flattening requires ongoing maintenance. Email providers change their IP ranges periodically. If Google adds new IPs and your flattened record does not include them, SPF will fail. Re-flatten regularly or use an automated flattening service.</p>

<h3>Option 2: Reduce the number of includes</h3>
<p>Do you really need every service listed? Remove any includes for services you no longer actively use from your current sending setup.</p>

<h3>Option 3: Use subdomains</h3>
<p>Use multiple subdomains for different sending services, each with their own SPF record. This distributes the lookups across subdomains instead of concentrating them on one record.</p>

<h2>Repair or replace?</h2>
<p>This is always repairable through DNS changes. SPF flattening is a configuration task, not an infrastructure problem. After fixing, verify with the <a href="/tools/spf">SPF checker</a> and confirm authentication passes end-to-end with the <a href="/test">placement test</a>.</p>

<div class="checklist">
<h4>Mistakes that make this worse</h4>
<ul>
<li>Flattening once and never updating</li>
<li>Not monitoring whether email providers have changed their IP ranges</li>
<li>Using the "ptr" mechanism, which is slow, unreliable, and counts as a lookup</li>
<li>Not knowing your lookup count and adding more includes over time until you exceed the limit</li>
</ul>
</div>
`
},

{
  slug: "dkim-signing-issues-cold-email",
  title: "How to Diagnose DKIM Signing Issues in Cold Email Setups",
  category: "DNS & Auth",
  readTime: 7,
  excerpt: "DKIM has two parts: the DNS record (public key) and the signing process (private key). Issues can occur at either end. Here's how to isolate which one is broken.",
  body: `
<p>Your DKIM is not passing in email headers. Or it passes inconsistently. Or it passes for some sending services but not others. You have a DKIM record in DNS but something is wrong with the signing process.</p>

<h2>DKIM's two parts</h2>
<p>DKIM has two parts: the DNS record (public key) and the signing process (private key). Both need to be correct and aligned. Issues can occur at either end — and the two most common problems are a published DNS record with no signing enabled on the server, and a signing configuration that uses a different selector than what's in DNS.</p>

<h2>Common DKIM signing issues</h2>

<h3>1. DNS record published but signing not enabled</h3>
<p>Publishing the public key in DNS is step one. The sending server must be configured to sign outgoing messages with the corresponding private key. In Google Workspace, enable DKIM in the Admin console. In Microsoft 365, enable DKIM signing in the Exchange admin center under the DKIM section — not just the DNS records.</p>

<h3>2. Selector mismatch</h3>
<p>DKIM uses selectors to look up the correct public key. If your DNS record is published at <code>selector1._domainkey.yourdomain.com</code> but your sending server is signing with <code>selector2</code>, the verification fails.</p>

<h3>3. Key rotation without DNS update</h3>
<p>If you regenerate your DKIM keys, the new public key must be published in DNS. Until it is, all signatures made with the new private key fail verification. This is one of the most common causes of sudden DKIM failures.</p>

<h3>4. Outreach tool signing with its own domain</h3>
<p>Some outreach tools sign messages with their own DKIM key by default. The email "passes" DKIM for the tool's domain, but it does not pass DKIM for your domain. This means DMARC alignment fails because the DKIM <code>d=</code> domain does not match your From header domain.</p>

<h2>Step-by-step diagnosis</h2>

<h3>Step 1: Check the DKIM-Signature header</h3>
<p>Send a test email to a Gmail account and check the original headers. Look for the DKIM-Signature header. Note the <code>d=</code> value (signing domain) and the <code>s=</code> value (selector). If there is no DKIM-Signature header at all, your sending server is not signing.</p>

<h3>Step 2: Verify the DNS record exists for that selector</h3>
<p>Use the <a href="/tools/dkim">DKIM checker</a> — enter your domain and leave the selector blank for auto-discovery. It will check all common selectors including google, selector1, selector2, and others. If the key is found, verify it's valid and 2048-bit.</p>

<h3>Step 3: Check the d= value against your From header domain</h3>
<p>If the <code>d=</code> value doesn't match your From header domain, you have an alignment issue that will cause DMARC to fail even though DKIM passes for the tool's domain.</p>

<h2>The fix path</h2>
<p>If signing is not enabled, enable it in your email provider's admin console.</p>
<p>If the key was rotated, publish the new public key in DNS at the correct selector.</p>
<p>If your outreach tool signs with its own domain, configure it to sign with your domain instead. This usually requires adding DKIM DNS records that the tool provides and enabling custom DKIM in the tool's settings.</p>
<p>After fixing, verify with the <a href="/test">placement test</a> — don't assume DNS changes took effect immediately.</p>

<h2>Repair or replace?</h2>
<p>DKIM issues are always repairable through DNS and sending server configuration. No infrastructure replacement needed.</p>
`
},

{
  slug: "auth-passed-inbox-placement-low",
  title: "Authentication Passed but Inbox Placement Is Still Low",
  category: "DNS & Auth",
  readTime: 8,
  excerpt: "Clean authentication is the floor, not the ceiling. Here's the full framework for what to fix when auth is perfect but placement is still poor.",
  body: `
<p>SPF passes. DKIM passes. DMARC passes with alignment. You have done everything right from an authentication standpoint. But inbox placement tests show 50–70% inbox rate. Messages are going to spam or junk on a significant percentage of test accounts. The problem is clearly not authentication. So what is it?</p>

<h2>What drives inbox placement beyond authentication</h2>
<p>Authentication is the foundation, not the building. Once authentication is solid, deliverability depends entirely on reputation, behavior, content, and engagement.</p>
<ul>
<li><strong>Domain reputation:</strong> Built over time from engagement, complaints, and sending patterns. A new domain with clean authentication has no reputation. A damaged domain with clean authentication has bad reputation. Neither gets good placement automatically.</li>
<li><strong>IP reputation:</strong> Especially important for Outlook. Shared IPs with bad reputations hurt everyone on them regardless of individual authentication.</li>
<li><strong>Complaint rate:</strong> The single most damaging metric. Every spam complaint directly tells the mail provider that your email is unwanted. Google's threshold is 0.3%, with a target below 0.10%.</li>
<li><strong>Engagement metrics:</strong> Opens, replies, and other positive interactions signal to Gmail that your messages are valued. Low engagement over time trains the filter to deprioritize you.</li>
<li><strong>Content quality:</strong> Spam-like content patterns, suspicious links, certain HTML structures trigger content-based filters.</li>
<li><strong>Sending patterns:</strong> Sudden volume spikes, inconsistent sending schedules, and high-volume sends to cold lists all raise red flags.</li>
</ul>

<h2>Step-by-step diagnosis</h2>

<h3>Step 1: Check Postmaster Tools</h3>
<p>Domain reputation is the single most informative data point when authentication is clean. Check Google Postmaster Tools for current domain reputation and spam rate.</p>

<h3>Step 2: Check blacklists</h3>
<p>Run the <a href="/tools/blacklist">blacklist checker</a> on your domain and sending IPs. A blocklist hit can override clean authentication.</p>

<h3>Step 3: Send a bare-bones plain text email</h3>
<p>Zero links, zero tracking, zero HTML. Use the <a href="/test">placement test</a> with the simplest possible content. If it lands in inbox, the issue is content-related. If it still goes to spam, the issue is reputation-related.</p>

<h3>Step 4: Review sending volume and patterns</h3>
<p>Look for spikes, inconsistencies, or periods of very high volume over the last 30 days. Use the <a href="/tools/send-limits">sending limit planner</a> to verify you're within safe limits.</p>

<h3>Step 5: Review list quality</h3>
<p>What is your bounce rate? If above 2%, list quality is a factor. Run the <a href="/tools/burn-score">burn score calculator</a> on affected domains to get an overall health picture.</p>

<h2>The fix path</h2>
<p>If domain reputation is the issue, enter recovery mode. Reduce volume dramatically. Send only to your most engaged contacts. Generate positive engagement signals. Hold this pattern for 2–4 weeks while monitoring Postmaster Tools for reputation improvement.</p>
<p>If complaints are the issue, add one-click unsubscribe headers, suppress unengaged recipients, and refine targeting.</p>
<p>If content is the issue, simplify to plain text with minimal links. Test iteratively using the <a href="/tools/subject-check">subject spam tester</a> and <a href="/tools/link-check">link checker</a>.</p>

<h2>Repair or replace?</h2>
<p>The answer depends on the severity and duration of the reputation damage. If Postmaster Tools shows domain reputation declining but still Medium, 2–3 weeks of disciplined behavior can recover it.</p>
<p>If domain reputation is Bad and has been for more than 2 weeks, routing campaigns through prewarmed inboxes from <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> while the damaged domain recovers lets you maintain campaign performance without waiting for a recovery that might take a month or more.</p>
`
},

{
  slug: "audit-spf-dkim-dmarc-burned-domain",
  title: "How to Audit SPF DKIM DMARC on a Burned Email Domain",
  category: "DNS & Auth",
  readTime: 8,
  excerpt: "Before deciding whether to recover or replace a burned domain, audit its authentication status. This determines whether configuration issues contributed to the burn.",
  body: `
<p>You have a domain that was previously used for cold email and developed a bad reputation. Before you decide whether to try to recover it or replace it, you need to audit its current authentication status to understand whether configuration issues are contributing to the problem or whether it is purely a reputation issue.</p>

<h2>Why the audit matters before any decision</h2>
<p>When a domain is burned, it is tempting to assume everything is broken. But sometimes a burned domain has clean authentication and the problem is entirely reputation-based. Other times, authentication was misconfigured from the start and contributed to the burn. Knowing which situation you are in determines your recovery strategy — and whether recovery is even worth attempting.</p>

<h2>SPF audit</h2>
<p>Use the <a href="/tools/spf">SPF checker</a> to run through this checklist:</p>
<div class="checklist">
<h4>SPF audit checklist</h4>
<ul>
<li>Exactly one SPF record exists starting with <code>v=spf1</code> — no duplicates</li>
<li>Record includes all current sending services (and only current services — remove old providers)</li>
<li>Total DNS lookups are at or below 10</li>
<li>No deprecated mechanisms like "ptr"</li>
<li>Missing includes for current sending services</li>
</ul>
</div>

<h2>DKIM audit</h2>
<p>Use the <a href="/tools/dkim">DKIM checker</a> with auto-discovery enabled:</p>
<div class="checklist">
<h4>DKIM audit checklist</h4>
<ul>
<li>DKIM record exists for your ESP's selector</li>
<li>DKIM key is at least 1024 bits (2048 recommended)</li>
<li>DKIM signing is actually enabled on your sending server — not just the DNS record</li>
<li>Test email confirms <code>dkim=pass</code> in headers</li>
<li>The <code>d=</code> value in the DKIM-Signature matches your From header domain</li>
</ul>
</div>

<h2>DMARC audit</h2>
<p>Use the <a href="/tools/dmarc">DMARC lookup</a>:</p>
<div class="checklist">
<h4>DMARC audit checklist</h4>
<ul>
<li>DMARC record exists at _dmarc.yourdomain.com</li>
<li>rua tag is set to a monitored email address</li>
<li>Policy (p=) is appropriate for the domain's current situation</li>
<li>Alignment settings (aspf, adkim) are correct — relaxed is usually right</li>
</ul>
</div>

<h2>Cross-check: send a test email</h2>
<p>Send a test email from each sending service you use and check headers for SPF PASS, DKIM PASS, and DMARC PASS using the <a href="/test">placement test</a>. Every sending source must pass all three. This is the only way to confirm end-to-end auth — DNS records that look right can still produce failing results if the sending server is misconfigured.</p>

<h2>What the audit tells you</h2>
<p>If authentication is broken, fix it first. Without clean authentication, no reputation recovery effort will work.</p>
<p>If authentication is already clean and the domain is burned purely due to reputation, the decision is whether to invest 4–8 weeks in reputation recovery or replace the domain with clean infrastructure.</p>

<h2>Repair or replace?</h2>
<p>For time-sensitive campaigns, <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> provides domains that are already audited, authenticated, and warmed, eliminating both the audit and the recovery process. Use the <a href="/tools/repair-or-replace">repair-or-replace calculator</a> to make the final call based on your specific situation.</p>
`
},

{
  slug: "test-cold-emails-spam-before-campaign-tanks",
  title: "How to Test If Cold Emails Are Landing in Spam Before a Campaign Tanks",
  category: "Spam & Placement",
  readTime: 8,
  excerpt: "Once a campaign burns your best leads in spam, the damage is done. Here's how to test inbox placement before going live — and what to do with the results.",
  body: `
<p>You are about to launch a cold email campaign, or you have just launched one and want to verify that emails are actually reaching inboxes. Open rates are not reliable indicators of inbox placement — the only way to know for certain is to test with seed accounts and check placement directly.</p>

<h2>Why you must test before sending at scale</h2>
<p>Once you send a campaign to a cold list and those emails go to spam, the damage is done. You do not just lose those leads — the spam placement generates negative engagement signals and potentially spam complaints that further damage your domain reputation. Testing before sending at scale is the cheapest insurance you can buy.</p>

<h2>How to set up seed accounts</h2>
<p>Create test accounts across every major provider your audience uses:</p>
<ul>
<li>2–3 personal Gmail accounts</li>
<li>1–2 Google Workspace accounts if your targets are on GWS</li>
<li>2–3 Outlook.com personal accounts</li>
<li>1–2 Microsoft 365 business accounts if possible</li>
<li>1–2 Yahoo accounts</li>
</ul>
<p>Do not add these seed addresses to your contacts and do not set up any rules. They should represent a default, unknown recipient experience.</p>

<h2>How to run the test correctly</h2>

<h3>Step 1: Use the placement test tool</h3>
<p>The <a href="/test">inbox placement test</a> sends through your actual sending infrastructure and checks where it lands. The result shows authentication results from the receiver's perspective — which is more reliable than manual seed testing for confirming end-to-end auth. Run this first.</p>

<h3>Step 2: Send realistic campaign content</h3>
<p>Use your actual subject line, body content, links, tracking, and signature. Do not send a generic test message — it will not trigger the same filters as your real campaign. Send from each inbox you plan to use.</p>

<h3>Step 3: Check each seed account</h3>
<p>For Gmail: check Primary, Promotions, Social, Updates, and Spam. For Outlook: check Focused, Other, and Junk. For Yahoo: check Inbox and Spam. Record results in a spreadsheet by sending inbox and receiving provider.</p>

<h3>Step 4: Calculate your inbox placement rate</h3>
<p>Count emails that landed in the primary inbox (not tabs, not spam) divided by total sent. Target 80% or better before launching production campaigns. Run at least 3 rounds of tests over a week.</p>

<h2>Reading the results</h2>
<p><strong>All providers show spam:</strong> Domain or IP reputation issue. Check Postmaster Tools and the <a href="/tools/blacklist">blacklist checker</a>.</p>
<p><strong>Only Gmail shows spam:</strong> Gmail-specific reputation or content filtering. Check Postmaster Tools for domain reputation data.</p>
<p><strong>Only Outlook shows Junk:</strong> Microsoft-specific reputation or IP issue. Check SNDS.</p>
<p><strong>Emails in Promotions on Gmail:</strong> Content formatting issue. Simplify to plain text.</p>
<p><strong>Some inboxes place well, others don't:</strong> Inbox-specific issue. Check warmup status with the <a href="/tools/warmup-ready">warmup readiness checker</a>.</p>

<h2>Repair or replace?</h2>
<p>Testing catches problems before they become expensive. Most issues found during testing are fixable because you caught them before they caused reputation damage from real campaign sends.</p>
<p>If testing reveals that specific inboxes are consistently performing poorly despite proper setup and warmup, those inboxes may need replacement. Having a set of tested, prewarmed backup inboxes from <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> means you can swap out underperformers immediately and keep your launch timeline intact.</p>
`
},

{
  slug: "inbox-placement-testing-cold-email-agencies",
  title: "Best Inbox Placement Tests for Cold Email Agencies",
  category: "Agency",
  readTime: 8,
  excerpt: "Agencies managing multiple clients need a scalable approach to placement testing. Here's the framework that catches problems before they become client emergencies.",
  body: `
<p>You are an agency managing cold email for multiple clients. You need a scalable way to test inbox placement across clients, domains, and inboxes without spending hours manually checking seed accounts.</p>

<h2>Why placement testing matters more for agencies</h2>
<p>Agencies have more at stake than individual senders. A deliverability failure affects client relationships, revenue, and reputation. When you manage 10 or 20 or 50 clients, you cannot manually test every inbox before every campaign. You need a systematic approach. And your clients cannot see the problem coming the same way you can — by the time a client notices replies have stopped, you have already been in spam for days or weeks.</p>

<h2>What good placement testing coverage looks like</h2>
<p>Every placement test must cover Gmail, Outlook/M365, and Yahoo at minimum. Many B2B targets are on M365, so Outlook testing is non-negotiable. Test from the specific sending inbox, not just from the domain in aggregate — different inboxes can perform differently even on the same domain.</p>

<h2>The agency testing cadence</h2>

<h3>Before onboarding any client</h3>
<p>Test all client inboxes with the <a href="/test">placement test</a> before launching any campaigns. Establish a baseline inbox placement rate for each inbox and each provider. If a client's existing inboxes are already damaged, you need to know before campaigns start — not after.</p>

<h3>Before each campaign launch</h3>
<p>Run a placement test with the actual campaign content 24–48 hours before launch. Use the content and tracking setup that will actually be used in production. This catches content-based triggers specific to that campaign.</p>

<h3>Weekly during active campaigns</h3>
<p>Run placement tests on all active inboxes weekly. Compare to baseline. Flag any inbox that drops below 80%. Use the <a href="/tools/burn-score">burn score calculator</a> to track overall domain health alongside placement tests.</p>

<h3>After any infrastructure changes</h3>
<p>If you change outreach tools, add new inboxes, update DNS records, change tracking domains, or modify email templates, test immediately after the change. Use the <a href="/tools/launch-checklist">launch checklist</a> after any significant change.</p>

<h2>How to set clear thresholds for action</h2>
<ul>
<li>Below 80% placement on any domain: investigate within 48 hours</li>
<li>Below 70% placement: pause campaigns on affected inboxes pending diagnosis</li>
<li>Below 50% placement: immediate replacement from backup infrastructure</li>
<li>Any spam result during weekly testing on a previously-healthy domain: triage within 24 hours</li>
</ul>

<h2>The agency playbook when placement drops</h2>
<p>Test, identify underperformers, swap in prewarmed replacements from <a href="https://warminboxes.com" target="_blank">WarmInboxes</a>, investigate root cause on the underperformers in the background, and return repaired inboxes to rotation once they test clean.</p>
<p>This approach minimizes client impact and maintains campaign continuity while still addressing the underlying issues. The key operational advantage: it gives you lead time. Instead of discovering a deliverability problem when a client asks why replies stopped, you discover it in a weekly test and have time to act before the client ever notices.</p>
`
},

{
  slug: "low-reply-rates-deliverability-or-copy",
  title: "How to Tell Whether Low Reply Rates Are a Deliverability Issue",
  category: "Spam & Placement",
  readTime: 7,
  excerpt: "Reply rates dropped. Before you rewrite the copy, run this diagnosis. Most reply rate collapses aren't copy problems — they're deliverability problems.",
  body: `
<p>Reply rates have dropped on your cold email campaigns. They were at 3–5% and now they are below 1%. You are not sure if the problem is your email copy, your targeting, or whether your emails are not reaching the inbox at all.</p>

<h2>Why this diagnosis is hard</h2>
<p>Low reply rates have multiple possible causes, and they often overlap. Bad copy, bad targeting, and bad deliverability can all produce the same symptom: nobody responds. The danger is spending weeks rewriting copy and adjusting targeting when the emails are going to spam and nobody is even seeing them.</p>

<h2>Step-by-step diagnosis</h2>

<h3>Step 1: Run a placement test immediately</h3>
<p>This is the single most important step. Use the <a href="/test">inbox placement test</a> — send your actual campaign content from your actual inboxes. If placement is below 80%, deliverability is almost certainly contributing to low reply rates. Do this before changing anything else.</p>

<h3>Step 2: Check open rates alongside reply rates</h3>
<p>If open rates have dropped proportionally to reply rates, emails are likely going to spam. If open rates are stable but reply rates dropped, it might actually be a copy or targeting issue rather than deliverability.</p>

<h3>Step 3: Compare reply rates across different inboxes</h3>
<p>If some inboxes still get replies while others do not, the problem is inbox-specific deliverability rather than copy or targeting. Use the <a href="/tools/burn-score">burn score calculator</a> on each domain to identify which ones are degraded.</p>

<h3>Step 4: Compare reply rates across different providers</h3>
<p>If your Gmail contacts still reply but Outlook contacts do not, you have an Outlook-specific deliverability issue. If the drop is uniform across all providers, it's more likely domain reputation or content.</p>

<h3>Step 5: Check bounce rate</h3>
<p>If bounces have increased, list quality has degraded — which both hurts deliverability and means you are reaching fewer valid recipients. Run the <a href="/tools/blacklist">blacklist checker</a> on affected domains.</p>

<h2>The decision framework</h2>
<p><strong>Reply rates dropped and inbox placement is below 80%:</strong> Deliverability issue. Fix deliverability first before changing copy. Everything else is noise until emails are actually reaching the inbox.</p>
<p><strong>Reply rates dropped and inbox placement is above 80% but open rates dropped:</strong> Possible subject line issue or Promotions tab placement. Test subject lines and check tab placement.</p>
<p><strong>Reply rates dropped but open rates are stable and inbox placement is healthy:</strong> Content or targeting issue. Adjust copy and targeting. The deliverability infrastructure is fine.</p>
<p><strong>Reply rates dropped on some inboxes but not others:</strong> Inbox-specific deliverability issue. The affected inboxes need attention.</p>

<h2>Repair or replace?</h2>
<p>If deliverability is the cause, apply the standard repair approach: reduce volume, improve engagement signals, fix any authentication or content issues, and monitor.</p>
<p>If specific inboxes have degraded deliverability that is not recovering, replace them with prewarmed inboxes from <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> while the originals recover. Do not let deliverability diagnosis take so long that you lose the campaign window entirely.</p>
`
},

{
  slug: "inbox-placement-vs-deliverability-difference",
  title: "Inbox Placement vs Deliverability: What's the Difference in Cold Email?",
  category: "Spam & Placement",
  readTime: 6,
  excerpt: "These two terms are used interchangeably but they measure different things. Getting them confused leads to optimizing the wrong metric.",
  body: `
<p>You see the terms "deliverability" and "inbox placement" used interchangeably in guides and tools, but they measure different things. Optimizing for the wrong metric leads to wrong conclusions.</p>

<h2>The fundamental distinction</h2>

<h3>Deliverability: was the email accepted?</h3>
<p>Deliverability is whether the receiving server accepts your email at all. If you send 100 emails and 97 are accepted by the receiving servers (3 bounce), your deliverability rate is 97%. Deliverability means the email was not rejected outright — it does not mean it reached the inbox.</p>

<h3>Inbox placement: where did it land?</h3>
<p>Inbox placement is where the accepted email ends up. Of those 97 delivered emails, how many landed in the Primary inbox, how many went to Promotions or Other, and how many went to Spam or Junk? If 70 landed in inbox and 27 went to spam, your inbox placement rate is about 72%.</p>

<h2>Why this matters for cold email</h2>
<p>You can have 97% deliverability and 72% inbox placement at the same time. The deliverability number looks great. The inbox placement number is a problem. And most outreach tools only report deliverability — not inbox placement. When your tool says "97% delivered," that could mean 97% in inbox or 70% in inbox and 27% in spam. The number looks identical in both cases.</p>
<p>This is why reply rates and open rates are lagging indicators of deliverability problems. By the time replies drop, you have potentially been sending to spam for days or weeks. The emails were "delivered" (accepted by the server) the entire time.</p>

<h2>How to measure each</h2>
<p><strong>Deliverability:</strong> Your outreach tool or email provider reports this. Bounced messages are the inverse of deliverability. Target less than 2% bounce rate.</p>
<p><strong>Inbox placement:</strong> Only measurable through seed testing. Use the <a href="/test">inbox placement test</a> to send through your actual infrastructure and check where emails land. Target 80% or better in primary inbox.</p>

<h2>How to optimize each</h2>
<p><strong>Deliverability (reducing bounces):</strong> Clean your email lists before sending. Verify addresses. Remove role accounts and catch-all risks. Target hard bounces near zero.</p>
<p><strong>Inbox placement (landing in inbox, not spam):</strong> Authentication, domain reputation, IP reputation, content quality, engagement history, complaint rate, sending patterns. Check each of these with the <a href="/tools/burn-score">burn score calculator</a> for a comprehensive health assessment.</p>

<div class="checklist">
<h4>Mistakes that make this worse</h4>
<ul>
<li>Celebrating "97% deliverability" without checking inbox placement</li>
<li>Assuming low bounce rates mean emails are reaching the inbox</li>
<li>Not running placement tests and relying solely on tool-reported delivery metrics</li>
<li>Confusing tab placement (Promotions) with spam placement</li>
<li>Treating deliverability and inbox placement as the same metric in reporting to clients</li>
</ul>
</div>
`
},

{
  slug: "inbox-placement-drops-bounce-rates-normal",
  title: "Why Inbox Placement Drops Even When Bounce Rates Look Normal",
  category: "Spam & Placement",
  readTime: 7,
  excerpt: "Bounce rates look fine. But placement tests show spam placement. Here's why bounce rates are a lagging indicator — and what to monitor instead.",
  body: `
<p>Your bounce rate is under 2%. List quality seems fine. But inbox placement tests reveal declining performance. Emails are going to spam at higher rates than before. Your outreach tool shows everything as "delivered" but the emails are not reaching the inbox.</p>

<h2>Why bounce rates and inbox placement are driven by different factors</h2>
<p>Bounces occur when the receiving server rejects the email outright — usually because the address does not exist, the mailbox is full, or the server blocks the sending IP. Inbox placement is determined after the email is accepted, based on reputation, content, and engagement signals.</p>
<p>You can have zero bounces and 50% spam placement. The emails are all accepted by the server (no bounces) but then routed to spam by the receiving server's internal filtering. This is the core problem with using bounce rates as your primary health metric.</p>

<h2>Common causes of declining placement with normal bounce rates</h2>
<ul>
<li><strong>Domain reputation declining</strong> due to low engagement or rising complaints. Gmail and Outlook are sending your emails to spam, which means fewer opens and replies, which further damages reputation. No bounces involved.</li>
<li><strong>IP reputation declining</strong> due to behavior by other senders on a shared IP. Your emails are accepted but filtered to spam.</li>
<li><strong>Content pattern changes.</strong> You updated your email template, added new links, changed formatting, or introduced tracking that triggers content-based filtering.</li>
<li><strong>Complaint rate creeping up.</strong> Recipients are marking your emails as spam more frequently. This directly impacts placement without affecting bounce rates at all.</li>
<li><strong>Sending volume increased</strong> without corresponding engagement increase.</li>
</ul>

<h2>Step-by-step diagnosis</h2>

<h3>Step 1: Run placement tests</h3>
<p>Quantify the problem with the <a href="/test">inbox placement test</a>. What percentage of test emails land in inbox vs spam? This is the definitive measurement that bounce rates simply cannot provide.</p>

<h3>Step 2: Check Postmaster Tools</h3>
<p>Domain reputation and spam rate are the two most informative metrics here. Look for changes over the last 30 days.</p>

<h3>Step 3: Check blacklists</h3>
<p>Run the <a href="/tools/blacklist">blacklist checker</a> on both domain and sending IP. A blacklist hit can cause spam placement without any bounce increase.</p>

<h3>Step 4: Review sending patterns</h3>
<p>Did volume change? Did content change? Did you switch tracking domains? Check your tracking domain with the <a href="/tools/tracking-domain">tracking domain checker</a>.</p>

<h3>Step 5: Check complaints</h3>
<p>Even a small increase in complaint rate can cause significant placement drops. Check Postmaster Tools spam rate data.</p>

<h2>Repair or replace?</h2>
<p>If caught within 1–2 weeks, reducing volume and addressing the root cause usually recovers placement within 2–3 weeks. </p>
<p>If the decline has been happening unnoticed for weeks because you were only monitoring bounce rates, the damage may be deeper. <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> can provide clean inboxes to maintain campaign continuity while you diagnose and repair the issue on your original infrastructure. The key fix going forward: add weekly placement tests as your primary health monitoring, not bounce rates.</p>
`
},

{
  slug: "how-often-run-inbox-placement-tests",
  title: "How Often Should You Run Inbox Placement Tests on Cold Email Domains?",
  category: "Spam & Placement",
  readTime: 6,
  excerpt: "Weekly? Monthly? Before every campaign? Here's the right cadence for placement testing at different scales.",
  body: `
<p>You know you should test inbox placement but you are not sure how often. Testing takes time and seed accounts. You want to test enough to catch problems early without over-testing.</p>

<h2>Recommended testing cadence</h2>

<h3>Before every new campaign launch (non-negotiable)</h3>
<p>Test with actual campaign content 24–48 hours before sending to production lists. This catches content-specific triggers and confirms all inboxes are healthy before you burn real leads. Use the <a href="/test">placement test</a> — it tests through your actual sending infrastructure.</p>

<h3>Weekly during active campaigns</h3>
<p>While campaigns are running, test once per week to monitor for degradation. Deliverability can change without warning due to IP reputation shifts, blocklist additions, or complaint spikes. A weekly placement test is what separates agencies that manage proactively from those that react to crises.</p>

<h3>After any infrastructure changes</h3>
<p>If you change outreach tools, add new inboxes, update DNS records, change tracking domains, or modify email templates — test immediately after the change. Use the <a href="/tools/launch-checklist">launch checklist</a> after any significant infrastructure change.</p>

<h3>Daily during recovery</h3>
<p>If you experienced spam placement, a blocklist listing, or a reputation drop, test daily during recovery until placement stabilizes above 80% for at least 3 consecutive days.</p>

<h3>Monthly during inactive periods</h3>
<p>If inboxes are not running campaigns but are on warmup, test monthly to confirm warmup is maintaining inbox placement. An inbox that doesn't get tested for 2 months might have drifted into spam without you noticing.</p>

<h2>How to test efficiently</h2>
<p>Create a standard testing protocol that defines: seed accounts for each provider, testing procedure, results recording format, and action thresholds. Document this so it can be delegated and done consistently.</p>
<p>Set clear thresholds: below 80% inbox placement triggers investigation. Below 70% triggers campaign pause. Below 50% triggers inbox replacement. Having pre-defined thresholds means no judgment call is required when tests show a problem.</p>

<h2>At agency scale: when to automate</h2>
<p>Manual testing is fine for a few clients. It does not scale beyond 10. Use placement testing tools that can run scheduled tests across all your active domains. The value of testing is catching problems early — that only works if testing actually happens consistently at scale.</p>

<blockquote><p>The agencies that never lose client campaigns to surprise deliverability failures are the ones running weekly placement tests on all active domains and maintaining backup infrastructure from <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> ready to deploy when tests show problems. The testing gives you the signal. The backup infrastructure gives you the response.</p></blockquote>
`
},

{
  slug: "promotions-tab-placement-what-now",
  title: "Cold Email Inbox Placement Test Shows Promotions: What Now?",
  category: "Spam & Placement",
  readTime: 6,
  excerpt: "Promotions placement is not spam — but it's not good either. Here's what causes it and the exact changes that bring emails back to Primary.",
  body: `
<p>Your inbox placement tests show that emails are landing in Gmail's Promotions tab rather than Primary. They are not going to spam, but Promotions placement significantly reduces visibility and engagement. Most people do not check Promotions regularly, so your outreach is not getting seen.</p>

<h2>Why Promotions placement happens</h2>
<p>Gmail classifies emails into tabs using machine learning that analyzes content patterns, sender behavior, and message formatting. Cold emails that look like marketing material get classified as Promotions. This is separate from spam filtering — your domain reputation can be perfect and your emails can still land in Promotions because the content pattern matches what Gmail considers promotional material.</p>
<p>Key Promotions triggers: HTML formatting with styled templates, multiple links, images, logos, tracking pixels, and marketing-style unsubscribe footers.</p>

<h2>Step-by-step diagnosis</h2>

<h3>Step 1: Confirm it's actually Promotions and not spam</h3>
<p>Run the <a href="/test">placement test</a> to get the definitive verdict. Promotions and spam have completely different causes and different fixes. Confirm exactly which you're dealing with before changing anything.</p>

<h3>Step 2: Strip the email to plain text</h3>
<p>Remove all HTML formatting, images, logos, and styled signatures. Send a plain text test and check tab placement again. If it moves to Primary, the format is the trigger.</p>

<h3>Step 3: Add elements back one at a time</h3>
<p>Add your signature. Test. Add one link. Test. Enable tracking. Test. Identify which specific element triggers Promotions classification. Use the <a href="/tools/link-check">link checker</a> and <a href="/tools/tracking-domain">tracking domain checker</a> to assess your tracking setup's contribution.</p>

<h2>The fix path</h2>
<p>Plain text or near-plain text. One link maximum. Simple signature: name, title, company, phone. No logos, no banners, no social media icons. Send from a personal-sounding address: firstname@domain.com rather than team@domain.com.</p>
<p>Personalize beyond tokens. Reference something specific to the recipient. Gmail's classifier picks up on template patterns — highly templated messages are more likely to be classified as promotional even without HTML.</p>
<p>If you need open tracking, use a custom tracking domain rather than your outreach tool's shared tracking domain. Check your current tracking setup with the <a href="/tools/tracking-domain">tracking domain checker</a>.</p>

<h2>Repair or replace?</h2>
<p>Promotions placement is a content issue, not an inbox issue. You do not need to replace inboxes. Change your email content and formatting, and retest. Promotions tab placement can shift within a few sends once you change the content signals — this is one of the fastest-moving deliverability problems to fix once you identify the trigger.</p>
`
},

{
  slug: "inbox-placement-suddenly-collapses",
  title: "What to Do When Your Inbox Placement Test Results Suddenly Collapse",
  category: "Emergency",
  readTime: 8,
  excerpt: "Placement was at 85%. Now it's at 40%. Nothing obvious changed. Here's the systematic approach to finding the cause fast.",
  body: `
<p>Your inbox placement was healthy. Tests showed 80–90% inbox placement consistently. Then suddenly, test results drop to 40% or lower. Most test emails are landing in spam. Nothing obvious changed on your end.</p>

<h2>Common causes of sudden placement collapse</h2>
<ul>
<li><strong>Domain or IP was added to a blocklist.</strong> Blocklist additions can happen without any change in your behavior if another sender on your shared IP does something bad.</li>
<li><strong>Spam complaint rate spiked.</strong> A campaign sent to a bad segment can generate enough complaints to trigger an immediate reputation drop.</li>
<li><strong>Provider algorithm update.</strong> Google or Microsoft updates their filtering. A change that reclassifies borderline senders can cause sudden drops.</li>
<li><strong>Outreach tool changed sending infrastructure.</strong> Some tools rotate IPs or change routing without notifying users. A new IP with no reputation or bad reputation can tank placement overnight.</li>
<li><strong>DNS records were accidentally changed.</strong> Someone modified SPF, DKIM, or DMARC records without informing you.</li>
<li><strong>Volume spike triggered enhanced filtering.</strong> A campaign that sent more than normal from a domain triggered rate limiting or filtering escalation.</li>
</ul>

<h2>Step-by-step emergency diagnosis</h2>

<h3>Step 1: Check authentication immediately</h3>
<p>Send a test email and verify <code>spf=pass</code>, <code>dkim=pass</code>, and <code>dmarc=pass</code> in headers. Check DNS records for accidental changes using the <a href="/tools/spf">SPF checker</a>, <a href="/tools/dkim">DKIM checker</a>, and <a href="/tools/dmarc">DMARC lookup</a>. If any fail, this is your answer and it's fixable fast.</p>

<h3>Step 2: Check blacklists</h3>
<p>Run your domain and sending IPs through the <a href="/tools/blacklist">blacklist checker</a> immediately. A new blacklist entry is often the cause of sudden placement collapse.</p>

<h3>Step 3: Check Postmaster Tools</h3>
<p>Look for sudden changes in domain reputation or spam rate around the time of the collapse.</p>

<h3>Step 4: Check tracking domain</h3>
<p>Use the <a href="/tools/tracking-domain">tracking domain checker</a> to verify your tracking setup hasn't changed or broken. A broken tracking domain can cause sudden spam placement.</p>

<h3>Step 5: Contact your outreach tool</h3>
<p>Ask if they changed any sending infrastructure, IP pools, or routing recently. This is a common cause that's completely invisible on your end.</p>

<h2>The fix path</h2>
<p><strong>Blocklist:</strong> Submit delist requests. Reduce sending volume until delisted. Identify and fix what caused the listing.</p>
<p><strong>DNS changes:</strong> Revert to correct records. Verify all authentication passes with the relevant checkers.</p>
<p><strong>Spam rate spike:</strong> Stop cold outreach. Run warmup only. Wait for complaint data to clear.</p>
<p><strong>Tool infrastructure change:</strong> Contact the tool provider. Request stable IPs or dedicated IPs if available.</p>
<p>In all cases, pause production campaigns until placement tests return to 80%+.</p>

<h2>Repair or replace?</h2>
<p>If the cause is identified and fixable (blocklist, DNS error, tool infrastructure change), repair by addressing the specific cause. Recovery can happen within days for DNS fixes or 1–2 weeks for reputation recovery.</p>
<p>If the cause is unclear or recovery is slow, shift campaigns to backup infrastructure immediately. <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> provides prewarmed inboxes ready for immediate deployment. Having backup inboxes ready before a crisis is better than scrambling to find them during one.</p>
`
},

{
  slug: "seed-tests-managing-cold-email-clients",
  title: "Why Seed Tests Matter When Managing Cold Email for Clients",
  category: "Agency",
  readTime: 7,
  excerpt: "Open rates are not a reliable deliverability indicator. For agencies, seed testing is the difference between managing proactively and reacting to client crises.",
  body: `
<p>You are an agency managing cold email for clients. You are either not doing seed tests at all — relying on open rates and reply rates as indicators — or you are doing them inconsistently. You have had deliverability issues surprise you and your clients.</p>

<h2>Why open rates are not enough</h2>
<p>Google's documentation states they do not track open rates and cannot verify third-party open rate accuracy. Open rates are not a reliable proxy for inbox placement. The only way to know where emails are actually landing is to test with accounts you control.</p>
<p>Seed testing is the difference between managing deliverability proactively and reacting to problems after damage is done. For agencies, deliverability failures cost more than just leads — they cost client trust, retention, and revenue. When a client's campaign tanks because emails went to spam, saying "we did not know" is not an acceptable answer.</p>

<h2>How seed tests work</h2>
<p>You send actual campaign emails from client inboxes to a set of test accounts (seeds) that you control across Gmail, Outlook, and Yahoo. You check where the emails land. You record the results. You track changes over time. Use the <a href="/test">placement test</a> to get the authoritative delivery verdict alongside your manual seed checks.</p>

<h2>How to implement at agency scale</h2>

<h3>Create a standard seed account set</h3>
<p>Maintain 2–3 personal Gmail accounts, 2–3 Outlook.com accounts, and 1–2 Yahoo accounts as standard seed infrastructure. Keep these accounts clean — no rules, no contacts, no previous interactions with client domains. They must simulate a default unknown-recipient experience.</p>

<h3>Build a testing protocol</h3>
<p>Specify: when to test (before launch, weekly during campaigns, after changes), what to test (actual campaign content from each inbox), what thresholds trigger action. Assign someone to own deliverability monitoring — at agencies managing more than 5 clients, this should be a dedicated responsibility, not something crammed into a campaign manager's role.</p>

<h3>Document results and track trends</h3>
<p>Track placement per client, per inbox, per provider. A slow decline is easier to fix than a sudden collapse — but only if you notice it. Monthly, review placement trends across all clients. Use the <a href="/tools/burn-score">burn score calculator</a> to track domain health alongside placement data.</p>

<h2>Include in client reporting</h2>
<p>Monthly placement test results are a tangible deliverable that demonstrates proactive infrastructure management. Clients who see regular placement monitoring are more confident in your agency's operational capability — and less likely to blame you if something does go wrong.</p>

<h2>Repair or replace?</h2>
<p>Seed tests do not require repair or replacement — they tell you when repair or replacement is needed. The key operational advantage is lead time. Instead of discovering a deliverability problem when a client asks why replies stopped, you discover it in a weekly seed test and have time to act before the client ever notices. That action might be fixing a configuration issue, adjusting content, or swapping in prewarmed inboxes from <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> before the client ever knows there was a problem.</p>
`
},

{
  slug: "how-to-interpret-placement-test-results",
  title: "How to Interpret Inbox Placement Test Results Correctly",
  category: "Spam & Placement",
  readTime: 7,
  excerpt: "You ran a placement test. Now you have data. Here's exactly how to read the results — by provider, by inbox, and by trend — and what to do with each scenario.",
  body: `
<p>You ran inbox placement tests and now you have data, but you are not sure what it means. Some emails landed in inbox, some in spam, some in tabs. Here's how to interpret results systematically and decide what action to take.</p>

<h2>The overall inbox placement rate</h2>
<p>Count emails that landed in Primary inbox (Gmail) or Inbox/Focused (Outlook/Yahoo). Divide by total test emails sent. This is your inbox placement rate.</p>
<ul>
<li><strong>Above 80%:</strong> Healthy. Proceed with campaigns.</li>
<li><strong>70–80%:</strong> Borderline. Investigate before scaling.</li>
<li><strong>50–70%:</strong> Problem. Diagnose and fix before any production sends.</li>
<li><strong>Below 50%:</strong> Critical. Stop all campaigns from affected inboxes immediately.</li>
</ul>

<h2>Reading provider-specific patterns</h2>
<p><strong>All providers show spam:</strong> Domain or IP reputation issue. Not provider-specific. Check Postmaster Tools and the <a href="/tools/blacklist">blacklist checker</a>.</p>
<p><strong>Gmail shows spam but Outlook is fine:</strong> Gmail-specific reputation or content issue. Check Postmaster Tools for domain reputation.</p>
<p><strong>Outlook shows Junk but Gmail is fine:</strong> Microsoft-specific reputation or IP issue. Check SNDS.</p>
<p><strong>Yahoo shows spam but others are fine:</strong> Less common. Usually IP reputation or content-based.</p>

<h2>Tab placement on Gmail</h2>
<p><strong>Promotions instead of Primary:</strong> Content formatting issue. Not a reputation problem. Simplify content — see the <a href="/blog/promotions-tab-placement-what-now">Promotions tab fix guide</a>.</p>
<p><strong>Updates instead of Primary:</strong> Sometimes happens with transactional-looking emails. Reduce automation signals in the content.</p>

<h2>Inbox-specific variation</h2>
<p><strong>Some inboxes place well, others don't:</strong> The underperforming inboxes may need more warmup, may be on a different IP, or may have accumulated individual inbox-level reputation damage. Check each with the <a href="/tools/warmup-ready">warmup readiness checker</a>.</p>
<p><strong>All inboxes perform similarly:</strong> The issue is domain-wide or content-based, not inbox-specific. Check domain health with the <a href="/tools/burn-score">burn score calculator</a>.</p>

<h2>Inconsistent results across multiple tests</h2>
<p><strong>Results vary day to day:</strong> Could indicate IP rotation. Average across multiple tests for a reliable picture. Run at least 3 tests before drawing conclusions.</p>
<p><strong>Results trend downward over time:</strong> Active reputation degradation. Something is getting worse and needs immediate attention.</p>

<h2>What to do with the data</h2>
<p>If placement is healthy: launch or continue campaigns. Keep testing weekly.</p>
<p>If placement is borderline: test with simplified content using the <a href="/test">placement test</a>. If plain text places better, the issue is content. If plain text also performs poorly, the issue is reputation.</p>
<p>If placement is poor: pause campaigns on affected inboxes. Follow the diagnosis flow for the specific pattern you see.</p>

<blockquote><p>Interpretation drives the repair-or-replace decision. Use the patterns above to determine whether the issue is fixable through configuration and behavior changes (content, volume, targeting) or whether it requires infrastructure changes (IP, domain, inbox replacement). For the latter, <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> provides prewarmed replacement capacity that can be deployed same-day.</p></blockquote>
`
},

{
  slug: "how-to-tell-if-domain-permanently-burned",
  title: "How to Know If a Cold Email Domain Is Permanently Burned",
  category: "Warmup & Recovery",
  readTime: 8,
  excerpt: "Continuing to invest in a permanently burned domain is one of the most expensive cold email mistakes. Here's the framework for knowing when to stop.",
  body: `
<p>Your cold email domain has been underperforming for weeks or months. You have tried everything: reduced volume, cleaned lists, fixed authentication, run warmup, simplified content. Nothing works. Emails still go to spam. You need to know if this domain is recoverable or if you should stop wasting time on it.</p>

<h2>Signs a domain may be permanently burned</h2>
<ul>
<li>Postmaster Tools shows "Bad" domain reputation for more than 4 consecutive weeks despite significant reduction in volume and active warmup</li>
<li>Repeated blocklist appearances — delisted and then relisted within days or weeks, indicating a persistent pattern that blocklist operators have flagged</li>
<li>Spam placement is above 50% on seed tests after 4+ weeks of recovery efforts</li>
<li>The domain was used for high-volume spam-like sending for an extended period</li>
<li>Google or Microsoft has rejected traffic with 5.7.1 or similar errors indicating active blocking</li>
<li>The domain appears on multiple major blocklists simultaneously (Spamhaus, SURBL, Barracuda) and delisting requests are denied or listings recur</li>
</ul>

<h2>Signs a domain is still recoverable</h2>
<ul>
<li>Postmaster Tools shows "Low" rather than "Bad" reputation — Low is damaged but not destroyed</li>
<li>Spam placement is improving on seed tests over the course of 2–4 weeks, even if slowly</li>
<li>The domain was damaged by a single bad campaign rather than sustained poor sending practices</li>
<li>Blocklist listings have been successfully removed and have not recurred</li>
<li>The domain has positive sending history before the damage occurred — prior good reputation provides a foundation for recovery</li>
</ul>

<h2>Step-by-step assessment</h2>

<h3>Step 1: Check current Postmaster Tools status</h3>
<p>Check domain reputation and spam rate trend over the last 30–60 days. Has reputation improved at all during your recovery efforts?</p>

<h3>Step 2: Check blacklists</h3>
<p>Run the <a href="/tools/blacklist">blacklist checker</a>. Count how many lists the domain appears on and whether previous delisting requests held.</p>

<h3>Step 3: Run inbox placement tests</h3>
<p>Use the <a href="/test">placement test</a> to calculate current inbox placement rate. Compare to 2 weeks ago and 4 weeks ago. Is it improving, stable, or getting worse?</p>

<h3>Step 4: Assess your recovery effort</h3>
<p>Have you genuinely reduced volume, cleaned lists, and run warmup for at least 4 weeks? Or have you been making incremental changes without committing to a full recovery protocol? If the recovery effort has been half-hearted, try the full protocol before declaring the domain dead. Use the <a href="/tools/recovery-time">recovery time estimator</a> to assess realistic timelines.</p>

<h2>Repair or replace?</h2>
<p><strong>Replace if:</strong> Domain reputation has been Bad for 4+ weeks, repeated blocklist recurrence, below 50% placement after a month of recovery, and you need campaign performance now.</p>
<p><strong>Continue repair if:</strong> Domain reputation is Low (not Bad), damage was from a single incident, blocklist listings were successfully removed, and placement shows a positive trend. Use the <a href="/tools/repair-or-replace">repair-or-replace calculator</a> to get a structured recommendation based on your specific signals.</p>
<p>When replacement is the answer, <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> provides domains that are already aged, authenticated, and warmed through a full warmup cycle. You skip the weeks of preparation and go directly to production-ready infrastructure.</p>
`
},

{
  slug: "can-burned-domain-recover-after-stopping-sends",
  title: "Can a Burned Cold Email Domain Recover After Stopping Sends?",
  category: "Warmup & Recovery",
  readTime: 7,
  excerpt: "You're thinking about just stopping all sends and letting the domain rest. Will it recover on its own? Here's the honest answer.",
  body: `
<p>Your cold email domain is burned. Emails go to spam. Reputation is bad. You are thinking about just stopping all sends and letting the domain rest. Will it recover on its own?</p>

<h2>The honest answer</h2>
<p>Sometimes yes, sometimes no. Resting a domain removes the ongoing negative signals (complaints, low engagement, spam placement) but it does not actively build positive reputation. Recovery depends on how badly the domain was damaged and what you do during the rest period.</p>

<h2>How domain recovery works mechanically</h2>
<p>When you stop sending from a burned domain, the active negative signals stop. No new spam complaints. No new low-engagement signals. No new blocklist triggers. This removes the downward pressure on reputation.</p>
<p>But reputation does not automatically climb back just because you stopped. Gmail and Outlook's systems track historical behavior. A domain that was classified as a spam source retains that classification until there are enough positive signals to reclassify it.</p>
<p>For mild damage (reputation went from High to Low after a bad campaign), resting for 2–4 weeks while running warmup at low volume can be enough. For severe damage (reputation has been Bad for weeks, multiple blocklist listings, sustained high complaint rates), resting alone is not enough. The negative history is too deep.</p>

<h2>Step-by-step recovery during rest</h2>

<h3>Step 1: Stop all cold outreach immediately</h3>
<p>No exceptions. Not even "just one campaign" to test.</p>

<h3>Step 2: Keep warmup running at low volume</h3>
<p>10–20 warmup emails per day. Warmup with a high-quality network that generates opens and replies. This creates positive signals while the absence of cold outreach prevents new negative signals.</p>

<h3>Step 3: Submit blacklist delisting requests</h3>
<p>Check your current blacklist status with the <a href="/tools/blacklist">blacklist checker</a> and submit delisting requests for any active listings. Most blacklists have self-service removal forms.</p>

<h3>Step 4: Monitor Postmaster Tools weekly</h3>
<p>Look for reputation trends. If reputation improves from Bad to Low after 2 weeks, recovery is progressing. Use the <a href="/tools/burn-score">burn score calculator</a> to track improvement across all signals.</p>

<h3>Step 5: Run placement tests every 2 weeks</h3>
<p>Use the <a href="/test">placement test</a>. If placement is above 80% after 4 weeks, you can begin resuming cold outreach at very low volume (5–10 per day). If placement is still below 50% after 4 weeks, the domain may need more time or may not recover in a practical timeframe.</p>

<h2>Repair or replace?</h2>
<p>Rest and recovery is the repair path. Give it 4 weeks with warmup and monitoring. If the domain shows improvement, continue. It may take 6–8 weeks total for a full recovery from severe damage.</p>
<p>If after 4 weeks there is no improvement, the domain is likely permanently burned and should be replaced.</p>
<p>During the rest period, campaigns still need to run for clients. <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> provides prewarmed inboxes on healthy domains that can carry your campaign load while the burned domain rests. This is not about giving up on the domain — it is about not losing revenue while it recovers.</p>
`
},

{
  slug: "how-long-to-rest-burned-cold-email-domain",
  title: "How Long Should You Rest a Burned Cold Email Domain?",
  category: "Warmup & Recovery",
  readTime: 7,
  excerpt: "The right rest period depends on how badly the domain was damaged. Here's the framework by damage severity — with specific milestones for when to test and when to resume.",
  body: `
<p>You have decided to rest a burned cold email domain. Now you need to know how long. Resting too short risks re-damaging the domain. Resting too long wastes a potentially recoverable asset.</p>

<h2>Rest periods by damage severity</h2>

<h3>Mild damage</h3>
<p><strong>Indicators:</strong> Postmaster Tools shows Low (not Bad) reputation. Placement tests show 60–75% inbox. One blocklist listing that was successfully removed. Caused by a single bad campaign.</p>
<p><strong>Rest period:</strong> 2–3 weeks with warmup running.</p>
<p><strong>Resume when:</strong> Placement tests show 80%+ for 3 consecutive tests. Postmaster Tools shows Medium or better reputation.</p>

<h3>Moderate damage</h3>
<p><strong>Indicators:</strong> Postmaster Tools shows Bad reputation for less than 2 weeks. Placement tests show 40–60% inbox. Multiple blocklist listings. Several weeks of declining performance before you stopped.</p>
<p><strong>Rest period:</strong> 4–6 weeks with warmup running.</p>
<p><strong>Resume when:</strong> Postmaster Tools reputation improves to Low or Medium. Placement tests show 80%+ consistently. Blocklist listings are removed and have not recurred for 2 weeks.</p>

<h3>Severe damage</h3>
<p><strong>Indicators:</strong> Postmaster Tools shows Bad reputation for more than 2 weeks. Placement tests show below 40% inbox. Persistent blocklist recurrence. Extended period of high-volume, low-quality sending.</p>
<p><strong>Rest period:</strong> 6–8 weeks minimum with warmup running. Realistically assess whether the domain will recover at all using the <a href="/tools/recovery-time">recovery time estimator</a>.</p>
<p><strong>Resume when:</strong> Placement tests show 80%+ for 5 consecutive tests over 2 weeks. Postmaster Tools shows at least Low reputation. No blacklist recurrence for 4 weeks.</p>

<h2>What to do during the rest period</h2>
<p>Run warmup at 10–20 emails per day from each inbox. Monitor Postmaster Tools weekly. Run placement tests with the <a href="/test">placement test</a> every 2 weeks to track progress. Check the <a href="/tools/blacklist">blacklist checker</a> weekly. Do not send any cold outreach — zero cold sends during rest.</p>

<h2>Repair or replace?</h2>
<p>Follow the rest guidelines above and monitor progress. If the domain does not show measurable improvement by the midpoint of its rest period (reputation not improving on Postmaster Tools, placement not increasing on tests), begin preparing replacement infrastructure.</p>
<p><a href="https://warminboxes.com" target="_blank">WarmInboxes</a> allows you to maintain campaign output during the rest period. Rather than telling clients to wait 6–8 weeks, shift campaigns to prewarmed inboxes on healthy domains while the burned domain recovers in the background. If the domain recovers, bring it back as additional capacity. If it does not, you have already transitioned to replacement infrastructure with zero downtime.</p>
`
},

{
  slug: "keep-warming-damaged-inbox-or-start-over",
  title: "Should You Keep Warming a Damaged Inbox or Start Over?",
  category: "Warmup & Recovery",
  readTime: 7,
  excerpt: "An inbox is damaged and warmup isn't helping. When do you keep going and when do you cut your losses? Here's the decision framework.",
  body: `
<p>An inbox has been damaged. Emails go to spam. You have been running warmup on it for weeks but placement is not improving. You are wondering whether to keep warming and hope it recovers, or to cut your losses and start over with a new inbox.</p>

<h2>When to keep warming</h2>
<ul>
<li>The inbox is on a domain with otherwise healthy reputation. If the domain is fine and only this specific inbox is struggling, continued warmup may help as inbox-level signals improve.</li>
<li>Warmup has been running for less than 4 weeks. Some inboxes need more time, especially if the damage was recent.</li>
<li>Placement tests show a positive trend, even if the inbox is not yet at 80%. Improvement — even slow improvement — is a reason to continue.</li>
<li>The damage was caused by a specific, fixable issue (bad campaign, content trigger, temporary IP problem) and that issue has been resolved.</li>
</ul>

<h2>When to start over</h2>
<ul>
<li>Warmup has been running for 4+ weeks with no improvement in placement tests</li>
<li>The inbox is on a domain with Bad reputation in Postmaster Tools — warming an individual inbox cannot overcome domain-level reputation damage</li>
<li>The inbox was banned, suspended, or received permanent sending restrictions from the email provider</li>
<li>The sending IP associated with the inbox is on a persistent blocklist that the email provider cannot or will not change</li>
</ul>

<h2>How to assess where you are</h2>
<p>Run the <a href="/test">placement test</a> from the specific inbox in question. Compare to results from 2 weeks ago. Is placement improving, stable, or getting worse? Check the domain's overall health with the <a href="/tools/burn-score">burn score calculator</a>. Run the <a href="/tools/blacklist">blacklist checker</a> on both the domain and the sending IP.</p>
<p>Set a clear decision point: if warmup has been running for 4 weeks and placement tests haven't improved by at least 15 percentage points, start the replacement process.</p>

<h2>How to start over effectively</h2>
<p>If the domain itself is healthy, you can create a new inbox on the same domain. New inbox, fresh start, full warmup cycle.</p>
<p>If the domain is damaged, you need a new domain and new inboxes. Age the new domain for at least 30 days, configure auth completely (SPF, DKIM, DMARC) and warm for 2–4 weeks before production. Use the <a href="/tools/launch-checklist">launch checklist</a> to set up the new domain correctly from scratch.</p>

<h2>Repair or replace?</h2>
<p>If warmup is showing results, keep warming. If 4 weeks of warmup have produced no improvement, replace.</p>
<p>For operators who need production-ready inboxes immediately, <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> provides inboxes that have already been through a full warmup cycle. Instead of spending weeks warming a new inbox from scratch, you get one that is ready for campaign sends on day one.</p>
`
},

{
  slug: "when-to-abandon-cold-email-domain",
  title: "When to Abandon a Cold Email Domain Instead of Repairing It",
  category: "Warmup & Recovery",
  readTime: 7,
  excerpt: "Investing time in a permanently burned domain is one of the most expensive cold email mistakes. Here's the abandonment decision framework.",
  body: `
<p>You have a cold email domain that is not performing. You have tried recovery. The question is whether to keep investing or walk away.</p>

<h2>The abandonment decision framework</h2>
<p>There are three factors to weigh: recovery probability, recovery timeline, and opportunity cost.</p>
<p><strong>Recovery probability:</strong> Based on severity indicators from your assessment. If Postmaster Tools shows Bad reputation for 4+ weeks, placement is below 50% after a month of recovery, and blocklist listings keep recurring, the probability of recovery within a reasonable timeframe is low.</p>
<p><strong>Recovery timeline:</strong> Even if recovery is possible, how long will it take? A domain that needs 2–3 months to recover represents 2–3 months of reduced campaign performance.</p>
<p><strong>Opportunity cost:</strong> What could you accomplish in the same timeframe with a new, healthy domain? If you can have a new domain warmed and performing within 4–6 weeks, is that faster than recovering the old one? Use the <a href="/tools/recovery-time">recovery time estimator</a> to compare both paths with your specific numbers.</p>

<h2>When to abandon</h2>
<ul>
<li>The domain has been in recovery for 4+ weeks with no improvement</li>
<li>The domain is on multiple persistent blocklists with recurring listings — use the <a href="/tools/blacklist">blacklist checker</a> to assess current status</li>
<li>The damage was caused by sustained poor practices over an extended period, not a one-time incident</li>
<li>The cost of continued recovery attempts exceeds the cost of starting fresh</li>
<li>Postmaster Tools shows Bad reputation for 4+ weeks despite a full recovery effort</li>
</ul>

<h2>When not to abandon</h2>
<ul>
<li>The domain is showing recovery, even if slowly — patience may be warranted</li>
<li>The domain has significant brand equity and replacement would cause confusion</li>
<li>The damage was from a single incident and is less than 2 weeks old — give it a fair chance to recover first</li>
</ul>

<h2>How to abandon properly</h2>
<p>Stop all sending from the domain. Remove it from all campaigns and outreach tools. Do not delete the domain — keep it registered. A lapsed domain can be picked up by spammers and turned into a source of further damage that could affect your reputation by association.</p>
<p>If the domain is related to your brand, keep DNS records clean and maintain authentication records. Even if you do not send from it, having proper SPF, DKIM, and DMARC prevents others from spoofing it.</p>
<p>Transition to replacement domains. Age new domains for 30+ days, configure using the <a href="/tools/launch-checklist">launch checklist</a>, and warm for 2–4 weeks.</p>

<h2>Repair or replace?</h2>
<p>When you decide to abandon and replace, the operational challenge is the transition timeline. <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> eliminates that timeline. Prewarmed domains and inboxes are ready for immediate production use. The transition from a burned domain to healthy infrastructure can happen in days rather than weeks. The burned domain gets retired. The campaigns continue without interruption.</p>
`
},

{
  slug: "replace-burned-inboxes-without-pausing-campaigns",
  title: "How to Replace Burned Inboxes Without Pausing Client Campaigns",
  category: "Agency",
  readTime: 9,
  excerpt: "Client campaigns are live. Your inboxes are burned. You need to swap infrastructure without a month-long pause. Here's the exact rotation playbook.",
  body: `
<p>Client campaigns are live. Your inboxes are burned or underperforming. You need to swap infrastructure without telling the client "we need to pause for a month while we warm up new inboxes."</p>

<h2>Why this is the agency's hardest deliverability problem</h2>
<p>Agencies sell results. When deliverability fails, results fail. Pausing campaigns means pausing pipeline for your client. That damages the relationship and can cost the account. But continuing to send from burned inboxes makes everything worse. You are trapped between two bad options unless you have replacement infrastructure ready to go.</p>

<h2>The replacement playbook</h2>

<h3>Step 1: Identify which inboxes are burned</h3>
<p>Run the <a href="/test">placement test</a> from every inbox. Categorize each as healthy (80%+), borderline (60–80%), or burned (below 60%). Don't replace what isn't broken — only swap what's actually failing.</p>

<h3>Step 2: Source replacement inboxes</h3>
<p>You have two options:</p>
<p><strong>Option A: Warm new inboxes yourself.</strong> Takes 2–4 weeks minimum. During that time, campaigns suffer on burned infrastructure.</p>
<p><strong>Option B: Source prewarmed inboxes from <a href="https://warminboxes.com" target="_blank">WarmInboxes</a>.</strong> Available immediately. Already aged, authenticated, and warmed. This is the option that lets you swap without pausing.</p>

<h3>Step 3: Verify replacement infrastructure</h3>
<p>Before activating any replacement inboxes for campaigns, run a placement test on them. Confirm they're actually placing at 80%+. Check authentication is configured correctly using the <a href="/tools/dkim">DKIM checker</a>, <a href="/tools/spf">SPF checker</a>, and <a href="/tools/dmarc">DMARC lookup</a>. Verify tracking domain is set up correctly with the <a href="/tools/tracking-domain">tracking domain checker</a>.</p>

<h3>Step 4: Migrate campaigns gradually</h3>
<p>Day 1: split campaign volume 50/50 between remaining healthy inboxes and replacements. Day 2–3: if replacements perform well, increase their share to 70–80%. Day 4–5: if stable, move all volume from burned inboxes to replacements. Do not migrate all volume to replacements on day one.</p>

<h3>Step 5: Put burned inboxes on recovery</h3>
<p>Move burned inboxes to warmup-only mode. Follow the recovery protocol: low-volume warmup, no cold outreach, monitor for 4–6 weeks. Check progress with the <a href="/tools/burn-score">burn score calculator</a> every 2 weeks.</p>

<h3>Step 6: Replenish reserves immediately</h3>
<p>Every inbox deployed from your reserve must be replaced. Order or begin warming replacement backups immediately. Do not wait until the next failure.</p>

<h2>Client communication during the swap</h2>
<p>Brief notification: "We identified a deliverability issue affecting your campaign. We've already deployed backup infrastructure and campaign sends are continuing normally. I'll send a technical summary today."</p>
<p>Lead with the solution, not the problem. Clients respect competence and transparency. What they do not respect is finding out weeks later that their campaign was sending to spam.</p>
`
},

{
  slug: "how-many-backup-inboxes-cold-email-agency",
  title: "How Many Backup Inboxes Should a Cold Email Agency Keep Ready?",
  category: "Agency",
  readTime: 7,
  excerpt: "Too few backup inboxes and you can't respond to failures. Too many and you're over-maintaining. Here's the right formula for your agency's size.",
  body: `
<p>You want to prepare for deliverability failures before they happen. You know you need backup inboxes but you are not sure how many to maintain.</p>

<h2>The planning framework</h2>
<p>The number of backup inboxes you need depends on three factors: your total active inbox count, your historical failure rate, and your swap speed.</p>

<h3>Total active inbox count</h3>
<p>A reasonable starting point is 20–30% of your active inbox count in reserve. If you run 20 inboxes across all clients, keep 4–6 prewarmed backups ready. Use the <a href="/tools/infra-calc">infrastructure calculator</a> to determine the right numbers for your portfolio size.</p>

<h3>Historical failure rate</h3>
<p>Track how often you need to replace inboxes. If you typically burn 2–3 inboxes per month, you need at least 3–4 backups to cover that churn plus a buffer.</p>

<h3>Swap speed</h3>
<p>If you warm inboxes yourself (2–4 weeks per batch), you need enough backups to cover failures during that warmup period. If you source from <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> (days, not weeks), you need fewer in reserve because replenishment is fast.</p>

<h2>Recommended minimums</h2>
<ul>
<li><strong>Solo operator (5–10 active inboxes):</strong> Keep 2–3 backups warmed and ready.</li>
<li><strong>Small agency (20–30 active inboxes):</strong> Keep 5–8 backups across Gmail and M365.</li>
<li><strong>Medium agency (50–100 active inboxes):</strong> Keep 10–20 backups. At this scale, maintaining a rolling pipeline of warming inboxes is essential.</li>
<li><strong>Large agency (100+ active inboxes):</strong> Dedicate infrastructure to maintaining at least 20% reserve capacity. Use a mix of self-warmed inboxes and WarmInboxes reserves for fast replenishment.</li>
</ul>

<h2>How to maintain reserves so they stay usable</h2>
<p>Keep backup inboxes on continuous warmup — 2–3 sends per day keeps sending history active. Test backup inboxes monthly with the <a href="/test">placement test</a> to confirm they are still healthy. Rotate backups into production periodically (even for small sends) to maintain active sending reputation. Replenish reserves immediately when you use them.</p>
<p>A backup that is not being warmed loses its value within 2–4 weeks. Stale backup inboxes are not backup inboxes — they are just extra accounts you are paying for.</p>

<h2>The business case</h2>
<p>The cost of maintaining backup capacity is significantly less than the cost of losing a client campaign. One prevented client churn event typically covers months of backup infrastructure cost. Build backup capacity into your service pricing as an infrastructure maintenance line item — typically 10–15% of monthly campaign cost.</p>

<blockquote><p>For agencies that don't want to maintain their own warming operations for backup capacity, <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> provides prewarmed inboxes on demand. Instead of running a 4-week warmup pipeline internally, you can order prewarmed inboxes and have them ready within days. This turns backup planning from a major operational burden into a simple ordering process.</p></blockquote>
`
},

{
  slug: "rotate-prewarmed-inboxes-after-deliverability-failure",
  title: "How to Rotate into Prewarmed Inboxes After a Deliverability Failure",
  category: "Agency",
  readTime: 8,
  excerpt: "You have prewarmed replacement inboxes ready. Now you need to execute the rotation cleanly without disrupting active campaigns. Here's the exact protocol.",
  body: `
<p>You have identified a deliverability failure. Inboxes are burned, campaigns are suffering, and you need to swap to healthy infrastructure as quickly as possible. You have prewarmed inboxes ready — either self-warmed or from a service. Now you need to execute the rotation cleanly.</p>

<h2>Step 1: Assess the damage</h2>
<p>Run the <a href="/test">placement test</a> from each inbox. Identify which are burned and which are still healthy. Only replace what is broken. Do not rotate inboxes that are performing well — this disrupts working infrastructure for no benefit.</p>

<h2>Step 2: Verify replacement infrastructure before activating</h2>
<p>Check authentication on replacement inbox domains: <a href="/tools/spf">SPF</a>, <a href="/tools/dkim">DKIM</a>, <a href="/tools/dmarc">DMARC</a>. Verify the tracking domain is set up correctly with the <a href="/tools/tracking-domain">tracking domain checker</a>. Run a placement test from the replacement inbox — confirm 80%+ before putting it into production.</p>

<h2>Step 3: Configure in your outreach tool</h2>
<p>Add replacement inboxes to your outreach platform. Connect email accounts and assign to the affected campaigns. Do not disable warmup on replacement inboxes when they enter production — keep warmup running alongside campaign sends to maintain engagement signals.</p>

<h2>Step 4: Gradual migration</h2>
<p><strong>Day 1:</strong> Split campaign volume 50/50 between remaining healthy inboxes and replacements.<br>
<strong>Day 2–3:</strong> Monitor placement tests on replacements. If healthy, increase their share to 70–80%.<br>
<strong>Day 4–5:</strong> If stable, move all volume from burned inboxes to replacements. Remove burned inboxes from campaigns.</p>
<p>Do not migrate all volume to replacements on day one. Even prewarmed inboxes need a ramp-in period with your specific campaign content and sending patterns.</p>

<h2>Step 5: Retire burned inboxes to recovery</h2>
<p>Remove burned inboxes from campaigns but keep them on warmup-only mode for recovery. Monitor with the <a href="/tools/burn-score">burn score calculator</a> for 4–6 weeks. If they recover, add them back as reserve capacity. If they do not, retire them entirely.</p>

<h2>Step 6: Replenish reserves</h2>
<p>Every inbox deployed from your reserve must be replaced immediately. Do not wait until the next failure. Order replacement backups now — from <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> or begin your own warmup pipeline.</p>

<div class="checklist">
<h4>Rotation checklist</h4>
<ul>
<li>Placement test confirms which inboxes are burned vs healthy</li>
<li>Replacement inbox authentication verified (SPF, DKIM, DMARC)</li>
<li>Tracking domain verified on replacement inboxes</li>
<li>Placement test run on replacement inboxes — confirms 80%+ before activation</li>
<li>Gradual migration executed over 4–5 days</li>
<li>Burned inboxes moved to warmup-only mode, not abandoned</li>
<li>Reserve replenishment ordered immediately</li>
<li>Client notification sent within 24 hours of failure detection</li>
</ul>
</div>
`
},

{
  slug: "new-domain-vs-aged-domain-cold-email-replacement",
  title: "New Domain vs Aged Domain for Replacing Burned Cold Email Infrastructure",
  category: "Warmup & Recovery",
  readTime: 7,
  excerpt: "When replacing burned infrastructure, should you register new domains or buy aged ones? The trade-offs determine your time to production.",
  body: `
<p>You need to replace burned cold email infrastructure. You are deciding between registering a new domain and buying or sourcing an aged domain. Each has real trade-offs that affect how quickly you can get campaigns running.</p>

<h2>New domains</h2>
<p><strong>Advantages:</strong> Clean history — no previous owner's sending behavior affects your reputation. Full control over the domain name. Lower cost (registration is cheap).</p>
<p><strong>Disadvantages:</strong> Zero reputation. Mail providers treat new domains as unknown, which means heightened scrutiny and filtering. Requires 30+ days of aging before starting warmup, then 2–4 more weeks of warmup. Total time to production: 4–8 weeks. Higher risk during the early sending period — new domains are more fragile and more sensitive to any negative signals.</p>

<h2>Aged domains</h2>
<p><strong>Advantages:</strong> Existing domain history. A domain registered for 6–12 months with some web presence has a baseline level of trust. Aged domains typically warm up faster because they are not starting from absolute zero. Shorter time to production — with proper warmup, an aged domain can be production-ready in 2–4 weeks instead of 4–8.</p>
<p><strong>Disadvantages:</strong> Previous owner risk. If the aged domain was used for spam or abuse by a previous owner, it may carry negative reputation. You must check before purchasing. Higher cost than fresh registrations. Limited name options that match your brand naming preferences.</p>

<h2>How to evaluate an aged domain before purchasing</h2>
<ul>
<li>Check Google Safe Browsing status for any warnings</li>
<li>Run through the <a href="/tools/blacklist">blacklist checker</a> for current or historical listings</li>
<li>Check the Wayback Machine (archive.org) for what the domain was previously used for</li>
<li>Check the domain's backlink profile — spammy backlinks indicate previous abuse</li>
<li>Look up any existing DNS records using the <a href="/dns">DNS checker</a> — active MX, SPF, or DKIM records indicate the domain was recently used for email</li>
<li>Check the domain's current redirect with the <a href="/tools/redirect">redirect checker</a></li>
</ul>

<h2>The fastest path: prewarmed domains</h2>
<p>For operators who need the fastest possible replacement path, <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> provides aged domains that have already been vetted, configured, and warmed. You skip the evaluation, setup, and warmup process entirely. The domains come with clean history, proper authentication, and completed warmup — ready for production campaigns. This turns a 4–8 week replacement project into a same-day deployment.</p>

<h2>Repair or replace?</h2>
<p>This article helps you make the replacement choice correctly. The key insight: if you are going to replace, choose the option that gets you to production fastest given your timeline constraints. For campaigns that cannot wait 6+ weeks, prewarmed domains are the only viable option.</p>
`
},

{
  slug: "cold-email-disaster-recovery-plan-agencies",
  title: "Cold Email Disaster Recovery Plan for Agencies with Active Client Campaigns",
  category: "Agency",
  readTime: 11,
  excerpt: "Every cold email agency will eventually face a deliverability disaster. The agencies that handle it without losing clients are the ones who planned for it in advance. Here's the full SOP.",
  body: `
<p>Something has gone catastrophically wrong. A domain is burned, inboxes are sending to spam, a client's campaign is producing zero results, and you need to fix it now. You do not have a plan. You are making it up as you go. Here is what that plan should look like — written before the next crisis hits.</p>

<h2>Phase 1: Detection (0–2 hours)</h2>
<p>You discover the problem. Maybe a client reports no replies. Maybe your weekly placement test shows a crash. Maybe you get a bounce alert. Immediate actions:</p>
<ul>
<li>Stop all cold outreach from affected inboxes. Do not send "just one more campaign" to test. Stop.</li>
<li>Run placement tests from all client inboxes using the <a href="/test">placement test</a> to determine the scope. Is it one inbox, one domain, or all domains?</li>
<li>Check Postmaster Tools, SNDS, and the <a href="/tools/blacklist">blacklist checker</a> for red flags.</li>
<li>Check authentication headers on a test email using the <a href="/tools/dkim">DKIM checker</a>, <a href="/tools/spf">SPF checker</a>, and <a href="/tools/dmarc">DMARC lookup</a>.</li>
</ul>

<h2>Phase 2: Triage (2–6 hours)</h2>
<p>Categorize the damage:</p>
<ul>
<li><strong>Contained:</strong> One inbox or one domain affected. Other infrastructure is healthy.</li>
<li><strong>Moderate:</strong> Multiple inboxes or domains affected. Some healthy infrastructure remains.</li>
<li><strong>Total:</strong> All or nearly all sending infrastructure compromised.</li>
</ul>
<p>Identify the likely cause: authentication failure (DNS change, key rotation issue), reputation damage (bad campaign, complaint spike), blocklist listing, provider infrastructure change, or volume spike. Check the <a href="/tools/burn-score">burn score calculator</a> on affected domains for a comprehensive health snapshot.</p>

<h2>Phase 3: Stabilize (6–24 hours)</h2>

<h3>For contained damage</h3>
<p>Remove affected inboxes from campaigns. Redistribute volume to healthy inboxes. Begin warmup-only on affected inboxes.</p>

<h3>For moderate damage</h3>
<p>Remove all affected inboxes from campaigns. Deploy prewarmed backup inboxes from reserves. Redistribute campaigns to healthy inboxes plus backups.</p>

<h3>For total damage</h3>
<p>Deploy all available backup inboxes. If backup reserves are insufficient, source additional prewarmed inboxes from <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> immediately — they can deploy same-day. Reduce campaign volume across the board until new infrastructure is tested and stable.</p>

<h2>Phase 4: Communicate (within 24 hours)</h2>
<p>Inform affected clients. Be honest about the situation but lead with the solution. Template:</p>
<blockquote><p>"We identified a deliverability issue affecting your campaign. We've already deployed backup infrastructure and campaigns will resume at full volume within [timeframe]. I'll send a technical summary today. No action needed from you."</p></blockquote>
<p>Clients respect transparency and competence. What they do not respect is finding out weeks later that their campaign was sending to spam.</p>

<h2>Phase 5: Recover (1–6 weeks)</h2>
<p>Put all damaged infrastructure on recovery protocol: warmup only, no cold outreach. Monitor Postmaster Tools and SNDS weekly. Run placement tests with the <a href="/test">placement test</a> every 2 weeks. Set clear recovery benchmarks — 80%+ placement for 3 consecutive tests before resuming.</p>

<h2>Phase 6: Post-mortem (within 1 week of stabilization)</h2>
<p>Document what happened, why, and what was done. Identify what could have prevented the disaster. Update the plan based on lessons learned. Replenish backup reserves immediately. Most agencies experience the same failure modes multiple times because they don't run post-mortems.</p>

<h2>What to include in your written plan</h2>
<div class="checklist">
<h4>Disaster recovery plan checklist</h4>
<ul>
<li>Detection procedures and escalation triggers</li>
<li>Contact information for all relevant platforms (outreach tool support, domain registrar, email provider support, blacklist delist request URLs)</li>
<li>Inventory of backup inboxes with current status and placement test dates</li>
<li>Client communication templates for each damage category</li>
<li>Recovery protocols for contained, moderate, and total damage</li>
<li>Post-mortem template</li>
<li>Designated person responsible for incident response</li>
</ul>
</div>

<h2>How to make this plan actually work</h2>
<p>The biggest gap in most disaster recovery plans is backup infrastructure. Agencies plan for detection and communication but don't have replacement inboxes ready to deploy. With prewarmed inboxes from <a href="https://warminboxes.com" target="_blank">WarmInboxes</a> available on demand, the stabilization phase shrinks from weeks (warming new inboxes) to hours (deploying prewarmed ones). The time to set this up is before a crisis — not during one.</p>
`
},

];

// Note: last post appended separately
