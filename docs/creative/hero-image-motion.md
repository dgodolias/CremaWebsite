# Crema Gazi Hero Image Motion

## Asset

- Image: `public/assets/sourced/crema-scroll-cover.avif`
- Resolution: 1440×810

## Scroll treatment

The hero uses one fixed, high-resolution crepe photograph. Native scrolling progressively increases its scale from `1.025` to `1.18` and its blur from `0px` to `4.5px`. The effect peaks when the third main, black signature section begins entering the viewport, then reverses until the image is sharp and at its base scale when that section reaches the top.

One passive scroll listener updates a target value. A bounded `requestAnimationFrame` loop approaches that target with time-based alpha interpolation, remains consistent when the frame rate varies and stops when settled. No frame sequence, video decoder, smooth-scroll library or continuous idle animation is used. Under `prefers-reduced-motion`, the photograph remains static and sharp.
