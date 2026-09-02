import "dotenv/config";
import mongoose from "mongoose";
import Job from "../models/job.model.js";

const checkJobs = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    const jobs = await Job.find({
      $or: [
        { locationType: { $exists: false } },
        { country: { $exists: false } },
        { city: { $exists: false } },
      ],
    }).select("_id title locationType country city");

    console.log("Jobs missing location fields:");
    console.log(JSON.stringify(jobs, null, 2));
    console.log(`Total: ${jobs.length}`);
  } catch (error) {
    console.error("Error checking jobs:", error);
  } finally {
    await mongoose.disconnect();
  }
};

checkJobs();
