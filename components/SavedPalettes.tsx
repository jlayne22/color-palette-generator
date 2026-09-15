"use client";

import { SavedPalette } from "@/lib/storage";

type SavedPalettesProps = {
  palettes: SavedPalette[];
  storageAvailable: boolean;
  onLoad: (colors: string[]) => void;
  onDelete: (id: string) => void;
};

export function SavedPalettes({
  palettes,
  storageAvailable,
  onLoad,
  onDelete,
}: SavedPalettesProps) {
  return (
    <section
      id="saved"
      aria-labelledby="saved-heading"
    >
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.06),0_8px_24px_rgba(16,24,40,0.04)] sm:p-8">
        <h2 id="saved-heading" className="text-2xl font-semibold tracking-tight text-slate-900">
          Saved palettes
        </h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          Favorites stay in this browser so you can reopen a palette without creating an account.
        </p>

        {storageAvailable === false ? (
          <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">
            Saving is unavailable in this browser. Palettes cannot be stored on this device.
          </p>
        ) : null}

        {storageAvailable !== false && palettes.length === 0 ? (
          <p className="mt-6 text-sm text-slate-500">
            No saved palettes yet. Generate a palette you like, then choose Save palette.
          </p>
        ) : null}

        {palettes.length > 0 ? (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {palettes.map((palette) => (
              <li
                key={palette.id}
                className="rounded-2xl border border-slate-200 p-3"
              >
                <div className="flex overflow-hidden rounded-xl">
                  {palette.colors.map((color, index) => (
                    <span
                      key={`${palette.id}-${index}`}
                      className="h-16 min-w-0 flex-1"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-xs text-slate-500">
                    {new Date(palette.createdAt).toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn-secondary h-11 px-4 text-sm"
                      onClick={() => onLoad(palette.colors)}
                    >
                      Load
                    </button>
                    <button
                      type="button"
                      className="btn-secondary h-11 px-4 text-sm text-rose-700 hover:border-rose-200 hover:bg-rose-50"
                      onClick={() => onDelete(palette.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
