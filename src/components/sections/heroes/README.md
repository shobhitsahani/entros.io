# Hero Experiments

Saved hero implementations for easy swapping. Each file is a complete, working hero section that can be copied into `../hero-section.tsx` to activate.

## How to swap

1. Copy the desired hero file content into `src/components/sections/hero-section.tsx`
2. Ensure any required UI component (e.g. `ethereal-shadow.tsx`) exists in `src/components/ui/`
3. Run `npm run dev` to preview

## Saved variants

| File | Background | Status | Notes |
|------|-----------|--------|-------|
| `hero-ethereal-shadows.tsx` | SVG turbulence filter with hue rotation | Approved | Performant (~15fps throttle), extends 40% below hero, theme-adaptive color prop |
| `hero-cascade-glass.tsx` | CSS cascade pattern + liquid glass panel | Approved | Pure CSS animation (zero JS per frame), glass panel with SVG distortion + specular highlights, theme-adaptive |
