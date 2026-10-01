import type { Socket } from "socket.io";
import { verifyAccessToken } from "../utils/jwt.js";
import type { UserRole } from "../models/user.model.js";

export interface AuthenticatedSocket extends Socket {
  user: {
    userId: string;
    role: UserRole;
  };
}

export const authenticateSocket = (
  socket: Socket,
  next: (err?: Error) => void,
): void => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) {
      next(new Error("Authentication required"));
      return;
    }

    const accessToken = cookieHeader
      .split(";")
      .find((cookie) => cookie.trim().startsWith("accessToken="))
      ?.split("=")[1];

    if (!accessToken) {
      next(new Error("Authentication required"));
      return;
    }

    const payload = verifyAccessToken(accessToken);

    (socket as AuthenticatedSocket).user = {
      userId: payload.userId,
      role: payload.role,
    };

    next();
  } catch (error) {
    console.error("Socket authentication error:", error);
    next(new Error("Invalid or expired authentication token"));
  }
};
