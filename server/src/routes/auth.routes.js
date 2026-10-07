import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.middleware.js';
import { loginUser, registerUser, toSafeUser } from '../services/auth.service.js';
import { asyncHandler } from '../utils/appError.js';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
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

export default router;
