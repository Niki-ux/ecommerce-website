import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';

export default function ProductDetails() {
  const { id } = useParams();
  const item = products.find((p) => p.id === Number(id));

  if (!item) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Product not found</h2>
        <Link to="/products" style={{ color: '#2563eb' }}>Back to catalog</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '850px', margin: '30px auto', padding: '0 20px', textAlign: 'left' }}>
      <Link to="/products" style={{ display: 'inline-block', marginBottom: '20px', color: '#4b5563', textDecoration: 'none' }}>
        ← Back to products
      </Link>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'center' }}>
        <img
          src={item.image}
          alt={item.title}
          style={{ width: '100%', maxWidth: '360px', height: '320px', objectFit: 'cover', borderRadius: '10px' }}
        />

        <div style={{ flex: 1, minWidth: '260px' }}>
          <span style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: '#6b7280' }}>
            {item.category}
          </span>
          <h1 style={{ margin: '8px 0', fontSize: '28px' }}>{item.title}</h1>
          <div style={{ color: '#f59e0b', fontSize: '14px', marginBottom: '10px' }}>
            ★ {item.rating} / 5.0
          </div>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a', margin: '10px 0' }}>
            ${item.price}
          </p>
          <p style={{ color: '#4b5563', lineHeight: '1.5', margin: '15px 0 25px' }}>
            {item.description}
          </p>
          <button
            onClick={() => alert(`Added ${item.title} to cart!`)}
            style={{ padding: '12px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}