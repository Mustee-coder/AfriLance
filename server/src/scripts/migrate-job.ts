import "dotenv/config";
import mongoose from "mongoose";
import Job from "../models/job.model.js";

const migrateJob = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    const job = await Job.findByIdAndUpdate(
      "6a96a53436aa2c6ec1b7218e",
      {
        locationType: "remote",
        country: "Nigeria",
        city: "Remote",
      },
      { new: true, runValidators: true },
    );

    console.log("Updated job:");
    console.log(JSON.stringify(job, null, 2));
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    await mongoose.disconnect();
  }
};

migrateJob();
