import { Schema, model, Document, Types } from "mongoose";

export interface IJob extends Document {
  client: Types.ObjectId;
  title: string;
  description: string;
  skills: string[];
  budget: number;
  budgetType: "fixed" | "hourly";
  experienceLevel: "entry" | "intermediate" | "expert";
  deadline?: Date;
  status: "open" | "in_progress" | "completed" | "cancelled";
  locationType: "remote" | "onsite" | "hybrid";
country: string;
city: string;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    client: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    skills: { type: [String], default: [] },
    budget: { type: Number, required: true },
    budgetType: { type: String, enum: ["fixed", "hourly"], required: true },
    experienceLevel: {
      type: String,
      enum: ["entry", "intermediate", "expert"],
      required: true,
    },
    deadline: { type: Date },
    status: {
      type: String,
      enum: ["open", "in_progress", "completed", "cancelled"],
      default: "open",
    },
    locationType: {
  type: String,
  enum: ["remote", "onsite", "hybrid"],
  required: true,
},

country: {
  type: String,
  required: true,
  trim: true,
},

city: {
  type: String,
  required: true,
  trim: true,
},
  },
  { timestamps: true }
);

export default model<IJob>("Job", jobSchema);
