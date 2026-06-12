// import React, { useEffect, useState, useCallback, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { Container, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
// import {
//   fetchSingleBrand,
//   fetchBrandProducts,
//   toggleCategory,
//   setSortBy,
//   setPage,
//   clearAllFilters,
//   clearBrand,
//   toggleWishlist,
//   selectFilters,
//   selectWishlist,
//   selectProductsStatus,
//   selectProducts,
//   selectPagination,
//   selectBrand,
//   selectBrandStatus,
// } from "../../redux/slices/brandpageSlice";
// import "./BrandDetails.css";

// // --- CONFIG ---
// const ALL_TABS = [
//   { value: "all", label: "All Products" },
//   { value: "skincare", label: "Skincare" },
//   { value: "makeup", label: "Makeup" },
//   { value: "haircare", label: "Haircare" },
//   { value: "fragrance", label: "Fragrance" },
// ];

// const BRAND_PILLARS = [
//   { icon: "🌿", label: "Clean ingredients" },
//   { icon: "🔬", label: "Clinically Proven" },
// ];

// // --- UTILS & HOOKS ---

// function useToast() {
//   const [toast, setToast] = useState({ msg: "", show: false });
//   const showToast = useCallback((msg) => {
//     setToast({ msg, show: true });
//     setTimeout(() => setToast((t) => ({ ...t, show: false })), 2200);
//   }, []);
//   return { toast, showToast };
// }

// function Stars({ rating }) {
//   return (
//     <div className="d-flex" style={{ color: 'var(--color-accent)', fontSize: '0.875rem' }}>
//       {[...Array(5)].map((_, i) => (
//         <i key={i} className={`ti ti-star${i < Math.round(rating) ? "-filled" : ""}`} />
//       ))}
//     </div>
//   );
// }

// // --- COMPONENTS ---

// const BrandHero = ({ brand }) => {
//   return (
//     <section className="hero-section">
//       <div className="hero-glow" />
//       <Container>
//         <Row className="align-items-center gy-5">
//           <Col lg={6} className="hero-content-left">
//             <div className="mb-4">
//               <span className="hero-tag tracking-ultra">01 / BRAND IDENTITY</span>
//             </div>

//             <div className="hero-logo-circle">
//               <img src={brand.logo || "/brand-logo-placeholder.png"} alt={brand.name} />
//             </div>

//             <h1 className="hero-title" data-name={brand.name}>{brand.name}</h1>
//             <p className="hero-description">
//               {brand.tagline || "Where molecular science meets the ethereal beauty of botanical extracts. A refulgent journey into the heart of luxury skincare."}
//             </p>

//             <div className="d-flex flex-wrap gap-5 mt-5">
//               <div>
//                 <div className="hero-stat-label">Origin</div>
//                 <div className="hero-stat-value">{brand.country || "Paris, FR"}</div>
//               </div>
//               <div>
//                 <div className="hero-stat-label">Founded</div>
//                 <div className="hero-stat-value">Est. {brand.founded || "2012"}</div>
//               </div>
//               <div>
//                 <div className="hero-stat-label">Status</div>
//                 <div className="hero-stat-value">{brand.isCrueltyFree ? "Cruelty-Free" : "Certified"}</div>
//               </div>
//             </div>
//           </Col>

//           <Col lg={6} className="position-relative">
//             <div className="hero-image-wrapper">
//               <img 
//                 src={brand.coverImage || "https://images.unsplash.com/photo-1582103645388-b85304592cb0?auto=format&w=1000&q=90&fit=crop"} 
//                 alt="Brand Showcase" 
//                 className="hero-image-main"
//               />
//               <div className="hero-image-accent-glow" />
//             </div>
//             <div className="hero-vertical-text d-none d-xl-block">
//               RADIANCE UNVEILED • SKINCARE COLLECTIVE
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </section>
//   );
// };

// const TabsBar = ({ activeTab, onTabChange }) => {
//   return (
//     <nav className="premium-tabs-bar">
//       <Container className="d-flex justify-content-center align-items-center overflow-auto">
//         {ALL_TABS.map((tab) => (
//           <a
//             key={tab.value}
//             href={`#${tab.value}`}
//             className={`category-tab ${activeTab === tab.value ? "active" : ""}`}
//             onClick={(e) => {
//               e.preventDefault();
//               onTabChange(tab.value);
//             }}
//           >
//             {tab.label}
//           </a>
//         ))}
//       </Container>
//     </nav>
//   );
// };

// const BrandStory = ({ brand }) => {
//   return (
//     <section className="brand-story-section">
//       <Container>
//         <h2 className="story-quote-large">
//           "{brand.storyTitle || "Radiance is not just a visual attribute, but a molecular state of harmony between nature and science."}"
//         </h2>

//         <Row className="story-columns gy-5">
//           <div className="story-center-divider d-none d-lg-flex">
//             <div className="story-center-icon">
//               <img src="/fragrance-icon.svg" alt="icon" />
//             </div>
//           </div>

//           <Col lg={6} className="pe-lg-5">
//             <div className="story-body-text">
//               <span className="story-drop-cap">{brand.name?.[0] || "R"}</span>
//               {brand.description || "Refulgent Essence was born in a small apothecary in the heart of Paris, driven by a singular vision: to create skincare that radiates from the deepest layers of the epidermis. Our founders believed that luxury shouldn't come at the cost of clinical integrity."}
//             </div>
//           </Col>

//           <Col lg={6} className="ps-lg-5">
//             <div className="story-legacy-box">
//               <div className="story-body-text-muted mb-5">
//                 Today, our laboratories continue this legacy, blending rare botanicals with patented molecular delivery systems. We are committed to refulgent luxury — a standard of beauty that is as sustainable as it is sophisticated, ensuring a glowing future for both your skin and the planet.
//               </div>
//               <div className="d-flex flex-wrap gap-4 pt-4 border-top border-muted-subtle">
//                 {BRAND_PILLARS.map((p) => (
//                   <div key={p.label} className="story-pillar">
//                     <span>{p.icon}</span>
//                     <span>{p.label}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </section>
//   );
// };

// const SaleBanner = () => {
//   return (
//     <section className="sale-banner-container">
//       <Container>
//         <div className="sale-banner-inner">
//           <div className="sale-banner-shadow-bg" />
//           <div className="sale-banner-main">
//             <Row className="w-100 align-items-center gy-5">
//               <Col lg={7}>
//                 <span className="sale-badge-text">The Curated Sale</span>
//                 <h3 className="sale-banner-title">The Summer Edit</h3>
//                 <p className="hero-description opacity-60 mb-5">
//                   A seasonal selection of our most refulgent formulas, curated for the modern minimalist.
//                 </p>
//                 <button className="sale-cta-btn">Explore the Curation</button>
//               </Col>

//               <Col lg={5} className="sale-percentage-area">
//                 <div className="position-relative d-inline-block">
//                   <span className="sale-big-number">40</span>
//                   <span className="sale-percent-symbol">%</span>
//                   <div className="hero-stat-label tracking-ultra opacity-80 text-center mt-n3">OFF CURATION</div>
//                 </div>

//                 <div className="sale-video-bubble d-none d-sm-block">
//                   <video 
//                     src="/sale-banner-video.mp4" 
//                     poster="https://images.pexels.com/videos/7677256/pexels-photo-7677256.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200"
//                     autoPlay muted loop playsInline 
//                   />
//                 </div>
//               </Col>
//             </Row>
//           </div>
//         </div>
//       </Container>
//     </section>
//   );
// };

// const ProductCard = ({ item, onToast }) => {
//   const dispatch = useDispatch();
//   const wishlist = useSelector(selectWishlist);
//   const isLiked = wishlist[item._id];

//   const handleWishlist = (e) => {
//     e.preventDefault();
//     dispatch(toggleWishlist(item._id));
//     onToast(isLiked ? "Removed from wishlist" : "Added to wishlist ♥");
//   };

//   const handleQuickAdd = (e) => {
//     e.preventDefault();
//     onToast(`Added to bag: ${item.name}`);
//   };

//   return (
//     <div className="premium-product-card">
//       <div className="product-image-box">
//         <img src={item.image} alt={item.name} loading="lazy" />

//         {item.bestseller && (
//           <div className="card-badge">
//             <img src="/sparkles-icon.svg" className="badge-icon" alt="sparkle" />
//             <span>Bestseller</span>
//           </div>
//         )}

//         {item.isNew && !item.bestseller && (
//           <div className="card-badge" style={{ color: 'var(--color-accent)' }}>New Arrival</div>
//         )}

//         <button 
//           className={`card-wishlist-btn ${isLiked ? "active" : ""}`}
//           onClick={handleWishlist}
//           aria-label="Toggle wishlist"
//         >
//           <i className={`ti ti-heart${isLiked ? "-filled" : ""}`} />
//         </button>

//         <button className="quick-add-btn-premium" onClick={handleQuickAdd}>+ Quick Add</button>
//       </div>

//       <div className="product-info-area">
//         <span className="hero-stat-label opacity-30 d-block mb-2">{item.tag || "SKINCARE / SERUM"}</span>
//         <Link to={`/product/${item._id}`} className="product-card-title text-decoration-none">{item.name}</Link>
//         <div className="product-card-price">
//           <span>₹{item.price?.toLocaleString()}</span>
//           {item.discount > 0 && (
//             <span className="price-strike">₹{item.mrp?.toLocaleString()}</span>
//           )}
//         </div>
//         <div className="d-flex align-items-center justify-content-center gap-2 mt-3">
//           <Stars rating={item.rating || 0} />
//           <span className="hero-stat-label opacity-40 font-bold">({item.reviews} Reviews)</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// const PremiumFooter = () => {
//   return (
//     <footer className="premium-site-footer">
//       <Container>
//         <Row className="gy-5">
//           <Col lg={3}>
//             <div className="footer-logo-text">Refulgent Luxury</div>
//             <p className="footer-brand-desc">
//               Elevating skincare to an art form. Our commitment to refulgent beauty is absolute.
//             </p>
//             <div className="social-links">
//               <a href="#" className="me-4"><i className="ti ti-brand-instagram fs-4" /></a>
//               <a href="#" className="me-4"><i className="ti ti-brand-pinterest fs-4" /></a>
//               <a href="#"><i className="ti ti-brand-youtube fs-4" /></a>
//             </div>
//           </Col>

//           <Col lg={2} md={4} className="offset-lg-1">
//             <h5 className="hero-stat-label tracking-ultra mb-4">Collection</h5>
//             <ul className="list-unstyled d-flex flex-column gap-3">
//               <li><a href="#" className="footer-link-item">New Arrivals</a></li>
//               <li><a href="#" className="footer-link-item">Bestsellers</a></li>
//               <li><a href="#" className="footer-link-item">Summer Curation</a></li>
//               <li><a href="#" className="footer-link-item">Gift Sets</a></li>
//             </ul>
//           </Col>

//           <Col lg={2} md={4}>
//             <h5 className="hero-stat-label tracking-ultra mb-4">Service</h5>
//             <ul className="list-unstyled d-flex flex-column gap-3">
//               <li><a href="#" className="footer-link-item">Shipping</a></li>
//               <li><a href="#" className="footer-link-item">Returns</a></li>
//               <li><a href="#" className="footer-link-item">Radiance Loyalty</a></li>
//               <li><a href="#" className="footer-link-item">Contact</a></li>
//             </ul>
//           </Col>

//           <Col lg={4} md={4}>
//             <h5 className="hero-stat-label tracking-ultra mb-4">Radiance Report</h5>
//             <p className="footer-brand-desc">Subscribe for ethereal insights and exclusive curations.</p>
//             <div className="newsletter-box">
//               <input type="email" placeholder="Email Address" className="newsletter-input" />
//               <button className="newsletter-btn">Join</button>
//             </div>
//           </Col>
//         </Row>

//         <div className="footer-bottom">
//           <span>© 2024 Refulgent Luxury Collective</span>
//           <div className="footer-legal">
//             <a href="#" className="me-4">Privacy Policy</a>
//             <a href="#" className="me-4">Terms of Use</a>
//             <a href="#">Accessibility</a>
//           </div>
//         </div>
//       </Container>
//     </footer>
//   );
// };

// // --- PAGE ROOT ---

// export default function BrandDetails() {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("all");
//   const [sortOpen, setSortOpen] = useState(false);
//   const { toast, showToast } = useToast();

//   const brand = useSelector(selectBrand);
//   const products = useSelector(selectProducts);
//   const brandStatus = useSelector(selectBrandStatus);
//   const filters = useSelector(selectFilters);
//   const pagination = useSelector(selectPagination);

//  useEffect(() => {
//   dispatch(fetchSingleBrand({ id }));
//   return () => {
//     dispatch(clearBrand());
//     dispatch(clearAllFilters());
//   };
// }, [dispatch, id]);
// const isFirstRender = useRef(true);
// useEffect(() => {
//   if (isFirstRender.current) {
//     isFirstRender.current = false;
//     return; // skip on mount — initial load handled above
//   }
//   if (!brand?._id) return; // safety guard

//   dispatch(fetchSingleBrand({
//     id: brand._id,
//     filters: {
//       category: activeTab,
//       sortBy:   filters.sortBy,
//       page:     filters.page,
//     }
//   }));
// }, [dispatch, activeTab, filters.sortBy, filters.page]);

//   const handleSort = (sort) => {
//     dispatch(setSortBy(sort));
//     setSortOpen(false);
//   };

//   if (brandStatus === "loading" || !brand) {
//     return (
//       <div className="bd-page-center">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="brand-details-container">
//       {/* Toast Notification */}
//       <div className={`bd-toast ${toast.show ? "show" : ""}`} role="status">
//         {toast.msg}
//       </div>

//       <nav className="premium-nav d-flex justify-content-between align-items-center">
//         <div className="nav-label tracking-ultra">Collection / 2024</div>
//         <Link to="/" className="nav-logo text-decoration-none text-dark">REFULGENT LUXURY</Link>
//         <div className="nav-links d-flex">
//           <Link to="#" className="nav-link text-decoration-none">Archive</Link>
//           <Link to="#" className="nav-link text-decoration-none">Sustainability</Link>
//           <Link to="#" className="nav-link active text-decoration-none">Shop</Link>
//         </div>
//       </nav>

//       <BrandHero brand={brand} />

//       <TabsBar activeTab={activeTab} onTabChange={setActiveTab} />

//       <BrandStory brand={brand} />

//       <SaleBanner />

//       <section className="product-section">
//         <Container>
//           <div className="products-section-title-area d-flex justify-content-between align-items-end flex-wrap gap-4">
//             <div>
//               <span className="section-tag">Product Collection</span>
//               <h2 className="section-title">Skincare Essentials</h2>
//             </div>

//             <div className="d-flex align-items-center gap-5">
//               <span className="hero-stat-label opacity-60">Total Items: {pagination.total || products.length}</span>
//               <Dropdown isOpen={sortOpen} toggle={() => setSortOpen(!sortOpen)}>
//                 <DropdownToggle tag="div" className="sort-dropdown">
//                   <span className="hero-stat-label">Sort by: {filters.sortBy}</span>
//                   <i className="ti ti-chevron-down" />
//                 </DropdownToggle>
//                 <DropdownMenu end>
//                   <DropdownItem onClick={() => handleSort("featured")}>Featured</DropdownItem>
//                   <DropdownItem onClick={() => handleSort("newest")}>Newest</DropdownItem>
//                   <DropdownItem onClick={() => handleSort("price-low")}>Price: Low to High</DropdownItem>
//                   <DropdownItem onClick={() => handleSort("price-high")}>Price: High to Low</DropdownItem>
//                 </DropdownMenu>
//               </Dropdown>
//             </div>
//           </div>

//           <Row className="gy-5">
//             {products.map((item) => (
//               <Col key={item._id} lg={4} md={6}>
//                 <ProductCard item={item} onToast={showToast} />
//               </Col>
//             ))}
//           </Row>

//           {pagination.pages > 1 && (
//             <div className="pagination-wrapper">
//               <button 
//                 className="pag-btn" 
//                 disabled={filters.page === 1}
//                 onClick={() => dispatch(setPage(filters.page - 1))}
//               >
//                 <i className="ti ti-arrow-left" />
//               </button>
//               <div className="pag-numbers">
//                 {[...Array(pagination.pages)].map((_, i) => (
//                   <div 
//                     key={i} 
//                     className={`pag-num ${filters.page === i + 1 ? "active" : ""}`}
//                     onClick={() => dispatch(setPage(i + 1))}
//                   >
//                     0{i + 1}
//                   </div>
//                 ))}
//               </div>
//               <button 
//                 className="pag-btn" 
//                 disabled={filters.page === pagination.pages}
//                 onClick={() => dispatch(setPage(filters.page + 1))}
//               >
//                 <i className="ti ti-arrow-right" />
//               </button>
//             </div>
//           )}
//         </Container>
//       </section>

//       <PremiumFooter />
//     </div>
//   );
// }
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Container, Row, Col,
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

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const ALL_TABS = [
  { value: "all", label: "All Products" },
  { value: "skincare", label: "Skincare" },
  { value: "makeup", label: "Makeup" },
  { value: "haircare", label: "Haircare" },
  { value: "fragrance", label: "Fragrance" },
];

const SORT_LABELS = {
  featured: "Featured",
  newest: "Newest",
  "price-low": "Price: Low to High",
  "price-high": "Price: High to Low",
  rating: "Top Rated",
};

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
    <div className="d-flex" style={{ color: "var(--color-accent)", fontSize: "0.875rem" }}>
      {[...Array(5)].map((_, i) => (
        <i key={i} className={`ti ti-star${i < Math.round(rating) ? "-filled" : ""}`} />
      ))}
    </div>
  );
}

// ─── BRAND HERO ──────────────────────────────────────────────────────────────

const BrandHero = ({ brand }) => {
  const fallbackCover = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&w=1000&q=90&fit=crop";

  return (
    <section className="hero-section">
      <div className="hero-glow" />
      <Container>
        <Row className="align-items-center gy-5">
          <Col lg={6} className="hero-content-left">
            <div className="mb-4">
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

            <div className="d-flex flex-wrap gap-5 mt-5">
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
          </Col>

          <Col lg={6} className="position-relative">
            <div className="hero-image-wrapper">
              <img
                src={brand.coverImage && brand.coverImage.startsWith("http") 
                  ? brand.coverImage 
                  : fallbackCover}
                alt={`${brand.name} showcase`}
                className="hero-image-main"
                onError={(e) => { e.target.src = fallbackCover; }}
              />
              {/* Decorative overlay frame */}
              <div className="hero-image-frame" />
              <div className="hero-image-accent-glow" />

              {/* Floating tag pill */}
              <div className="hero-float-pill">
                <span className="hero-float-dot" />
                Premium Collection
              </div>
            </div>
            <div className="hero-vertical-text d-none d-xl-block">
              RADIANCE UNVEILED • SKINCARE COLLECTIVE
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

// ─── TABS BAR ─────────────────────────────────────────────────────────────────

// ─── TABS BAR ─────────────────────────────────────────────────────────────────

const TabsBar = ({ activeTab, onTabChange }) => {
  return (
    <nav className="premium-tabs-bar">
      <Container className="d-flex justify-content-center align-items-center overflow-auto">
        {ALL_TABS.map((tab) => (
          <a
            key={tab.value}
            href={`#${tab.value}`}
            className={`category-tab ${activeTab === tab.value ? "active" : ""
              }`}
            onClick={(e) => {
              e.preventDefault();
              onTabChange(tab.value);
            }}
          >
            {tab.label}
          </a>
        ))}
      </Container>
    </nav>
  );
};

// ─── BRAND STORY ─────────────────────────────────────────────────────────────

const BRAND_PILLARS = [
  { icon: "🌿", label: "Clean ingredients" },
  { icon: "🔬", label: "Clinically Proven" },
];

const BrandStory = ({ brand }) => (
  <section className="brand-story-section">
    <Container>
      <h2 className="story-quote-large">
        "{brand.storyTitle || `${brand.name} — where beauty meets science.`}"
      </h2>

      <Row className="story-columns gy-5">
        <div className="story-center-divider d-none d-lg-flex">
          <div className="story-center-icon">
            <img src="/fragrance-icon.svg" alt="icon" />
          </div>
        </div>

        <Col lg={6} className="pe-lg-5">
          <div className="story-body-text">
            <span className="story-drop-cap">{brand.name?.[0] || "B"}</span>
            {brand.description || `${brand.name} is committed to delivering premium quality products that combine innovation with nature.`}
          </div>
        </Col>

        <Col lg={6} className="ps-lg-5">
          <div className="story-legacy-box">
            <div className="story-body-text-muted mb-5">
              {brand.story || "Our laboratories continue this legacy, blending rare botanicals with patented molecular delivery systems. We are committed to a standard of beauty that is as sustainable as it is sophisticated."}
            </div>
            <div className="d-flex flex-wrap gap-4 pt-4 border-top border-muted-subtle">
              {BRAND_PILLARS.map((p) => (
                <div key={p.label} className="story-pillar">
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  </section>
);

// ─── SALE BANNER ─────────────────────────────────────────────────────────────

const SaleBanner = () => (
  <section className="sale-banner-container">
    <Container>
      <div className="sale-banner-inner">
        <div className="sale-banner-shadow-bg" />
        <div className="sale-banner-main">
          <Row className="w-100 align-items-center gy-5">
            <Col lg={7}>
              <span className="sale-badge-text">The Curated Sale</span>
              <h3 className="sale-banner-title">The Summer Edit</h3>
              <p className="hero-description opacity-60 mb-5">
                A seasonal selection of our most refulgent formulas, curated for the modern minimalist.
              </p>
              <button className="sale-cta-btn">Explore the Curation</button>
            </Col>
            <Col lg={5} className="sale-percentage-area">
              <div className="position-relative d-inline-block">
                <span className="sale-big-number">40</span>
                <span className="sale-percent-symbol">%</span>
                <div className="hero-stat-label tracking-ultra opacity-80 text-center mt-n3">OFF CURATION</div>
              </div>
              <div className="sale-video-bubble d-none d-sm-block">
                <video
                  src="/sale-banner-video.mp4"
                  poster="https://images.pexels.com/videos/7677256/pexels-photo-7677256.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200"
                  autoPlay muted loop playsInline
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Container>
  </section>
);

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

const ProductCard = ({ item, onToast }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector(selectWishlist);
  const isLiked = wishlist[item._id];

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
          src={item.image || "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&w=600&q=80"}
          alt={item.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&w=600&q=80";
          }}
        />

        {item.bestseller && (
          <div className="card-badge">
            <img src="/sparkles-icon.svg" className="badge-icon" alt="sparkle" />
            <span>Bestseller</span>
          </div>
        )}
        {item.isNew && !item.bestseller && (
          <div className="card-badge" style={{ color: "var(--color-accent)" }}>New Arrival</div>
        )}
        {item.discount > 0 && !item.bestseller && !item.isNew && (
          <div className="card-badge" style={{ color: "var(--color-accent)" }}>
            {item.discount}% OFF
          </div>
        )}

        <button
          className={`card-wishlist-btn ${isLiked ? "active" : ""}`}
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
        >
          <i className={`ti ti-heart${isLiked ? "-filled" : ""}`} />
        </button>

        <button className="quick-add-btn-premium" onClick={handleQuickAdd}>
          + Quick Add
        </button>
      </div>

      <div className="product-info-area">
        {item.tag && (
          <span className="hero-stat-label opacity-30 d-block mb-2">
            {item.tag}
          </span>
        )}
        {!item.tag && item.category && (
          <span className="hero-stat-label opacity-30 d-block mb-2">
            {item.category.toUpperCase()}
          </span>
        )}

        <Link to={`/product/${item._id}`} className="product-card-title text-decoration-none">
          {item.name}
        </Link>

        <div className="product-card-price">
          <span>₹{item.price?.toLocaleString("en-IN")}</span>
          {item.discount > 0 && item.mrp > item.price && (
            <span className="price-strike">₹{item.mrp?.toLocaleString("en-IN")}</span>
          )}
        </div>

        {item.rating > 0 && (
          <div className="d-flex align-items-center justify-content-center gap-2 mt-3">
            <Stars rating={item.rating} />
            <span className="hero-stat-label opacity-40 font-bold">
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
  <div className="text-center py-5" style={{ opacity: 0.5 }}>
    <i className="ti ti-shopping-bag" style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }} />
    <p className="hero-stat-label" style={{ fontSize: "0.9rem" }}>
      No products found{activeTab !== "all" ? ` in ${activeTab}` : ""}.
    </p>
  </div>
);

// ─── FOOTER ──────────────────────────────────────────────────────────────────

const PremiumFooter = () => (
  <footer className="premium-site-footer">
    <Container>
      <Row className="gy-5">
        <Col lg={3}>
          <div className="footer-logo-text">Refulgent Luxury</div>
          <p className="footer-brand-desc">
            Elevating skincare to an art form. Our commitment to refulgent beauty is absolute.
          </p>
          <div className="social-links">
            <a href="#" className="me-4"><i className="ti ti-brand-instagram fs-4" /></a>
            <a href="#" className="me-4"><i className="ti ti-brand-pinterest fs-4" /></a>
            <a href="#"><i className="ti ti-brand-youtube fs-4" /></a>
          </div>
        </Col>
        <Col lg={2} md={4} className="offset-lg-1">
          <h5 className="hero-stat-label tracking-ultra mb-4">Collection</h5>
          <ul className="list-unstyled d-flex flex-column gap-3">
            {["New Arrivals", "Bestsellers", "Summer Curation", "Gift Sets"].map(l => (
              <li key={l}><a href="#" className="footer-link-item">{l}</a></li>
            ))}
          </ul>
        </Col>
        <Col lg={2} md={4}>
          <h5 className="hero-stat-label tracking-ultra mb-4">Service</h5>
          <ul className="list-unstyled d-flex flex-column gap-3">
            {["Shipping", "Returns", "Radiance Loyalty", "Contact"].map(l => (
              <li key={l}><a href="#" className="footer-link-item">{l}</a></li>
            ))}
          </ul>
        </Col>
        <Col lg={4} md={4}>
          <h5 className="hero-stat-label tracking-ultra mb-4">Radiance Report</h5>
          <p className="footer-brand-desc">Subscribe for ethereal insights and exclusive curations.</p>
          <div className="newsletter-box">
            <input type="email" placeholder="Email Address" className="newsletter-input" />
            <button className="newsletter-btn">Join</button>
          </div>
        </Col>
      </Row>
      <div className="footer-bottom">
        <span>© 2024 Refulgent Luxury Collective</span>
        <div className="footer-legal">
          <a href="#" className="me-4">Privacy Policy</a>
          <a href="#" className="me-4">Terms of Use</a>
          <a href="#">Accessibility</a>
        </div>
      </div>
    </Container>
  </footer>
);

// ─── PAGE ROOT ────────────────────────────────────────────────────────────────

export default function BrandDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("all");
  const [sortOpen, setSortOpen] = useState(false);
  const { toast, showToast } = useToast();
  const isFirstRender = useRef(true);

  const brand = useSelector(selectBrand);
  const products = useSelector(selectProducts);
  const brandStatus = useSelector(selectBrandStatus);
  const productsStatus = useSelector(selectProductsStatus);
  const filters = useSelector(selectFilters);
  const pagination = useSelector(selectPagination);

  // ── Initial load — single API call, returns brand + products
  useEffect(() => {
    dispatch(fetchSingleBrand({ id }));
    return () => {
      dispatch(clearBrand());
      dispatch(clearAllFilters());
    };
  }, [dispatch, id]);

  // Only re-fetch for sort and page changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!id) return;
    dispatch(fetchSingleBrand({
      id,
      category: activeTab,
      sortBy: filters.sortBy,
      page: filters.page,
    }));
  }, [filters.sortBy, filters.page]); // ← removed activeTab

  const handleSort = (sort) => {
    dispatch(setSortBy(sort));
    setSortOpen(false);
  };


  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // setPage(1) won't trigger re-fetch if already page 1
    // so dispatch directly with the new tab
    dispatch(fetchSingleBrand({
      id,
      category: tab,
      sortBy: filters.sortBy,
      page: 1,
    }));
    dispatch(setPage(1));
  };

  // ── Loading state
  if (brandStatus === "loading" || (brandStatus === "idle" && !brand)) {
    return (
      <div className="bd-page-center" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // ── Error / not found
  if (brandStatus === "failed" || !brand) {
    return (
      <div className="bd-page-center" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
        <p style={{ opacity: 0.5 }}>Brand not found.</p>
        <Link to="/">← Back to home</Link>
      </div>
    );
  }

  return (
    <div className="brand-details-container">
      {/* Toast */}
      <div className={`bd-toast ${toast.show ? "show" : ""}`} role="status">
        {toast.msg}
      </div>

      {/* Nav */}
      <nav className="premium-nav d-flex justify-content-between align-items-center">
        <div className="nav-label tracking-ultra">Collection / 2024</div>
        <Link to="/" className="nav-logo text-decoration-none text-dark">REFULGENT LUXURY</Link>
        <div className="nav-links d-flex">
          <Link to="#" className="nav-link text-decoration-none">Archive</Link>
          <Link to="#" className="nav-link text-decoration-none">Sustainability</Link>
          <Link to="#" className="nav-link active text-decoration-none">Shop</Link>
        </div>
      </nav>

      <BrandHero brand={brand} />

      <TabsBar activeTab={activeTab} onTabChange={handleTabChange} />

      <BrandStory brand={brand} />

      <SaleBanner />

      {/* Products */}
      <section className="product-section">
        <Container>
          <div className="products-section-title-area d-flex justify-content-between align-items-end flex-wrap gap-4">
            <div>
              <span className="section-tag">Product Collection</span>
              <h2 className="section-title">{brand.name} Products</h2>
            </div>

            <div className="d-flex align-items-center gap-5">
              <span className="hero-stat-label opacity-60">
                Total Items: {pagination.total ?? products.length}
              </span>
              <Dropdown isOpen={sortOpen} toggle={() => setSortOpen(!sortOpen)}>
                <DropdownToggle tag="div" className="sort-dropdown" style={{ cursor: "pointer" }}>
                  <span className="hero-stat-label">
                    Sort by: {SORT_LABELS[filters.sortBy] || filters.sortBy}
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

          {/* Products loading skeleton */}
          {productsStatus === "loading" && (
            <Row className="gy-5">
              {[1, 2, 3].map((n) => (
                <Col key={n} lg={4} md={6}>
                  <div style={{ background: "var(--color-surface)", aspectRatio: "3/4", borderRadius: 4, opacity: 0.5 }} />
                </Col>
              ))}
            </Row>
          )}

          {/* Products grid */}
          {productsStatus !== "loading" && products.length > 0 && (
            <Row className="gy-5">
              {products.map((item) => (
                <Col key={item._id} lg={4} md={6}>
                  <ProductCard item={item} onToast={showToast} />
                </Col>
              ))}
            </Row>
          )}

          {/* Empty state */}
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
                    className={`pag-num ${filters.page === i + 1 ? "active" : ""}`}
                    onClick={() => dispatch(setPage(i + 1))}
                  >
                    0{i + 1}
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