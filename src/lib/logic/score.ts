import { Task, AppraisalMode, Category, Layer } from '../types';

/* スコア計算に使用する定数定義
   旧PropFlowのロジックをベースにしています。
   将来的に調整が必要になった際、ここだけを見れば良い状態にします。
*/
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

  PRIVATE_ADJUSTMENT: 0.85, // 現実主義補正（15%カット）
  DEADLINE_BONUS_NEAR: { normal: 20, spicy: 40 },
  DEADLINE_BONUS_OVER: 50,
} as const;

export const calculateScore = (
  task: Task,
  mode: AppraisalMode = "normal",
): number => {
  switch (task.source) {
    case 'logicdeck':
    case 'propflow': {
      // task.sourceに応じて、スコア計算の元となるデータを取得します。
      // これにより、データソースによる構造の違いを吸収し、以降のロジックを共通化します。
      const taskData: { intensity: number; category: Category; layer: Layer } =
        task.source === 'logicdeck' ? task.metadata : (task as any);

      // 1. ベーススコアの算出（強度 + カテゴリボーナス）
      const categoryBonus = SCORE_CONFIG.CATEGORY_BONUS[taskData.category] ?? 0;
      let score = taskData.intensity + categoryBonus;

      // 2. モードに応じたレイヤー倍率の適用
      const multiplier = SCORE_CONFIG.LAYER_MULTIPLIERS[mode][taskData.layer];
      score *= multiplier;

      // 3. カテゴリ補正（現実主義補正）
      // Sweetモード以外でPrivateタスクの場合に適用
      if (mode !== "sweet" && taskData.category === "private") {
        score *= SCORE_CONFIG.PRIVATE_ADJUSTMENT;
      }

      // 4. 期日ボーナスの計算 (deadlineはTaskの共通プロパティ)
      if (task.deadline) {
        score += calculateDeadlineBonus(task.deadline, mode);
      }

      return Math.round(score);
    }
    default: {
      // 網羅性チェック: 将来新しいTask型が追加された場合にコンパイルエラーを発生させる
      const exhaustiveCheck: never = task;
      throw new Error(`Unknown task source: ${(exhaustiveCheck as any).source}`);
    }
  }
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