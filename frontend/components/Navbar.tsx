import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-xl font-bold text-blue-700"
        >
          Sentences
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium md:gap-6">
          <div className="hidden items-center gap-6 md:flex">
            <a
              href="#languages"
              className="hover:text-blue-600"
            >
              Languages
            </a>

            <a
              href="#packages"
              className="hover:text-blue-600"
            >
              Packages
            </a>

            <a
              href="https://lin.ee/OoFu8bQ"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600"
            >
              Contact
            </a>
          </div>

          <Link
            href="/admin/login"
            className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-700"
          >
            Admin Login
          </Link>
        </nav>
      </div>
    </header>
  );
}