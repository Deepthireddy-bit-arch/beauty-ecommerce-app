// src/components/CollectionCard.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { addToCartAsync } from "../../redux/reducers/thunks/cartThunks";
import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlist,
} from "../../redux/reducers/thunks/wishlistActions";

export default function CollectionCard({ item, onToast, isAuthenticated }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  // Only meaningful once logged in - wishlistItems stays empty for guests
  // since CollectionsPage skips fetchWishlist when !isAuthenticated.
  const liked = wishlistItems.some(
    (w) => w.productId === item._id || w._id === item._id || w.product?._id === item._id
  );

  const goToLogin = () => {
    navigate("/login", { state: { from: location.pathname } });
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      onToast("Please log in to add items to cart", "error");
      goToLogin();
      return;
    }

    setIsAddingToCart(true);
    try {
      await dispatch(addToCartAsync({ productId: item._id, quantity: 1 })).unwrap();
      onToast(`Added ${item.title} to cart 🛍️`, "cart");
    } catch (error) {
      // Error toast already handled in the thunk
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      onToast("Please log in to save items to your wishlist", "error");
      goToLogin();
      return;
    }

    setIsTogglingWishlist(true);
    try {
      if (liked) {
        await dispatch(removeFromWishlist(item._id)).unwrap();
        onToast(`Removed ${item.title} from wishlist`, "wishlist");
      } else {
        await dispatch(addToWishlist(item._id)).unwrap();
        onToast(`Added ${item.title} to wishlist ♥`, "wishlist");
      }
    } catch (error) {
      // Re-sync in case local state drifted from the server
      await dispatch(fetchWishlist());
      const message = error?.message || error;
      if (typeof message === "string" && message.includes("already")) {
        onToast(`${item.title} is already in your wishlist ♥`, "wishlist");
      } else {
        onToast("Failed to update wishlist", "error");
      }
    } finally {
      setIsTogglingWishlist(false);
    }
  };
    const handleCardClick = () => {
    navigate(`/collections/${item._id}`);
  };

  // Quick Shop - also navigate to collection detail
  const handleQuickShop = (e) => {
    e.stopPropagation();
    navigate(`/collections/${item._id}`);
  };

  // Explore - also navigate to collection detail
  const handleExplore = (e) => {
    e.stopPropagation();
    navigate(`/collections/${item._id}`);
  };

  return (
 
  <div className="card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
    <div className="card-img-wrap">
      <img src={item.image} alt={item.title} loading="lazy" />
      <span className="card-badge">{item.category}</span>
      <div className="card-overlay">
        <button
          className={`quick-shop ${isAddingToCart ? "loading" : ""}`}
          onClick={handleAddToCart}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? "Adding..." : "Quick Shop"}
        </button>
      </div>
    </div>
    <div className="card-body">
      <div className="card-category">{item.category}</div>
      <h3 className="card-title">{item.title}</h3>
      <p className="card-sub">{item.sub}</p>
      <div className="card-footer">
        <span className="offer-pill">{item.offer}</span>
        <button className="explore-btn" onClick={handleExplore}>
          Explore
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <line x1={5} y1={12} x2={19} y2={12} />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  </div>
);
  
}