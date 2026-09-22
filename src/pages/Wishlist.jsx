import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  const loadWishlist = () => {
    try {
      const savedWishlist =
        JSON.parse(localStorage.getItem("wishlist")) || [];

      setWishlist(savedWishlist);
    } catch {
      setWishlist([]);
    }
  };

  useEffect(() => {
    loadWishlist();

    window.addEventListener(
      "wishlistUpdated",
      loadWishlist
    );

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        loadWishlist
      );
    };
  }, []);

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter(
      (item) => item.id !== id
    );

    setWishlist(updatedWishlist);

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );

    window.dispatchEvent(
      new Event("wishlistUpdated")
    );
  };

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

          {wishlist.map((product) => (

            <div
              className="wishlist-card"
              key={product.id}
            >

              <div className="wishlist-image-wrapper">

                <Link
                  to={`/product/${product.id}`}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                  />
                </Link>

                <button
                  className="wishlist-remove"
                  onClick={() =>
                    removeFromWishlist(product.id)
                  }
                  aria-label="Remove from wishlist"
                >
                  ♥
                </button>

              </div>

              <div className="wishlist-info">

                <p className="wishlist-category">
                  {product.category}
                </p>

                <h3>
                  {product.title}
                </h3>

                <p className="wishlist-price">
                  ₹{product.price}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </main>
  );
}

export default Wishlist;