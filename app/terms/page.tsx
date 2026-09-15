import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms of use for Color Palette Generator, including creative use, accessibility limits, and intellectual property notes.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Terms of Use</h1>
        <p className="mt-3 text-sm text-slate-500">Last updated: September 15, 2026</p>
        <div className="mt-8 space-y-6 text-slate-600">
          <p>
            Color Palette Generator is provided as a free, browser-based design utility. By
            using the site, you agree to these terms.
          </p>
          <section>
            <h2 className="text-xl font-semibold text-slate-900">Creative use</h2>
            <p className="mt-2">
              You may use generated palettes for personal and commercial creative work,
              including websites, brands, apps, and artwork. You are responsible for how
              colors are applied in your project.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-900">No guarantees</h2>
            <p className="mt-2">
              Palettes are generated algorithmically. We do not guarantee that a palette is
              suitable for a brand, accessible in every context, unique, or free of conflict
              with trademarks, industry conventions, or legal requirements. Always test in
              context.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-900">Intellectual property</h2>
            <p className="mt-2">
              Generated palettes are not exclusive intellectual property. Similar five-color
              combinations can be produced by other tools or designers. Do not assume that
              saving or sharing a palette gives you exclusive rights to those colors.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-900">The service</h2>
            <p className="mt-2">
              The generator runs in your browser and may change over time. Features labeled
              “Coming soon” are not part of the current product. The site is provided as-is
              without warranties of uninterrupted availability.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
