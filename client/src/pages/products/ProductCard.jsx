import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCartAsync } from '../../redux/reducers/thunks/cartThunks';
import { addToWishlist, removeFromWishlist } from '../../redux/reducers/thunks/wishlistActions';
import './productcard.css';

function ProductCard({ product, onToast }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Auth from loginSlice
  const isAuth = useSelector((s) => s.login?.isAuthenticated);

  // ✅ Correct shape: backend populate gives { product: { _id } }
  const wishlistItems = useSelector((s) => s.wishlist?.items ?? []);
  const isLiked = Array.isArray(wishlistItems) && wishlistItems.some(
    (w) => w?.product?._id === product._id
  );

  const [isAddingToCart,     setIsAddingToCart]     = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  // ── auth guard ─────────────────────────────────────────────────────────────
  const requireAuth = (e, cb) => {
    e.stopPropagation();
    if (!isAuth) {
      navigate("/login");
      return;
    }
    cb();
  };

  // ── wishlist ───────────────────────────────────────────────────────────────
  const handleToggleWishlist = (e) => {
     e.stopPropagation();
    requireAuth(e, async () => {
      setIsTogglingWishlist(true);
      try {
        if (isLiked) {
          await dispatch(removeFromWishlist(product._id)).unwrap();
          onToast?.(`Removed from wishlist`, 'wishlist');
        } else {
          await dispatch(addToWishlist(product._id)).unwrap();
          onToast?.(`Added to wishlist ♥`, 'wishlist');
        }
      } catch (err) {
        // 400 "already in wishlist" is handled inside the thunk — won't reach here
        // Only real failures land here
        onToast?.("Failed to update wishlist", 'error');
      } finally {
        setIsTogglingWishlist(false);
      }
    });
  };

  // ── cart ───────────────────────────────────────────────────────────────────
  const handleAddToCart = (e) => {
     e.stopPropagation();
    requireAuth(e, async () => {
      setIsAddingToCart(true);
      try {
        await dispatch(addToCartAsync({ productId: product._id, quantity: 1 })).unwrap();
        onToast?.(`Added ${product.name || product.title} to cart 🛍️`, 'cart');
      } catch (err) {
        onToast?.(`Failed to add to cart`, 'error');
      } finally {
        setIsAddingToCart(false);
      }
    });
  };
  const handleProductClick = () => {
  navigate(`/product/${product._id}`);
};

  return (
 <div className="product-card" onClick={handleProductClick}  style={{ cursor: 'pointer' }}>
      <div className="product-card-img-wrap">
        <img
          src={product.image || product.images?.[0] || '/placeholder.png'}
          alt={product.name || product.title}
          loading="lazy"
        />

        {product.isBestseller && <span className="product-badge bestseller">Bestseller</span>}
        {product.isNew       && <span className="product-badge new">New</span>}
        {product.discount > 0 && <span className="product-badge discount">{product.discount}% OFF</span>}

        {/* ✅ Heart — always visible, fills when liked */}
        <button
          className={`product-wishlist-btn${isLiked ? ' liked' : ''}${isTogglingWishlist ? ' loading' : ''}`}
          onClick={handleToggleWishlist}
          disabled={isTogglingWishlist}
          aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <span className="heart-icon">{isLiked ? '♥' : '♡'}</span>
        </button>

        <button
          className={`product-quick-add${isAddingToCart ? ' loading' : ''}`}
          onClick={handleAddToCart}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? 'Adding...' : 'Quick Add'}
        </button>
      </div>

      <div className="product-card-body">
        <div className="product-brand">{product.brand}</div>
        <h3 className="product-title">{product.name || product.title}</h3>

        <div className="product-rating">
          <span className="stars">
            {'★'.repeat(Math.round(product.rating || 0))}
            {'☆'.repeat(5 - Math.round(product.rating || 0))}
          </span>
          <span className="review-count">({product.reviews || 0})</span>
        </div>

        <div className="product-price-row">
          <span className="current-price">₹{product.price?.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="original-price">₹{product.originalPrice?.toLocaleString()}</span>
          )}
          {product.discount > 0 && (
            <span className="discount-badge">{product.discount}% off</span>
          )}
        </div>

        <button
          className="product-add-to-cart"
          onClick={handleAddToCart}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;