import mongoose, { Document, Schema, Types } from "mongoose";

export interface IResumeExperience {
  _id?: Types.ObjectId;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description?: string;
}

export interface IResumeEducation {
  _id?: Types.ObjectId;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
}

export interface IResumeProject {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  projectUrl?: string;
}

export interface IResumeCertification {
  _id?: Types.ObjectId;
  name: string;
  issuer: string;
  issueDate?: Date;
  credentialUrl?: string;
}

export interface IResume extends Document {
  user: Types.ObjectId;

  headline?: string;
  professionalSummary?: string;

  skills: string[];

  experience: IResumeExperience[];
  education: IResumeEducation[];
  projects: IResumeProject[];
  certifications: IResumeCertification[];

  template: string;

  createdAt: Date;
  updatedAt: Date;
}



const resumeExperienceSchema = new Schema<IResumeExperience>(
  {
    company: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    position: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
    },

    current: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    _id: true,
  },
);



const resumeEducationSchema = new Schema<IResumeEducation>(
  {
    institution: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    degree: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    fieldOfStudy: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    _id: true,
  },
);



const resumeProjectSchema = new Schema<IResumeProject>(
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
      maxlength: 500,
    },
  },
  {
    _id: true,
  },
);



const resumeCertificationSchema = new Schema<IResumeCertification>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    issuer: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    issueDate: {
      type: Date,
    },

    credentialUrl: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    _id: true,
  },
);


const resumeSchema = new Schema<IResume>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    headline: {
      type: String,
      trim: true,
      maxlength: 150,
    },

    professionalSummary: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    skills: {
      type: [String],
      default: [],
    },

    experience: {
      type: [resumeExperienceSchema],
      default: [],
    },

    education: {
      type: [resumeEducationSchema],
      default: [],
    },

    projects: {
      type: [resumeProjectSchema],
      default: [],
    },

    certifications: {
      type: [resumeCertificationSchema],
      default: [],
    },

    template: {
      type: String,
      default: "classic",
      enum: ["classic", "modern", "minimal"],
    },
  },
  {
    timestamps: true,
  },
);


export const Resume = mongoose.model<IResume>(
  "Resume",
  resumeSchema,
);
