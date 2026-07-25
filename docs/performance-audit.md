# Crema Website Performance Audit

## Objective

Remove visible browser stutter while preserving the existing hero sequence, content, layout, language selector, and responsive behavior.

## Benchmark

Production preview in desktop Chromium at 1440 × 1100. The benchmark performs a four-second full-page scroll and records animation frames, frame gaps, long tasks, network requests, and Chrome performance metrics.

| Metric | Before | After |
| --- | ---: | ---: |
| Average FPS | 19.4 | 53.5 median across 3 runs |
| p95 frame gap | 83.4 ms | 33.3 ms |
| Long tasks during final repeated scroll benchmark | — | 0 |
| Hero requests while idle | 120 eventually preloaded | 4 |
| Decoded hero frames retained by application | Up to 120 | Maximum 18 |
| Client JavaScript | 350.85 kB | 219.72 kB |
| Client JavaScript, gzip | 118.56 kB | 69.88 kB |

The first like-for-like post-change run, including navigation and scroll, reduced observed long tasks from 33 to 2. The final three-run scroll-only benchmark recorded no long tasks.

## Implemented

- Replaced the always-running Lenis and GSAP loops with native passive scroll handling and one on-demand animation frame.
- Reworked the hero sequence into a bounded, direction-aware loading queue with three concurrent decodes and an 18-frame cache.
- Capped canvas pixel density at 1.25 to avoid oversized backing buffers on high-DPI displays.
- Made the custom cursor event-driven so it stops requesting frames after settling.
- Kept mobile and coarse-pointer devices on the static hero poster.
- Deferred Google Translate until a non-Greek language is selected.
- Removed the full-screen hero filter and the fixed-header backdrop filter.
- Added async/lazy image decoding, a smaller logo asset, font preconnects, and a hero poster preload.
- Removed the unused `gsap` and `lenis` production dependencies.

## Verification

- `npm run build`
- `npm run lint`
- `npm run test:e2e`
- `npm audit --omit=dev`
- Desktop Chromium visual smoke check

The Playwright suite includes a regression check that the idle homepage does not eagerly fetch the hero sequence or load Google Translate.
