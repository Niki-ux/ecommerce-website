import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const categories = ["All", "Electronics", "Accessories", "Footwear", "Apparel"];

const Products = () => {
  // --- NEW API STATE ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- EXISTING UI STATE ---
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  // --- NEW FETCH LOGIC ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products by search query and category
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
        selectedCategory === "All" || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  // Sort filtered list
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === "price-low") {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-high") {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === "rating") {
      return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return list;
  }, [filteredProducts, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("All");
    setSortBy("default");
    searchParams.delete("search");
    setSearchParams(searchParams);
  };

  // --- LOADING / ERROR STATES ---
  if (loading) return <div className="products-page"><h2>Loading Products...</h2></div>;
  if (error) return <div className="products-page"><h2>Error: {error}</h2></div>;

  return (
    <div className="products-page">
      {/* Header */}
      <div className="products-header">
        <p className="products-label">ZOVA COLLECTION</p>
        <h1>{search ? `Results for "${search}"` : "All Products"}</h1>
        <p className="products-count">
          Showing {sortedProducts.length}{" "}
          {sortedProducts.length === 1 ? "product" : "products"}
        </p>
      </div>

      {/* Filter and Sorting Toolbar */}
      <div className="catalog-toolbar">
        {/* Category Pills */}
        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Select Dropdown */}
        <div className="sort-wrapper">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="default">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Active Filters Bar */}
      {(selectedCategory !== "All" || search || sortBy !== "default") && (
        <div className="active-filter-bar">
          <span>Active filters: </span>
          {search && <span className="chip">Search: "{search}"</span>}
          {selectedCategory !== "All" && <span className="chip">Category: {selectedCategory}</span>}
          {sortBy !== "default" && <span className="chip">Sorted</span>}
          <button type="button" onClick={clearFilters} className="clear-filter-btn">
            Clear all
          </button>
        </div>
      )}

      {/* Products Grid */}
      {sortedProducts.length > 0 ? (
        <div className="products-grid">
          {/* Comment moved outside the implicit return map function */}
          {sortedProducts.map((item) => (
            <ProductCard key={item._id || item.id} product={item} />
          ))}
        </div>
      ) : (
        <div className="no-products">
          <h2>No products found</h2>
          <p>We couldn't find any products matching your criteria.</p>
          <button type="button" onClick={clearFilters} className="reset-btn">
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;