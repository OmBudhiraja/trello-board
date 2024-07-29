import { Task, User } from '@/types';
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
