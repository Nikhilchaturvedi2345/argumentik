/**
 * order.model.js
 * --------------
 * Defines the Order schema.
 *
 * WHY separate Order collection?
 * - Keeps order history
 * - Helps in audits
 * - Stock rollback is NOT needed
 */

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    /**
     * Reference to the ordered product
     */
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    /**
     * Quantity ordered
     */
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    /**
     * Price at the time of purchase
     * IMPORTANT:
     * - Stored separately to protect against future price changes
     */
    priceAtPurchase: {
      type: Number,
      required: true,
      min: 0,
    },

    /**
     * Order status
     * Extendable for future features
     */
    status: {
      type: String,
      enum: ["PLACED"],
      default: "PLACED",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
