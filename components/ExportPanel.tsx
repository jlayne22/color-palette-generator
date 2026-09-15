"use client";

import {
  paletteToCssVariables,
  paletteToJson,
  paletteToSvg,
  paletteToTailwindConfig,
} from "@/lib/export";
import { useMemo, useState } from "react";

type ExportPanelProps = {
  colors: string[];
};

type ExportKey = "css" | "tailwind" | "json" | "svg";

const EXPORTS: { key: ExportKey; label: string }[] = [
  { key: "css", label: "CSS variables" },
  { key: "tailwind", label: "Tailwind config" },
  { key: "json", label: "JSON" },
  { key: "svg", label: "SVG swatch" },
];

export function ExportPanel({ colors }: ExportPanelProps) {
  const [active, setActive] = useState<ExportKey>("css");
  const [message, setMessage] = useState<string | null>(null);

  const snippets = useMemo(
    () => ({
      css: paletteToCssVariables(colors),
      tailwind: paletteToTailwindConfig(colors),
      json: paletteToJson(colors),
      svg: paletteToSvg(colors),
    }),
    [colors],
  );

  async function copySnippet() {
    try {
      if (!navigator.clipboard?.writeText) {
        setMessage("Copy not available in this browser.");
        return;
      }
      await navigator.clipboard.writeText(snippets[active]);
      setMessage("Copied!");
      window.setTimeout(() => setMessage((current) => (current === "Copied!" ? null : current)), 1600);
    } catch {
      setMessage("Copy not available in this browser.");
    }
  }

  function downloadSvg() {
    const blob = new Blob([snippets.svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "palette.svg";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <section id="export" aria-labelledby="export-heading">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.06),0_8px_24px_rgba(16,24,40,0.04)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="export-heading" className="text-2xl font-semibold tracking-tight text-slate-900">
              Export your palette
            </h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Copy CSS variables, a Tailwind snippet, JSON, or an SVG swatch strip for design handoff.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-secondary" onClick={copySnippet}>
              Copy {EXPORTS.find((item) => item.key === active)?.label}
            </button>
            {active === "svg" ? (
              <button type="button" className="btn-primary" onClick={downloadSvg}>
                Download SVG
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Export format">
          {EXPORTS.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={active === item.key}
              className={`h-11 rounded-full px-4 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                active === item.key
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
              onClick={() => {
                setActive(item.key);
                setMessage(null);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <pre className="mt-5 max-h-[320px] overflow-auto rounded-2xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">
          <code>{snippets[active]}</code>
        </pre>
        {message ? (
          <p className="mt-3 text-sm text-slate-600" aria-live="polite">
            {message}
          </p>
        ) : null}
        <p className="mt-4 text-sm text-slate-500">Coming soon: Pro exports and brand kits</p>
      </div>
    </section>
  );
}
