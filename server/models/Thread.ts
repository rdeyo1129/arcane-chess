import { model, Schema, Document, Types } from 'mongoose';

export interface ThreadI extends Document {
  title: string;
  content: string; // OP’s text
  author: Types.ObjectId; // references User._id
  category: Types.ObjectId; // references Category._id

  // ─── Discussion Control ──────────────────────────────────────
  isLocked: boolean;
  isPinned: boolean;
  status: 'open' | 'closed' | 'archived';

  // ─── Visibility / SEO ────────────────────────────────────────
  slug: string;
  isHidden: boolean;

  // ─── Engagement Metrics ──────────────────────────────────────
  views: number;
  replyCount: number;
  lastActivityAt: Date;

  // ─── Tagging & Categorization ───────────────────────────────
  tags: string[];

  // ─── Timestamps (added by `timestamps: true`) ────────────────
  createdAt: Date;
  updatedAt: Date;
}

const ThreadSchema = new Schema<ThreadI>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'categories',
      required: true,
    },

    // ─── Discussion Control ──────────────────────────────────────
    isLocked: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'archived'],
      default: 'open',
    },

    // ─── Visibility / SEO ────────────────────────────────────────
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },

    // ─── Engagement Metrics ──────────────────────────────────────
    views: {
      type: Number,
      default: 0,
    },
    replyCount: {
      type: Number,
      default: 0,
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },

    // ─── Tagging & Categorization ───────────────────────────────
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
    minimize: false,
  }
);

export const Thread = model<ThreadI>('threads', ThreadSchema);
