import { Suspense } from "react";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { PaletteFallback, PaletteGenerator } from "@/components/PaletteGenerator";
import { SeoContent } from "@/components/SeoContent";

export default function HomePage() {
  return (
    <>
      <a href="#generator" className="skip-link">
        Skip to generator
      </a>
      <Header />
      <main className="flex-1">
        <section
          id="generator"
          className="mx-auto w-full max-w-6xl px-4 pb-10 pt-10 sm:px-6 sm:pt-14"
          aria-labelledby="hero-heading"
        >
          <Hero />
          <Suspense fallback={<PaletteFallback />}>
            <PaletteGenerator />
          </Suspense>
        </section>
        <SeoContent />
        <Faq />
      </main>
      <Footer />
      <JsonLd />
    </>
  );
}
