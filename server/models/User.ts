import { model, Schema, Document } from 'mongoose';

export interface UserI extends Document {
  username: string;
  email: string;
  createdAt: Date;
  password: string;
  games: Array<object>;
  campaign: object;
  avatar: string;
}

export const UserSchema = new Schema<UserI>(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    games: {
      type: [Object],
      required: true,
    },
    campaign: {
      type: Object,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
  },
  {
    minimize: false,
  }
);

export const User = model<UserI>('users', UserSchema);
