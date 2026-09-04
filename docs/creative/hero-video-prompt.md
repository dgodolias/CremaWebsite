# Crema Gazi Rotating-Crepe Hero

The owner-selected rotating-crepe hero is active again using:

- Poster: `public/assets/sourced/crema-scroll-cover.avif`
- Video: `public/assets/generated/crema-hero-crepe.mp4`

The 10-second source animation was restored from project history and re-encoded as a 960×540 H.264 MP4 with frequent keyframes for responsive forward/reverse seeking. The video is paused and its `currentTime` follows scroll position through a passive listener coalesced to one `requestAnimationFrame`. Under `prefers-reduced-motion`, only the poster is shown.

The former 120-frame WebP sequence, canvas renderer and third-party scroll runtime remain retired. This restores bidirectional scroll-scrubbing with one compact video and no continuous animation loop.
