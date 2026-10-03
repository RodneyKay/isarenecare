# Isarene Home Care Services: Node.js website

Express + EJS site, rebuilt from the Hopewell Bootstrap template and rebranded for Isarene
(teal `#1A7F96`, slate `#2D3748`, blue `#2575FC`; Urbanist + Poppins, taken from isarene.com).

## Run it
```bash
npm install
cp .env.example .env      # optional: add SMTP details so forms are emailed
npm start                 # http://localhost:3000
npm test                  # smoke test: every page, redirect and form endpoint
```

## Before going live
1. **Images:** pages currently load photos/logo from isarene.com. Run `npm run fetch-images`, then start with `LOCAL_IMAGES=true` so the site does not depend on the old server.
2. **Forms:** without SMTP settings, submissions are saved to `data/submissions.jsonl`. Add `SMTP_*` and `MAIL_TO` in `.env` to receive them by email.
3. **Copy to confirm with the client:** blog article bodies (`data/posts.js`), FAQ answers (`data/faqs.js`), privacy and terms (`data/legal.js`, needs legal review), the Careers roles, and which phone number is primary (`data/site.js`).
4. **Not carried over on purpose:** the "15K+ happy patients", "Professional Nurses" and years-of-experience counters from the old site. Add them back only when the client can verify them.
5. Set `SITE_URL` in `.env` to the live domain (used for canonical links and sitemap).

## Where things are
| What | File |
|---|---|
| Business details, nav, services, testimonials, image URLs | `data/site.js` |
| Blog posts / FAQs / legal text | `data/posts.js`, `data/faqs.js`, `data/legal.js` |
| Pages and shared parts | `views/pages/*`, `views/partials/*` |
| Brand colors and fonts | top of `public/css/style.css` (`:root` variables) |
| Isarene-specific styles | `public/css/isarene.css` |
| Routes, redirects (old WordPress URLs) | `routes/pages.js` |
| Form handling, spam protection, email | `routes/api.js` |

Security: Helmet with a strict Content-Security-Policy, rate-limited form endpoints, honeypot field, input trimming and validation.
See `NOTICE.md` for the template license.
