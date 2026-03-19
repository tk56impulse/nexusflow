import { useState, useEffect } from 'react';
import { Task } from '@/lib/types';
import { v4 as uuid } from 'uuid';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // 初期ロード
  useEffect(() => {
    const saved = localStorage.getItem('nexus_tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load tasks", e);
      }
    }
  }, []);

  // 保存
  useEffect(() => {
    localStorage.setItem('nexus_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const newTask: Task = {
      id: uuid() as string,
      title: "",
      description: "",
      layer: "investment",
      category: "work",
      createdAt: Date.now(),
      status: 'pending',
      source: 'logicdeck',
      deadline: new Date().toISOString().split('T')[0],
      metadata: {
        subStatus: 'draft',
        priorityScore: 0,
        intensity: 50,
      },
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = <K extends keyof Task>(id: string, field: K, value: Task[K]) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return { tasks, addTask, updateTask, removeTask };
};