import mongoose, { Document, Schema, Types } from "mongoose";

export interface IClientProfile extends Document {
  user: Types.ObjectId;
  companyName?: string;
  companyDescription?: string;
  industry?: string;
  website?: string;
  country?: string;
  city?: string;
  createdAt: Date;
  updatedAt: Date;
}

const clientProfileSchema = new Schema<IClientProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    companyName: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    companyDescription: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    industry: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    website: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    city: {
      type: String,
      trim: true,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
  },
);

export const ClientProfile = mongoose.model<IClientProfile>(
  "ClientProfile",
  clientProfileSchema,
);
