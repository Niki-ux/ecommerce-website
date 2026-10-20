
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const productId = product._id || product.id;

  const [isAdded, setIsAdded] = useState(false);

  const [isWishlisted, setIsWishlisted] = useState(() => {
    const wishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    return wishlist.some(
      (item) => (item._id || item.id) === productId
    );
  });

  useEffect(() => {
    if (!isAdded) return;

    const timer = window.setTimeout(() => {
      setIsAdded(false);
    }, 1400);

    return () => window.clearTimeout(timer);
  }, [isAdded]);

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first.");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId,
            quantity: 1,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add product to cart"
        );
      }

      setIsAdded(true);
      toast.success(`${product.title} added to your bag!`);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(error.message || "Unable to add product to cart");
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
          throw new Error(
            data.message || "Failed to remove from wishlist"
          );
        }

        setIsWishlisted(false);
        window.dispatchEvent(new Event("wishlistUpdated"));
        toast.success("Removed from wishlist");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/wishlist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add to wishlist"
        );
      }

      setIsWishlisted(true);
      window.dispatchEvent(new Event("wishlistUpdated"));
      toast.success("Added to wishlist!");
    } catch (error) {
      console.error("Wishlist error:", error);
      toast.error(error.message || "Wishlist update failed");
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
          aria-label={
            isWishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
          aria-pressed={isWishlisted}
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

      <button
        type="button"
        onClick={addToCart}
        className={`add-cart-button ${isAdded ? "is-added" : ""}`}
      >
        {isAdded ? "ADDED ✓" : "ADD TO BAG"}
      </button>
    </div>
  );
}
