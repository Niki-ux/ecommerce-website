import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const categories = [
  "All",
  "Electronics",
  "Accessories",
  "Footwear",
  "Apparel",
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/products"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        item.title?.toLowerCase().includes(searchText) ||
        item.name?.toLowerCase().includes(searchText) ||
        item.category?.toLowerCase().includes(searchText) ||
        item.description?.toLowerCase().includes(searchText);

      const matchesCategory =
        selectedCategory === "All" ||
        item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];

    if (sortBy === "price-low") {
      return list.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-high") {
      return list.sort((a, b) => b.price - a.price);
    }

    if (sortBy === "rating") {
      return list.sort(
        (a, b) => (b.rating || 0) - (a.rating || 0)
      );
    }

    return list;
  }, [filteredProducts, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("All");
    setSortBy("default");

    const newParams = new URLSearchParams(searchParams);
    newParams.delete("search");

    setSearchParams(newParams);
  };

  if (loading) {
    return (
      <div className="products-page">
        <h2>Loading Products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <h2>Error: {error}</h2>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <p className="products-label">ZOVA COLLECTION</p>

        <h1>
          {search ? `Results for "${search}"` : "All Products"}
        </h1>

        <p className="products-count">
          Showing {sortedProducts.length}{" "}
          {sortedProducts.length === 1
            ? "product"
            : "products"}
        </p>
      </div>

      <div className="catalog-toolbar">
        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-pill ${
                selectedCategory === cat ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="sort-wrapper">
          <label htmlFor="sort-select">
            Sort by:
          </label>

          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="default">Featured</option>
            <option value="price-low">
              Price: Low to High
            </option>
            <option value="price-high">
              Price: High to Low
            </option>
            <option value="rating">
              Highest Rated
            </option>
          </select>
        </div>
      </div>

      {(selectedCategory !== "All" ||
        search ||
        sortBy !== "default") && (
        <div className="active-filter-bar">
          <span>Active filters: </span>

          {search && (
            <span className="chip">
              Search: "{search}"
            </span>
          )}

          {selectedCategory !== "All" && (
            <span className="chip">
              Category: {selectedCategory}
            </span>
          )}

          {sortBy !== "default" && (
            <span className="chip">
              Sorted
            </span>
          )}

          <button
            type="button"
            onClick={clearFilters}
            className="clear-filter-btn"
          >
            Clear all
          </button>
        </div>
      )}

      {sortedProducts.length > 0 ? (
        <div className="products-grid">
          {sortedProducts.map((item) => (
            <ProductCard
              key={item._id || item.id}
              product={item}
            />
          ))}
        </div>
      ) : (
        <div className="no-products">
          <h2>No products found</h2>

          <p>
            We couldn't find any products matching your
            criteria.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="reset-btn"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;