"use client";

import { calculateScore, sortTasks } from '../lib/logic/score';
import { Task, PropFlowTask, LogicDeckTask } from '../lib/types';

const DashboardPage = () => {
  // PropFlowTask のサンプルデータ
  const propFlowTaskSample: PropFlowTask = {
    id: 'prop-1',
    source: 'propflow',
    title: 'PropFlowタスク: 新機能の承認依頼',
    createdAt: Date.now(),
    status: 'pending',
    // 3日後の日付をISO文字列で設定
    deadline: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    category: 'work',
    layer: 'deadline',
    metadata: {
      approverIds: ['user-a', 'user-b'],
      siteLocation: 'Tokyo Office',
      subStatus: '未着手',
    },
  };

  // LogicDeckTask のサンプルデータ
  const logicDeckTaskSample: LogicDeckTask = {
    id: 'logic-1',
    source: 'logicdeck',
    title: 'LogicDeckタスク: 新しいJSライブラリの調査',
    createdAt: Date.now(),
    status: 'pending',
    // 7日後の日付をISO文字列で設定
    deadline: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
      category: 'study',
      layer: 'investment',
      
    metadata: {
      logicId: 'logic-xyz-789',
      priorityScore: 0, 
      intensity: 60,
      subStatus: 'draft',
    },
  };

  const tasks: Task[] = [propFlowTaskSample, logicDeckTaskSample];

  const sortedTasks = sortTasks(tasks, 'normal');

  return (
    <main style={{ padding: '2rem' }}>
      <h1>統合ダッシュボード (プロトタイプ)</h1>
      <div style={{ marginTop: '1.5rem' }}>
        <h2>タスク一覧(スコア順)</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {sortedTasks.map((task) => {
            // 'normal' モードでスコアを計算
            const score = calculateScore(task, 'normal');
            return (
              <li key={task.id} style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '1rem', marginBottom: '0.5rem' }}>
                <p><strong>タスク名:</strong> {task.title}</p>
                <p><strong>ソース:</strong> {task.source}</p>
                <p><strong>計算スコア:</strong> <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#007bff' }}>{score}</span></p>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
};

export default DashboardPage;
