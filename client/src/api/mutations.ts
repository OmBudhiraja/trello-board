import { useUser } from '@/components/UserProvider';
import { createTask, reorderTasks, updateTask } from '@/services/task';
import { login, logout, signup } from '@/services/user';
import { Task } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export function useAddTask({ onSuccessHandler }: { onSuccessHandler: () => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: ({ task: newTask }) => {
      toast.success('Task created successfully');

      queryClient.setQueryData(['tasks'], (oldData: { tasks: Task[] }) => {
        const updatedTasks = [...oldData.tasks, newTask];
        return { tasks: updatedTasks };
      });

      onSuccessHandler();
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTask({ onSuccessHandler }: { onSuccessHandler: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onSuccess: ({ task: updatedTask }) => {
      toast.success('Task updated successfully');

      queryClient.setQueryData(['tasks'], (oldData: { tasks: Task[] }) => {
        const updatedTasks = oldData.tasks.map((task) => {
          if (task._id === updatedTask._id) {
            return updatedTask;
          }
          return task;
        });
        return { tasks: updatedTasks };
      });

      onSuccessHandler();
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useReoderTasks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reorderTasks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useLogin() {
  const { setUser } = useUser();
  return useMutation({
    mutationFn: login,
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message || 'Something went wrong');
      } else {
        console.error(err, 'error');
        toast.error(err.message);
      }
    },
    onSuccess: (data) => {
      setUser(data.user);
      toast.success('Login successful');
    },
  });
}

export function useSignup() {
  const { setUser } = useUser();

  return useMutation({
    mutationFn: signup,
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message || 'Something went wrong');
      } else {
        console.error(err, 'error');
        toast.error(err.message);
      }
    },
    onSuccess: (data) => {
      setUser(data.user);
      toast.success('Signed up successfully');
    },
  });
}

export function useLogout() {
  const { setUser } = useUser();

  return useMutation({
    mutationFn: logout,
    onError: (err) => {
      toast.error('Something went wrong');
    },
    onSuccess: () => {
      toast.success('Logged out');
      setUser(null);
    },
  });
}
