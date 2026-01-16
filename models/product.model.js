/**
 * product.model.js
 * ----------------
 * Defines the Product schema.
 *
 * IMPORTANT:
 * - Stock is stored ONLY in backend
 * - Frontend must never manage stock
 */

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    /**
     * Product name
     * Example: "Coffee", "Sandwich"
     */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    /**
     * Price per unit
     */
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    /**
     * Current available stock
     * IMPORTANT:
     * - This value is modified ONLY via backend logic
     * - Never trust frontend values
     */
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
