import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaRegHeart, FaHeart } from "react-icons/fa"; // Added for the wishlist toggle

export default function ProductDetails() {
  const { id } = useParams();

  const [quantity, setQuantity] = useState(1);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Added Wishlist State
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();
        setItem(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    // Check if item is already in wishlist on load
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setIsWishlisted(wishlist.some((w) => (w._id || w.id) === id));
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Loading Details...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Error: {error}</h2>
      </div>
    );
  }

  if (!item) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Product not found</h2>
        <Link to="/products" style={{ color: "#b8892d", fontWeight: "600" }}>
          Back to catalog
        </Link>
      </div>
    );
  }

  // --- CART FUNCTION ---
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first.");
        return;
      }

      // Fixed URL to use env variable instead of localhost
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: item._id || item.id,
          quantity: quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add product to cart");
      }

      toast.success(`Added ${quantity} × ${item.title} to your cart!`);
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(error.message);
    }
  };

  // --- WISHLIST TOGGLE FUNCTION ---
  const toggleWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first.");
        return;
      }

      // REMOVE FROM WISHLIST
      if (isWishlisted) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/wishlist/${id}`,
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

      // ADD TO WISHLIST
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: id,
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
    <div
      style={{
        maxWidth: "1000px",
        margin: "40px auto",
        padding: "0 24px",
      }}
    >
      <Link
        to="/products"
        style={{
          display: "inline-block",
          marginBottom: "24px",
          color: "#50545b",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        ← Back to products
      </Link>

      <div
        style={{
          display: "flex",
          gap: "40px",
          flexWrap: "wrap",
          background: "#ffffff",
          padding: "36px",
          borderRadius: "12px",
          border: "1px solid #e9e6df",
        }}
      >
        <div style={{ flex: "1 1 360px", maxWidth: "450px" }}>
          <img
            src={item.image}
            alt={item.title}
            style={{
              width: "100%",
              height: "400px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </div>

        <div style={{ flex: "1 1 320px" }}>
          <span
            style={{
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#b8892d",
              fontWeight: "700",
            }}
          >
            {item.category}
          </span>

          <h1
            style={{
              margin: "10px 0 8px",
              fontSize: "32px",
              fontFamily: 'Georgia, "Times New Roman", serif',
              color: "#17233f",
            }}
          >
            {item.title}
          </h1>

          <div
            style={{
              color: "#d6ad35",
              fontSize: "14px",
              marginBottom: "16px",
            }}
          >
            {"★".repeat(Math.floor(item.rating || 0))} ({item.rating || 0} / 5.0) ·{" "}
            {item.reviewsCount || 0} reviews
          </div>

          <p
            style={{
              fontSize: "26px",
              fontWeight: "700",
              color: "#172033",
              margin: "12px 0 20px",
            }}
          >
            ₹{item.price?.toFixed(2)}
          </p>

          <p
            style={{
              color: "#50545b",
              lineHeight: "1.6",
              marginBottom: "28px",
              fontSize: "14px",
            }}
          >
            {item.description}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                border: "1px solid #dcdad3",
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                style={{
                  padding: "8px 14px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                -
              </button>

              <span
                style={{
                  padding: "0 10px",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                style={{
                  padding: "8px 14px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              style={{
                flex: "1",
                minWidth: "160px",
                padding: "12px 24px",
                background: "#172033",
                color: "#ffffff",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                transition: "0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#d1a936")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#172033")
              }
            >
              Add to Cart
            </button>

            {/* Added Wishlist Toggle Button */}
            <button
              type="button"
              onClick={toggleWishlist}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                border: "1px solid #dcdad3",
                background: "transparent",
                color: isWishlisted ? "#e63946" : "#172033",
                fontSize: "20px",
                cursor: "pointer",
                transition: "0.2s",
              }}
              aria-label="Toggle Wishlist"
            >
              {isWishlisted ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}