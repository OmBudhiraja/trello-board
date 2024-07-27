import express from 'express';
import { login, logout, signup } from '../controllers/auth';
import protect from '../middleware/auth';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', protect, logout);

export default router;
