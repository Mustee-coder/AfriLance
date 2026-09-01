import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "developer" | "client" | "admin";

export interface IUser extends Document {
firstName: string;
lastName: string;
email: string;
password: string;
role: UserRole;
createdAt: Date;
updatedAt: Date;
}

const userSchema = new Schema<IUser>(
{
firstName: {
type: String,
required: true,
trim: true,
minlength: 2,
maxlength: 50,
},

lastName: {
  type: String,
  required: true,
  trim: true,
  minlength: 2,
  maxlength: 50,
},

email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true,
},

password: {
  type: String,
  required: true,
  minlength: 6,
  select: false,
},

role: {
  type: String,
  enum: ["developer", "client", "admin"],
  default: "developer",
  required: true,
},

},
{
timestamps: true,
},
);

export const User = mongoose.model<IUser>("User", userSchema);