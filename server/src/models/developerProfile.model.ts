import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPortfolioProject {
  title: string;
  description: string;
  projectUrl?: string;
}

export interface IDeveloperProfile extends Document {
  user: Types.ObjectId;
  bio?: string;
  skills: string[];
  experience: number;
  hourlyRate: number;
  availability: "available" | "busy" | "unavailable";
  portfolio: IPortfolioProject[];
  createdAt: Date;
  updatedAt: Date;
}

const portfolioProjectSchema = new Schema<IPortfolioProject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    projectUrl: {
      type: String,
      trim: true,
    },
  },
  { _id: true },
);

const developerProfileSchema = new Schema<IDeveloperProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    skills: {
      type: [String],
      default: [],
    },

    experience: {
      type: Number,
      min: 0,
      default: 0,
    },

    hourlyRate: {
      type: Number,
      min: 0,
      default: 0,
    },

    availability: {
      type: String,
      enum: ["available", "busy", "unavailable"],
      default: "available",
    },

    portfolio: {
      type: [portfolioProjectSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const DeveloperProfile = mongoose.model<IDeveloperProfile>(
  "DeveloperProfile",
  developerProfileSchema,
);
