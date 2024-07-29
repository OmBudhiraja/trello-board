import { type TaskStatus, type Task } from '@/types';

export function transformTaskList({ tasks }: { tasks: Task[] }) {
  return tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);
}
