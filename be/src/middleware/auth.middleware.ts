import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export async function verifyAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Token tidak ditemukan',
      });
      return;
    }

    const token = authHeader.substring(7);

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      res.status(401).json({
        success: false,
        error: 'Token tidak valid',
      });
      return;
    }

    // Attach user to request
    req.user = {
      id: data.user.id,
      email: data.user.email!,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Autentikasi gagal',
    });
  }
}
