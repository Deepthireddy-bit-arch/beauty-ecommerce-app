import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartAsync } from '../../redux/reducers/thunks/cartThunks';
import { addToWishlist, removeFromWishlist, fetchWishlist } from '../../redux/reducers/thunks/wishlistActions';
import './productcard.css';

function ProductCard({ product, onToast }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  
  // Check if product is in wishlist
  const liked = wishlistItems.some(
    (item) => item.productId === product._id || item._id === product._id
  );

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsAddingToCart(true);
    try {
      const result = await dispatch(addToCartAsync({ 
        productId: product._id, 
        quantity: 1 
      })).unwrap();
      
      if (onToast) {
        onToast(`Added ${product.name || product.title} to cart 🛍️`, 'cart');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      if (onToast) {
        onToast(`Failed to add ${product.name || product.title} to cart`, 'error');
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    setIsTogglingWishlist(true);
    try {
      if (liked) {
        await dispatch(removeFromWishlist(product._id)).unwrap();
        if (onToast) {
          onToast(`Removed ${product.name || product.title} from wishlist`, 'wishlist');
        }
      } else {
        await dispatch(addToWishlist(product._id)).unwrap();
        if (onToast) {
          onToast(`Added ${product.name || product.title} to wishlist ♥`, 'wishlist');
        }
      }
      // Refresh wishlist to get updated state
      await dispatch(fetchWishlist()).unwrap();
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      // Refresh wishlist to sync state
      await dispatch(fetchWishlist()).unwrap();
      if (error?.message?.includes('already') || error?.includes?.('already')) {
        if (onToast) {
          onToast(`${product.name || product.title} is already in your wishlist ♥`, 'wishlist');
        }
      } else {
        if (onToast) {
          onToast(`Failed to update wishlist`, 'error');
        }
      }
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  return (
    <div className="product-card">
      <div className="product-card-img-wrap">
        <img 
          src={product.image || product.images?.[0] || '/placeholder.png'} 
          alt={product.name || product.title} 
          loading="lazy"
        />
        {product.isBestseller && (
          <span className="product-badge bestseller">Bestseller</span>
        )}
        {product.isNew && (
          <span className="product-badge new">New</span>
        )}
        {product.discount > 0 && (
          <span className="product-badge discount">{product.discount}% OFF</span>
        )}
        
        {/* Wishlist Button */}
        <button
          className={`product-wishlist-btn ${liked ? 'liked' : ''} ${isTogglingWishlist ? 'loading' : ''}`}
          onClick={handleToggleWishlist}
          disabled={isTogglingWishlist}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <span className="heart-icon">{liked ? '♥' : '♡'}</span>
        </button>
        
        {/* Quick Add to Cart */}
        <button
          className={`product-quick-add ${isAddingToCart ? 'loading' : ''}`}
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