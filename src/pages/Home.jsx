import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="landing-page">

      {/* PAGE TITLE */}
      <div className="landing-title">
        <h1>LANDING PAGE</h1>
        <p>Online Shopping</p>
      </div>

      {/* MAIN SHOPPING BANNER */}
      <section className="shopping-banner">

        {/* TOP NAVIGATION */}
        <nav className="landing-navbar">

          <Link to="/" className="store-logo">
            <span className="cart-symbol">🛒</span>

            <div>
              <strong>ONLINE</strong>
              <span>Store</span>
            </div>
          </Link>

          <div className="landing-nav-links">
            <Link to="/" className="active">
              HOME
            </Link>

            <Link to="/products">
              PRODUCTS
            </Link>

            <Link to="/products">
              ABOUT
            </Link>

            <Link to="/cart">
              CONTACT
            </Link>
          </div>

          <div className="call-us">
            <span>CALL NOW</span>
            <strong>1800 888 555</strong>
          </div>

        </nav>


        {/* HERO CONTENT */}
        <div className="shopping-hero">

          {/* LEFT SIDE - IMAGE */}
          <div className="shopping-image">

            <div className="image-circle"></div>

            <img
              src="/shopping.png"
              alt="Fashion shopping"
            />

          </div>


          {/* RIGHT SIDE - OFFER */}
          <div className="shopping-offer">

            <p className="new-arrivals">
              NEW ARRIVALS
            </p>

            <h2>
              JUST
              <br />
              FOR
              <br />
              <span>your</span>
            </h2>

            <div className="order-offer">
              <strong>FOR ONLINE</strong>
              <span>ORDER</span>
            </div>

            <div className="discount">
              30% OFF
            </div>

          </div>

        </div>


        {/* BOTTOM */}
        <div className="landing-footer">

          <span>
            © Company Name 2026. All rights reserved.
          </span>

          <div className="social-icons">
            <span>◎</span>
            <span>f</span>
            <span>𝕏</span>
            <span>◉</span>
          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;
