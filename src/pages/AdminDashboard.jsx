import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const API_URL = 'http://localhost:5000/api/coupons';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    salesChartData: [],
  });

  const [coupons, setCoupons] = useState([]);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minOrderAmount: '',
    expiryDate: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStats();
    fetchCoupons();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/stats`);
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  };

  const fetchCoupons = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/all`);
      setCoupons(data);
    } catch (err) {
      console.error('Failed to load coupons', err);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/create`, formData);
      setMessage('Coupon created successfully!');
      setFormData({
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        minOrderAmount: '',
        expiryDate: '',
      });
      fetchCoupons();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error creating coupon');
    }
  };

  const handleDeleteCoupon = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchCoupons();
    } catch (err) {
      console.error('Error deleting coupon', err);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Admin Dashboard</h1>

      {/* 1. KPI Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={cardStyle}>
          <h4>Total Revenue</h4>
          <h2>₹{stats.totalRevenue.toLocaleString()}</h2>
        </div>
        <div style={cardStyle}>
          <h4>Total Orders</h4>
          <h2>{stats.totalOrders}</h2>
        </div>
        <div style={cardStyle}>
          <h4>Total Products</h4>
          <h2>{stats.totalProducts}</h2>
        </div>
        <div style={cardStyle}>
          <h4>Registered Users</h4>
          <h2>{stats.totalUsers}</h2>
        </div>
      </div>

      {/* 2. Revenue Chart */}
      <div style={{ ...cardStyle, marginBottom: '2rem', height: '350px' }}>
        <h3 style={{ marginBottom: '1rem' }}>Monthly Revenue Overview</h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={stats.salesChartData.length ? stats.salesChartData : [{ name: 'Current', revenue: stats.totalRevenue }]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 3. Promo Code Management Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
        {/* Create Promo Code Form */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '1rem' }}>Create Promo Code</h3>
          {message && <p style={{ color: '#4f46e5', fontWeight: 'bold' }}>{message}</p>}
          <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <input
              type="text"
              placeholder="Code (e.g. ZOVA50)"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              required
              style={inputStyle}
            />
            <select
              value={formData.discountType}
              onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
              style={inputStyle}
            >
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FLAT">Flat Amount (₹)</option>
            </select>
            <input
              type="number"
              placeholder="Discount Value (e.g. 20 for 20% or ₹20)"
              value={formData.discountValue}
              onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
              required
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="Min Order Amount (₹)"
              value={formData.minOrderAmount}
              onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
              style={inputStyle}
            />
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              required
              style={inputStyle}
            />
            <button type="submit" style={btnStyle}>Create Coupon</button>
          </form>
        </div>

        {/* Active Promo Codes List */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '1rem' }}>Active Promo Codes</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '0.5rem' }}>Code</th>
                <th style={{ padding: '0.5rem' }}>Discount</th>
                <th style={{ padding: '0.5rem' }}>Min Order</th>
                <th style={{ padding: '0.5rem' }}>Expires</th>
                <th style={{ padding: '0.5rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.6rem', fontWeight: 'bold' }}>{c.code}</td>
                  <td style={{ padding: '0.6rem' }}>
                    {c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : `₹${c.discountValue}`}
                  </td>
                  <td style={{ padding: '0.6rem' }}>₹{c.minOrderAmount}</td>
                  <td style={{ padding: '0.6rem' }}>{new Date(c.expiryDate).toLocaleDateString()}</td>
                  <td style={{ padding: '0.6rem' }}>
                    <button
                      onClick={() => handleDeleteCoupon(c._id)}
                      style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '1rem', textAlign: 'center', color: '#888' }}>
                    No promo codes created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
};

const inputStyle = {
  padding: '0.65rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '0.95rem',
};

const btnStyle = {
  padding: '0.75rem',
  background: '#4f46e5',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

export default AdminDashboard;