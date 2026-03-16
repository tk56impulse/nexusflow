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
  // metadata を追加する
  metadata: {
    logicId: 'temp-id', // 必要に応じて生成してください、後で修正予定
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