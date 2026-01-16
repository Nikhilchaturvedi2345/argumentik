/**
 * product.repository.js
 * ---------------------
 * Responsibilities:
 * - Talk directly to MongoDB
 * - Perform product-related DB operations
 *
 * IMPORTANT:
 * - No Express req/res here
 * - No business flow decisions
 */

import Product from "../models/product.model.js";

/**
 * =====================
 * FETCH ALL PRODUCTS
 * =====================
 * Returns latest stock from DB
 * Used by staff & admin apps
 */
export const fetchAllProducts = async () => {
  return await Product.find().sort({ createdAt: -1 });
};

/**
 * =====================
 * CREATE NEW PRODUCT
 * =====================
 * Used during initial inventory setup
 */
export const createNewProduct = async ({ name, price, stock }) => {
  const product = new Product({
    name,
    price,
    stock,
  });

  return await product.save();
};
