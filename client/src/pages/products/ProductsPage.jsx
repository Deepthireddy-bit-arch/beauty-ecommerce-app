import React, { useEffect, useState } from 'react';
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

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: '↑ Price' },
  { value: 'price-high', label: '↓ Price' },
  { value: 'rating', label: '★ Rating' },
  { value: 'discount', label: '% Discount' },
];

const BRANDS = ['Maybelline', "L'Oreal", 'NYX', 'MAC'];
const DISC_OPTIONS = [10, 20, 30];

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { loading, error, searchQuery, selectedCategory, sortBy, page } =
    useSelector((s) => s.products);
  const products = useSelector((s) => s.products.items);
  const totalPages = useSelector((s) => s.products.totalPages);
  const categories = useSelector(selectCategories);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleItem = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const activeFilterCount =
    selectedBrands.length +
    selectedDiscounts.length +
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

  useEffect(() => {
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
  }, [searchQuery, selectedCategory, sortBy, page,
    selectedBrands, minPrice, maxPrice, selectedDiscounts]);

  return (
    <div className="pp-root">

      {/* ── Mobile filter toggle ── */}
      <button
        className="pp-mob-filter-btn"
        onClick={() => setSidebarOpen((o) => !o)}
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

      {/* ── Body: sidebar + main ──
          IMPORTANT: display:flex is set BOTH here (inline) and in CSS
          so it works even before the stylesheet loads. */}
      <div className="pp-body" style={{ display: 'flex', alignItems: 'flex-start' }}>

        {/* ════ SIDEBAR ════ */}
        <aside
          className={`pp-sidebar${sidebarOpen ? ' pp-sidebar--open' : ''}`}
          style={{
            width: 200,
            flexShrink: 0,
            background: '#fff',
            borderRight: '1px solid #e5e7eb',
            minHeight: '100vh',
            padding: '20px 16px',
          }}
        >
          {/* Header */}
          <div className="pp-sidebar-head">
            <span className="pp-sidebar-title">Filters</span>
            <button className="pp-clear-btn" onClick={clearAll}>Clear all</button>
          </div>

          {/* Brand */}
          <div className="pp-filter-group">
            <p className="pp-filter-label">Brand</p>
            {BRANDS.map((b) => (
              <label key={b} className="pp-check-row">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(b)}
                  onChange={() => {
                    toggleItem(selectedBrands, setSelectedBrands, b);
                    dispatch(setPage(1));
                  }}
                />
                <span>{b}</span>
              </label>
            ))}
          </div>

          {/* Price range */}
          <div className="pp-filter-group">
            <p className="pp-filter-label">Price range</p>
            <div className="pp-price-vals">
              <span>₹{minPrice}</span>
              <span>₹{maxPrice}</span>
            </div>
            <input type="range" className="pp-range"
              min={0} max={2000} step={100} value={minPrice}
              onChange={(e) => { setMinPrice(+e.target.value); dispatch(setPage(1)); }}
            />
            <input type="range" className="pp-range"
              min={0} max={2000} step={100} value={maxPrice}
              onChange={(e) => { setMaxPrice(+e.target.value); dispatch(setPage(1)); }}
            />
          </div>

          {/* Discount */}
          <div className="pp-filter-group">
            <p className="pp-filter-label">Discount</p>
            {DISC_OPTIONS.map((d) => (
              <label key={d} className="pp-check-row">
                <input
                  type="checkbox"
                  checked={selectedDiscounts.includes(d)}
                  onChange={() => {
                    toggleItem(selectedDiscounts, setSelectedDiscounts, d);
                    dispatch(setPage(1));
                  }}
                />
                <span>{d}% and above</span>
              </label>
            ))}
          </div>
        </aside>

        {/* ════ MAIN ════ */}
        <div
          className="pp-main"
          style={{ flex: 1, minWidth: 0, padding: '20px 20px 40px' }}
        >

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

          {/* Category tabs */}
          <div className="pp-cat-tabs">

            {['All', ...categories].map((cat) => (
              <button
                key={cat}
                className={`pp-cat-tab${selectedCategory === cat ? ' pp-cat-tab--active' : ''}`}
                onClick={() => { dispatch(setCategory(cat)); dispatch(setPage(1)); }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results count */}
          {!loading && !error && (
            <p className="pp-results-count">
              {products.length} Product{products.length !== 1 ? 's' : ''}
            </p>
          )}

          {/* Loading */}
          {loading && (
            <div className="pp-state">
              <div className="pp-spinner" />
              <p>Fetching products…</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="pp-state">
              <p className="pp-state-err">{error}</p>
              <button className="pp-retry-btn" onClick={() => dispatch(fetchProducts())}>
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && products.length === 0 && (
            <div className="pp-state">
              <div className="pp-empty-icon">✦</div>
              <h5>No products found</h5>
              <p>Try adjusting your filters or search.</p>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && products.length > 0 && (
            <div className="pp-grid">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pp-pagination">
              <button
                className="pp-page-btn"
                disabled={page === 1}
                onClick={() => dispatch(setPage(page - 1))}
              >‹</button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  className={`pp-page-btn${page === n ? ' pp-page-btn--active' : ''}`}
                  onClick={() => dispatch(setPage(n))}
                >
                  {n}
                </button>
              ))}

              <button
                className="pp-page-btn"
                disabled={page === totalPages}
                onClick={() => dispatch(setPage(page + 1))}
              >›</button>
            </div>
          )}

        </div>{/* /pp-main */}
      </div>{/* /pp-body */}
    </div>
  );
}