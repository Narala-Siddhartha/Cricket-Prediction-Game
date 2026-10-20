import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { AppError } from '../utils/appError.js';

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export function toSafeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    totalScore: user.totalScore,
    avatar: user.avatar || 'cric-captain',
    pendingUpdate: user.pendingUpdate && user.pendingUpdate.status === 'pending' ? {
      name: user.pendingUpdate.name || null,
      hasPasswordChange: Boolean(user.pendingUpdate.passwordHash),
      requestedAt: user.pendingUpdate.requestedAt,
      status: user.pendingUpdate.status
    } : null
  };
}

export async function registerUser({ name, email, password, avatar }) {
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    passwordHash,
    avatar: avatar || 'cric-captain'
  });
  return toSafeUser(user);
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    throw new AppError('Invalid email or password', 401);
  }

  return { token: signToken(user), user: toSafeUser(user) };
}
