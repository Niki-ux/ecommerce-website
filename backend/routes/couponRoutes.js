import express from "express";
import {
  createCoupon,
  getAllCoupons,
  deleteCoupon,
  validateCoupon,
  getDashboardStats,
} from "../controllers/couponController.js";

const router = express.Router();

router.get("/stats", getDashboardStats);
router.post("/create", createCoupon);
router.get("/all", getAllCoupons);
router.delete("/:id", deleteCoupon);
router.post("/apply", validateCoupon);

export default router;