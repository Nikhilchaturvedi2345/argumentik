/**
 * app.js
 * ----------
 * This file is responsible ONLY for:
 * - Initializing Express
 * - Registering middleware
 * - Registering routes
 *
 * It does NOT:
 * - Start the server
 * - Handle sockets
 *
 * This separation allows better testing & scalability
 */

import express from "express";
import cors from "cors";
import morgan from "morgan";

import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();

/**
 * =====================
 * Global Middlewares
 * =====================
 */

// Allow cross-origin requests (mobile + web apps)
app.use(cors());

// Parse incoming JSON bodies
app.use(express.json());

// Log HTTP requests (useful during debugging)
app.use(morgan("dev"));

/**
 * =====================
 * API Routes
 * =====================
 * All routes are versioned for future safety
 */

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);

/**
 * =====================
 * Health Check Route
 * =====================
 * Useful for testing server availability
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Inventory service is running",
  });
});

/**
 * =====================
 * Global Error Handler
 * =====================
 * Any thrown error ends up here
 */
app.use((err, req, res, next) => {
  console.error("Global Error:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
