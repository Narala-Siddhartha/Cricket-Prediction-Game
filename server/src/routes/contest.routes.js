import { Router } from 'express';
import { z } from 'zod';
import { requireApproved, requireAuth } from '../middleware/auth.middleware.js';
import { ContestMatch } from '../models/contestMatch.model.js';
import { Prediction } from '../models/prediction.model.js';
import { submitPrediction } from '../services/contest.service.js';
import { asyncHandler } from '../utils/appError.js';

const router = Router();
router.use(requireAuth, requireApproved);

const predictionSchema = z.object({ predictedWinner: z.string().min(1) });

router.get('/', asyncHandler(async (req, res) => {
  const contests = await ContestMatch.find({ isActive: true }).sort({ dateTimeGMT: 1 });
  const predictions = await Prediction.find({ user: req.user._id, contestMatch: { $in: contests.map((contest) => contest._id) } });
  res.json({ contests, predictions });
}));

router.post('/:id/predictions', asyncHandler(async (req, res) => {
  const payload = predictionSchema.parse(req.body);
  const prediction = await submitPrediction({
    userId: req.user._id,
    contestId: req.params.id,
    predictedWinner: payload.predictedWinner
  });
  res.status(201).json({ prediction });
}));

router.get('/my-predictions', asyncHandler(async (req, res) => {
  const predictions = await Prediction.find({ user: req.user._id })
    .populate('contestMatch')
    .sort({ createdAt: -1 });
  res.json({ predictions });
}));

export default router;
