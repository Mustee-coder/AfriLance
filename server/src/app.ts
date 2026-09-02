import express from "express";
import cookieParser from "cookie-parser";
import { authenticate } from "./middleware/auth.middleware.js";
import { authorize } from "./middleware/role.middleware.js";


import profileRoutes from "./routes/profile.routes.js";
import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import developerProfileRoutes from "./routes/developerProfile.routes.js";
import clientProfileRoutes from "./routes/clientProfile.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";


const app = express();

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



export default app;



