# Sourced Asset Notes

These files are public candidates gathered for the first website prototype. Before final production launch, confirm asset rights with the owner or replace any uncertain images with owner-supplied files.

- `crema-instagram-profile.jpg`: Instagram OpenGraph profile image from `https://www.instagram.com/crema_gazi/`.
- `crema-cover.jpg`: SE MENY listing cover from `https://semeny.no/gr/sted/crema`.
- `crema-brand-large.jpg`: SE MENY listing image from `https://semeny.no/gr/sted/crema`.
- `crema-*.jpg`: Wolt CDN product/menu images discovered from `https://wolt.com/en/grc/athens/restaurant/crema` and mirrored by SE MENY.
- `dimello-coffee.jpg`: Dimello lifestyle photograph from Kafea Terra, `https://kafeaterra.gr/wp-content/uploads/Brand_Dimello-Featured_Landscape-3x2.jpg`.
- `dimello-logo-reference.png`: Dimello logo reference from Kafea Terra, `https://kafeaterra.gr/wp-content/uploads/Brand_Dimello-Logo_Square.png`.
- `crema-scroll-cover.avif`, `public/assets/generated/hero-sequence/` and `public/assets/generated/crema-hero-scroll.mp4`: deterministic FFmpeg derivatives of `dimello-coffee.jpg`; no synthetic food was introduced.
- `crema-oat-bar-strawberry.jpg`: strawberry oat bar menu image from e-food, `https://cdn.e-food.gr/cdn-cgi/image/h=800,fit=cover,f=auto/global_assets/vertical:food:mpara-brwmis-phraoula?c=1773679255`.
- `crema-club-xl-turkey.jpg`: Club Sandwich XL menu image from e-food, `https://cdn.e-food.gr/cdn-cgi/image/h=800,fit=cover,f=auto/restaurants/9133656/menu_item/000000000430?c=1784033782`.
- `crema-club-xl-wolt.jpg`: Club Sandwich XL menu image from Wolt, `https://imageproxy.wolt.com/menu/menu-images/601d640fa9eedbe434d53a3e/50f4e768-69f5-11eb-8f27-22c864d55396____9_.jpeg`.
- `crema-arabic-wrap-wolt.jpg`: Arabic pita menu image from Wolt, `https://imageproxy.wolt.com/menu/menu-images/601d640fa9eedbe434d53a3e/cda4b24e-49ca-11ef-a2b2-cea210988a4a_15zpe3mnf89ql_xegrm1uiqnyc27idddt.jpg`.
- `crema-ice-cream-wolt.jpg`: Crema ice-cream menu image from Wolt, `https://imageproxy.wolt.com/menu/menu-images/601d640fa9eedbe434d53a3e/34d4444c-69f6-11eb-a23c-bafe5fdbe2ba____28_.jpeg`.
- `crema-coffee-wolt.jpg`: Crema coffee menu image from Wolt, `https://imageproxy.wolt.com/menu/menu-images/601d640fa9eedbe434d53a3e/f3430af4-69f5-11eb-b7d6-ca4edca76b3d____21_.jpeg`.
- `provio-amarena-wolt.jpg`: authentic branded Provio ice-cream pack image served by Wolt, `https://imageproxy.wolt.com/menu/menu-images/shared/28e47ccc-4851-11f0-a3d3-56821e4d896b_5.jpg`.
- `provio-vanilla-madagascar.png`: authentic branded Provio ice-cream pack image from Coffee Island, `https://www.coffeeisland.gr/assets/img/product/PagotoapoprobeiogalaBaniliaMadagaskaris.png`.
- `provio-logo-reference.png` and `provio-cookies-cream-cup.jpg`: Provio reference assets from `https://provio.gr/`.

Menu content was checked on 2026-09-04 against:

- `https://www.e-food.gr/delivery/menu/crema`
- `https://wolt.com/el/grc/athens/restaurant/crema`
- `https://box.gr/delivery/gkazi/crema-gkazi`

No AI-generated or composited food photography is shipped in this refresh.

Legacy public files that contained retired third-party branding or removed menu-category visuals were overwritten in place with the authentic assets above so stale deployments cannot continue serving them.

Generated assets live in `public/assets/generated/`.

- `crema-logo-transparent.png`: AI-generated clean Crema-inspired logo produced with the built-in image generator, then chroma-key background removed locally.
- `crema-logo-transparent-512.png`: resized web version used in the header.
- `crema-logo-trimmed.png`: transparent logo cropped to visible content for header/story placement.
