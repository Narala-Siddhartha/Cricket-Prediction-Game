import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.middleware.js';
import { loginUser, registerUser, toSafeUser } from '../services/auth.service.js';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';
import { AppError, asyncHandler } from '../utils/appError.js';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8),
  avatar: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const avatarSchema = z.object({
  avatar: z.string().min(1).max(100)
});

const profileRequestSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  currentPassword: z.string().min(1).optional(),
  newPassword: z.string().min(8).optional()
}).refine((data) => data.name || data.newPassword, {
  message: 'Please provide either a new name or a new password to request changes.'
}).refine((data) => !data.newPassword || data.currentPassword, {
  message: 'Current password is required to change your password.',
  path: ['currentPassword']
});

router.post('/register', asyncHandler(async (req, res) => {
  const payload = registerSchema.parse(req.body);
  const user = await registerUser(payload);
  res.status(201).json({ user, message: 'Registration submitted. Admin approval is required before playing.' });
}));

router.post('/login', asyncHandler(async (req, res) => {
  const payload = loginSchema.parse(req.body);
  const result = await loginUser(payload);
  res.json(result);
}));

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: toSafeUser(req.user) });
});

router.patch('/avatar', requireAuth, asyncHandler(async (req, res) => {
  const payload = avatarSchema.parse(req.body);
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: payload.avatar },
    { new: true }
  );
  if (!updatedUser) {
    throw new AppError('User not found', 404);
  }
  res.json({ user: toSafeUser(updatedUser), message: 'Avatar updated successfully.' });
}));

router.post('/profile-request', requireAuth, asyncHandler(async (req, res) => {
  const payload = profileRequestSchema.parse(req.body);
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  let hashedNewPassword = null;
  if (payload.newPassword) {
    const isMatch = await bcrypt.compare(payload.currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Current password is incorrect.', 400);
    }
    hashedNewPassword = await bcrypt.hash(payload.newPassword, 12);
  }

  user.pendingUpdate = {
    name: payload.name ? payload.name.trim() : null,
    passwordHash: hashedNewPassword,
    requestedAt: new Date(),
    status: 'pending'
  };

  await user.save();
  res.json({ user: toSafeUser(user), message: 'Profile change request submitted for admin approval.' });
}));

router.delete('/profile-request', requireAuth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  user.pendingUpdate = {
    name: null,
    passwordHash: null,
    requestedAt: null,
    status: 'none'
  };
  await user.save();
  res.json({ user: toSafeUser(user), message: 'Pending profile change request cancelled.' });
}));

export default router;
