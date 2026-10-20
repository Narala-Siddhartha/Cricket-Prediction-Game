import { Router } from 'express';
import { z } from 'zod';
import { requireAdmin, requireAuth } from '../middleware/auth.middleware.js';
import { ContestMatch } from '../models/contestMatch.model.js';
import { User } from '../models/user.model.js';
import { searchCurrentAndUpcomingMatches } from '../services/cricketApi.service.js';
import { settleContest } from '../services/contest.service.js';
import { AppError, asyncHandler } from '../utils/appError.js';

const router = Router();
router.use(requireAuth, requireAdmin);

const approvalSchema = z.object({ status: z.enum(['approved', 'rejected']) });
const contestSchema = z.object({
  apiMatchId: z.string().min(1),
  name: z.string().min(1),
  matchType: z.string().optional(),
  venue: z.string().optional(),
  dateTimeGMT: z.coerce.date(),
  teams: z.array(z.object({ name: z.string().min(1), shortName: z.string().optional() })).min(2).max(2),
  apiStatus: z.string().optional(),
  lockAt: z.coerce.date(),
  winPoints: z.coerce.number().min(0),
  lossPoints: z.coerce.number().min(0)
}).refine((data) => data.lockAt < data.dateTimeGMT, {
  message: 'Lock time must be before match start',
  path: ['lockAt']
});

router.get('/users', asyncHandler(async (_req, res) => {
  const users = await User.find({ role: 'user' }).select('-passwordHash').sort({ createdAt: -1 });
  res.json({ users });
}));

router.patch('/users/:id/status', asyncHandler(async (req, res) => {
  const { status } = approvalSchema.parse(req.body);
  const user = await User.findOneAndUpdate({ _id: req.params.id, role: 'user' }, { status }, { new: true }).select('-passwordHash');
  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.json({ user });
}));

router.get('/api-matches', asyncHandler(async (req, res) => {
  const searchSchema = z.object({ q: z.string().trim().max(80).optional().default('') });
  const { q } = searchSchema.parse(req.query);
  const matches = await searchCurrentAndUpcomingMatches(q);
  res.json({ matches });
}));

router.post('/contests', asyncHandler(async (req, res) => {
  const payload = contestSchema.parse(req.body);
  const contest = await ContestMatch.findOneAndUpdate(
    { apiMatchId: payload.apiMatchId },
    { ...payload, createdBy: req.user._id, status: 'scheduled', isActive: true },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.status(201).json({ contest });
}));

router.get('/contests', asyncHandler(async (_req, res) => {
  const contests = await ContestMatch.find().sort({ dateTimeGMT: -1 });
  res.json({ contests });
}));

router.post('/contests/:id/sync-result', asyncHandler(async (req, res) => {
  const contest = await ContestMatch.findById(req.params.id);
  if (!contest) {
    throw new AppError('Contest not found', 404);
  }
  const updated = await settleContest(contest);
  res.json({ contest: updated });
}));

router.get('/profile-requests', asyncHandler(async (_req, res) => {
  const users = await User.find({ 'pendingUpdate.status': 'pending' }).sort({ 'pendingUpdate.requestedAt': -1 });
  const requests = users.map((u) => ({
    userId: u._id,
    currentName: u.name,
    email: u.email,
    avatar: u.avatar || 'cric-captain',
    requestedName: u.pendingUpdate?.name || null,
    hasPasswordChange: Boolean(u.pendingUpdate?.passwordHash),
    requestedAt: u.pendingUpdate?.requestedAt
  }));
  res.json({ requests });
}));

router.post('/profile-requests/:id/approve', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.pendingUpdate?.status !== 'pending') {
    throw new AppError('No pending profile request found for this user', 404);
  }
  if (user.pendingUpdate.name) {
    user.name = user.pendingUpdate.name;
  }
  if (user.pendingUpdate.passwordHash) {
    user.passwordHash = user.pendingUpdate.passwordHash;
  }
  user.pendingUpdate = { name: null, passwordHash: null, requestedAt: null, status: 'none' };
  await user.save();
  res.json({ message: 'Profile changes approved successfully.', user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
}));

router.post('/profile-requests/:id/reject', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.pendingUpdate?.status !== 'pending') {
    throw new AppError('No pending profile request found for this user', 404);
  }
  user.pendingUpdate = { name: null, passwordHash: null, requestedAt: null, status: 'none' };
  await user.save();
  res.json({ message: 'Profile change request rejected.' });
}));

export default router;
