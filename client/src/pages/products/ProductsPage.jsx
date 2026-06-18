import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSearchQuery,
  setCategory,
  setSortBy,
  setPage,
} from '../../redux/slices/productSlice';
import { fetchProducts } from '../../redux/reducers/thunks/productThunks';
import { selectCategories } from '../../redux/registerUser/selectors/productSelectors';
import ProductCard from './ProductCard';
import './ProductsPage.css';
import BannerCarousel from '../../components/BannerCarousel';
import FeaturedProductsSection from '../../components/FeaturedProductsSection';
import { selectBanners, fetchBrandBanners, selectBrands, fetchBrands } from '../../redux/slices/brandpageSlice';
import { fetchWishlist } from '../../redux/reducers/thunks/wishlistActions';
import noDataImg from '../../assets/nodata.avif';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: '↑ Price' },
  { value: 'price-high', label: '↓ Price' },
  { value: 'rating', label: '★ Rating' },
  { value: 'discount', label: '% Discount' },
];

const DISC_OPTIONS = [
  { value: '10', label: '10% & above' },
  { value: '20', label: '20% & above' },
  { value: '30', label: '30% & above' },
];

// ========== TOAST HOOK ==========
function useToast() {
  const [toast, setToast] = useState({ msg: "", show: false, type: "default" });
  const showToast = useCallback((msg, type = "default") => {
    setToast({ msg, show: true, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2400);
  }, []);
  return { toast, showToast };
}

// ========== FILTER CHECKBOX ==========
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

// ========== COLLAPSIBLE FILTER SECTION ==========
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

// ========== SKELETON CARD ==========
function SkeletonCard() {
  return (
    <div className="pp-skeleton-card">
      <div className="pp-skeleton pp-skeleton-img" />
      <div className="pp-skeleton-body">
        <div className="pp-skeleton pp-skeleton-line pp-skeleton-line--short" />
        <div className="pp-skeleton pp-skeleton-line" />
        <div className="pp-skeleton pp-skeleton-line pp-skeleton-line--med" />
        <div className="pp-skeleton pp-skeleton-line pp-skeleton-line--short" />
        <div className="pp-skeleton pp-skeleton-btn" />
      </div>
    </div>
  );
}

// ========== BANNER SECTION ==========
function BannerSection() {
  const dispatch = useDispatch();
  const banners = useSelector(selectBanners);
  
  useEffect(() => {
    dispatch(fetchBrandBanners());
  }, [dispatch]);

  if (!banners.length) return null;
  
  return <BannerCarousel banners={banners} />;
}

// ========== ACTIVE FILTER CHIPS ==========
function ActiveFilterChips({ 
  selectedBrands, 
  setSelectedBrands, 
  minPrice, 
  setMinPrice, 
  maxPrice, 
  setMaxPrice, 
  selectedDiscounts, 
  setSelectedDiscounts,
  selectedCategory,
  setSelectedCategory,
  clearAll 
}) {
  const chips = [];

  // Category chip
  if (selectedCategory && selectedCategory !== 'All') {
    chips.push({
      key: 'category',
      label: selectedCategory,
      remove: () => setSelectedCategory('All')
    });
  }

  // Brand chips
  selectedBrands.forEach(brand => {
    chips.push({
      key: `brand-${brand}`,
      label: brand,
      remove: () => setSelectedBrands(selectedBrands.filter(b => b !== brand))
    });
  });

  // Price chip
  if (minPrice > 0 || maxPrice < 2000) {
    chips.push({
      key: 'price',
      label: `₹${minPrice} - ₹${maxPrice}`,
      remove: () => { setMinPrice(0); setMaxPrice(2000); }
    });
  }

  // Discount chips
  selectedDiscounts.forEach(discount => {
    chips.push({
      key: `disc-${discount}`,
      label: `${discount}% off`,
      remove: () => setSelectedDiscounts(selectedDiscounts.filter(d => d !== discount))
    });
  });

  if (chips.length === 0) return null;

  return (
    <div className="active-filters-bar">
      <span className="active-filters-label">Active filters:</span>
      <div className="active-tags">
        {chips.map((chip) => (
          <button key={chip.key} className="active-tag" onClick={chip.remove}>
            {chip.label}
            <span className="tag-close" aria-hidden="true">×</span>
          </button>
        ))}
      </div>
      <button className="clear-all-btn" onClick={clearAll}>
        Clear all
      </button>
    </div>
  );
}

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { toast, showToast } = useToast();

  const { loading, error, searchQuery, selectedCategory, sortBy, page } =
    useSelector((s) => s.products);
  const products = useSelector((s) => s.products.items);
  const totalPages = useSelector((s) => s.products.totalPages);
  const categories = useSelector(selectCategories);
  const brands = useSelector(selectBrands);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const activeFilterCount =
    selectedBrands.length +
    selectedDiscounts.length +
    (selectedCategory !== 'All' ? 1 : 0) +
    (minPrice > 0 || maxPrice < 2000 ? 1 : 0);

  const clearAll = () => {
    setSelectedBrands([]);
    setMinPrice(0);
    setMaxPrice(2000);
    setSelectedDiscounts([]);
    dispatch(setSearchQuery(''));
    dispatch(setCategory('All'));
    dispatch(setSortBy('featured'));
    dispatch(setPage(1));
  };

  // Update first load state
  useEffect(() => {
    if (!loading && products.length > 0) {
      setIsFirstLoad(false);
    }
  }, [loading, products]);

  // Fetch brands and wishlist on load
  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(fetchWishlist());
  }, [dispatch]);

  // Close sidebar on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // 🔴 FIXED: Fetch products when filters change
  useEffect(() => {
    console.log('🔄 Fetching products with filters:', {
      search: searchQuery,
      category: selectedCategory !== 'All' ? selectedCategory : '',
      brands: selectedBrands.join(','),
      priceRanges: minPrice > 0 || maxPrice < 2000 ? `${minPrice}-${maxPrice}` : '',
      discounts: selectedDiscounts.join(','),
      sortBy,
      page,
    });

    dispatch(fetchProducts({
      search: searchQuery,
      category: selectedCategory !== 'All' ? selectedCategory : '',
      brands: selectedBrands.join(','),
      priceRanges: minPrice > 0 || maxPrice < 2000 ? `${minPrice}-${maxPrice}` : '',
      discounts: selectedDiscounts.join(','),
      sortBy,
      page,
      limit: 12,
    }));
  }, [
    dispatch, 
    searchQuery, 
    selectedCategory, 
    sortBy, 
    page,
    // Convert arrays to strings for proper dependency comparison
    selectedBrands.join(','),
    minPrice,
    maxPrice,
    selectedDiscounts.join(',')
  ]);

  const showSkeletons = loading || (isFirstLoad && products.length === 0);

  return (
    <div className="pp-root">

      {/* ── BANNER ── */}
      <BannerSection />

      {/* ── Mobile filter toggle ── */}
      <button
        className="pp-mob-filter-btn"
        onClick={() => setSidebarOpen((o) => !o)}
        aria-label="Toggle filters"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="7" y1="12" x2="17" y2="12" />
          <line x1="10" y1="18" x2="14" y2="18" />
        </svg>
        Filters
        {activeFilterCount > 0 && (
          <span className="pp-mob-badge">{activeFilterCount}</span>
        )}
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="pp-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Body: sidebar + main ── */}
      <div className="pp-body">

        {/* ════ SIDEBAR - Premium Design ════ */}
        <aside className={`pp-sidebar${sidebarOpen ? ' pp-sidebar--open' : ''}`}>

          {/* Mobile close button */}
          <button
            className="pp-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close filters"
          >✕</button>

          {/* Header */}
          <div className="filter-panel-header">
            <div className="filter-panel-title">
              <span>Filters</span>
              {activeFilterCount > 0 && <span className="filter-total-badge">{activeFilterCount}</span>}
            </div>
            <div className="filter-panel-actions">
              {activeFilterCount > 0 && (
                <button className="clear-filters-link" onClick={clearAll}>
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* ── Category Section ── */}
          <FilterSection title="Category" count={selectedCategory !== 'All' ? 1 : 0}>
            {['All', ...categories].map((cat) => (
              <FilterCheckbox
                key={cat}
                label={cat}
                icon={cat !== 'All' ? "📂" : "📋"}
                checked={selectedCategory === cat}
                onChange={() => { dispatch(setCategory(cat)); dispatch(setPage(1)); }}
              />
            ))}
          </FilterSection>

          {/* ── Brand Section - From API ── */}
          <FilterSection title="Brand" count={selectedBrands.length}>
            {brands.map((brand) => (
              <FilterCheckbox
                key={brand._id}
                label={brand.name}
                count={brand.count}
                icon="🏷️"
                checked={selectedBrands.includes(brand.name)}
                onChange={() => {
                  setSelectedBrands(
                    selectedBrands.includes(brand.name)
                      ? selectedBrands.filter(b => b !== brand.name)
                      : [...selectedBrands, brand.name]
                  );
                  dispatch(setPage(1));
                }}
              />
            ))}
          </FilterSection>

          {/* ── Price Section ── */}
          <FilterSection title="Price" count={minPrice > 0 || maxPrice < 2000 ? 1 : 0}>
            <div className="pp-price-range-group">
              <div className="pp-price-vals">
                <span>₹{minPrice}</span>
                <span>₹{maxPrice}</span>
              </div>
              <input 
                type="range" 
                className="pp-range"
                min={0} 
                max={2000} 
                step={100} 
                value={minPrice}
                onChange={(e) => { setMinPrice(+e.target.value); dispatch(setPage(1)); }}
              />
              <input 
                type="range" 
                className="pp-range"
                min={0} 
                max={2000} 
                step={100} 
                value={maxPrice}
                onChange={(e) => { setMaxPrice(+e.target.value); dispatch(setPage(1)); }}
              />
              <div className="pp-price-labels">
                <span>₹0</span>
                <span>₹2000</span>
              </div>
            </div>
          </FilterSection>

          {/* ── Discount Section ── */}
          <FilterSection title="Discount" count={selectedDiscounts.length}>
            {DISC_OPTIONS.map((d) => (
              <FilterCheckbox
                key={d.value}
                label={d.label}
                icon="🔥"
                checked={selectedDiscounts.includes(d.value)}
                onChange={() => {
                  setSelectedDiscounts(
                    selectedDiscounts.includes(d.value)
                      ? selectedDiscounts.filter(disc => disc !== d.value)
                      : [...selectedDiscounts, d.value]
                  );
                  dispatch(setPage(1));
                }}
              />
            ))}
          </FilterSection>

          {/* Apply button (mobile) */}
          <button
            className="pp-sidebar-apply"
            onClick={() => setSidebarOpen(false)}
          >
            Apply Filters ({activeFilterCount} active)
          </button>
        </aside>

        {/* ════ MAIN ════ */}
        <div className="pp-main">

          {/* Top bar: search + sort pills */}
          <div className="pp-topbar">
            <div className="pp-search">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  dispatch(setSearchQuery(e.target.value));
                  dispatch(setPage(1));
                }}
              />
            </div>

            <div className="pp-sort-pills">
              {SORT_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  className={`pp-sort-pill${sortBy === value ? ' pp-sort-pill--active' : ''}`}
                  onClick={() => { dispatch(setSortBy(value)); dispatch(setPage(1)); }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── ACTIVE FILTER CHIPS ── */}
          <ActiveFilterChips
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            selectedDiscounts={selectedDiscounts}
            setSelectedDiscounts={setSelectedDiscounts}
            selectedCategory={selectedCategory}
            setSelectedCategory={(cat) => { dispatch(setCategory(cat)); dispatch(setPage(1)); }}
            clearAll={clearAll}
          />

          {/* Results count */}
          {!showSkeletons && !error && products.length > 0 && (
            <p className="pp-results-count">
              {products.length} Product{products.length !== 1 ? 's' : ''}
            </p>
          )}

          {/* ── SKELETON LOADER ── */}
          {showSkeletons && (
            <div className="pp-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* ── Error ── */}
          {!showSkeletons && error && (
            <div className="pp-state">
              <div className="pp-state-icon pp-state-icon--error">⚠</div>
              <h5>Something went wrong</h5>
              <p className="pp-state-err">{error}</p>
              <button className="pp-retry-btn" onClick={() => dispatch(fetchProducts())}>
                Try Again
              </button>
            </div>
          )}

          {/* ── Empty / No data ── */}
          {!showSkeletons && !error && products.length === 0 && (
            <div className="pp-state pp-state--nodata">
              <img
                src={noDataImg}
                alt="No products found"
                className="pp-nodata-img"
              />
              <h5>No products found</h5>
              <p>Try adjusting your filters or search term.</p>
              <button className="pp-retry-btn" onClick={clearAll}>
                Clear Filters
              </button>
            </div>
          )}

          {/* ── Grid ── */}
          {!showSkeletons && !error && products.length > 0 && (
            <div className="pp-grid">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} onToast={showToast} />
              ))}
            </div>
          )}

          {/* ── Pagination ── */}
          {!showSkeletons && totalPages > 1 && (
            <div className="pp-pagination">
              <button
                className="pp-page-btn"
                disabled={page === 1}
                onClick={() => dispatch(setPage(page - 1))}
                aria-label="Previous page"
              >‹</button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  className={`pp-page-btn${page === n ? ' pp-page-btn--active' : ''}`}
                  onClick={() => dispatch(setPage(n))}
                  aria-current={page === n ? 'page' : undefined}
                >
                  {n}
                </button>
              ))}

              <button
                className="pp-page-btn"
                disabled={page === totalPages}
                onClick={() => dispatch(setPage(page + 1))}
                aria-label="Next page"
              >›</button>
            </div>
          )}

        </div>{/* /pp-main */}
      </div>{/* /pp-body */}

      <FeaturedProductsSection />

      {/* ── Toast ── */}
      <div
        className={`toast-notification${toast.show ? " visible" : ""} toast--${toast.type}`}
        role="status"
        aria-live="polite"
      >
        <span className="toast-icon">
          {toast.type === "cart" ? "🛍️" : toast.type === "wishlist" ? "♥" : "✓"}
        </span>
        {toast.msg}
      </div>
    </div>
  );
}