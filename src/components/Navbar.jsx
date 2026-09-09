import { NavLink } from "react-router-dom";
import logo from "../assets/zova-logo.svg";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">

        <NavLink to="/" className="logo">
          <img src={logo} alt="ZOVA" />
        </NavLink>

        <div className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Products</NavLink>
        </div>

        <div className="search-box">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search products..."
          />
        </div>

        <NavLink to="/cart" className="cart-button">
          🛒 Cart
        </NavLink>

      </div>
    </nav>
  );
}

export default Navbar;