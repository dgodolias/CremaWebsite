# Crema Gazi Research Log

Date: 2026-06-13

## Verified Business Signals

- Name: Crema Gazi / Crema.
- Instagram: `https://www.instagram.com/crema_gazi/`
- Instagram public profile description found in server metadata: `24hr delivery crepes-waffles-coffee-pastry shop. Life is uncertain.Eat dessert first... Persefonis 63 Gazi 210-3467213`.
- Address used across public listings: Persefonis 63, Gazi, Athens.
- Phone: 210 346 7213.
- Ordering/listing sources:
  - Wolt: `https://wolt.com/en/grc/athens/restaurant/crema`
  - efood: `https://www.e-food.gr/delivery/menu/crema`
  - SE MENY mirror/listing: `https://semeny.no/gr/sted/crema`

## Visual Identity Extracted

- Instagram profile image shows:
  - dark charcoal background,
  - white handwritten `Crema` wordmark,
  - green coffee/steam mark,
  - orange `24h Delivery`,
  - white phone/address.
- Working palette:
  - charcoal `#10100e`
  - cream/marble `#fff8ec`
  - delivery orange `#f36a18`
  - crema green `#8ecf4f`
  - espresso brown `#3a1e12`
- Typography decision:
  - `Pacifico` for an approximate handwritten Crema wordmark because official font file is not publicly available.
  - `Manrope` for modern operational text, chosen to avoid the generic Inter/purple vibe-coded pattern.

## Assets Collected

Local candidates are stored under `public/assets/sourced/`.

- `crema-instagram-profile.jpg`: Instagram profile image, used as brand reference/logo candidate.
- Wolt CDN product images: coffee, pastry, dessert shots on marble background.
- `crema-cover.jpg`: SE MENY cover photo, authentic but dark/provio-heavy, not preferred for hero.
- `crema-brand-large.jpg`: SE MENY large image, visually clean but appears generic/stock, not preferred for authenticity.
- `public/assets/generated/crema-logo-transparent.png`: clean AI-generated logo asset inspired by the public Instagram profile mark, used as a polished placeholder until the owner provides official vector artwork.

## Premium Cafe/Restaurant Design Research

Patterns worth borrowing:

- Awwwards Haven Coffee + Kitchen: handwriting animations, random picture compositions, menu anchors, autoscroll galleries, responsive fluid behavior.
- Awwwards CoffeeTech: dark minimal palette, hero object focus, 3D/scroll transitions, warm orange with deep charcoal.
- Awwwards Grab&Go: bold orange single-signal branding, day/night delivery storytelling, map/location section, mouse interactions.
- Awwwards Sonoma Bakery: black/white/brown palette, photo-led storytelling, GSAP/React/Vercel stack.
- Awwwards Assembly Specialty Coffee: sleek/minimal premium coffee product focus, sustainability/education content, GSAP stack signals.
- Awwwards Bernice Bakery: shoppable bakery site with dynamic custom animations; useful reminder that playful motion can still support ordering.
- Awwwards Little Amps Coffee: conversion-optimized coffee site, warm local brand storytelling, cohesive digital system.
- Awwwards Escape Coffee: big background images, parallax, vertical menu and about/footer design; useful for coffee storytelling sections.
- Awwwards Restaurant GEM: warm refined restaurant site with subtle motion and seamless booking flow; relevant for premium hospitality pacing.
- Awwwards Food & Drink and Hotel/Restaurant galleries: category-level benchmark for visual appetite, photography-led sections and hospitality polish.
- GSAP Showcase: validates GSAP as the right motion stack for premium interactive choreography.
- SiteBuilderReport cafe examples: practical commercial patterns: clean navigation, warm color schemes, baked-goods/coffee storytelling and catering/order prompts.

Next research targets:

- Find more late-night dessert/crepe/waffle shops, not only specialty coffee, so Crema does not drift too far into roastery aesthetics.
- Compare delivery-first restaurant landing pages for CTA density, sticky order patterns and mobile-first conversion.
- Record specific motion patterns as implementation tickets: scroll-pinned product stage, hover flavor cards, route/map reveal, language-switch transition.

## Anti "Vibe-Coded Look" Notes

Observed/reported AI-slop tells:

- generic purple/blue gradients,
- Inter-only SaaS typography,
- same card rhythm repeated section after section,
- vague marketing copy that could fit any business,
- decorative floating blobs/orbs unrelated to the brand,
- huge rounded cards inside rounded cards,
- features described instead of embodied through interaction/content.

Project response:

- use Crema-specific verified copy,
- use dark/green/orange from the actual profile image,
- use product photography and marble surface language,
- vary section rhythm: cinematic hero, marquee, asymmetric story block, product rail, gallery, map/location, delivery panel,
- use motion only where it supports premium storefront feel.

## Translation Note

- Current prototype implementation uses a hidden Google Translate Website Translator widget controlled by Crema's custom React language menu, so local development does not need an API key.
- Google Search Central's 2020 Website Translator widget note says the no-key Website Translator widget access is restricted to government, non-profit, and/or non-commercial COVID-response websites, and recommends Cloud Translation API for other websites. For CREMA's commercial production site, keep this as a prototype convenience unless the owner approves the compliance risk.
- Production-safe alternative: move translation calls behind a serverless proxy using Google Cloud Translation, or commit curated static translations for the key languages.
