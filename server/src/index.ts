import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth';
import protect from './middleware/auth';
import mongoose from 'mongoose';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());

async function main() {
  await mongoose.connect(process.env.DB_URL!);

  app.get('/', protect, async (req, res) => {
    res.json({
      message: 'hello world',
    });
  });

  app.use('/api/auth', authRouter);

  app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && (err as any).status === 400 && 'body' in err) {
      return res.status(400).json({ error: 'Invalid JSON' });
    }

    next();
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

main();
