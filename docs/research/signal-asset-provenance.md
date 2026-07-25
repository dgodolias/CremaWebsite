# Signal asset and component provenance

Verified 2026-07-25 for the `/signal` motion-lab route.

## No-reference generated motion-story still

`public/assets/generated/crema-signal-master-v2.png` was generated in built-in
image-generation mode without an input or reference image. It is a new generic
food still life and contains no copied logo, packaging, text, people, or named
brand asset.

Final prompt:

> Create an original top-down editorial food photograph of one dark espresso
> cup, one folded crepe with chocolate and strawberry, a flaky pastry, berries
> and cacao on a warm near-black stone table. Use a wide 16:9 composition,
> premium natural food photography, moody late-night side light, espresso,
> cream, orange and acid-lime accents, and dark negative space for typography.
> No reference image, people, hands, text, letters, logos, packaging, watermark,
> recognizable trademark, or duplicated objects.

The selected 1672×941 PNG was copied from the built-in generator output to the
project without replacing an existing asset.

## Derived frame sequence

`public/assets/generated/signal-sequence-v4/frame-001.webp` through
`frame-120.webp` are deterministic crops of that generated master. FFmpeg
created a slow centered zoom/pan at 1152×648, WebP quality 52. The set is
5,252,322 bytes; the route loads keyframes and nearby frames on demand and keeps
only a bounded decoded cache.

Reproduction command:

```powershell
ffmpeg -loop 1 -i public/assets/generated/crema-signal-master-v2.png `
  -vf "scale=1268:713:force_original_aspect_ratio=increase,crop=1268:713,zoompan=z='1+0.14*sin(on*PI/119)':x='(iw-iw/zoom)/2+(iw-iw/zoom)*0.10*sin(on*2*PI/119)':y='(ih-ih/zoom)/2+(ih-ih/zoom)*0.08*cos(on*2*PI/119)':d=120:s=1152x648:fps=30" `
  -frames:v 120 -c:v libwebp -quality 52 -compression_level 5 `
  public/assets/generated/signal-sequence-v4/frame-%03d.webp
```

The `/signal` route no longer uses the Wolt or SE MENY image candidates under
`public/assets/sourced/`. Those candidates remain prototype-only elsewhere in
the repository until the owner confirms rights or supplies originals.

## Visual component provenance

- The hero path field in `src/components/SignalPathField.tsx` is a new
  project-local SVG/CSS implementation. It replaced the earlier adapted
  `bundui/floating-paths` experiment because the exact public component listing
  did not expose a component-specific commercial license. The audited listing
  remains at `https://21st.dev/community/components/bundui/floating-paths/default`.
- `public/assets/generated/haikei-crema-waves.svg` was exported from Haikei's
  Layered Waves generator with the project palette. Haikei's pricing/terms were
  checked on 2026-07-25; recheck before a commercial launch.
- `public/assets/generated/crema-signal.json` is the self-authored cup animation
  created through LottieFiles Creator. The route uses
  `@lottiefiles/dotlottie-react` 0.19.12 and
  `@lottiefiles/dotlottie-web` 0.78.2, both under the package MIT license.
  Its WASM is bundled locally; reduced motion never imports the player.
- Lucide icons come from the installed `lucide-react` package.

This record covers the `/signal` experiment, not the unresolved legacy
prototype assets used by the homepage.
