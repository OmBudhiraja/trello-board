import express from 'express';
import { createTask, getTasks, updateTask } from '../controllers/tasks';
import protect from '../middleware/auth';

const router = express.Router();

router.get('/', protect, getTasks);
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);

export default router;
