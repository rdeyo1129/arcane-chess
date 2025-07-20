import { Request, Response, NextFunction } from 'express';
import { UserI } from '../models/User.js';

export default function authorize(allowedRoles: Array<UserI['role']>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserI | undefined;
    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}
