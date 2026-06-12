# Crema Gazi Project Roadmap

Last updated: 2026-06-13

## Current Milestones

- React/TypeScript/Tailwind/Vite foundation is in place.
- GitHub repository is connected and pushed.
- GitHub Actions CI runs lint, build and Playwright tests on push/PR.
- Greek is the default site language.
- Multi-language switcher is implemented through Google Cloud Translation Basic REST API.
- Generated clean logo placeholder is in `public/assets/generated/`.
- Publicly sourced Crema/Wolt/SE MENY assets are stored locally with source notes.

## Verification Rhythm

Before each meaningful commit:

```bash
npm run build
npm run lint
npm run test:e2e
```

For visual changes, also capture Playwright screenshots on desktop and mobile and inspect for:

- horizontal overflow,
- clipped text,
- unreadable controls,
- broken image framing,
- accidental generic/vibe-coded patterns.

## Production Hardening

- Replace public/scraped candidate images with owner-approved originals when available.
- Replace generated logo with official vector logo if the owner provides one.
- Restrict `VITE_GOOGLE_TRANSLATE_API_KEY` by HTTP referrer and API scope in Google Cloud Console.
- Consider a serverless translation proxy before public launch so the Google key is not exposed in browser code.
- Add deployment target after hosting decision: Vercel, Netlify, Cloudflare Pages or owner server.
- Add real business schema markup after final phone/address/opening hours are confirmed.

## Design Backlog

- Improve Greek editorial headline variants and test against desktop/mobile screenshots.
- Add richer menu/product storytelling sections beyond the first homepage.
- Add a “best sellers” area with verified product names/prices if public delivery menus are stable enough.
- Add location section with real map embed or static stylized map after performance/privacy decision.
- Add microinteractions for language switcher, product gallery hover and delivery CTA.
- Research 5-10 more premium cafe/dessert/late-night ordering sites and record patterns before the next visual expansion.
