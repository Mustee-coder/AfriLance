import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { DeveloperProfile } from "../models/developerProfile.model.js";
import Application from "../models/application.model.js";
import { ClientProfile } from "../models/clientProfile.model.js";
import Job from "../models/job.model.js";

export const getDeveloperDashboard = async (
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

const userId = req.user.userId;  

const [profile, applications] = await Promise.all([  
  DeveloperProfile.findOne({ user: userId }),  
  Application.find({ developer: userId })  
    .populate("job", "title budget budgetType status client")  
    .sort({ createdAt: -1 }),  
]);  

if (!profile) {  
  res.status(404).json({  
    success: false,  
    message: "Developer profile not found",  
  });  
  return;  
}  

const stats = applications.reduce(  
  (acc, application) => {  
    acc.totalApplications++;  
    if (application.status === "pending") acc.pendingApplications++;  
    else if (application.status === "accepted") acc.acceptedApplications++;  
    else if (application.status === "rejected") acc.rejectedApplications++;  
    return acc;  
  },  
  {  
    totalApplications: 0,  
    pendingApplications: 0,  
    acceptedApplications: 0,  
    rejectedApplications: 0,  
  },  
);  

res.status(200).json({  
  success: true,  
  dashboard: {  
    profile,  
    stats,  
    recentApplications: applications.slice(0, 5),  
  },  
});

} catch (error) {
console.error("Get developer dashboard error:", error);

res.status(500).json({  
  success: false,  
  message: "Failed to get developer dashboard",  
});

}
};


export const getClientDashboard = async (
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

    const userId = req.user.userId;

    const [profile, jobs] = await Promise.all([
      ClientProfile.findOne({ user: userId }),
      Job.find({ client: userId }).sort({ createdAt: -1 }),
    ]);

    if (!profile) {
      res.status(404).json({
        success: false,
        message: "Client profile not found",
      });
      return;
    }

    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({
      job: { $in: jobIds },
    })
      .populate("job", "title budget budgetType status")
      .populate("developer", "firstName lastName role")
      .sort({ createdAt: -1 });

    const stats = {
      totalJobs: jobs.length,

      openJobs: jobs.filter(
        (job) => job.status === "open",
      ).length,

      inProgressJobs: jobs.filter(
        (job) => job.status === "in_progress",
      ).length,

      totalApplications: applications.length,

      pendingApplications: applications.filter(
        (application) => application.status === "pending",
      ).length,

      acceptedApplications: applications.filter(
        (application) => application.status === "accepted",
      ).length,
    };

    res.status(200).json({
      success: true,
      dashboard: {
        profile,
        stats,
        recentJobs: jobs.slice(0, 5),
        recentApplications: applications.slice(0, 5),
      },
    });
  } catch (error) {
    console.error("Get client dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get client dashboard",
    });
  }
};