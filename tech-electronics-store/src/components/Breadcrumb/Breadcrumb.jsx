import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import "./Breadcrumb.css";

/**
 * Breadcrumb navigation
 * @param {Array} items - [{ label: string, path?: string }]
 *   Last item is the current page (no link, visually distinct).
 */
function Breadcrumb({ items = [] }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="breadcrumb-item">
              {!isLast && item.path ? (
                <>
                  <Link to={item.path} className="breadcrumb-link">
                    {item.label}
                  </Link>
                  <FiChevronRight className="breadcrumb-sep" size={13} />
                </>
              ) : (
                <span className="breadcrumb-current" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
