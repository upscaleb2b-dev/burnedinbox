# Burned Inbox

Email deliverability & inbox placement tester for marketers.

**Live:** https://burnedinbox.com  
**Partner:** https://warminboxes.com

## Pages
- `/` — Landing page (red/white, editorial bold)
- `/test` — Live inbox placement tester (3-stage flow)

## API Routes
- `POST /api/start-test` — Takes `{domain, email}`, returns seed address + DNS analysis
- `GET /api/check-result?id=&domain=&elapsed=` — Polls for email receipt, returns verdict

## Stack
Next.js 15 · Tailwind CSS · IBM Plex Mono · Bebas Neue · Vercel

---

## Deploy to Vercel

```bash
# Option A — CLI
npm i -g vercel && vercel --prod

# Option B — GitHub import
# vercel.com/new → import repo → auto-detected as Next.js → Deploy
```

### Domain setup
1. Vercel dashboard → Project → Settings → Domains
2. Add `burnedinbox.com` (primary)
3. Add `burnedinboxes.com` (alias — vercel.json handles 301 redirect automatically)

---

## Wiring Up Real Email Detection

### Step 1 — Set up an inbound email handler
Use one of:
- **Resend** — inbound webhooks (resend.com/docs/receiving-emails)
- **Mailgun** — inbound routes
- **Cloudflare Email Routing** → R2 storage → read via Worker

### Step 2 — Replace the stub in `/api/check-result`
The section marked `REPLACE IN PRODUCTION` is where you poll your inbox.
Check the folder header on the received MIME message:
- Gmail: `X-GM-THRID` + Labels API to check folder
- Generic: parse `X-Spam-Status` header

### Step 3 — Persist sessions
Replace the stateless stub with Redis (Upstash works well on Vercel):
```bash
npm install @upstash/redis
```
Store sessions keyed by `id`, set TTL of 10 minutes.

### Step 4 — Real DNS lookups
Replace `lib/dns-checks.ts` stub with:
```ts
import dns from "dns/promises";
const txt = await dns.resolveTxt(`_dmarc.${domain}`);
```
Note: Vercel Edge functions don't support Node dns — use a regular serverless function or an external DNS API (Cloudflare DNS over HTTPS works).

---

## Environment Variables (for production)
```env
RESEND_API_KEY=re_...          # For sending confirmation emails
UPSTASH_REDIS_REST_URL=...     # Session storage
UPSTASH_REDIS_REST_TOKEN=...
```
