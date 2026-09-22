import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/zova-logo.svg";

function Navbar() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [hasWishlist, setHasWishlist] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* Logo */}
        <Link
          to="/"
          className="logo"
          onClick={closeMenu}
        >
          <img src={logo} alt="ZOVA" />
        </Link>

        {/* Desktop Navigation */}
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
          className="nav-icon-link wishlist-link"
        >
          <span
            className={`nav-icon wishlist-nav-icon ${
              hasWishlist ? "wishlist-active" : ""
            }`}
          >
            {hasWishlist ? "♥" : "♡"}
          </span>

          <span>Wishlist</span>
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          className="nav-icon-link cart-link"
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

        {/* Mobile Icons */}
        <div className="mobile-nav-actions">

          <Link to="/wishlist">
            <span
              className={
                hasWishlist
                  ? "mobile-heart active"
                  : "mobile-heart"
              }
            >
              {hasWishlist ? "❤️" : "♡"}
            </span>
          </Link>

          <Link to="/cart">
            <span className="mobile-cart">
              🛒
            </span>
          </Link>

          <button
            className="mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
          >
            ☰
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">

          <NavLink
            to="/"
            end
            onClick={closeMenu}
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            onClick={closeMenu}
          >
            Products
          </NavLink>

          <NavLink
            to="/wishlist"
            onClick={closeMenu}
          >
            Wishlist
          </NavLink>

          <NavLink
            to="/login"
            onClick={closeMenu}
          >
            Login
          </NavLink>

        </div>
      )}

      {/* Mobile Search */}
      <div className="mobile-search">
        <div className="search-box">
          <span>⌕</span>

          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search products..."
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;