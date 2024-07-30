import { getTasks } from '@/services/task';
import { getMe } from '@/services/user';
import { transformTaskList } from '@/utils/transformTaskData';
import { useQuery } from '@tanstack/react-query';

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
    select: transformTaskList,
    refetchOnWindowFocus: false,
  });
}

export function useUserData() {
  return useQuery({
    queryKey: ['user'],
    queryFn: getMe,
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
