import { Task, Layer, Category,Language,LAYER_MAP } from "@/lib/types"; 
import { calculateScore } from "@/lib/logic/score";

interface TaskCardProps {
  task: Task;
  isDarkMode: boolean;
  lang: Language;
  onUpdate: (
    id: string,
    field: keyof Task,
    value: string | number | Layer | Category,
  ) => void;
  onRemove: (id: string) => void;
}

export default function TaskCard({
  task,
  isDarkMode,
  lang,
  onUpdate,
  onRemove,
}: TaskCardProps) {
  const totalScore = calculateScore(task);
  const layerInfo = LAYER_MAP[task.layer];
  // --- 1. スタイル定数の整理 ---
  const theme = {
    cardBg: isDarkMode ? "rgba(30, 41, 59, 0.7)" : "#ffffff",
    text: isDarkMode ? "#f8fafc" : "#0f172a",
    subText: isDarkMode ? "#94a3b8" : "#64748b",
    border: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#e2e8f0",
    inputSection: isDarkMode ? "rgba(15, 23, 42, 0.5)" : "#f8fafc",
    fieldBg: isDarkMode ? "#1e293b" : "#f1f5f9",
  };
  const getScoreColor = (intensity: number, layer: Layer) => {
    const info = LAYER_MAP[layer];
    // 1. 本音(desire)は常に一定の色
    if (layer === "desire") return info.color;

    // 2. 共通：高強度（70以上）なら赤色（警告）にする
    if (intensity >= 70) return "#ef4444";

    // 3. 投資(investment)の色の変化
    if (layer === "investment") {
      if (intensity >= 50) return "#f59e0b";
      return info.color;
    }

    // 4. 締切(deadline)の色の変化
    if (layer === "deadline") {
      if (intensity >= 30) return "#fbbf24";
      return info.color;
    }

    return "#94a3b8";
  };

  const cardStyle: React.CSSProperties = {
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
    animation: "fadeIn 0.5s ease-out",
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = isDarkMode
          ? "0 20px 40px -10px rgba(0,0,0,0.7)"
          : "0 15px 30px -5px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = cardStyle.boxShadow as string;
      }}
    >
      {/* 1. カテゴリー選択セクション */}
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
              backgroundColor:
                task.category === cat
                  ? "#38bdf8"
                  : isDarkMode
                    ? "#334155"
                    : "#e2e8f0",
              color: task.category === cat ? "#0f172a" : theme.subText,
              fontWeight: "bold",
            }}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </nav>
      {/* 2. タイトル入力 & 削除ボタン */}
      <header
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
          alignItems: "center",
        }}
      >
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
          }}
        />
        <button
          onClick={() => onRemove(task.id)}
          style={{ color: theme.subText, fontSize: "1.2rem" }}
        >
          ✕
        </button>
      </header>
      {/* 3. 戦略レイヤーボタン */}
      <section style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {(Object.keys(LAYER_MAP) as Layer[]).map((layerKey) => {
            const info = LAYER_MAP[layerKey];
            const isActive = task.layer === layerKey;
            return (
              <button
                key={layerKey}
                type="button"
                onClick={() => onUpdate(task.id, "layer", layerKey)}
                style={{
                  flex: 1,
                  fontSize: "11px",
                  padding: "10px 0",
                  borderRadius: "8px",
                  border: `1px solid ${isActive ? info.color : theme.border}`,
                  backgroundColor: isActive ? info.color : "transparent",
                  color: isActive ? "#fff" : theme.subText,
                  fontWeight: "bold",
                }}
              >
                {info.icon} {info.label[lang]} {/* 👈 ここで言語を切り替え！ */}
              </button>
            );
          })}
        </div>
      </section>
      {/* 4. スライダーエリア */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          backgroundColor: theme.inputSection,
          padding: "20px",
          borderRadius: "16px",
          border: `1px solid ${theme.border}`,
        }}
      >
        <label
          style={{
            fontSize: "0.75rem",
            fontWeight: "bold",
            color: theme.subText,
          }}
        >
          {lang === "ja" ? (
            <>
              {task.layer === "deadline" && "どれくらい急ぎですか？"}
              {task.layer === "investment" && "どれくらい重要ですか？"}
              {task.layer === "desire" && "どれくらいやりたいですか？"}
            </>
          ) : (
            <>
              {task.layer === "deadline" && "How urgent is this?"}
              {task.layer === "investment" && "How important is this?"}
              {task.layer === "desire" && "How much do you want this?"}
            </>
          )}
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span
            style={{
              fontSize: "0.7rem",
              color: theme.subText,
              fontWeight: "bold",
              opacity: 0.6,
            }}
          >
            LOW
          </span>
          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <input
              type="range"
              min="0"
              max="100"
              className="custom-slider"
              value={task.intensity}
              onChange={(e) =>
                onUpdate(task.id, "intensity", parseInt(e.target.value))
              }
              style={{
                WebkitAppearance: "none",
                appearance: "none",
                width: "100%",
                height: "10px",
                borderRadius: "5px",
                cursor: "pointer",
                outline: "none",
                margin: "10px 0",
                background: `linear-gradient(to right, 
      ${getScoreColor(task.intensity, task.layer)} 0%, 
      ${getScoreColor(task.intensity, task.layer)} ${task.intensity}%, 
      ${isDarkMode ? "rgba(255,255,255,0.1)" : "#e2e8f0"} ${task.intensity}%, 
      ${isDarkMode ? "rgba(255,255,255,0.1)" : "#e2e8f0"} 100%)`,
              }}
            />
          </div>
          <span
            style={{
              fontSize: "0.7rem",
              color: getScoreColor(task.intensity, task.layer),
              fontWeight: "bold",
              letterSpacing: "0.1em",
            }}
          >
            HIGH
          </span>
          <div
            style={{
              fontSize: "1.8rem",
              minWidth: "40px",
              textAlign: "center",
            }}
          >
            {task.intensity > 80 ? "🔥" : task.intensity > 40 ? "⚡" : "💤"}
          </div>
        </div>
        <div
          style={{
            textAlign: "center",
            fontSize: "0.65rem",
            color: theme.subText,
            fontWeight: "500",
          }}
        >
          INTENSITY:{" "}
          <span style={{ color: theme.text }}>{task.intensity}%</span>
        </div>
      </section>
      {/* 5. 期日・備考入力 */}
      <footer style={{ display: "flex", gap: 10, marginTop: 15 }}>
        <input
          type="date"
          value={task.deadline || ""}
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
          value={task.description || ""}
          onChange={(e) => onUpdate(task.id, "description", e.target.value)}
          style={{
            flex: 2,
            padding: "8px",
            fontSize: "0.75rem",
            backgroundColor: theme.fieldBg,
            border: `1px solid ${theme.border}`,
            borderRadius: "6px",
            color: theme.text,
          }}
        />
      </footer>
    </div>
  );
}
