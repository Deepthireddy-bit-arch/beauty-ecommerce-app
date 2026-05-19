import React from "react";
import { useDispatch } from "react-redux";
import { removeFromWishlist } from "../../redux/reducers/thunks/wishlistActions";


const WishlistCard = ({ item }) => {
  const dispatch = useDispatch();
  const { product } = item;

  const handleRemove = () => {
    dispatch(removeFromWishlist(product._id));
  };

  const handleAddToCart = () => {
    // Integrate with your cart redux slice / action here
    alert(`"${product.name}" added to cart!`);
  };

  return (
    <div className="col-12 col-sm-6 col-lg-4 mb-4">
      <div className="wishlist-card card h-100 border-0 shadow-sm">
        {/* Product Image */}
        <div className="card-img-wrapper position-relative overflow-hidden">
          <img
            src={product.image || "https://placehold.co/400x280/f3e8ff/7c3aed?text=Product"}
            alt={product.name}
            className="card-img-top"
            style={{ height: "220px", objectFit: "cover" }}
          />
          {product.discount && (
            <span className="badge-discount position-absolute top-0 start-0 m-2 px-2 py-1 rounded-pill">
              -{product.discount}%
            </span>
          )}
          <button
            onClick={handleRemove}
            className="btn-remove position-absolute top-0 end-0 m-2"
            title="Remove from wishlist"
          >
            <i className="bi bi-heart-fill"></i>
          </button>
        </div>

        {/* Card Body */}
        <div className="card-body d-flex flex-column px-3 py-3">
          <p className="product-category text-uppercase mb-1">
            {product.category || "General"}
          </p>
          <h6 className="product-name fw-semibold mb-1 text-truncate" title={product.name}>
            {product.name}
          </h6>

          {/* Rating */}
          <div className="d-flex align-items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`bi ${
                  star <= Math.round(product.rating || 4)
                    ? "bi-star-fill star-filled"
                    : "bi-star star-empty"
                }`}
                style={{ fontSize: "0.7rem" }}
              ></i>
            ))}
            <span className="text-muted ms-1" style={{ fontSize: "0.75rem" }}>
              ({product.numReviews || 0})
            </span>
          </div>

          {/* Price */}
          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="product-price fw-bold">
              ₹{product.price?.toLocaleString() || "0"}
            </span>
            {product.originalPrice && (
              <span className="product-original-price text-decoration-line-through text-muted">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="mb-3">
            {product.stock > 0 ? (
              <span className="stock-badge in-stock px-2 py-1 rounded-pill">
                <i className="bi bi-check-circle-fill me-1"></i>In Stock
              </span>
            ) : (
              <span className="stock-badge out-of-stock px-2 py-1 rounded-pill">
                <i className="bi bi-x-circle-fill me-1"></i>Out of Stock
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="mt-auto d-flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn btn-add-cart flex-grow-1"
            >
              <i className="bi bi-cart-plus me-1"></i>Add to Cart
            </button>
            <button
              onClick={handleRemove}
              className="btn btn-remove-outline"
              title="Remove"
            >
              <i className="bi bi-trash3"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;