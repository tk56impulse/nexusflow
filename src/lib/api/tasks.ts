import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Task } from '@/lib/types';

const TASKS_COLLECTION = 'tasks';

/**
 * 全タスクを取得
 * 引数がない場合は 'default' ユーザーのデータを参照する
 */
export const getTasks = async (userId: string = 'default'): Promise<Task[]> => {
  const tasksQuery = query(
    collection(db, `users/${userId}/${TASKS_COLLECTION}`),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(tasksQuery);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Task[];
};

/**
 * 新規タスク作成
 */
export const createTask = async (task: Omit<Task, 'id'>, userId: string = 'default'): Promise<string> => {
  const docRef = await addDoc(collection(db, `users/${userId}/${TASKS_COLLECTION}`), {
    ...task,
    createdAt: Date.now()
  });
  return docRef.id;
};

/**
 * タスク更新（完了フラグなど）
 */
export const updateTask = async (taskId: string, updates: Partial<Task>, userId: string = 'default'): Promise<void> => {
  const taskRef = doc(db, `users/${userId}/${TASKS_COLLECTION}`, taskId);
  await updateDoc(taskRef, updates);
};

/**
 * タスク削除
 */
export const deleteTask = async (taskId: string, userId: string = 'default'): Promise<void> => {
  const taskRef = doc(db, `users/${userId}/${TASKS_COLLECTION}`, taskId);
  await deleteDoc(taskRef);
};