"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [isDark] = useState(localStorage.getItem("isDarkMode") !== "false");

  // デザイン用共通スタイル
  const theme = {
    bg: isDark ? "#0f172a" : "#f8fafc",
    card: isDark ? "#1e293b" : "#ffffff",
    text: isDark ? "#f8fafc" : "#0f172a",
    accent: "#3b82f6",
    border: isDark ? "#334155" : "#e2e8f0"
  };

  const sectionStyle = {
    backgroundColor: theme.card,
    padding: "24px",
    borderRadius: "16px",
    border: `1px solid ${theme.border}`,
    marginBottom: "20px"
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: "100vh", padding: "40px 20px" }}>
      <main style={{ maxWidth: "600px", margin: "0 auto" }}>
        
        {/* ヘッダー */}
        <header style={{ marginBottom: "32px", display: "flex", alignItems: "center", gap: "16px" }}>
          <button onClick={() => router.push("/dashboard")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: theme.text }}>←</button>
          <h1 style={{ fontSize: "1.8rem", fontWeight: "900" }}>SETTINGS</h1>
        </header>

        {/* セクション1：RICE重み付け（係数） */}
        <section style={sectionStyle}>
          <h2 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "20px", color: theme.accent }}>RICE WEIGHTING (係数)</h2>
          
          {["Reach", "Impact", "Confidence", "Effort"].map((label) => (
            <div key={label} style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "8px" }}>
                <span style={{ fontWeight: "bold" }}>{label}</span>
                <span>1.0x</span>
              </div>
              <input type="range" min="0.1" max="3.0" step="0.1" style={{ width: "100%", cursor: "pointer" }} />
            </div>
          ))}
        </section>

        {/* セクション2：表示ラベルのカスタマイズ */}
        <section style={sectionStyle}>
          <h2 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "20px", color: theme.accent }}>LABEL CUSTOMIZATION</h2>
          <p style={{ fontSize: "0.7rem", opacity: 0.6, marginBottom: "16px" }}>
            ※「不動産モード」や「エンジニアモード」で表示する名前を変更できます。
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input type="text" placeholder="Reach の表示名 (例: 影響範囲)" style={{ padding: "10px", borderRadius: "8px", border: `1px solid ${theme.border}`, backgroundColor: theme.bg, color: theme.text }} />
            <input type="text" placeholder="Impact の表示名 (例: 収益性)" style={{ padding: "10px", borderRadius: "8px", border: `1px solid ${theme.border}`, backgroundColor: theme.bg, color: theme.text }} />
          </div>
        </section>

        {/* 保存ボタン */}
        <button 
          style={{ width: "100%", padding: "16px", borderRadius: "12px", backgroundColor: theme.accent, color: "#white", fontWeight: "bold", border: "none", cursor: "pointer", fontSize: "1rem" }}
          onClick={() => alert("設定を保存しました（仮）")}
        >
          SAVE CHANGES
        </button>

      </main>
    </div>
  );
}