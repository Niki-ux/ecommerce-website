import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">

          <div className="hero-text">

            <span className="hero-label">
              WELCOME TO ZOVA
            </span>

            <h1>
              Shop what you love.
              <br />
              <span>Love what you buy.</span>
            </h1>

            <p>
              Discover products for your everyday life,
              all in one place.
            </p>

            <Link to="/products" className="hero-button">
              Shop Now →
            </Link>

          </div>

        </div>
      </section>
    </main>
  );
}

export default Home;