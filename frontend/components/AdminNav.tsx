"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    localStorage.removeItem("adminLoggedIn");
    router.push("/admin/login");
  }

  const links = [
    {
      href: "/admin",
      label: "Dashboard",
    },
    {
      href: "/admin/students",
      label: "Students",
    },
    {
      href: "/admin/lessons",
      label: "Lessons",
    },
    {
      href: "/admin/tutors",
      label: "Tutors",
    },
  ];

  return (
    <nav className="border-b border-slate-700 bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
        
        <div>
          <Link
            href="/admin"
            className="text-xl font-bold text-white"
          >
            Tutor System
          </Link>

          <p className="text-xs text-slate-400">
            Admin Panel
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {links.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                    : "rounded-lg px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
                }
              >
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/"
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600"
          >
            🏠 Home
          </Link>

          <button
            type="button"
            onClick={logout}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
}