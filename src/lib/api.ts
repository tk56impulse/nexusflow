// src/lib/api.ts
import { Task } from "./types";

const STORAGE_KEY = "nexusflow_tasks";

/**
 * データの保存・取得を抽象化するAPIレイヤー
 * 将来的に Supabase や Firebase に移行する際は、
 * このファイルの中身を Fetch API などに書き換えるだけで済みます。
 */
export const api = {
  // 全タスクの取得
  async fetchTasks(): Promise<Task[]> {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // タスクの保存（一括）
  async saveTasks(tasks: Task[]): Promise<void> {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },

  // 特定のタスクの更新（将来の個別更新APIを想定）
  async updateTask(updatedTask: Task): Promise<void> {
    const tasks = await this.fetchTasks();
    const newTasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    await this.saveTasks(newTasks);
  }
};