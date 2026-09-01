import { generateAccessToken } from "../utils/jwt.js";
import { env } from "../config/env.js";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import {
  loginSchema,
  registerSchema,
} from "../validators/auth.validator.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const register = async (
req: Request,
res: Response,
): Promise<void> => {
try {
const result = registerSchema.safeParse(req.body);

if (!result.success) {
  res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: result.error.flatten().fieldErrors,
  });
  return;
}

const { firstName, lastName, email, password, role } = result.data;

const existingUser = await User.findOne({ email });

if (existingUser) {
  res.status(409).json({
    success: false,
    message: "An account with this email already exists",
  });
  return;
}

const hashedPassword = await bcrypt.hash(password, 12);

const user = await User.create({
  firstName,
  lastName,
  email,
  password: hashedPassword,
  role,
});

res.status(201).json({
  success: true,
  message: "Account created successfully",
  user: {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  },
});

} catch (error) {
console.error("Register error:", error);

res.status(500).json({
  success: false,
  message: "Internal server error",
});

}
};


export const login = async (
req: Request,
res: Response,
): Promise<void> => {
try {
const result = loginSchema.safeParse(req.body);

if (!result.success) {
  res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: result.error.flatten().fieldErrors,
  });
  return;
}

const { email, password } = result.data;

const user = await User.findOne({ email }).select("+password");

if (!user) {
  res.status(401).json({
    success: false,
    message: "Invalid email or password",
  });
  return;
}

const isPasswordValid = await bcrypt.compare(
  password,
  user.password,
);

if (!isPasswordValid) {
  res.status(401).json({
    success: false,
    message: "Invalid email or password",
  });
  return;
}
const accessToken = generateAccessToken(
  user._id.toString(),
  user.role,
);
res.cookie("accessToken", accessToken, {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});


res.status(200).json({
  success: true,
  message: "Login successful",
  user: {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  },

});

} catch (error) {
console.error("Login error:", error);

res.status(500).json({
  success: false,
  message: "Internal server error",
});

}
};



export const logout = (
_req: Request,
res: Response,
): void => {
res.clearCookie("accessToken", {
httpOnly: true,
secure: env.nodeEnv === "production",
sameSite: env.nodeEnv === "production" ? "none" : "lax",
});

res.status(200).json({
success: true,
message: "Logout successful",
});
};


export const getMe = (
req: AuthenticatedRequest,
res: Response,
): void => {
res.status(200).json({
success: true,
user: req.user,
});
};