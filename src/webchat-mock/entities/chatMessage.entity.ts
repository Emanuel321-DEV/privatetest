import { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  text: string;
  sender: 'bot' | 'user';
  status: 'FINESHED' | 'PROGRESS' | 'FINESHED_INTENDED';
  timestamp: Date;
  type?: string;
  buttons?: { label: string; value: string }[];
  context?: string;
  lang?: string;
  category?: string;
}

export const ChatMessageSchema = new Schema<IChatMessage>({
  text: { type: String, required: true },
  sender: { type: String, enum: ['bot', 'user'], required: true },
  status: { type: String, enum: ['FINESHED', 'PROGRESS', 'FINESHED_INTENDED'], required: true },
  timestamp: { type: Date, default: Date.now },
  type: { type: String },
  buttons: [
    {
      label: { type: String },
      value: { type: String }
    }
  ],
  context: { type: String },
  lang: { type: String },
  category: { type: String }
});
