export function SeoContent() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6">
      <section
        id="how-to-use"
        className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8"
        aria-labelledby="how-to-use-heading"
      >
        <h2 id="how-to-use-heading" className="text-2xl font-semibold tracking-tight text-slate-900">
          How to use a color palette generator
        </h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-slate-600">
          <li>
            Choose a harmony mode such as complementary or pastel, or keep Random for
            unexpected combinations.
          </li>
          <li>
            Optionally enter a seed HEX color or use the picker so the palette grows from a
            brand or reference color. Short HEX like #FFF works.
          </li>
          <li>
            Select Generate palette. Lock any swatches you want to keep, then generate again
            until the unlocked colors feel right.
          </li>
          <li>
            Copy HEX, RGB, or HSL from a card, or export CSS variables, Tailwind config, JSON,
            or an SVG strip.
          </li>
          <li>
            Save palettes on this device or copy the share link so the colors live in the URL
            as <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">/?palette=...</code>.
          </li>
        </ol>
      </section>

      <section
        className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8"
        aria-labelledby="why-palettes-heading"
      >
        <h2 id="why-palettes-heading" className="text-2xl font-semibold tracking-tight text-slate-900">
          Why palettes matter
        </h2>
        <div className="mt-4 space-y-3 text-slate-600">
          <p>
            A strong palette gives a website, product, or brand a consistent visual language.
            Five colors are enough for backgrounds, surfaces, accents, highlights, and calls
            to action without overwhelming a design system.
          </p>
          <p>
            Harmony modes help you stay intentional: monochromatic palettes feel calm,
            complementary palettes add contrast, and pastel or dark modes set a mood before
            you write a line of CSS.
          </p>
          <p>
            Sharing a palette URL keeps collaboration lightweight. Teammates can open the same
            five colors, inspect contrast, and export tokens without a design-tool account.
          </p>
        </div>
      </section>

      <section
        className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8"
        aria-labelledby="accessible-tips-heading"
      >
        <h2 id="accessible-tips-heading" className="text-2xl font-semibold tracking-tight text-slate-900">
          Tips for accessible colors
        </h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-slate-600">
          <li>
            Prefer pairs labeled Good for text for body copy. Use carefully is closer to large
            text or UI chrome; Decorative only is better for fills, illustrations, and
            non-text graphics.
          </li>
          <li>
            Check both black and white text on each swatch. The best text color is the one
            with the higher contrast ratio.
          </li>
          <li>
            Do not rely on color alone to convey meaning. Pair status colors with icons or
            labels, and test charts with patterns or direct labels.
          </li>
          <li>
            Re-check contrast on real components: buttons, form borders, focus rings, and
            placeholder text often fail even when a swatch looks fine.
          </li>
        </ul>
      </section>
    </div>
  );
}
