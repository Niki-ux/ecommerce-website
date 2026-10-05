import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiHeart,
  FiShoppingBag,
  FiUser,
  FiChevronDown,
  FiMenu,
  FiX,
} from "react-icons/fi";

import logo from "../assets/zova-logo.svg";

function Navbar() {
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const [search, setSearch] = useState("");
  const [hasWishlist, setHasWishlist] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const checkWishlist = () => {
    try {
      const wishlist =
        JSON.parse(localStorage.getItem("wishlist")) || [];

      setHasWishlist(wishlist.length > 0);
    } catch {
      setHasWishlist(false);
    }
  };

  const checkLogin = () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    setIsLoggedIn(!!token);

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkWishlist();
    checkLogin();

    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    window.addEventListener("storage", checkWishlist);
    window.addEventListener("wishlistUpdated", checkWishlist);
    window.addEventListener("authUpdated", checkLogin);

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("storage", checkWishlist);
      window.removeEventListener(
        "wishlistUpdated",
        checkWishlist
      );
      window.removeEventListener("authUpdated", checkLogin);

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setUser(null);
    setProfileOpen(false);
    setMenuOpen(false);

    window.dispatchEvent(new Event("authUpdated"));

    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const getFirstName = () => {
    if (!user?.name) {
      return "Profile";
    }

    return user.name.trim().split(" ")[0];
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
          <img
            src={logo}
            alt="ZOVA"
          />
        </Link>


        {/* Main Navigation */}

        <div className="nav-links">

          <NavLink
            to="/"
            end
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
          >
            Products
          </NavLink>

        </div>


        {/* Search */}

        <div className="search-box">

          <FiSearch className="search-icon" />

          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search products"
          />

        </div>


        {/* Wishlist */}

        <NavLink
          to="/wishlist"
          className={({ isActive }) =>
            `nav-text-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <FiHeart
            className="nav-icon"
            fill={
              hasWishlist
                ? "currentColor"
                : "none"
            }
          />

          <span>
            Wishlist
          </span>
        </NavLink>


        {/* Cart */}

        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `nav-text-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <FiShoppingBag className="nav-icon" />

          <span>
            Cart
          </span>
        </NavLink>


        {/* Profile / Login */}

        {isLoggedIn ? (

          <div
            className="nav-profile"
            ref={profileRef}
          >

            <button
              type="button"
              className="profile-button"
              onClick={() =>
                setProfileOpen(!profileOpen)
              }
              aria-expanded={profileOpen}
            >

              <span className="profile-avatar-small">
                {getFirstName()
                  .charAt(0)
                  .toUpperCase()}
              </span>

              <span className="profile-name">
                {getFirstName()}
              </span>

              <FiChevronDown
                className={`profile-arrow ${
                  profileOpen
                    ? "profile-arrow-open"
                    : ""
                }`}
              />

            </button>


            {/* Profile Dropdown */}

            {profileOpen && (

              <div className="profile-dropdown">

                <div className="profile-header">

                  <div className="profile-avatar">
                    {getFirstName()
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="profile-info">

                    <strong>
                      {user?.name}
                    </strong>

                    <span>
                      {user?.email}
                    </span>

                  </div>

                </div>


                <div className="profile-divider" />


                <Link
                  to="/profile"
                  className="profile-menu-item"
                  onClick={() =>
                    setProfileOpen(false)
                  }
                >
                  <FiUser />

                  <span>
                    My Profile
                  </span>
                </Link>


                <Link
                  to="/orders"
                  className="profile-menu-item"
                  onClick={() =>
                    setProfileOpen(false)
                  }
                >
                  <FiShoppingBag />

                  <span>
                    My Orders
                  </span>
                </Link>


                <div className="profile-divider" />


                <button
                  type="button"
                  className="profile-logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </div>

            )}

          </div>

        ) : (

          <NavLink
            to="/login"
            className={({ isActive }) =>
              `nav-login ${
                isActive ? "active" : ""
              }`
            }
          >
            <FiUser className="nav-icon" />

            <span>
              Login
            </span>
          </NavLink>

        )}

        {/* Mobile Actions */}

        <div className="mobile-nav-actions">

          <Link to="/wishlist">

            <FiHeart
              className={
                hasWishlist
                  ? "mobile-heart active"
                  : "mobile-heart"
              }
              fill={
                hasWishlist
                  ? "currentColor"
                  : "none"
              }
            />

          </Link>


          <Link to="/cart">

            <FiShoppingBag className="mobile-cart" />

          </Link>


          {isLoggedIn && (

            <button
              type="button"
              className="mobile-profile-icon"
              onClick={() =>
                setProfileOpen(!profileOpen)
              }
              aria-label="Open profile"
            >
              {getFirstName()
                .charAt(0)
                .toUpperCase()}
            </button>

          )}


          <button
            type="button"
            className="mobile-menu-button"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            aria-label="Open menu"
          >
            {menuOpen ? (
              <FiX />
            ) : (
              <FiMenu />
            )}
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
            to="/cart"
            onClick={closeMenu}
          >
            Cart
          </NavLink>


          {isLoggedIn ? (

            <>

              <NavLink
                to="/profile"
                onClick={closeMenu}
              >
                My Profile
              </NavLink>

              <NavLink
                to="/orders"
                onClick={closeMenu}
              >
                My Orders
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>

            </>

          ) : (

            <NavLink
              to="/login"
              onClick={closeMenu}
            >
              Login
            </NavLink>

          )}

        </div>

      )}


      {/* Mobile Search */}

      <div className="mobile-search">

        <div className="search-box">

          <FiSearch className="search-icon" />

          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search products"
          />

        </div>

      </div>

    </nav>
  );
}

export default Navbar;