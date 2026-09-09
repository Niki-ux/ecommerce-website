import { Link } from "react-router-dom";

function Home() {
  return (
    <main>

      <section className="hero">

        <div className="hero-content">

          <div className="hero-text">

            <p className="hero-label">
              WELCOME TO ZOVA
            </p>

            <h1>
              Made for
              <br />
              <span>everyday.</span>
            </h1>

            <Link to="/products" className="hero-button">
              Shop now <span>→</span>
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;