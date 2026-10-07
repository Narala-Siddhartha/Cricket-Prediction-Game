import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contestMatch: { type: mongoose.Schema.Types.ObjectId, ref: 'ContestMatch', required: true },
    predictedWinner: { type: String, required: true },
    outcome: { type: String, enum: ['pending', 'won', 'lost', 'void'], default: 'pending' },
    scoreDelta: { type: Number, default: 0 },
    settledAt: { type: Date }
  },
  { timestamps: true }
);

predictionSchema.index({ user: 1, contestMatch: 1 }, { unique: true });

export const Prediction = mongoose.model('Prediction', predictionSchema);
