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
      metadata: { logicId: uuid(), priorityScore: 0 },
      reach: 1.0,      // 初期値は「自分のみ」
      confidence: 100, // 初期値は「確信度100%」
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