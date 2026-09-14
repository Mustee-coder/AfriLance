import type { Response } from "express";
import mongoose from "mongoose";

import { Review } from "../models/review.model.js";
import Job from "../models/job.model.js";
import Application from "../models/application.model.js";

import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

import {
  createReviewSchema,
} from "../validators/review.validator.js";

export const createReview = async (
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

    const parsed = createReviewSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const {
      reviewee,
      job: jobId,
      rating,
      comment,
    } = parsed.data;

    if (
      !mongoose.Types.ObjectId.isValid(reviewee) ||
      !mongoose.Types.ObjectId.isValid(jobId)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid user or job ID",
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

    if (job.status !== "completed") {
      res.status(400).json({
        success: false,
        message: "Reviews are only allowed for completed jobs",
      });
      return;
    }

    const reviewerId = new mongoose.Types.ObjectId(
      req.user.userId,
    );

    const revieweeId = new mongoose.Types.ObjectId(
      reviewee,
    );

    // Reviewer and reviewee must be different users
    if (reviewerId.equals(revieweeId)) {
      res.status(400).json({
        success: false,
        message: "You cannot review yourself",
      });
      return;
    }

    // Client → Developer
    if (req.user.role === "client") {
      if (!job.client.equals(reviewerId)) {
        res.status(403).json({
          success: false,
          message: "You do not own this job",
        });
        return;
      }

      const acceptedApplication =
        await Application.findOne({
          job: job._id,
          developer: revieweeId,
          status: "accepted",
        });

      if (!acceptedApplication) {
        res.status(403).json({
          success: false,
          message:
            "You can only review the developer hired for this job",
        });
        return;
      }
    }

    // Developer → Client
    else if (req.user.role === "developer") {
      const acceptedApplication =
        await Application.findOne({
          job: job._id,
          developer: reviewerId,
          status: "accepted",
        });

      if (!acceptedApplication) {
        res.status(403).json({
          success: false,
          message:
            "You were not hired for this job",
        });
        return;
      }

      if (!job.client.equals(revieweeId)) {
        res.status(403).json({
          success: false,
          message:
            "You can only review the client who owns this job",
        });
        return;
      }
    }

    else {
      res.status(403).json({
        success: false,
        message: "Only clients and developers can create reviews",
      });
      return;
    }

    const existingReview = await Review.findOne({
      reviewer: reviewerId,
      reviewee: revieweeId,
      job: job._id,
    });

    if (existingReview) {
      res.status(409).json({
        success: false,
        message: "You have already reviewed this user for this job",
      });
      return;
    }

    const review = await Review.create({
      reviewer: reviewerId,
      reviewee: revieweeId,
      job: job._id,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    console.error("Create review error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getUserReviews = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.params.userId;

    if (Array.isArray(userId)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
      return;
    }

   

    const reviews = await Review.find({
      reviewee: userId,
    })
      .populate("reviewer", "firstName lastName role")
      .populate("job", "title")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews > 0
        ? reviews.reduce(
            (sum, review) => sum + review.rating,
            0,
          ) / totalReviews
        : 0;

    res.status(200).json({
      success: true,
      count: totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
      reviews,
    });
  } catch (error) {
    console.error("Get user reviews error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



export const getJobReviews = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const jobId = req.params.jobId;

    if (Array.isArray(jobId)) {
      res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
      return;
    }

    const reviews = await Review.find({
      job: jobId,
    })
      .populate("reviewer", "firstName lastName role")
      .populate("reviewee", "firstName lastName role")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews > 0
        ? reviews.reduce(
            (sum, review) => sum + review.rating,
            0,
          ) / totalReviews
        : 0;

    res.status(200).json({
      success: true,
      count: totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
      reviews,
    });
  } catch (error) {
    console.error("Get job reviews error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};