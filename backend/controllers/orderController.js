import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Coupon from "../models/Coupon.js";

export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, couponCode } = req.body;

    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty",
      });
    }

    const items = cart.items.map((item) => ({
      product: item.product._id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
    }));

    // Calculate initial subtotal
    const subtotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    let discountAmount = 0;
    let finalTotal = subtotal;

    // Server-side coupon validation and discount calculation
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
      
      // Check if coupon exists, is not expired, and meets minimum order amount
      if (
        coupon &&
        new Date() <= new Date(coupon.expiryDate) &&
        subtotal >= coupon.minOrderAmount
      ) {
        if (coupon.discountType === "PERCENTAGE") {
          discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
        } else {
          discountAmount = coupon.discountValue;
        }
        
        // Ensure discount doesn't exceed the subtotal
        discountAmount = Math.min(discountAmount, subtotal);
        finalTotal = subtotal - discountAmount;
      }
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      subtotal,
      couponCode: discountAmount > 0 ? couponCode : null, // Only save if actually applied
      discountAmount,
      totalAmount: finalTotal,
      shippingAddress,
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};