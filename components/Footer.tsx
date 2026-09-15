import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-slate-500">
          © {year} Color Palette Generator. Built for designers and developers.
        </p>
        <nav aria-label="Legal">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-slate-600">
            <li>
              <Link className="rounded hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2" href="/privacy">
                Privacy
              </Link>
            </li>
            <li>
              <Link className="rounded hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2" href="/terms">
                Terms
              </Link>
            </li>
            <li>
              <Link className="rounded hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2" href="/#faq">
                FAQ
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
