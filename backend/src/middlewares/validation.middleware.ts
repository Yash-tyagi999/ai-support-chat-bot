import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const messageSchema = z.object({
  message: z
    .string({ required_error: 'Message text is required' })
    .trim()
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message is too long (maximum 1000 characters)'),
  sessionId: z.string().uuid('Invalid session ID format').optional().nullable(),
});

export const validateMessageInput = (req: Request, res: Response, next: NextFunction) => {
  const parseResult = messageSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: parseResult.error.errors[0].message,
    });
  }
  req.body = parseResult.data;
  next();
};
