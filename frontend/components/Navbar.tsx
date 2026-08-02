
"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-blue-700"
            onClick={() => setIsOpen(false)}
          >
            Sentences
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
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

            <Link
              href="/admin/login"
              className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-700"
            >
              Admin Login
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-2xl text-slate-700 hover:bg-gray-100 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="mt-4 flex flex-col gap-3 border-t border-gray-200 pt-4 text-sm font-medium md:hidden">
            <a
              href="#languages"
              className="rounded-lg px-3 py-2 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Languages
            </a>

            <a
              href="#packages"
              className="rounded-lg px-3 py-2 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Packages
            </a>

            <a
              href="https://lin.ee/OoFu8bQ"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-3 py-2 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </a>

            <Link
              href="/admin/login"
              className="rounded-xl bg-slate-900 px-4 py-2 text-center font-semibold text-white transition hover:bg-slate-700"
              onClick={() => setIsOpen(false)}
            >
              Admin Login
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
