import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for Color Palette Generator. Palettes are created in your browser and saved palettes stay on this device.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Privacy Policy</h1>
        <p className="mt-3 text-sm text-slate-500">Last updated: September 15, 2026</p>
        <div className="mt-8 space-y-6 text-slate-600">
          <p>
            Color Palette Generator is a client-side tool. You do not need an account, and we
            do not require personal information to generate or save palettes.
          </p>
          <section>
            <h2 className="text-xl font-semibold text-slate-900">What happens in your browser</h2>
            <p className="mt-2">
              Palette generation, contrast checks, exports, and copy actions all run locally
              in your browser. Colors are not sent to an external palette API or database.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-900">Saved palettes</h2>
            <p className="mt-2">
              If you choose Save palette, favorites are stored with localStorage on this
              device. They are not synced to a server. Clearing site data, using private
              browsing, or switching browsers or devices removes those saves.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-900">Shareable URLs</h2>
            <p className="mt-2">
              If you copy a share link, the palette colors are placed in the page query
              string (for example, <code>/?palette=264653,2A9D8F,E9C46A,F4A261,E76F51</code>).
              Anyone with that URL can see those colors. Do not put sensitive information in
              the query string.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-900">Analytics</h2>
            <p className="mt-2">
              This site does not currently attach a third-party analytics product. If
              analytics are added later, this policy will be updated to describe what is
              collected and why.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-slate-900">Contact</h2>
            <p className="mt-2">
              Questions about this policy can be raised through the project repository that
              hosts this website.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
