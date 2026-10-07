import mongoose from 'mongoose';
import { ContestMatch } from '../models/contestMatch.model.js';
import { Prediction } from '../models/prediction.model.js';
import { User } from '../models/user.model.js';
import { AppError } from '../utils/appError.js';
import { extractWinner, fetchMatchInfo } from './cricketApi.service.js';

export async function settleContest(contest) {
  const matchInfo = await fetchMatchInfo(contest.apiMatchId);
  const result = extractWinner(matchInfo);

  if (!result.completed) {
    return contest;
  }

  const session = await mongoose.startSession();
  let updatedContest;

  await session.withTransaction(async () => {
    updatedContest = await ContestMatch.findByIdAndUpdate(
      contest._id,
      {
        status: result.winnerTeam ? 'completed' : 'cancelled',
        winnerTeam: result.winnerTeam,
        resultText: result.resultText,
        apiStatus: matchInfo?.apiStatus || contest.apiStatus
      },
      { new: true, session }
    );

    const predictions = await Prediction.find({ contestMatch: contest._id, outcome: 'pending' }).session(session);
    for (const prediction of predictions) {
      const outcome = result.winnerTeam ? (prediction.predictedWinner === result.winnerTeam ? 'won' : 'lost') : 'void';
      const scoreDelta = outcome === 'won' ? contest.winPoints : outcome === 'lost' ? -contest.lossPoints : 0;
      prediction.outcome = outcome;
      prediction.scoreDelta = scoreDelta;
      prediction.settledAt = new Date();
      await prediction.save({ session });

      if (scoreDelta !== 0) {
        await User.findByIdAndUpdate(prediction.user, { $inc: { totalScore: scoreDelta } }, { session });
      }
    }
  });

  await session.endSession();
  return updatedContest;
}

export async function submitPrediction({ userId, contestId, predictedWinner }) {
  const contest = await ContestMatch.findById(contestId);
  if (!contest || !contest.isActive) {
    throw new AppError('Contest not found', 404);
  }

  if (contest.status !== 'scheduled') {
    throw new AppError('This contest is no longer accepting predictions', 400);
  }

  if (new Date() >= contest.lockAt) {
    throw new AppError('Prediction window is closed', 400);
  }

  if (!contest.teams.some((team) => team.name === predictedWinner)) {
    throw new AppError('Predicted winner must be one of the contest teams', 400);
  }

  return Prediction.findOneAndUpdate(
    { user: userId, contestMatch: contestId },
    { predictedWinner, outcome: 'pending', scoreDelta: 0 },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}
