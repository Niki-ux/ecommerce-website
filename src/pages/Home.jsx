import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home-page">
      <section className="simple-hero">

        <div className="arrival-content">

          <p className="arrival-label">
            NEW ARRIVALS
          </p>

          <h1>
            JUST <span>FOR</span>{" "}
            <em>you</em>
          </h1>

          <div className="discount-sticker">
            <strong>30% OFF</strong>
            <small>ONLINE ORDER</small>
          </div>

          <Link
            to="/products"
            className="arrival-button"
          >
            SHOP NOW →
          </Link>

        </div>

      </section>
    </main>
  );
}

export default Home;