import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/orders",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message || "Failed to load orders."
          );
          return;
        }

        setOrders(data);
      } catch (err) {
        setError(
          "Unable to connect to the server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <main className="orders-page">
        <div className="orders-container">
          <p className="orders-loading">
            Loading your orders...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <div className="orders-container">

        <div className="orders-heading">
          <p>YOUR ZOVA ACCOUNT</p>
          <h1>My Orders</h1>
          <span>
            Track your ZOVA purchases and order history.
          </span>
        </div>

        {error && (
          <div className="orders-error">
            {error}
          </div>
        )}

        {!error && orders.length === 0 && (
          <div className="empty-orders">
            <div className="empty-orders-icon">
              📦
            </div>

            <h2>No orders yet</h2>

            <p>
              You haven't placed any orders yet.
            </p>

            <button
              type="button"
              onClick={() => navigate("/products")}
            >
              Start Shopping →
            </button>
          </div>
        )}

        {!error && orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => (
              <div
                className="order-card"
                key={order._id}
              >

                <div className="order-top">

                  <div>
                    <span className="order-label">
                      ORDER ID
                    </span>

                    <strong>
                      #{order._id.slice(-8).toUpperCase()}
                    </strong>
                  </div>

                  <div className="order-status">
                    {order.status}
                  </div>

                </div>

                <div className="order-divider" />

                <div className="order-products">

                  {order.items.map((item, index) => (
                    <div
                      className="order-product"
                      key={`${order._id}-${index}`}
                    >

                      <img
                        src={
                          item.image ||
                          "https://via.placeholder.com/80"
                        }
                        alt={item.title}
                      />

                      <div className="order-product-info">

                        <strong>
                          {item.title}
                        </strong>

                        <span>
                          Quantity: {item.quantity}
                        </span>

                        <span>
                          ₹{item.price.toLocaleString("en-IN")}
                        </span>

                      </div>

                    </div>
                  ))}

                </div>

                <div className="order-divider" />

                <div className="order-bottom">

                  <div>
                    <span className="order-label">
                      ORDER DATE
                    </span>

                    <strong>
                      {formatDate(order.createdAt)}
                    </strong>
                  </div>

                  <div className="order-total">
                    <span className="order-label">
                      TOTAL
                    </span>

                    <strong>
                      ₹{order.total.toLocaleString("en-IN")}
                    </strong>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}

export default Orders;