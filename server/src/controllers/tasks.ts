import type { Request, Response } from 'express';
import TaskModel from '../models/taskModel';

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
