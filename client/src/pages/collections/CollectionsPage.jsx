import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
// import {
//   fetchCollections,
//   setFilter,
//   toggleLike,
//   selectFilteredCollections,
  
//   selectStatus,
//   selectError,
//   selectFilter,
//   selectLiked,
//   selectAllCollections,
// } from "../../redux/slices/collectionsSlice";
import {
  fetchCollections,
  setAllCollections,
  setSortBy,
  setPage,
  setCategory,
  clearFilters,
  clearCollection,
  toggleWishlist,
  selectCollections,
  selectAllCollections,
  selectCollectionsStatus,
  selectCollection,
  selectCollectionStatus,
  selectProducts,
  selectProductsStatus,
  selectPagination,
  selectFilters,
  selectWishlist,
  selectError,
} from "../../redux/slices/collectionsSlice";
import "./collections.css";
import BannerCarousel from "../../components/BannerCarousel";
import { fetchBrandBanners, selectBanners } from "../../redux/slices/brandpageSlice";

// ─── TOAST HOOK ───────────────────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState({ msg: "", show: false });
  const showToast = (msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2400);
  };
  return { toast, showToast };
}

// ─── SKELETON CARD ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="skeleton" aria-hidden="true">
      <div className="sk-img" />
      <div className="sk-body">
        <div className="sk-line short" />
        <div className="sk-line med" />
        <div className="sk-line" />
        <div className="sk-footer">
          <div className="sk-pill" />
          <div className="sk-btn" />
        </div>
      </div>
    </div>
  );
}

// ─── COLLECTION CARD ──────────────────────────────────────────────────────────
function CollectionCard({ item, onToast }) {
  const dispatch = useDispatch();

  const wishlist = useSelector(selectWishlist);
  const liked = wishlist[item._id];

  const handleLike = (e) => {
    e.stopPropagation();
    dispatch(toggleWishlist(item._id));
    onToast(liked ? "Removed from wishlist" : "Added to wishlist ♥");
  };

  return (
    <div className="card">
      <div className="card-img-wrap">
        <img src={item.image} alt={item.title} loading="lazy" />

        <span className="card-badge">{item.category}</span>

        <button
          className={`card-wishlist${liked ? " liked" : ""}`}
          onClick={handleLike}
        >
          {liked ? "♥" : "♡"}
        </button>
      </div>

      <div className="card-body">
        <h3>{item.title}</h3>
        <p>{item.sub}</p>
        <span>{item.offer}</span>
      </div>
    </div>
  );
}

// ─── FILTER PANEL ─────────────────────────────────────────────────────────────
function FilterPanel({ collections, localFilters, setLocalFilters, onClear, isOpen, onClose }) {
  // Derive unique values from collections data
  const categories = useMemo(() => {
    const cats = [...new Set(collections.map((c) => c.category).filter(Boolean))];
    return cats.sort();
  }, [collections]);

  const priceRanges = [
    { label: "Under ₹500", min: 0, max: 500 },
    { label: "₹500 – ₹1,000", min: 500, max: 1000 },
    { label: "₹1,000 – ₹2,500", min: 1000, max: 2500 },
    { label: "₹2,500+", min: 2500, max: Infinity },
  ];

  const ratingOptions = [4, 3, 2];

  const toggleCategory = (cat) => {
    setLocalFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const togglePrice = (range) => {
    const key = `${range.min}-${range.max}`;
    setLocalFilters((prev) => ({
      ...prev,
      priceRange: prev.priceRange === key ? null : key,
    }));
  };

  const toggleRating = (rating) => {
    setLocalFilters((prev) => ({
      ...prev,
      minRating: prev.minRating === rating ? null : rating,
    }));
  };

  const activeCount = [
    localFilters.categories.length,
    localFilters.priceRange ? 1 : 0,
    localFilters.minRating ? 1 : 0,
    localFilters.inStockOnly ? 1 : 0,
    localFilters.onSaleOnly ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="filter-backdrop" onClick={onClose} />}

      <aside className={`filter-panel${isOpen ? " open" : ""}`}>
        {/* Panel header */}
        <div className="fp-header">
          <div className="fp-title-row">
            <h3 className="fp-title">Filters</h3>
            {activeCount > 0 && (
              <span className="fp-count-badge">{activeCount}</span>
            )}
          </div>
          <div className="fp-header-actions">
            {activeCount > 0 && (
              <button className="fp-clear-btn" onClick={onClear}>
                Clear all
              </button>
            )}
            <button className="fp-close-btn" onClick={onClose} aria-label="Close filters">
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                <line x1={18} y1={6} x2={6} y2={18} />
                <line x1={6} y1={6} x2={18} y2={18} />
              </svg>
            </button>
          </div>
        </div>

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="fp-section">
            <h4 className="fp-section-title">Category</h4>
            <div className="fp-options">
              {categories.map((cat) => (
                <label key={cat} className="fp-checkbox-label">
                  <input
                    type="checkbox"
                    className="fp-checkbox"
                    checked={localFilters.categories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                  />
                  <span className="fp-checkbox-box" />
                  <span className="fp-checkbox-text">{cat}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Price range */}
        <div className="fp-section">
          <h4 className="fp-section-title">Price Range</h4>
          <div className="fp-options">
            {priceRanges.map((range) => {
              const key = `${range.min}-${range.max}`;
              return (
                <label key={key} className="fp-radio-label">
                  <input
                    type="radio"
                    className="fp-radio"
                    name="priceRange"
                    checked={localFilters.priceRange === key}
                    onChange={() => togglePrice(range)}
                  />
                  <span className="fp-radio-dot" />
                  <span className="fp-checkbox-text">{range.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Min rating */}
        <div className="fp-section">
          <h4 className="fp-section-title">Minimum Rating</h4>
          <div className="fp-options">
            {ratingOptions.map((r) => (
              <label key={r} className="fp-radio-label">
                <input
                  type="radio"
                  className="fp-radio"
                  name="minRating"
                  checked={localFilters.minRating === r}
                  onChange={() => toggleRating(r)}
                />
                <span className="fp-radio-dot" />
                <span className="fp-checkbox-text">
                  {"★".repeat(r)}{"☆".repeat(5 - r)} &amp; up
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Availability toggles */}
        <div className="fp-section">
          <h4 className="fp-section-title">Availability</h4>
          <div className="fp-options">
            <label className="fp-toggle-label">
              <div className={`fp-toggle${localFilters.inStockOnly ? " on" : ""}`}
                onClick={() =>
                  setLocalFilters((p) => ({ ...p, inStockOnly: !p.inStockOnly }))
                }
                role="switch"
                aria-checked={localFilters.inStockOnly}
                tabIndex={0}
                onKeyDown={(e) => e.key === " " &&
                  setLocalFilters((p) => ({ ...p, inStockOnly: !p.inStockOnly }))
                }
              >
                <span className="fp-toggle-knob" />
              </div>
              <span className="fp-checkbox-text">In stock only</span>
            </label>
            <label className="fp-toggle-label">
              <div className={`fp-toggle${localFilters.onSaleOnly ? " on" : ""}`}
                onClick={() =>
                  setLocalFilters((p) => ({ ...p, onSaleOnly: !p.onSaleOnly }))
                }
                role="switch"
                aria-checked={localFilters.onSaleOnly}
                tabIndex={0}
                onKeyDown={(e) => e.key === " " &&
                  setLocalFilters((p) => ({ ...p, onSaleOnly: !p.onSaleOnly }))
                }
              >
                <span className="fp-toggle-knob" />
              </div>
              <span className="fp-checkbox-text">On sale</span>
            </label>
          </div>
        </div>

        {/* Mobile apply button */}
        <button className="fp-apply-btn" onClick={onClose}>
          Apply filters{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
      </aside>
    </>
  );
}

// ─── ACTIVE FILTER CHIPS ──────────────────────────────────────────────────────
function ActiveFilterChips({ localFilters, setLocalFilters }) {
  const priceLabels = {
    "0-500": "Under ₹500",
    "500-1000": "₹500 – ₹1,000",
    "1000-2500": "₹1,000 – ₹2,500",
    "2500-Infinity": "₹2,500+",
  };

  const chips = [
    ...localFilters.categories.map((cat) => ({
      key: `cat-${cat}`,
      label: cat,
      remove: () =>
        setLocalFilters((p) => ({
          ...p,
          categories: p.categories.filter((c) => c !== cat),
        })),
    })),
    ...(localFilters.priceRange
      ? [{
          key: "price",
          label: priceLabels[localFilters.priceRange] || localFilters.priceRange,
          remove: () => setLocalFilters((p) => ({ ...p, priceRange: null })),
        }]
      : []),
    ...(localFilters.minRating
      ? [{
          key: "rating",
          label: `${localFilters.minRating}★ & up`,
          remove: () => setLocalFilters((p) => ({ ...p, minRating: null })),
        }]
      : []),
    ...(localFilters.inStockOnly
      ? [{
          key: "stock",
          label: "In stock",
          remove: () => setLocalFilters((p) => ({ ...p, inStockOnly: false })),
        }]
      : []),
    ...(localFilters.onSaleOnly
      ? [{
          key: "sale",
          label: "On sale",
          remove: () => setLocalFilters((p) => ({ ...p, onSaleOnly: false })),
        }]
      : []),
  ];

  if (chips.length === 0) return null;

  return (
    <div className="active-chips">
      {chips.map((chip) => (
        <button key={chip.key} className="active-chip" onClick={chip.remove}>
          {chip.label}
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <line x1={18} y1={6} x2={6} y2={18} />
            <line x1={6} y1={6} x2={18} y2={18} />
          </svg>
        </button>
      ))}
    </div>
  );
}

// ─── DEFAULT FILTERS ──────────────────────────────────────────────────────────
const defaultFilters = {
  categories: [],
  priceRange: null,
  minRating: null,
  inStockOnly: false,
  onSaleOnly: false,
};
const BannerSection = () => {
  const dispatch=useDispatch();
  useEffect(() => {
  dispatch(fetchBrandBanners());
}, [dispatch]);
  const banners = useSelector(selectBanners);
  return <BannerCarousel banners={banners} />;
};



// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function CollectionsPage() {
  const dispatch = useDispatch();
  const { toast, showToast } = useToast();

  const status = useSelector(selectCollectionsStatus);
  const error = useSelector(selectError);
  const allCollections = useSelector(selectAllCollections);

  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(defaultFilters);
  const [sortBy, setSortBy] = useState("featured");

 

  // Close filter panel on desktop resize
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) setFilterPanelOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  useEffect(() => {
  dispatch(
    fetchCollections({
      categories: localFilters.categories,
      priceRange: localFilters.priceRange,
      minRating: localFilters.minRating,
      inStockOnly: localFilters.inStockOnly,
      onSaleOnly: localFilters.onSaleOnly,
      sortBy,
    })
  );
}, [dispatch, localFilters, sortBy]);
const displayedItems = allCollections;

  const activeFilterCount = [
    localFilters.categories.length,
    localFilters.priceRange ? 1 : 0,
    localFilters.minRating ? 1 : 0,
    localFilters.inStockOnly ? 1 : 0,
    localFilters.onSaleOnly ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const clearFilters = () => {
    setLocalFilters(defaultFilters);
    setSortBy("featured");
  };

  return (
    <>
    <div>
          <BannerSection />
           <div className="collections-topbar">
        <div className="topbar-left">
          {/* Mobile filter button */}
          <button
            className="mobile-filter-btn"
            onClick={() => setFilterPanelOpen(true)}
            aria-label="Open filters"
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2} strokeLinecap="round"
              strokeLinejoin="round">
              <line x1={4} y1={6} x2={20} y2={6} />
              <line x1={8} y1={12} x2={16} y2={12} />
              <line x1={11} y1={18} x2={13} y2={18} />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="mobile-filter-badge">{activeFilterCount}</span>
            )}
          </button>
        </div>

        <div className="topbar-right">
          {status === "succeeded" && (
            <span className="topbar-count">
              {allCollections.length} result{allCollections.length !== 1 ? "s" : ""}
            </span>
          )}
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort collections"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* ── LAYOUT: sidebar + grid ── */}
      
      <div className="collections-layout">
          
        {/* Sidebar filter panel (desktop: always visible, mobile: drawer) */}
        <FilterPanel
          collections={allCollections}
          localFilters={localFilters}
          setLocalFilters={setLocalFilters}
          onClear={clearFilters}
          isOpen={filterPanelOpen}
          onClose={() => setFilterPanelOpen(false)}
        />

        {/* Main content area */}
        <main className="main">
          {/* Active filter chips */}
          <ActiveFilterChips
            localFilters={localFilters}
            setLocalFilters={setLocalFilters}
          />

          {/* Section meta */}
          {status !== "loading" && (
            <div className="section-meta">
              <h2 className="section-title">All Collections</h2>
              <span className="section-count">
                {allCollections.length} collection
                {allCollections.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Loading skeletons */}
          {status === "loading" && (
            <div className="grid" aria-label="Loading collections">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Error state */}
          {status === "failed" && (
            <div className="error-state">
              <div className="error-icon">✦</div>
              <h3 className="error-title">Something went wrong</h3>
              <p className="error-msg">{error || "Failed to load collections"}</p>
              <button
                className="retry-btn"
                onClick={() => dispatch(fetchCollections())}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Grid */}
          {status === "succeeded" &&
            (allCollections.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">◇</div>
                <h3 className="empty-title">No collections match</h3>
                <p className="empty-sub">
                  Try adjusting or clearing your filters
                </p>
                <button className="retry-btn" onClick={clearFilters}>
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid">
                {allCollections.map((item) => (
                  <CollectionCard
                    key={item._id}
                    item={item}
                    onToast={showToast}
                  />
                ))}
              </div>
            ))}
        </main>
      </div>

      {/* ── TOAST ── */}
      <div className={`toast${toast.show ? " show" : ""}`} role="status" aria-live="polite">
        {toast.msg}
      </div>
    </div>
      {/* ── TOP BAR: sort + mobile filter toggle ── */}
     
    </>
  );
}