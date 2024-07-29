import express from 'express';
import { getTasks } from '../controllers/tasks';
import protect from '../middleware/auth';

const router = express.Router();

router.get('/', protect, getTasks);

export default router;
