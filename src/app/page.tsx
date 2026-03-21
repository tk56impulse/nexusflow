"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import TaskCard from "../components/shared/TaskCard"; // 画像の通りsharedを参照
import { Task, Layer, Category, AppraisalMode } from "@/lib/types"; // 統合された型定義
import { sortTasks } from "@/lib/logic/score";

export default function HomePage() {
  const router = useRouter();
  
  // 💾 LogicDeckの永続化ロジックを継承
  const [tasks, setTasks] = useLocalStorage<Task[]>("nexusflow_tasks", []);

  // 🌓 UI状態管理
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [appraisalMode, setAppraisalMode] = useState<AppraisalMode>("normal");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 定数定義 (LogicDeckから完全移植)
  const APPRAISAL_OPTIONS = [
    { id: "sweet", label: "🍬 甘口", color: "#ffb6c1" },
    { id: "normal", label: "⚖️ 普通", color: "#94a3b8" },
    { id: "spicy", label: "🌶️ 激辛", color: "#f43f5e" },
  ] as const;

  const APPRAISAL_LABELS: Record<AppraisalMode, string> = {
    sweet: "💖 気楽に並べ替え",
    normal: "📊 標準モードで算出",
    spicy: "🔥 激辛モードで厳選",
  };

  // --- ハンドラ (LogicDeckの操作感を維持) ---
// page.tsx 内の addTask 関数を差し替え
const addTask = () => {
  const newTask: Task = {
    id: uuid(),
    source: 'logicdeck',
    title: "",
    description: "",
    intensity: 50,
    deadline: new Date().toISOString().split("T")[0],
    layer: "investment",
    category: "work",
    createdAt: Date.now(),
    status: 'pending',
    // LogicDeckTask 型で必須となっている metadata を追加
    metadata: {
      logicId: uuid(),
      priorityScore: 0
    }
  };
  setTasks((prev) => [newTask, ...prev]);
};

  const updateTask = (
    id: string,
    field: string,
    value: any,
  ) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );
  };

  const removeTask = (id: string) => {
    const targetTask = tasks.find((t) => t.id === id);
    if (!targetTask) return;

    if (targetTask.title.trim() === "") {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } else {
      if (window.confirm(`タスク「${targetTask.title}」を完全に削除してもよろしいですか？`)) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
      }
    }
  };

  // --- PropFlow 統合: リアルタイム並び替えロジック ---
  // 入力やアルゴリズム変更のたびに、PropFlowのロジックで再計算
  const sortedTasks = useMemo(() => {
    return sortTasks(tasks, appraisalMode);
  }, [tasks, appraisalMode]);

  // 結果画面への遷移 (演出を維持)
  const handleGoToResult = async () => {
    const validTasks = tasks.filter((t) => t.title.trim());
    if (validTasks.length === 0) {
      alert("有効なタスク（タイトル）がありません。");
      return;
    }

    setIsAnalyzing(true);
    // データの保存（将来的なDB連動へのフックポイント）
    localStorage.setItem("nexusflow_tasks", JSON.stringify(validTasks));
    localStorage.setItem("appraisalMode", appraisalMode);

    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push("/result");
  };

  // 🎨 テーマ定義
  const theme = {
    bg: isDarkMode ? "#0f172a" : "#f8fafc",
    text: isDarkMode ? "#f8fafc" : "#0f172a",
    subText: isDarkMode ? "#94a3b8" : "#64748b",
    accent: "#38bdf8",
    cardSectionBg: isDarkMode ? "rgba(30, 41, 59, 0.7)" : "#ffffff",
    border: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#e2e8f0",
  };

  return (
    <main style={{ backgroundColor: theme.bg, minHeight: "100vh", transition: "all 0.3s ease", color: theme.text, fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* 🚀 解析演出オーバーレイ (完全移植) */}
      {isAnalyzing && (
        <aside style={{ position: "fixed", inset: 0, backgroundColor: isDarkMode ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(8px)" }}>
          <div style={{ display: "flex", gap: "5px", marginBottom: "20px" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: "10px", height: "40px", backgroundColor: theme.accent, borderRadius: "5px", animation: "wave 1s ease-in-out infinite", animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
          <h2 style={{ color: theme.accent, letterSpacing: "0.3em", fontSize: "0.9rem", fontWeight: "900", textTransform: "uppercase" }}>
            Optimizing Strategic Layers...
          </h2>
          <p style={{ color: theme.subText, fontSize: "0.7rem", marginTop: "10px", letterSpacing: "0.1em" }}>REARRANGING PRIORITIES BASED ON YOUR MODE</p>
        </aside>
      )}

      <div style={{ maxWidth: 800, margin: "auto", padding: "40px 20px" }}>
        <header style={{ marginBottom: "40px" }}>
          <div style={{ textAlign: "right", marginBottom: "20px" }}>
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: "none", border: `1px solid ${theme.border}`, borderRadius: "20px", color: theme.subText, padding: "6px 16px", cursor: "pointer", fontSize: "11px", fontWeight: "bold" }}>
              {isDarkMode ? "☀️ LIGHT MODE" : "🌙 DARK MODE"}
            </button>
          </div>
          <h1 style={{ textAlign: "center", marginBottom: 8, color: isDarkMode ? theme.accent : "#0f172a", letterSpacing: "0.1em", fontSize: "2.5rem", fontWeight: "900", textShadow: isDarkMode ? "0 0 20px rgba(56, 189, 248, 0.3)" : "none" }}>
            NEXUS FLOW
          </h1>
          <p style={{ textAlign: "center", color: theme.subText, fontSize: "0.8rem", letterSpacing: "0.2em" }}>COMMAND YOUR PRIORITIES</p>
        </header>

        <section aria-label="Task Deck">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "20px", padding: "0 10px" }}>
            <h2 style={{ margin: 0, fontSize: "0.9rem", color: theme.subText, letterSpacing: "0.1em" }}>TASK DECK</h2>
            <button onClick={addTask} style={{ padding: "8px 20px", borderRadius: "10px", backgroundColor: theme.accent, color: "#0f172a", fontWeight: "bold", fontSize: "0.85rem", border: "none", cursor: "pointer", boxShadow: "0 4px 15px rgba(56, 189, 248, 0.2)" }}>
              ＋ NEW TASK
            </button>
          </div>

          {tasks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: theme.subText, border: `2px dashed ${theme.border}`, borderRadius: "16px" }}>
              タスクがありません。「＋ NEW TASK」から作成してください。
            </div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px 0" }}>
              {sortedTasks.map((task) => (
                <li key={task.id} style={{ marginBottom: "20px" }}>
                  <TaskCard
                    task={task}
                    isDarkMode={isDarkMode}
                    onUpdate={updateTask}
                    onRemove={removeTask}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        {tasks.length > 0 && (
          <footer style={{ marginTop: "80px", padding: "30px", backgroundColor: theme.cardSectionBg, borderRadius: "24px", border: `1px solid ${theme.border}`, boxShadow: isDarkMode ? "none" : "0 10px 30px rgba(0,0,0,0.05)" }}>
            <p style={{ textAlign: "center", fontWeight: "bold", color: theme.subText, marginBottom: "20px", fontSize: "0.9rem" }}>
              最適化アルゴリズムを選択
            </p>
            <nav style={{ display: "flex", gap: "8px", marginBottom: "25px" }}>
              {APPRAISAL_OPTIONS.map((m) => (
                <button key={m.id} onClick={() => setAppraisalMode(m.id as AppraisalMode)} style={{ flex: 1, padding: "15px 5px", borderRadius: "12px", border: "none", backgroundColor: appraisalMode === m.id ? m.color : isDarkMode ? "#1e293b" : "#f1f5f9", color: appraisalMode === m.id ? "white" : theme.subText, cursor: "pointer", fontWeight: "bold", transition: "0.2s" }}>
                  {m.label}
                </button>
              ))}
            </nav>
            <button onClick={handleGoToResult} disabled={isAnalyzing} style={{ width: "100%", padding: "22px", background: isDarkMode ? "#f8fafc" : "#0f172a", color: isDarkMode ? "#0f172a" : "#ffffff", borderRadius: "20px", fontWeight: "900", fontSize: "1.2rem", border: "none", cursor: isAnalyzing ? "not-allowed" : "pointer", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)", opacity: isAnalyzing ? 0.7 : 1 }}>
              {isAnalyzing ? "OPTIMIZING..." : APPRAISAL_LABELS[appraisalMode]}
            </button>
          </footer>
        )}
      </div>
    </main>
  );
}