import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {

  const addToCart = () => {
    const existingCart =
      JSON.parse(localStorage.getItem('cart')) || [];

    const existingProduct = existingCart.find(
      (item) => item.id === product.id
    );

    let updatedCart;

    if (existingProduct) {
      updatedCart = existingCart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          ...product,
          quantity: 1
        }
      ];
    }

    localStorage.setItem(
      'cart',
      JSON.stringify(updatedCart)
    );

    alert(`${product.title} added to cart!`);
  };

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '15px',
        background: '#fff'
      }}
    >

      <Link
        to={`/product/${product.id}`}
        style={{
          textDecoration: 'none',
          color: 'inherit'
        }}
      >
        <img
          src={product.image}
          alt={product.title}
          style={{
            width: '100%',
            height: '220px',
            objectFit: 'cover',
            borderRadius: '8px'
          }}
        />

        <h3>{product.title}</h3>
      </Link>

      <p
        style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#16a34a'
        }}
      >
        ${product.price}
      </p>

      <button
        onClick={addToCart}
        style={{
          width: '100%',
          padding: '12px',
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Add to Cart
      </button>

    </div>
  );
}