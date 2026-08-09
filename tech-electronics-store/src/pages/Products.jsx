import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard/ProductCard";
import SearchBar from "../components/SearchBar/SearchBar";
import CategoryCard from "../components/CategoryCard/CategoryCard";
import { ProductSkeletonGrid } from "../components/ProductSkeleton/ProductSkeleton";
import categories from "../data/categories";
import useDocumentTitle from "../hooks/useDocumentTitle";
import "./Products.css";

const LIMIT = 12;

function Products() {
  useDocumentTitle("All Products");
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial values from URL query params (e.g. from Categories page)
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState(searchParams.get("keyword") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [sort, setSort] = useState("-createdAt");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ limit: LIMIT, page, sort });
        if (search) params.append("keyword", search);
        if (selectedCategory !== "All") params.append("category", selectedCategory);

        const res = await api.get(`/products?${params}`);
        const raw = res.data;
        setProducts(Array.isArray(raw.data) ? raw.data : []);
        setTotal(raw.count ?? 0);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, selectedCategory, sort, page]);

  const totalPages = Math.ceil(total / LIMIT);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
    // keep URL in sync
    const next = new URLSearchParams();
    if (cat !== "All") next.set("category", cat);
    if (search) next.set("keyword", search);
    setSearchParams(next);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>All Products</h1>
        <p>{total} product{total !== 1 ? "s" : ""} found</p>
      </div>

      <SearchBar search={search} setSearch={handleSearchChange} />

      <div className="products-filters">
        <div className="categories-row">
          <CategoryCard
            category={{ name: "All" }}
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategoryChange}
          />
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              selectedCategory={selectedCategory}
              setSelectedCategory={handleCategoryChange}
            />
          ))}
        </div>

        <select
          className="sort-select"
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          aria-label="Sort products"
        >
          <option value="-createdAt">Newest</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      {loading ? (
        <ProductSkeletonGrid count={12} />
      ) : products.length === 0 ? (
        <div className="products-empty">
          <span className="products-empty-icon">🔍</span>
          <h2>No products found</h2>
          <p>Try adjusting your search or filter to find what you're looking for.</p>
          <button
            className="products-empty-reset"
            onClick={() => {
              handleSearchChange("");
              handleCategoryChange("All");
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
            ← Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default Products;
