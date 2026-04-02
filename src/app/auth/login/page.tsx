"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isDark] = useState(localStorage.getItem("isDarkMode") !== "false");

  // デザイン用共通スタイル
  const theme = {
    bg: isDark ? "#0f172a" : "#f8fafc",
    card: isDark ? "#1e293b" : "#ffffff",
    text: isDark ? "#f8fafc" : "#0f172a",
    subText: isDark ? "#94a3b8" : "#64748b",
    accent: "#3b82f6",
    border: isDark ? "#334155" : "#e2e8f0"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: `1px solid ${theme.border}`,
    backgroundColor: isDark ? "#0f172a" : "#f8fafc",
    color: theme.text,
    marginBottom: "16px",
    outline: "none"
  };

  return (
    <div style={{ 
      backgroundColor: theme.bg, 
      color: theme.text, 
      height: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      padding: "20px"
    }}>
      <main style={{ 
        width: "100%", 
        maxWidth: "400px", 
        backgroundColor: theme.card, 
        padding: "40px", 
        borderRadius: "24px", 
        border: `1px solid ${theme.border}`,
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}>
        
        {/* ロゴ */}
        <header style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "900", letterSpacing: "-0.05em", margin: 0 }}>
            NEXUS<span style={{ color: theme.accent }}>FLOW</span>
          </h1>
          <p style={{ fontSize: "0.85rem", color: theme.subText, marginTop: "8px" }}>
            Decision-making, optimized.
          </p>
        </header>

        {/* フォーム（ガワ） */}
        <div style={{ textAlign: "left" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: "bold", marginBottom: "6px", display: "block", opacity: 0.7 }}>EMAIL ADDRESS</label>
          <input type="email" placeholder="name@company.com" style={inputStyle} />

          <label style={{ fontSize: "0.75rem", fontWeight: "bold", marginBottom: "6px", display: "block", opacity: 0.7 }}>PASSWORD</label>
          <input type="password" placeholder="••••••••" style={inputStyle} />
          
           <button 
          onClick={() => {
            // 1. 「ログイン済み」という印をブラウザに保存する
            localStorage.setItem("isLoggedIn", "true"); 
            
            // 2. ダッシュボードへ移動する
            router.push("/dashboard");
          }}
          style={{ 
            width: "100%", 
            padding: "14px", 
            borderRadius: "10px", 
            backgroundColor: theme.accent, 
            color: "white", 
            fontWeight: "bold", 
            border: "none", 
            cursor: "pointer", 
            fontSize: "0.9rem",
            marginTop: "8px"
          }}
         >
            SIGN IN
          </button>
        </div>

        {/* 区切り線 */}
        <div style={{ margin: "24px 0", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: theme.border }}></div>
          <span style={{ fontSize: "0.7rem", color: theme.subText }}>OR</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: theme.border }}></div>
        </div>

        {/* ソーシャルログイン（ガワ） */}
        <button style={{ 
          width: "100%", 
          padding: "12px", 
          borderRadius: "10px", 
          backgroundColor: "transparent", 
          border: `1px solid ${theme.border}`, 
          color: theme.text, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          gap: "10px", 
          cursor: "pointer",
          fontSize: "0.85rem"
        }}>
          <span style={{ fontSize: "1.2rem" }}>G</span> Continue with Google
        </button>

        {/* 下部リンク */}
        <footer style={{ marginTop: "32px", fontSize: "0.75rem", color: theme.subText }}>
          Don't have an account? <span style={{ color: theme.accent, cursor: "pointer", fontWeight: "bold" }}>Sign up</span>
        </footer>

      </main>
    </div>
  );
}