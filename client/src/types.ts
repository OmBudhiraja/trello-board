export interface User {
  _id: string;
  name: string;
  email: string;
}

export const defaultTaskStatus = ['to do', 'in progress', 'under review', 'completed'] as const;
export const priorityOptions = ['low', 'medium', 'urgent'] as const;

export type TaskStatus = (typeof defaultTaskStatus)[number];

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: (typeof priorityOptions)[number];
  content: string;
  userId: string;
  position: number;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}
