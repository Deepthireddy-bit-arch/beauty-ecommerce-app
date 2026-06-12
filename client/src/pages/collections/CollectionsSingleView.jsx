import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  Container, Row, Col,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from "reactstrap";
import {
  fetchCollectionById,
  setSortBy, setPage, clearFilters, clearCollection,
  toggleWishlist,
  selectFilters, selectWishlist, selectProductsStatus,
  selectProducts, selectPagination,
  selectCollection, selectCollectionStatus,
} from "../../redux/slices/collectionsSlice";
import './collectionsdetail.css'

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const ALL_TABS = [
  { value: "all",       label: "All Products" },
  { value: "skincare",  label: "Skincare"     },
  { value: "makeup",    label: "Makeup"       },
  { value: "haircare",  label: "Haircare"     },
  { value: "fragrance", label: "Fragrance"    },
];

const SORT_LABELS = {
  featured:     "Featured",
  newest:       "Newest",
  "price-low":  "Price: Low–High",
  "price-high": "Price: High–Low",
  rating:       "Top Rated",
  discount:     "Most Discounted",
};

// ─── UTILS ────────────────────────────────────────────────────────────────────

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
    <div className="d-flex" style={{ color: "#f59e0b", fontSize: "0.875rem", gap: "2px" }}>
      {[...Array(5)].map((_, i) => (
        <i key={i} className={`ti ti-star${i < Math.round(rating) ? "-filled" : ""}`} />
      ))}
    </div>
  );
}

// ─── COLLECTION HERO ──────────────────────────────────────────────────────────

const CollectionHero = ({ collection }) => (
  <section className="cd-hero">
    {/* Background */}
    <div
      className="cd-hero-bg"
      style={{
        backgroundImage: `url(${
          collection.image ||
          "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&w=1400&q=90"
        })`,
      }}
    >
      <div className="cd-hero-bg-overlay" />
    </div>

    {/* Content */}
    <div className="cd-hero-content-wrap">
      <div className="cd-hero-content">
        {/* Breadcrumb */}
        <div className="cd-hero-breadcrumb">
          <Link to="/collections" className="cd-breadcrumb-link">Collections</Link>
          <i className="ti ti-chevron-right" style={{ fontSize: "10px" }} />
          <span>{collection.title}</span>
        </div>

        {collection.category && (
          <span className="cd-hero-eyebrow">{collection.category}</span>
        )}

        <h1 className="cd-hero-title">{collection.title}</h1>

        {collection.sub && (
          <p className="cd-hero-desc">{collection.sub}</p>
        )}

        {collection.offer && (
          <div className="cd-hero-offer">
            <span className="cd-offer-badge">{collection.offer}</span>
          </div>
        )}
      </div>

      {/* Floating stat card */}
      <div className="cd-hero-stat-card">
        <div className="cd-stat-row">
          <div className="cd-stat">
            <div className="cd-stat-label">Category</div>
            <div className="cd-stat-value">{collection.category || "All"}</div>
          </div>
          <div className="cd-stat-divider" />
          <div className="cd-stat">
            <div className="cd-stat-label">Offer</div>
            <div className="cd-stat-value" style={{ fontSize: "14px" }}>
              {collection.offer || "—"}
            </div>
          </div>
          <div className="cd-stat-divider" />
          <div className="cd-stat">
            <div className="cd-stat-label">Status</div>
            <div
              className="cd-stat-value"
              style={{ color: collection.isActive ? "#86efac" : "#fca5a5" }}
            >
              {collection.isActive ? "Active" : "Closed"}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── TABS BAR ─────────────────────────────────────────────────────────────────

const TabsBar = ({ activeTab, onTabChange }) => (
  <nav className="premium-tabs-bar">
    <div className="container">
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
  </nav>
);

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

const ProductCard = ({ item, onToast }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector(selectWishlist);
  const isLiked  = wishlist[item._id];

  const handleWishlist = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(item._id));
    onToast(isLiked ? "Removed from wishlist" : "Added to wishlist ♥");
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    onToast(`Added to bag: ${item.name}`);
  };

  return (
    <div className="premium-product-card">
      <div className="product-image-box">
        <img
          src={
            item.image ||
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&w=600&q=80"
          }
          alt={item.name}
          loading="lazy"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&w=600&q=80";
          }}
        />

        {/* Badge */}
        {item.bestseller && (
          <div className="card-badge">
            <i className="ti ti-sparkles" style={{ fontSize: "11px" }} />
            <span>Bestseller</span>
          </div>
        )}
        {!item.bestseller && item.isNew && (
          <div className="card-badge" style={{ color: "var(--purple)" }}>
            New Arrival
          </div>
        )}
        {item.discount > 0 && !item.bestseller && !item.isNew && (
          <div className="card-badge" style={{ color: "var(--purple)" }}>
            {item.discount}% OFF
          </div>
        )}

        {/* Wishlist */}
        <button
          className={`card-wishlist-btn${isLiked ? " active" : ""}`}
          onClick={handleWishlist}
          aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <i className={`ti ti-heart${isLiked ? "-filled" : ""}`} />
        </button>

        {/* Quick add */}
        <button className="quick-add-btn-premium" onClick={handleQuickAdd}>
          + Quick Add
        </button>
      </div>

      <div className="product-info-area">
        {(item.tag || item.category) && (
          <span
            className="hero-stat-label tracking-ultra opacity-30 d-block mb-2"
            style={{ fontSize: "9px" }}
          >
            {(item.tag || item.category || "").toUpperCase()}
          </span>
        )}

        <Link
          to={`/product/${item._id}`}
          className="product-card-title"
        >
          {item.name}
        </Link>

        <div className="product-card-price">
          <span>₹{item.price?.toLocaleString("en-IN")}</span>
          {item.discount > 0 && item.mrp > item.price && (
            <span className="price-strike">
              ₹{item.mrp?.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {item.rating > 0 && (
          <div
            className="d-flex align-items-center justify-content-center gap-2"
            style={{ marginTop: "12px" }}
          >
            <Stars rating={item.rating} />
            <span className="hero-stat-label opacity-40" style={{ fontSize: "10px" }}>
              ({item.reviews > 0 ? `${item.reviews} reviews` : "New"})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── SKELETON ─────────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="sk-card">
    <div className="sk-img" />
    <div className="sk-body">
      <div className="sk-line med" />
      <div className="sk-line short" />
      <div className="sk-line" style={{ width: "55%", height: "9px" }} />
    </div>
  </div>
);

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────

const EmptyProducts = ({ tab }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 20px",
      gap: "12px",
      opacity: 0.5,
    }}
  >
    <i
      className="ti ti-shopping-bag"
      style={{ fontSize: "36px", color: "var(--purple-mid)" }}
    />
    <p
      style={{
        fontFamily: "Cormorant Garamond, serif",
        fontSize: "22px",
        fontWeight: 500,
        color: "var(--ink)",
        margin: 0,
      }}
    >
      No products found{tab !== "all" ? ` in ${tab}` : ""}.
    </p>
    <p
      style={{
        fontFamily: "Outfit, sans-serif",
        fontSize: "13px",
        color: "var(--ink-muted)",
        margin: 0,
      }}
    >
      Try a different category or check back soon.
    </p>
  </div>
);

// ─── FOOTER ───────────────────────────────────────────────────────────────────

const PremiumFooter = () => (
  <footer className="premium-site-footer">
    <Container>
      <Row className="gy-5">
        <Col lg={3}>
          <div className="footer-logo-text">Refulgent Luxury</div>
          <p className="footer-brand-desc">Elevating skincare to an art form.</p>
          <div className="social-links d-flex gap-4">
            <a href="#" aria-label="Instagram">
              <i className="ti ti-brand-instagram" />
            </a>
            <a href="#" aria-label="Pinterest">
              <i className="ti ti-brand-pinterest" />
            </a>
            <a href="#" aria-label="YouTube">
              <i className="ti ti-brand-youtube" />
            </a>
          </div>
        </Col>

        <Col lg={2} md={4} className="offset-lg-1">
          <h5 className="hero-stat-label tracking-ultra mb-4">Collection</h5>
          <ul className="list-unstyled d-flex flex-column gap-3">
            {["New Arrivals", "Bestsellers", "Summer Curation", "Gift Sets"].map((l) => (
              <li key={l}>
                <a href="#" className="footer-link-item">{l}</a>
              </li>
            ))}
          </ul>
        </Col>

        <Col lg={2} md={4}>
          <h5 className="hero-stat-label tracking-ultra mb-4">Service</h5>
          <ul className="list-unstyled d-flex flex-column gap-3">
            {["Shipping", "Returns", "Radiance Loyalty", "Contact"].map((l) => (
              <li key={l}>
                <a href="#" className="footer-link-item">{l}</a>
              </li>
            ))}
          </ul>
        </Col>

        <Col lg={4} md={4}>
          <h5 className="hero-stat-label tracking-ultra mb-4">Radiance Report</h5>
          <p className="footer-brand-desc">
            Subscribe for ethereal insights and exclusive curations.
          </p>
          <div className="newsletter-box">
            <input
              type="email"
              placeholder="Your email address"
              className="newsletter-input"
            />
            <button className="newsletter-btn">Join</button>
          </div>
        </Col>
      </Row>

      <div className="footer-bottom">
        <span>© 2024 Refulgent Luxury Collective</span>
        <div className="footer-legal d-flex gap-4">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
          <a href="#">Accessibility</a>
        </div>
      </div>
    </Container>
  </footer>
);

// ─── PAGE ROOT ────────────────────────────────────────────────────────────────

export default function CollectionsSingleView() {
  const { id }      = useParams();
  const dispatch    = useDispatch();
  const [activeTab, setActiveTab] = useState("all");
  const [sortOpen,  setSortOpen]  = useState(false);
  const { toast, showToast }      = useToast();
  const isFirstRender             = useRef(true);

  const collection       = useSelector(selectCollection);
  const collectionStatus = useSelector(selectCollectionStatus);
  const products         = useSelector(selectProducts);
  const productsStatus   = useSelector(selectProductsStatus);
  const filters          = useSelector(selectFilters);
  const pagination       = useSelector(selectPagination);

  // Initial load
  useEffect(() => {
    dispatch(fetchCollectionById({ id }));
    return () => {
      dispatch(clearCollection());
      dispatch(clearFilters());
    };
  }, [dispatch, id]);

  // Re-fetch on sort / page changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!id) return;
    dispatch(
      fetchCollectionById({
        id,
        category: activeTab,
        sortBy:   filters.sortBy,
        page:     filters.page,
      })
    );
  }, [filters.sortBy, filters.page]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    dispatch(fetchCollectionById({ id, category: tab, sortBy: filters.sortBy, page: 1 }));
    dispatch(setPage(1));
  };

  const handleSort = (sort) => {
    dispatch(setSortBy(sort));
    setSortOpen(false);
  };

  // ── Loading ──
  if (
    collectionStatus === "loading" ||
    (collectionStatus === "idle" && !collection)
  ) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--ivory)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "2px solid var(--border)",
              borderTopColor: "var(--purple)",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
            }}
          />
          <p
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
            }}
          >
            Loading Collection
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Error ──
  if (collectionStatus === "failed" || !collection) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "16px",
          background: "var(--ivory)",
        }}
      >
        <i
          className="ti ti-mood-sad"
          style={{ fontSize: "40px", color: "var(--purple-mid)" }}
        />
        <p
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "24px",
            color: "var(--ink)",
            margin: 0,
          }}
        >
          Collection not found.
        </p>
        <Link
          to="/collections"
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "13px",
            color: "var(--purple)",
          }}
        >
          ← Back to Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="brand-details-container">

      {/* Toast */}
      <div className={`bd-toast${toast.show ? " show" : ""}`} role="status">
        {toast.msg}
      </div>

      {/* Nav */}
      <nav className="premium-nav d-flex justify-content-between align-items-center">
        <div className="nav-label tracking-ultra">Collection / 2024</div>
        <Link to="/" className="nav-logo">REFULGENT LUXURY</Link>
        <div className="nav-links">
          <Link to="/collections" className="nav-link">Collections</Link>
          <Link to="#" className="nav-link">Sustainability</Link>
          <Link to="#" className="nav-link active">Shop</Link>
        </div>
      </nav>

      {/* Hero */}
      <CollectionHero collection={collection} />

      {/* Category tabs */}
      <TabsBar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Products section */}
      <section className="product-section">
        <Container>
          {/* Section header */}
          <div className="products-section-title-area d-flex justify-content-between align-items-end flex-wrap gap-4">
            <div>
              <span className="section-tag">Product Collection</span>
              <h2 className="section-title">{collection.title}</h2>
            </div>

            <div className="d-flex align-items-center gap-4">
              <span className="hero-stat-label opacity-60">
                {pagination.total ?? products.length} Items
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
                    <DropdownItem key={val} onClick={() => handleSort(val)}>
                      {label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

          {/* Skeleton loaders */}
          {productsStatus === "loading" && (
            <Row className="gy-4">
              {[1, 2, 3].map((n) => (
                <Col key={n} lg={4} md={6}>
                  <SkeletonCard />
                </Col>
              ))}
            </Row>
          )}

          {/* Product grid */}
          {productsStatus !== "loading" && products.length > 0 && (
            <Row className="gy-4">
              {products.map((item) => (
                <Col key={item._id} lg={4} md={6}>
                  <ProductCard item={item} onToast={showToast} />
                </Col>
              ))}
            </Row>
          )}

          {/* Empty state */}
          {productsStatus !== "loading" && products.length === 0 && (
            <EmptyProducts tab={activeTab} />
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
        </Container>
      </section>

      <PremiumFooter />
    </div>
  );
}