import React, { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [imgError, setImgError] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="col-sm-6 col-lg-4 col-xl-3 mb-4">
      <div className="product-card">

        <div className="product-img-wrapper">
          {product.isFeatured && (
            <span className="badge-featured">✦ Featured</span>
          )}
          {discount && (
            <span className="badge-discount">{discount}% off</span>
          )}

          <button
            className={`wishlist-btn ${wishlist ? 'active' : ''}`}
            onClick={() => setWishlist(!wishlist)}
            aria-label="Add to wishlist"
          >
            <svg width="18" height="18" viewBox="0 0 24 24"
              fill={wishlist ? '#534AB7' : 'none'}
              stroke={wishlist ? '#534AB7' : '#aaa'}
              strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          <img
            src={
              !imgError && product.images?.[0]
                ? product.images[0]
                : `https://placehold.co/400x280/EEEDFE/534AB7?text=${encodeURIComponent(product.name)}`
            }
            alt={product.name}
            className="product-img"
            onError={() => setImgError(true)}
          />

          <div className="quick-overlay">
            <button className="quick-view-btn">Quick View</button>
          </div>
        </div>

        <div className="product-body">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="category-pill">{product.category}</span>
            <span className={`stock-dot ${product.stock > 0 ? 'in' : 'out'}`}>
              {product.stock > 0 ? '● In stock' : '● Out of stock'}
            </span>
          </div>

          <p className="brand-text">{product.brand}</p>
          <h6 className="product-name">{product.name}</h6>
          <p className="desc-text">{product.description}</p>

          <div className="card-divider" />

          <div className="price-row">
            <div>
              <span className="price-now">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="price-was">₹{product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            {discount && (
              <span className="save-chip">Save ₹{(product.originalPrice - product.price).toLocaleString()}</span>
            )}
          </div>

          <button className="cart-btn" disabled={product.stock === 0}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" style={{ marginRight: 7, verticalAlign: -2 }}>
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;