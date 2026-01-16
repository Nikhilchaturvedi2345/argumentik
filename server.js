/**
 * server.js
 * ----------
 * This file is responsible for:
 * - Connecting MongoDB
 * - Creating HTTP server
 * - Initializing Socket.IO
 * - Starting the server
 */

import http from "http";
import { Server } from "socket.io";
// import mongoose from "mongoose";

import app from "./app.js";
import connectDB from "./config/db.js";
import { registerStockSocket } from "./sockets/stock.socket.js";

const PORT = process.env.PORT || 5000;

/**
 * =====================
 * Create HTTP Server
 * =====================
 * Required so Socket.IO can hook into it
 */
const httpServer = http.createServer(app);

/**
 * =====================
 * Socket.IO Configuration
 * =====================
 * Enables real-time stock updates
 */
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow mobile + web clients
    methods: ["GET", "POST"],
  },
});

/**
 * Make io accessible globally (for controllers)
 */
app.set("io", io);

/**
 * Register socket listeners
 */
registerStockSocket(io);

/**
 * =====================
 * Start Server
 * =====================
 */
const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB();

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
