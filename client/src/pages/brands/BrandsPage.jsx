import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  selectCategories,
  fetchCategories,
} from "../../redux/slices/brandpageSlice";
import "./Brands.css";
import { addToCartAsync } from "../../redux/reducers/thunks/cartThunks";
import { addToWishlist, removeFromWishlist, fetchWishlist } from "../../redux/reducers/thunks/wishlistActions";

// ─── UTILS ────────────────────────────────────────────────────────────────────
function resolveImg(path) {
  const base = import.meta.env.VITE_API_URL || "";
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${base}${path}`;
}

// ─── TOAST HOOK ───────────────────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState({ msg: "", show: false, type: "default" });
  const showToast = useCallback((msg, type = "default") => {
    setToast({ msg, show: true, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2400);
  }, []);
  return { toast, showToast };
}

// ─── CONSTANTS ─────────────────────────────────────────────────────────────────
const SLIDE_THEMES = [
  { eyebrow: "✦ Featured Collection", btnColor: "#4c1d95" },
  { eyebrow: "⭐ Editor's Pick", btnColor: "#0c4a6e" },
  { eyebrow: "💄 Trending Now", btnColor: "#9d174d" },
];

const PRICE_RANGES = [
  { value: "0-499", label: "Under ₹499" },
  { value: "500-999", label: "₹500 – ₹999" },
  { value: "1000-1999", label: "₹1000 – ₹1999" },
  { value: "2000-3999", label: "₹2000 – ₹3999" },
];

const PRICE_LABELS = {
  "0-499": "Under ₹499", "500-999": "₹500–₹999",
  "1000-1999": "₹1000–₹1999", "2000-3999": "₹2000–₹3999",
};

const DISCOUNTS = [
  { value: "10", label: "10% & above" },
  { value: "20", label: "20% & above" },
  { value: "30", label: "30% & above" },
];

const DISCOUNT_LABELS = { "10": "10%+", "20": "20%+", "30": "30%+" };

const VIEW_MODES = ["grid", "list"];

// ─── STARS ────────────────────────────────────────────────────────────────────
function Stars({ rating }) {
  const r = Math.round(rating * 2) / 2;
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={s <= r ? "star filled" : r === s - 0.5 ? "star half" : "star"}
        >★</span>
      ))}
    </span>
  );
}

// ─── BANNER SECTION ───────────────────────────────────────────────────────────
function BannerSection() {
  const dispatch = useDispatch();
  const banners = useSelector(selectBanners);
  const active = useSelector(selectActiveBanner);
  const [paused, setPaused] = useState(false);

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
                {ban.offer && (
                  <div className="banner-badge">{ban.offer}</div>
                )}
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
// ─── BRAND HIGHLIGHTS SECTION ────────────────────────────────────────────────
function BrandHighlights() {
  const brands = useSelector(selectBrands);
  const filters = useSelector(selectFilters);
  const dispatch = useDispatch();
 const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [activeCard, setActiveCard] = useState(null);
  const autoRef = useRef(null);
  const trackRef = useRef(null);

  // Responsive: cards per page
  const getCardsPerPage = () => {
    const w = window.innerWidth;
    if (w <= 479) return 2;
    if (w <= 767) return 3;
    if (w <= 1023) return 4;
    if (w <= 1159) return 5;
    return 6;
  };
  const [cardsPerPage, setCardsPerPage] = useState(getCardsPerPage());

  useEffect(() => {
    const onResize = () => setCardsPerPage(getCardsPerPage());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const totalPages = Math.ceil(brands.length / cardsPerPage);

  const goTo = useCallback((p) => {
    setPage((p + totalPages) % totalPages);
  }, [totalPages]);

  const resetTimer = useCallback(() => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => goTo(page + 1), 3200);
  }, [goTo, page]);

  useEffect(() => {
    if (!brands.length) return;
    autoRef.current = setInterval(() => setPage((p) => (p + 1) % totalPages), 3200);
    return () => clearInterval(autoRef.current);
  }, [brands.length, totalPages]);

  const handleArrow = (dir) => {
    clearInterval(autoRef.current);
    setPage((p) => (p + dir + totalPages) % totalPages);
    autoRef.current = setInterval(() => setPage((p) => (p + 1) % totalPages), 3200);
  };

  const handleDot = (i) => {
    clearInterval(autoRef.current);
    setPage(i);
    autoRef.current = setInterval(() => setPage((p) => (p + 1) % totalPages), 3200);
  };

  const getMonogram = (name) =>
    name.replace(/'/g, "").trim().split(/\s+/).slice(0, 2)
      .map((w) => w[0].toUpperCase()).join("");

  if (!brands.length) return null;

  const offset = -(page * cardsPerPage * (100 / brands.length));

  return (
    <div className="bstrip-wrap">
      <div className="bstrip-header">
        <div className="bstrip-header-left">
          <span className="bstrip-title">Shop by Brand</span>
          <span className="bstrip-brand-count">{brands.length} brands</span>
        </div>
        <button className="bstrip-viewall" onClick={() => dispatch(clearAllFilters())}>
          View all ›
        </button>
      </div>

      <div className="bstrip-outer">
        <button
          className={`bstrip-arrow left${page === 0 ? " hidden" : ""}`}
          onClick={() => handleArrow(-1)}
          aria-label="Previous brands"
        >‹</button>

        <div className="bstrip-track-wrap">
          <div
            className="bstrip-track"
            ref={trackRef}
            style={{ transform: `translateX(${offset}%)` }}
          >
            {brands.map((b, i) => {
              const isActive = activeCard === i || filters.brands.includes(b._id);
              const mono = getMonogram(b.name);
              return (
                <button
                  key={b._id}
                  className={`bstrip-card${isActive ? " active" : ""}`}
                  onClick={() => {
                    // setActiveCard(i);
                    // dispatch(toggleBrandFilter(b._id));
                       navigate(`/brands/${b._id}`);
                  }}
                  aria-label={`Filter by ${b.name}`}
                  aria-pressed={isActive}
                >
                  <div className="bstrip-img-wrap">
                    <img
                      src={resolveImg(b.logo)}
                      alt={b.name}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div className="bstrip-img-fallback" style={{ display: "none" }}>
                      {mono}
                    </div>
                  </div>
                  <div className="bstrip-name">{b.name}</div>
                  {b.sub && <div className="bstrip-sub-label">{b.sub}</div>}
                  <div className="bstrip-active-bar" />
                </button>
              );
            })}
          </div>
        </div>

        <button
          className={`bstrip-arrow right${page >= totalPages - 1 ? " hidden" : ""}`}
          onClick={() => handleArrow(1)}
          aria-label="Next brands"
        >›</button>
      </div>

      <div className="bstrip-dots">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            className={`bstrip-dot${i === page ? " active" : ""}`}
            onClick={() => handleDot(i)}
            aria-label={`Brand page ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function BannerSkeleton() {
  return <div className="banner-skeleton" aria-busy="true" aria-label="Loading banner" />;
}

// ─── BRAND PILLS ──────────────────────────────────────────────────────────────
function BrandPills() {
  const brands = useSelector(selectBrands);
  const filters = useSelector(selectFilters);
  const dispatch = useDispatch();
  const rowRef = useRef(null);

  const scroll = (dir) => {
    rowRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
  };

  if (!brands.length) return <BrandPillsSkeleton />;

  return (
    <div className="brand-pills-section">
      <button className="pills-scroll-btn left" onClick={() => scroll(-1)} aria-label="Scroll left">‹</button>
      <div className="brand-pills-row" ref={rowRef}>
        <span className="brand-pills-label">Brands</span>
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
      <button className="pills-scroll-btn right" onClick={() => scroll(1)} aria-label="Scroll right">›</button>
    </div>
  );
}

function BrandPillsSkeleton() {
  return (
    <div className="brand-pills-section">
      <div className="brand-pills-row">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="pill-skeleton shimmer" />
        ))}
      </div>
    </div>
  );
}

// ─── ACTIVE FILTER TAGS ───────────────────────────────────────────────────────
function ActiveFilterTags() {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);

  const allTags = [
    ...filters.priceRanges.map((v) => ({
      label: PRICE_LABELS[v] || v,
      key: `price-${v}`,
      remove: () => dispatch(togglePriceRange(v)),
    })),
    ...filters.categories.map((v) => ({
      label: categories.find((c) => c === v || c._id === v || c.id === v)?.name || v,
      key: `cat-${v}`,
      remove: () => dispatch(toggleCategory(v)),
    })),
    ...filters.discounts.map((v) => ({
      label: `${DISCOUNT_LABELS[v]} off`,
      key: `disc-${v}`,
      remove: () => dispatch(toggleDiscount(v)),
    })),
    ...filters.brands.map((v) => ({
      label: brands.find((b) => b._id === v)?.name || v,
      key: `brand-${v}`,
      remove: () => dispatch(toggleBrandFilter(v)),
    })),
  ];

  if (!allTags.length) return null;

  return (
    <div className="active-filters-bar">
      <span className="active-filters-label">Active filters:</span>
      <div className="active-tags">
        {allTags.map((tag) => (
          <button key={tag.key} className="active-tag" onClick={tag.remove}>
            {tag.label}
            <span className="tag-close" aria-hidden="true">×</span>
          </button>
        ))}
      </div>
      <button className="clear-all-btn" onClick={() => dispatch(clearAllFilters())}>
        Clear all
      </button>
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

// ─── LEFT SIDEBAR FILTERS ─────────────────────────────────────────────────────
function LeftFilters({ onClose }) {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const total =
    filters.priceRanges.length + filters.categories.length +
    filters.discounts.length + filters.brands.length;

  return (
    <aside className="left-filters">
      <div className="filter-panel-header">
        <div className="filter-panel-title">
          <span>Filters</span>
          {total > 0 && <span className="filter-total-badge">{total}</span>}
        </div>
        <div className="filter-panel-actions">
          {total > 0 && (
            <button className="clear-filters-link" onClick={() => dispatch(clearAllFilters())}>
              Clear all
            </button>
          )}
          {onClose && (
            <button className="filter-close-btn" onClick={onClose} aria-label="Close filters">
              ✕
            </button>
          )}
        </div>
      </div>

      <FilterSection title="Price" count={filters.priceRanges.length}>
        {PRICE_RANGES.map((r) => (
          <FilterCheckbox
            key={r.value}
            label={r.label}
            checked={filters.priceRanges.includes(r.value)}
            onChange={() => dispatch(togglePriceRange(r.value))}
          />
        ))}
      </FilterSection>

      {/* Categories from API - like brands */}
      <FilterSection title="Category" count={filters.categories.length}>
        {categories.map((category) => (
          <FilterCheckbox
            key={category._id || category.id || category}
            label={category.name || category}
            icon={category.icon || "📂"}
            count={category.count}
            checked={filters.categories.includes(category._id || category.id || category)}
            onChange={() => dispatch(toggleCategory(category._id || category.id || category))}
          />
        ))}
      </FilterSection>

      {/* Brands from API */}
      <FilterSection title="Brand" count={filters.brands.length} defaultOpen={brands.length <= 8}>
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

      <FilterSection title="Discount" count={filters.discounts.length}>
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

// src/components/Brands/ProductCardGrid.js (or inside your Brands.js file)
function ProductCardGrid({ item, onToast }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated } = useSelector((state) => state.login);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  
  // Check if product is in wishlist
  const liked = wishlistItems.some((wishlistItem) => {
    if (!wishlistItem?.product) return false;
    return wishlistItem.product._id === item._id;
  });

  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  const imgSrc = resolveImg(item.images?.[0]);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setIsAddingToCart(true);
    try {
      await dispatch(addToCartAsync({ productId: item._id, quantity: 1 })).unwrap();
      onToast(`Added ${item.name} to cart 🛍️`, "cart");
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setIsTogglingWishlist(true);
    try {
      if (liked) {
        await dispatch(removeFromWishlist(item._id)).unwrap();
        onToast(`Removed ${item.name} from wishlist`, "wishlist");
      } else {
        await dispatch(addToWishlist(item._id)).unwrap();
        onToast(`Added ${item.name} to wishlist ♥`, "wishlist");
      }
    } catch (error) {
      console.log("Wishlist error:", error);
      if (error?.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsTogglingWishlist(false);
    }
  };
  const handleProductClick = () => {
    navigate(`/product/${item._id}`);
  };
  return (
    <article className="product-card-grid"    onClick={handleProductClick}
      style={{ cursor: 'pointer' }}>
      {item.isBestseller && (
        <div className="badge bestseller-badge" aria-label="Bestseller">BESTSELLER</div>
      )}
      {item.isNew && (
        <div className="badge new-badge" aria-label="New arrival">NEW</div>
      )}

      <div className="card-img-wrap">
        {!imgLoaded && !imgError && <div className="img-skeleton shimmer" />}
        <img
          src={imgSrc}
          alt={item.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => { setImgError(true); setImgLoaded(true); }}
          style={{ opacity: imgLoaded ? 1 : 0 }}
        />
        {imgError && (
          <div className="img-error-fallback">
            <span>🛍️</span>
          </div>
        )}

        <button
          className={`wishlist-btn${liked ? " liked" : ""} ${isTogglingWishlist ? "loading" : ""}`}
          onClick={handleToggleWishlist}
          disabled={isTogglingWishlist}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <span aria-hidden="true">{liked ? "♥" : "♡"}</span>
        </button>

        <div className="card-hover-actions">
          <button
            className={`quick-add-btn ${isAddingToCart ? "loading" : ""}`}
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? "Adding..." : "+ Add to Bag"}
          </button>
        </div>
      </div>

      <div className="card-body">
        {item.tag && <span className="card-tag">{item.tag}</span>}
        <h3 className="card-name">
          <span className="card-brand">{item.brand}</span>{" "}
          {item.name}
        </h3>
        <div className="card-price-row">
          <span className="card-price">₹{item.price?.toLocaleString()}</span>
          {item.originalPrice && (
            <span className="card-mrp">₹{item.originalPrice?.toLocaleString()}</span>
          )}
          {item.discount > 0 && (
            <span className="card-discount">{item.discount}% off</span>
          )}
        </div>
        <div className="card-rating-row">
          <Stars rating={item.rating || 0} />
          <span className="card-review-count">({(item.reviews || 0).toLocaleString()})</span>
        </div>
        {item.shades > 1 && (
          <span className="card-shades">{item.shades} shades</span>
        )}
      </div>
    </article>
  );
}

// ─── PRODUCT CARD (LIST) ──────────────────────────────────────────────────────
// src/components/Brands/ProductCardList.js (or inside your Brands.js file)
function ProductCardList({ item, onToast }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated } = useSelector((state) => state.login);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  
  // Check if product is in wishlist
  const liked = wishlistItems.some((wishlistItem) => {
    if (!wishlistItem?.product) return false;
    return wishlistItem.product._id === item._id;
  });
    const handleProductClick = () => {
    navigate(`/product/${item._id}`);
  };
  
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setIsAddingToCart(true);
    try {
      await dispatch(addToCartAsync({ productId: item._id, quantity: 1 })).unwrap();
      onToast(`Added ${item.name} to cart 🛍️`, "cart");
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setIsTogglingWishlist(true);
    try {
      if (liked) {
        await dispatch(removeFromWishlist(item._id)).unwrap();
        onToast(`Removed ${item.name} from wishlist`, "wishlist");
      } else {
        await dispatch(addToWishlist(item._id)).unwrap();
        onToast(`Added ${item.name} to wishlist ♥`, "wishlist");
      }
    } catch (error) {
      console.log("Wishlist error:", error);
      if (error?.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  return (
    <article className="product-card-list"  onClick={handleProductClick}
      style={{ cursor: 'pointer' }}>
      <div className="list-img-wrap">
        {item.isBestseller && <div className="badge bestseller-badge">BESTSELLER</div>}
        <img
          src={resolveImg(item.images?.[0])}
          alt={item.name}
          loading="lazy"
        />
      </div>
      <div className="list-body">
        {item.tag && <span className="card-tag">{item.tag}</span>}
        <h3 className="list-name">
          <span className="card-brand">{item.brand}</span> {item.name}
        </h3>
        <div className="card-rating-row">
          <Stars rating={item.rating || 0} />
          <span className="card-review-count">({(item.reviews || 0).toLocaleString()})</span>
        </div>
        {item.shades > 1 && <span className="card-shades">{item.shades} shades</span>}
        <div className="list-price-row">
          <span className="card-price">₹{item.price?.toLocaleString()}</span>
          {item.originalPrice && (
            <span className="card-mrp">₹{item.originalPrice?.toLocaleString()}</span>
          )}
          {item.discount > 0 && (
            <span className="card-discount">{item.discount}% off</span>
          )}
        </div>
        <div className="list-actions">
          <button
            className={`add-to-bag-btn ${isAddingToCart ? "loading" : ""}`}
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? "Adding..." : "+ Add to Bag"}
          </button>
          <button
            className={`wishlist-btn-list${liked ? " liked" : ""} ${isTogglingWishlist ? "loading" : ""}`}
            onClick={handleToggleWishlist}
            disabled={isTogglingWishlist}
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          >
            {liked ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── PRODUCT SKELETONS ────────────────────────────────────────────────────────
function ProductSkeletonGrid() {
  return (
    <div className="product-skeleton-grid" aria-hidden="true">
      <div className="skeleton-img shimmer" />
      <div className="skeleton-body">
        <div className="skeleton-line short shimmer" />
        <div className="skeleton-line shimmer" />
        <div className="skeleton-line med shimmer" />
        <div className="skeleton-line short shimmer" />
      </div>
    </div>
  );
}

function ProductSkeletonList() {
  return (
    <div className="product-skeleton-list" aria-hidden="true">
      <div className="skeleton-list-img shimmer" />
      <div className="skeleton-body" style={{ flex: 1 }}>
        <div className="skeleton-line short shimmer" />
        <div className="skeleton-line shimmer" />
        <div className="skeleton-line med shimmer" />
        <div className="skeleton-line short shimmer" />
        <div className="skeleton-line med shimmer" />
      </div>
    </div>
  );
}

// ─── NO DATA STATE ────────────────────────────────────────────────────────────
function NoDataState({ onClearFilters }) {
  return (
    <div className="no-data-state">
      <div className="no-data-img-wrap">
        <img
          src="/src/assets/nodata.avif"
          alt="No products found"
          className="no-data-img"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "block";
          }}
        />
        <span className="no-data-emoji-fallback" style={{ display: "none" }}>🔍</span>
      </div>
      <h3 className="no-data-title">No products found</h3>
      <p className="no-data-desc">
        We couldn't find anything matching your filters. Try adjusting or clearing them.
      </p>
      <button className="no-data-cta" onClick={onClearFilters}>
        Clear all filters
      </button>
    </div>
  );
}

// ─── ERROR STATE ──────────────────────────────────────────────────────────────
function ErrorState({ onRetry }) {
  return (
    <div className="error-state">
      <span className="error-icon">⚠️</span>
      <h3 className="error-title">Something went wrong</h3>
      <p className="error-desc">Failed to load products. Please try again.</p>
      <button className="error-retry-btn" onClick={onRetry}>Try again</button>
    </div>
  );
}
// ─── CUSTOM SORT DROPDOWN ─────────────────────────────────────────────────────
function CustomSortDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'discount', label: 'Best Discount' },
    { value: 'newest', label: 'New Arrivals' }
  ];

  const selectedOption = options.find(opt => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-sort-dropdown" ref={dropdownRef}>
      <button
        className={`sort-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="sort-label-text">Sort:</span>
        <span className="sort-selected">{selectedOption?.label || 'Sort'}</span>
        <span className="sort-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <ul className="sort-options-list" role="listbox">
          {options.map((option) => (
            <li
              key={option.value}
              className={`sort-option ${option.value === value ? 'active' : ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={option.value === value}
            >
              {option.label}
              {option.value === value && <span className="check-mark">✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
// ─── MOBILE SORT BOTTOM SHEET ────────────────────────────────────────────────
function MobileSortSheet({ value, onChange, isMobile }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const options = [
    { value: 'featured', label: '⭐ Featured' },
    { value: 'price-low', label: '💰 Price: Low to High' },
    { value: 'price-high', label: '💰 Price: High to Low' },
    { value: 'rating', label: '⭐ Top Rated' },
    { value: 'discount', label: '🔥 Best Discount' },
    { value: 'newest', label: '✨ New Arrivals' }
  ];

  const selectedOption = options.find(opt => opt.value === value);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // If not mobile, use the dropdown version
  if (!isMobile) {
    return <CustomSortDropdown value={value} onChange={onChange} />;
  }

  return (
    <>
      <button 
        className="mobile-sort-trigger"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
      >
        <span className="sort-label-text">Sort:</span>
        <span className="sort-selected">{selectedOption?.label || 'Sort'}</span>
        <span className="sort-arrow">▼</span>
      </button>

      {isOpen && (
        <>
          <div className="sort-sheet-overlay" onClick={() => setIsOpen(false)} />
          <div className="sort-sheet" role="dialog" aria-modal="true" aria-label="Sort options">
            <div className="sort-sheet-header">
              <h3>Sort by</h3>
              <button className="sort-sheet-close" onClick={() => setIsOpen(false)}>✕</button>
            </div>
            <div className="sort-sheet-options">
              {options.map((option) => (
                <button
                  key={option.value}
                  className={`sort-sheet-option ${option.value === value ? 'active' : ''}`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  <span>{option.label}</span>
                  {option.value === value && <span className="check">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

// ─── RESULTS BAR ──────────────────────────────────────────────────────────────
// ─── RESULTS BAR ──────────────────────────────────────────────────────────────
function ResultsBar({ total, viewMode, onViewChange }) {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);

  return (
    <div className="results-bar">
      <span className="results-count">
        {total > 0 ? (
          <><strong>{total.toLocaleString()}</strong> products</>
        ) : "No results"}
      </span>
      <div className="results-bar-right">
        <div className="view-toggle" role="group" aria-label="View mode">
          {VIEW_MODES.map((mode) => (
            <button
              key={mode}
              className={`view-toggle-btn${viewMode === mode ? " active" : ""}`}
              onClick={() => onViewChange(mode)}
              aria-label={`${mode} view`}
              aria-pressed={viewMode === mode}
            >
              {mode === "grid" ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" />
                  <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor" />
                  <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor" />
                  <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="2" width="14" height="3" rx="1" fill="currentColor" />
                  <rect x="1" y="7" width="14" height="3" rx="1" fill="currentColor" />
                  <rect x="1" y="12" width="14" height="3" rx="1" fill="currentColor" />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* REPLACE THIS ENTIRE SORT WRAP */}
        <CustomSortDropdown 
          value={filters.sortBy} 
          onChange={(value) => dispatch(setSortBy(value))} 
        />
      </div>
    </div>
  );
}

// ─── PAGINATION ───────────────────────────────────────────────────────────────
function Pagination() {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const pagination = useSelector(selectPagination);

  if (!pagination?.pages || pagination.pages <= 1) return null;

  const current = filters.page;
  const total = pagination.pages;

  const getPages = () => {
    const delta = 2;
    const range = [];
    for (
      let i = Math.max(2, current - delta);
      i <= Math.min(total - 1, current + delta);
      i++
    ) range.push(i);

    if (range[0] > 2) range.unshift("...");
    if (range[range.length - 1] < total - 1) range.push("...");

    range.unshift(1);
    if (total > 1) range.push(total);
    return range;
  };

  return (
    <nav className="pagination" aria-label="Product pages">
      <button
        className="page-btn arrow"
        onClick={() => dispatch(setPage(current - 1))}
        disabled={current === 1}
        aria-label="Previous page"
      >‹</button>

      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="page-ellipsis">…</span>
        ) : (
          <button
            key={p}
            className={`page-btn${current === p ? " active" : ""}`}
            onClick={() => dispatch(setPage(p))}
            aria-label={`Page ${p}`}
            aria-current={current === p ? "page" : undefined}
          >{p}</button>
        )
      )}

      <button
        className="page-btn arrow"
        onClick={() => dispatch(setPage(current + 1))}
        disabled={current === total}
        aria-label="Next page"
      >›</button>
    </nav>
  );
}

// ─── MOBILE DRAWER OVERLAY ────────────────────────────────────────────────────
function MobileFilterDrawer({ open, onClose }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div
        className={`drawer-overlay${open ? " visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={`filter-drawer${open ? " open" : ""}`} role="dialog" aria-modal="true" aria-label="Filters">
        <LeftFilters onClose={onClose} />
      </div>
    </>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function CollectionsPage() {
  const dispatch = useDispatch();
  const { toast, showToast } = useToast();

  const filters = useSelector(selectFilters);
  const status = useSelector(selectProductsStatus);
  const products = useSelector(selectProducts);
  const pagination = useSelector(selectPagination);
  const { isAuthenticated } = useSelector((state) => state.login);

  const [viewMode, setViewMode] = useState("grid");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const totalActive =
    filters.priceRanges.length + filters.categories.length +
    filters.discounts.length + filters.brands.length;

  const totalProducts = pagination?.total ?? products.length;

  // Initial data fetch
  useEffect(() => {
    dispatch(fetchBrandBanners());
    dispatch(fetchBrands());
    dispatch(fetchCategories());
    
    // Only fetch wishlist if user is authenticated
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  // Refetch on filter change
  useEffect(() => {
    dispatch(fetchBrandProducts(filters));
  }, [
    dispatch,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    filters.brands.join(),
    filters.categories.join(),
    filters.priceRanges.join(),
    filters.discounts.join(),
    filters.sortBy,
    filters.page,
  ]);

  const renderProducts = () => {
    if (status === "loading") {
      return viewMode === "grid"
        ? Array.from({ length: 8 }).map((_, i) => <ProductSkeletonGrid key={i} />)
        : Array.from({ length: 4 }).map((_, i) => <ProductSkeletonList key={i} />);
    }

    if (status === "failed") {
      return (
        <div className="full-span">
          <ErrorState onRetry={() => dispatch(fetchBrandProducts(filters))} />
        </div>
      );
    }

    if (!products.length) {
      return (
        <div className="full-span">
          <NoDataState onClearFilters={() => dispatch(clearAllFilters())} />
        </div>
      );
    }

    return products.map((item) =>
      viewMode === "grid" ? (
        <ProductCardGrid key={item._id} item={item} onToast={showToast} />
      ) : (
        <ProductCardList key={item._id} item={item} onToast={showToast} />
      )
    );
  };

  return (
    <div className="collections-page">
      <BannerSection />
       <BrandHighlights />

      <BrandPills />

      {totalActive > 0 && <ActiveFilterTags />}

      <div className="mobile-bar">
        <button
          className="mobile-filter-btn"
          onClick={() => setDrawerOpen(true)}
          aria-expanded={drawerOpen}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="20" y2="12" />
            <line x1="12" y1="18" x2="20" y2="18" />
          </svg>
          Filters
          {totalActive > 0 && <span className="mobile-filter-count">{totalActive}</span>}
        </button>
        <div className="mobile-sort-wrap">
          <CustomSortDropdown 
            value={filters.sortBy} 
            onChange={(value) => dispatch(setSortBy(value))} 
          />
        </div>
      </div>

      <div className="collections-body">
        <div className="sidebar-wrap">
          <LeftFilters />
        </div>

        <main className="products-panel" id="main-content">
          <ResultsBar
            total={totalProducts}
            viewMode={viewMode}
            onViewChange={setViewMode}
          />

          <div className={viewMode === "grid" ? "products-grid" : "products-list"}>
            {renderProducts()}
          </div>

          {status !== "loading" && products.length > 0 && <Pagination />}
        </main>
      </div>

      <MobileFilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

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