# Crema motion-lab completion audit

Verified 2026-07-25 against the `motion-lab` worktree based on
`762458cd70241e32135d8bd99c9899ab13a879df`.

## Objective and verdict

The objective was to continue the Crema motion/design lab with Reddit as the
research base, expand to primary and official sources, study the
`thewatch.60fps.fr` product-story pattern, evaluate candidate systems for
popularity, licensing, accessibility, performance, and cost, preserve the
result as a reusable web-design reference, and build and verify a materially
larger `/signal` experiment.

**Verdict: pass for the requested local research and implementation scope.**
There are no missing items inside that scope. The worktree is intentionally not
committed, pushed, deployed, or represented as commercially cleared for the
legacy homepage.

## Completion evidence

### Research and reusable reference

- Reddit is the explicit evidence base. The retained snapshot records dates,
  authorship/deletion state, promotional relationship, scores, comments,
  upvote ratios, comment evidence, and repeat-signal caveats.
- Compatibility, licensing, pricing boundaries, and package facts were checked
  against official documentation, repositories, package manifests, and license
  files rather than inferred from Reddit votes.
- The canonical reference is
  `C:/Users/demosgod/.agents/skills/web-design/references/motion-systems/REFERENCE.md`;
  the `.codex` and `.claude` skill locations resolve to the same canonical
  source.
- `reddit-snapshot-2026-07-25.json` is the machine-readable evidence record.
- The stopping rule was met: two hardening passes added no new motion owner,
  license boundary, release constraint, or materially different failure mode.
  Later sources repeated the established clusters.
- The Watch study retained product-as-interface, semantic chapters, one shared
  progress model, and complete static/reduced fallbacks. It does not copy the
  watch, scene, assets, copy, or choreography.

### `/signal` implementation

- The route now contains a 120-frame editorial product story, four semantic
  chapters, an interactive four-state colorway lab, six-system implementation
  recipe, responsive navigation and CTAs, and explicit static/failure paths.
- Simple UI state uses the native Web Animations API. GSAP/ScrollTrigger owns
  the authored desktop story, Lenis owns only eligible desktop fine-pointer
  pacing, and native scrolling remains the mobile, `saveData`, reduced-motion,
  and runtime-failure path.
- The sequence activates only as the story approaches the viewport. It uses a
  bounded LRU cache, bounded decode concurrency, responsive frame stepping,
  capped DPR, and release/abort cleanup.
- Lottie is a local, lazy desktop enhancement. Mobile, `saveData`, and reduced
  motion use a static SVG and do not request Lottie JavaScript or WASM.
- Continuous pointer, SVG, scroll, and Lottie work pauses or detaches when
  offscreen or when the document is hidden.
- `/signal` has static pre-hydration language, title, description, theme color,
  and canonical metadata plus a generic GitHub Pages SPA fallback.

### Asset and component provenance

- `crema-signal-master-v2.png` was generated without an input/reference image,
  person, logo, packaging, trademark, or copied text.
- The 120 WebP frames are deterministic crops of that master. The prompt,
  dimensions, processing command, sizes, and component/runtime provenance are
  recorded in `docs/research/signal-asset-provenance.md`.
- `/signal` no longer uses the rights-pending Wolt or SE MENY candidates.
- The license-ambiguous adapted floating-path component was removed and
  replaced with the original project-local `SignalPathField`.

## Verification record

| Gate | Result |
|---|---|
| `npm run build` | Pass; static `/signal` metadata and `404.html` produced |
| `npm run lint` | Pass |
| `npm run test:e2e` | Pass: 27 passed, 5 intentional project-specific skips, 0 failed |
| Production visual/runtime QA | Pass on 1440×1000, 834×1112, 390×844, and reduced motion; no overflow or runtime errors |
| Narrow/landscape/reflow | Pass at 320×568, 844×390, and Chromium 200% zoom |
| Keyboard and controls | Pass: ordered primary navigation, visible focus, Enter activation, semantic pressed states |
| Automated accessibility | Pass: zero axe violations in desktop and mobile projects |
| Reduced motion | Pass: static SVG, one fixed story frame, no Lottie/WASM, no moving path/canvas state |
| `saveData` | Pass: native story, frame step 4, cache 10, no Lenis/GSAP/Lottie/WASM |
| Production dependencies | `npm audit --omit=dev`: zero vulnerabilities |
| Skill/reference validation | `quick_validate.py`: valid; Reddit JSON parses |
| Patch hygiene | `git diff --check`: no whitespace errors |

The final throttled production profile used a 390×844 mobile viewport, 4× CPU
throttling, 1.6 Mbps download, and 150 ms latency:

- zero sequence requests and zero sequence bytes before the story approached
  the viewport;
- 27 unique frames and 1,165,244 frame bytes through the measured scroll;
- peak decoded cache 6 of 10 and peak concurrent requests 3 of 3;
- RAF p95 33.3 ms, CLS 0.0458, initial TBT 530 ms, and scroll TBT 264 ms;
- no Lottie/WASM/CDN request and no console or page error.

The current first-party build measurements are:

- mobile/native `/signal`: 71,085 gzip bytes JavaScript and 7,353 gzip bytes
  CSS;
- conditional desktop Lenis/GSAP/ScrollTrigger: 49,612 gzip bytes JavaScript;
- conditional desktop Lottie: 30,518 gzip bytes JavaScript plus
  1,813,460 raw WASM bytes (682,220 bytes with the documented gzip
  calculation);
- 120 WebP frames: 5,252,322 bytes on disk, requested on demand.

## Bounded caveats

- The connected interactive-browser backend was unavailable during the Watch
  study. The teardown therefore uses official studio descriptions, accessible
  page/source evidence, and network descriptions, and does not present the
  studio's 60 fps or 9 MB claims as independently benchmarked.
- The performance profile is a reproducible headless throttled model, not a
  physical-device lab result or a universal 60 fps claim. Startup long-task
  duration varied by tens of milliseconds between identical runs; cumulative
  TBT is retained as the stricter startup budget.
- The local desktop Lottie WASM is intentionally material in size. It is
  isolated behind viewport, pointer, reduced-motion, and data-saver gates and
  has a complete static fallback.
- The first-party gzip totals exclude the Google Fonts stylesheet and font
  responses.
- A full development-dependency audit reports the existing moderate
  `@modelcontextprotocol/sdk` → `@hono/node-server` Windows path-traversal
  advisory. The production dependency audit is clean; npm offers only a
  breaking SDK downgrade, so no force fix was applied.
- Rights for legacy homepage Wolt/SE MENY/Instagram candidates remain pending.
  This does not affect `/signal`, but it prevents describing the whole site as
  commercially asset-cleared.
- Commit, push, deployment, owner asset approval, and physical-device testing
  remain explicit release actions outside this local goal.
