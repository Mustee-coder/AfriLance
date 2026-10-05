import dns from "node:dns";
import { createServer } from "node:http";
import { Server as SocketIOServer } from "socket.io";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { registerSocketHandlers } from "./socket/socket.handlers.js";
import { authenticateSocket } from "./socket/socket.middleware.js";

dns.setServers(["8.8.8.8"]);

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    const httpServer = createServer(app);

    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: env.clientUrl,
        credentials: true,
      },
    });

io.use(authenticateSocket);

    io.on("connection", (socket) => {
      console.log(`🔌 Socket connected: ${socket.id}`);



registerSocketHandlers(io, socket);     
 socket.on("disconnect", () => {
        console.log(`🔌 Socket disconnected: ${socket.id}`);
      });
    });

    httpServer.listen(env.port, () => {
      console.log(`🚀 AfriLance API running on port ${env.port}`);
      console.log("⚡ Socket.io ready");
    });
  } catch (error) {
    console.error("❌ Failed to start AfriLance server:", error);
    process.exit(1);
  }
};

void startServer();
