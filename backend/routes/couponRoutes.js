import express from "express";
import {
  createCoupon,
  getAllCoupons,
  deleteCoupon,
  validateCoupon,
  getDashboardStats,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  getAllUsersAdmin,
} from "../controllers/couponController.js";

const router = express.Router();

// Dashboard & Admin Management Routes
router.get("/stats", getDashboardStats);
router.get("/orders", getAllOrdersAdmin);
router.put("/orders/:id/status", updateOrderStatusAdmin);
router.get("/users", getAllUsersAdmin);

// Coupon Routes
router.post("/create", createCoupon);
router.get("/all", getAllCoupons);
router.delete("/:id", deleteCoupon);
router.post("/apply", validateCoupon);

export default router;