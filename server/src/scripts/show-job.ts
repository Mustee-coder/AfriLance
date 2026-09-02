import "dotenv/config";
import mongoose from "mongoose";
import Job from "../models/job.model.js";

const showJob = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    const job = await Job.findById("6a96a53436aa2c6ec1b7218e");

    console.log(JSON.stringify(job, null, 2));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
};

showJob();
