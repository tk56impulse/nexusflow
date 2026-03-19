import { Task, Layer, Category, Language, LAYER_MAP, LogicDeckTask, PropFlowTask } from "@/lib/types"; 
import { calculateScore } from "@/lib/logic/score";


interface TaskCardProps {
  task: Task;
  isDarkMode: boolean;
  lang: Language;
  onUpdate: (
    id: string,
    field: keyof Task,
    value: Task[keyof Task]
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
const isLogicDeck = task.source === 'logicdeck';
  const intensityValue = isLogicDeck ? (task as LogicDeckTask).metadata.intensity : 0;

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
  const getScoreColor = (intensity: number) => {
    // ネオンブルー・グレー基調の配色
    if (intensity >= 80) return "#22d3ee"; // Cyan (High)
    if (intensity >= 40) return "#38bdf8"; // Sky Blue (Medium)
    return "#94a3b8"; // Slate (Low)
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
              backgroundColor:task.category === cat ? "#38bdf8"
                  : (isDarkMode ? "#334155": "#e2e8f0"),
              color: task.category === cat ? "#0f172a" : theme.subText,
              fontWeight: "bold",
              cursor: "pointer",
              border: "none",
            }}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </nav>
      {/* 2. タイトル入力 & 削除ボタン */}
      <header style={{
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
      {isLogicDeck && (
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          backgroundColor: theme.inputSection,
          padding: "16px 20px",
          borderRadius: "16px",
          border: `1px solid ${theme.border}`,
        }}
      >
        <label style={{
            fontSize: "0.7rem",
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
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              fontSize: "0.7rem",
              color: theme.subText,
              fontWeight: "bold",
              width: "30px",
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
              value={intensityValue}
              onChange={(e) =>{
              const val = parseInt(e.target.value);
                  onUpdate(task.id, "metadata", {
                    ...(task as LogicDeckTask).metadata,
                    intensity: val
                  });
              }}
              style={{
                WebkitAppearance: "none",
                appearance: "none",
                width: "100%",
                height: "10px",
                borderRadius: "6px",
                cursor: "pointer",
                outline: "none",
                margin: 0,
                background: `linear-gradient(to right, 
      ${getScoreColor(intensityValue)} 0%, 
      ${getScoreColor(intensityValue)} ${intensityValue}%, 
      ${isDarkMode ? "rgba(255,255,255,0.1)" : "#e2e8f0"} ${intensityValue}%, 
      ${isDarkMode ? "rgba(255,255,255,0.1)" : "#e2e8f0"} 100%)`,
              }}
            />
          </div>
          <div
            style={{
              fontSize: "1.1rem",
              color: getScoreColor(intensityValue),
              fontWeight: "bold",
              minWidth: "45px",
              textAlign: "right",
              fontFamily: "monospace",
              textShadow: isDarkMode
                ? `0 0 10px ${getScoreColor(intensityValue)}`
                : "none",
              transition: "color 0.3s",
            }}
          >
            {intensityValue}%
          </div>
        </div>
      </section>
      )}
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
