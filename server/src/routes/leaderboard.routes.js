import { Router } from 'express';
import { requireApproved, requireAuth } from '../middleware/auth.middleware.js';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/appError.js';

const router = Router();
router.use(requireAuth, requireApproved);

router.get('/', asyncHandler(async (_req, res) => {
  const users = await User.find({ role: 'user', status: 'approved' })
    .select('name email totalScore avatar')
    .sort({ totalScore: -1, name: 1 });

  res.json({
    leaderboard: users.map((user, index) => ({
      rank: index + 1,
      id: user._id,
      name: user.name,
      email: user.email,
      totalScore: user.totalScore,
      avatar: user.avatar || 'cric-captain'
    }))
  });
}));

export default router;
