import { Request, Response } from 'express';

// Hard-coded deadline: 15 Oktober 2026 23:59:59 WITA (UTC+8)
const DEADLINE = new Date('2026-10-15T23:59:59+08:00');

export const getDeadline = (_req: Request, res: Response): void => {
  const now = new Date();
  const diffMs = DEADLINE.getTime() - now.getTime();
  
  const status = diffMs > 0 ? 'open' : 'closed';
  const remainingDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  const remainingHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));

  res.json({
    deadline: DEADLINE.toISOString(),
    status,
    remainingDays,
    remainingHours,
  });
};
