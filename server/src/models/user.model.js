import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    totalScore: { type: Number, default: 0 },
    avatar: { type: String, default: 'cric-captain' },
    pendingUpdate: {
      name: { type: String, trim: true, default: null },
      passwordHash: { type: String, default: null },
      requestedAt: { type: Date, default: null },
      status: { type: String, enum: ['none', 'pending'], default: 'none' }
    }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
