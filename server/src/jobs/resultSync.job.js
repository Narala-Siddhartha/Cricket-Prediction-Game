import cron from 'node-cron';
import { ContestMatch } from '../models/contestMatch.model.js';
import { settleContest } from '../services/contest.service.js';

export function startResultSyncJob() {
  const expression = process.env.RESULT_SYNC_CRON || '*/10 * * * *';

  cron.schedule(expression, async () => {
    const contests = await ContestMatch.find({
      status: { $in: ['scheduled', 'live'] },
      dateTimeGMT: { $lte: new Date() }
    }).limit(25);

    for (const contest of contests) {
      try {
        await settleContest(contest);
      } catch (error) {
        console.error(`Result sync failed for ${contest.apiMatchId}`, error.message);
      }
    }
  });
}
