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
    }).sort({ position: 1 });

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
    deadline: z.coerce.date().optional(),
    position: z.number(),
    content: z.string().optional(),
  })
  .strict();

export const createTask = async (req: Request, res: Response) => {
  try {
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateTaskSchema = z
  .object({
    _id: z.string(),
    title: z.string().min(2),
    description: z.string().optional(),
    status: z.enum(statusEnum),
    priority: z.enum(priorityEnum).optional(),
    deadline: z.coerce.date().optional(),
    position: z.number(),
    content: z.string().optional(),
  })
  .strict();

export async function updateTask(req: Request, res: Response) {
  try {
    const { sucess, body } = validate(updateTaskSchema, req, res);

    if (!sucess) {
      return;
    }

    const user = req.user;

    if (!user) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    const task = await TaskModel.findOne({ userId: user._id.toString(), _id: body._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.title = body.title;
    task.description = body.description;
    task.status = body.status;
    task.priority = body.priority;
    task.deadline = body.deadline;
    task.position = body.position;
    task.content = body.content;

    await task.save();

    res.json({ task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const updatePositionAndStatusSchema = z.object({
  status: z.enum(statusEnum),
  position: z.number(),
  sameColumn: z.boolean(),
  sourceTasks: z.array(
    z.object({
      _id: z.string(),
      position: z.number(),
    })
  ),
  destinationTasks: z.array(
    z.object({
      _id: z.string(),
      position: z.number(),
    })
  ),
});

export async function handleReorder(req: Request, res: Response) {
  try {
    const taskId = req.params.id;
    const { sucess, body } = validate(updatePositionAndStatusSchema, req, res);

    if (!sucess) {
      return;
    }

    const user = req.user;

    if (!user) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    await TaskModel.updateOne(
      { userId: user._id.toString(), _id: taskId },
      { position: body.position, status: body.status }
    );

    const tasksToUpdate = body.sameColumn
      ? body.sourceTasks
      : [...body.sourceTasks, ...body.destinationTasks];

    await Promise.all(
      tasksToUpdate.map((task) => {
        return TaskModel.updateOne(
          { userId: user._id.toString(), _id: task._id },
          { position: task.position }
        );
      })
    );

    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
