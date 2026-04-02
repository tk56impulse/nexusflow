"use client";
import { useState } from 'react';
import { Category } from '@/lib/types/task';
import { useTasks } from '@/hooks/useTasks';

export default function TaskForm() {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('work');
  
  // 新アルゴリズム用の数値State
  const [reach, setReach] = useState(1);
  const [impact, setImpact] = useState(50);
  const [confidence, setConfidence] = useState(100);
  const [effort, setEffort] = useState(20);
  const [severity, setSeverity] = useState(5); // 0〜10

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await addTask({
        title,
        reach,
        impact,
        confidence,
        effort,
        severity,
        deadline: new Date().toISOString().split("T")[0],
      });
      
      // 送信後にフォームをクリア
      setTitle('');
      setReach(1);
      setImpact(50);
      setConfidence(100);
      setEffort(20);
      setSeverity(5);
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ 
      padding: '24px', 
      backgroundColor: 'rgba(30, 41, 59, 0.5)', 
      border: '1px solid rgba(255, 255, 255, 0.1)', 
      borderRadius: '20px', 
      marginBottom: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="新しいタスクを入力..."
        style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#fff' }}
      />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '0.8rem', color: '#94a3b8' }}>
        <label>Reach (影響範囲): <input type="number" value={reach} onChange={e => setReach(Number(e.target.value))} style={{ width: '100%', padding: '4px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }} /></label>
        <label>Impact (インパクト): <input type="number" value={impact} onChange={e => setImpact(Number(e.target.value))} style={{ width: '100%', padding: '4px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }} /></label>
        <label>Confidence (確信度): <input type="number" value={confidence} onChange={e => setConfidence(Number(e.target.value))} style={{ width: '100%', padding: '4px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }} /></label>
        <label>Effort (工数): <input type="number" value={effort} onChange={e => setEffort(Number(e.target.value))} style={{ width: '100%', padding: '4px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }} /></label>
        
        <label>
          Severity (重さ 0-10): 
          <input 
            type="number" 
            min="0" max="10" 
            value={severity} 
            onChange={e => setSeverity(Number(e.target.value))} 
            style={{ width: '100%', padding: '4px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }} 
          />
        </label>

        <label>
          Category:
          <select 
            value={category} 
            onChange={e => setCategory(e.target.value as Category)}
            style={{ width: '100%', padding: '4px', background: '#1e293b', border: '1px solid #334155', color: '#fff' }}
          >
            <option value="work">Work</option>
            <option value="study">Study</option>
            <option value="private">Private</option>
          </select>
        </label>
      </div>

      <button 
        type="submit" 
        style={{ 
          padding: '12px', 
          backgroundColor: '#38bdf8', 
          color: '#0f172a', 
          border: 'none', 
          borderRadius: '10px', 
          fontWeight: 'bold', 
          cursor: 'pointer' 
        }}
      >
        タスクを追加
      </button>
    </form>
  );
}