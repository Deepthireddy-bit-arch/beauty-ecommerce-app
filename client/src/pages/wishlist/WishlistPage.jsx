import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { fetchWishlist } from "../../redux/reducers/thunks/wishlistActions";
import { addToCartAsync } from "../../redux/reducers/thunks/cartThunks";
import WishlistCard from "./WishlistPageCard";
import FeaturedProductsSection from "../../components/FeaturedProductsSection";
import BestSellersSection from "../../components/BestSellers";
import "./Wishlistpage.css";

// ─── SKELETON ─────────────────────────────────────────────────────────────────
const WishlistSkeleton = () => (
  <div className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
    <div className="wl-skeleton card border-0 shadow-sm">
      <div className="wl-sk-img" />
      <div className="wl-sk-body">
        <div className="wl-sk-line short" />
        <div className="wl-sk-line" />
        <div className="wl-sk-line med" />
        <div className="wl-sk-line short" />
        <div className="wl-sk-btn" />
      </div>
    </div>
  </div>
);

// ─── PAGE ─────────────────────────────────────────────────────────────────────
const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuth  = useSelector((s) => s.login?.isAuthenticated);
  const { items, loading, error } = useSelector((s) => s.wishlist);

  // ── auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuth) {
      navigate("/login", { state: { from: "/wishlist" } });
      return;
    }
    dispatch(fetchWishlist());
  }, [dispatch, isAuth, navigate]);

  // ── normalize backend shape: { product: { _id, name, ... }, addedAt } ──────
  const normalizedItems = (Array.isArray(items) ? items : []).map((item) => ({
    id:            item._id,
    productId:     item.product?._id,
    name:          item.product?.name          ?? "Product",
    price:         item.product?.price         ?? 0,
    originalPrice: item.product?.originalPrice ?? null,
    image:         item.product?.images?.[0]   ?? null,
    brand:         item.product?.brand         ?? "",
    category:      item.product?.category      ?? "General",
    discount:      item.product?.discount      ?? 0,
    stock:         item.product?.stock         ?? 1,
    rating:        item.product?.rating        ?? 0,
    numReviews:    item.product?.numReviews    ?? item.product?.reviews ?? 0,
    addedAt:       item.addedAt,
  }));

  // ── add all to cart ─────────────────────────────────────────────────────────
  const handleAddAll = useCallback(async () => {
    const inStock = normalizedItems.filter((i) => i.stock > 0);
    await Promise.all(
      inStock.map((i) =>
        dispatch(addToCartAsync({ productId: i.productId, quantity: 1 }))
      )
    );
  }, [normalizedItems, dispatch]);

  // ── toast (local — page-level) ──────────────────────────────────────────────
  const [toast, setToast] = React.useState({ msg: "", show: false });
  const showToast = useCallback((msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2400);
  }, []);

  return (
    <div className="wishlist-page">

      {/* ── local toast ── */}
      <div className={`wl-toast${toast.show ? " show" : ""}`}>
        {toast.msg}
      </div>

      {/* ── HEADER ── */}
      <div className="wishlist-header py-4 mb-4">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <h1 className="wishlist-title mb-1">
                <i className="bi bi-heart-fill me-2" />
                My Wishlist
              </h1>
              <p className="wishlist-subtitle mb-0">
                {loading
                  ? "Loading your wishlist…"
                  : normalizedItems.length === 0
                  ? "Your wishlist is empty"
                  : `${normalizedItems.length} item${normalizedItems.length > 1 ? "s" : ""} saved`}
              </p>
            </div>

            {!loading && normalizedItems.length > 0 && (
              <div className="d-flex align-items-center gap-3">
                <span className="wishlist-count-badge">
                  {normalizedItems.length} Saved
                </span>
                {/* <button className="btn btn-add-all" onClick={handleAddAll}>
                  <i className="bi bi-cart3 me-2" />
                  Add All to Cart
                </button> */}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container pb-5">

        {/* ── error ── */}
        {error && (
          <div className="alert alert-danger mb-4">{error}</div>
        )}

        {/* ── SKELETONS ── */}
        {loading && (
          <div className="row">
            {[1, 2, 3, 4].map((n) => <WishlistSkeleton key={n} />)}
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {!loading && normalizedItems.length === 0 && (
          <div className="wl-empty-state text-center py-5">
            <div className="wl-empty-icon">🤍</div>
            <h3 className="wl-empty-title">Your wishlist is empty</h3>
            <p className="wl-empty-sub">
              Save products you love and find them here anytime.
            </p>
            <Link to="/shop" className="btn btn-add-all">
              Start Shopping
            </Link>
          </div>
        )}

        {/* ── GRID ── */}
        {!loading && normalizedItems.length > 0 && (
          <div className="row">
            {normalizedItems.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                onToast={showToast}
              />
            ))}
          </div>
        )}

      </div>

      {/* <FeaturedProductsSection />
      <BestSellersSection /> */}
    </div>
  );
};

export default WishlistPage;