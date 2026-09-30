import { Request, Response, NextFunction } from 'express';
import { LoginSchema } from '../validations/submission.schema';
import { login } from '../services/auth.service';

export async function loginHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Validate
    const validation = LoginSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: validation.error.errors[0].message,
      });
      return;
    }

    // Login
    const result = await login(validation.data);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('salah')) {
        res.status(401).json({
          success: false,
          error: error.message,
        });
        return;
      }
    }
    next(error);
  }
}
