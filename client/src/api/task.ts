import { Task, User } from '@/types';
import apiClient from './client';

type TaskRes = {
  tasks: Task[];
};

export async function getTasks() {
  const res = await apiClient.get<TaskRes>('/tasks');
  return res.data;
}
