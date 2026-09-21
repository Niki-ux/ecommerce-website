import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "../data/products";

export default function ProductDetails() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const item = products.find((p) => p.id === Number(id));

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

  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = existingCart.findIndex((cartItem) => cartItem.id === item.id);

    let updatedCart;
    if (existingIndex > -1) {
      updatedCart = existingCart.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: (cartItem.quantity || 1) + quantity }
          : cartItem
      );
    } else {
      updatedCart = [...existingCart, { ...item, quantity }];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert(`Added ${quantity} × ${item.title} to your cart!`);
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 24px" }}>
      <Link
        to="/products"
        style={{
          display: "inline-block",
          marginBottom: "24px",
          color: "#50545b",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: "500"
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
          border: "1px solid #e9e6df"
        }}
      >
        {/* Image Container */}
        <div style={{ flex: "1 1 360px", maxWidth: "450px" }}>
          <img
            src={item.image}
            alt={item.title}
            style={{
              width: "100%",
              height: "400px",
              objectFit: "cover",
              borderRadius: "8px"
            }}
          />
        </div>

        {/* Product Details */}
        <div style={{ flex: "1 1 320px" }}>
          <span
            style={{
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#b8892d",
              fontWeight: "700"
            }}
          >
            {item.category}
          </span>

          <h1
            style={{
              margin: "10px 0 8px",
              fontSize: "32px",
              fontFamily: 'Georgia, "Times New Roman", serif',
              color: "#17233f"
            }}
          >
            {item.title}
          </h1>

          <div style={{ color: "#d6ad35", fontSize: "14px", marginBottom: "16px" }}>
            {"★".repeat(Math.floor(item.rating))} ({item.rating} / 5.0) · {item.reviewsCount} reviews
          </div>

          <p
            style={{
              fontSize: "26px",
              fontWeight: "700",
              color: "#172033",
              margin: "12px 0 20px"
            }}
          >
            ₹{item.price.toFixed(2)}
          </p>

          <p
            style={{
              color: "#50545b",
              lineHeight: "1.6",
              marginBottom: "28px",
              fontSize: "14px"
            }}
          >
            {item.description}
          </p>

          {/* Quantity Controls and Add to Cart */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                border: "1px solid #dcdad3",
                borderRadius: "20px",
                overflow: "hidden"
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
                  fontSize: "16px"
                }}
              >
                -
              </button>
              <span style={{ padding: "0 10px", fontWeight: "600", fontSize: "14px" }}>
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
                  fontSize: "16px"
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
                transition: "0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#d1a936")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#172033")}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}