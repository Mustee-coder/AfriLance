import mongoose, { Document, Schema, Types } from "mongoose";

export interface IConversation extends Document {
  application: Types.ObjectId;
  job: Types.ObjectId;
  participants: Types.ObjectId[];
  lastMessage?: Types.ObjectId;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    application: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      unique: true,
    },

    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },

    lastMessageAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

conversationSchema.index({ participants: 1 });
conversationSchema.index({ job: 1 });

export const Conversation = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema,
);
