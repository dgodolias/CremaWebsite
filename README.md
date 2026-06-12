# Crema Gazi Website

Premium React/TypeScript/Tailwind website for Crema Gazi, a 24hr delivery coffee, crepe, waffle and pastry shop in Gazi, Athens.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- GSAP + ScrollTrigger
- Lenis smooth scrolling
- Playwright visual/behavior checks

## Commands

```bash
npm run dev
npm run build
npm run lint
npm run test:e2e
```

## Translation

The site is Greek by default. Live language switching uses Google Cloud Translation Basic when this env var is set:

```bash
VITE_GOOGLE_TRANSLATE_API_KEY=your_key_here
```

For a public frontend key, restrict the key in Google Cloud Console by HTTP referrer and enable only Cloud Translation API. Without the key, Greek remains the stable fallback.

## Project Notes

- Research log: `docs/research/crema-gazi-research.md`
- Sourced assets: `public/assets/sourced/`
- GitHub remote: `https://github.com/dgodolias/CremaWebsite`
