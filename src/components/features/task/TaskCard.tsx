"use client";

import React from "react";
import { Task, Category } from "@/lib/types/task";

interface TaskCardProps {
  task: Task;
  isDarkMode: boolean;
  onUpdate: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
}

export default function TaskCard({ 
  task, 
  isDarkMode, 
  onUpdate, 
  onRemove 
}: TaskCardProps) {
  // zPriority が 1.0 以下の場合は至急
  const isUrgent = task.zPriority <= 1.0;

  const theme = {
    cardBg: isDarkMode ? "rgba(30, 41, 59, 0.7)" : "#ffffff",
    text: isDarkMode ? "#f8fafc" : "#0f172a",
    subText: isDarkMode ? "#94a3b8" : "#64748b",
    border: isUrgent ? "#ef4444" : (isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#e2e8f0"),
    inputSection: isDarkMode ? "rgba(15, 23, 42, 0.5)" : "#f8fafc",
    fieldBg: isDarkMode ? "#1e293b" : "#f1f5f9",
    accent: "#38bdf8",
    urgent: "#ef4444",
  };

  // 共通のスライダースタイル生成
  const getSliderStyle = (value: number, color: string) => ({
    WebkitAppearance: "none" as const,
    appearance: "none" as const,
    width: "100%",
    height: "6px",
    borderRadius: "3px",
    cursor: "pointer",
    outline: "none",
    background: `linear-gradient(to right, 
      ${color} 0%, 
      ${color} ${value}%, 
      ${isDarkMode ? "rgba(255,255,255,0.1)" : "#e2e8f0"} ${value}%, 
      ${isDarkMode ? "rgba(255,255,255,0.1)" : "#e2e8f0"} 100%)`,
  });

  return (
    <div
      style={{
        marginBottom: 20,
        padding: "24px",
        borderRadius: "20px",
        backgroundColor: theme.cardBg,
        border: `${isUrgent ? '2px' : '1px'} solid ${theme.border}`,
        color: theme.text,
        backdropFilter: isDarkMode ? "blur(12px)" : "none",
        boxShadow: isDarkMode
          ? "0 10px 30px -10px rgba(0,0,0,0.5)"
          : "0 10px 25px -5px rgba(0,0,0,0.05)",
        transition: "transform 0.2s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = isDarkMode
          ? "0 20px 40px -10px rgba(0,0,0,0.7)"
          : "0 15px 30px -5px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = isDarkMode
          ? "0 10px 30px -10px rgba(0,0,0,0.5)"
          : "0 10px 25px -5px rgba(0,0,0,0.05)";
      }}
    >
      <div style={{ textAlign: "right", marginBottom: -10 }}>
        {isUrgent && (
          <span style={{ fontSize: "10px", backgroundColor: theme.urgent, color: "#fff", padding: "2px 8px", borderRadius: "10px", fontWeight: "bold", marginRight: "8px" }}>URGENT</span>
        )}
        <span style={{ fontSize: "9px", color: theme.accent, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.8 }}>
          Source: {task.source}
        </span>
      </div>

 <nav style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
  {task.source === "propflow" ? (
    // 不動産モード専用カテゴリ（リスク順）
    (["critical", "facility", "owner", "legal", "claim", "routine", "noise"] as const).map((cat) => (
      <button
        key={cat}
        type="button"
        onClick={() => onUpdate(task.id, "category", cat)}
        style={{
          padding: "4px 8px",
          fontSize: "9px",
          borderRadius: "4px",
          border: "none",
          backgroundColor: task.category === cat ? "#ef4444" : isDarkMode ? "#334155" : "#e2e8f0",
          color: task.category === cat ? "#fff" : theme.subText,
          fontWeight: "bold",
          cursor: "pointer",
          transition: "0.2s"
        }}
      >
        {cat.toUpperCase()}
      </button>
    ))
  ) : (
    // 通常モード（既存）
    (["work", "study", "private"] as const).map((cat) => (
      <button
        key={cat}
        type="button"
        onClick={() => onUpdate(task.id, "category", cat)}
        style={{
          padding: "4px 12px",
          fontSize: "10px",
          borderRadius: "4px",
          border: "none",
          backgroundColor: task.category === cat ? theme.accent : isDarkMode ? "#334155" : "#e2e8f0",
          color: task.category === cat ? "#0f172a" : theme.subText,
          fontWeight: "bold",
          cursor: "pointer",
          transition: "0.2s"
        }}
      >
        {cat.toUpperCase()}
      </button>
    ))
  )}
</nav>

      <header style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center" }}>
        <input
          placeholder="Task title..."
          value={task.title}
          onChange={(e) => onUpdate(task.id, "title", e.target.value)}
          style={{
            flex: 1,
            fontSize: "1.2rem",
            fontWeight: "bold",
            background: "none",
            border: "none",
            borderBottom: `1px solid ${theme.border}`,
            color: theme.text,
            padding: "8px 0",
            outline: "none",
          }}
        />
        <div style={{ textAlign: "right", minWidth: "80px" }}>
          <div style={{ fontSize: "0.6rem", color: theme.subText }}>Z-PRIORITY</div>
          <div style={{ fontSize: "1.6rem", fontWeight: "900", color: isUrgent ? theme.urgent : theme.accent }}>
            {task.zPriority?.toFixed(1) || "---"}
          </div>
        </div>
        <button
          onClick={() => onRemove(task.id)}
          style={{ background: "none", border: "none", color: theme.subText, fontSize: "1.2rem", cursor: "pointer", opacity: 0.6 }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "0.6"}
        >
          ✕
        </button>
      </header>

      {/* X & Y スコア表示セクション */}
      <section style={{ display: "flex", gap: 15, marginBottom: 20 }}>
        <div style={{ flex: 1, backgroundColor: theme.fieldBg, padding: "10px", borderRadius: "12px", textAlign: "center" }}>
          <div style={{ fontSize: "0.6rem", color: theme.subText }}>Efficiency (X)</div>
          <div style={{ fontWeight: "bold" }}>{task.xScore?.toFixed(2)}</div>
        </div>
        <div style={{ flex: 1, backgroundColor: theme.fieldBg, padding: "10px", borderRadius: "12px", textAlign: "center" }}>
          <div style={{ fontSize: "0.6rem", color: theme.subText }}>Value (Y)</div>
          <div style={{ fontWeight: "bold" }}>{task.yScore?.toFixed(2)}</div>
        </div>
      </section>

      {/* 数値属性入力セクション */}
      <section style={{
          backgroundColor: theme.inputSection,
          padding: "20px",
          borderRadius: "16px",
          border: `1px solid ${theme.border}`,
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          {/* R: Reach */}
          <div style={{ marginBottom: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label style={{ fontSize: "0.6rem", fontWeight: "bold", color: theme.subText }}>REACH</label>
              <span style={{ fontSize: "0.6rem" }}>{task.scoreReach}</span>
            </div>
            <input
              type="range" min="0.1" max="10" step="0.1"
              value={task.scoreReach}
              onChange={(e) => onUpdate(task.id, "scoreReach", parseFloat(e.target.value))}
              style={getSliderStyle(task.scoreReach * 10, theme.accent)}
            />
          </div>
          {/* I: Impact */}
          <div style={{ marginBottom: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label style={{ fontSize: "0.6rem", fontWeight: "bold", color: theme.subText }}>IMPACT</label>
              <span style={{ fontSize: "0.6rem" }}>{task.scoreImpact}</span>
            </div>
            <input
              type="range" min="0" max="100"
              value={task.scoreImpact}
              onChange={(e) => onUpdate(task.id, "scoreImpact", parseInt(e.target.value))}
              style={getSliderStyle(task.scoreImpact, "#818cf8")}
            />
          </div>
          {/* C: Confidence */}
          <div style={{ marginBottom: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label style={{ fontSize: "0.6rem", fontWeight: "bold", color: theme.subText }}>CONFIDENCE</label>
              <span style={{ fontSize: "0.6rem" }}>{task.scoreConfidence}%</span>
            </div>
            <input
              type="range" min="0" max="100"
              value={task.scoreConfidence}
              onChange={(e) => onUpdate(task.id, "scoreConfidence", parseInt(e.target.value))}
              style={getSliderStyle(task.scoreConfidence, "#10b981")}
            />
          </div>
          {/* E: Effort */}
          <div style={{ marginBottom: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label style={{ fontSize: "0.6rem", fontWeight: "bold", color: theme.subText }}>EFFORT</label>
              <span style={{ fontSize: "0.6rem" }}>{task.scoreEffort}</span>
            </div>
            <input
              type="range" min="1" max="100"
              value={task.scoreEffort}
              onChange={(e) => onUpdate(task.id, "scoreEffort", parseInt(e.target.value))}
              style={getSliderStyle(task.scoreEffort, "#fb923c")}
            />
          </div>
        </div>
        {/* S: Severity (重要度・事態の重さ) */}
        <div style={{ marginTop: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label style={{ fontSize: "0.6rem", fontWeight: "bold", color: theme.subText }}>SEVERITY (0-10)</label>
            <span style={{ fontSize: "0.6rem", color: theme.urgent }}>{task.scoreSeverity}</span>
          </div>
          <input
            type="range" min="0" max="10" step="1"
            value={task.scoreSeverity}
            onChange={(e) => onUpdate(task.id, "scoreSeverity", parseInt(e.target.value))}
            style={getSliderStyle(task.scoreSeverity * 10, theme.urgent)}
          />
        </div>
      </section>

      <footer style={{ display: "flex", gap: 10, marginTop: 15 }}>
        <input
          type="date"
          value={task.deadline ? task.deadline.split("T")[0] : ""}
          onChange={(e) => onUpdate(task.id, "deadline", e.target.value)}
          style={{
            flex: 1,
            padding: "8px",
            fontSize: "0.75rem",
            backgroundColor: theme.fieldBg,
            border: `1px solid ${theme.border}`,
            borderRadius: "6px",
            color: theme.subText,
            colorScheme: isDarkMode ? "dark" : "light",
          }}
        />
        <input
          placeholder="Memo..."
          value={(task as any).description || ""}
          onChange={(e) => onUpdate(task.id, "description", e.target.value)}
          style={{
            flex: 2,
            padding: "8px",
            fontSize: "0.75rem",
            backgroundColor: theme.fieldBg,
            border: `1px solid ${theme.border}`,
            borderRadius: "6px",
            color: theme.text,
            outline: "none",
          }}
        />
      </footer>
    </div>
  );
}