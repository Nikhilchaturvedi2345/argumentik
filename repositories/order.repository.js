/**
 * order.repository.js
 * ------------------
 * Responsibilities:
 * - Handle order creation
 * - Deduct stock SAFELY
 * - Prevent negative stock
 * - Handle concurrent orders
 */

import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

/**
 * =====================
 * PLACE ORDER WITH STOCK CHECK
 * =====================
 * This function guarantees:
 * - Stock will never go below zero
 * - Concurrent orders are handled safely
 *
 * HOW?
 * - MongoDB atomic update with condition:
 *   stock >= quantity
 */
export const placeOrderWithStockCheck = async (
  productId,
  quantity
) => {
  /**
   * =====================
   * Start MongoDB Session
   * =====================
   * Enables transaction safety
   */
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    /**
     * =====================
     * Atomic Stock Deduction
     * =====================
     * Only updates if stock >= quantity
     */
    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: productId,
        stock: { $gte: quantity }, // 🔒 safety condition
      },
      {
        $inc: { stock: -quantity }, // deduct stock
      },
      {
        new: true, // return updated document
        session,
      }
    );

    /**
     * If no product returned:
     * - Product not found OR
     * - Insufficient stock
     */
    if (!updatedProduct) {
      await session.abortTransaction();
      session.endSession();

      return {
        success: false,
        message: "Insufficient stock or invalid product",
      };
    }

    /**
     * =====================
     * Create Order Record
     * =====================
     * Stock is already deducted at this point
     */
    const order = await Order.create(
      [
        {
          product: productId,
          quantity,
          priceAtPurchase: updatedProduct.price,
        },
      ],
      { session }
    );

    /**
     * =====================
     * Commit Transaction
     * =====================
     */
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      order: order[0],
      updatedStock: updatedProduct.stock,
    };
  } catch (error) {
    /**
     * Rollback on any failure
     */
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};
