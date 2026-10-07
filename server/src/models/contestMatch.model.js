import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    shortName: { type: String }
  },
  { _id: false }
);

const contestMatchSchema = new mongoose.Schema(
  {
    apiMatchId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    matchType: { type: String },
    venue: { type: String },
    dateTimeGMT: { type: Date, required: true },
    teams: { type: [teamSchema], validate: [(value) => value.length >= 2, 'Two teams are required'] },
    status: { type: String, enum: ['scheduled', 'live', 'completed', 'cancelled'], default: 'scheduled' },
    apiStatus: { type: String },
    lockAt: { type: Date, required: true },
    winPoints: { type: Number, required: true, min: 0 },
    lossPoints: { type: Number, required: true, min: 0 },
    winnerTeam: { type: String },
    resultText: { type: String },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

contestMatchSchema.index({ dateTimeGMT: 1 });

export const ContestMatch = mongoose.model('ContestMatch', contestMatchSchema);
