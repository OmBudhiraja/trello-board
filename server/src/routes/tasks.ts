import express from 'express';
import { createTask, getTasks, handleReorder, updateTask } from '../controllers/tasks';
import protect from '../middleware/auth';

const router = express.Router();

router.get('/', protect, getTasks);
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
router.put('/reorder/:id', protect, handleReorder);

export default router;
