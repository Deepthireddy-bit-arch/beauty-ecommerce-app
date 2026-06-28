import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchCollections,
  selectAllCollections,
  selectCollectionsStatus,
  selectError,
} from "../../redux/slices/collectionsSlice";
import "./collections.css";
import {
  fetchBrandBanners,
  selectActiveBanner,
  selectBanners,
  setActiveBanner,
} from "../../redux/slices/brandpageSlice";
import FeaturedProductsSection from "../../components/FeaturedProductsSection";
import NewArrivalsSection from "../../components/NewArrivalsSection";
import { fetchWishlist } from "../../redux/reducers/thunks/wishlistActions";
import CollectionCard from "./CollectionsCard";


// ─── TOAST HOOK ───────────────────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState({ msg: "", show: false, type: "default" });
  const showToast = useCallback((msg, type = "default") => {
    setToast({ msg, show: true, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2400);
  }, []);
  return { toast, showToast };
}

// ─── RESPONSIVE HOOK ──────────────────────────────────────────────────────────
// Drives the desktop/mobile filter trigger from JS instead of CSS display
// toggles, so exactly one trigger is ever mounted - never both at once.
function useIsDesktop(breakpoint = 1024) {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= breakpoint : true
  );

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= breakpoint);
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);

  return isDesktop;
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

// ─── FILTER CHECKBOX ──────────────────────────────────────────────────────────
function FilterCheckbox({ label, count, checked, onChange, icon }) {
  return (
    <label className="filter-checkbox-row">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className={`checkbox-box${checked ? " checked" : ""}`}>
        {checked && <span className="checkbox-tick">✓</span>}
      </span>
      <span className="filter-checkbox-label">
        {icon && <span className="cat-icon">{icon}</span>}
        {label}
      </span>
      {count !== undefined && <span className="filter-checkbox-count">{count}</span>}
    </label>
  );
}

// ─── COLLAPSIBLE FILTER SECTION ───────────────────────────────────────────────
function FilterSection({ title, count, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="filter-section">
      <button
        className="filter-section-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="filter-section-title">
          {title}
          {count > 0 && <span className="filter-count-badge">{count}</span>}
        </span>
        <span className={`chevron${open ? " open" : ""}`}>›</span>
      </button>
      {open && <div className="filter-section-body">{children}</div>}
    </div>
  );
}

// ─── FILTER PANEL ─────────────────────────────────────────────────────────────
// Takes a static `categories` list (fetched once on the page, independent of
// the currently-filtered result set) so options never disappear from the
// list just because a filter narrowed the visible products.
function FilterPanel({ categories, localFilters, setLocalFilters, onClear, isOpen, onClose }) {
  const priceRanges = [
    { value: "0-499", label: "Under ₹499" },
    { value: "500-999", label: "₹500 – ₹999" },
    { value: "1000-1999", label: "₹1000 – ₹1999" },
    { value: "2000-3999", label: "₹2000 – ₹3999" },
  ];

  const ratingOptions = [
    { value: 4, label: "4★ & up" },
    { value: 3, label: "3★ & up" },
    { value: 2, label: "2★ & up" },
  ];

  const activeCount = [
    localFilters.categories.length,
    localFilters.priceRange ? 1 : 0,
    localFilters.minRating ? 1 : 0,
    localFilters.inStockOnly ? 1 : 0,
    localFilters.onSaleOnly ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const toggleCategory = (cat) =>
    setLocalFilters((p) => ({
      ...p,
      categories: p.categories.includes(cat)
        ? p.categories.filter((c) => c !== cat)
        : [...p.categories, cat],
    }));

  const togglePriceRange = (value) =>
    setLocalFilters((p) => ({
      ...p,
      priceRange: p.priceRange === value ? null : value,
    }));

  const toggleRating = (rating) =>
    setLocalFilters((p) => ({
      ...p,
      minRating: p.minRating === rating ? null : rating,
    }));

  // Prevent body scroll when filter drawer is open on mobile/tablet
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {isOpen && <div className="filter-backdrop" onClick={onClose} />}

      <aside className={`left-filters${isOpen ? " open" : ""}`} aria-label="Filters">
        <div className="filter-panel-header">
          <div className="filter-panel-title">
            <span>Filters</span>
            {activeCount > 0 && <span className="filter-total-badge">{activeCount}</span>}
          </div>
          <div className="filter-panel-actions">
            {activeCount > 0 && (
              <button className="clear-filters-link" onClick={onClear}>
                Clear all
              </button>
            )}
            <button className="filter-close-btn" onClick={onClose} aria-label="Close filters">
              ✕
            </button>
          </div>
        </div>

        {categories.length > 0 && (
          <FilterSection title="Category" count={localFilters.categories.length}>
            {categories.map((cat) => (
              <FilterCheckbox
                key={cat}
                label={cat}
                icon="📂"
                checked={localFilters.categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
            ))}
          </FilterSection>
        )}

        <FilterSection title="Price" count={localFilters.priceRange ? 1 : 0}>
          {priceRanges.map((range) => (
            <FilterCheckbox
              key={range.value}
              label={range.label}
              checked={localFilters.priceRange === range.value}
              onChange={() => togglePriceRange(range.value)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Minimum Rating" count={localFilters.minRating ? 1 : 0}>
          {ratingOptions.map((rating) => (
            <FilterCheckbox
              key={rating.value}
              label={rating.label}
              checked={localFilters.minRating === rating.value}
              onChange={() => toggleRating(rating.value)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Availability" count={(localFilters.inStockOnly ? 1 : 0) + (localFilters.onSaleOnly ? 1 : 0)}>
          <label className="filter-checkbox-row">
            <input
              type="checkbox"
              checked={localFilters.inStockOnly}
              onChange={() => setLocalFilters((p) => ({ ...p, inStockOnly: !p.inStockOnly }))}
              className="sr-only"
            />
            <span className={`checkbox-box${localFilters.inStockOnly ? " checked" : ""}`}>
              {localFilters.inStockOnly && <span className="checkbox-tick">✓</span>}
            </span>
            <span className="filter-checkbox-label">In stock only</span>
          </label>
          <label className="filter-checkbox-row">
            <input
              type="checkbox"
              checked={localFilters.onSaleOnly}
              onChange={() => setLocalFilters((p) => ({ ...p, onSaleOnly: !p.onSaleOnly }))}
              className="sr-only"
            />
            <span className={`checkbox-box${localFilters.onSaleOnly ? " checked" : ""}`}>
              {localFilters.onSaleOnly && <span className="checkbox-tick">✓</span>}
            </span>
            <span className="filter-checkbox-label">On sale</span>
          </label>
        </FilterSection>
      </aside>
    </>
  );
}

// ─── ACTIVE CHIPS ─────────────────────────────────────────────────────────────
function ActiveFilterChips({ localFilters, setLocalFilters }) {
  const priceLabels = {
    "0-499": "Under ₹499",
    "500-999": "₹500 – ₹999",
    "1000-1999": "₹1000 – ₹1999",
    "2000-3999": "₹2000 – ₹3999",
  };

  const chips = [
    ...localFilters.categories.map((cat) => ({
      key: `cat-${cat}`,
      label: cat,
      remove: () => setLocalFilters((p) => ({ ...p, categories: p.categories.filter((c) => c !== cat) })),
    })),
    ...(localFilters.priceRange ? [{
      key: "price",
      label: priceLabels[localFilters.priceRange] || localFilters.priceRange,
      remove: () => setLocalFilters((p) => ({ ...p, priceRange: null }))
    }] : []),
    ...(localFilters.minRating ? [{
      key: "rating",
      label: `${localFilters.minRating}★ & up`,
      remove: () => setLocalFilters((p) => ({ ...p, minRating: null }))
    }] : []),
    ...(localFilters.inStockOnly ? [{
      key: "stock",
      label: "In stock",
      remove: () => setLocalFilters((p) => ({ ...p, inStockOnly: false }))
    }] : []),
    ...(localFilters.onSaleOnly ? [{
      key: "sale",
      label: "On sale",
      remove: () => setLocalFilters((p) => ({ ...p, onSaleOnly: false }))
    }] : []),
  ];

  if (chips.length === 0) return null;

  return (
    <div className="collections-active-filters">
      <span className="active-filters-label">Active filters:</span>
      <div className="active-tags">
        {chips.map((chip) => (
          <button key={chip.key} className="active-tag" onClick={chip.remove}>
            {chip.label}
            <span className="tag-close" aria-hidden="true">×</span>
          </button>
        ))}
      </div>
      <button className="clear-all-btn" onClick={() => {
        setLocalFilters({
          categories: [],
          priceRange: null,
          minRating: null,
          inStockOnly: false,
          onSaleOnly: false,
        });
      }}>
        Clear all
      </button>
    </div>
  );
}

// ─── SORT DROPDOWN ────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const current = SORT_OPTIONS.find((o) => o.value === value) || SORT_OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div className="sort-dropdown" ref={rootRef}>
      <button
        type="button"
        className={`sort-trigger${open ? " open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{current.label}</span>
        <svg width={12} height={12} viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul className="sort-menu" role="listbox">
          {SORT_OPTIONS.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={`sort-option${opt.value === value ? " selected" : ""}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
              {opt.value === value && <span className="sort-check">✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const SLIDE_THEMES = [
  { eyebrow: "✦ Featured Collection" },
  { eyebrow: "⭐ Editor's Pick" },
  { eyebrow: "💄 Trending Now" },
];

function resolveImg(path) {
  const base = import.meta.env.VITE_API_URL || "";
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${base}${path}`;
}

// ─── DEFAULT FILTERS ──────────────────────────────────────────────────────────
const defaultFilters = {
  categories: [],
  priceRange: null,
  minRating: null,
  inStockOnly: false,
  onSaleOnly: false,
};

// ─── BANNER SECTION ───────────────────────────────────────────────────────────
function BannerSection() {
  const dispatch = useDispatch();
  const banners = useSelector(selectBanners);
  const active = useSelector(selectActiveBanner);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    dispatch(fetchBrandBanners());
  }, [dispatch]);

  useEffect(() => {
    if (!banners.length || paused) return;
    const t = setInterval(() => {
      dispatch(setActiveBanner((active + 1) % banners.length));
    }, 4500);
    return () => clearInterval(t);
  }, [active, banners.length, dispatch, paused]);

  if (!banners.length) return <BannerSkeleton />;

  return (
    <section
      className="banner-section"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Featured collections"
    >
      <div
        className="banner-track"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {banners.map((ban, i) => {
          const theme = SLIDE_THEMES[i % SLIDE_THEMES.length];
          return (
            <div key={ban._id} className="banner-slide" aria-hidden={i !== active}>
              <div className="banner-bg">
                <img
                  src={resolveImg(ban.image)}
                  alt={ban.title}
                  loading={i === 0 ? "eager" : "lazy"}
                />
                <div className="banner-overlay" />
              </div>
              <div className="banner-content">
                <span className="banner-eyebrow">{theme.eyebrow}</span>
                <h1 className="banner-headline">{ban.title}</h1>
                {ban.sub && <p className="banner-sub">{ban.sub}</p>}
                {ban.offer && <div className="banner-badge">{ban.offer}</div>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="banner-dots" role="tablist">
        {banners.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === active}
            className={`dot${i === active ? " active" : ""}`}
            onClick={() => dispatch(setActiveBanner(i))}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="banner-progress-wrap">
        <div
          key={active}
          className={`banner-progress${paused ? " paused" : ""}`}
          style={{ animationDuration: "4500ms" }}
        />
      </div>
    </section>
  );
}

function BannerSkeleton() {
  return <div className="banner-skeleton" aria-busy="true" aria-label="Loading banner" />;
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function CollectionsPage() {
  const dispatch = useDispatch();
  const { toast, showToast } = useToast();

  const status = useSelector(selectCollectionsStatus);
  const error = useSelector(selectError);
  const allCollections = useSelector(selectAllCollections);
  const isAuthenticated = useSelector((state) => Boolean(state.auth?.isAuthenticated && state.auth?.token));

  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(defaultFilters);
  const [sortBy, setSortByLocal] = useState("featured");
  const [allCategories, setAllCategories] = useState([]);

  const isDesktop = useIsDesktop(1024);

  useEffect(() => {
    if (isDesktop) setFilterPanelOpen(false);
  }, [isDesktop]);

  // Static category list for the filter panel, captured once from the first
  // unfiltered load so options never disappear once a filter narrows the
  // visible product set. Re-derives only if it's still empty by the time
  // collections arrive (e.g. categories endpoint isn't available).
  useEffect(() => {
    if (allCollections.length > 0 && allCategories.length === 0) {
      const cats = [...new Set(allCollections.map((c) => c.category).filter(Boolean))].sort();
      setAllCategories(cats);
    }
  }, [allCollections, allCategories.length]);

  // Wishlist is only fetched for logged-in users. Logged-out users simply
  // see an empty wishlist state (every heart renders unfilled) and clicking
  // any wishlist/cart action sends them to /login - see CollectionCard.
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    dispatch(fetchCollections({
      categories: localFilters.categories,
      priceRange: localFilters.priceRange,
      minRating: localFilters.minRating,
      inStockOnly: localFilters.inStockOnly,
      onSaleOnly: localFilters.onSaleOnly,
      sortBy,
    }));
  }, [dispatch, localFilters, sortBy]);

  const activeFilterCount = [
    localFilters.categories.length,
    localFilters.priceRange ? 1 : 0,
    localFilters.minRating ? 1 : 0,
    localFilters.inStockOnly ? 1 : 0,
    localFilters.onSaleOnly ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const handleClearFilters = () => {
    setLocalFilters(defaultFilters);
    setSortByLocal("featured");
  };

  const handleRetry = () => {
    dispatch(fetchCollections({
      categories: localFilters.categories,
      priceRange: localFilters.priceRange,
      minRating: localFilters.minRating,
      inStockOnly: localFilters.inStockOnly,
      onSaleOnly: localFilters.onSaleOnly,
      sortBy,
    }));
  };


  return (
    <>
      <BannerSection />
      <div className="collections-page-body">


        {/* ══ TOP BAR ══════════════════════════════════════════════════════════ */}
        <div className="collections-topbar">
          <div className="topbar-sidebar-cell">
            {!isDesktop && (
              <button
                className="mobile-filter-btn"
                onClick={() => setFilterPanelOpen(true)}
                aria-label="Open filters"
              >
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <line x1={4} y1={6} x2={20} y2={6} />
                  <line x1={8} y1={12} x2={16} y2={12} />
                  <line x1={11} y1={18} x2={13} y2={18} />
                </svg>
                Filters
                {activeFilterCount > 0 && (
                  <span className="mobile-filter-badge">{activeFilterCount}</span>
                )}
              </button>
            )}
            {/* On desktop, the sidebar's own FilterPanel header already shows
              "Filters" + the active count - nothing renders here to avoid a
              duplicate heading stacked above it. */}
          </div>

          <div className="topbar-main-cell">
            {status === "succeeded" && (
              <span className="topbar-count">
                {allCollections.length} result{allCollections.length !== 1 ? "s" : ""}
              </span>
            )}
            <SortDropdown value={sortBy} onChange={setSortByLocal} />
          </div>
        </div>

        {/* ══ ACTIVE FILTER CHIPS ══════════════════════════════════════════════ */}
        <ActiveFilterChips localFilters={localFilters} setLocalFilters={setLocalFilters} />

        {/* ══ LAYOUT ══════════════════════════════════════════════════════════ */}
        <div className="collections-layout">
          <FilterPanel
            categories={allCategories}
            localFilters={localFilters}
            setLocalFilters={setLocalFilters}
            onClear={handleClearFilters}
            isOpen={filterPanelOpen}
            onClose={() => setFilterPanelOpen(false)}
          />

          <main className="main">
            {status !== "loading" && (
              <div className="section-meta">
                <h2 className="section-title">All Collections</h2>
                <span className="section-count">
                  {allCollections.length} collection{allCollections.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}

            {status === "loading" && (
              <div className="grid" aria-label="Loading collections">
                {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {status === "failed" && (
              <div className="error-state">
                <div className="error-icon">✦</div>
                <h3 className="error-title">Something went wrong</h3>
                <p className="error-msg">{error || "Failed to load collections"}</p>
                <button className="retry-btn" onClick={handleRetry}>
                  Try Again
                </button>
              </div>
            )}

            {status === "succeeded" && (
              allCollections.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">◇</div>
                  <h3 className="empty-title">No collections match</h3>
                  <p className="empty-sub">Try adjusting or clearing your filters</p>
                  <button className="retry-btn" onClick={handleClearFilters}>Clear filters</button>
                </div>
              ) : (
                <div className="grid">
                  {allCollections.map((item) => (
                    <CollectionCard
                      key={item._id}
                      item={item}
                      onToast={showToast}
                      isAuthenticated={isAuthenticated}
                    />
                  ))}
                </div>
              )
            )}
          </main>
        </div>

        {/* <FeaturedProductsSection />
        <NewArrivalsSection /> */}

        {/* Toast */}
        <div
          className={`toast${toast.show ? " show" : ""}`}
          role="status"
          aria-live="polite"
        >
          <span className="toast-icon">
            {toast.type === "cart" ? "🛍️" : toast.type === "wishlist" ? "♥" : "✓"}
          </span>
          {toast.msg}
        </div>
      </div>
    </>
  );
}