"use client";

import { ColorCard } from "@/components/ColorCard";
import { ExportPanel } from "@/components/ExportPanel";
import { SavedPalettes } from "@/components/SavedPalettes";
import { HEX_ERROR_MESSAGE, isValidHex, normalizeHex } from "@/lib/color";
import {
  DEFAULT_PALETTE,
  generatePalette,
  HARMONY_MODES,
  HarmonyMode,
  PALETTE_SIZE,
  parsePaletteParam,
  toPaletteParam,
} from "@/lib/palette";
import {
  deleteSavedPalette,
  getSavedPalettesServerSnapshot,
  getSavedPalettesSnapshot,
  isLocalStorageAvailable,
  savePalette,
  subscribeSavedPalettes,
  subscribeStorageAvailability,
} from "@/lib/storage";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState, useSyncExternalStore } from "react";

export function PaletteFallback() {
  return (
    <div className="mt-8" aria-hidden="true">
      <div className="h-48 animate-pulse rounded-3xl border border-slate-200 bg-white" />
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {DEFAULT_PALETTE.map((color) => (
          <div
            key={color}
            className="h-64 rounded-2xl border border-slate-200"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}

export function PaletteGenerator() {
  const searchParams = useSearchParams();
  const paletteParam = searchParams.get("palette");
  const parsedFromUrl = parsePaletteParam(paletteParam);

  const saved = useSyncExternalStore(
    subscribeSavedPalettes,
    getSavedPalettesSnapshot,
    getSavedPalettesServerSnapshot,
  );
  const storageAvailable = useSyncExternalStore(
    subscribeStorageAvailability,
    isLocalStorageAvailable,
    () => true,
  );

  const [colors, setColors] = useState<string[]>(() => {
    if (parsedFromUrl) return parsedFromUrl;
    if (paletteParam) return generatePalette({ mode: "random" });
    return [...DEFAULT_PALETTE];
  });
  const [locked, setLocked] = useState<boolean[]>(() => Array(PALETTE_SIZE).fill(false));
  const [mode, setMode] = useState<HarmonyMode>("random");
  const [seedDraft, setSeedDraft] = useState(() => parsedFromUrl?.[0] ?? "");
  const [seedError, setSeedError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const allLocked = locked.every(Boolean);
  const seedValue = useMemo(() => {
    if (!seedDraft.trim()) return undefined;
    if (!isValidHex(seedDraft)) return undefined;
    return normalizeHex(seedDraft);
  }, [seedDraft]);

  const syncUrl = useCallback((nextColors: string[]) => {
    const url = new URL(window.location.href);
    url.searchParams.set("palette", toPaletteParam(nextColors));
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);

  function generate() {
    if (allLocked) {
      setStatus("Unlock a color to generate new options.");
      return;
    }

    if (seedDraft.trim() && !isValidHex(seedDraft)) {
      setSeedError(HEX_ERROR_MESSAGE);
      return;
    }

    const next = generatePalette({
      mode,
      seed: seedValue,
      lockedColors: colors.map((color, index) => (locked[index] ? color : null)),
    });
    setColors(next);
    syncUrl(next);
    setStatus(null);
  }

  function handleSave() {
    if (!storageAvailable) {
      setStatus("Saving is unavailable in this browser.");
      return;
    }

    const result = savePalette(colors);
    if (result.status === "duplicate") {
      setStatus("Already saved.");
      return;
    }
    if (result.status === "unavailable") {
      setStatus("Saving is unavailable in this browser.");
      return;
    }
    setStatus("Palette saved.");
  }

  async function copyShareLink() {
    syncUrl(colors);
    try {
      if (!navigator.clipboard?.writeText) {
        setStatus("Copy not available in this browser.");
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      setStatus("Copied!");
    } catch {
      setStatus("Copy not available in this browser.");
    }
  }

  function updateColor(index: number, hex: string) {
    const next = colors.map((color, colorIndex) => (colorIndex === index ? hex : color));
    const nextLocks = locked.map((isLocked, lockIndex) =>
      lockIndex === index ? true : isLocked,
    );
    setColors(next);
    setLocked(nextLocks);
    syncUrl(next);
    setStatus(null);
  }

  return (
    <>
      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.06),0_8px_24px_rgba(16,24,40,0.04)] sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="harmony-mode" className="mb-1.5 block text-sm font-medium text-slate-700">
                Harmony mode
              </label>
              <select
                id="harmony-mode"
                value={mode}
                onChange={(event) => setMode(event.target.value as HarmonyMode)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                {HARMONY_MODES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="seed-hex" className="mb-1.5 block text-sm font-medium text-slate-700">
                Seed color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  aria-label="Seed color picker"
                  value={seedValue ?? "#4F46E5"}
                  onChange={(event) => {
                    const next = normalizeHex(event.target.value);
                    setSeedDraft(next);
                    setSeedError(null);
                  }}
                  className="h-12 w-12 cursor-pointer rounded-xl border border-slate-200 bg-white p-1"
                />
                <input
                  id="seed-hex"
                  value={seedDraft}
                  placeholder="#4F46E5"
                  spellCheck={false}
                  onChange={(event) => {
                    setSeedDraft(event.target.value);
                    setSeedError(null);
                  }}
                  onBlur={() => {
                    if (!seedDraft.trim()) {
                      setSeedError(null);
                      return;
                    }
                    if (!isValidHex(seedDraft)) {
                      setSeedError(HEX_ERROR_MESSAGE);
                    } else {
                      setSeedDraft(normalizeHex(seedDraft));
                      setSeedError(null);
                    }
                  }}
                  className="h-12 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
              </div>
              {seedError ? (
                <p className="mt-2 text-sm text-rose-600" role="alert">
                  {seedError}
                </p>
              ) : (
                <p className="mt-2 text-sm text-slate-500">
                  Optional. Accepts HEX with or without #, including short codes like #FFF.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
            <button type="button" className="btn-primary w-full sm:flex-1" onClick={generate}>
              Generate palette
            </button>
            <button type="button" className="btn-secondary w-full sm:flex-1" onClick={handleSave}>
              Save palette
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            Runs in your browser. No signup required. Saved palettes stay on this device.
          </p>
          <button type="button" className="btn-secondary h-11 px-4 text-sm" onClick={copyShareLink}>
            Copy share link
          </button>
        </div>

        {status ? (
          <p className="mt-3 text-sm font-medium text-slate-700" aria-live="polite">
            {status}
          </p>
        ) : null}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {colors.map((color, index) => (
          <ColorCard
            key={`swatch-${index}`}
            color={color}
            index={index}
            locked={Boolean(locked[index])}
            onToggleLock={() =>
              setLocked((current) =>
                current.map((value, lockIndex) => (lockIndex === index ? !value : value)),
              )
            }
            onColorChange={(hex) => updateColor(index, hex)}
          />
        ))}
      </div>

      <p className="mt-5 text-sm text-slate-500">
        Contrast guidance is a helpful starting point, not a full accessibility audit.
      </p>

      <div className="mt-8 space-y-8">
        <ExportPanel colors={colors} />
        <SavedPalettes
          palettes={saved}
          storageAvailable={storageAvailable}
          onLoad={(nextColors) => {
            setColors(nextColors);
            setLocked(Array(PALETTE_SIZE).fill(false));
            setSeedDraft(nextColors[0] ?? "");
            syncUrl(nextColors);
            setStatus("Palette loaded.");
            document.getElementById("generator")?.scrollIntoView({ behavior: "smooth" });
          }}
          onDelete={(id) => {
            deleteSavedPalette(id);
            setStatus("Palette deleted.");
          }}
        />
      </div>
    </>
  );
}
