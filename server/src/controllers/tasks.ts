import type { Request, Response } from 'express';
import TaskModel, { priorityEnum, statusEnum } from '../models/taskModel';
import { z } from 'zod';
import { validate } from '../middleware/validation';

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user;
    // find user with the email
    const tasks = await TaskModel.find({
      userId,
    });

    res.json({ tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createTaskSchema = z
  .object({
    title: z.string().min(2),
    description: z.string().optional(),
    status: z.enum(statusEnum),
    priority: z.enum(priorityEnum).optional(),
    deadline: z.date().optional(),
    position: z.number(),
    content: z.string(),
  })
  .strict();

export const createTask = async (req: Request, res: Response) => {
  const { sucess, body } = validate(createTaskSchema, req, res);

  if (!sucess) {
    return;
  }

  const user = req.user;

  if (!user) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }

  const newTask = await TaskModel.create({
    ...body,
    userId: user,
  });

  res.status(201).json({ task: newTask });
};
