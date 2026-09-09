import React from "react";
import { useSearchParams } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || "";

  const filteredProducts = products.filter((item) => {
    const searchText = search.toLowerCase().trim();

    return (
      item.title?.toLowerCase().includes(searchText) ||
      item.category?.toLowerCase().includes(searchText) ||
      item.description?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="products-page">

      {/* Heading */}
      <div className="products-header">
        <p className="products-label">ZOVA COLLECTION</p>

        <h1>
          {search ? `Results for "${search}"` : "All Products"}
        </h1>

        <p className="products-count">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "product" : "products"}
        </p>
      </div>

      {/* Products */}
      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
            />
          ))}
        </div>
      ) : (
        <div className="no-products">
          <h2>No products found</h2>

          <p>
            We couldn't find anything matching "{search}".
          </p>
        </div>
      )}

    </div>
  );
};

export default Products;