"use client";

import { useState,useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";
//import { useLocalStorage } from "@/hooks/useLocalStorage";
import { api } from "@/lib/api";
import TaskCard from "@/components/features/task/TaskCard"; // 画像の通りsharedを参照
import { Task, Layer, Category, AppraisalMode } from "@/lib/types"; // 統合された型定義
import { sortTasks } from "@/lib/score";

export default function NexusFlowPage() {
  const router = useRouter();
  
  // 💾 LogicDeckの永続化ロジックを継承
  const [tasks, setTasks] = useState<Task[]>([]);

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sortMode, setSortMode] = useState<AppraisalMode>("normal");
  const [isLoading, setIsLoading] = useState(true);

// 2. 初回マウント：LocalStorageからデータをロード
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedTasks = await api.fetchTasks();
        setTasks(storedTasks);
      } catch (err) {
        console.error("Failed to load tasks:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // 3. データ更新の監視：tasksが変わるたびに保存
  useEffect(() => {
    if (!isLoading) {
      api.saveTasks(tasks).catch(console.error);
    }
  }, [tasks, isLoading]);
/*
  const sortedTasks = useMemo(() => {
    return sortTasks(tasks, sortMode); 
  }, [tasks, sortMode]);
  */

  // --- ハンドラー系（データの更新・追加・削除） ---
  const addTask = () => {
    const newTask: Task = {
      id: uuid(),
      source: 'logicdeck',
      title: "",
      description: "",
      intensity: 50,
      energyRequired: 50,
      impactValue: 50,
      estimatedMinutes: 30,
      deadline: new Date().toISOString().split("T")[0],
      layer: "investment",
      category: "work",
      createdAt: Date.now(),
      status: 'pending',
      metadata: { logicId: uuid(), priorityScore: 0 }
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, field: string, value: any) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // 🎨 テーマ定義
 // 5. デザイン用テーマ（ダークモード切り替え対応）
  const theme = {
    bg: isDarkMode ? "#0f172a" : "#f8fafc",
    text: isDarkMode ? "#f8fafc" : "#0f172a",
    accent: "#38bdf8",
    border: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#e2e8f0",
  };

  // ロード中は何も表示させない（またはLoading...と出す）ことでエラーを防ぐ
  if (isLoading) return <div style={{ color: theme.text, padding: 40, textAlign: "center" }}>Initializing NexusFlow...</div>;

  return (
    <main style={{ backgroundColor: theme.bg, color: theme.text, minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        
        {/* ヘッダーセクション */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 900, letterSpacing: "-0.02em" }}>
            NEXUS<span style={{ color: theme.accent }}>FLOW</span>
          </h1>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            style={{ background: "none", border: `1px solid ${theme.border}`, color: theme.text, padding: "8px 12px", borderRadius: "8px", cursor: "pointer" }}
          >
            {isDarkMode ? "🌙 Dark" : "☀️ Light"}
          </button>
        </header>

        {/* モード切り替えボタン（甘口・普通・激辛） */}
        <div style={{ display: "flex", gap: 10, marginBottom: 30 }}>
          {(["sweet", "normal", "spicy"] as const).map(mode => (
            <button 
              key={mode} 
              onClick={() => setSortMode(mode)}
              style={{ 
                flex: 1, 
                padding: "12px", 
                borderRadius: "10px", 
                border: "none",
                cursor: "pointer", 
                backgroundColor: sortMode === mode ? theme.accent : isDarkMode ? "#1e293b" : "#e2e8f0", 
                color: sortMode === mode ? "#0f172a" : isDarkMode ? "#94a3b8" : "#64748b",
                fontWeight: "bold",
                transition: "0.2s"
              }}
            >
              {mode.toUpperCase()}
            </button>
          ))}
        </div>

        {/* タスク追加ボタン */}
        <button 
          onClick={addTask} 
          style={{ 
            width: "100%", 
            padding: 20, 
            borderRadius: "16px",
            marginBottom: 40, 
            cursor: "pointer", 
            border: `2px dashed ${theme.border}`, 
            background: "none", 
            color: theme.accent,
            fontWeight: 900,
            fontSize: "1rem"
          }}
        >
          ＋ NEW TASK
        </button>

        {/* タスク一覧のレンダリング */}
        <section>
          {tasks.map(task => (
            <div key={task.id} style={{ marginBottom: 20 }}>
              <TaskCard 
                task={task} 
                isDarkMode={isDarkMode} 
                onUpdate={updateTask} 
                onRemove={removeTask} 
              />
            </div>
          ))}
        </section>

        {/* 分析画面への導線（今はアラートが出るだけ） */}
<button
  onClick={() => {
    // 現在選択されているモードとテーマを保存（Resultページで読み込むため）
    localStorage.setItem("appraisalMode", sortMode);
    localStorage.setItem("isDarkMode", isDarkMode.toString());
    
    // Resultページへ遷移
    router.push("/dashboard");
  }}
  style={{
    width: "100%",
    padding: "16px",
    borderRadius: "16px",
    border: "none",
    backgroundColor: theme.accent,
    color: "#0f172a",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: 20
  }}
>
  VIEW ANALYSIS (RESULT)
</button>
      </div>
    </main>
  );
}