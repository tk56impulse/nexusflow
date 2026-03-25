export type AppraisalMode = 'sweet' | 'normal' | 'spicy';
export type Layer = 'deadline' | 'investment' | 'desire';
export type Category = 'work' | 'study' | 'private' | 'other'
  | 'critical'   // 漏水・火災等の緊急事態
  | 'facility'   // 設備故障（インフラ）
  | 'owner'      // オーナー対応（重要）
  | 'legal'      // 契約・法務・重説
  | 'claim'      // 入居者苦情・騒音
  | 'routine'    // 事務処理・巡回
  | 'noise';     // 感情的入電
export type Language = 'ja' | 'en';

export interface BaseTask {
  id: string;
  title: string;
  description?: string;
  createdAt: number;
  status: 'pending' | 'completed';
  deadline?: string;
  category: Category;
  layer: Layer;
  intensity: number; // 既存：強度 (0-100)

  // --- 【追加】分析・ポートフォリオ用の数値属性 ---
  energyRequired: number;   // 消費エネルギー (0-100)
  impactValue: number;      // 重要度・価値 (0-100)
  estimatedMinutes: number; // 見積もり時間 (分)
}

// アプリ固有のメタデータ
export interface PropFlowMetadata {
  approverIds: string[];
  siteLocation: string;
}

export interface LogicDeckMetadata {
  logicId?: string;
  priorityScore: number;
}

// PropFlow専用の型定義
export interface PropFlowTask extends BaseTask {
  source: 'propflow';
  metadata: PropFlowMetadata;
}

// LogicDeck専用の型定義
export interface LogicDeckTask extends BaseTask {
  source: 'logicdeck';
  metadata: LogicDeckMetadata;
}

// 「NexusFlow」の共通型
export type Task = PropFlowTask | LogicDeckTask;

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