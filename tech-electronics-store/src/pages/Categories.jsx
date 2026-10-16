import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import categories from "../data/categories";
import api from "../services/api";
import useDocumentTitle from "../hooks/useDocumentTitle";
import "./Categories.css";

const CATEGORY_META = {
  Laptop: { icon: "💻", bg: "#dbeafe", color: "#1e40af", desc: "MacBooks, Ultrabooks, Gaming Laptops" },
  Phone: { icon: "📱", bg: "#dcfce7", color: "#166534", desc: "Smartphones, iPhones, Android Devices" },
  Accessories: { icon: "🎧", bg: "#fef3c7", color: "#92400e", desc: "Headphones, Keyboards, Mice, Power Banks" },
  Monitor: { icon: "🖥️", bg: "#f3e8ff", color: "#6b21a8", desc: "4K, Curved, Gaming & Office Monitors" },
  "Smart Watch": { icon: "⌚", bg: "#fce7f3", color: "#9d174d", desc: "Apple Watch, Samsung Galaxy Watch & More" },
};

function Categories() {
  useDocumentTitle("Categories");
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});

  // Fetch product counts per category from the API
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await api.get("/products?limit=100");
        const prods = Array.isArray(res.data.data) ? res.data.data : [];
        const c = {};
        prods.forEach((p) => {
          c[p.category] = (c[p.category] || 0) + 1;
        });
        setCounts(c);
      } catch {
        // counts remain empty — display gracefully without numbers
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="categories-page">
      {/* Hero */}
      <div className="categories-hero">
        <div className="categories-hero-inner">
          <h1>Shop by Category</h1>
          <p>Browse our curated selection of tech and electronics products</p>
        </div>
      </div>

      {/* Grid */}
      <div className="categories-wrap">
        <div className="categories-big-grid">
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat.name] || { icon: "📦", bg: "#f1f5f9", color: "#475569", desc: "" };
            const count = counts[cat.name];
            return (
              <div
                key={cat.id}
                className="cat-card"
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
                aria-label={`Browse ${cat.name}`}
              >
                <div
                  className="cat-icon-wrap"
                  style={{ background: meta.bg, color: meta.color }}
                >
                  <span className="cat-icon">{meta.icon}</span>
                </div>
                <div className="cat-info">
                  <h3>{cat.name}</h3>
                  {meta.desc && <p className="cat-desc">{meta.desc}</p>}
                  {count !== undefined && (
                    <span className="cat-count">{count} product{count !== 1 ? "s" : ""}</span>
                  )}
                </div>
                <span className="cat-arrow">→</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Categories;
