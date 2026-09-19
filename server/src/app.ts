import express, {
  NextFunction,
  Request,
  Response,
} from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { authenticate } from "./middleware/auth.middleware.js";
import { authorize } from "./middleware/role.middleware.js";

import profileRoutes from "./routes/profile.routes.js";
import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import developerProfileRoutes from "./routes/developerProfile.routes.js";
import clientProfileRoutes from "./routes/clientProfile.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import reviewRoutes from "./routes/review.routes.js";



import aiRoutes from "./routes/ai.routes.js";
import resumeRoutes from "./routes/resume.routes.js";



const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
res.json({
success: true,
message: "AfriLance API is running 🚀",
});
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/developer-profiles", developerProfileRoutes);
app.use("/api/client-profiles", clientProfileRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reviews", reviewRoutes);

app.use("/api/ai", aiRoutes);
app.use("/api/resumes", resumeRoutes);


app.use(
  (
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    console.error("Global error:", error);

    res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  },
);


export default app;



