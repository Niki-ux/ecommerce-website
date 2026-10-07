import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const productId = product._id || product.id;

  const [isWishlisted, setIsWishlisted] = useState(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    return wishlist.some((item) => (item._id || item.id) === productId);
  });

  // FIXED: Now properly connects to the backend Database instead of LocalStorage
  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first.");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: productId,
          quantity: 1, // Default quantity of 1 when adding from the product card
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add product to cart");
      }

      toast.success(`${product.title} added to cart!`);
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(error.message);
    }
  };

  const toggleWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first.");
        return;
      }

      if (isWishlisted) {
        // FIXED: Removed hardcoded localhost
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/wishlist/${productId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to remove from wishlist");
        }

        setIsWishlisted(false);
        toast.success("Removed from wishlist");
        return;
      }

      // FIXED: Removed hardcoded localhost
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: productId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add to wishlist");
      }

      setIsWishlisted(true);
      toast.success("Added to wishlist!");
    } catch (error) {
      console.error("Wishlist error:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <Link to={`/product/${productId}`}>
          <img
            src={product.image}
            alt={product.title}
            className="product-image"
          />
        </Link>

        <button
          type="button"
          className="wishlist-button"
          onClick={toggleWishlist}
          aria-label="Wishlist"
        >
          {isWishlisted ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>

      <Link to={`/product/${productId}`} className="product-title">
        <h3>{product.title}</h3>
      </Link>

      <p
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          color: "#16a34a",
        }}
      >
        ₹{product.price}
      </p>

      <button type="button" onClick={addToCart} className="add-cart-button">
        Add to Cart
      </button>
    </div>
  );
}