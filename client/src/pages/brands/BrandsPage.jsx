import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchBrandBanners,
  fetchBrands,
  fetchBrandProducts,
  togglePriceRange,
  toggleCategory,
  toggleDiscount,
  toggleBrandFilter,
  setSortBy,
  setPage,
  clearAllFilters,
  setActiveBanner,
  toggleWishlist,
  selectBanners,
  selectBrands,
  selectFilters,
  selectWishlist,
  selectActiveBanner,
  selectProductsStatus,
  selectProducts,
  selectPagination,
} from "../../redux/slices/brandpageSlice";
import "./Brands.css";

// ─── TOAST ───────────────────────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState({ msg: "", show: false });
  const showToast = useCallback((msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2200);
  }, []);
  return { toast, showToast };
}

// ─── STARS ───────────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <span className="stars" aria-label={`${rating} stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(rating) ? "star filled" : "star"}>★</span>
      ))}
    </span>
  );
}

// ─── BANNER ──────────────────────────────────────────────────────────────────
function BannerSection() {
  const dispatch = useDispatch();
  const banners  = useSelector(selectBanners);
  const active   = useSelector(selectActiveBanner);

  useEffect(() => {
    if (!banners.length) return;
    const t = setInterval(() => {
      dispatch(setActiveBanner((active + 1) % banners.length));
    }, 4000);
    return () => clearInterval(t);
  }, [active, banners.length, dispatch]);

  if (!banners.length) return <div className="banner-skeleton" />;

  return (
    <div className="banner-section">
      {banners.map((ban, i) => (
        <div key={ban._id} className={`banner-slide${i === active ? " active" : ""}`}>
          <div className="banner-img-wrap">
            <img src={ban.image} alt={ban.title} />
            <div className="banner-overlay" />
          </div>
        </div>
      ))}
      <div className="banner-dots">
        {banners.map((_, i) => (
          <button
            key={i}
            className={`dot${i === active ? " active" : ""}`}
            onClick={() => dispatch(setActiveBanner(i))}
            aria-label={`Go to banner ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── BRAND PILLS ─────────────────────────────────────────────────────────────
function BrandPills() {
  const brands   = useSelector(selectBrands);
  const filters  = useSelector(selectFilters);
  const dispatch = useDispatch();

  return (
    <div className="brand-pills-row">
      <span className="brand-pills-label">Brands:</span>
      <div className="brand-pills">
        {brands.map((b) => (
          <button
            key={b._id}
            className={`brand-pill${filters.brands.includes(b._id) ? " active" : ""}`}
            onClick={() => dispatch(toggleBrandFilter(b._id))}
          >
            {b.name}
            <span className="pill-count">{b.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── ACTIVE FILTER TAGS ───────────────────────────────────────────────────────
const PRICE_LABELS = {
  "0-499":     "Rs. 0 – Rs. 499",
  "500-999":   "Rs. 500 – Rs. 999",
  "1000-1999": "Rs. 1000 – Rs. 1999",
  "2000-3999": "Rs. 2000 – Rs. 3999",
};
const DISCOUNT_LABELS = { "10": "10%+", "20": "20%+", "30": "30%+" };

function ActiveFilterTags() {
  const dispatch = useDispatch();
  const filters  = useSelector(selectFilters);
  const brands   = useSelector(selectBrands);

  const allTags = [
    ...filters.priceRanges.map((v) => ({ label: PRICE_LABELS[v] || v,              remove: () => dispatch(togglePriceRange(v)) })),
    ...filters.categories.map((v)  => ({ label: v.charAt(0).toUpperCase() + v.slice(1), remove: () => dispatch(toggleCategory(v)) })),
    ...filters.discounts.map((v)   => ({ label: DISCOUNT_LABELS[v] || v + "%+",    remove: () => dispatch(toggleDiscount(v)) })),
    ...filters.brands.map((v)      => ({ label: brands.find(b => b._id === v)?.name || v, remove: () => dispatch(toggleBrandFilter(v)) })),
  ];

  if (!allTags.length) return null;

  return (
    <div className="active-filters">
      <span className="active-filters-title">Filters Applied</span>
      <button className="clear-all" onClick={() => dispatch(clearAllFilters())}>Clear All</button>
      <div className="active-tags">
        {allTags.map((tag, i) => (
          <button key={i} className="active-tag" onClick={tag.remove}>
            {tag.label} <span>×</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── FILTER CHECKBOX ─────────────────────────────────────────────────────────
function FilterCheckbox({ label, count, checked, onChange }) {
  return (
    <label className="filter-row">
      <span className="filter-row-left">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="filter-label">{label}</span>
      </span>
      {count !== undefined && <span className="filter-count">{count}</span>}
    </label>
  );
}

// ─── FILTER SECTION ───────────────────────────────────────────────────────────
function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="filter-section">
      <button className="filter-section-header" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span className={`chevron${open ? " up" : ""}`}>›</span>
      </button>
      {open && <div className="filter-section-body">{children}</div>}
    </div>
  );
}

// ─── LEFT FILTERS ─────────────────────────────────────────────────────────────
const PRICE_RANGES = [
  { value: "0-499",     label: "Rs. 0 – Rs. 499" },
  { value: "500-999",   label: "Rs. 500 – Rs. 999" },
  { value: "1000-1999", label: "Rs. 1000 – Rs. 1999" },
  { value: "2000-3999", label: "Rs. 2000 – Rs. 3999" },
];

// ── FIXED: values now match actual `category` field in DB ("makeup", "skincare", etc.)
//    Update this list to match whatever distinct category values exist in your products collection
const CATEGORIES = [
  { value: "makeup",    label: "Makeup" },
  { value: "skincare",  label: "Skincare" },
  { value: "haircare",  label: "Haircare" },
  { value: "fragrance", label: "Fragrance" },
];

const DISCOUNTS = [
  { value: "10", label: "10% and Above" },
  { value: "20", label: "20% and Above" },
  { value: "30", label: "30% and Above" },
];

function LeftFilters() {
  const dispatch = useDispatch();
  const filters  = useSelector(selectFilters);
  const brands   = useSelector(selectBrands);
  const total    = filters.priceRanges.length + filters.categories.length
                 + filters.discounts.length   + filters.brands.length;

  return (
    <aside className="left-filters">
      <div className="filter-header">
        <span className="filter-title">Filters</span>
        {total > 0 && (
          <button className="clear-link" onClick={() => dispatch(clearAllFilters())}>
            Clear All
          </button>
        )}
      </div>

      <FilterSection title={`Price${filters.priceRanges.length ? ` (${filters.priceRanges.length})` : ""}`}>
        {PRICE_RANGES.map((r) => (
          <FilterCheckbox
            key={r.value}
            label={r.label}
            checked={filters.priceRanges.includes(r.value)}
            onChange={() => dispatch(togglePriceRange(r.value))}
          />
        ))}
      </FilterSection>

      <FilterSection title={`Category${filters.categories.length ? ` (${filters.categories.length})` : ""}`}>
        {CATEGORIES.map((c) => (
          <FilterCheckbox
            key={c.value}
            label={c.label}
            checked={filters.categories.includes(c.value)}
            onChange={() => dispatch(toggleCategory(c.value))}
          />
        ))}
      </FilterSection>

      <FilterSection title={`Brand${filters.brands.length ? ` (${filters.brands.length})` : ""}`}>
        {brands.map((b) => (
          <FilterCheckbox
            key={b._id}
            label={b.name}
            count={b.count}
            checked={filters.brands.includes(b._id)}
            onChange={() => dispatch(toggleBrandFilter(b._id))}
          />
        ))}
      </FilterSection>

      <FilterSection title={`Discount${filters.discounts.length ? ` (${filters.discounts.length})` : ""}`}>
        {DISCOUNTS.map((d) => (
          <FilterCheckbox
            key={d.value}
            label={d.label}
            checked={filters.discounts.includes(d.value)}
            onChange={() => dispatch(toggleDiscount(d.value))}
          />
        ))}
      </FilterSection>
    </aside>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ item, onToast }) {
  const dispatch = useDispatch();
  const liked    = useSelector(selectWishlist)[item._id];

  return (
    <div className="product-card">
      {/* FIXED: was item.bestseller — DB field is isBestseller */}
      {item.isBestseller && <div className="bestseller-badge">BESTSELLER</div>}

      <div className="product-img-wrap">
        {/* FIXED: was item.image — DB field is images[] (array) */}
        <img src={item.images?.[0]} alt={item.name} loading="lazy" />
        <button
          className={`wish-btn${liked ? " active" : ""}`}
          onClick={() => {
            dispatch(toggleWishlist(item._id));
            onToast(liked ? "Removed from wishlist" : "Added to wishlist ♥");
          }}
          aria-label="Wishlist"
        >
          {liked ? "♥" : "♡"}
        </button>
        <button className="quick-add" onClick={() => onToast(`Added to cart: ${item.name}`)}>
          + Quick Add
        </button>
      </div>

      <div className="product-body">
        <div className="product-tag">{item.tag}</div>
        <h3 className="product-name">{item.brand} {item.name}</h3>
        <div className="product-price-row">
          <span className="product-price">₹{item.price}</span>
          {/* FIXED: was item.mrp — DB field is originalPrice */}
          <span className="product-mrp">₹{item.originalPrice}</span>
          <span className="product-discount">{item.discount}% Off</span>
        </div>
        <div className="product-rating-row">
          <Stars rating={item.rating} />
          <span className="product-reviews">({item.reviews.toLocaleString()})</span>
        </div>
        {item.shades > 1 && <div className="product-shades">{item.shades} Shades</div>}
      </div>
    </div>
  );
}

// ─── PRODUCT SKELETON ─────────────────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="product-skeleton">
      <div className="ps-img" />
      <div className="ps-body">
        <div className="ps-line short" />
        <div className="ps-line" />
        <div className="ps-line med" />
        <div className="ps-line short" />
      </div>
    </div>
  );
}

// ─── RESULTS BAR ──────────────────────────────────────────────────────────────
function ResultsBar({ total }) {
  const dispatch = useDispatch();
  const filters  = useSelector(selectFilters);

  return (
    <div className="results-bar">
      <span className="results-count">{total} Products</span>
      <div className="sort-wrap">
        <span className="sort-label">Sort By :</span>
        <select
          className="sort-select"
          value={filters.sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value))}
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="discount">Best Discount</option>
        </select>
      </div>
    </div>
  );
}

// ─── PAGINATION ───────────────────────────────────────────────────────────────
function Pagination() {
  const dispatch   = useDispatch();
  const filters    = useSelector(selectFilters);
  const pagination = useSelector(selectPagination);

  if (!pagination?.pages || pagination.pages <= 1) return null;

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 36 }}>
      {Array.from({ length: pagination.pages }).map((_, i) => (
        <button
          key={i}
          onClick={() => dispatch(setPage(i + 1))}
          style={{
            width: 36, height: 36,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            background: filters.page === i + 1 ? "#7c3aed" : "#fff",
            color:      filters.page === i + 1 ? "#fff"    : "#333",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function BrandsPage() {
  const dispatch = useDispatch();
  const { toast, showToast } = useToast();

  const filters    = useSelector(selectFilters);
  const status     = useSelector(selectProductsStatus);
  const products   = useSelector(selectProducts);
  const pagination = useSelector(selectPagination);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const totalActive =
    filters.priceRanges.length + filters.categories.length +
    filters.discounts.length   + filters.brands.length;

  // ── Initial data load
  useEffect(() => {
    dispatch(fetchBrandBanners());
    dispatch(fetchBrands());
  }, [dispatch]);

  // ── Re-fetch products on every filter / sort / page change
  useEffect(() => {
    dispatch(fetchBrandProducts(filters));
  }, [
    dispatch,
    filters.brands.join(),
    filters.categories.join(),
    filters.priceRanges.join(),
    filters.discounts.join(),
    filters.sortBy,
    filters.page,
  ]);

  return (
    <div className="brands-page">

      {/* BANNER */}
      <BannerSection />

      {/* BRAND PILLS */}
      <BrandPills />

      {/* ACTIVE FILTER TAGS */}
      {totalActive > 0 && <ActiveFilterTags />}

      {/* BODY */}
      <div className="page-body">

        <button
          className="mobile-filter-toggle"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        >
          ⚙ Filters {totalActive ? `(${totalActive})` : ""}
        </button>

        <div className={`sidebar-wrap${mobileFiltersOpen ? " open" : ""}`}>
          <LeftFilters />
        </div>

        <div className="products-panel">
          <ResultsBar total={pagination?.total ?? products.length} />

          <div className="products-grid">
            {status === "loading"
              ? [1,2,3,4,5,6].map((i) => <ProductSkeleton key={i} />)
              : status === "failed"
              ? (
                <div className="error-state" style={{ gridColumn: "1/-1" }}>
                  <p>Failed to load products.</p>
                  <button onClick={() => dispatch(fetchBrandProducts(filters))}>Retry</button>
                </div>
              )
              : products.length === 0
              ? (
                <div className="empty-state" style={{ gridColumn: "1/-1" }}>
                  <div className="empty-icon">✦</div>
                  <h3>No products match your filters</h3>
                  <button onClick={() => dispatch(clearAllFilters())}>Clear Filters</button>
                </div>
              )
              : products.map((item) => (
                  <ProductCard key={item._id} item={item} onToast={showToast} />
                ))
            }
          </div>

          <Pagination />
        </div>
      </div>

      {/* TOAST */}
      <div className={`toast${toast.show ? " show" : ""}`}>{toast.msg}</div>
    </div>
  );
}