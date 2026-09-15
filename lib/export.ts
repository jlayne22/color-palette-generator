import { formatHsl, formatRgb, normalizeHex } from "@/lib/color";

export function paletteToCssVariables(colors: string[]): string {
  const lines = colors.map(
    (color, index) => `  --color-${index + 1}: ${normalizeHex(color)};`,
  );

  return `:root {\n${lines.join("\n")}\n}\n`;
}

export function paletteToTailwindConfig(colors: string[]): string {
  const lines = colors.map(
    (color, index) => `          ${index + 1}: '${normalizeHex(color)}',`,
  );

  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        palette: {
${lines.join("\n")}
        },
      },
    },
  },
};
`;
}

export function paletteToJson(colors: string[]): string {
  const normalized = colors.map((color) => normalizeHex(color));
  return `${JSON.stringify(
    {
      colors: normalized,
      rgb: normalized.map((color) => formatRgb(color)),
      hsl: normalized.map((color) => formatHsl(color)),
    },
    null,
    2,
  )}\n`;
}

export function paletteToSvg(colors: string[]): string {
  const normalized = colors.map((color) => normalizeHex(color));
  const width = 1000;
  const height = 220;
  const swatchWidth = width / normalized.length;

  const rects = normalized
    .map((color, index) => {
      const x = index * swatchWidth;
      return `  <rect x="${x}" y="0" width="${swatchWidth}" height="${height}" fill="${color}" />
  <text x="${x + swatchWidth / 2}" y="${height - 24}" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="18" fill="${pickLabelColor(color)}">${color}</text>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Color palette swatches">
${rects}
</svg>
`;
}

function pickLabelColor(background: string): "#111827" | "#FFFFFF" {
  const hex = background.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 140 ? "#111827" : "#FFFFFF";
}
