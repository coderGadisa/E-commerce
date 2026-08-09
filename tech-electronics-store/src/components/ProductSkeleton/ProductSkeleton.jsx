import "./ProductSkeleton.css";

/** Single shimmer card that mirrors the ProductCard layout */
function ProductSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img shimmer" />
      <div className="skeleton-body">
        <div className="skeleton-line skeleton-line--short shimmer" />
        <div className="skeleton-line skeleton-line--full shimmer" />
        <div className="skeleton-line skeleton-line--medium shimmer" />
        <div className="skeleton-line skeleton-line--price shimmer" />
      </div>
      <div className="skeleton-btn shimmer" />
    </div>
  );
}

/** Renders `count` skeleton cards inside the standard products grid */
export function ProductSkeletonGrid({ count = 12 }) {
  return (
    <div className="products-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

export default ProductSkeleton;
