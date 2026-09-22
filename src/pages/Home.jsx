import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home-page">

      {/* HERO SECTION */}
      <section className="fashion-hero">

        {/* LEFT - SHOPPING GIRL */}
        <div className="fashion-image">

          <div className="fashion-circle"></div>

          <img
            src="/landing-model.png"
            alt="Fashion shopping"
          />

        </div>


        {/* RIGHT - TEXT */}
        <div className="fashion-content">

          <p className="new-arrivals">
            NEW ARRIVALS
          </p>

          <h1>
            JUST
            <br />
            FOR
          </h1>

          <div className="your-text">
            your
          </div>

          <div className="online-order">
            <strong>FOR ONLINE</strong>
            <span>ORDER</span>
          </div>

          <div className="discount-badge">
            30% OFF
          </div>

          <Link to="/products" className="shop-now">
            SHOP NOW →
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Home;
