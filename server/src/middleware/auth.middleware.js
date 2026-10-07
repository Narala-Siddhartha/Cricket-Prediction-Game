import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { AppError, asyncHandler } from '../utils/appError.js';

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    throw new AppError('Authentication required', 401);
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(payload.sub).select('-passwordHash');
  if (!user) {
    throw new AppError('User no longer exists', 401);
  }

  req.user = user;
  next();
});

export function requireApproved(req, _res, next) {
  if (req.user.role !== 'admin' && req.user.status !== 'approved') {
    throw new AppError('Your account is waiting for admin approval', 403);
  }
  next();
}

export function requireAdmin(req, _res, next) {
  if (req.user.role !== 'admin') {
    throw new AppError('Admin access required', 403);
  }
  next();
}
