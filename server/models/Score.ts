import { model, Schema, Document } from 'mongoose';

export interface ScoreI extends Document {
  userId: string;
  username: string;
  scores: Array<{
    chapter: number;
    score: number;
  }>;
}

const ScoreSchema = new Schema({
  userId: String,
  username: String,
  scores: {
    type: Map,
    of: Number,
  },
});

export const Score = model<ScoreI>('scores', ScoreSchema);
