import Link from "next/link";
import { SITE_NAME } from "@/lib/seo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          <span className="flex h-8 overflow-hidden rounded-full" aria-hidden="true">
            <span className="h-8 w-2.5 bg-[#264653]" />
            <span className="h-8 w-2.5 bg-[#2A9D8F]" />
            <span className="h-8 w-2.5 bg-[#E9C46A]" />
            <span className="h-8 w-2.5 bg-[#F4A261]" />
            <span className="h-8 w-2.5 bg-[#E76F51]" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-slate-900 sm:text-base">
            {SITE_NAME}
          </span>
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-1 text-sm font-medium text-slate-600 sm:gap-2">
            <li>
              <Link className="nav-link" href="/#generator">
                Generator
              </Link>
            </li>
            <li className="hidden sm:block">
              <Link className="nav-link" href="/#how-to-use">
                How to use
              </Link>
            </li>
            <li>
              <Link className="nav-link" href="/#faq">
                FAQ
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
