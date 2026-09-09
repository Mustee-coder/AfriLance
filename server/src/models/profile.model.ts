import mongoose, { Document, Schema } from "mongoose";

export interface IProfile extends Document {
userId: mongoose.Types.ObjectId;
bio?: string;
skills: string[];
experience?: string;
hourlyRate?: number;
companyName?: string;
companyDescription?: string;
location?: string;
website?: string;
avatar?: string;

portfolio?: {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  url: string;
  publicId: string;
}[];
}

const profileSchema = new Schema<IProfile>(
{
userId: {
type: Schema.Types.ObjectId,
ref: "User",
required: true,
unique: true,
},

bio: {
  type: String,
  trim: true,
  maxlength: 1000,
},

skills: {
  type: [String],
  default: [],
},

experience: {
  type: String,
  trim: true,
  maxlength: 2000,
},

hourlyRate: {
  type: Number,
  min: 0,
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

location: {
  type: String,
  trim: true,
  maxlength: 100,
},

website: {
  type: String,
  trim: true,
  maxlength: 255,
},

avatar: {
  type: String,
  trim: true,
},
portfolio: [
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    publicId: {
      type: String,
      required: true,
      trim: true,
    },
  },
],

},
{
timestamps: true,
},
);

export const Profile = mongoose.model<IProfile>("Profile", profileSchema);
