"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminNav from "@/components/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";

  const [checking, setChecking] = useState(!isLoginPage);

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }

    const loggedIn =
      localStorage.getItem("adminLoggedIn");

    if (loggedIn !== "true") {
      router.replace("/admin/login");
      return;
    }

    setChecking(false);
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <main className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-xl">
          Checking access...
        </p>
      </main>
    );
  }

  return (
    <>
      <AdminNav />
      {children}
    </>
  );
}