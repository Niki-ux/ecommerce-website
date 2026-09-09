import React, { useEffect, useState } from "react";

function Cart() {
  const [cart, setCart] = useState([]);

  // Get cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Increase quantity
  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: (item.quantity || 1) + 1 }
        : item
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Decrease quantity
  const decreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: (item.quantity || 1) - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Remove product
  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // Calculate total
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );

  // Empty cart
  if (cart.length === 0) {
    return (
      <div
        style={{
          maxWidth: "1100px",
          margin: "40px auto",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <h1>Your Cart</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "40px auto",
        padding: "24px",
      }}
    >
      <h1 style={{ marginBottom: "30px" }}>Your Cart</h1>

      {cart.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            padding: "20px",
            marginBottom: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          {/* Product Image */}
          <img
            src={item.image}
            alt={item.title}
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              borderRadius: "6px",
            }}
          />

          {/* Product Information */}
          <div style={{ flex: 1 }}>
            <h3>{item.title}</h3>

            <p>
              Price: <strong>${item.price}</strong>
            </p>

            {/* Quantity */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <button onClick={() => decreaseQuantity(item.id)}>
                −
              </button>

              <span>{item.quantity || 1}</span>

              <button onClick={() => increaseQuantity(item.id)}>
                +
              </button>
            </div>
          </div>

          {/* Remove */}
          <button
            onClick={() => removeFromCart(item.id)}
            style={{
              padding: "8px 12px",
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Remove
          </button>
        </div>
      ))}

      {/* Cart Summary */}
      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          borderTop: "2px solid #ddd",
          textAlign: "right",
        }}
      >
        <h2>Total: ${total.toFixed(2)}</h2>

        <button
          onClick={clearCart}
          style={{
            padding: "10px 20px",
            marginTop: "10px",
            backgroundColor: "#111827",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}

export default Cart;