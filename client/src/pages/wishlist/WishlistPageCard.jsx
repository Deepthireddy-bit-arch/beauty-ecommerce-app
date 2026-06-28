import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromWishlist } from "../../redux/reducers/thunks/wishlistActions";
import { addToCartAsync } from "../../redux/reducers/thunks/cartThunks";

const WishlistCard = ({ item, onToast = () => { } }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector((s) => s.login?.isAuthenticated);

  const [addingToCart, setAddingToCart] = useState(false);
  const [removing, setRemoving] = useState(false);

  // ── auth guard ──────────────────────────────────────────────────────────────
  const requireAuth = (cb) => {
    if (!isAuth) { navigate("/login"); return; }
    cb();
  };
  const handleCardClick = () => {
    const productId = item.productId || item._id || item.id;
    navigate(`/product/${productId}`);
  };

  // ── add to cart ─────────────────────────────────────────────────────────────
  const handleAddToCart = (e) => {
    e.stopPropagation();
    requireAuth(async () => {
      if (item.stock === 0 || addingToCart || removing) return;
      setAddingToCart(true);
      try {
        await dispatch(addToCartAsync({ productId: item.productId, quantity: 1 })).unwrap();
        onToast("Added to cart 🛍️");
      } catch {
        onToast("Couldn't add to cart");
      } finally {
        setAddingToCart(false);
      }
    });
  };

  // ── remove from wishlist ────────────────────────────────────────────────────
  const handleRemove = async (e) => {
    e?.stopPropagation?.();
    if (removing) return;
    setRemoving(true);
    try {
      await dispatch(removeFromWishlist(item.productId)).unwrap();
      onToast("Removed from wishlist");
    } catch {
      onToast("Couldn't remove item");
      setRemoving(false); // only reset on failure; success = card unmounts
    }
  };

  return (
    <div className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
      <div
        className={`wishlist-card card h-100 border-0 shadow-sm${removing ? " removing" : ""}`}
        onClick={handleCardClick}
        style={{ cursor: 'pointer' }}
      >

        {/* Image */}
        <div className="card-img-wrapper position-relative overflow-hidden">
          <img
            src={item.image || "https://placehold.co/400x280/f3e8ff/7c3aed?text=Product"}
            alt={item.name}
            className="card-img-top"
          />

          {item.discount > 0 && (
            <span className="badge-discount position-absolute top-0 start-0 m-2 px-2 py-1 rounded-pill">
              -{item.discount}%
            </span>
          )}

          {/* Remove — top-right icon */}
          <button
            onClick={handleRemove}
            disabled={removing}
            className="btn-remove position-absolute top-0 end-0 m-2 d-flex align-items-center justify-content-center"
            aria-label="Remove from wishlist"
          >
            {removing
              ? <span className="spinner-border spinner-border-sm" style={{ width: 13, height: 13, borderWidth: 2 }} />
              : <i className="bi bi-trash3-fill" style={{ fontSize: 15 }} />}
          </button>
        </div>

        {/* Body */}
        <div className="card-body d-flex flex-column px-3 py-3">

          <p className="product-category text-uppercase mb-1">
            {item.category}
          </p>

          <h6 className="product-name fw-semibold mb-1 text-truncate" title={item.name}>
            {item.name}
          </h6>

          {/* Rating */}
          <div className="d-flex align-items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`bi ${star <= Math.round(item.rating || 4) ? "bi-star-fill star-filled" : "bi-star star-empty"}`}
                style={{ fontSize: "0.7rem" }}
              />
            ))}
            <span className="text-muted ms-1" style={{ fontSize: "0.75rem" }}>
              ({item.numReviews || 0})
            </span>
          </div>

          {/* Price */}
          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="product-price fw-bold">
              ₹{item.price?.toLocaleString() || "0"}
            </span>
            {item.originalPrice && (
              <span className="product-original-price text-decoration-line-through text-muted">
                ₹{item.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mb-3">
            {item.stock > 0
              ? <span className="stock-badge in-stock px-2 py-1 rounded-pill">
                <i className="bi bi-check-circle-fill me-1" />In Stock
              </span>
              : <span className="stock-badge out-of-stock px-2 py-1 rounded-pill">
                <i className="bi bi-x-circle-fill me-1" />Out of Stock
              </span>}
          </div>

          {/* ✅ Single action row — Add to Cart only (remove is top-right icon) */}
          <div className="mt-auto">
            <button
             onClick={(e) => { e.stopPropagation(); handleAddToCart(e); }}
              disabled={item.stock === 0 || addingToCart || removing}
              className="btn btn-add-cart w-100 d-flex align-items-center justify-content-center"
            >
              {addingToCart
                ? <><span className="spinner-border spinner-border-sm me-2" />Adding...</>
                : <><i className="bi bi-cart-plus me-1" />Add to Cart</>}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WishlistCard;