import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home-page">
      <section className="simple-hero">

        <div className="hero-content">
          <p className="hero-logo">ZOVA</p>

          <h1>
            Everything you want.
            <br />
            <span>All in one place.</span>
          </h1>

          <Link to="/products" className="hero-button">
            SHOP NOW
            <span>→</span>
          </Link>
        </div>

      </section>
    </main>
  );
}

export default Home;