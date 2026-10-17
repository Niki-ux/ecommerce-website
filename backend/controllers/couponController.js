import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// 1. Admin: Create a new coupon
export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, expiryDate } = req.body;

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount) || 0,
      expiryDate,
    });

    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: "Server error creating coupon", error: error.message });
  }
};

// 2. Admin: Get all coupons
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Error fetching coupons", error: error.message });
  }
};

// 3. Admin: Delete a coupon
export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting coupon", error: error.message });
  }
};

// 4. Customer: Validate & Apply Coupon at Checkout
export const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) {
      return res.status(404).json({ message: "Invalid promo code" });
    }

    if (new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({ message: "This promo code has expired" });
    }

    if (cartTotal < coupon.minOrderAmount) {
      return res.status(400).json({
        message: `Minimum order of ₹${coupon.minOrderAmount} required for this code`,
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = Math.round((cartTotal * coupon.discountValue) / 100);
    } else {
      discountAmount = coupon.discountValue;
    }

    discountAmount = Math.min(discountAmount, cartTotal);
    const finalTotal = cartTotal - discountAmount;

    res.json({
      success: true,
      code: coupon.code,
      discountAmount,
      finalTotal,
      message: `Promo code applied! You saved ₹${discountAmount}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Error applying coupon", error: error.message });
  }
};

// 5. Admin: Get Dashboard Stats & Chart Data
export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

    const monthlySales = {};
    orders.forEach((order) => {
      const month = new Date(order.createdAt).toLocaleString("default", { month: "short" });
      monthlySales[month] = (monthlySales[month] || 0) + (order.totalAmount || 0);
    });

    const salesChartData = Object.keys(monthlySales).map((month) => ({
      name: month,
      revenue: monthlySales[month],
    }));

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      salesChartData,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
};