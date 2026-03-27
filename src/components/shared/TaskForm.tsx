"use client";

import { useState } from 'react';
import { Task, Category, Layer } from '@/lib/types';

type Props = {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
};

export default function TaskForm({ onAddTask }: Props) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('work');
  const [layer, setLayer] = useState<Layer>('deadline'); // 仮のデフォルト

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

onAddTask({
  title,
  category,
  layer,
  intensity: 50,
  status: 'pending',
  source: 'logicdeck',
  // --- ここから不足分を追加 ---
  energyRequired: 3,     // 1~5などの数値
  impactValue: 3,        // 影響度
  estimatedMinutes: 30,  // 作業予定時間
  reach: 1,              // 到達範囲
  confidence: 1,         // 確信度
  // -----------------------
  metadata: {
    logicId: 'temp-id',
    priorityScore: 0,
  }
});
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '16px', marginBottom: 20 }}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="新しいタスクを入力..."
        style={{ width: '100%', padding: '10px', marginBottom: 10 }}
      />
      <div style={{ display: 'flex', gap: 10 }}>
        {/* カテゴリ選択などは必要に応じてボタンで追加 */}
        <button type="submit">タスクを追加</button>
      </div>
    </form>
  );
}