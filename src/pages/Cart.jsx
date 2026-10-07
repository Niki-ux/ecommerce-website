import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function Cart() {
  // FIXED: Use environment variable instead of hardcoded localhost
  const API_URL = `${import.meta.env.VITE_API_URL}/api/cart`;

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first.");
        return;
      }

      // FIXED: Use environment variable instead of hardcoded localhost
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shippingAddress: "IIT Jodhpur, Rajasthan",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      toast.success("Order placed successfully!");
      
      // Auto-refresh the cart to show it is now empty after checkout
      fetchCart();
      
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.message);
    }
  };

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get JWT token
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // Headers for authenticated API requests
  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  });

  // =========================
  // GET CART FROM BACKEND
  // =========================
  const fetchCart = async () => {
    try {
      const token = getToken();

      if (!token) {
        console.log("User is not logged in");
        setLoading(false);
        return;
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch cart");
      }

      setCart(data.items || []);
    } catch (error) {
      console.error("Fetch cart error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart when page loads
  useEffect(() => {
    fetchCart();
  }, []);

  // =========================
  // INCREASE QUANTITY
  // =========================
  const increaseQuantity = async (productId, currentQuantity) => {
    try {
      const response = await fetch(`${API_URL}/${productId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({
          quantity: currentQuantity + 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update quantity");
      }

      setCart(data.items || []);
    } catch (error) {
      console.error("Increase quantity error:", error);
    }
  };

  // =========================
  // DECREASE QUANTITY
  // =========================
  const decreaseQuantity = async (productId, currentQuantity) => {
    if (currentQuantity <= 1) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${productId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({
          quantity: currentQuantity - 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update quantity");
      }

      setCart(data.items || []);
    } catch (error) {
      console.error("Decrease quantity error:", error);
    }
  };

  // =========================
  // REMOVE PRODUCT
  // =========================
  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/${productId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to remove product");
      }

      setCart(data.items || []);
    } catch (error) {
      console.error("Remove product error:", error);
    }
  };

  // =========================
  // CLEAR CART
  // =========================
  const clearCart = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to clear cart");
      }

      setCart([]);
    } catch (error) {
      console.error("Clear cart error:", error);
    }
  };

  // =========================
  // CALCULATE TOTAL
  // =========================
  const total = cart.reduce((sum, item) => {
    const product = item.product;

    return (
      sum + Number(product?.price || 0) * Number(item.quantity || 1)
    );
  }, 0);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div
        style={{
          maxWidth: "1100px",
          margin: "40px auto",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <h2>Loading cart...</h2>
      </div>
    );
  }

  // =========================
  // EMPTY CART
  // =========================
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

  // =========================
  // CART UI
  // =========================
  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "40px auto",
        padding: "24px",
      }}
    >
      <h1 style={{ marginBottom: "30px" }}>Your Cart</h1>

      {cart.map((item) => {
        const product = item.product;
        const productId = product?._id;
        const quantity = item.quantity || 1;

        return (
          <div
            key={productId}
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
              src={product?.image}
              alt={product?.title}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />

            {/* Product Information */}
            <div style={{ flex: 1 }}>
              <h3>{product?.title}</h3>

              <p>
                Price: <strong>₹{product?.price}</strong>
              </p>

              {/* Quantity */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() => decreaseQuantity(productId, quantity)}
                  disabled={quantity <= 1}
                >
                  −
                </button>

                <span>{quantity}</span>

                <button onClick={() => increaseQuantity(productId, quantity)}>
                  +
                </button>
              </div>
            </div>

            {/* Remove */}
            <button
              onClick={() => removeFromCart(productId)}
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
        );
      })}

      {/* Cart Summary */}
      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          borderTop: "2px solid #ddd",
          textAlign: "right",
        }}
      >
        <h2>Total: ₹{total.toFixed(2)}</h2>
        <button className="checkout-button" onClick={handleCheckout}>
          Checkout
        </button>
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