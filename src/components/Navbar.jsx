import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/zova-logo.svg";

function Navbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim()) {
      navigate(`/products?search=${encodeURIComponent(value)}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* Logo */}
        <Link to="/" className="logo">
          <img src={logo} alt="ZOVA" />
        </Link>

        {/* Navigation */}
        <div className="nav-links">
          <NavLink to="/" end>
            Home
          </NavLink>

          <NavLink to="/products">
            Products
          </NavLink>
        </div>

        {/* Search */}
        <div className="search-box">
          <span>⌕</span>

          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search products..."
          />
        </div>

        {/* Cart */}
        <Link to="/cart" className="cart-button">
          🛒 Cart
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;