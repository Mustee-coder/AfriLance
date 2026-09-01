import express from "express";
import cookieParser from "cookie-parser";
import { authenticate } from "./middleware/auth.middleware.js";
import { authorize } from "./middleware/role.middleware.js";

import profileRoutes from "./routes/profile.routes.js";
import authRoutes from "./routes/auth.routes.js";

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



export default app;



