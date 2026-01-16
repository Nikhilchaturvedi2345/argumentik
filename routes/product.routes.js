/**
 * product.routes.js
 * -----------------
 * Handles ONLY HTTP routing for products.
 * Business logic is delegated to controllers.
 */

import express from "express";
import {
  getAllProducts,
  createProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

/**
 * =====================
 * GET /api/v1/products
 * =====================
 * - Fetch all products with current stock
 * - Used by:
 *   - Staff Mobile App
 *   - Admin Web App
 */
router.get("/", getAllProducts);

/**
 * =====================
 * POST /api/v1/products
 * =====================
 * - Create a product
 * - Used for initial setup (3–5 products)
 * - Not used by staff app normally
 */
router.post("/", createProduct);

export default router;
