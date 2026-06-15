import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./Wishlistpage.css";
import WishlistCard from "./WishlistPageCard";
import { fetchWishlist } from "../../redux/reducers/thunks/wishlistActions";
import { clearMessages } from "../../redux/slices/wishlistSlice";
import FeaturedProductsSection from "../../components/FeaturedProductsSection";
import BestSellersSection from "../../components/BestSellers";

const WishlistPage = () => {
  const dispatch = useDispatch();

  const { items, loading, error, successMessage } = useSelector(
    (state) => state.wishlist
  );

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [error, successMessage, dispatch]);

  // ✅ Normalize backend response (IMPORTANT FIX)
  const normalizedItems = (items || []).map((item) => ({
    id: item._id,
    productId: item.product?._id,
    name: item.product?.name,
    price: item.product?.price,
    originalPrice: item.product?.originalPrice,
    image: item.product?.images?.[0],
    brand: item.product?.brand,
    addedAt: item.addedAt,
  }));

  return (
    <div className="wishlist-page">

      {/* HEADER */}
      <div className="wishlist-header py-4 mb-4">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">

            <div>
              <h1 className="wishlist-title mb-1">
                <i className="bi bi-heart-fill me-2"></i>
                My Wishlist
              </h1>

              <p className="wishlist-subtitle mb-0">
                {normalizedItems.length === 0
                  ? "Your wishlist is empty"
                  : `${normalizedItems.length} item${normalizedItems.length > 1 ? "s" : ""
                  } saved`}
              </p>
            </div>

            {normalizedItems.length > 0 && (
              <div className="d-flex align-items-center gap-3">
                <span className="wishlist-count-badge">
                  {normalizedItems.length} Saved
                </span>

                <button className="btn btn-add-all">
                  <i className="bi bi-cart3 me-2"></i>
                  Add All to Cart
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      <div className="container pb-5">

        {/* ERROR */}
        {error && (
          <div className="alert alert-danger mb-4">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {successMessage && (
          <div className="alert alert-success mb-4">
            {successMessage}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border" role="status" />
            <p className="mt-2">Loading wishlist...</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && normalizedItems.length === 0 && (
          <div className="text-center py-5">
            <h3>Your wishlist is empty ❤️</h3>
            <p>Save products you love here</p>
          </div>
        )}

        {/* GRID */}
        {!loading && normalizedItems.length > 0 && (
          <div className="row">
            {normalizedItems.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
              />
            ))}
          </div>
        )}

      </div>
      <FeaturedProductsSection />

      <BestSellersSection />
    </div>
  );
};

export default WishlistPage;