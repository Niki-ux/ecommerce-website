import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";

export default function ProductCard({ product }) {
  const productId = product._id || product.id;

  const [isAdded, setIsAdded] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

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

  useEffect(() => {
    if (!toastMessage) return;

    const timer = window.setTimeout(() => {
      setToastMessage("");
    }, 2600);

    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const addToCart = () => {
    const existingCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = existingCart.find(
      (item) => (item._id || item.id) === productId
    );

    const updatedCart = existingProduct
      ? existingCart.map((item) =>
          (item._id || item.id) === productId
            ? {
                ...item,
                quantity: (item.quantity || 1) + 1,
              }
            : item
        )
      : [
          ...existingCart,
          { ...product, quantity: 1 },
        ];

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    window.dispatchEvent(new Event("cartUpdated"));

    setIsAdded(true);
    setToastMessage(`${product.title} added to your bag`);
  };

  const toggleWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      if (isWishlisted) {
        const response = await fetch(
          `http://localhost:5000/api/wishlist/${productId}`,
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
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/wishlist",
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
    } catch (error) {
      console.error("Wishlist error:", error);
      alert(error.message);
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

      {toastMessage && (
        <div className="zova-cart-toast" role="status">
          <span className="zova-cart-toast-icon">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}