export type Layer = 'deadline' | 'investment' | 'desire';
export type Category = 'work' | 'study' | 'private' | 'other'


export type Language = 'ja' | 'en';

export interface Task {
  id: string;
  title: string;
  description?: string;
  createdAt: number;
  status: 'pending' | 'completed';
  deadline?: string;
  category: Category;
  layer: Layer;
  
  // RICE+S 入力指標 (BaseTaskから継承)
  reach: number;           // 影響範囲 (0.1 - 10)
  impactValue: number;     // インパクト (0 - 100)
  confidence: number;      // 確信度 (0 - 100)
  energyRequired: number;  // 消費エネルギー (1 - 100)
  intensity: number;       // 強度・事態の重さ (0 - 100)
  
  estimatedMinutes: number;

  // 計算済みスコア
  xScore?: number;         // Efficiency
  yScore?: number;         // Value
  zPriority: number;       // Urgency (ソートの主軸)
}



export interface LayerInfo {
  label: Record<Language, string>;
  icon: string;
  color: string;
}

export const LAYER_MAP: Record<Layer, LayerInfo> = {
  deadline: {
    label: { ja: "外部締切 (MUST)", en: "Deadline (MUST)" },
    icon: "🚨",
    color: "#EF4444",
  },
  investment: {
    label: { ja: "自己投資 (SHOULD)", en: "Investment (SHOULD)" },
    icon: "📈",
    color: "#3B82F6",
  },
  desire: {
    label: { ja: "本音・願望 (WANT)", en: "Desire (WANT)" },
    icon: "🌟",
    color: "#10B981",
  },
};