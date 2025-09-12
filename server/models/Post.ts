import { model, Schema, Document, Types } from 'mongoose';

export interface PostI extends Document {
  thread: Types.ObjectId;
  parentPost: Types.ObjectId | null;
  author: Types.ObjectId;
  content: string;
  // ─── New fields ───────────────────────────────────────
  isHidden: boolean;
  edited: boolean;
  likeCount: number;
  replyCount: number;
  attachments: string[];
  reports: Types.ObjectId[];
  // ──────────────────────────────────────────────────────
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<PostI>(
  {
    thread: {
      type: Schema.Types.ObjectId,
      ref: 'threads',
      required: true,
    },
    parentPost: {
      type: Schema.Types.ObjectId,
      ref: 'posts',
      default: null,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },

    // ─── Moderation & Visibility ───────────────────────────
    isHidden: {
      type: Boolean,
      default: false,
    },
    reports: [
      {
        type: Schema.Types.ObjectId,
        ref: 'reports',
      },
    ],

    // ─── Edit Tracking & Reactions ─────────────────────────
    edited: {
      type: Boolean,
      default: false,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    attachments: {
      type: [String],
      default: [],
    },

    // ─── Performance / Caching ────────────────────────────
    replyCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // gives you createdAt & updatedAt
    minimize: false,
  }
);

// Virtual to populate direct replies
PostSchema.virtual('replies', {
  ref: 'posts',
  localField: '_id',
  foreignField: 'parentPost',
});

export const Post = model<PostI>('posts', PostSchema);
