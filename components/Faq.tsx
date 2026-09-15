import { FAQ_ITEMS } from "@/lib/seo";

export function Faq() {
  return (
    <section
      id="faq"
      className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6"
      aria-labelledby="faq-heading"
    >
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight text-slate-900">
          Frequently asked questions
        </h2>
        <div className="mt-6 divide-y divide-slate-200">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group py-4">
              <summary className="cursor-pointer list-none text-lg font-medium text-slate-900 marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded">
                <span className="flex items-start justify-between gap-4">
                  {item.question}
                  <span className="mt-1 text-slate-400 transition group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 max-w-3xl text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
