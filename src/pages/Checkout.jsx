import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE = `${BASE_URL}/api`;

const Checkout = () => {
  const navigate = useNavigate();

  // Cart & User State
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  // Shipping Address State
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    state: '',
  });

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState('COD');

  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [discountData, setDiscountData] = useState(null); // { code, discountAmount, finalTotal, message }
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  // Order Submission State
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');

  // Load Cart Items on Mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to checkout');
          navigate('/login');
          return;
        }
        const { data } = await axios.get(`${API_BASE}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const items = data.items || [];
        setCartItems(items);
        calculateSubtotal(items);
      } catch (err) {
        console.error('Failed to load cart:', err);
        toast.error('Failed to load cart items');
      }
    };
    fetchCart();
  }, [navigate]);

  const calculateSubtotal = (items) => {
    const total = items.reduce((sum, item) => {
      const price = Number(item.product?.price || item.price || 0);
      const qty = Number(item.quantity || 1);
      return sum + price * qty;
    }, 0);
    setCartTotal(total);
  };

  // --- PROMO CODE HANDLERS ---
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      const { data } = await axios.post(`${API_BASE}/coupons/apply`, {
        code: promoCode.trim().toUpperCase(),
        cartTotal,
      });
      setDiscountData(data);
      toast.success(data.message || 'Promo code applied!');
    } catch (err) {
      setDiscountData(null);
      const msg = err.response?.data?.message || 'Invalid promo code';
      setPromoError(msg);
      toast.error(msg);
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setDiscountData(null);
    setPromoError('');
    toast.success('Promo code removed');
  };

  // --- PLACE ORDER HANDLER ---
  const discountAmount = discountData ? discountData.discountAmount : 0;
  const finalPayable = Math.max(cartTotal - discountAmount, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setOrderError('Your cart is empty!');
      return;
    }

    setPlacingOrder(true);
    setOrderError('');

    try {
      const token = localStorage.getItem('token');

      // Format shippingAddress as a clean String to match Order.js schema
      const formattedAddress = `${shippingAddress.fullName}, ${shippingAddress.phone}, ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.postalCode}`;

      const orderPayload = {
        shippingAddress: formattedAddress,
        paymentMethod,
        couponCode: discountData ? discountData.code : null,
      };

      await axios.post(`${API_BASE}/orders`, orderPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem('cart');
      toast.success(`Order Placed Successfully! Final Paid: ₹${finalPayable}`);
      navigate('/orders');
    } catch (err) {
      const msg = err.response?.data?.message || 'Error placing order. Please try again.';
      setOrderError(msg);
      toast.error(msg);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Checkout</h1>

      {orderError && (
        <div style={{ padding: '1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '1rem' }}>
          {orderError}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2rem' }}>
        {/* LEFT COLUMN: Shipping & Payment Form */}
        <form onSubmit={handlePlaceOrder} style={cardStyle}>
          <h3 style={{ marginBottom: '1rem' }}>Shipping Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <input
              type="text"
              placeholder="Full Name"
              required
              value={shippingAddress.fullName}
              onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Phone Number"
              required
              value={shippingAddress.phone}
              onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Street Address"
              required
              value={shippingAddress.address}
              onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
              style={inputStyle}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <input
                type="text"
                placeholder="City"
                required
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Postal Code"
                required
                value={shippingAddress.postalCode}
                onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                style={inputStyle}
              />
            </div>
            <input
              type="text"
              placeholder="State"
              required
              value={shippingAddress.state}
              onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
              style={inputStyle}
            />
          </div>

          <h3 style={{ marginTop: '1.5rem', marginBottom: '0.8rem' }}>Payment Method</h3>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery (COD)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="paymentMethod"
                value="ONLINE"
                checked={paymentMethod === 'ONLINE'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Online Payment
            </label>
          </div>

          <button type="submit" disabled={placingOrder} style={placeOrderBtnStyle}>
            {placingOrder ? 'Placing Order...' : `Place Order (₹${finalPayable})`}
          </button>
        </form>

        {/* RIGHT COLUMN: Order Summary & Promo Code Box */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '1rem' }}>Order Summary</h3>

          {/* Cart Items List */}
          <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
            {cartItems.map((item, idx) => {
              const title = item.product?.title || item.product?.name || item.title || item.name || 'Product';
              const price = Number(item.product?.price || item.price || 0);
              const qty = Number(item.quantity || 1);
              return (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.95rem' }}>
                  <span>{title} × {qty}</span>
                  <span style={{ fontWeight: '600' }}>₹{price * qty}</span>
                </div>
              );
            })}
            {cartItems.length === 0 && <p style={{ color: '#888' }}>No items in cart.</p>}
          </div>

          {/* PROMO CODE SECTION */}
          <div style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#f9fafb' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Have a Promo Code?
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                disabled={!!discountData}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                style={{ flex: 1, padding: '0.6rem', border: '1px solid #ccc', borderRadius: '6px', textTransform: 'uppercase' }}
              />
              {!discountData ? (
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  disabled={promoLoading}
                  style={{ padding: '0.6rem 1.2rem', background: '#111827', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                >
                  {promoLoading ? '...' : 'Apply'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRemovePromo}
                  style={{ padding: '0.6rem 1rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Remove
                </button>
              )}
            </div>
            {promoError && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.5rem' }}>{promoError}</p>}
            {discountData && (
              <p style={{ color: '#16a34a', fontSize: '0.88rem', fontWeight: '600', marginTop: '0.5rem' }}>
                ✓ {discountData.message}
              </p>
            )}
          </div>

          {/* TOTAL BREAKDOWN */}
          <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            {discountData && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: '600' }}>
                <span>Discount ({discountData.code})</span>
                <span>-₹{discountData.discountAmount}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Shipping</span>
              <span style={{ color: '#16a34a' }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #111', paddingTop: '0.8rem', marginTop: '0.4rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
              <span>Total Payable</span>
              <span>₹{finalPayable}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  background: '#fff',
  padding: '1.5rem',
  borderRadius: '10px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
  alignSelf: 'start',
};

const inputStyle = {
  padding: '0.7rem',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  fontSize: '0.95rem',
};

const placeOrderBtnStyle = {
  width: '100%',
  padding: '0.9rem',
  background: '#4f46e5',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
};

export default Checkout;