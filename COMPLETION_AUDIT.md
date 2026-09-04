# Completion Audit — 2026-09-04

## Objective

Publish the requested Crema menu/brand refresh, then remove the sources of scroll jank and publish a second performance commit.

## Evidence

- **Content checkpoint — Pass:** commit `e9c1ee8` was pushed to `origin/main` before performance work began.
- **Requested content — Pass:** automated checks cover Dimello, oat bars, Arabic pita, Club Sandwich XL, Provio and the prominent `Since 2009` hero mark, plus the absence of Illy and puff-pastry terms.
- **Heritage mark interaction — Pass:** the `Since 2009` mark is positioned in the open right side of the hero and shares the existing coalesced scroll frame. Browser measurements recorded opacity `1 → 0.5 → 0 → 1` at the top, midpoint, one viewport down and after returning to the top; desktop placement had no header/headline overlap, mobile had no header/eyebrow overlap, and reduced-motion keeps a static mark that scrolls away naturally.
- **Authentic product photography — Pass:** deployed menu cards are compact derivatives of the recorded e-food/Wolt/vendor sources in `public/assets/sourced/SOURCES.md`; the owner-selected rotating-crepe hero is restored and disclosed separately.
- **Runtime performance — Pass:** the Lenis/GSAP loop, 120-frame canvas loader, custom-cursor RAF, animated marquee, remote font request and startup Google Translate request remain removed or deferred. The rotating-crepe timeline follows scroll in both directions through one passive listener with requestAnimationFrame coalescing; entrance effects use compositor-friendly CSS and a one-shot IntersectionObserver.
- **Payload — Pass:** after restoring a seek-optimized animation and keeping a separate authentic Dimello image, public assets remain about 91.3% smaller than the original 15,413,386-byte bundle; production JavaScript remains about 215 kB instead of 352.42 kB.
- **Quality gates — Pass:** `npm run lint`, `npm run build` and 14 Playwright checks pass across desktop Chromium and mobile Safari profiles.
- **Browser QA — Pass:** smoke checks found zero broken images, horizontal overflow, console errors, page errors or hero-frame requests. The paused video mapped 0s → 2.49s → 4.98s while scrolling down, returned to 1.245s when scrolling up, and drifted 0s while idle. Reduced-motion kept it at 0s; measured resource transfer was about 1.40 MB locally.

The performance commit containing this audit is ready for the final `origin/main` push verification.
