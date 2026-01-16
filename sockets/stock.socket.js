/**
 * stock.socket.js
 * ----------------
 * Handles all Socket.IO related logic for stock updates.
 *
 * RESPONSIBILITIES:
 * - Handle client connections
 * - Manage stock update channels
 * - Keep socket logic separate from controllers
 */

export const registerStockSocket = (io) => {
  /**
   * =====================
   * On Client Connection
   * =====================
   */
  io.on("connection", (socket) => {
    console.log(`🟢 Client connected: ${socket.id}`);

    /**
     * =====================
     * Optional: Join Stock Room
     * =====================
     * Useful if you want to broadcast
     * only to inventory-related clients
     */
    socket.on("stock:join", () => {
      socket.join("stock-room");
      console.log(`📦 ${socket.id} joined stock-room`);
    });

    /**
     * =====================
     * Client Disconnect
     * =====================
     */
    socket.on("disconnect", () => {
      console.log(`🔴 Client disconnected: ${socket.id}`);
    });
  });
};
