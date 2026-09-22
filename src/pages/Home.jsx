import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home-page">
      <section className="hero-banner">
        <div className="hero-content">
          <p className="hero-small">WELCOME TO ZOVA</p>

          <h1>
            Made for
            <br />
            <span>everyday.</span>
          </h1>

          <p className="hero-description">
            Discover fashion and lifestyle products
            made for your everyday moments.
          </p>

          <Link to="/products" className="hero-button">
            Shop now <span>→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
