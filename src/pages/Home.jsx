import { Link } from "react-router-dom";
import { products } from "../data/products";

function Home() {
  const featuredProducts = products.slice(0, 3);

  return (
    <main>

      {/* HERO */}

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


      {/* ZOVA EDIT */}

      <section className="zova-edit">

        <div className="edit-heading">
          <p>THE ZOVA EDIT</p>

          <h2>
            A little something
            <br />
            for everyone.
          </h2>

          <Link to="/products">
            Explore collection →
          </Link>
        </div>


        <div className="edit-products">

          {featuredProducts.map((product) => (
            <Link
              to={`/products/${product.id}`}
              className="edit-product"
              key={product.id}
            >

              <div className="edit-product-image">

                <img
                  src={product.image}
                  alt={product.title}
                />

              </div>

              <div className="edit-product-info">

                <h3>{product.title}</h3>

                <p>{product.category}</p>

              </div>

            </Link>
          ))}

        </div>

      </section>

    </main>
  );
}

export default Home;