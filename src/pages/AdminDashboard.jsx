import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FiGrid,
  FiShoppingBag,
  FiBox,
  FiTag,
  FiUsers,
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiTrendingUp,
} from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const COUPON_API = `${BASE_URL}/api/coupons`;
const PRODUCT_API = `${BASE_URL}/api/products`;

const PIE_COLORS = ["#172033", "#b8892d", "#4f46e5", "#16a34a", "#ef4444"];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);

  // Data States
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    salesChartData: [],
    categoryChartData: [],
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [users, setUsers] = useState([]);

  // Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");
  const [productSearch, setProductSearch] = useState("");

  // Coupon Form State
  const [couponForm, setCouponForm] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minOrderAmount: "",
    expiryDate: "",
  });

  // Product Form State (Create / Edit)
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: "",
    price: "",
    category: "Electronics",
    stock: 20,
    image: "",
    description: "",
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchAllAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, productsRes, couponsRes, usersRes] =
        await Promise.all([
          axios.get(`${COUPON_API}/stats`),
          axios.get(`${COUPON_API}/orders`),
          axios.get(PRODUCT_API),
          axios.get(`${COUPON_API}/all`),
          axios.get(`${COUPON_API}/users`),
        ]);

      setStats(statsRes.data);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setCoupons(couponsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
      toast.error("Failed to sync some dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  // ==========================
  // ORDER HANDLERS
  // ==========================
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`${COUPON_API}/orders/${orderId}/status`, {
        status: newStatus,
      });
      toast.success(`Order status updated to ${newStatus}`);
      fetchAllAdminData();
    } catch (err) {
      toast.error("Failed to update order status");
    }
  };

  // ==========================
  // PRODUCT HANDLERS
  // ==========================
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        inStock: Number(productForm.stock) > 0,
      };

      if (editingProduct) {
        await axios.put(`${PRODUCT_API}/${editingProduct._id}`, payload, {
          headers: getAuthHeaders(),
        });
        toast.success("Product updated successfully!");
      } else {
        await axios.post(PRODUCT_API, payload, {
          headers: getAuthHeaders(),
        });
        toast.success("New product added to store!");
      }

      setEditingProduct(null);
      setProductForm({
        title: "",
        price: "",
        category: "Electronics",
        stock: 20,
        image: "",
        description: "",
      });
      fetchAllAdminData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product");
    }
  };

  const handleEditProductClick = (product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title || "",
      price: product.price || "",
      category: product.category || "Electronics",
      stock: product.stock ?? 20,
      image: product.image || "",
      description: product.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${PRODUCT_API}/${id}`, {
        headers: getAuthHeaders(),
      });
      toast.success("Product deleted");
      fetchAllAdminData();
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  // ==========================
  // COUPON HANDLERS
  // ==========================
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        code: couponForm.code.trim().toUpperCase(),
        discountType: couponForm.discountType,
        discountValue: Number(couponForm.discountValue),
        minOrderAmount: Number(couponForm.minOrderAmount) || 0,
        expiryDate: couponForm.expiryDate,
      };
      await axios.post(`${COUPON_API}/create`, payload);
      toast.success("Promo code created!");
      setCouponForm({
        code: "",
        discountType: "PERCENTAGE",
        discountValue: "",
        minOrderAmount: "",
        expiryDate: "",
      });
      fetchAllAdminData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating coupon");
    }
  };

  const handleDeleteCoupon = async (id) => {
    try {
      await axios.delete(`${COUPON_API}/${id}`);
      toast.success("Promo code deleted");
      fetchAllAdminData();
    } catch (err) {
      toast.error("Error deleting coupon");
    }
  };

  // Filtered Lists
  const filteredOrders = orders.filter((o) =>
    orderStatusFilter === "All" ? true : o.status === orderStatusFilter
  );

  const filteredProducts = products.filter((p) =>
    p.title?.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const getStatusBadgeStyle = (status) => {
    const map = {
      Pending: { bg: "#fef3c7", color: "#d97706" },
      Confirmed: { bg: "#e0e7ff", color: "#4f46e5" },
      Shipped: { bg: "#dbeafe", color: "#2563eb" },
      Delivered: { bg: "#dcfce7", color: "#16a34a" },
      Cancelled: { bg: "#fee2e2", color: "#dc2626" },
    };
    return map[status] || { bg: "#f3f4f6", color: "#374151" };
  };

  return (
    <div style={{ minHeight: "85vh", background: "#f7f4ed", padding: "2rem 4%" }}>
      <div style={{ maxWidth: "1360px", margin: "0 auto" }}>
        {/* TOP HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.8rem",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "2.5px",
                color: "#b8892d",
                textTransform: "uppercase",
              }}
            >
              ZOVA MANAGEMENT
            </span>
            <h1 style={{ margin: "4px 0 0", fontSize: "2.2rem", color: "#172033" }}>
              Admin Command Center
            </h1>
          </div>

          <button
            onClick={fetchAllAdminData}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              background: "#172033",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "13px",
            }}
          >
            <FiRefreshCw />
            {loading ? "Syncing..." : "Refresh Data"}
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div
          style={{
            display: "flex",
            gap: "0.6rem",
            flexWrap: "wrap",
            marginBottom: "2rem",
            borderBottom: "1px solid #e5e0d5",
            paddingBottom: "0.8rem",
          }}
        >
          {[
            { id: "overview", label: "Overview", icon: <FiGrid /> },
            { id: "orders", label: `Orders (${orders.length})`, icon: <FiShoppingBag /> },
            { id: "products", label: `Products (${products.length})`, icon: <FiBox /> },
            { id: "coupons", label: `Promo Codes (${coupons.length})`, icon: <FiTag /> },
            { id: "users", label: `Users (${users.length})`, icon: <FiUsers /> },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  border: active ? "1px solid #172033" : "1px solid transparent",
                  background: active ? "#172033" : "#ffffff",
                  color: active ? "#ffffff" : "#50545b",
                  fontWeight: "600",
                  fontSize: "13.5px",
                  cursor: "pointer",
                  transition: "0.2s",
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ====================================================
            TAB 1: OVERVIEW
        ==================================================== */}
        {activeTab === "overview" && (
          <div>
            {/* KPI CARDS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.2rem",
                marginBottom: "2rem",
              }}
            >
              <div style={cardStyle}>
                <span style={kpiLabelStyle}>Total Revenue</span>
                <h2 style={{ ...kpiValueStyle, color: "#16a34a" }}>
                  ₹{(stats.totalRevenue || 0).toLocaleString("en-IN")}
                </h2>
                <span style={kpiSubStyle}>Excludes cancelled orders</span>
              </div>

              <div style={cardStyle}>
                <span style={kpiLabelStyle}>Total Orders</span>
                <h2 style={kpiValueStyle}>{stats.totalOrders}</h2>
                <span style={{ ...kpiSubStyle, color: "#d97706" }}>
                  {stats.pendingOrders || 0} pending fulfillment
                </span>
              </div>

              <div style={cardStyle}>
                <span style={kpiLabelStyle}>Products in Catalog</span>
                <h2 style={kpiValueStyle}>{stats.totalProducts}</h2>
                <span style={{ ...kpiSubStyle, color: stats.lowStockProducts > 0 ? "#dc2626" : "#6b7280" }}>
                  {stats.lowStockProducts || 0} low stock items (≤5)
                </span>
              </div>

              <div style={cardStyle}>
                <span style={kpiLabelStyle}>Registered Users</span>
                <h2 style={kpiValueStyle}>{stats.totalUsers}</h2>
                <span style={kpiSubStyle}>{coupons.length} active promo codes</span>
              </div>
            </div>

            {/* CHARTS ROW */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
                gap: "1.5rem",
                marginBottom: "2rem",
              }}
            >
              {/* Revenue Bar Chart */}
              <div style={{ ...cardStyle, height: "360px" }}>
                <h3 style={{ marginTop: 0, marginBottom: "1rem", fontSize: "1.1rem" }}>
                  <FiTrendingUp style={{ marginRight: "6px", verticalAlign: "middle" }} />
                  Monthly Revenue Overview
                </h3>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart
                    data={
                      stats.salesChartData?.length
                        ? stats.salesChartData
                        : [{ name: "Current", revenue: stats.totalRevenue || 0 }]
                    }
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(val) => `₹${Number(val).toLocaleString("en-IN")}`} />
                    <Bar dataKey="revenue" fill="#172033" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Category Pie Chart */}
              <div style={{ ...cardStyle, height: "360px" }}>
                <h3 style={{ marginTop: 0, marginBottom: "1rem", fontSize: "1.1rem" }}>
                  Catalog by Category
                </h3>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie
                      data={
                        stats.categoryChartData?.length
                          ? stats.categoryChartData
                          : [{ name: "Products", value: 1 }]
                      }
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={95}
                      label
                    >
                      {(stats.categoryChartData || []).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RECENT ORDERS PREVIEW */}
            <div style={cardStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <h3 style={{ margin: 0 }}>Recent Orders</h3>
                <button
                  onClick={() => setActiveTab("orders")}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#b8892d",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  View All Orders →
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={tableStyle}>
                  <thead>
                    <tr style={theadRowStyle}>
                      <th style={thStyle}>Order ID</th>
                      <th style={thStyle}>Customer</th>
                      <th style={thStyle}>Date</th>
                      <th style={thStyle}>Total</th>
                      <th style={thStyle}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => {
                      const badge = getStatusBadgeStyle(order.status);
                      return (
                        <tr key={order._id} style={trStyle}>
                          <td style={{ ...tdStyle, fontWeight: "700" }}>
                            #{order._id.slice(-8).toUpperCase()}
                          </td>
                          <td style={tdStyle}>
                            {order.user?.name || "Customer"}{" "}
                            <span style={{ color: "#888", fontSize: "12px" }}>
                              ({order.user?.email || "N/A"})
                            </span>
                          </td>
                          <td style={tdStyle}>
                            {new Date(order.createdAt).toLocaleDateString("en-IN")}
                          </td>
                          <td style={{ ...tdStyle, fontWeight: "700" }}>
                            ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
                          </td>
                          <td style={tdStyle}>
                            <span
                              style={{
                                padding: "4px 10px",
                                borderRadius: "999px",
                                fontSize: "11px",
                                fontWeight: "700",
                                background: badge.bg,
                                color: badge.color,
                              }}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ padding: "1.5rem", textAlign: "center", color: "#888" }}>
                          No orders placed yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            TAB 2: ORDERS MANAGEMENT
        ==================================================== */}
        {activeTab === "orders" && (
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <h3 style={{ margin: 0 }}>Manage All Customer Orders</h3>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["All", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setOrderStatusFilter(status)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "20px",
                        border: "1px solid #d1d5db",
                        background: orderStatusFilter === status ? "#172033" : "#fff",
                        color: orderStatusFilter === status ? "#fff" : "#374151",
                        fontSize: "12.5px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={theadRowStyle}>
                    <th style={thStyle}>Order ID</th>
                    <th style={thStyle}>Customer & Address</th>
                    <th style={thStyle}>Items</th>
                    <th style={thStyle}>Amount</th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const badge = getStatusBadgeStyle(order.status);
                    return (
                      <tr key={order._id} style={trStyle}>
                        <td style={{ ...tdStyle, fontWeight: "700" }}>
                          #{order._id.slice(-8).toUpperCase()}
                        </td>
                        <td style={tdStyle}>
                          <strong>{order.user?.name || "Guest"}</strong>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            {order.user?.email}
                          </div>
                          {order.shippingAddress && (
                            <div style={{ fontSize: "11.5px", color: "#888", marginTop: "4px", maxWidth: "240px" }}>
                              📍 {order.shippingAddress}
                            </div>
                          )}
                        </td>
                        <td style={tdStyle}>
                          {order.items?.map((item, i) => (
                            <div key={i} style={{ fontSize: "12.5px", marginBottom: "3px" }}>
                              • {item.title} × <strong>{item.quantity}</strong>
                            </div>
                          ))}
                        </td>
                        <td style={tdStyle}>
                          <div style={{ fontWeight: "700", fontSize: "14px" }}>
                            ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
                          </div>
                          {order.couponCode && (
                            <span style={{ fontSize: "11px", color: "#16a34a" }}>
                              Code: {order.couponCode} (-₹{order.discountAmount})
                            </span>
                          )}
                        </td>
                        <td style={tdStyle}>
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td style={tdStyle}>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            style={{
                              padding: "6px 10px",
                              borderRadius: "6px",
                              border: "1px solid #d1d5db",
                              background: badge.bg,
                              color: badge.color,
                              fontWeight: "700",
                              fontSize: "12px",
                              cursor: "pointer",
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ padding: "2rem", textAlign: "center", color: "#888" }}>
                        No orders matching "{orderStatusFilter}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ====================================================
            TAB 3: PRODUCTS & INVENTORY MANAGEMENT
        ==================================================== */}
        {activeTab === "products" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: "1.8rem", alignItems: "start" }}>
            {/* Add / Edit Product Form */}
            <div style={cardStyle}>
              <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <form onSubmit={handleSaveProduct} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div>
                  <label style={labelStyle}>Product Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wireless Over-Ear Headphones"
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
                  <div>
                    <label style={labelStyle}>Price (₹)</label>
                    <input
                      type="number"
                      min="1"
                      required
                      placeholder="2499"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Stock Quantity</label>
                    <input
                      type="number"
                      min="0"
                      required
                      placeholder="20"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Apparel">Apparel</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Image URL</label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    rows="3"
                    placeholder="Product description..."
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>

                <div style={{ display: "flex", gap: "0.6rem" }}>
                  <button type="submit" style={{ ...btnStyle, flex: 1 }}>
                    <FiPlus style={{ verticalAlign: "middle", marginRight: "4px" }} />
                    {editingProduct ? "Update Product" : "Add Product"}
                  </button>
                  {editingProduct && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setProductForm({
                          title: "",
                          price: "",
                          category: "Electronics",
                          stock: 20,
                          image: "",
                          description: "",
                        });
                      }}
                      style={{
                        padding: "0.75rem 1rem",
                        background: "#e5e7eb",
                        color: "#374151",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Product Inventory List */}
            <div style={cardStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <h3 style={{ margin: 0 }}>Store Inventory ({filteredProducts.length})</h3>
                <input
                  type="text"
                  placeholder="Search inventory..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  style={{ ...inputStyle, width: "240px" }}
                />
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={tableStyle}>
                  <thead>
                    <tr style={theadRowStyle}>
                      <th style={thStyle}>Product</th>
                      <th style={thStyle}>Category</th>
                      <th style={thStyle}>Price</th>
                      <th style={thStyle}>Stock</th>
                      <th style={thStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p._id} style={trStyle}>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <img
                              src={p.image || "https://via.placeholder.com/45"}
                              alt={p.title}
                              style={{
                                width: "44px",
                                height: "44px",
                                borderRadius: "6px",
                                objectFit: "cover",
                              }}
                            />
                            <strong style={{ fontSize: "13.5px" }}>{p.title}</strong>
                          </div>
                        </td>
                        <td style={tdStyle}>{p.category}</td>
                        <td style={{ ...tdStyle, fontWeight: "700", color: "#16a34a" }}>
                          ₹{p.price}
                        </td>
                        <td style={tdStyle}>
                          <span
                            style={{
                              padding: "3px 8px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: "700",
                              background: (p.stock ?? 0) <= 5 ? "#fee2e2" : "#dcfce7",
                              color: (p.stock ?? 0) <= 5 ? "#dc2626" : "#16a34a",
                            }}
                          >
                            {p.stock ?? 0} in stock
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              onClick={() => handleEditProductClick(p)}
                              style={{
                                background: "#f3f4f6",
                                color: "#172033",
                                border: "1px solid #d1d5db",
                                padding: "6px 10px",
                                borderRadius: "6px",
                                cursor: "pointer",
                              }}
                              title="Edit Product"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p._id)}
                              style={{
                                background: "#fee2e2",
                                color: "#dc2626",
                                border: "none",
                                padding: "6px 10px",
                                borderRadius: "6px",
                                cursor: "pointer",
                              }}
                              title="Delete Product"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            TAB 4: PROMO CODES
        ==================================================== */}
        {activeTab === "coupons" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "1.8rem", alignItems: "start" }}>
            <div style={cardStyle}>
              <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>Create Promo Code</h3>
              <form onSubmit={handleCreateCoupon} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div>
                  <label style={labelStyle}>Promo Code</label>
                  <input
                    type="text"
                    placeholder="e.g. ZOVA50"
                    value={couponForm.code}
                    onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Discount Type</label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Discount Value</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 20 for 20% or ₹20"
                    value={couponForm.discountValue}
                    onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Minimum Order Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={couponForm.minOrderAmount}
                    onChange={(e) => setCouponForm({ ...couponForm, minOrderAmount: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Expiry Date</label>
                  <input
                    type="date"
                    value={couponForm.expiryDate}
                    onChange={(e) => setCouponForm({ ...couponForm, expiryDate: e.target.value })}
                    required
                    style={inputStyle}
                  />
                </div>
                <button type="submit" style={btnStyle}>
                  Create Promo Code
                </button>
              </form>
            </div>

            <div style={cardStyle}>
              <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>Active & Past Promo Codes</h3>
              <div style={{ overflowX: "auto" }}>
                <table style={tableStyle}>
                  <thead>
                    <tr style={theadRowStyle}>
                      <th style={thStyle}>Code</th>
                      <th style={thStyle}>Discount</th>
                      <th style={thStyle}>Min Order</th>
                      <th style={thStyle}>Expires</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((c) => {
                      const expiryEnd = new Date(c.expiryDate);
                      expiryEnd.setHours(23, 59, 59, 999);
                      const isExpired = new Date() > expiryEnd;

                      return (
                        <tr key={c._id} style={trStyle}>
                          <td style={{ ...tdStyle, fontWeight: "700", letterSpacing: "0.5px" }}>
                            {c.code}
                          </td>
                          <td style={tdStyle}>
                            {c.discountType === "PERCENTAGE"
                              ? `${c.discountValue}% OFF`
                              : `₹${c.discountValue} OFF`}
                          </td>
                          <td style={tdStyle}>₹{c.minOrderAmount || 0}</td>
                          <td style={tdStyle}>
                            {new Date(c.expiryDate).toLocaleDateString("en-IN")}
                          </td>
                          <td style={tdStyle}>
                            {isExpired ? (
                              <span style={{ color: "#dc2626", fontSize: "12px", fontWeight: "700" }}>
                                <FiAlertCircle style={{ verticalAlign: "middle" }} /> Expired
                              </span>
                            ) : (
                              <span style={{ color: "#16a34a", fontSize: "12px", fontWeight: "700" }}>
                                <FiCheckCircle style={{ verticalAlign: "middle" }} /> Active
                              </span>
                            )}
                          </td>
                          <td style={tdStyle}>
                            <button
                              onClick={() => handleDeleteCoupon(c._id)}
                              style={{
                                background: "#fee2e2",
                                color: "#dc2626",
                                border: "none",
                                padding: "6px 10px",
                                borderRadius: "6px",
                                cursor: "pointer",
                              }}
                            >
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {coupons.length === 0 && (
                      <tr>
                        <td colSpan="6" style={{ padding: "1.5rem", textAlign: "center", color: "#888" }}>
                          No promo codes created yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            TAB 5: REGISTERED USERS
        ==================================================== */}
        {activeTab === "users" && (
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>
              Registered ZOVA Users ({users.length})
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={theadRowStyle}>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Role</th>
                    <th style={thStyle}>Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} style={trStyle}>
                      <td style={{ ...tdStyle, fontWeight: "600" }}>{u.name}</td>
                      <td style={tdStyle}>{u.email}</td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "999px",
                            fontSize: "11px",
                            fontWeight: "700",
                            textTransform: "uppercase",
                            background: u.role === "admin" ? "#172033" : "#f3f4f6",
                            color: u.role === "admin" ? "#fff" : "#374151",
                          }}
                        >
                          {u.role || "user"}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        {new Date(u.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ padding: "1.5rem", textAlign: "center", color: "#888" }}>
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Styles
const cardStyle = {
  background: "#ffffff",
  padding: "1.5rem",
  borderRadius: "12px",
  border: "1px solid #ebe5da",
  boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
};

const kpiLabelStyle = {
  fontSize: "12px",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "1px",
  color: "#77736c",
};

const kpiValueStyle = {
  fontSize: "2rem",
  margin: "8px 0 4px",
  color: "#172033",
};

const kpiSubStyle = {
  fontSize: "12px",
  color: "#6b7280",
};

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: "700",
  color: "#172033",
  marginBottom: "4px",
};

const inputStyle = {
  width: "100%",
  padding: "0.65rem 0.8rem",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "0.9rem",
  boxSizing: "border-box",
};

const btnStyle = {
  padding: "0.8rem",
  background: "#172033",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "13.5px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left",
};

const theadRowStyle = {
  borderBottom: "2px solid #eeeae2",
  color: "#50545b",
  fontSize: "12.5px",
  textTransform: "uppercase",
};

const thStyle = {
  padding: "0.75rem 0.6rem",
};

const trStyle = {
  borderBottom: "1px solid #f3efe6",
  fontSize: "13.5px",
};

const tdStyle = {
  padding: "0.85rem 0.6rem",
  verticalAlign: "middle",
};

export default AdminDashboard;