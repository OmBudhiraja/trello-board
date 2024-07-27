import { type ZodSchema } from 'zod';
import { type Request, type Response } from 'express';

export function validate<T>(
  schema: ZodSchema<T>,
  req: Request,
  res: Response
): { sucess: boolean; body: T } {
  const bodyParser = schema.safeParse(req.body);

  if (!bodyParser.success) {
    res.status(400).json({
      message: 'Invalid request body',
      error: bodyParser.error.flatten(),
    });
  }

  return { sucess: bodyParser.success, body: bodyParser.data! };
}
