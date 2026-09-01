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

},
{
timestamps: true,
},
);

export const Profile = mongoose.model<IProfile>("Profile", profileSchema);