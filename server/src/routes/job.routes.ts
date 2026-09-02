import { Router } from "express";
import {
createJob,
getJobs,
getJobById,
updateJob,
deleteJob,
} from "../controllers/job.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

// Anyone authenticated can browse jobs
router.get("/", authenticate, getJobs);

// Anyone authenticated can view a single job
router.get("/:id", authenticate, getJobById);

// Only clients can create jobs
router.post(
"/",
authenticate,
authorize("client"),
createJob,
);

// Only the job owner can update/delete
// Ownership is checked inside the controller
router.patch(
"/:id",
authenticate,
authorize("client"),
updateJob,
);

router.delete(
"/:id",
authenticate,
authorize("client"),
deleteJob,
);

export default router;
