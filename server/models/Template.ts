import { model, Schema, Document } from 'mongoose';

export interface TemplateI extends Document {
  name: string;
  createdAt: Date;
  creator: string;
  games: Array<object>;
  factions: object;
  ratios: object;
  plays: number;
}

export const TemplateSchema = new Schema<TemplateI>(
  {
    name: {
      type: String,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    factions: {
      type: Object,
      required: true,
    },
    ratios: {
      type: Object,
      required: true,
    },
    plays: {
      type: Number,
      required: true,
    },
  },
  {
    minimize: false,
  }
);

export const Template = model<TemplateI>('templates', TemplateSchema);
