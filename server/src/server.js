import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/db.js';
import { ensureAdminUser } from './services/admin.service.js';
import { startResultSyncJob } from './jobs/resultSync.job.js';

const port = process.env.PORT || 5000;

async function bootstrap() {
  await connectDatabase();
  await ensureAdminUser();
  startResultSyncJob();

  app.listen(port, () => {
    console.log(`API server running on http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
