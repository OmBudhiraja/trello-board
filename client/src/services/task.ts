import { Task, TaskStatus } from '@/types';
import apiClient from './client';

export async function getTasks() {
  const res = await apiClient.get<{ tasks: Task[] }>('/tasks');
  return res.data;
}

export async function createTask(task: Partial<Task>) {
  const res = await apiClient.post<{ task: Task }>('/tasks', task);
  return res.data;
}

export async function updateTask(task: Partial<Task>) {
  const res = await apiClient.put<{ task: Task }>(`/tasks/${task._id}`, task);
  return res.data;
}

export async function deleteTask(id: string) {
  const res = await apiClient.delete<{ taskId: string }>(`/tasks/${id}`);
  return res.data;
}

type ReorderTask = {
  _id: string;
  position: number;
};

export async function reorderTasks({
  id,
  status,
  position,
  sourceTasks,
  destinationTasks,
  sameColumn,
}: {
  id: string;
  status: TaskStatus;
  position: number;
  sourceTasks: ReorderTask[];
  destinationTasks: ReorderTask[];
  sameColumn: boolean;
}) {
  const res = await apiClient.put(`/tasks/reorder/${id}`, {
    status,
    position,
    sourceTasks,
    destinationTasks,
    sameColumn,
  });
  return res.data;
}
