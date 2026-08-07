import { useNavigate } from "react-router-dom";
import categories from "../data/categories";
import "./Categories.css";

const CATEGORY_ICONS = {
  Laptop: "💻",
  Phone: "📱",
  Accessories: "🎧",
  Monitor: "🖥️",
  "Smart Watch": "⌚",
};

function Categories() {
  const navigate = useNavigate();

  const handleCategoryClick = (name) => {
    navigate(`/products?category=${encodeURIComponent(name)}`);
  };

  return (
    <div className="categories-page">
      <div className="categories-hero">
        <h1>Shop by Category</h1>
        <p>Find the perfect tech for your needs</p>
      </div>

      <div className="categories-grid-big">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="category-big-card"
            onClick={() => handleCategoryClick(cat.name)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleCategoryClick(cat.name)}
            aria-label={`Browse ${cat.name}`}
          >
            <div className="category-icon">{CATEGORY_ICONS[cat.name] || "📦"}</div>
            <h3>{cat.name}</h3>
            <span className="category-browse">Browse →</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
