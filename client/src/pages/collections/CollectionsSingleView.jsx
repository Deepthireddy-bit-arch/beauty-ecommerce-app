import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Container, Row, Col,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from "reactstrap";
import {
  fetchCollectionById,
  fetchCategories,
  setSortBy, setPage, clearFilters, clearCollection,
  toggleWishlist,
  selectFilters,
  selectProductsStatus,
  selectProducts,
  selectPagination,
  selectCollection,
  selectCollectionStatus,
  selectCategories,
  selectWishlist as selectCollectionsWishlist,
} from "../../redux/slices/collectionsSlice";
import { addToWishlist, removeFromWishlist, fetchWishlist } from "../../redux/reducers/thunks/wishlistActions";
import { addToCartAsync } from "../../redux/reducers/thunks/cartThunks";
import './collectionsdetail.css';

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const SORT_LABELS = {
  featured: "Featured",
  newest: "Newest",
  "price-low": "Price: Low–High",
  "price-high": "Price: High–Low",
  rating: "Top Rated",
  discount: "Most Discounted",
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
    <div
      className="cd-hero-bg"
      style={{
        backgroundImage: `url(${collection.image ||
          "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&w=1400&q=90"
          })`,
      }}
    >
      <div className="cd-hero-bg-overlay" />
    </div>

    <div className="cd-hero-content-wrap">
      <div className="cd-hero-content">
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

const TabsBar = ({ categories, activeTab, onTabChange }) => {
  const tabs = categories.length > 0
    ? [{ value: "all", label: "All Products" }, ...categories.map(cat => ({
      value: cat.value || cat.name?.toLowerCase() || cat,
      label: cat.label || cat.name || cat,
    }))]
    : [{ value: "all", label: "All Products" }];

  return (
    <nav className="premium-tabs-bar">
      <div className="premium-tabs-inner">
        {tabs.map((tab) => (
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
};

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

// const ProductCard = ({ item, onToast }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const isAuth = useSelector((s) => s.login?.isAuthenticated);

//   // ✅ Single source of truth: wishlistSlice.items (populated by fetchWishlist)
//  const wishlistItems = useSelector((s) => s.wishlist?.items ?? []);

// // ✅ backend shape is always { product: { _id } } after populate
// const isLiked = Array.isArray(wishlistItems) && wishlistItems.some(
//   (w) => w?.product?._id === item._id
// );
//   const requireAuth = (e, cb) => {
//     e.preventDefault();
//     if (!isAuth) { navigate("/login"); return; }
//     cb();
//   };

// const handleWishlist = (e) => {
//   requireAuth(e, async () => {
//     try {
//       if (isLiked) {
//         await dispatch(removeFromWishlist(item._id)).unwrap();
//         onToast("Removed from wishlist");
//       } else {
//         const result = await dispatch(addToWishlist(item._id)).unwrap();
//         // ✅ alreadyExists still means it's wishlisted — don't show error
//         onToast("Added to wishlist ♥");
//       }
//     } catch (err) {
//       // Only genuine failures reach here now
//       console.error("Wishlist error:", err);
//       onToast("Failed to update wishlist");
//     }
//   });
// };

//   const handleQuickAdd = (e) => {
//     requireAuth(e, () => {
//       dispatch(addToCartAsync({ productId: item._id, quantity: 1 }));
//       onToast(`Added to bag: ${item.name}`);
//     });
//   };

//   return (
//     <div className="premium-product-card">
//       <div className="product-image-box">
//         <img
//           src={item.image || "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&w=600&q=80"}
//           alt={item.name}
//           loading="lazy"
//           onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&w=600&q=80"; }}
//         />

//         {item.bestseller && (
//           <div className="card-badge">
//             <i className="ti ti-sparkles" style={{ fontSize: "11px" }} />
//             <span>Bestseller</span>
//           </div>
//         )}
//         {!item.bestseller && item.isNew && (
//           <div className="card-badge" style={{ color: "var(--purple)" }}>New Arrival</div>
//         )}
//         {item.discount > 0 && !item.bestseller && !item.isNew && (
//           <div className="card-badge" style={{ color: "var(--purple)" }}>{item.discount}% OFF</div>
//         )}

//         {/* ✅ always visible — active class keeps it shown even without hover */}
//         <button
//           className={`card-wishlist-btn${isLiked ? " active" : ""}`}
//           onClick={handleWishlist}
//           aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
//         >
//           <i className={`ti ti-heart${isLiked ? "-filled" : ""}`} />
//         </button>

//         <button className="quick-add-btn-premium" onClick={handleQuickAdd}>
//           + Quick Add
//         </button>
//       </div>

//       <div className="product-info-area">
//         {(item.tag || item.category) && (
//           <span className="hero-stat-label tracking-ultra opacity-30 d-block mb-2" style={{ fontSize: "9px" }}>
//             {(item.tag || item.category || "").toUpperCase()}
//           </span>
//         )}
//         <Link to={`/product/${item._id}`} className="product-card-title">{item.name}</Link>
//         <div className="product-card-price">
//           <span>₹{item.price?.toLocaleString("en-IN")}</span>
//           {item.discount > 0 && item.mrp > item.price && (
//             <span className="price-strike">₹{item.mrp?.toLocaleString("en-IN")}</span>
//           )}
//         </div>
//         {item.rating > 0 && (
//           <div className="d-flex align-items-center justify-content-center gap-2" style={{ marginTop: "12px" }}>
//             <Stars rating={item.rating} />
//             <span className="hero-stat-label opacity-40" style={{ fontSize: "10px" }}>
//               ({item.reviews > 0 ? `${item.reviews} reviews` : "New"})
//             </span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

const ProductCard = ({ item, onToast }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuth = useSelector((s) => s.login?.isAuthenticated);

  // ✅ Single source of truth: wishlistSlice.items (populated by fetchWishlist)
  const wishlistItems = useSelector((s) => s.wishlist?.items ?? []);

  // ✅ Check if product is in wishlist - handle different ID fields
  const isLiked = Array.isArray(wishlistItems) && wishlistItems.some(
    (w) => {
      const productId = w?.product?._id || w?.productId || w?._id;
      const itemId = item?._id || item?.id;
      return productId === itemId;
    }
  );

  const requireAuth = (e, cb) => {
    e.preventDefault();
    if (!isAuth) {
      navigate("/login");
      return;
    }
    cb();
  };

  // ✅ Navigate to product detail
  const handleProductClick = () => {
    const productId = item?._id || item?.id;
    navigate(`/product/${productId}`);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    requireAuth(e, async () => {
      try {
        const productId = item?._id || item?.id;
        if (isLiked) {
          await dispatch(removeFromWishlist(productId)).unwrap();
          onToast("Removed from wishlist");
        } else {
          await dispatch(addToWishlist(productId)).unwrap();
          onToast("Added to wishlist ♥");
        }
      } catch (err) {
        console.error("Wishlist error:", err);
        onToast("Failed to update wishlist");
      }
    });
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    requireAuth(e, () => {
      const productId = item?._id || item?.id;
      dispatch(addToCartAsync({ productId, quantity: 1 }));
      onToast(`Added to bag: ${item.name || item.title}`);
    });
  };

  // ✅ Get product image - handle different field names
  const productImage = item?.image || item?.images?.[0] || item?.img || "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&w=600&q=80";

  // ✅ Get product title - handle different field names
  const productTitle = item?.name || item?.title || "Product";

  // ✅ Get product price - handle different field names
  const productPrice = item?.price || item?.mrp || 0;

  // ✅ Get product MRP (original price)
  const productMrp = item?.originalPrice || item?.mrp || item?.price || 0;

  // ✅ Get product discount
  const productDiscount = item?.discount || 0;

  // ✅ Get product category
  const productCategory = item?.category || item?.tag || "";

  // ✅ Check if bestseller
  const isBestseller = item?.bestseller || item?.isBestseller || false;

  // ✅ Check if new arrival
  const isNew = item?.isNew || item?.newArrival || false;

  // ✅ Get rating
  const productRating = item?.rating || 0;

  // ✅ Get reviews count
  const productReviews = item?.reviews || item?.reviewCount || 0;

  return (
    <div className="premium-product-card" onClick={handleProductClick} style={{ cursor: 'pointer' }}>
      <div className="product-image-box">
        <img
          src={productImage}
          alt={productTitle}
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&w=600&q=80";
          }}
        />

        {/* ✅ Bestseller Badge */}
        {isBestseller && (
          <div className="card-badge">
            <span>⭐</span>
            <span>Bestseller</span>
          </div>
        )}

        {/* ✅ New Arrival Badge */}
        {!isBestseller && isNew && (
          <div className="card-badge" style={{ color: "var(--purple)" }}>
            New Arrival
          </div>
        )}

        {/* ✅ Discount Badge */}
        {productDiscount > 0 && !isBestseller && !isNew && (
          <div className="card-badge" style={{ color: "var(--purple)" }}>
            {productDiscount}% OFF
          </div>
        )}

        {/* ✅ Wishlist Button */}
        <button
          className={`card-wishlist-btn${isLiked ? " active" : ""}`}
          onClick={handleWishlist}
          aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isLiked ? '♥' : '♡'}
        </button>

        {/* ✅ Quick Add Button */}
        <button className="quick-add-btn-premium" onClick={handleQuickAdd}>
          + Quick Add
        </button>
      </div>

      <div className="product-info-area">
        {/* ✅ Category/Tag */}
        {productCategory && (
          <span className="hero-stat-label tracking-ultra opacity-30 d-block mb-2" style={{ fontSize: "9px" }}>
            {productCategory.toUpperCase()}
          </span>
        )}

        {/* ✅ Product Title */}
        <Link to={`/product/${item?._id || item?.id}`} className="product-card-title" onClick={(e) => e.stopPropagation()}>
          {productTitle}
        </Link>

        {/* ✅ Price */}
        <div className="product-card-price">
          <span>₹{productPrice?.toLocaleString("en-IN")}</span>
          {productDiscount > 0 && productMrp > productPrice && (
            <span className="price-strike">
              ₹{productMrp?.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* ✅ Sub/Extra text like "(SEW)" */}
        {item?.sub && (
          <span className="hero-stat-label opacity-40" style={{ fontSize: "10px", marginTop: "4px" }}>
            {item.sub}
          </span>
        )}

        {/* ✅ Rating */}
        {productRating > 0 && (
          <div className="d-flex align-items-center justify-content-center gap-2" style={{ marginTop: "12px" }}>
            <Stars rating={productRating} />
            <span className="hero-stat-label opacity-40" style={{ fontSize: "10px" }}>
              ({productReviews > 0 ? `${productReviews} reviews` : "New"})
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
    <i className="ti ti-shopping-bag" style={{ fontSize: "36px", color: "var(--purple-mid)" }} />
    <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "22px", fontWeight: 500, color: "var(--ink)", margin: 0 }}>
      No products found{tab !== "all" ? ` in ${tab}` : ""}.
    </p>
    <p style={{ fontFamily: "Outfit, sans-serif", fontSize: "13px", color: "var(--ink-muted)", margin: 0 }}>
      Try a different category or check back soon.
    </p>
  </div>
);

// ─── PAGE ROOT ────────────────────────────────────────────────────────────────

export default function CollectionsSingleView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("all");
  const [sortOpen, setSortOpen] = useState(false);
  const { toast, showToast } = useToast();
  const isFirstRender = useRef(true);

  const collection = useSelector(selectCollection);
  const collectionStatus = useSelector(selectCollectionStatus);
  const products = useSelector(selectProducts);
  const productsStatus = useSelector(selectProductsStatus);
  const filters = useSelector(selectFilters);
  const pagination = useSelector(selectPagination);
  const categories = useSelector(selectCategories);
  const isAuth = useSelector((s) => s.login?.isAuthenticated);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fetch wishlist on mount if authenticated
  useEffect(() => {
    if (isAuth) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuth]);

  // Initial load
  useEffect(() => {
    dispatch(fetchCollectionById({
      id,
      category: activeTab,
      sortBy: filters.sortBy,
      page: filters.page
    }));
    return () => {
      dispatch(clearCollection());
      dispatch(clearFilters());
    };
  }, [dispatch, id]);

  // Re-fetch on sort / page / tab changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!id) return;
    dispatch(fetchCollectionById({
      id,
      category: activeTab,
      sortBy: filters.sortBy,
      page: filters.page
    }));
  }, [dispatch, id, activeTab, filters.sortBy, filters.page]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    dispatch(setPage(1));
  };

  const handleSort = (sort) => {
    dispatch(setSortBy(sort));
    setSortOpen(false);
  };

  // ── Loading ──
  if (collectionStatus === "loading" || (collectionStatus === "idle" && !collection)) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--ivory)" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "40px", height: "40px", border: "2px solid var(--border)", borderTopColor: "var(--purple)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          <p style={{ fontFamily: "Outfit, sans-serif", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-muted)" }}>
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
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px", background: "var(--ivory)" }}>
        <i className="ti ti-mood-sad" style={{ fontSize: "40px", color: "var(--purple-mid)" }} />
        <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "24px", color: "var(--ink)", margin: 0 }}>
          Collection not found.
        </p>
        <Link to="/collections" style={{ fontFamily: "Outfit, sans-serif", fontSize: "13px", color: "var(--purple)" }}>
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

      {/* Hero */}
      <CollectionHero collection={collection} />

      {/* Tabs */}
      <TabsBar categories={categories} activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Products section */}
      <section className="product-section">
        <div className="product-section-inner">


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
            // <Row className="gy-4">
            //   {[1, 2, 3].map((n) => (
            //     <Col key={n} lg={4} md={6}>
            //       <SkeletonCard />
            //     </Col>
            //   ))}
            // </Row>
            <div className="row gy-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="col-lg-4 col-md-6">
                  <SkeletonCard />
                </div>
              ))}
            </div>

          )}

          {/* Product grid */}
          {productsStatus !== "loading" && products.length > 0 && (
            // <Row className="gy-4">
            //   {products.map((item) => (
            //     <Col key={item._id} lg={4} md={6}>
            //       <ProductCard item={item} onToast={showToast} />
            //     </Col>
            //   ))}
            // </Row>
            <div className="row gy-4">
              {products.map((item) => (
                <div key={item._id} className="col-lg-4 col-md-6">
                  <ProductCard item={item} onToast={showToast} />
                </div>
              ))}
            </div>
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
        </div>
      </section>
    </div>
  );
}