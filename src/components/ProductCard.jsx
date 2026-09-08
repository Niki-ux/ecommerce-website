import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <img
          src={product.image}
          alt={product.title}
          style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '6px' }}
        />
        <h3 style={{ margin: '12px 0 6px', fontSize: '1.1rem' }}>{product.title}</h3>
      </Link>
      <div>
        <p style={{ fontWeight: 'bold', fontSize: '1.2rem', margin: '8px 0', color: '#16a34a' }}>
          ${product.price}
        </p>
        <button
          onClick={() => alert(`Added ${product.title} to cart!`)}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;