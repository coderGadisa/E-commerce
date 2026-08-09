import { useEffect, useState } from "react";
import api from "../services/api";
import "./Home.css";
import ProductCard from "../components/ProductCard/ProductCard";
import CategoryCard from "../components/CategoryCard/CategoryCard";
import SearchBar from "../components/SearchBar/SearchBar";
import Hero from "../components/Hero/Hero";
import { ProductSkeletonGrid } from "../components/ProductSkeleton/ProductSkeleton";
import categories from "../data/categories";
import useDocumentTitle from "../hooks/useDocumentTitle";

function Home() {
  useDocumentTitle("Home");
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/products?limit=12");
        const raw = response.data;
        const list = raw.data ?? raw;
        setProducts(Array.isArray(list) ? list : []);
      } catch (err) {
        setError("Failed to load products. Is the server running?");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const searchMatch = product.name.toLowerCase().includes(search.toLowerCase());
    const categoryMatch = selectedCategory === "All" || product.category === selectedCategory;
    return searchMatch && categoryMatch;
  });

  return (
    <div>
      <Hero />

      <SearchBar search={search} setSearch={setSearch} />

      <section className="categories-section">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          <CategoryCard
            category={{ name: "All" }}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          ))}
        </div>
      </section>

      <section className="products-section">
        <h2>Featured Products</h2>

        {error && <p className="no-products" style={{ color: "#ef4444" }}>{error}</p>}

        {loading ? (
          <ProductSkeletonGrid count={12} />
        ) : filteredProducts.length === 0 ? (
          <p className="no-products">No products found.</p>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
