import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function Wishlist() {
  // FIXED: Use environment variable instead of hardcoded localhost
  const API_URL = `${import.meta.env.VITE_API_URL}/api/wishlist`;

  const [wishlist, setWishlist] = useState([]);
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
  // GET WISHLIST FROM BACKEND
  // =========================
  const loadWishlist = async () => {
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
        throw new Error(
          data.message || "Failed to fetch wishlist"
        );
      }

      setWishlist(data.products || []);
    } catch (error) {
      console.error("Fetch wishlist error:", error);
      toast.error("Failed to load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  // Load wishlist when page opens
  useEffect(() => {
    loadWishlist();
  }, []);

  // =========================
  // REMOVE FROM WISHLIST
  // =========================
  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch(
        `${API_URL}/${productId}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to remove from wishlist"
        );
      }

      setWishlist(data.products || []);
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Remove wishlist error:", error);
      toast.error(error.message || "Could not remove item.");
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <main className="wishlist-page">
        <div className="wishlist-header">
          <p className="wishlist-label">
            YOUR COLLECTION
          </p>

          <h1>Wishlist</h1>

          <span>Loading...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="wishlist-page">

      {/* Header */}
      <div className="wishlist-header">

        <p className="wishlist-label">
          YOUR COLLECTION
        </p>

        <h1>Wishlist</h1>

        <span>
          {wishlist.length}{" "}
          {wishlist.length === 1
            ? "item"
            : "items"}
        </span>

      </div>

      {/* Empty Wishlist */}
      {wishlist.length === 0 ? (

        <div className="empty-wishlist">

          <div className="empty-heart">
            ♡
          </div>

          <h2>
            Your wishlist is empty
          </h2>

          <p>
            Save something you love and
            come back to it later.
          </p>

          <Link
            to="/products"
            className="wishlist-explore"
          >
            Explore products
            <span>→</span>
          </Link>

        </div>

      ) : (

        /* Wishlist Products */
        <div className="wishlist-grid">

          {wishlist.map((item) => {

            const product = item;
            const productId = product?._id;

            return (
              <div
                className="wishlist-card"
                key={productId}
              >

                <div className="wishlist-image-wrapper">

                  <Link
                    to={`/product/${productId}`}
                  >
                    <img
                      src={product?.image}
                      alt={product?.title}
                    />
                  </Link>

                  <button
                    className="wishlist-remove"
                    onClick={() =>
                      removeFromWishlist(productId)
                    }
                    aria-label="Remove from wishlist"
                  >
                    ♥
                  </button>

                </div>

                <div className="wishlist-info">

                  <p className="wishlist-category">
                    {product?.category}
                  </p>

                  <h3>
                    {product?.title}
                  </h3>

                  <p className="wishlist-price">
                    ₹{product?.price}
                  </p>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </main>
  );
}

export default Wishlist;