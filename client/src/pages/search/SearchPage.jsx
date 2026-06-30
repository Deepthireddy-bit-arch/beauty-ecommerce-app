
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  searchProducts,
  fetchSuggestions,
  setSearchQuery,
  setFilter,
  resetFilters,
  clearSuggestions,
  clearSearch,
} from "../../redux/slices/searchSlice";
import { addToCartAsync } from "../../redux/reducers/thunks/cartThunks";
import { showToast } from "../../redux/slices/uiSlice";
import { addToWishlist, fetchWishlist, removeFromWishlist } from "../../redux/reducers/thunks/wishlistActions";

/* ── helpers ── */
const BASE_URL   = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const MEDIA_URL  = BASE_URL.replace("/api", "");
const resolveImg = (p) => (!p ? "" : p.startsWith("http") ? p : `${MEDIA_URL}${p}`);

const Stars = ({ rating = 0 }) => (
  <span className="stars" aria-label={`${rating} stars`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <span key={i} className={i <= Math.round(rating) ? "star filled" : "star"}>★</span>
    ))}
  </span>
);

const SORT_OPTIONS = [
  { value: "relevant",   label: "Featured" },
  { value: "newest",     label: "Newest First" },
  { value: "popular",    label: "Most Popular" },
  { value: "price-asc",  label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating",     label: "Top Rated" },
];

/* ═══════════════════════════════════════════════════════════════
   SEARCH PAGE
═══════════════════════════════════════════════════════════════ */
export default function SearchPage() {
  const dispatch      = useDispatch();
  const navigate      = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // ✅ Toast state
  const [toast, setToast] = useState({ msg: "", show: false, type: "default" });
  const showToastFn = useCallback((msg, type = "default") => {
    setToast({ msg, show: true, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2400);
  }, []);

  const {
    products,
    pagination,
    facets,
    filters,
    query,
    suggestions,
    suggestLoading,
    loading,
    error,
  } = useSelector((s) => s.searchReducer);

  const [localQ,      setLocalQ]      = useState(searchParams.get("q") || "");
  const [showSuggest, setShowSuggest] = useState(false);
  const [page,        setPage]        = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const suggestTimer = useRef(null);
  const inputRef     = useRef(null);

  /* ── Initial load from URL ── */
useEffect(() => {
  const q        = searchParams.get("q")        || "";
  const category = searchParams.get("category") || "";
  const brand    = searchParams.get("brand")    || "";

  setLocalQ(q);
  dispatch(setSearchQuery(q));
  if (category) dispatch(setFilter({ key: "category", value: category }));
  if (brand)    dispatch(setFilter({ key: "brand",    value: brand    }));

  // ✅ Always search — no query means "show all products"
  dispatch(searchProducts({
    q,
    page: 1,
    limit: 12,
    sort: "relevant",
    ...(category && { category }),
    ...(brand    && { brand }),
  }));
}, []); // eslint-disable-line // eslint-disable-line
  
  const isAuth = useSelector((s) => s.login?.isAuthenticated);
  
  useEffect(() => {
    if (isAuth) dispatch(fetchWishlist());
  }, [dispatch, isAuth]);

  /* ── Debounced suggestions ── */
  useEffect(() => {
    clearTimeout(suggestTimer.current);
    if (localQ.trim().length < 2) { dispatch(clearSuggestions()); return; }
    suggestTimer.current = setTimeout(() => {
      dispatch(fetchSuggestions(localQ.trim()));
    }, 280);
    return () => clearTimeout(suggestTimer.current);
  }, [localQ, dispatch]);

  /* ── Run search ── */
const doSearch = useCallback(
  (q, extraFilters = {}, pg = 1) => {
    const params = {
      q,
      page: pg,
      limit: 12,
      sort:     extraFilters.sort     ?? filters.sort,
      category: extraFilters.category ?? filters.category,
      brand:    extraFilters.brand    ?? filters.brand,
      minPrice: extraFilters.minPrice ?? filters.minPrice,
      maxPrice: extraFilters.maxPrice ?? filters.maxPrice,
    };

    // ── Only delete non-q falsy keys — keep q even when empty ──
    Object.keys(params).forEach((k) => {
      if (k !== "q" && !params[k]) delete params[k];
    });

    dispatch(searchProducts(params));

    const sp = new URLSearchParams();
    if (q)               sp.set("q", q);
    if (params.category) sp.set("category", params.category);
    if (params.brand)    sp.set("brand",    params.brand);
    setSearchParams(sp);
  },
  [dispatch, filters, setSearchParams]
);

  const handleSubmit = (e) => {
    e?.preventDefault();
    setShowSuggest(false);
    dispatch(setSearchQuery(localQ));
    setPage(1);
    doSearch(localQ, {}, 1);
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilter({ key, value }));
    setPage(1);
    doSearch(query || localQ, { [key]: value }, 1);
  };

  const handlePageChange = (pg) => {
    setPage(pg);
    doSearch(query || localQ, {}, pg);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSuggestionClick = (s) => {
    setShowSuggest(false);
    if (s.type === "product") {
      navigate(`/product/${s.id}`);
    } else {
      setLocalQ(s.label);
      dispatch(setSearchQuery(s.label));
      doSearch(s.label, {}, 1);
    }
  };

  const handleReset = () => {
    dispatch(resetFilters());
    doSearch(query || localQ, { category: "", brand: "", minPrice: "", maxPrice: "", sort: "relevant" }, 1);
  };

  const activeFilterCount = [
    filters.category, filters.brand, filters.minPrice, filters.maxPrice,
    filters.sort !== "relevant" ? filters.sort : "",
  ].filter(Boolean).length;

  return (
    <>
      <style>{CSS}</style>

      <div className="sp-page" style={{ paddingTop: 72 }}>

        {/* ── SEARCH HERO ── */}
        <div className="sp-hero">
          <div className="sp-hero-inner">
            <form className="sp-search-form" onSubmit={handleSubmit}>
              <div className="sp-search-wrap">
                <span className="sp-search-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </span>
                <input
                  ref={inputRef}
                  value={localQ}
                  onChange={(e) => { setLocalQ(e.target.value); setShowSuggest(true); }}
                  onFocus={() => localQ.length >= 2 && setShowSuggest(true)}
                  onBlur={() => setTimeout(() => setShowSuggest(false), 180)}
                  placeholder="Search products, brands, categories…"
                  className="sp-search-input"
                  autoComplete="off"
                  spellCheck={false}
                />
                {localQ && (
                  <button type="button" className="sp-clear-btn"
onClick={() => {
  setLocalQ("");
  dispatch(setSearchQuery(""));
  dispatch(clearSuggestions());
  dispatch(resetFilters());
  setSearchParams({});
  inputRef.current?.focus();

  // ✅ Re-fetch all products instead of clearing to empty
  dispatch(searchProducts({
    q: "",
    page: 1,
    limit: 12,
    sort: "relevant",
  }));
}}>
                    ×
                  </button>
                )}
                <button type="submit" className="sp-search-btn">Search</button>

                {/* Suggestions */}
                {showSuggest && suggestions.length > 0 && (
                  <div className="sp-suggestions">
                    {suggestions.map((s) => (
                      <div key={s.id} className="sp-suggestion-item"
                        onMouseDown={() => handleSuggestionClick(s)}>
                        <span className="sp-sug-icon">
                          {s.type === "brand" ? "🏷️" : "🛍️"}
                        </span>
                        <div className="sp-sug-text">
                          <span className="sp-sug-label">{s.label}</span>
                          {s.type === "product" && (
                            <span className="sp-sug-meta">{s.category} · ₹{s.price}</span>
                          )}
                          {s.type === "brand" && (
                            <span className="sp-sug-meta">Brand</span>
                          )}
                        </div>
                        {s.image && (
                          <img src={resolveImg(s.image)} alt="" className="sp-sug-img" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* ── ACTIVE FILTER TAGS ── */}
        {activeFilterCount > 0 && (
          <div className="sp-active-filters">
            <span className="sp-active-filters-title">Filters Applied</span>
            <button className="sp-clear-all" onClick={handleReset}>Clear All</button>
            <div className="sp-active-tags">
              {filters.category && (
                <button className="sp-active-tag" onClick={() => handleFilterChange("category", "")}>
                  {filters.category} <span>×</span>
                </button>
              )}
              {filters.brand && (
                <button className="sp-active-tag" onClick={() => handleFilterChange("brand", "")}>
                  {filters.brand} <span>×</span>
                </button>
              )}
              {filters.minPrice && (
                <button className="sp-active-tag" onClick={() => { dispatch(setFilter({ key: "minPrice", value: "" })); doSearch(query || localQ, { minPrice: "" }, 1); }}>
                  Min ₹{filters.minPrice} <span>×</span>
                </button>
              )}
              {filters.maxPrice && (
                <button className="sp-active-tag" onClick={() => { dispatch(setFilter({ key: "maxPrice", value: "" })); doSearch(query || localQ, { maxPrice: "" }, 1); }}>
                  Max ₹{filters.maxPrice} <span>×</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── PAGE BODY ── */}
        <div className="sp-page-body">

          {/* Mobile filter toggle */}
          <button className="sp-mobile-filter-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ⚙ Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>

          {/* Sidebar */}
          <div className={`sp-sidebar-wrap${sidebarOpen ? " open" : ""}`}>
            <aside className="sp-left-filters">
              <div className="sp-filter-header">
                <span className="sp-filter-title">Filters</span>
                {activeFilterCount > 0 && (
                  <button className="sp-clear-link" onClick={handleReset}>Clear All</button>
                )}
              </div>

              {/* Category */}
              <FilterSection title={`Category${filters.category ? " (1)" : ""}`}>
                {["", ...(facets.categories || [])].map((c) => (
                  <label key={c || "all"} className="sp-filter-row">
                    <span className="sp-filter-row-left">
                      <input type="radio" name="category"
                        checked={filters.category === c}
                        onChange={() => handleFilterChange("category", c)} />
                      <span className="sp-filter-label">{c || "All Categories"}</span>
                    </span>
                  </label>
                ))}
              </FilterSection>

              {/* Brand */}
              {(facets.brands || []).length > 0 && (
                <FilterSection title={`Brand${filters.brand ? " (1)" : ""}`}>
                  {["", ...facets.brands].map((b) => (
                    <label key={b || "all"} className="sp-filter-row">
                      <span className="sp-filter-row-left">
                        <input type="radio" name="brand"
                          checked={filters.brand === b}
                          onChange={() => handleFilterChange("brand", b)} />
                        <span className="sp-filter-label">{b || "All Brands"}</span>
                      </span>
                    </label>
                  ))}
                </FilterSection>
              )}

              {/* Price Range */}
              <FilterSection title="Price Range">
                <div className="sp-price-inputs">
                  <input type="number" className="sp-price-input" placeholder="Min ₹"
                    value={filters.minPrice}
                    onChange={(e) => dispatch(setFilter({ key: "minPrice", value: e.target.value }))}
                    onBlur={() => doSearch(query || localQ, {}, 1)} />
                  <span className="sp-price-sep">–</span>
                  <input type="number" className="sp-price-input" placeholder="Max ₹"
                    value={filters.maxPrice}
                    onChange={(e) => dispatch(setFilter({ key: "maxPrice", value: e.target.value }))}
                    onBlur={() => doSearch(query || localQ, {}, 1)} />
                </div>
                <div className="sp-quick-ranges">
                  {[[0,499],[500,999],[1000,1999],[2000,3999]].map(([mn,mx]) => (
                    <button key={`${mn}-${mx}`} className="sp-range-chip"
                      onClick={() => {
                        dispatch(setFilter({ key: "minPrice", value: mn || "" }));
                        dispatch(setFilter({ key: "maxPrice", value: mx === 3999 ? "" : mx }));
                        doSearch(query || localQ, { minPrice: mn || "", maxPrice: mx === 3999 ? "" : mx }, 1);
                      }}>
                      {mn === 0 ? `Under ₹${mx}` : mx === 3999 ? `₹${mn}+` : `₹${mn}–₹${mx}`}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Sort */}
              <FilterSection title="Sort By">
                {SORT_OPTIONS.map((o) => (
                  <label key={o.value} className="sp-filter-row">
                    <span className="sp-filter-row-left">
                      <input type="radio" name="sort"
                        checked={filters.sort === o.value}
                        onChange={() => handleFilterChange("sort", o.value)} />
                      <span className="sp-filter-label">{o.label}</span>
                    </span>
                  </label>
                ))}
              </FilterSection>

              <button className="sp-apply-btn" onClick={() => setSidebarOpen(false)}>
                Apply Filters
              </button>
            </aside>
          </div>

          {/* Products Panel */}
          <div className="sp-products-panel">

            {/* Results bar */}
            {!loading && (products.length > 0 || query) && (
              <div className="sp-results-bar">
                <span className="sp-results-count">
                {(pagination?.total || products.length).toLocaleString()} Products
                  {query && <> for <strong>"{query}"</strong></>}
                </span>
                <div className="sp-sort-wrap">
                  <span className="sp-sort-label">Sort By :</span>
                  <select className="sp-sort-select"
                    value={filters.sort}
                    onChange={(e) => handleFilterChange("sort", e.target.value)}>
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Loading skeleton */}
            {loading && (
              <div className="sp-products-grid">
                {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="sp-empty-state">
                <div className="sp-empty-icon">⚠️</div>
                <h3>Something went wrong</h3>
                <p>{error}</p>
                <button className="sp-retry-btn" onClick={handleSubmit}>Retry</button>
              </div>
            )}

            {/* Initial / empty */}
           {!loading && !error && products.length === 0 && (query || localQ) && (
  <div className="sp-empty-state">
    <div className="sp-empty-icon">✦</div>
    <h3>No products found</h3>
    <p>Try a different search term or clear your filters.</p>
    <button className="sp-retry-btn" onClick={handleReset}>Clear Filters</button>
  </div>
)}
{!loading && !error && products.length === 0 && !query && !localQ && (
  <div className="sp-empty-state">
    <div className="sp-empty-icon">✦</div>
    <h3>No products available</h3>
    <p>Check back later for new arrivals.</p>
  </div>
)}

           

            {/* Product grid */}
            {!loading && products.length > 0 && (
              <>
                <div className="sp-products-grid">
                  {products.map((p) => (
                    <SearchProductCard 
                      key={p._id} 
                      p={p}  
                      onToast={showToastFn}  // ✅ Pass the toast function
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination?.pages > 1 && (
                  <Pagination
                    current={pagination.page}
                    total={pagination.pages}
                    onChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ✅ TOAST - Add this at the bottom of the component */}
      <div className={`sp-toast${toast.show ? " show" : ""}`}>
        <span className="sp-toast-icon">
          {toast.type === "cart" ? "🛍️" : toast.type === "wishlist" ? "♥" : "✓"}
        </span>
        {toast.msg}
      </div>
    </>
  );
}

/* ─────────────── SUB-COMPONENTS ─────────────── */

function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="sp-filter-section">
      <button className="sp-filter-section-header" onClick={() => setOpen((v) => !v)}>
        <span>{title}</span>
        <span className={`sp-chevron${open ? " up" : ""}`}>›</span>
      </button>
      {open && <div className="sp-filter-section-body">{children}</div>}
    </div>
  );
}

function SearchProductCard({ p, onToast }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ── selectors ──────────────────────────────────────────────────────────────
  const isAuth       = useSelector((s) => s.login?.isAuthenticated);
  const wishlistItems = useSelector((s) => s.wishlist?.items ?? []);

  // ── derived ────────────────────────────────────────────────────────────────
  const id       = p._id || p.id;
  const price    = p.price || p.salePrice || 0;
  const name     = p.name || "Product";
  const image    = p.images?.[0] || p.image || null;
  const rating   = p.rating?.average || p.rating || 0;
  const reviews  = p.rating?.count   || p.reviews || 0;
  const category = p.category || "";
  const badge    = p.badge || (p.isBestseller ? "BESTSELLER" : p.isNew ? "NEW" : "");

  const isLiked = Array.isArray(wishlistItems) &&
    wishlistItems.some((w) => w?.product?._id === id);

  const [cartLoading,    setCartLoading]    = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // ── auth guard ─────────────────────────────────────────────────────────────
  const requireAuth = (e, cb) => {
    e.stopPropagation();
    if (!isAuth) { navigate("/login"); return; }
    cb();
  };

  // ── cart ───────────────────────────────────────────────────────────────────
  const handleAddToCart = (e) => {
    requireAuth(e, async () => {
      setCartLoading(true);
      try {
        await dispatch(addToCartAsync({ productId: id, quantity: 1 })).unwrap();
        // ✅ Use onToast only (don't use showToast from uiSlice)
        onToast(`✦ ${name} added to cart!`, 'cart');
      } catch {
        onToast("Failed to add to cart", 'error');
      } finally {
        setCartLoading(false);
      }
    });
  };

  // ── wishlist ───────────────────────────────────────────────────────────────
  const handleToggleWishlist = (e) => {
    requireAuth(e, async () => {
      setWishlistLoading(true);
      try {
        if (isLiked) {
          await dispatch(removeFromWishlist(id)).unwrap();
          onToast("Removed from wishlist", 'wishlist');
        } else {
          await dispatch(addToWishlist(id)).unwrap();
          onToast("Added to wishlist ♥", 'wishlist');
        }
      } catch {
        onToast("Failed to update wishlist", 'error');
      } finally {
        setWishlistLoading(false);
      }
    });
  };

  return (
    <div className="sp-product-card" onClick={() => navigate(`/product/${id}`)}>
      {badge && <div className="sp-bestseller-badge">{badge}</div>}

      <button
        className={`sp-wishlist-btn${isLiked ? " liked" : ""}${wishlistLoading ? " loading" : ""}`}
        onClick={handleToggleWishlist}
        disabled={wishlistLoading}
        aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isLiked ? "♥" : "♡"}
      </button>

      <div className="sp-product-img-wrap">
        {image
          ? <img src={resolveImg(image)} alt={name} loading="lazy" />
          : <span style={{ fontSize: 48, color: "#d8b4fe" }}>✨</span>}

        <button
          className={`sp-quick-add${cartLoading ? " loading" : ""}`}
          onClick={handleAddToCart}
          disabled={cartLoading}
        >
          {cartLoading ? "Adding..." : "+ Quick Add"}
        </button>
      </div>

      <div className="sp-product-body">
        {category && <div className="sp-product-tag">{category}</div>}
        <h3 className="sp-product-name">{name}</h3>
        <div className="sp-product-price-row">
          <span className="sp-product-price">₹{price.toLocaleString()}</span>
          {p.originalPrice && p.originalPrice > price && (
            <>
              <span className="sp-product-mrp">₹{p.originalPrice.toLocaleString()}</span>
              <span className="sp-product-discount">
                {Math.round((1 - price / p.originalPrice) * 100)}% Off
              </span>
            </>
          )}
        </div>
        <div className="sp-product-rating-row">
          <Stars rating={rating} />
          {reviews > 0 && <span className="sp-product-reviews">({reviews.toLocaleString()})</span>}
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="sp-product-skeleton">
      <div className="sp-ps-img" />
      <div className="sp-ps-body">
        <div className="sp-ps-line short" />
        <div className="sp-ps-line" />
        <div className="sp-ps-line med" />
        <div className="sp-ps-line short" />
      </div>
    </div>
  );
}

function Pagination({ current, total, onChange }) {
  return (
    <div className="sp-pagination">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          className={`sp-page-btn${current === i + 1 ? " active" : ""}`}
          onClick={() => onChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}

const CSS = `


/* ── Base ── */
.sp-page {
  min-height: 100vh;
  background: #f7f7f9;
 
}

/* ── Search Hero ── */
.sp-hero {
  background: #fff;
  border-bottom: 1px solid #ececf0;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: var(--nav-pad-x, 48px);
  padding-right: var(--nav-pad-x, 48px);
}
.sp-hero-inner {
  
  width: 100%;
}
.sp-wishlist-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 3;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #e8e4f0;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(4px);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  transition: all 0.2s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

.sp-wishlist-btn:hover {
  color: #e11d48;
  border-color: #fecdd3;
  transform: scale(1.12);
}

.sp-wishlist-btn.liked {
  color: #7c3aed;
  border-color: #c4b5fd;
  background: rgba(124, 58, 237, 0.08);
}

.sp-wishlist-btn.loading {
  opacity: 0.6;
  pointer-events: none;
}

.sp-product-img-wrap { position: relative; }
.sp-search-form {
  max-width: 780px;
  margin: 0 auto;
  width: 100%;
}
.sp-search-wrap {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1.5px solid #e0d7f5;
  border-radius: 10px;
  overflow: visible;
  position: relative;
  transition: border-color 0.2s;
}
.sp-search-wrap:focus-within { border-color: #7c3aed; }
.sp-search-icon {
  padding: 0 12px 0 16px;
  color: #7c3aed;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}
.sp-search-input {
  flex: 1;
  border: none;
  outline: none;
 
  font-size: 14px;
  color: #1a1a2e;
  padding: 13px 8px;
  background: transparent;
  min-width: 0;
}
.sp-search-input::placeholder { color: #aaa; }
.sp-clear-btn {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  padding: 0 10px;
  font-size: 18px;
  flex-shrink: 0;
  line-height: 1;
}
.sp-clear-btn:hover { color: #7c3aed; }
.sp-search-btn {
  background: #7c3aed;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
 
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
  margin: 4px;
}
.sp-search-btn:hover { background: #6d28d9; }

.sp-suggestions {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 2000;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  border: 1.5px solid #e0d7f5;
  overflow: hidden;
}
.sp-suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 16px;
  cursor: pointer;
  transition: background 0.15s;
}
.sp-suggestion-item:hover { background: #f5f0ff; }
.sp-sug-icon { font-size: 15px; flex-shrink: 0; }
.sp-sug-text { flex: 1; min-width: 0; }
.sp-sug-label { display: block; font-size: 13px; font-weight: 600; color: #1a1a2e; }
.sp-sug-meta  { display: block; font-size: 11px; color: #999; margin-top: 1px; }
.sp-sug-img   { width: 36px; height: 36px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
.sp-active-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  background: #fff;
  border-bottom: 1px solid #ececf0;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: var(--nav-pad-x, 48px);
  padding-right: var(--nav-pad-x, 48px);
}
.sp-active-filters-title {
  font-size: 12px;
  font-weight: 700;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-right: 4px;
}
.sp-clear-all {
  font-size: 12px;
  font-weight: 600;
  color: #7c3aed;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}
.sp-active-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.sp-active-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #f0e8ff;
  border: 1px solid #d8b4fe;
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #7c3aed;
  cursor: pointer;
  transition: all 0.15s;
}
.sp-active-tag:hover { background: #e8d5ff; }
.sp-active-tag span { font-size: 14px; line-height: 1; color: #a78bfa; }

.sp-page-body {
  display: flex;
  gap: 0;
  align-items: flex-start;       /* ← this is correct, keeps sticky working */
  position: relative;
  
  padding-top: 24px;
  padding-bottom: 40px;
  padding-left: var(--nav-pad-x, 48px);
  padding-right: var(--nav-pad-x, 48px);
  box-sizing: border-box;
}

.sp-mobile-filter-toggle {
  display: none;
  position: absolute;
  top: 24px;
  left: 20px;
  background: #fff;
  border: 1.5px solid #e0d7f5;
  border-radius: 8px;
  padding: 8px 16px;
 
  font-size: 13px;
  font-weight: 600;
  color: #7c3aed;
  cursor: pointer;
  z-index: 10;
}

.sp-sidebar-wrap {
  width: 240px;
  flex-shrink: 0;
  margin-right: 24px;
  /* ── sticky container — must NOT be overflow:hidden ── */
  align-self: flex-start;
  position: sticky;
  top: calc(var(--navbar-h, 72px) + 16px);
  max-height: calc(100vh - var(--navbar-h, 72px) - 32px);
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
  .sp-sidebar-wrap::-webkit-scrollbar {
  display: none;
}

.sp-left-filters {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #ececf0;
  padding: 0;
  overflow: hidden;
  /* ── remove old sticky — now on the wrap ── */
}

.sp-filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 18px;
  border-bottom: 1px solid #f0eaff;
}
.sp-filter-title {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a2e;
}
.sp-clear-link {
  font-size: 12px;
  font-weight: 600;
  color: #7c3aed;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}

.sp-filter-section {
  border-bottom: 1px solid #f0eaff;
}
.sp-filter-section:last-of-type { border-bottom: none; }
.sp-filter-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  padding: 13px 18px;
 
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: #444;
  transition: color 0.2s;
}
.sp-filter-section-header:hover { color: #7c3aed; }
.sp-chevron {
  font-size: 16px;
  color: #999;
  transform: rotate(90deg);
  transition: transform 0.2s;
  display: inline-block;
}
.sp-chevron.up { transform: rotate(-90deg); }
.sp-filter-section-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 18px 14px;
}

.sp-filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}
.sp-filter-row:hover { background: #f5f0ff; }
.sp-filter-row-left {
  display: flex;
  align-items: center;
  gap: 9px;
}
.sp-filter-row input[type="radio"] {
  accent-color: #7c3aed;
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  cursor: pointer;
}
.sp-filter-label {
  font-size: 13px;
  color: #444;
  cursor: pointer;
}

.sp-price-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.sp-price-input {
  flex: 1;
  border: 1.5px solid #e0d7f5;
  border-radius: 7px;
  padding: 7px 9px;
 
  font-size: 12px;
  color: #1a1a2e;
  outline: none;
  transition: border-color 0.2s;
  width: 0;
}
.sp-price-input:focus { border-color: #7c3aed; }
.sp-price-sep { color: #aaa; font-size: 12px; flex-shrink: 0; }
.sp-quick-ranges {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.sp-range-chip {
  border: 1.5px solid #e0d7f5;
  border-radius: 20px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 600;
  color: #7c3aed;
  background: #faf5ff;
  cursor: pointer;
  transition: all 0.2s;
}
.sp-range-chip:hover { background: #7c3aed; color: #fff; border-color: #7c3aed; }

.sp-apply-btn {
  display: none;
  width: calc(100% - 36px);
  margin: 12px 18px;
  background: #7c3aed;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 11px;
 
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}


.sp-products-panel {
  flex: 1;
  min-width: 0;
  /* products panel scrolls naturally with the page */
}

.sp-results-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border: 1px solid #ececf0;
  border-radius: 10px;
  padding: 13px 20px;
  margin-bottom: 18px;
}
.sp-results-count {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a2e;
}
.sp-results-count strong { color: #7c3aed; }
.sp-sort-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}
.sp-sort-label {
  font-size: 12px;
  font-weight: 600;
  color: #888;
  white-space: nowrap;
}
.sp-sort-select {
  border: 1.5px solid #e0d7f5;
  border-radius: 7px;
  background: #fff;
  color: #1a1a2e;
  padding: 7px 12px;
 
  font-size: 12px;
  font-weight: 600;
  outline: none;
  cursor: pointer;
}
.sp-sort-select:focus { border-color: #7c3aed; }

.sp-products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
@media (max-width: 1200px) { .sp-products-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 860px)  { .sp-products-grid { grid-template-columns: repeat(2, 1fr); } }

.sp-product-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #ececf0;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: box-shadow 0.25s, transform 0.25s;
}
.sp-product-card:hover {
  box-shadow: 0 8px 28px rgba(124,58,237,0.12);
  transform: translateY(-3px);
}
.sp-bestseller-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  background: #7c3aed;
  color: #fff;
  border-radius: 4px;
  padding: 2px 10px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.sp-product-img-wrap {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #faf8ff;
  overflow: hidden;
  position: relative;
}
.sp-product-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}
.sp-product-card:hover .sp-product-img-wrap img { transform: scale(1.04); }
.sp-quick-add {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%) translateY(8px);
  opacity: 0;
  white-space: nowrap;
  background: #7c3aed;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 7px 18px;
 
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s;
  z-index: 2;
}
.sp-product-card:hover .sp-quick-add {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
.sp-product-body { padding: 14px 16px 16px; }
.sp-product-tag {
  font-size: 9.5px;
  font-weight: 700;
  color: #7c3aed;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.sp-product-name {

  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
  line-height: 1.3;
  margin: 0 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.sp-product-price-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}
.sp-product-price {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a2e;
}
.sp-product-mrp {
  font-size: 12px;
  color: #aaa;
  text-decoration: line-through;
}
.sp-product-discount {
  font-size: 11px;
  font-weight: 700;
  color: #22c55e;
}
.sp-product-rating-row {
  display: flex;
  align-items: center;
  gap: 5px;
}
.stars { display: inline-flex; gap: 1px; }
.star { font-size: 12px; color: #ddd; }
.star.filled { color: #7c3aed; }
.sp-product-reviews { font-size: 11px; color: #999; }

.sp-product-skeleton {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #ececf0;
  overflow: hidden;
}
.sp-ps-img {
  height: 200px;
  background: linear-gradient(90deg, #f0eaff 25%, #e8dcff 50%, #f0eaff 75%);
  background-size: 200% 100%;
  animation: sp-shimmer 1.4s infinite;
}
.sp-ps-body { padding: 14px 16px; }
.sp-ps-line {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f0eaff 25%, #e8dcff 50%, #f0eaff 75%);
  background-size: 200% 100%;
  animation: sp-shimmer 1.4s infinite;
  margin-bottom: 8px;
  width: 100%;
}
.sp-ps-line.short { width: 45%; }
.sp-ps-line.med   { width: 70%; }
@keyframes sp-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.sp-empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #ececf0;
  text-align: center;
}
.sp-empty-icon { font-size: 48px; color: #d8b4fe; margin-bottom: 16px; }
.sp-empty-state h3 {

  font-size: 22px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 8px;
}
.sp-empty-state p {
  font-size: 13px;
  color: #888;
  margin: 0 0 20px;
}
.sp-retry-btn {
  background: #7c3aed;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
 
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.sp-retry-btn:hover { background: #6d28d9; }

.sp-pagination {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 28px;
  flex-wrap: wrap;
}
.sp-page-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #333;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.2s;
}
.sp-page-btn:hover { border-color: #7c3aed; color: #7c3aed; }
.sp-page-btn.active { background: #7c3aed; color: #fff; border-color: #7c3aed; }
.sp-page-btn:disabled { opacity: 0.35; cursor: default; }

/* ─── TOAST ────────────────────────────────────────────────────── */
.sp-toast {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%) translateY(80px);
  background: #1a1a2e;
  color: #fff;
  padding: 14px 28px;
  border-radius: 12px;
 
  font-size: 14px;
  font-weight: 500;
  opacity: 0;
  pointer-events: none;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 9999;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
  border: 1px solid rgba(255,255,255,0.08);
  display: flex;
  align-items: center;
  gap: 12px;
}

.sp-toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.sp-toast-icon {
  font-size: 20px;
}

@media (max-width: 640px) {
  .sp-toast {
    font-size: 13px;
    padding: 12px 20px;
    bottom: 20px;
    left: 20px;
    right: 20px;
    transform: translateY(80px);
    width: auto;
  }
  .sp-toast.show {
    transform: translateY(0);
  }
}

/* ── Mobile Responsive ── */
@media (max-width: 767px) {
  .sp-page-body { padding-top: 64px; }
  .sp-mobile-filter-toggle { display: block; }
  .sp-sidebar-wrap {
    position: fixed;
    inset: 0;
    z-index: 1100;
    pointer-events: none;
    width: auto;
    margin-right: 0;
  }
  .sp-sidebar-wrap.open { pointer-events: all; }
  .sp-sidebar-wrap.open::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(26,26,46,0.4);
  }
  .sp-left-filters {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 290px;
    border-radius: 0 16px 16px 0;
    overflow-y: auto;
    transform: translateX(-100%);
    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
    z-index: 1;
    position: absolute;
  }
  .sp-sidebar-wrap.open .sp-left-filters { transform: translateX(0); }
  .sp-apply-btn { display: block; }
  .sp-hero-inner { padding: 0 16px; }
}
`;