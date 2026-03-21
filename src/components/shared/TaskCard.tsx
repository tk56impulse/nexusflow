"use client";

import React from "react";
import { Task, Layer, Category } from "../../lib/types";
import { calculateScore } from "../../lib/logic/score";

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
  // 統合版ロジックで計算
  const totalScore = calculateScore(task, "normal");

  const theme = {
    cardBg: isDarkMode ? "rgba(30, 41, 59, 0.7)" : "#ffffff",
    text: isDarkMode ? "#f8fafc" : "#0f172a",
    subText: isDarkMode ? "#94a3b8" : "#64748b",
    border: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#e2e8f0",
    inputSection: isDarkMode ? "rgba(15, 23, 42, 0.5)" : "#f8fafc",
    fieldBg: isDarkMode ? "#1e293b" : "#f1f5f9",
    accent: "#38bdf8",
  };

  const getScoreColor = (intensity: number, layer: string) => {
    if (layer === "desire") return "#10b981";
    if (layer === "investment") {
      if (intensity >= 80) return "#ef4444";
      if (intensity >= 50) return "#f59e0b";
      return "#3b82f6";
    }
    if (layer === "deadline") {
      if (intensity >= 65) return "#ef4444";
      if (intensity >= 30) return "#fbbf24";
      return "#22c55e";
    }
    return "#94a3b8";
  };

  return (
    <div
      style={{
        marginBottom: 20,
        padding: "24px",
        borderRadius: "20px",
        backgroundColor: theme.cardBg,
        border: `1px solid ${theme.border}`,
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
        <span style={{ fontSize: "9px", color: theme.accent, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.8 }}>
          Source: {task.source}
        </span>
      </div>

      <nav style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {(["work", "study", "private"] as const).map((cat) => (
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
        ))}
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
        <div style={{ textAlign: "right", minWidth: "60px" }}>
          <div style={{ fontSize: "0.6rem", color: theme.subText }}>SCORE</div>
          <div style={{ fontSize: "1.6rem", fontWeight: "900", color: theme.accent }}>
            {isNaN(totalScore) ? "---" : totalScore}
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

      <section style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { id: "deadline", label: "🚨 絶対", color: "#ef4444" },
            { id: "investment", label: "🌱 投資", color: "#3b82f6" },
            { id: "desire", label: "🎁 本音", color: "#22c55e" },
          ].map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => onUpdate(task.id, "layer", l.id as Layer)}
              style={{
                flex: 1,
                fontSize: "11px",
                padding: "10px 0",
                borderRadius: "8px",
                border: `1px solid ${task.layer === l.id ? l.color : theme.border}`,
                backgroundColor: task.layer === l.id ? l.color : "transparent",
                color: task.layer === l.id ? "#fff" : theme.subText,
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </section>

      <section style={{
          backgroundColor: theme.inputSection,
          padding: "20px",
          borderRadius: "16px",
          border: `1px solid ${theme.border}`,
      }}>
        <label style={{ fontSize: "0.75rem", fontWeight: "bold", color: theme.subText, display: "block", marginBottom: "10px" }}>
          {task.layer === "deadline" && "どれくらい急ぎですか？"}
          {task.layer === "investment" && "どれくらい重要ですか？"}
          {task.layer === "desire" && "どれくらいやりたいですか？"}
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span style={{ fontSize: "0.7rem", color: theme.subText, fontWeight: "bold", opacity: 0.6 }}>LOW</span>
          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <input
              type="range"
              min="0"
              max="100"
              value={task.intensity}
              onChange={(e) => onUpdate(task.id, "intensity", parseInt(e.target.value))}
              style={{
                WebkitAppearance: "none",
                appearance: "none",
                width: "100%",
                height: "10px",
                borderRadius: "5px",
                cursor: "pointer",
                outline: "none",
                background: `linear-gradient(to right, 
                  ${getScoreColor(task.intensity, task.layer)} 0%, 
                  ${getScoreColor(task.intensity, task.layer)} ${task.intensity}%, 
                  ${isDarkMode ? "rgba(255,255,255,0.1)" : "#e2e8f0"} ${task.intensity}%, 
                  ${isDarkMode ? "rgba(255,255,255,0.1)" : "#e2e8f0"} 100%)`,
              }}
            />
          </div>
          <span style={{ fontSize: "0.7rem", color: getScoreColor(task.intensity, task.layer), fontWeight: "bold", letterSpacing: "0.1em" }}>HIGH</span>
          <div style={{ fontSize: "1.8rem", minWidth: "40px", textAlign: "center" }}>
            {task.intensity > 80 ? "🔥" : task.intensity > 40 ? "⚡" : "💤"}
          </div>
        </div>
        <div style={{ textAlign: "center", fontSize: "0.65rem", color: theme.subText, fontWeight: "500", marginTop: "8px" }}>
          INTENSITY: <span style={{ color: theme.text }}>{task.intensity}%</span>
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