import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';

export async function ensureAdminUser() {
  const email = (process.env.ADMIN_EMAIL || 'admin@cricket.local').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Admin@12345';
  const name = process.env.ADMIN_NAME || 'Admin';
  const passwordHash = await bcrypt.hash(password, 12);

  await User.findOneAndUpdate(
    { email },
    { name, email, passwordHash, role: 'admin', status: 'approved' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}
