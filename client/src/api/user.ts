import { User } from '@/types';
import apiClient from './client';

type UserRes = {
  user: User;
};

export async function signup(data: { name: string; email: string; password: string }) {
  const res = await apiClient.post<UserRes>('/auth/signup', data);
  return res.data;
}

export async function login(data: { email: string; password: string }) {
  const res = await apiClient.post<UserRes>('/auth/login', data);
  return res.data;
}

export async function getMe() {
  const res = await apiClient.get<UserRes>('/auth/me');
  return res.data;
}

export async function logout() {
  await apiClient.post('/auth/logout');
}
