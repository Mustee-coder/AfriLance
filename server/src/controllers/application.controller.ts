import type { Response } from "express";
import mongoose from "mongoose";
import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import {
  createApplicationSchema,
  updateApplicationStatusSchema,
} from "../validators/application.validator.js";

interface MongoDuplicateKeyError {
  code: number;
}

function isDuplicateKeyError(error: unknown): error is MongoDuplicateKeyError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as MongoDuplicateKeyError).code === 11000
  );
}

// Developer submits an application
export const createApplication = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const parsed = createApplicationSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { jobId, coverLetter, bidAmount, estimatedDays } = parsed.data;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
      return;
    }

    const job = await Job.findById(jobId);

    if (!job) {
      res.status(404).json({
        success: false,
        message: "Job not found",
      });
      return;
    }

    if (job.status !== "open") {
      res.status(400).json({
        success: false,
        message: "You can only apply to open jobs",
      });
      return;
    }

    // Prevent client from applying to their own job
    if (job.client.toString() === req.user.userId) {
      res.status(400).json({
        success: false,
        message: "You cannot apply to your own job",
      });
      return;
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      developer: req.user.userId,
    });

    if (existingApplication) {
      res.status(409).json({
        success: false,
        message: "You have already applied to this job",
      });
      return;
    }

    const application = await Application.create({
      job: jobId,
      developer: req.user.userId,
      coverLetter,
      bidAmount,
      estimatedDays,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      res.status(409).json({
        success: false,
        message: "You have already applied to this job",
      });
      return;
    }

    console.error("Create application error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Developer gets their applications
export const getMyApplications = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const applications = await Application.find({
      developer: req.user.userId,
    })
      .populate("job")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get my applications error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get one application
export const getApplicationById = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const application = await Application.findById(req.params.id)
      .populate("job")
      .populate("developer", "firstName lastName role");

    if (!application) {
      res.status(404).json({
        success: false,
        message: "Application not found",
      });
      return;
    }

    const job = await Job.findById(application.job);

    if (!job) {
      res.status(404).json({
        success: false,
        message: "Job not found",
      });
      return;
    }

    const developerId = (
      application.developer as unknown as { _id: mongoose.Types.ObjectId }
    )._id.toString();

    const isDeveloper = developerId === req.user.userId;
    const isClient = job.client.toString() === req.user.userId;

    if (!isDeveloper && !isClient) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to view this application",
      });
      return;
    }

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("Get application error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Developer withdraws application
export const withdrawApplication = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const application = await Application.findOne({
      _id: req.params.id,
      developer: req.user.userId,
    });

    if (!application) {
      res.status(404).json({
        success: false,
        message: "Application not found or not yours",
      });
      return;
    }

    if (application.status !== "pending") {
      res.status(400).json({
        success: false,
        message: "Only pending applications can be withdrawn",
      });
      return;
    }

    application.status = "withdrawn";

    await application.save();

    res.status(200).json({
      success: true,
      message: "Application withdrawn successfully",
      application,
    });
  } catch (error) {
    console.error("Withdraw application error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Client gets applications for a job
export const getJobApplications = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const job = await Job.findById(req.params.jobId);

    if (!job) {
      res.status(404).json({
        success: false,
        message: "Job not found",
      });
      return;
    }

    if (job.client.toString() !== req.user.userId) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to view these applications",
      });
      return;
    }

    const applications = await Application.find({
      job: req.params.jobId,
    })
      .populate("developer", "firstName lastName role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get job applications error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Client accepts/rejects application
export const updateApplicationStatus = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const parsed = updateApplicationStatusSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      res.status(404).json({
        success: false,
        message: "Application not found",
      });
      return;
    }

    const job = await Job.findById(application.job);

    if (!job) {
      res.status(404).json({
        success: false,
        message: "Job not found",
      });
      return;
    }

    // Only the job owner can accept/reject applications
    if (job.client.toString() !== req.user.userId) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to update this application",
      });
      return;
    }

    // Only pending applications can be updated
    if (application.status !== "pending") {
      res.status(400).json({
        success: false,
        message: "Only pending applications can be updated",
      });
      return;
    }

    const newStatus = parsed.data.status;

    // Reject application
    if (newStatus === "rejected") {
      application.status = "rejected";

      await application.save();

      res.status(200).json({
        success: true,
        message: "Application rejected successfully",
        application,
      });

      return;
    }

    // Accept application
    if (newStatus === "accepted") {
      // Job must still be open
      if (job.status !== "open") {
        res.status(400).json({
          success: false,
          message: "This job is no longer open",
        });
        return;
      }

      // Accept selected application
      application.status = "accepted";
      await application.save();

      // Reject all other pending applications
      await Application.updateMany(
        {
          job: job._id,
          _id: { $ne: application._id },
          status: "pending",
        },
        {
          $set: {
            status: "rejected",
          },
        },
      );

      // Move job to in_progress
      job.status = "in_progress";
      await job.save();

      res.status(200).json({
        success: true,
        message: "Application accepted successfully",
        application,
        job: {
          id: job._id,
          status: job.status,
        },
      });

      return;
    }

    res.status(400).json({
      success: false,
      message: "Invalid application status",
    });
  } catch (error) {
    console.error("Update application status error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};