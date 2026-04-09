"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-50">
      <div className="text-center">
        <h1 className="text-xl font-black tracking-tight">
          NEXUS<span className="text-sky-400">FLOW</span>
        </h1>
        <p className="mt-2 text-sm opacity-60">Checking session...</p>
      </div>
    </div>
  );
}