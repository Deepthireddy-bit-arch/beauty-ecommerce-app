import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// import { addToCart }      from '../redux/reducers/thunks/cartThunks';
// import { addToWishlist }  from '../redux/reducers/thunks/wishlistThunks';

/**
 * ProductCard
 * Matches the screenshot:
 *  - image fills top, Featured pill + % circle on top-left, heart on top-right
 *  - category badge + In stock dot
 *  - BRAND (caps) > Name > Description
 *  - ₹price  ₹mrp(strike)  Save ₹X (green badge)
 */
export default function ProductCard({ product: p }) {
  const dispatch = useDispatch();
  const [liked,   setLiked]   = useState(false);
  const [inCart,  setInCart]  = useState(false);
  const [toastMsg, setToast]  = useState('');

  const save = (p.originalPrice ?? p.mrp ?? 0) - p.price;

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  }

  function handleWishlist(e) {
    e.stopPropagation();
    setLiked((v) => !v);
    // dispatch(liked ? removeFromWishlist(p._id) : addToWishlist(p._id));
    showToast(liked ? 'Removed from wishlist' : 'Added to wishlist ♥');
  }

  function handleCart(e) {
    e.stopPropagation();
    setInCart((v) => !v);
    // dispatch(addToCart({ productId: p._id, quantity: 1 }));
    showToast(inCart ? 'Removed from cart' : 'Added to cart ✓');
  }

  const imgSrc = Array.isArray(p.images) ? p.images[0] : p.image;

  return (
    <div className="product-card">

      {/* ── Image ── */}
      <div className="product-card__img-wrap">
        {imgSrc ? (
          <img src={imgSrc} alt={p.name} loading="lazy" />
        ) : (
          <div className="product-card__img-placeholder">💄</div>
        )}

        {/* Top-left: Featured pill + discount circle */}
        <div className="product-card__badges">
          {p.isFeatured && (
            <span className="product-card__featured">+ Featured</span>
          )}
          {p.discount > 0 && (
            <span className="product-card__disc-circle">
              {p.discount}%
            </span>
          )}
        </div>

        {/* Top-right: Wishlist heart */}
        <button
          className={`product-card__wish${liked ? ' product-card__wish--active' : ''}`}
          onClick={handleWishlist}
          aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {liked ? '♥' : '♡'}
        </button>
      </div>

      {/* ── Body ── */}
      <div className="product-card__body">

        {/* Category badge + stock */}
        <div className="product-card__meta">
          <span className="product-card__cat-badge">
            {p.category}
          </span>
          <span className="product-card__stock">In stock</span>
        </div>

        <p className="product-card__brand">{p.brand}</p>
        <h3 className="product-card__name">{p.name}</h3>
        {p.description && (
          <p className="product-card__desc">{p.description}</p>
        )}

        {/* Price row */}
        <div className="product-card__price-row">
          <span className="product-card__price">₹{p.price}</span>
          {save > 0 && (
            <span className="product-card__mrp">
              ₹{p.originalPrice ?? p.mrp}
            </span>
          )}
          {save > 0 && (
            <span className="product-card__save">Save ₹{save}</span>
          )}
        </div>

        {/* Add to cart button */}
        <button
          className={`product-card__cart-btn${inCart ? ' product-card__cart-btn--in' : ''}`}
          onClick={handleCart}
        >
          {inCart ? '✓ In Cart' : '+ Add to Cart'}
        </button>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="product-card__toast">{toastMsg}</div>
      )}
    </div>
  );
}