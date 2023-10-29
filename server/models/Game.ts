import { model, Schema, Document } from 'mongoose';

export interface GameI extends Document {
  gameId: string;
  pgn: string;
  createdAt: Date;
  history: Array<string>;
  fenHistory: Array<string>;
  players: object;
  arcane: object;
}

export const GameSchema = new Schema<GameI>({
  gameId: {
    type: String,
    required: true,
  },
  pgn: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  history: {
    type: [String],
    required: true,
  },
  fenHistory: {
    type: [String],
    required: true,
  },
  players: {
    type: Object,
    required: true,
  },
  arcane: {
    type: Object,
    required: true,
  },
});

export const Game = model<GameI>('games', GameSchema);
