import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from "reactstrap";
import {
  fetchSingleBrand,
  setSortBy, setPage, clearAllFilters, clearBrand,
  toggleWishlist,
  selectFilters, selectWishlist, selectProductsStatus,
  selectProducts, selectPagination, selectBrand, selectBrandStatus,
} from "../../redux/slices/brandpageSlice";
import "./BrandDetails.css";
import { addToCartAsync } from "../../redux/reducers/thunks/cartThunks";
import { addToWishlist } from "../../redux/reducers/thunks/wishlistActions";

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const ALL_TABS = [
  { value: "all",       label: "All Products" },
  { value: "skincare",  label: "Skincare" },
  { value: "makeup",    label: "Makeup" },
  { value: "haircare",  label: "Haircare" },
  { value: "fragrance", label: "Fragrance" },
];

const SORT_LABELS = {
  featured:     "Featured",
  newest:       "Newest",
  "price-low":  "Price: Low to High",
  "price-high": "Price: High to Low",
  rating:       "Top Rated",
};

const FALLBACK_COVER = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&w=1000&q=90&fit=crop";
const FALLBACK_PROD  = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&w=600&q=80";

// ─── UTILS ───────────────────────────────────────────────────────────────────

function useToast() {
  const [toast, setToast] = useState({ msg: "", show: false });
  const showToast = useCallback((msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2200);
  }, []);
  return { toast, showToast };
}

function Stars({ rating = 0 }) {
  return (
    <div style={{ display: "flex", color: "var(--color-accent)", fontSize: "0.875rem", gap: 2 }}>
      {[...Array(5)].map((_, i) => (
        <i key={i} className={`ti ti-star${i < Math.round(rating) ? "-filled" : ""}`} />
      ))}
    </div>
  );
}

// ─── SKELETON COMPONENTS ─────────────────────────────────────────────────────

/* Shimmer block */
const Sk = ({ w = "100%", h = 14, r = 4, style = {} }) => (
  <div className="sk" style={{ width: w, height: h, borderRadius: r, flexShrink: 0, ...style }} />
);

/* Skeleton for a single product card */
const SkeletonCard = () => (
  <div className="sk-card">
    <div className="sk sk-card-img" />
    <div className="sk-card-body">
      <Sk w="70%" h={13} />
      <Sk w="50%" h={11} />
      <Sk w="40%" h={10} />
    </div>
  </div>
);

/* Skeleton for the full hero section */
const HeroSkeleton = () => (
  <section className="hero-section hero-skeleton">
    <div className="bd-inner">
      <div className="hero-inner">
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Sk w={80} h={80} r="50%" />
          <Sk w="55%" h={60} />
          <Sk w="80%" h={18} />
          <Sk w="70%" h={18} />
          <Sk w="60%" h={18} />
          <div style={{ display: "flex", gap: 40, marginTop: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Sk w={60} h={10} />
              <Sk w={80} h={14} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Sk w={60} h={10} />
              <Sk w={80} h={14} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Sk w={60} h={10} />
              <Sk w={80} h={14} />
            </div>
          </div>
        </div>
        {/* Right — image placeholder */}
        <div style={{ marginLeft: "auto", width: "100%", maxWidth: 540 }}>
          <Sk w="100%" h={0} style={{ aspectRatio: "52/74", height: "auto" }} />
        </div>
      </div>
    </div>
  </section>
);

/* Skeleton for tabs bar */
const TabsSkeleton = () => (
  <div className="premium-tabs-bar">
    <div className="bd-inner">
      <div className="tabs-inner">
        {[120, 90, 80, 100, 95].map((w, i) => (
          <div key={i} className="sk sk-tab" style={{ width: w }} />
        ))}
      </div>
    </div>
  </div>
);

/* Skeleton for product grid */
const ProductsSkeleton = () => (
  <div className="products-grid">
    {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
  </div>
);

// ─── BRAND HERO ──────────────────────────────────────────────────────────────

const BrandHero = ({ brand }) => (
  <section className="hero-section">
    <div className="hero-glow" />
    <div className="bd-inner">
      <div className="hero-inner">
        {/* Left */}
        <div className="hero-content-left">
          <div style={{ marginBottom: "1rem" }}>
            <span className="hero-tag tracking-ultra">01 / BRAND IDENTITY</span>
          </div>

          <div className="hero-logo-circle">
            <img
              src={brand.logo || "/brand-logo-placeholder.png"}
              alt={brand.name}
              onError={(e) => { e.target.src = "/brand-logo-placeholder.png"; }}
            />
          </div>

          <h1 className="hero-title" data-name={brand.name}>{brand.name}</h1>

          <p className="hero-description">
            {brand.tagline || "Where molecular science meets the ethereal beauty of botanical extracts."}
          </p>

          <div className="hero-stats">
            <div>
              <div className="hero-stat-label">Origin</div>
              <div className="hero-stat-value">{brand.country || "—"}</div>
            </div>
            <div>
              <div className="hero-stat-label">Founded</div>
              <div className="hero-stat-value">{brand.founded ? `Est. ${brand.founded}` : "—"}</div>
            </div>
            <div>
              <div className="hero-stat-label">Status</div>
              <div className="hero-stat-value">{brand.isCrueltyFree ? "Cruelty-Free" : "Certified"}</div>
            </div>
          </div>
        </div>

        {/* Right — image */}
        <div style={{ position: "relative" }}>
          <div className="hero-image-wrapper">
            <img
              src={brand.coverImage?.startsWith("http") ? brand.coverImage : FALLBACK_COVER}
              alt={`${brand.name} showcase`}
              className="hero-image-main"
              onError={(e) => { e.target.src = FALLBACK_COVER; }}
            />
            <div className="hero-image-frame" />
            <div className="hero-image-accent-glow" />
            <div className="hero-float-pill">
              <span className="hero-float-dot" />
              Premium Collection
            </div>
          </div>
          <div className="hero-vertical-text">
            RADIANCE UNVEILED • SKINCARE COLLECTIVE
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── TABS BAR ─────────────────────────────────────────────────────────────────

const TabsBar = ({ activeTab, onTabChange }) => (
  <nav className="premium-tabs-bar">
    <div className="bd-inner">
      <div className="tabs-inner">
        {ALL_TABS.map((tab) => (
          <a
            key={tab.value}
            href={`#${tab.value}`}
            className={`category-tab${activeTab === tab.value ? " active" : ""}`}
            onClick={(e) => { e.preventDefault(); onTabChange(tab.value); }}
          >
            {tab.label}
          </a>
        ))}
      </div>
    </div>
  </nav>
);

// ─── BRAND STORY ─────────────────────────────────────────────────────────────

const BRAND_PILLARS = [
  { icon: "🌿", label: "Clean ingredients" },
  { icon: "🔬", label: "Clinically Proven" },
];

const BrandStory = ({ brand }) => (
  <section className="brand-story-section">
    <div className="bd-inner">
      <h2 className="story-quote-large">
        "{brand.storyTitle || `${brand.name} — where beauty meets science.`}"
      </h2>

      <div className="story-columns">
        <div className="story-divider" />
        <div style={{ paddingRight: 40 }}>
          <p className="story-body-text">
            <span className="story-drop-cap">{brand.name?.[0] || "B"}</span>
            {brand.description || `${brand.name} is committed to delivering premium quality products that combine innovation with nature.`}
          </p>
        </div>
        <div style={{ paddingLeft: 40 }}>
          <div className="story-legacy-box">
            <p className="story-body-text-muted">
              {brand.story || "Our laboratories continue this legacy, blending rare botanicals with patented molecular delivery systems. We are committed to a standard of beauty that is as sustainable as it is sophisticated."}
            </p>
            <div className="story-pillars">
              {BRAND_PILLARS.map((p) => (
                <div key={p.label} className="story-pillar">
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── SALE BANNER ─────────────────────────────────────────────────────────────

const SaleBanner = () => (
  <section className="sale-banner-section">
    <div className="bd-inner">
      <div className="sale-banner-inner">
        <div className="sale-banner-shadow-bg" />
        <div className="sale-banner-main">
          <div>
            <span className="sale-badge-text">The Curated Sale</span>
            <h3 className="sale-banner-title">The Summer Edit</h3>
            <p className="hero-description" style={{ opacity: 0.6, marginBottom: "2rem" }}>
              A seasonal selection of our most refulgent formulas, curated for the modern minimalist.
            </p>
            <button className="sale-cta-btn">Explore the Curation</button>
          </div>
          <div className="sale-percentage-area">
            <div style={{ position: "relative", display: "inline-block" }}>
              <span className="sale-big-number">40</span>
              <span className="sale-percent-symbol">%</span>
              <div className="hero-stat-label tracking-ultra" style={{ textAlign: "center", opacity: 0.8 }}>
                OFF CURATION
              </div>
            </div>
            <div className="sale-video-bubble" style={{ display: "none" }}>
              <video
                src="/sale-banner-video.mp4"
                poster="https://images.pexels.com/videos/7677256/pexels-photo-7677256.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200"
                autoPlay muted loop playsInline
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
const ProductCard = ({ item, onToast }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector(selectWishlist);
  const { isAuthenticated } = useSelector((state) => state.login);
  
  // Check if product is in wishlist
  const isLiked = Array.isArray(wishlist) && wishlist.some(
    (w) => w.product?._id === item._id || w._id === item._id
  );
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  // Navigate to product detail
  const handleProductClick = () => {
    navigate(`/product/${item._id}`);
  };

  const handleWishlist = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setIsTogglingWishlist(true);
    try {
      if (isLiked) {
        await dispatch(removeFromWishlist(item._id)).unwrap();
        onToast("Removed from wishlist");
      } else {
        await dispatch(addToWishlist(item._id)).unwrap();
        onToast("Added to wishlist ♥");
      }
    } catch (error) {
      onToast("Failed to update wishlist");
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const handleQuickAdd = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setIsAddingToCart(true);
    try {
      await dispatch(addToCartAsync({ productId: item._id, quantity: 1 })).unwrap();
      onToast(`Added to bag: ${item.name}`);
    } catch (error) {
      onToast("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };


  return (
    <div 
      className="premium-product-card" 
      onClick={handleProductClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="product-image-box">
        <img
          src={item.image || FALLBACK_PROD}
          alt={item.name}
          loading="lazy"
          onError={(e) => { e.target.src = FALLBACK_PROD; }}
        />

        {item.bestseller && (
          <div className="card-badge">
            <span style={{ fontSize: 11 }}>✦</span>
            <span>Bestseller</span>
          </div>
        )}
        {!item.bestseller && item.isNew && (
          <div className="card-badge" style={{ color: "var(--color-accent)" }}>New Arrival</div>
        )}
        {item.discount > 0 && !item.bestseller && !item.isNew && (
          <div className="card-badge" style={{ color: "var(--color-accent)" }}>
            {item.discount}% OFF
          </div>
        )}

        <button
          className={`card-wishlist-btn${isLiked ? " active" : ""}`}
          onClick={handleWishlist}
          disabled={isTogglingWishlist}
          aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isLiked ? "♥" : "♡"}
        </button>

        <button 
          className="quick-add-btn-premium" 
          onClick={handleQuickAdd}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? "Adding..." : "+ Quick Add"}
        </button>
      </div>

      <div className="product-info-area">
        {(item.tag || item.category) && (
          <span className="hero-stat-label" style={{ opacity: 0.35, marginBottom: 6, fontSize: 9 }}>
            {(item.tag || item.category || "").toUpperCase()}
          </span>
        )}
        <Link 
          to={`/product/${item._id}`} 
          className="product-card-title"
          onClick={(e) => e.stopPropagation()}
        >
          {item.name}
        </Link>
        <div className="product-card-price">
          <span>₹{item.price?.toLocaleString("en-IN")}</span>
          {item.discount > 0 && item.mrp > item.price && (
            <span className="price-strike">₹{item.mrp?.toLocaleString("en-IN")}</span>
          )}
        </div>
        {item.rating > 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 12 }}>
            <Stars rating={item.rating} />
            <span className="hero-stat-label" style={{ opacity: 0.4, fontSize: 10 }}>
              ({item.reviews > 0 ? `${item.reviews} Reviews` : "New"})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────

const EmptyProducts = ({ activeTab }) => (
  <div style={{ textAlign: "center", padding: "80px 20px", opacity: 0.5 }}>
    <i className="ti ti-shopping-bag" style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }} />
    <p className="hero-stat-label" style={{ fontSize: "0.9rem" }}>
      No products found{activeTab !== "all" ? ` in ${activeTab}` : ""}.
    </p>
  </div>
);

// ─── PAGE ROOT ────────────────────────────────────────────────────────────────

export default function BrandDetails() {
  const { id }    = useParams();
  const dispatch  = useDispatch();
  const [activeTab, setActiveTab] = useState("all");
  const [sortOpen, setSortOpen]   = useState(false);
  const { toast, showToast }      = useToast();
  const isFirstRender             = useRef(true);

  const brand          = useSelector(selectBrand);
  const products       = useSelector(selectProducts);
  const brandStatus    = useSelector(selectBrandStatus);
  const productsStatus = useSelector(selectProductsStatus);
  const filters        = useSelector(selectFilters);
  const pagination     = useSelector(selectPagination);

  useEffect(() => {
    dispatch(fetchSingleBrand({ id }));
    return () => {
      dispatch(clearBrand());
      dispatch(clearAllFilters());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (!id) return;
    dispatch(fetchSingleBrand({ id, category: activeTab, sortBy: filters.sortBy, page: filters.page }));
  }, [filters.sortBy, filters.page]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    dispatch(fetchSingleBrand({ id, category: tab, sortBy: filters.sortBy, page: 1 }));
    dispatch(setPage(1));
  };

  const handleSort = (sort) => {
    dispatch(setSortBy(sort));
    setSortOpen(false);
  };

  // ── Full-page loading (first load) ──
  const isFirstLoad = brandStatus === "loading" || (brandStatus === "idle" && !brand);

  if (isFirstLoad) {
    return (
      <div className="brand-details-container">
        <HeroSkeleton />
        <TabsSkeleton />
        {/* story placeholder */}
        <section className="brand-story-section">
          <div className="bd-inner">
            <Sk w="60%" h={40} style={{ margin: "0 auto 80px" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[100, 90, 80, 95, 85, 70].map((w, i) => <Sk key={i} w={`${w}%`} h={14} />)}
              </div>
              <Sk w="100%" h={220} />
            </div>
          </div>
        </section>
        {/* products placeholder */}
        <section className="product-section">
          <div className="bd-inner">
            <div className="products-section-title-area">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Sk w={80} h={11} />
                <Sk w={220} h={36} />
              </div>
            </div>
            <ProductsSkeleton />
          </div>
        </section>
      </div>
    );
  }

  // ── Error / not found ──
  if (brandStatus === "failed" || !brand) {
    return (
      <div className="bd-page-center">
        <i className="ti ti-mood-sad" style={{ fontSize: 40, color: "var(--color-accent)", opacity: 0.5 }} />
        <p style={{ opacity: 0.5, margin: 0 }}>Brand not found.</p>
        <Link to="/" style={{ color: "var(--color-accent)", fontSize: 13 }}>← Back to home</Link>
      </div>
    );
  }

  return (
    <div className="brand-details-container">
      {/* Toast */}
      <div className={`bd-toast${toast.show ? " show" : ""}`} role="status">
        {toast.msg}
      </div>

      {/* Hero */}
      <BrandHero brand={brand} />

      {/* Tabs */}
      {/* <TabsBar activeTab={activeTab} onTabChange={handleTabChange} /> */}

      {/* Brand story */}
      <BrandStory brand={brand} />

      {/* Sale banner */}
      <SaleBanner />

      {/* Products */}
      <section className="product-section">
        <div className="bd-inner">
          <div className="products-section-title-area">
            <div>
              <span className="section-tag">Product Collection</span>
              <h2 className="section-title">{brand.name} Products</h2>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <span className="hero-stat-label" style={{ opacity: 0.6, whiteSpace: "nowrap" }}>
                Total: {pagination.total ?? products.length} items
              </span>

              <Dropdown isOpen={sortOpen} toggle={() => setSortOpen(!sortOpen)}>
                <DropdownToggle tag="div" className="sort-dropdown">
                  <span className="hero-stat-label">
                    Sort: {SORT_LABELS[filters.sortBy] || filters.sortBy}
                  </span>
                  <i className="ti ti-chevron-down" />
                </DropdownToggle>
                <DropdownMenu end>
                  {Object.entries(SORT_LABELS).map(([val, label]) => (
                    <DropdownItem key={val} onClick={() => handleSort(val)}>{label}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

          {/* Skeleton grid while products load */}
          {productsStatus === "loading" && <ProductsSkeleton />}

          {/* Product grid */}
          {productsStatus !== "loading" && products.length > 0 && (
            <div className="products-grid">
              {products.map((item) => (
                <ProductCard key={item._id} item={item} onToast={showToast} />
              ))}
            </div>
          )}

          {/* Empty */}
          {productsStatus !== "loading" && products.length === 0 && (
            <EmptyProducts activeTab={activeTab} />
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination-wrapper">
              <button
                className="pag-btn"
                disabled={filters.page === 1}
                onClick={() => dispatch(setPage(filters.page - 1))}
              >
                <i className="ti ti-arrow-left" />
              </button>
              <div className="pag-numbers">
                {[...Array(pagination.pages)].map((_, i) => (
                  <div
                    key={i}
                    className={`pag-num${filters.page === i + 1 ? " active" : ""}`}
                    onClick={() => dispatch(setPage(i + 1))}
                    role="button"
                    tabIndex={0}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                ))}
              </div>
              <button
                className="pag-btn"
                disabled={filters.page === pagination.pages}
                onClick={() => dispatch(setPage(filters.page + 1))}
              >
                <i className="ti ti-arrow-right" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}