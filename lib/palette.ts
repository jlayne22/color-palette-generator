import {
  clamp,
  hexToRgb,
  hslToHex,
  isValidHex,
  normalizeHex,
  rgbToHsl,
  wrapHue,
} from "@/lib/color";

export const PALETTE_SIZE = 5;

export const DEFAULT_PALETTE = [
  "#264653",
  "#2A9D8F",
  "#E9C46A",
  "#F4A261",
  "#E76F51",
];

export type HarmonyMode =
  | "random"
  | "monochromatic"
  | "analogous"
  | "complementary"
  | "triadic"
  | "tetradic"
  | "pastel"
  | "vibrant"
  | "dark";

export const HARMONY_MODES: { id: HarmonyMode; label: string }[] = [
  { id: "random", label: "Random" },
  { id: "monochromatic", label: "Monochromatic" },
  { id: "analogous", label: "Analogous" },
  { id: "complementary", label: "Complementary" },
  { id: "triadic", label: "Triadic" },
  { id: "tetradic", label: "Tetradic" },
  { id: "pastel", label: "Pastel" },
  { id: "vibrant", label: "Vibrant" },
  { id: "dark", label: "Dark" },
];

export type PaletteOptions = {
  mode?: HarmonyMode;
  seed?: string;
  lockedColors?: Array<string | null | undefined>;
};

export function generatePalette(options: PaletteOptions = {}): string[] {
  const mode = options.mode ?? "random";
  const seed = resolveSeed(options.seed);

  const generators: Record<HarmonyMode, (nextSeed?: string) => string[]> = {
    random: generateRandomPalette,
    monochromatic: generateMonochromatic,
    analogous: generateAnalogous,
    complementary: generateComplementary,
    triadic: generateTriadic,
    tetradic: generateTetradic,
    pastel: generatePastel,
    vibrant: generateVibrant,
    dark: generateDark,
  };

  let colors = ensureFive(generators[mode](seed));
  if (options.lockedColors) {
    colors = applyLocks(colors, options.lockedColors);
  }

  return colors.map((color) => normalizeHex(color));
}

export function generateRandomPalette(seed?: string): string[] {
  const colors: string[] = [];
  const resolvedSeed = optionalSeed(seed);
  if (resolvedSeed) {
    colors.push(resolvedSeed);
  }

  let attempts = 0;
  while (colors.length < PALETTE_SIZE && attempts < 80) {
    attempts += 1;
    const hue = wrapHue(randomBetween(0, 360));
    const saturation = randomBetween(32, 88);
    const lightness = randomBetween(22, 78);
    const next = hslToHex(hue, saturation, lightness);
    if (colors.some((color) => areNearlyIdentical(color, next))) continue;
    colors.push(next);
  }

  return ensureFive(colors);
}

export function generateMonochromatic(seed?: string): string[] {
  const base = colorToHsl(resolveSeed(seed));
  const lights = [16, 32, 48, 66, 84];
  const colors = lights.map((light, index) => {
    const saturation = clamp(base.s + (index - 2) * 5, 12, 92);
    return hslToHex(base.h, saturation, light);
  });

  return insertSeedAtClosestLightness(colors, optionalSeed(seed));
}

export function generateAnalogous(seed?: string): string[] {
  const base = colorToHsl(resolveSeed(seed));
  const offsets = [-40, -20, 0, 20, 40];
  const colors = offsets.map((offset, index) =>
    hslToHex(
      wrapHue(base.h + offset),
      clamp(base.s + (index - 2) * 4, 28, 90),
      clamp(base.l + (index - 2) * 6, 22, 78),
    ),
  );

  return insertExactSeed(colors, optionalSeed(seed), 2);
}

export function generateComplementary(seed?: string): string[] {
  const base = colorToHsl(resolveSeed(seed));
  const complement = wrapHue(base.h + 180);
  const colors = [
    hslToHex(wrapHue(base.h - 12), clamp(base.s - 6, 28, 90), clamp(base.l + 8, 22, 78)),
    hslToHex(base.h, clamp(base.s, 30, 92), clamp(base.l, 20, 72)),
    hslToHex(wrapHue(base.h + 14), clamp(base.s - 10, 24, 86), clamp(base.l + 16, 28, 82)),
    hslToHex(wrapHue(complement - 12), clamp(base.s + 4, 32, 94), clamp(base.l - 6, 18, 70)),
    hslToHex(complement, clamp(base.s + 8, 36, 96), clamp(100 - base.l, 22, 78)),
  ];

  return insertExactSeed(colors, optionalSeed(seed), 1);
}

export function generateTriadic(seed?: string): string[] {
  const base = colorToHsl(resolveSeed(seed));
  const second = wrapHue(base.h + 120);
  const third = wrapHue(base.h + 240);
  const colors = [
    hslToHex(base.h, clamp(base.s, 34, 92), clamp(base.l, 24, 70)),
    hslToHex(second, clamp(base.s - 8, 30, 90), clamp(base.l + 8, 28, 76)),
    hslToHex(third, clamp(base.s + 4, 32, 94), clamp(base.l - 6, 20, 68)),
    hslToHex(second, clamp(base.s - 18, 22, 80), clamp(base.l + 22, 40, 86)),
    hslToHex(third, clamp(base.s + 10, 36, 96), clamp(base.l + 14, 30, 80)),
  ];

  return insertExactSeed(colors, optionalSeed(seed), 0);
}

export function generateTetradic(seed?: string): string[] {
  const base = colorToHsl(resolveSeed(seed));
  const hues = [0, 90, 180, 270].map((offset) => wrapHue(base.h + offset));
  const colors = [
    hslToHex(hues[0], clamp(base.s, 34, 92), clamp(base.l, 24, 70)),
    hslToHex(hues[1], clamp(base.s - 6, 28, 88), clamp(base.l + 10, 28, 78)),
    hslToHex(hues[2], clamp(base.s + 8, 36, 96), clamp(base.l - 4, 20, 70)),
    hslToHex(hues[3], clamp(base.s - 12, 24, 84), clamp(base.l + 16, 32, 82)),
    hslToHex(hues[0], clamp(base.s - 20, 18, 76), clamp(base.l + 24, 42, 88)),
  ];

  return insertExactSeed(colors, optionalSeed(seed), 0);
}

export function generatePastel(seed?: string): string[] {
  const startHue = colorToHsl(resolveSeed(seed)).h;
  return Array.from({ length: PALETTE_SIZE }, (_, index) =>
    hslToHex(
      wrapHue(startHue + index * 72 + randomBetween(-8, 8)),
      randomBetween(22, 42),
      randomBetween(76, 90),
    ),
  );
}

export function generateVibrant(seed?: string): string[] {
  const startHue = colorToHsl(resolveSeed(seed)).h;
  return Array.from({ length: PALETTE_SIZE }, (_, index) =>
    hslToHex(
      wrapHue(startHue + index * 72 + randomBetween(-6, 6)),
      randomBetween(78, 100),
      randomBetween(46, 58),
    ),
  );
}

export function generateDark(seed?: string): string[] {
  const startHue = colorToHsl(resolveSeed(seed)).h;
  return Array.from({ length: PALETTE_SIZE }, (_, index) =>
    hslToHex(
      wrapHue(startHue + index * 72 + randomBetween(-8, 8)),
      randomBetween(38, 72),
      randomBetween(10, 28),
    ),
  );
}

export function applyLocks(
  generated: string[],
  locked: Array<string | null | undefined>,
): string[] {
  return Array.from({ length: PALETTE_SIZE }, (_, index) => {
    const lockedColor = locked[index];
    if (lockedColor && isValidHex(lockedColor)) {
      return normalizeHex(lockedColor);
    }

    const generatedColor = generated[index];
    if (generatedColor && isValidHex(generatedColor)) {
      return normalizeHex(generatedColor);
    }

    return generateRandomPalette()[0];
  });
}

export function parsePaletteParam(value: string | null | undefined): string[] | null {
  if (!value) return null;

  const parts = value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length !== PALETTE_SIZE) return null;
  if (!parts.every((part) => isValidHex(part))) return null;

  return parts.map((part) => normalizeHex(part));
}

export function toPaletteParam(colors: string[]): string {
  return colors.map((color) => normalizeHex(color).slice(1)).join(",");
}

export function palettesMatch(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((color, index) => {
    try {
      return normalizeHex(color) === normalizeHex(b[index]);
    } catch {
      return false;
    }
  });
}

function ensureFive(colors: string[]): string[] {
  const next = colors
    .filter((color) => isValidHex(color))
    .map((color) => normalizeHex(color))
    .slice(0, PALETTE_SIZE);

  while (next.length < PALETTE_SIZE) {
    const fill = hslToHex(
      randomBetween(0, 360),
      randomBetween(35, 85),
      randomBetween(25, 75),
    );
    if (!next.some((color) => areNearlyIdentical(color, fill))) {
      next.push(fill);
    } else if (next.length < PALETTE_SIZE) {
      next.push(fill);
    }
  }

  return next;
}

function resolveSeed(seed?: string): string {
  const valid = optionalSeed(seed);
  if (valid) return valid;
  return hslToHex(
    randomBetween(0, 360),
    randomBetween(40, 85),
    randomBetween(32, 68),
  );
}

function optionalSeed(seed?: string): string | undefined {
  if (!seed || !isValidHex(seed)) return undefined;
  return normalizeHex(seed);
}

function colorToHsl(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

function insertExactSeed(
  colors: string[],
  seed: string | undefined,
  index: number,
): string[] {
  if (!seed) return ensureFive(colors);
  const next = [...colors];
  next[index] = seed;
  return ensureFive(next);
}

function insertSeedAtClosestLightness(
  colors: string[],
  seed: string | undefined,
): string[] {
  if (!seed) return ensureFive(colors);
  const seedLight = colorToHsl(seed).l;
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  colors.forEach((color, index) => {
    const distance = Math.abs(colorToHsl(color).l - seedLight);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  const next = [...colors];
  next[closestIndex] = seed;
  return ensureFive(next);
}

function areNearlyIdentical(a: string, b: string): boolean {
  const aHsl = colorToHsl(a);
  const bHsl = colorToHsl(b);
  const hueDelta = Math.min(
    Math.abs(aHsl.h - bHsl.h),
    360 - Math.abs(aHsl.h - bHsl.h),
  );
  const saturationDelta = Math.abs(aHsl.s - bHsl.s);
  const lightnessDelta = Math.abs(aHsl.l - bHsl.l);

  return hueDelta < 14 && saturationDelta < 14 && lightnessDelta < 10;
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}
