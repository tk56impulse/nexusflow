"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Task, AppraisalMode } from "@/lib/types";
import { calculateScore, sortTasks } from "@/lib/logic/score";
import { api } from "@/lib/api";

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<{
    tasks: Task[];
    mode: AppraisalMode;
    isDark: boolean;
  } | null>(null);

  // 1. データのロード
  useEffect(() => {
    const loadData = async () => {
      const tasks = await api.fetchTasks();
      // ローカルストレージ等から現在のモードを取得（デフォルトは normal）
      const mode = (localStorage.getItem("appraisalMode") as AppraisalMode) || "normal";
      const isDark = localStorage.getItem("isDarkMode") !== "false";

      // スコア順にソート
      const scoredTasks = sortTasks(tasks, mode).filter(t => t.title.trim() !== "");
      
      setData({ tasks: scoredTasks, mode, isDark });
    };
    loadData();
  }, []);

  if (!data) return <div style={{ textAlign: "center", padding: "100px", color: "#64748b" }}>Analyzing Tasks...</div>;

  const { tasks, mode, isDark } = data;

  // デザイン用テーマ
  const theme = {
    bg: isDark ? "#0f172a" : "#f8fafc",
    text: isDark ? "#f8fafc" : "#0f172a",
    subText: isDark ? "#94a3b8" : "#64748b",
    cardBg: isDark ? "rgba(30, 41, 59, 0.7)" : "#ffffff",
    border: isDark ? "rgba(255, 255, 255, 0.1)" : "#e2e8f0",
    accent: mode === "spicy" ? "#ef4444" : mode === "sweet" ? "#ec4899" : "#38bdf8"
  };

  return (
    <main style={{ maxWidth: 600, margin: "auto", padding: "40px 20px", minHeight: "100vh", backgroundColor: theme.bg, color: theme.text }}>
      
      <header style={{ marginBottom: "40px" }}>
        <button
          onClick={() => router.push("/")}
          style={{ marginBottom: "20px", border: "none", background: "none", cursor: "pointer", color: theme.accent, fontWeight: "bold" }}
        >
          ← BACK TO EDITOR
        </button>

        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: "bold", color: theme.accent, letterSpacing: "0.2em", textTransform: "uppercase" }}>
            {mode} mode optimized
          </span>
          <h1 style={{ margin: "10px 0", fontSize: "2.2rem", fontWeight: "900", letterSpacing: "-0.04em" }}>
            PRIORITY <span style={{ color: theme.accent }}>RANKING</span>
          </h1>
        </div>
      </header>

      <section style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {tasks.map((task, index) => {
          const score = calculateScore(task, mode);
          const isFirst = index === 0;

          return (
            <article
              key={task.id}
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: theme.cardBg,
                padding: "20px",
                borderRadius: "20px",
                border: `1px solid ${isFirst ? theme.accent : theme.border}`,
                boxShadow: isFirst ? `0 0 20px ${theme.accent}33` : "none",
                transform: isFirst ? "scale(1.03)" : "scale(1)",
                transition: "all 0.3s ease",
              }}
            >
              {/* 順位表示 */}
              <div style={{ fontSize: "1.5rem", fontWeight: "900", marginRight: "20px", color: isFirst ? theme.accent : theme.subText, minWidth: "40px" }}>
                #{index + 1}
              </div>

              {/* タスク内容 */}
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: "bold", margin: "0 0 4px 0" }}>
                  {task.title}
                </h2>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                   <span style={{ fontSize: "0.6rem", padding: "2px 6px", borderRadius: "4px", backgroundColor: theme.border, color: theme.subText, fontWeight: "bold", textTransform: "uppercase" }}>
                    {task.category}
                  </span>
                  <span style={{ fontSize: "0.6rem", color: theme.subText }}>
                    {task.layer.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* スコア表示 */}
              <div style={{ textAlign: "right", marginLeft: "15px" }}>
                <div style={{ fontSize: "0.5rem", color: theme.subText, fontWeight: "bold" }}>SCORE</div>
                <div style={{ fontSize: "1.6rem", fontWeight: "900", color: isFirst ? theme.accent : theme.text }}>
                  {score}
                </div>
              </div>
            </article>
          );
        })}
      </section>

    </main>
  );
}