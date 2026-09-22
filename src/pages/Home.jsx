import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home-page">

      <section className="hero-banner">

        {/* LEFT TEXT */}
        <div className="hero-content">

          <p className="hero-small">
            WELCOME TO ZOVA
          </p>

          <h1>
            Made for
            <br />
            <span>everyday.</span>
          </h1>

          <p className="hero-description">
            Discover fashion and lifestyle products
            made for your everyday moments.
          </p>

          <Link
            to="/products"
            className="hero-button"
          >
            Shop now
            <span>→</span>
          </Link>

        </div>


        {/* OFFER CONTENT */}
        <div className="hero-offer">

          <p>NEW ARRIVALS</p>

          <h2>
            JUST
            <br />
            FOR
          </h2>

          <div className="hero-your">
            your
          </div>

          <div className="hero-order">
            <strong>FOR ONLINE</strong>
            <span>ORDER</span>
          </div>

          <div className="hero-discount">
            30% OFF
          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;
