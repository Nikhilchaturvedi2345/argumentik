/**
 * product.controller.js
 * ---------------------
 * Responsibilities:
 * - Handle incoming product-related requests
 * - Call repository for DB access
 * - NEVER talk directly to MongoDB
 */

import {
  fetchAllProducts,
  createNewProduct,
} from "../repositories/product.repository.js";

/**
 * =====================
 * GET ALL PRODUCTS
 * =====================
 * Used by:
 * - Staff Mobile App
 * - Admin Web App
 *
 * IMPORTANT:
 * - Returns current stock from backend
 * - Frontend MUST trust backend data
 */
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await fetchAllProducts();

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error); // Forward to global error handler
  }
};

/**
 * =====================
 * CREATE PRODUCT
 * =====================
 * Used for:
 * - Initial inventory setup (3–5 products)
 *
 * Example body:
 * {
 *   "name": "Coffee",
 *   "price": 50,
 *   "stock": 10
 * }
 */
export const createProduct = async (req, res, next) => {
  try {
    const { name, price, stock } = req.body;

    // Basic validation (backend safety)
    if (!name || price == null || stock == null) {
      return res.status(400).json({
        success: false,
        message: "Name, price and stock are required",
      });
    }

    const product = await createNewProduct({
      name,
      price,
      stock,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
