export type AppraisalMode = 'sweet' | 'normal' | 'spicy';
export type Layer = 'deadline' | 'investment' | 'desire';
export type Category = 'work' | 'study' | 'private' | 'other';
export type Language = 'ja' | 'en';

export interface LayerInfo {
  label: Record<Language, string>;
  icon: string;
  color: string;
}

export interface BaseTask {
  id: string;
  title: string;
  description?: string;
  createdAt: number;
  status: 'pending' | 'completed' | 'archived';
  deadline?: string;
  category: Category;
  layer: Layer;
  // intensity はアプリ固有（LogicDeck）なのでここからは削除
}

// 【PropFlow専用】不動産管理に必要なデータ
export interface PropFlowMetadata {
  approverIds: string[];
  siteLocation: string;
  subStatus: string; // 例: '内見予約', '契約準備中' など
}

// 【LogicDeck専用】ロジック計算に必要なデータ
export interface LogicDeckMetadata {
  logicId?: string;
  priorityScore: number;
  intensity: number; // 👈 ここ（メタデータ内）に移動
  subStatus: 'draft' | 'calculated' | 'reviewed';
}

// 以下、結合部分は今のままで完璧です
export interface PropFlowTask extends BaseTask {
  source: 'propflow';
  metadata: PropFlowMetadata;
}

export interface LogicDeckTask extends BaseTask {
  source: 'logicdeck';
  metadata: LogicDeckMetadata;
}

export type Task = PropFlowTask | LogicDeckTask;

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