# Color Palette Generator

Create beautiful, accessible color palettes for websites, brands, apps, and creative projects in seconds.

This is a production-ready **Next.js (App Router) + TypeScript + Tailwind CSS** app. Palette generation, contrast checks, exports, and favorites all run in the browser. There is no account, database, or external palette API.

## Features

- Instant 5-color palettes with harmony modes: Random, Monochromatic, Analogous, Complementary, Triadic, Tetradic, Pastel, Vibrant, Dark
- Optional seed color via HEX (with or without `#`, including 3-digit HEX) and a native color picker
- Lock/unlock swatches so regenerate keeps the colors you like
- Copy HEX, RGB, and HSL with confirmation
- Contrast guidance: best text color, ratios vs black and white, and labels (`Good for text` / `Use carefully` / `Decorative only`)
- Export CSS variables, Tailwind config, JSON, and an SVG swatch strip
- Save up to 24 palettes in `localStorage` (deduped)
- Shareable URLs: `/?palette=264653,2A9D8F,E9C46A,F4A261,E76F51`
- SEO content, FAQ, JSON-LD, privacy and terms pages, robots, and sitemap

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run build
npm start
```

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- React client components for the generator; static SEO content still renders without interaction

## Project structure

```
app/            Pages, layout, robots, sitemap
components/     Generator UI, SEO, header/footer
lib/            Color math, palettes, exports, storage, SEO
public/         Icon and Open Graph image
```

## Privacy

Saved palettes stay on this device. Share links put colors in the query string. See `/privacy` and `/terms`.

## License

MIT
