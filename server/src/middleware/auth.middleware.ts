import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.js";

export interface AuthenticatedRequest extends Request {
user?: {
userId: string;
role: "developer" | "client" | "admin";
};
}

export const authenticate = (
req: AuthenticatedRequest,
res: Response,
next: NextFunction,
): void => {
try {
const token = req.cookies?.accessToken;

if (!token) {
  res.status(401).json({
    success: false,
    message: "Authentication required",
  });
  return;
}

const payload = verifyAccessToken(token);

req.user = {
  userId: payload.userId,
  role: payload.role,
};

next();

} catch (error) {
console.error("Authentication error:", error);

res.status(401).json({
  success: false,
  message: "Invalid or expired authentication token",
});

}
};

