import { isValidHex, normalizeHex } from "@/lib/color";
import { palettesMatch } from "@/lib/palette";

export const STORAGE_KEY = "color-palette-generator:saved";
export const MAX_SAVED_PALETTES = 24;

export type SavedPalette = {
  id: string;
  colors: string[];
  createdAt: string;
};

export type SavePaletteResult = {
  status: "saved" | "duplicate" | "unavailable";
  palettes: SavedPalette[];
};

export function getSavedPalettes(): SavedPalette[] {
  if (!isLocalStorageAvailable()) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(isSavedPalette)
      .map((palette) => ({
        ...palette,
        colors: palette.colors.map((color) => normalizeHex(color)),
      }))
      .slice(0, MAX_SAVED_PALETTES);
  } catch {
    return [];
  }
}

export function savePalette(colors: string[]): SavePaletteResult {
  if (!isLocalStorageAvailable()) {
    return { status: "unavailable", palettes: [] };
  }

  const normalized = colors.map((color) => normalizeHex(color));
  const existing = getSavedPalettes();

  if (existing.some((palette) => palettesMatch(palette.colors, normalized))) {
    return { status: "duplicate", palettes: existing };
  }

  const nextPalette: SavedPalette = {
    id: createId(),
    colors: normalized,
    createdAt: new Date().toISOString(),
  };

  const palettes = [nextPalette, ...existing].slice(0, MAX_SAVED_PALETTES);
  try {
    persist(palettes);
    return { status: "saved", palettes };
  } catch {
    return { status: "unavailable", palettes: existing };
  }
}

export function deleteSavedPalette(id: string): SavedPalette[] {
  if (!isLocalStorageAvailable()) return [];
  const palettes = getSavedPalettes().filter((palette) => palette.id !== id);
  persist(palettes);
  return palettes;
}

export function clearSavedPalettes(): SavedPalette[] {
  if (!isLocalStorageAvailable()) return [];
  persist([]);
  return [];
}

export function isLocalStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const key = "__cpg_storage_test__";
    window.localStorage.setItem(key, "1");
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

const EMPTY_SAVED: SavedPalette[] = [];
const savedListeners = new Set<() => void>();
let cachedRaw: string | null | undefined = undefined;
let cachedPalettes: SavedPalette[] = EMPTY_SAVED;

function persist(palettes: SavedPalette[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes));
  cachedRaw = undefined;
  emitSavedPalettesChange();
}

export function subscribeSavedPalettes(listener: () => void) {
  savedListeners.add(listener);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", listener);
  }
  return () => {
    savedListeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", listener);
    }
  };
}

export function emitSavedPalettesChange() {
  savedListeners.forEach((listener) => listener());
}

export function getSavedPalettesSnapshot(): SavedPalette[] {
  if (typeof window === "undefined") return EMPTY_SAVED;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedPalettes;
  cachedRaw = raw;
  cachedPalettes = getSavedPalettes();
  return cachedPalettes;
}

export function getSavedPalettesServerSnapshot(): SavedPalette[] {
  return EMPTY_SAVED;
}

export function subscribeStorageAvailability(listener: () => void) {
  if (typeof window !== "undefined") {
    window.addEventListener("storage", listener);
  }
  return () => {
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", listener);
    }
  };
}

function isSavedPalette(value: unknown): value is SavedPalette {
  if (!value || typeof value !== "object") return false;
  const candidate = value as SavedPalette;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.createdAt === "string" &&
    Array.isArray(candidate.colors) &&
    candidate.colors.length === 5 &&
    candidate.colors.every((color) => typeof color === "string" && isValidHex(color))
  );
}

function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `palette-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
