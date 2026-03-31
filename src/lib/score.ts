import { Task, AppraisalMode, Category, Layer } from '@/lib/types';

/* スコア計算に使用する定数定義 */
const SCORE_CONFIG = {
  CATEGORY_BONUS: {
    work: 20,
    study: 10,
    private: 0,
    other: 0,
  } as Record<Category, number>,

  LAYER_MULTIPLIERS: {
    sweet: { deadline: 1.1, investment: 1.2, desire: 1.6 },
    normal: { deadline: 1.5, investment: 1.2, desire: 1.0 },
    spicy: { deadline: 2.0, investment: 1.2, desire: 0.5 },
  } as Record<AppraisalMode, Record<Layer, number>>,

  // 3. 不動産モード専用：実務リスク加点（propflowタスクのみ適用）
  // critical(+200)にすることで、他の要素がどうあれ最上位に固定される
 ESTATE_RISK_TABLE: {
    critical: 200, // 緊急事態（漏水等）
    facility: 80,  // 設備故障
    owner:    60,  // オーナー対応（重要）
    legal:    40,  // 契約・法務
    claim:    30,  // 入居者苦情
    routine:  10,  // 事務処理
    noise:    5,   // 感情的入電
    none:     0
  } as Record<string, number>,

  PRIVATE_ADJUSTMENT: 0.85,  // 現実主義補正（15%カット）

  DEADLINE_BONUS_OVER: 50,
  DEADLINE_BONUS_NEAR: { normal: 20, spicy: 40 },
} as const;


export const calculateScore = (
  task: Task,
  mode: AppraisalMode = "normal",
): number => {
 // --- 1. 基礎データの抽出 ---
  const { intensity, category, layer, source, deadline } = task;

  // --- 2. 主観セクション（すべてのタスクに適用） ---
  const multiplier = SCORE_CONFIG.LAYER_MULTIPLIERS[mode][layer];
  const categoryBonus = SCORE_CONFIG.CATEGORY_BONUS[category] ?? 0;
  
  // 基本スコア = (重み + カテゴリ) × モード倍率
  let score = (intensity + categoryBonus) * multiplier;

  // プライベートタスクへの現実主義補正（甘口以外）
  if (mode !== "sweet" && category === "private") {
    score *= SCORE_CONFIG.PRIVATE_ADJUSTMENT;
  }

  // --- 3. 客観・実務セクション（混同防止：不動産モードのみ） ---
  if (source === 'propflow') {
    // 不動産固有のカテゴリ（critical等）があれば、絶対値を加算して「神棚」に上げる
    score += (SCORE_CONFIG.ESTATE_RISK_TABLE[category] || 0);
  }

  // --- 4. 共通の期限ボーナス ---
  if (deadline) {
    score += calculateDeadlineBonus(deadline, mode);
  }

  return Math.round(score);
};

const calculateDeadlineBonus = (
  deadline: string,
  mode: AppraisalMode,
): number => {
  const today = new Date();
  const limit = new Date(deadline);
  today.setHours(0, 0, 0, 0);
  limit.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((limit.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return SCORE_CONFIG.DEADLINE_BONUS_OVER;
  if (diffDays <= 3) {
    return mode === "spicy" ? SCORE_CONFIG.DEADLINE_BONUS_NEAR.spicy : SCORE_CONFIG.DEADLINE_BONUS_NEAR.normal;
  }
  return 0;
};

export const sortTasks = (tasks: Task[], mode: AppraisalMode = "normal"): Task[] => {
  return [...tasks].sort((a, b) => calculateScore(b, mode) - calculateScore(a, mode));
};

/**
 * 【新設】全タスクの分析集計関数（Result画面用）
 * 既存のロジックに影響を与えず、末尾に追加
 */
export const getTaskAnalytics = (tasks: Task[]) => {
  const total = tasks.length;
  if (total === 0) return null;

  const stats = tasks.reduce((acc, task) => {
  acc.layerDist[task.layer]++;
    acc.energySum += task.energyRequired || 0;
    acc.impactSum += task.impactValue || 0;
    acc.minutesSum += task.estimatedMinutes || 0;
    return acc;
  }, {
    layerDist: { deadline: 0, investment: 0, desire: 0 } as Record<Layer, number>,
    energySum: 0,
    impactSum: 0,
    minutesSum: 0
  });

  return {
    distribution: {
      deadline: (stats.layerDist.deadline / total) * 100,
      investment: (stats.layerDist.investment / total) * 100,
      desire: (stats.layerDist.desire / total) * 100
    },
    averages: {
      energy: stats.energySum / total,
      impact: stats.impactSum / total
    },
    totalTime: stats.minutesSum,
    count: total
  };
};