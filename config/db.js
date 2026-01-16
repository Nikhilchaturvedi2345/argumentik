/**
 * db.js
 * ----------
 * Responsible for:
 * - Connecting to MongoDB
 * - Handling connection events
 *
 * IMPORTANT:
 * - Stock safety & concurrency guarantees rely on MongoDB
 * - MongoDB supports atomic operations which we use later
 */

import mongoose from "mongoose";

/**
 * MongoDB Connection URL
 * NOTE:
 * - In real projects, this should come from .env
 * - Keeping fallback for assignment/demo purposes
 */
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/inventory_system";

/**
 * =====================
 * Connect to MongoDB
 * =====================
 */
const connectDB = async () => {
  try {
    // Mongoose connection
    await mongoose.connect(MONGO_URI, {
      autoIndex: true, // build indexes automatically
    });

    console.log("✅ MongoDB connected successfully");

    /**
     * =====================
     * Connection Event Listeners
     * =====================
     * These help in debugging production issues
     */
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });

  } catch (error) {
    console.error("❌ MongoDB initial connection failed:", error);
    process.exit(1); // Stop app if DB is unavailable
  }
};

export default connectDB;
