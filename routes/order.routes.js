/**
 * order.routes.js
 * ----------------
 * Handles ONLY order-related HTTP routes.
 * All stock validation & deduction happens in backend.
 */

import express from "express";
import { placeOrder } from "../controllers/order.controller.js";

const router = express.Router();

/**
 * =====================
 * POST /api/v1/orders
 * =====================
 * Request body:
 * {
 *   "productId": "<mongodb_id>",
 *   "quantity": 2
 * }
 *
 * Behavior:
 * - Validates stock
 * - Deducts stock atomically
 * - Emits real-time updates
 */
router.post("/", placeOrder);

export default router;
