# Crema menu refresh — approved Design Map

- **Status:** Approved by owner on 2026-09-04
- **Mode:** Production extension
- **Scope:** Homepage content, deployed image assets, metadata, provenance notes, and regression checks.
- **Exclusions:** No checkout or menu-management UI; ordering continues on e-food, BOX and Wolt.

## Purpose and success criteria

The homepage must truthfully present Crema's current delivery range without Illy or puff-pastry imagery. Visitors should immediately find Dimello coffee, oat bars, Arabic wraps, Club Sandwich XL and Provio ice cream, then continue to an external ordering service.

The hero also promotes the owner-provided heritage claim `Since 2009` as a prominent right-side mark that fades out while scrolling down and returns while scrolling up.

Success means all five requested offers are visible on desktop and mobile, the surrounding product sections use distinct authentic menu photographs rather than repeating that same set, no visible or deployed Illy/puff-pastry asset remains, product copy agrees with the live menus checked on 2026-09-04, and the order links continue to work.

## Users, journeys and risk

- **Primary user:** Greek, mobile-first local customer deciding what to order.
- **Critical journey:** Scan the homepage, recognise an appealing current product, open the order dropdown and continue through e-food, BOX or Wolt.
- **Risk:** Low. Incorrect product/brand claims are the material harm; copy and assets must have recorded sources.
- **Support:** Current Chrome desktop and iPhone 15 Playwright matrix; Greek default, existing language switcher, keyboard/pointer/touch, reduced-motion equivalent, WCAG 2.2 AA baseline.

## Content model and information architecture

- **Coffee:** Dimello visual identity replaces Illy.
- **Bars:** `Energy balls` category, led by the handmade strawberry oat bar from e-food.
- **Arabic wraps:** Arabic pita with emmental, turkey, tomato and mayonnaise.
- **Club:** Club Sandwich XL turkey with gouda, smoked bacon, tomato, lettuce, mayonnaise and crisps.
- **Ice cream:** Authentic branded Provio Amarena cup plus the official Provio logo, labelled as Provio ice cream.
- **Source of truth:** Crema menus on e-food, Wolt and BOX; official Dimello and Provio assets. Prices are shown only where verified on the checked menu.
- **Photo policy:** Food must be shown only with authentic menu/vendor photography. No AI-generated or composited food imagery is allowed.
- **Photo variety:** Each of the 16 product photographs used across recommendations, expanded-menu cards, Provio and gallery appears once; no food image repeats between those sections.
- **Ordering disclosure:** One hero `Παραγγελία` control reveals e-food, BOX and Wolt links; it closes on selection, outside press or Escape and returns focus after keyboard dismissal.

## Visual and expression direction

Preserve the established Crema charcoal, cream, green and orange palette, handwritten logo energy, high-contrast editorial type and photo-led cards. Use the 1440×810 owner-selected crepe photograph as the only hero media: scrolling toward the third main, black signature section progressively zooms into the crepe and adds a restrained blur; while that section enters, the image zooms back out and becomes sharp again. Lightweight alpha interpolation smooths the transform and stops fully at rest.

Selected expression: `Balanced`; the selected amplifiers are X02 signature imagery, the lightweight scroll-linked hero and one-time entrance/reveal transitions. Third-party smooth scrolling, continuous animation loops, custom-cursor and marquee animation remain excluded to protect runtime performance.

## Trigger register

- **C07 / D08 / O08:** Active for product images and the scroll-reactive hero photograph. **C08:** `N/A-D`; the hero no longer contains audio, video or autoplay media.
- **M01:** `N/A-D`; this homepage links to external ordering and does not collect a cart, price commitment or payment.
- **M02–M12, C09, D07, D09–D11:** `N/A-D` for this static marketing release; reassess if local ordering, live data, personalization or social features are added.

## Delivery and evidence plan

- Store image origin and generation prompts in `public/assets/sourced/SOURCES.md`.
- Preserve accessible image alternatives and use lazy loading for non-hero images.
- Serve compact AVIF/WebP assets, defer translation until requested, and render below-fold sections on demand.
- Update tests to assert required labels and absence of pastry/Illy copy.
- Verify with `npm run lint`, `npm run build`, Playwright desktop/mobile, and visual review for crop, overflow, contrast and reduced motion.
- Definition of done: all required brand/category checks pass; no open P0/P1 issue; no unsupported price/brand claim; all changed product assets have provenance.
