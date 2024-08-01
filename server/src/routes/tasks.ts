import express from 'express';
import { createTask, deleteTask, getTasks, handleReorder, updateTask } from '../controllers/tasks';
import protect from '../middleware/auth';

const router = express.Router();

router.get('/', protect, getTasks);
router.post('/', protect, createTask);
router.put('/reorder', protect, handleReorder);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

export default router;
