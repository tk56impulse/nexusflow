"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // ローカルストレージに「ログイン済み」のフラグがあるか確認
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn) {
      // 2回目以降：ログイン画面を飛ばしてダッシュボードへ
      router.push("/dashboard");
    } else {
      // 初回：ログイン画面へ
      router.push("/login");
    }
  }, [router]);

  return (
    <div style={{ 
      height: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      backgroundColor: "#0f172a", 
      color: "#f8fafc",
      fontFamily: "sans-serif"
    }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "1.2rem", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: "10px" }}>
          NEXUS<span style={{ color: "#38bdf8" }}>FLOW</span>
        </h1>
        <p style={{ fontSize: "0.8rem", opacity: 0.6 }}>Checking session...</p>
      </div>
    </div>
  );
}