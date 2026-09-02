import type { Response } from "express";
import Job from "../models/job.model.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import {
  createJobSchema,
  updateJobSchema,
} from "../validators/job.validator.js";

export const createJob = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const parsed = createJobSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const job = await Job.create({
      ...parsed.data,
      client: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("Create job error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getJobs = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const {
      search,
      skill,
      minBudget,
      maxBudget,
      status,
      locationType,
      country,
      city,
      page,
      limit,
    } = req.query;

    const filter: Record<string, unknown> = {};

    // 🔎 Search
    if (typeof search === "string" && search.trim()) {
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const searchRegex = new RegExp(escapedSearch, "i");

      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { skills: searchRegex },
        { country: searchRegex },
        { city: searchRegex },
      ];
    }

    // 🛠️ Skill filter
    if (typeof skill === "string" && skill.trim()) {
      filter.skills = {
        $in: [skill.trim()],
      };
    }

    // 📌 Status filter
    if (typeof status === "string" && status.trim()) {
      filter.status = status.trim();
    }

    // 🌍 Location type filter
    if (typeof locationType === "string" && locationType.trim()) {
      filter.locationType = locationType.trim();
    }

    // 🇳🇬 Country filter
    if (typeof country === "string" && country.trim()) {
      filter.country = country.trim();
    }

    // 🏙️ City filter
    if (typeof city === "string" && city.trim()) {
      filter.city = city.trim();
    }

    // 💰 Budget filter
    const min = Number(minBudget);
    const max = Number(maxBudget);

    if (
      (minBudget && Number.isFinite(min)) ||
      (maxBudget && Number.isFinite(max))
    ) {
      filter.budget = {
        ...(minBudget && Number.isFinite(min) && { $gte: min }),
        ...(maxBudget && Number.isFinite(max) && { $lte: max }),
      };
    }

    // 📄 Pagination
    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(
      Math.max(Number(limit) || 10, 1),
      50,
    );

    const skip = (pageNumber - 1) * limitNumber;

    // 🚀 Get jobs + total count together
    const [jobs, totalJobs] = await Promise.all([
      Job.find(filter)
        .populate("client", "firstName lastName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),

      Job.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalJobs / limitNumber);

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalJobs,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error("Get jobs error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getJobById = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "client",
      "firstName lastName",
    );

    if (!job) {
      res.status(404).json({
        success: false,
        message: "Job not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("Get job error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateJob = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const parsed = updateJobSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const job = await Job.findOne({
      _id: req.params.id,
      client: req.user.userId,
    });

    if (!job) {
      res.status(404).json({
        success: false,
        message: "Job not found or not yours",
      });
      return;
    }

    Object.assign(job, parsed.data);

    await job.save();

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    console.error("Update job error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteJob = async (
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

    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      client: req.user.userId,
    });

    if (!job) {
      res.status(404).json({
        success: false,
        message: "Job not found or not yours",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Delete job error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};