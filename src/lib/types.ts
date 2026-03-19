export type AppraisalMode = 'sweet' | 'normal' | 'spicy';
export type Layer = 'deadline' | 'investment' | 'desire';
export type Category = 'work' | 'study' | 'private' | 'other';
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
  intensity: number;
}

// アプリ固有のメタデータのみを分離
export interface PropFlowMetadata {
  approverIds: string[];
  siteLocation: string;
}

export interface LogicDeckMetadata {
  logicId?: string;
  priorityScore: number;
}

//PropFlow専用の型定義
export interface PropFlowTask extends BaseTask {
  source: 'propflow';
  metadata: PropFlowMetadata;
}
// LogicDeck専用の型定義
export interface LogicDeckTask extends BaseTask {
  source: 'logicdeck';
  metadata: LogicDeckMetadata;
}


// 共通型を構成する
export interface PropFlowTask extends BaseTask {
  source: 'propflow';
  metadata: PropFlowMetadata;
}

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