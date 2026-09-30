import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";

export default function ProductCard({ product }) {
  const productId = product._id || product.id;

  const [isWishlisted, setIsWishlisted] = useState(() => {
    const wishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    return wishlist.some(
      (item) => (item._id || item.id) === productId
    );
  });

  const addToCart = () => {
    const existingCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = existingCart.find(
      (item) => (item._id || item.id) === productId
    );

    let updatedCart;

    if (existingProduct) {
      updatedCart = existingCart.map((item) =>
        (item._id || item.id) === productId
          ? {
              ...item,
              quantity: (item.quantity || 1) + 1,
            }
          : item
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    alert(`${product.title} added to cart!`);
  };

  const toggleWishlist = () => {
    const wishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    const alreadyExists = wishlist.some(
      (item) => (item._id || item.id) === productId
    );

    let updatedWishlist;

    if (alreadyExists) {
      updatedWishlist = wishlist.filter(
        (item) => (item._id || item.id) !== productId
      );

      setIsWishlisted(false);
    } else {
      updatedWishlist = [
        ...wishlist,
        product,
      ];

      setIsWishlisted(true);
    }

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );

    window.dispatchEvent(
      new Event("wishlistUpdated")
    );
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
          {isWishlisted ? (
            <FaHeart />
          ) : (
            <FaRegHeart />
          )}
        </button>
      </div>

      <Link
        to={`/product/${productId}`}
        className="product-title"
      >
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
        className="add-cart-button"
      >
        Add to Cart
      </button>
    </div>
  );
}