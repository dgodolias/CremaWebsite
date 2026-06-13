# Crema Gazi Hero Video Prompt

Use `public/assets/sourced/crema-scroll-cover.avif` as the exact first frame/reference image.

## Recommended Output

- Duration: 6-8 seconds.
- Aspect ratio: 16:9.
- Resolution: 1920x1080 or higher.
- Frame rate: 24 or 30 fps.
- Motion style: continuous, no cuts, scrub-safe, smooth forward and reverse.
- Export target for the site: `public/assets/generated/crema-hero-scroll.mp4`.
- Canvas sequence target for smooth scroll: `public/assets/generated/hero-sequence/frame-001.webp` through `frame-120.webp`.

## Prompt

Create a premium cinematic overhead food video using the provided image as the exact first frame. Keep the same marble table, same plates, same food placement, same Crema Gazi dessert cafe mood. The camera performs a very slow elegant top-down drift and subtle parallax, as if moving a few centimeters over the table. Add gentle realistic motion only: glossy chocolate slowly catches light, strawberries look fresh and vivid, croissant flakes have tiny natural texture shimmer, coffee foam has a faint warm swirl, soft daylight moves across the marble surface. The video should feel like a luxury dessert cafe hero background, modern Greek urban cafe, appetizing but clean, high-end delivery brand, dark charcoal/green/orange brand compatibility. No hard cuts, no scene changes, no new objects, no people, no hands. The final frame should still look very close to the first frame so the clip works when scrubbed forward and backward by page scroll.

## Negative Prompt

Do not add hands, people, forks, knives, logos, text, steam clouds, extra plates, melting food deformation, changing food shapes, camera shake, fast zoom, cinematic black bars, artificial blur, oversaturated colors, cartoon look, plastic texture, surreal motion, liquid spills, crumbs flying, object warping, plate morphing, or any new food items. Do not crop out the central crepe. Do not change the marble background.

## Short Version

Exact first-frame image-to-video. Premium overhead dessert cafe table, very slow top-down camera drift, tiny realistic chocolate/coffee/light movement, no cuts, no new objects, no hands, no text, no food morphing, scrub-safe forward and reverse, final frame close to first frame.

## Implementation Notes

- The live hero now uses a canvas image sequence for smoother scroll scrubbing. The MP4 stays as the source export and fallback asset.
- Scroll scrubbing draws a numbered WebP frame to `<canvas>` instead of constantly seeking `HTMLMediaElement.currentTime`.
- Use an all-intra/keyframe-friendly MP4 before extracting frames, not only a normal streaming MP4.
- Current FFmpeg command used for `public/assets/generated/crema-hero-scroll.mp4`:

```bash
ffmpeg -y -i public/assets/generated/crema-hero-scroll.mp4 -an -c:v libx264 -preset veryfast -crf 23 -g 1 -keyint_min 1 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart public/assets/generated/crema-hero-scroll-scrub.mp4
```

- Current FFmpeg command used for the 120-frame canvas sequence:

```bash
ffmpeg -y -i public/assets/generated/crema-hero-scroll.mp4 -vf "fps=12,scale=1440:-2" -c:v libwebp -quality 72 -compression_level 4 public/assets/generated/hero-sequence/frame-%03d.webp
```

- Keep the poster image visible until the canvas has drawn the first decoded frame.
- After the first canvas frame is decoded, swap to the canvas without opacity transitions and hide the poster to avoid reload/first-scroll flicker.
- Preload the first 12 frames immediately and only draw interpolated frames when both adjacent frames are decoded.
- Size the canvas backing store from the untransformed fixed media container (`clientWidth` / `clientHeight`), not from `getBoundingClientRect()` on a scaled canvas, to avoid right-edge sliver artifacts.
- The canvas preloads nearby frames first, then progressively warms the rest of the sequence in small batches.
- The canvas renderer crossfades between adjacent decoded frames using decimal scroll progress. This keeps scroll motion smoother without increasing the current 120-frame payload.
- The same fixed canvas layer now continues through the dark sections instead of creating new media elements:
  - Hero: frames 0-45, image starts clear and fades toward black.
  - Signatures: frames 45-84, starts black, reveals the timeline, then fades down for the next transition.
  - Delivery: frames 84-119, starts black, reveals the timeline, then fades down near the end.
