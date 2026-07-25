# Unlumen UI evaluation — Crema Melt

Evaluation date: 25 July 2026

## What was tested

The trial uses five real components from the official Unlumen registry:

- `PixelLiquidBg` for the fluid hero surface
- `TextReveal` for editorial headings
- `MagneticButton` for primary conversion actions
- `HoverExpand` for the product categories
- `HorizontalDepthFade` for the cinematic gallery

The components were integrated into a full “Crema Melt / After Dark” rebrand,
not displayed as isolated demos.

## Measured cost

| Build | CSS gzip | Initial JS gzip | Deferred JS gzip |
| --- | ---: | ---: | ---: |
| Original Crema | 7.26 kB | 69.88 kB | — |
| Unlumen trial | 10.53 kB | 123.14 kB | Pixel Liquid 135.07 kB; gallery 45.94 kB |

Before hardening, all Unlumen code landed in one 303.23 kB gzip JavaScript
bundle. The final implementation splits both expensive effects. The GSAP
gallery is requested only when the visitor approaches it. Mobile, coarse
pointer and reduced-motion users receive branded static/scroll-snap
presentations and do not request either renderer chunk.

## Component verdict

| Component | Verdict | Conditions |
| --- | --- | --- |
| Text Reveal | Keep | Plain-text reduced-motion fallback and accessible text are required. |
| Magnetic Button | Keep, selectively | Use only on high-value actions; preserve semantic anchor/button output. |
| Hover Expand | Keep | Needs keyboard focus, click/touch disclosure and a compact mobile alternative. |
| Horizontal Depth Fade | Optional showcase | Defer GSAP until near the viewport; never pin the mobile experience. |
| Pixel Liquid | Experimental only | Visually distinctive, but too heavy for a default skill recipe. Keep it opt-in and split the renderer. |

## Production hardening applied

- Semantic anchors and buttons with safe external-link `rel` behavior
- Keyboard, focus, click and coarse-pointer interaction for Hover Expand
- Reduced-motion fallbacks for every animated component
- Static mobile Pixel Liquid surface with no WebGL initialization
- WebGL failure fallback and offscreen render-loop pausing
- Static mobile gallery with horizontal scroll snap
- Deferred GSAP gallery loading near the viewport
- Responsive layout, visible focus states and no horizontal overflow

## Recommendation for the shared web-design skill

Unlumen is useful as a visual-pattern reference, but it should not become a
blanket dependency or a default “make it impressive” step. Add a decision
reference that maps design intent to a small component shortlist and always
requires an accessibility, input-method and performance gate.

Do not copy the component source into the shared skill. The
[hosted license](https://unlumen-ui-docs.vercel.app/docs/license) permits use
and modification in projects but restricts redistribution as a standalone
component library, while the public repository has used MIT language. Until
that discrepancy is clarified, the safest model is per-project installation
from the [official registry](https://ui.unlumen.com/components), followed by
local hardening.

Reference:
[installation documentation](https://unlumen-ui-docs.vercel.app/docs/installation).
