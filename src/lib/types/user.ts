export type AppraisalMode = 'sweet' | 'normal' | 'spicy';

export interface UserScoreWeights {
  reachWeight: number;      // 影響範囲をどれくらい重視するか
  impactWeight: number;     // 重要度をどれくらい重視するか
  mentalCostWeight: number; // 精神コストをどれくらい避けるか
  riskWeight: number;       // 収支リスクをどれくらい重視するか
}

export interface User {
  uid: string;
  appraisalMode: AppraisalMode;
  weights: UserScoreWeights;
  actualMinutes?: number;
}