import { FiSearch } from "react-icons/fi";
import "./SearchBar.css";

function SearchBar({ search, setSearch }) {
  return (
    <div className="search-bar">
      <div className="search-bar-inner">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search laptops, phones, accessories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search products"
        />
        {search && (
          <button
            className="search-clear"
            onClick={() => setSearch("")}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
