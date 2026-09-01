import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { UserRole } from "../models/user.model.js";

interface JwtPayload {
userId: string;
role: UserRole;
}

export const generateAccessToken = (
userId: string,
role: UserRole,
): string => {
const payload: JwtPayload = {
userId,
role,
};

return jwt.sign(payload, env.jwtSecret, {
expiresIn: env.jwtExpiresIn,
} as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): JwtPayload => {
return jwt.verify(token, env.jwtSecret) as JwtPayload;
};
