/**
 * order.controller.js
 * -------------------
 * Responsibilities:
 * - Validate incoming orders
 * - Ensure stock never goes negative
 * - Emit real-time stock updates
 */

import {
  placeOrderWithStockCheck,
} from "../repositories/order.repository.js";

/**
 * =====================
 * PLACE ORDER
 * =====================
 * Request body:
 * {
 *   "productId": "mongo_id",
 *   "quantity": 2
 * }
 *
 * This function:
 * - Validates input
 * - Calls atomic DB operation
 * - Emits real-time stock updates
 */
export const placeOrder = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    /**
     * =====================
     * Input Validation
     * =====================
     * Frontend cannot be trusted
     */
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid productId and quantity are required",
      });
    }

    /**
     * =====================
     * Place Order (Atomic)
     * =====================
     * This function guarantees:
     * - No negative stock
     * - Safe concurrent ordering
     */
    const orderResult = await placeOrderWithStockCheck(
      productId,
      quantity
    );

    /**
     * If stock was insufficient
     */
    if (!orderResult.success) {
      return res.status(400).json({
        success: false,
        message: orderResult.message,
      });
    }

    /**
     * =====================
     * Emit Real-Time Stock Update
     * =====================
     * Push update to:
     * - Staff Mobile App
     * - Admin Web App
     */
    const io = req.app.get("io");
    io.emit("stock:update", {
      productId,
      newStock: orderResult.updatedStock,
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: orderResult.order,
    });
  } catch (error) {
    next(error);
  }
};
