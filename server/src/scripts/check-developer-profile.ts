import "dotenv/config";
import mongoose from "mongoose";
import { DeveloperProfile } from "../models/developerProfile.model.js";

const userId = process.argv[2];

const checkDeveloperProfile = async (): Promise<void> => {
  try {
    if (!userId) {
      console.error("Please provide a user ID.");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI as string);

    console.log("MongoDB connected");

    const profile = await DeveloperProfile.findOne({
      user: userId,
    }).populate("user", "firstName lastName role");

    console.log(
      "Developer profile:",
      JSON.stringify(profile, null, 2),
    );
  } catch (error) {
    console.error("Developer profile test error:", error);
  } finally {
    await mongoose.disconnect();
  }
};

checkDeveloperProfile();
