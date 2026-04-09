
import { useState, useEffect } from 'react';
import { Task } from '@/lib/types'; // @lib/types/index.ts を参照
import { getTasks, createTask } from '@/lib/api/tasks';

/*
 * タスク一覧の取得・追加を管理するカスタムフック
 * LocalStorage を廃止し、DB API版へ完全移行
 */

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 1. 初期ロード
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const data = await getTasks();
      setTasks(data as unknown as Task[]);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to fetch tasks'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 2. タスク追加
  const addTask = async (taskData: Parameters<typeof createTask>[0]) => {
    try {
      const newTask = await createTask(taskData);
      // 保存に成功したら一覧を再取得
      await fetchTasks();
      return newTask;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to create task');
      setError(err);
      throw err;
    }
  };

  // 初期ロードの実行
  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    isLoading,
    error,
    addTask,
    refresh: fetchTasks,
  };
}
