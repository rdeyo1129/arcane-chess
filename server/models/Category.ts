import { model, Schema, Document, Types } from 'mongoose';

export interface CategoryI extends Document {
  name: string;
  description?: string;
  order: number;
  // ─── New fields ───────────────────────────────────────
  slug: string;
  threadCount: number;
  isHidden: boolean;
  parent?: Types.ObjectId;
  icon?: string;
  // ──────────────────────────────────────────────────────
}

const CategorySchema = new Schema<CategoryI>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    order: {
      type: Number,
      default: 0,
    },

    // ─── SEO & Routing ─────────────────────────────────────
    slug: {
      type: String,
      required: true,
      unique: true,
    },

    // ─── Visibility & Nesting ─────────────────────────────
    isHidden: {
      type: Boolean,
      default: false,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'categories',
      default: null,
    },
    icon: String,

    // ─── Performance / Caching ────────────────────────────
    threadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    minimize: false,
  }
);

export const Category = model<CategoryI>('categories', CategorySchema);
