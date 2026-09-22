import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/zova-logo.svg";

function Navbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [hasWishlist, setHasWishlist] = useState(false);

  const checkWishlist = () => {
    try {
      const wishlist =
        JSON.parse(localStorage.getItem("wishlist")) || [];

      setHasWishlist(wishlist.length > 0);
    } catch {
      setHasWishlist(false);
    }
  };

  useEffect(() => {
    checkWishlist();

    window.addEventListener("storage", checkWishlist);
    window.addEventListener("wishlistUpdated", checkWishlist);

    return () => {
      window.removeEventListener("storage", checkWishlist);
      window.removeEventListener("wishlistUpdated", checkWishlist);
    };
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim()) {
      navigate(
        `/products?search=${encodeURIComponent(value)}`
      );
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

        {/* Wishlist */}
        <Link
          to="/wishlist"
          className="nav-icon-link"
        >
          <span
            className={`nav-icon wishlist-nav-icon ${
              hasWishlist ? "wishlist-active" : ""
            }`}
          >
            {hasWishlist ? "❤️" : "♡"}
          </span>

          <span>Wishlist</span>
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          className="nav-icon-link"
        >
          <span className="nav-icon">
            🛒
          </span>

          <span>Cart</span>
        </Link>

        {/* Login */}
        <Link
          to="/login"
          className="nav-login"
        >
          Login
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;