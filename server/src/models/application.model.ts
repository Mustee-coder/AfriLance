import { Schema, model, Document, Types } from "mongoose";

export interface IApplication extends Document {
  job: Types.ObjectId;
  developer: Types.ObjectId;
  coverLetter: string;
  bidAmount: number;
  estimatedDays: number;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    developer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    coverLetter: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
    },

    bidAmount: {
      type: Number,
      required: true,
      min: 1,
    },

    estimatedDays: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "withdrawn"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

// Prevent a developer from applying to the same job twice
applicationSchema.index(
  { job: 1, developer: 1 },
  { unique: true },
);

// Speed up "my applications" queries for a developer's dashboard
applicationSchema.index({ developer: 1, status: 1 });

export default model<IApplication>(
  "Application",
  applicationSchema,
);
