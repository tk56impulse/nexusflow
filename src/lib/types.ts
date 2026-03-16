export type AppraisalMode = 'sweet' | 'normal' | 'spicy';
export type Layer = 'deadline' | 'investment' | 'desire';
export type Category = 'work' | 'study' | 'private' | 'other';

export interface BaseTask {
  id: string;
  title: string;
  createdAt: Date;
  status: 'pending' | 'completed';
  deadline?: string;
  // どのアプリ由来でも共通でUIに表示するもの
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
  logicId: string;
  priorityScore: number;
}

/* PropFlow専用の型定義
export interface PropFlowTask extends BaseTask {
  source: 'propflow';
  intensity: number;
  category: Category;
  layer: Layer;
  metadata: {
    approverIds: string[];
    siteLocation: string;
  };
}

// LogicDeck専用の型定義
export interface LogicDeckTask extends BaseTask {
  source: 'logicdeck';
  metadata: {
    logicId: string;
    priorityScore: number; // 計算後のスコアを格納する想定
    intensity: number;
    category: Category;
    layer: Layer;
  };
}
  */

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