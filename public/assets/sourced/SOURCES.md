# Sourced Asset Notes

These files are public candidates gathered for the first website prototype. Before final production launch, confirm asset rights with the owner or replace any uncertain images with owner-supplied files.

- `crema-instagram-profile.jpg`: Instagram OpenGraph profile image from `https://www.instagram.com/crema_gazi/`.
- `crema-cover.jpg`: SE MENY listing cover from `https://semeny.no/gr/sted/crema`.
- `crema-brand-large.jpg`: SE MENY listing image from `https://semeny.no/gr/sted/crema`.
- `crema-*.jpg`: Wolt CDN product/menu images discovered from `https://wolt.com/en/grc/athens/restaurant/crema` and mirrored by SE MENY.
- `crema-scroll-cover.avif`: owner/user-provided cover candidate copied from local Downloads for the scroll-scrub hero poster/video first frame.

Generated assets live in `public/assets/generated/`.

- `crema-logo-transparent.png`: AI-generated clean Crema-inspired logo produced with the built-in image generator, then chroma-key background removed locally.
- `crema-logo-transparent-512.png`: resized web version used in the header.
- `crema-logo-trimmed.png`: transparent logo cropped to visible content for header/story placement.
- `crema-signal-master-v2.png`: original no-reference food still generated for the `/signal` route.
- `signal-sequence-v4/frame-*.webp`: deterministic 120-frame zoom/pan sequence derived from `crema-signal-master-v2.png`.

The `/signal` route uses the new generated sequence instead of the rights-pending
Wolt/SE MENY candidates. Full prompt, processing command, component provenance,
and runtime-license boundaries are recorded in
`docs/research/signal-asset-provenance.md`.
