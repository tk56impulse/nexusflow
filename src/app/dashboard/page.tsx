"use client";
import { v4 as uuid } from "uuid";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Task, AppraisalMode } from "@/lib/types";
import { calculateScore, sortTasks } from "@/lib/score";
import { api } from "@/lib/api";
import CalendarEmbed from "@/components/features/dashboard/CalendarEmbed";


export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<{
    tasks: Task[];
    mode: AppraisalMode;
    isDark: boolean;
  } | null>(null);

  // 1. データのロード（既存ロジックを継承）
  useEffect(() => {
    const loadData = async () => {
      const tasks = await api.fetchTasks();
      const mode = (localStorage.getItem("appraisalMode") as AppraisalMode) || "normal";
      const isDark = localStorage.getItem("isDarkMode") !== "false";

      // スコア順にソート
      const scoredTasks = sortTasks(tasks, mode).filter(t => t.title.trim() !== "");
      setData({ tasks: scoredTasks, mode, isDark });
    };
    loadData();
  }, []);

  if (!data) return <div className="flex h-screen items-center justify-center text-gray-500">Analyzing Tasks...</div>;

  const { tasks, mode, isDark } = data;

  const addTask = async () => {
  const newTask: Task = {
    id: uuid(),
    source: "logicdeck",
    title: "New Task",
    description: "",
    intensity: 50,
    energyRequired: 50,
    impactValue: 50,
    estimatedMinutes: 30,
    deadline: new Date().toISOString().split("T")[0],
    layer: "investment",
    category: "work",
    createdAt: Date.now(),
    status: "pending",
    metadata: {
      logicId: uuid(),
      priorityScore: 0,
    },
    reach: 1.0,
    confidence: 100,
  };

  const updatedTasks = sortTasks([newTask, ...tasks], mode).filter(
    (t) => t.title.trim() !== ""
  );

  await api.saveTasks(updatedTasks);
  setData({
    tasks: updatedTasks,
    mode,
    isDark,
  });
};

  // デザイン用テーマ（既存のカラー設定を定数化）
  const accentColor = mode === "spicy" ? "#ef4444" : mode === "sweet" ? "#ec4899" : "#3b82f6";

  return (
    <div className={`flex flex-col h-screen overflow-hidden ${isDark ? "bg-slate-950 text-slate-50" : "bg-slate-50 text-slate-900"}`}>

      {/* ヘッダー */}
      <header className={`h-14 border-b flex items-center justify-between px-6 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
        <div className="flex items-center gap-4">
          <h1 className="font-black text-xl tracking-tighter">
            NEXUS<span style={{ color: accentColor }}>FLOW</span>
          </h1>
          <span className="text-[10px] px-2 py-0.5 rounded-full border border-current opacity-50 uppercase tracking-widest">
            {mode} mode
          </span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => router.push("/settings")}
            className="text-xs font-bold py-2 px-4 rounded-full border transition-all"
          >
            ⚙️ SETTINGS
          </button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        
        {/* 左側：タスクランキング（既存のarticleカードを移植） */}
        <section className="w-1/2 p-6 overflow-y-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-[10px] font-bold opacity-50 tracking-widest uppercase">Current Priority</p>
              <h2 className="text-2xl font-black tracking-tight">RANKING</h2>
            </div>
            <button 
                onClick={addTask}
                 className="text-xs font-bold py-2 px-4 rounded-full border transition-all"
                 style={{ borderColor: accentColor, color: accentColor }} 
            >
              + NEW TASK
            </button>
          </div>
          
          <div className="space-y-6">
            {tasks.map((task, index) => {
              const score = calculateScore(task, mode);
              const isFirst = index === 0;

              return (
                <article
                  key={task.id}
                  className={`flex items-center p-5 rounded-2xl border transition-all duration-300 ${
                    isFirst ? "scale-[1.02] shadow-lg shadow-opacity-10" : "scale-100"
                  }`}
                  style={{
                    backgroundColor: isDark ? "rgba(30, 41, 59, 0.7)" : "#ffffff",
                    borderColor: isFirst ? accentColor : (isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"),
                    boxShadow: isFirst ? `0 10px 30px ${accentColor}22` : "none"
                  }}
                >
                  {/* 順位 */}
                  <div className="text-2xl font-black mr-5 min-w-[40px]" style={{ color: isFirst ? accentColor : (isDark ? "#475569" : "#94a3b8") }}>
                    #{index + 1}
                  </div>

                  {/* 内容 */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg leading-tight mb-1">{task.title}</h3>
                    <div className="flex gap-2 items-center">
                      <span className="text-[9px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 font-bold uppercase">
                        {task.category}
                      </span>
                      <span className="text-[9px] opacity-50 font-medium uppercase tracking-tighter">
                        {task.layer}
                      </span>
                    </div>
                  </div>

                  {/* スコア */}
                  <div className="text-right ml-4">
                    <div className="text-[8px] font-black opacity-40 leading-none mb-1">SCORE</div>
                    <div className="text-2xl font-black leading-none" style={{ color: isFirst ? accentColor : "inherit" }}>
                      {score}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 右側：Googleカレンダー */}
       <section
         className={`w-1/2 border-l p-4 ${
           isDark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
         }`}
       >
         <div className="mb-4">
           <h2 className="text-lg font-bold tracking-tight">SCHEDULE</h2>
         </div>
         <div className="h-[calc(100vh-120px)] rounded-2xl overflow-hidden shadow-md">
           <CalendarEmbed />
         </div>
       </section>
      </main>
    </div>
  );
}