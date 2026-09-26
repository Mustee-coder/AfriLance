import { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { User } from "../models/user.model.js";
import {
  createResumeSchema,
  updateResumeSchema,
} from "../validators/resume.validator.js";

import { Resume } from "../models/resume.model.js";





const createResumeSlug = (firstName: string, lastName: string): string => {
  return `${firstName}-${lastName}`
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
};



const createUniqueResumeSlug = async (
  firstName: string,
  lastName: string,
): Promise<string> => {
  const baseSlug = createResumeSlug(firstName, lastName);

  let slug = baseSlug;
  let counter = 2;

  while (await Resume.exists({ publicSlug: slug })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
};


export const createResume = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const validation = createResumeSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid resume data",
        errors: validation.error.flatten(),
      });
      return;
    }





    const userId = req.user?.userId;


const user = await User.findById(userId).select("firstName lastName");

if (!user) {
  res.status(404).json({
    success: false,
    message: "User not found",
  });
  return;
}


    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const existingResume = await Resume.findOne({
      user: userId,
    });

    if (existingResume) {
      res.status(409).json({
        success: false,
        message: "Resume already exists",
      });
      return;
    }

let publicSlug: string | undefined;

if (validation.data.isPublic) {
  publicSlug = await createUniqueResumeSlug(
    user.firstName,
    user.lastName,
  );
}



      const resume = await Resume.create({
  user: userId,
  ...validation.data,
  publicSlug,
});

    res.status(201).json({
      success: true,
      message: "Resume created successfully",
      resume,
    });
  } catch (error) {
    console.error("Create resume error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create resume",
    });
  }
};

export const getMyResume = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const resume = await Resume.findOne({
      user: userId,
    });

    if (!resume) {
      res.status(404).json({
        success: false,
        message: "Resume not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Get resume error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get resume",
    });
  }
};


export const updateMyResume = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const validation = updateResumeSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid resume data",
        errors: validation.error.flatten(),
      });
      return;
    }

    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }



    const resume = await Resume.findOne({
  user: userId,
});

if (!resume) {
  res.status(404).json({
    success: false,
    message: "Resume not found",
  });
  return;
}

const user = await User.findById(userId).select(
  "firstName lastName",
);

if (!user) {
  res.status(404).json({
    success: false,
    message: "User not found",
  });
  return;
}

const updateData: Record<string, unknown> = {
  ...validation.data,
};

if (validation.data.isPublic === true) {
  updateData.publicSlug =
    resume.publicSlug ??
    (await createUniqueResumeSlug(
      user.firstName,
      user.lastName,
    ));
}

if (validation.data.isPublic === false) {
  updateData.publicSlug = undefined;
}

Object.assign(resume, updateData);

await resume.save();

    if (!resume) {
      res.status(404).json({
        success: false,
        message: "Resume not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      resume,
    });
  } catch (error) {
    console.error("Update resume error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update resume",
    });
  }
};




export const getPublicResume = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { slug } = req.params;

  const resume = await Resume.findOne({
    publicSlug: slug,
    isPublic: true,
  }).lean();

  if (!resume) {
    res.status(404).json({
      success: false,
      message: "Public resume not found",
    });
    return;
  }

  const user = await User.findById(resume.user)
    .select("firstName lastName")
    .lean();

  if (!user) {
    res.status(404).json({
      success: false,
      message: "Resume owner not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    resume: {
      publicSlug: resume.publicSlug,
      name: `${user.firstName} ${user.lastName}`,
      headline: resume.headline,
      professionalSummary: resume.professionalSummary,
      skills: resume.skills,
      experience: resume.experience,
      education: resume.education,
      projects: resume.projects,
      certifications: resume.certifications,
      template: resume.template,
    },
  });
};
