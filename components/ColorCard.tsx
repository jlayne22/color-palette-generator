"use client";

import {
  formatContrastRatio,
  formatHsl,
  formatRgb,
  getBestTextColor,
  getContrastLabel,
  getContrastRatio,
  HEX_ERROR_MESSAGE,
  isValidHex,
  normalizeHex,
} from "@/lib/color";
import { useId, useState } from "react";

type ColorCardProps = {
  color: string;
  index: number;
  locked: boolean;
  onToggleLock: () => void;
  onColorChange: (hex: string) => void;
};

export function ColorCard({
  color,
  index,
  locked,
  onToggleLock,
  onColorChange,
}: ColorCardProps) {
  const pickerId = useId();
  const hexId = useId();
  const textColor = getBestTextColor(color);
  const whiteRatio = getContrastRatio(color, "#FFFFFF");
  const blackRatio = getContrastRatio(color, "#000000");
  const bestRatio = Math.max(whiteRatio, blackRatio);
  const label = getContrastLabel(bestRatio);
  const [copied, setCopied] = useState<string | null>(null);
  const [hexDraft, setHexDraft] = useState<string | null>(null);
  const [hexError, setHexError] = useState<string | null>(null);
  const hexValue = hexDraft ?? color;

  async function copy(value: string, key: string) {
    try {
      if (!navigator.clipboard?.writeText) {
        setCopied("unavailable");
        return;
      }
      await navigator.clipboard.writeText(value);
      setCopied(key);
      window.setTimeout(() => setCopied((current) => (current === key ? null : current)), 1600);
    } catch {
      setCopied("unavailable");
    }
  }

  function commitHex(value: string) {
    if (!isValidHex(value)) {
      setHexError(HEX_ERROR_MESSAGE);
      return;
    }
    onColorChange(normalizeHex(value));
  }

  const copyMessage =
    copied === "unavailable"
      ? "Copy not available in this browser."
      : copied
        ? "Copied!"
        : null;

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06),0_8px_24px_rgba(16,24,40,0.04)]">
      <div
        className="relative flex min-h-[148px] flex-col justify-between p-4 sm:min-h-[168px]"
        style={{ backgroundColor: color, color: textColor }}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium opacity-90">Color {index + 1}</p>
          <button
            type="button"
            onClick={onToggleLock}
            aria-pressed={locked}
            aria-label={locked ? `Unlock color ${index + 1}` : `Lock color ${index + 1}`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-current/20 bg-black/10 backdrop-blur-sm transition hover:bg-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            {locked ? <LockIcon /> : <UnlockIcon />}
          </button>
        </div>
        <p className="font-mono text-lg font-semibold tracking-wide">{color}</p>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor={pickerId}>
            Pick color {index + 1}
          </label>
          <input
            id={pickerId}
            type="color"
            value={color}
            onChange={(event) => onColorChange(normalizeHex(event.target.value))}
            className="h-11 w-11 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
          />
          <div className="min-w-0 flex-1">
            <label className="sr-only" htmlFor={hexId}>
              HEX for color {index + 1}
            </label>
            <input
              id={hexId}
              value={hexValue}
              onChange={(event) => {
                setHexDraft(event.target.value);
                setHexError(null);
              }}
              onBlur={() => {
                commitHex(hexValue);
                if (isValidHex(hexValue) || hexValue.trim() === "") {
                  setHexDraft(null);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.currentTarget.blur();
                }
              }}
              spellCheck={false}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            />
          </div>
        </div>
        {hexError ? (
          <p className="text-sm text-rose-600" role="alert">
            {hexError}
          </p>
        ) : null}

        <dl className="grid gap-1 text-sm text-slate-600">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-slate-500">RGB</dt>
            <dd className="truncate font-mono text-slate-800">{formatRgb(color)}</dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-slate-500">HSL</dt>
            <dd className="truncate font-mono text-slate-800">{formatHsl(color)}</dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-2">
          <CopyChip
            label="HEX"
            copied={copied === "hex"}
            onClick={() => copy(color, "hex")}
          />
          <CopyChip
            label="RGB"
            copied={copied === "rgb"}
            onClick={() => copy(formatRgb(color), "rgb")}
          />
          <CopyChip
            label="HSL"
            copied={copied === "hsl"}
            onClick={() => copy(formatHsl(color), "hsl")}
          />
        </div>
        {copyMessage ? (
          <p className="text-sm text-slate-600" aria-live="polite">
            {copyMessage}
          </p>
        ) : null}

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Contrast guidance
          </p>
          <p className="mt-1 text-sm text-slate-800">
            Best text color:{" "}
            <span className="font-medium">
              {textColor === "#FFFFFF" ? "White" : "Black"}
            </span>
          </p>
          <p className="mt-1 font-mono text-xs text-slate-600">
            White {formatContrastRatio(whiteRatio)} · Black {formatContrastRatio(blackRatio)}
          </p>
          <p
            className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
              label === "Good for text"
                ? "bg-emerald-100 text-emerald-800"
                : label === "Use carefully"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-slate-200 text-slate-700"
            }`}
          >
            {label}
          </p>
        </div>
      </div>
    </article>
  );
}

function CopyChip({
  label,
  copied,
  onClick,
}: {
  label: string;
  copied: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 min-w-[4.5rem] items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      {copied ? "Copied!" : `Copy ${label}`}
    </button>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 11V8a5 5 0 0 1 10 0v3M8 11h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UnlockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 11V8a5 5 0 0 1 9.5-2M8 11h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
