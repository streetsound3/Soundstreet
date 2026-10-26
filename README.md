# Sound Street Research website

The public site for Sound Street Research. It's plain HTML, CSS and a little JavaScript, with no build step, so any static host can serve it as is.

## What's in here

| Path | Page |
|---|---|
| `index.html` | Homepage |
| `research/` | All research, with the theme filter |
| `research/boj-preview-october-2026/` | BOJ preview note (Oct 22, 2026) |
| `research/weak-yen/` | Weak yen flash note (Oct 21, 2026) |
| `advisors/` | For Advisors |
| `advisors/weak-yen/` | Advisor edition: the weak yen |
| `calls/` | Open calls |
| `team/` | Team |
| `disclosures/` | Disclosures |
| `404.html` | Shown for any page that doesn't exist |
| `assets/config.js` | **Form settings: the one file to edit** |
| `assets/site.js` | Form handling and the research filter |
| `assets/img/` | Team photos |
| `sitemap.xml`, `robots.txt` | For search engines |
| `_headers` | Security and caching headers |
| `wrangler.jsonc` | Cloudflare settings |

## Deploy on Cloudflare

The site runs on Cloudflare Workers (static assets). `wrangler.jsonc` holds the settings, including the custom 404 page. Every commit to `main` redeploys automatically in about a minute. Live at https://soundstreetresearch.com until the custom domain is connected.

## Turn the forms on

Open `assets/config.js` and paste in:

- `substackUrl`: your Substack address (the Subscribe form sends readers there to confirm)
- `sampleEndpoint`: your Formspree endpoint (the advisor sample forms post there, and Formspree emails you)

Until those are filled in, the forms check the email address and then tell visitors sign-ups open soon. Nothing gets lost silently.

## If the domain changes

`sitemap.xml`, `robots.txt` and each page's canonical and preview-image tags use the site address. The site is currently set to `https://soundstreetresearch.com`. When you connect a real domain, the files get regenerated with the new address.

## How updates happen

Claude publishes new notes, team changes and fixes by committing straight to `main`; Cloudflare redeploys in about a minute. `assets/config.js` is edited by hand in GitHub, so builds never overwrite it.
