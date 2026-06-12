import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  hideToast,

  showToast,
  toggleCart,
} from "../redux/slices/uiSlice";
import hero1 from "../assets/hero1.png";
import hero2 from "../assets/hero2.png";
import hero3 from "../assets/hero1.png";
import beautyVideo from "../assets/beauty-video.mp4";
import {
  addToCartAsync,
  removeItemAsync,
} from "../redux/reducers/thunks/cartThunks";
import { removeFromWishlist } from "../redux/reducers/thunks/wishlistActions";
import axios from "axios";

import { fetchHomeData } from "../redux/reducers/thunks/homeThunks";
import { fetchDeals } from "../redux/reducers/thunks/dealsThunks";
import { fetchCategoryBanners } from "../redux/reducers/thunks/categoryBannersThunks";
import { fetchBrandBanners, fetchBrands, selectActiveBanner, selectBanners, setActiveBanner } from "../redux/slices/brandpageSlice";
import { loginReset } from "../redux/slices/loginSlice";
import { clearSuggestions, fetchSuggestions } from "../redux/slices/searchSlice";
import { fetchActiveOffer } from "../redux/slices/offerSlice";
import './promoBanner.css';
import './luxebrand.css';
import "./DealsCarousel.css";
import { fetchProducts } from "../redux/reducers/thunks/productThunks";
import { fetchCategoriesApi } from "../api/productApi";
import { setCategory } from "../redux/slices/productSlice";
import BannerCarousel from "../components/BannerCarousel";
import DealsCarousel from "../components/DealsCarousel";
import NewArrivalsSection from "../components/NewArrivalsSection";
import FeaturedProductsSection from "../components/FeaturedProductsSection";
import BestSellersSection from "../components/BestSellers";
/* ─────────────────────────────────────────────────────────────────────────────
   API BASE
───────────────────────────────────────────────────────────────────────────── */
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const MEDIA_URL = BASE_URL.replace("/api", ""); // e.g. "http://localhost:5000"

const resolveImg = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${MEDIA_URL}${path}`;
};

/* ─────────────────────────────────────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');

:root {
  --ink:        #1a1a2e;
  --ink-60:     rgba(26,26,46,0.6);
  --ink-30:     rgba(26,26,46,0.3);
  --white:      #ffffff;
  --white-2:    #f8f9ff;
  --purple:     #7c3aed;
  --purple-2:   #8b5cf6;
  --purple-3:   #a78bfa;
  --purple-pale: #f0eaff;
  --purple-light:#ede9fe;
  --lavender:   #c4b5fd;
  --blush:      #fbcfe8;
  --blush-2:    #fce7f3;
  --forest:     #2d4a3e;
  --charcoal:   #1e1e2f;
  --mid:        #6b6b7a;
  --border:     rgba(124,58,237,0.18);
  --border-2:   rgba(26,26,46,0.08);
  --r:  16px;
  --r2: 24px;
  --r3: 40px;
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Outfit',sans-serif;background:var(--white);color:var(--ink);overflow-x:hidden}
h1,h2,h3,h4,h5{font-family:'Cormorant Garamond',serif;line-height:1.1}
::selection{background:var(--purple-2);color:white}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:var(--white-2)}
::-webkit-scrollbar-thumb{background:var(--purple);border-radius:4px}

@keyframes fadeUp     {from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn     {from{opacity:0}to{opacity:1}}
@keyframes slideRight {from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes marquee    {0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes shimmerP   {0%{background-position:-400% center}100%{background-position:400% center}}
@keyframes float      {0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes carouselIn {from{opacity:0;transform:scale(1.04)}to{opacity:1;transform:scale(1)}}
@keyframes pulseRing  {0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,0.4)}50%{box-shadow:0 0 0 14px rgba(124,58,237,0)}}
@keyframes spin       {to{transform:rotate(360deg)}}
@keyframes ripple     {0%{transform:scale(0.8);opacity:1}100%{transform:scale(2);opacity:0}}
@keyframes slideUp    {from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:translateY(0)}}
@keyframes glow       {0%,100%{filter:drop-shadow(0 0 8px rgba(124,58,237,0.4))}50%{filter:drop-shadow(0 0 20px rgba(124,58,237,0.7))}}

.anim-fadeUp  {animation:fadeUp 0.75s cubic-bezier(0.16,1,0.3,1) both}
.anim-fadeIn  {animation:fadeIn 0.6s ease both}
.float        {animation:float 5s ease-in-out infinite}

.serif{font-family:'Cormorant Garamond',serif}
.sans{font-family:'Outfit',sans-serif}

.shimmer-purple{
  background:linear-gradient(90deg,var(--purple) 0%,var(--purple-2) 40%,var(--purple) 60%,var(--purple-2) 100%);
  background-size:400% auto;
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;animation:shimmerP 5s linear infinite
}
.gradient-text{
  background:linear-gradient(135deg,var(--purple) 0%,var(--purple-2) 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text
}
.stroke-text{-webkit-text-stroke:1.5px var(--purple);color:transparent;font-family:'Cormorant Garamond',serif}

.ornament-divider{display:flex;align-items:center;gap:16px;justify-content:center;margin:0 auto}
.ornament-divider::before,.ornament-divider::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--purple),transparent);max-width:120px}

.etiquette{
  display:inline-flex;align-items:center;gap:7px;
  background:var(--purple-pale);border:1px solid var(--border);
  color:var(--purple);border-radius:100px;padding:5px 16px;
  font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;font-family:'Outfit',sans-serif
}

.btn-purple{
  background:var(--purple);color:white;border:none;border-radius:100px;
  padding:13px 32px;font-family:'Outfit',sans-serif;font-weight:700;font-size:13px;
  cursor:pointer;transition:all .3s ease;letter-spacing:.5px;text-transform:uppercase
}
.btn-purple:hover{background:var(--purple-2);transform:translateY(-2px);box-shadow:0 14px 36px rgba(124,58,237,.38)}

.btn-outline-dark{
  background:transparent;color:var(--ink);border:1.5px solid var(--ink);border-radius:100px;
  padding:12px 30px;font-family:'Outfit',sans-serif;font-weight:600;font-size:13px;
  cursor:pointer;transition:all .3s ease;letter-spacing:.5px;text-transform:uppercase
}
.btn-outline-dark:hover{background:var(--ink);color:var(--white);transform:translateY(-2px)}

.btn-ghost-white{
  background:rgba(255,255,255,.12);color:white;border:1.5px solid rgba(255,255,255,.3);
  border-radius:100px;padding:12px 30px;font-family:'Outfit',sans-serif;font-weight:600;
  font-size:13px;cursor:pointer;transition:all .3s ease;letter-spacing:.5px;
  text-transform:uppercase;backdrop-filter:blur(10px)
}
.btn-ghost-white:hover{background:rgba(255,255,255,.22);transform:translateY(-2px)}

.card-lift{
  background:white;border:1px solid var(--border-2);border-radius:var(--r2);
  transition:all .4s cubic-bezier(0.16,1,0.3,1)
}
.card-lift:hover{border-color:var(--purple);box-shadow:0 20px 56px rgba(124,58,237,.12);transform:translateY(-8px)}

.section-line{height:1px;background:linear-gradient(90deg,transparent 0%,var(--purple) 50%,transparent 100%);opacity:.3}

.marquee-track{animation:marquee 28s linear infinite}
.marquee-track:hover{animation-play-state:paused}

/* Skeleton loader */
.skeleton{
  background:linear-gradient(90deg,#f0eaff 25%,#e8dcff 50%,#f0eaff 75%);
  background-size:200% 100%;animation:shimmerP 1.5s infinite;border-radius:8px
}

/* Lazy image fade */
.img-lazy{opacity:0;transition:opacity .5s ease}
.img-lazy.loaded{opacity:1}
`;

/* ─────────────────────────────────────────────────────────────────────────────
   STATIC DATA (fallbacks / editorial)
───────────────────────────────────────────────────────────────────────────── */

const CAT_ICONS = { All: "✦", Skincare: "💧", Lips: "💄", Eyes: "👁", Face: "🌸" };

const HERO_SLIDES = [
  { type: "image", media: hero1, label: "New Season", title: "Glow\nNaturally", subtitle: "Luxury skincare and beauty essentials crafted for radiant, effortless confidence.", button: "Shop Now" },
  { type: "video", media: beautyVideo, label: "Trending Now", title: "Beauty\nRedefined", subtitle: "Experience premium beauty products designed for every skin tone and style.", button: "Explore Collection" },
  { type: "image", media: hero2, label: "Bestsellers", title: "Luxury Makeup\nCollection", subtitle: "Elevate your everyday look with our most-loved makeup products.", button: "Discover More" },
  { type: "image", media: hero3, label: "Skincare Edit", title: "Skincare That\nLoves You", subtitle: "Hydrate, nourish, and glow with dermatologist-approved formulas.", button: "View Products" },
];

const REELS_DATA = [
  { id: 1, views: "285K", brand: "Maybelline", title: "New Cloudtopia cheek & lip mousse", img: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=400", products: 5, price: "₹699" },
  { id: 2, views: "65.3K", brand: "YSL", title: "Cute packaging made me buy it", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=400", products: 4, price: "₹7,600" },
  { id: 3, views: "5.6K", brand: "Trending", title: "Fruit inspired beauty trend: Guava", img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=400", products: 6, price: "₹1,299" },
  { id: 4, views: "120K", brand: "Maybelline", title: "JUST IN: Maybelline's Serum Lipstick", img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400", products: 6, price: "₹850" },
];

const REVIEWS = [
  { id: 1, name: "Aanya Sharma", loc: "Mumbai", role: "Beauty Enthusiast", avatar: "A", rating: 5, text: "ShopHub transformed my skincare routine. The glow serum is absolutely divine — my skin has never looked better!" },
  { id: 2, name: "Priya Nair", loc: "Bengaluru", role: "Makeup Artist", avatar: "P", rating: 5, text: "The lipstick collection is unreal. Velvet Matte stays all day without drying. I have bought every shade available!" },
  { id: 3, name: "Kavya Reddy", loc: "Chennai", role: "Skincare Blogger", avatar: "K", rating: 5, text: "Best beauty destination online. Fast delivery, authentic products, and the packaging is so luxurious!" },
];

const STEPS = [
  { n: "01", title: "Cleanse", desc: "Remove impurities and prep your skin for optimal absorption.", emoji: "🧼" },
  { n: "02", title: "Tone", desc: "Balance your skin's pH for deeper product penetration.", emoji: "💦" },
  { n: "03", title: "Serum", desc: "Target specific concerns with concentrated actives.", emoji: "✨" },
  { n: "04", title: "Moisturise", desc: "Lock in hydration for plump, supple, glowing skin.", emoji: "💧" },
  { n: "05", title: "SPF", desc: "Always finish with broad-spectrum sun protection.", emoji: "☀️" },
];

const FEATURES = [
  { icon: "🚚", title: "Free Delivery", desc: "Free shipping on orders above ₹499. Express delivery available.", stat: "2-Day" },
  { icon: "🔄", title: "Easy Returns", desc: "30-day hassle-free returns. No questions asked policy.", stat: "30 Days" },
  { icon: "🔒", title: "Secure Payment", desc: "100% secure checkout with PCI-DSS compliance.", stat: "100%" },
  { icon: "💯", title: "100% Authentic", desc: "All products sourced directly from authorised distributors.", stat: "Verified" },
];

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */
const Stars = ({ rating }) => (
  <span>
    {[1, 2, 3, 4, 5].map(i => (
      <span key={i} style={{ color: i <= Math.round(rating) ? "#7c3aed" : "#d8cfc0", fontSize: 13 }}>★</span>
    ))}
  </span>
);

const Spinner = () => (
  <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
    <div style={{ width: 36, height: 36, border: "3px solid var(--purple-light)", borderTopColor: "var(--purple)", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
  </div>
);

const ProductSkeleton = () => (
  <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid var(--border-2)" }}>
    <div className="skeleton" style={{ height: 200 }} />
    <div style={{ padding: "20px 22px 24px" }}>
      <div className="skeleton" style={{ height: 12, width: "60%", marginBottom: 10 }} />
      <div className="skeleton" style={{ height: 18, width: "80%", marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 12, width: "40%", marginBottom: 18 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="skeleton" style={{ height: 22, width: 60 }} />
        <div className="skeleton" style={{ height: 36, width: 90, borderRadius: 100 }} />
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   TOAST
───────────────────────────────────────────────────────────────────────────── */
const Toast = () => {
  const dispatch = useDispatch();
  const toast = useSelector(s => s.ui.toast);
  useEffect(() => {
    if (toast) { const t = setTimeout(() => dispatch(hideToast()), 2800); return () => clearTimeout(t); }
  }, [toast, dispatch]);
  if (!toast) return null;
  return (
    <div style={{
      position: "fixed", bottom: 32, right: 32, zIndex: 9999,
      background: "var(--charcoal)", color: "var(--white)",
      padding: "14px 24px", borderRadius: 14,
      boxShadow: "0 12px 48px rgba(0,0,0,0.28)",
      animation: "slideRight .4s cubic-bezier(0.16,1,0.3,1)",
      border: "1px solid rgba(124,58,237,0.3)",
      fontSize: 14, fontWeight: 500,
      display: "flex", alignItems: "center", gap: 12,
      fontFamily: "Outfit, sans-serif",
    }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--purple)", display: "inline-block", flexShrink: 0, animation: "pulseRing 2s infinite" }} />
      {toast}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────────────────────────────────────── */




const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { suggestions } = useSelector((state) => state.searchReducer);
  const user = useSelector(s => s.login?.user ?? null);
  const cartCount = useSelector(s => s.cart.items.reduce((a, i) => a + i.qty, 0));
  const wishCount = useSelector(s => s.wishlist.items.length);

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        dispatch(fetchSuggestions(searchQuery));
      } else {
        dispatch(clearSuggestions());
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);
  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);

    dispatch(clearSuggestions());
    setSearchOpen(false);
  };

  // close dropdown on outside click
  useEffect(() => {
    const fn = (e) => {
      if (!e.target.closest(".profile-wrap")) setDropdownOpen(false);
    };
    document.addEventListener("click", fn);
    return () => document.removeEventListener("click", fn);
  }, []);



  const requireAuth = (path) => {
    if (!user) navigate("/login");
    else navigate(path);
  };

  const handleLogout = () => {
    dispatch(loginReset());
    localStorage.removeItem("shophub_user");
    localStorage.removeItem("token");
    setDropdownOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/products" },
    { label: "Collections", to: "/products?category=all" },
    { label: "Brands", to: "/products?brand=all" },
    { label: "About", to: "/about" },
  ];

  const iconBtn = {
    background: "transparent",
    border: "1px solid var(--border-2)",
    borderRadius: 100,
    cursor: "pointer",
    transition: "all .2s",
    display: "flex",
    alignItems: "center",
    position: "relative",
  };

  return (
    <>
      {/* ── Search overlay ── */}
      {searchOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(26,26,46,0.5)",
            zIndex: 1100,
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: 120
          }}
          onClick={() => setSearchOpen(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: 20,
              padding: 8,
              width: "min(640px,90vw)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
              border: "1px solid var(--border)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <form
              onSubmit={handleSearch}
              style={{
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div style={{ display: "flex" }}>
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);

                    if (e.target.value.trim().length >= 2) {
                      dispatch(fetchSuggestions(e.target.value));
                    }
                  }}
                  placeholder="Search for products, brands, categories…"
                  style={{
                    flex: 1,
                    padding: "16px 24px",
                    border: "none",
                    outline: "none",
                    fontSize: 15,
                    fontFamily: "Outfit",
                    color: "var(--ink)",
                    background: "transparent",
                  }}
                />

                <button
                  type="submit"
                  className="btn-purple"
                  style={{
                    borderRadius: 14,
                    padding: "12px 24px",
                    margin: 4
                  }}
                >
                  🔍
                </button>
              </div>

              {suggestions?.length > 0 && (
                <div
                  style={{
                    marginTop: 8,
                    borderTop: "1px solid #eee",
                    maxHeight: 300,
                    overflowY: "auto"
                  }}
                >
                  {suggestions.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => {
                        navigate(`/search?q=${encodeURIComponent(item.name)}`);
                        setSearchOpen(false);
                        dispatch(clearSuggestions());
                      }}
                      style={{
                        padding: "12px 20px",
                        cursor: "pointer",
                        borderBottom: "1px solid #f5f5f5"
                      }}
                    >
                      🔍 {item.name}
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ── Navbar ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: scrolled ? "1px solid rgba(124,58,237,0.2)" : "1px solid transparent",
        transition: "all .35s ease",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.06)" : "none",
      }}>
        <div style={{
          maxWidth: 1360, margin: "0 auto", padding: "0 48px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", height: 72,
        }}>

          {/* ── Logo ── */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "var(--purple)", display: "flex",
              alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 700, fontSize: 18,
              fontFamily: "Cormorant Garamond, serif", letterSpacing: 1,
            }}>S</div>
            <div>
              <span style={{
                fontFamily: "Cormorant Garamond, serif",
                fontWeight: 600, fontSize: 24,
                color: "var(--charcoal)", letterSpacing: .5,
              }}>
                Shop<span style={{ color: "var(--purple)" }}>Hub</span>
              </span>
              <div style={{
                fontSize: 9, letterSpacing: 3, color: "var(--mid)",
                textTransform: "uppercase", fontWeight: 500, marginTop: -2,
              }}>
                Beauty Atelier
              </div>
            </div>
          </Link>

          {/* ── Nav links ── */}
          <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
            {navLinks.map(l => (
              <Link
                key={l.label} to={l.to}
                style={{
                  color: "var(--mid)", textDecoration: "none",
                  fontSize: 13.5, fontWeight: 500, letterSpacing: .8,
                  fontFamily: "Outfit", textTransform: "uppercase",
                  transition: "color .2s",
                }}
                onMouseEnter={e => { e.target.style.color = "var(--ink)" }}
                onMouseLeave={e => { e.target.style.color = "var(--mid)" }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* ── Right actions ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              style={{ ...iconBtn, padding: "8px 18px", gap: 6, fontSize: 13, color: "var(--mid)", fontFamily: "Outfit", fontWeight: 500 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--purple)"; e.currentTarget.style.color = "var(--ink)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-2)"; e.currentTarget.style.color = "var(--mid)" }}
            >
              🔍 <span>Search</span>
            </button>

            {/* Cart */}
            <button
              onClick={() => requireAuth("/cart")}
              style={{ ...iconBtn, padding: "8px 14px", fontSize: 16 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--purple)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-2)" }}
            >
              🛒
              {user && cartCount > 0 && (
                <span style={{
                  position: "absolute", top: 2, right: 2,
                  background: "var(--purple)", color: "white",
                  borderRadius: "50%", width: 16, height: 16,
                  fontSize: 9, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => requireAuth("/wishlist")}
              style={{ ...iconBtn, padding: "8px 14px", fontSize: 16, color: "var(--mid)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--purple)"; e.currentTarget.style.color = "var(--ink)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-2)"; e.currentTarget.style.color = "var(--mid)" }}
            >
              ♡
              {user && wishCount > 0 && (
                <span style={{
                  position: "absolute", top: 2, right: 2,
                  background: "var(--blush)", color: "var(--purple)",
                  borderRadius: "50%", width: 16, height: 16,
                  fontSize: 9, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {wishCount}
                </span>
              )}
            </button>

            {/* ── Auth section ── */}
            {user ? (
              // Profile pill + dropdown
              <div
                className="profile-wrap"
                style={{ position: "relative" }}
              >
                <button
                  onClick={() => setDropdownOpen(v => !v)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "transparent",
                    border: "1.5px solid var(--border-2)",
                    borderRadius: 100, padding: "6px 14px 6px 6px",
                    cursor: "pointer", transition: "all .2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--purple)" }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-2)" }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "var(--purple)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontWeight: 700, fontSize: 12, fontFamily: "Outfit",
                  }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: 600, color: "var(--ink)",
                    fontFamily: "Outfit", maxWidth: 90,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {user.name?.split(" ")[0]}
                  </span>
                  {/* chevron */}
                  <span style={{
                    fontSize: 10, color: "var(--mid)",
                    transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform .2s", display: "inline-block",
                  }}>▼</span>
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 10px)", right: 0,
                    background: "white", borderRadius: 16,
                    boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
                    border: "1px solid var(--border)",
                    minWidth: 180, overflow: "hidden",
                    animation: "slideUp .2s ease",
                    zIndex: 999,
                  }}>
                    {/* User info header */}
                    <div style={{
                      padding: "14px 18px",
                      borderBottom: "1px solid var(--border)",
                      background: "var(--blush)",
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", fontFamily: "Outfit" }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--mid)", fontFamily: "Outfit", marginTop: 2 }}>
                        {user.email}
                      </div>
                    </div>

                    {/* Profile link */}
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "12px 18px", textDecoration: "none",
                        color: "var(--ink)", fontSize: 13, fontFamily: "Outfit",
                        fontWeight: 500, transition: "background .15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#f5f3ff" }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
                    >
                      👤 My Profile
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "12px 18px", textDecoration: "none",
                        color: "var(--ink)", fontSize: 13, fontFamily: "Outfit",
                        fontWeight: 500, transition: "background .15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#f5f3ff" }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
                    >
                      📦 My Orders
                    </Link>

                    {/* Divider */}
                    <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 10,
                        padding: "12px 18px", background: "transparent",
                        border: "none", cursor: "pointer",
                        color: "#ef4444", fontSize: 13, fontFamily: "Outfit",
                        fontWeight: 600, transition: "background .15s",
                        textAlign: "left",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2" }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    borderRadius: 100, padding: "9px 22px", fontSize: 12.5,
                    textDecoration: "none", color: "var(--ink)", fontWeight: 600,
                    border: "1.5px solid var(--border-2)", fontFamily: "Outfit",
                    transition: "all .2s", letterSpacing: .5, textTransform: "uppercase",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--purple)" }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-2)" }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  style={{
                    borderRadius: 100, padding: "9px 22px", fontSize: 12.5,
                    textDecoration: "none", color: "white", fontWeight: 700,
                    background: "var(--purple)", fontFamily: "Outfit",
                    transition: "all .2s", letterSpacing: .5, textTransform: "uppercase",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--purple-2)" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "var(--purple)" }}
                >
                  Join Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};


// const BannerSection = () => {
//   // const state = useSelector((state) => state);
//   // console.log(state);
//   const dispatch = useDispatch();
//   const banners = useSelector(selectBanners);
//   const active = useSelector(selectActiveBanner);
//   useEffect(() => {
//     dispatch(fetchBrandBanners());
//     dispatch(fetchBrands());
//   }, [dispatch]);
//   useEffect(() => {
//     if (!banners.length) return;
//     const t = setInterval(() => {
//       dispatch(setActiveBanner((active + 1) % banners.length));
//     }, 4000);
//     return () => clearInterval(t);
//   }, [active, banners.length, dispatch]);

//   if (!banners.length) return <div className="banner-skeleton" />;

//   return (
//     <div className="banner-section">
//       {banners.map((ban, i) => (
//         <div key={ban._id} className={`banner-slide${i === active ? " active" : ""}`}>
//           <div className="banner-img-wrap">
//             <img src={ban.image} alt={ban.title} />
//             <div className="banner-overlay" />
//           </div>
//         </div>
//       ))}
//       <div className="banner-dots">
//         {banners.map((_, i) => (
//           <button
//             key={i}
//             className={`dot${i === active ? " active" : ""}`}
//             onClick={() => dispatch(setActiveBanner(i))}
//             aria-label={`Go to banner ${i + 1}`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }


/* ─────────────────────────────────────────────────────────────────────────────
   HERO CAROUSEL
───────────────────────────────────────────────────────────────────────────── */
const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((p) => (p + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = HERO_SLIDES[current];

  return (
    <section style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      {slide.type === "video" ? (
        <video key={current} autoPlay muted loop playsInline src={slide.media}
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <img src={slide.media} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      )}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.15)" }} />
      <div style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 10, zIndex: 10 }}>
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            style={{ width: current === i ? 30 : 8, height: 8, borderRadius: 20, border: "none", background: current === i ? "#7c3aed" : "rgba(255,255,255,0.5)", transition: "0.3s", cursor: "pointer" }} />
        ))}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   BRAND STRIP MARQUEE
───────────────────────────────────────────────────────────────────────────── */
const BrandStrip = () => {
  const dispatch = useDispatch();
  useEffect(() => { dispatch(fetchBrands()); }, [dispatch]);
  const { brands, brandsStatus } = useSelector((state) => state.brands);
  if (brandsStatus === "loading") return null;
  const marqueeBrands = [...brands, ...brands];

  return (
    <div style={{ background: "var(--charcoal)", padding: "14px 0", overflow: "hidden" }}>
      <div className="marquee-track" style={{ display: "flex", gap: 64, whiteSpace: "nowrap", width: "max-content", alignItems: "center" }}>
        {marqueeBrands.map((brand, index) => (
          <div key={`${brand._id}-${index}`} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: "rgba(139,92,246,0.55)", textTransform: "uppercase" }}>
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   INSIDER BUZZ
───────────────────────────────────────────────────────────────────────────── */
const InsiderBuzz = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories, insiderBuzz, loading } = useSelector((state) => state.home);

  useEffect(() => { dispatch(fetchHomeData()); }, [dispatch]);

  return (
    <section style={{ padding: "72px 0", background: "var(--white-2)" }}>
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 28, alignItems: "start" }}>

          <div style={{ background: "linear-gradient(135deg, var(--purple) 0%, var(--purple-2) 100%)", borderRadius: 24, padding: "36px 28px", color: "white", cursor: "pointer", position: "relative", overflow: "hidden", minHeight: 240, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
            onClick={() => navigate("/products")}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
            <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "Cormorant Garamond, serif", lineHeight: 1.1, marginBottom: 8 }}>INSIDER<br />BUZZ</div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, opacity: 0.7, textTransform: "uppercase" }}>✦ Beauty Edition</div>
            </div>
            <div>
              <p style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.7, marginBottom: 16, fontFamily: "Outfit" }}>Get The Complete Beauty Lowdown</p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", background: "rgba(255,255,255,0.15)", borderRadius: 100, padding: "8px 18px" }}>
                EXPLORE MORE →
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 16 }}>
            {insiderBuzz.map((item, i) => (
              <div key={i} style={{ cursor: "pointer", transition: "transform .3s" }}>
                <div style={{ height: 180, borderRadius: 16, overflow: "hidden", marginBottom: 10, position: "relative" }}>
                  <img src={item.img} alt={item.label} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(124,58,237,0.25), transparent)" }} />
                </div>
                <p style={{ fontSize: 12, color: "var(--mid)", lineHeight: 1.5, fontFamily: "Outfit", fontWeight: 500 }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 16, marginTop: 40 }}>
          {categories.map((cat, i) => (
            <div key={i} style={{ cursor: "pointer", textAlign: "center", transition: "transform .3s" }}
              onClick={() => navigate(`/products?category=${cat.name.toLowerCase()}`)}>
              <div style={{ height: 140, borderRadius: 18, overflow: "hidden", position: "relative", marginBottom: 10 }}>
                <img src={cat.img} alt={cat.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,26,46,0.7), transparent)" }} />
                <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, textAlign: "center" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#fce7f3", background: "rgba(124,58,237,0.8)", borderRadius: 100, padding: "3px 10px", letterSpacing: 0.5 }}>UP TO 50% OFF</span>
                </div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--ink)", fontFamily: "Outfit" }}>{cat.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   STATS BAND
───────────────────────────────────────────────────────────────────────────── */
const StatsBand = () => (
  <section style={{ padding: "72px 48px", background: "var(--white)" }}>
    <div style={{ maxWidth: 1360, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1 }}>
      {[
        { num: "4.8★", label: "Average Rating", sub: "From 50K+ verified reviews" },
        { num: "200K+", label: "Happy Customers", sub: "Worldwide beauty devotees" },
        { num: "5000+", label: "Premium Products", sub: "Curated collection" },
        { num: "100%", label: "Authentic Always", sub: "Verified sourcing" },
      ].map((s, i) => (
        <div key={i} style={{ padding: "48px 36px", textAlign: "center", background: i % 2 === 0 ? "white" : "var(--white-2)", borderRight: i < 3 ? "1px solid var(--border-2)" : "none", borderTop: "3px solid transparent", transition: "border-top-color .3s", cursor: "default" }}
          onMouseEnter={e => e.currentTarget.style.borderTopColor = "var(--purple)"}
          onMouseLeave={e => e.currentTarget.style.borderTopColor = "transparent"}>
          <div style={{ fontSize: 46, fontWeight: 700, fontFamily: "Cormorant Garamond,serif", color: "var(--charcoal)", marginBottom: 8, letterSpacing: -1 }}>{s.num}</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: 5, letterSpacing: .3 }}>{s.label}</div>
          <div style={{ fontSize: 12, color: "var(--mid)", fontFamily: "Outfit" }}>{s.sub}</div>
        </div>
      ))}
    </div>
  </section>
);

/* ─────────────────────────────────────────────────────────────────────────────
   LUXE BRANDS GRID
───────────────────────────────────────────────────────────────────────────── */


const LuxeBrandsGrid = () => {
  const navigate = useNavigate();
  const brands = useSelector((state) => state.brands.brands) ?? [];

  // row1: first 2 brands, row2: next 3 brands (or however many exist)
  const row1 = brands.slice(0, 2);
  const row2 = brands.slice(2, 5);

  return (
    <section className="lb-section">
      <div className="lb-container">

        {/* ── Header ── */}
        <div className="lb-header">
          <div className="lb-header-left">
            <div className="lb-eyebrow">Curated Selection</div>
            <h2 className="lb-heading">
              ShopHub <em>Luxe</em>
            </h2>
          </div>
          <button className="lb-viewall" onClick={() => navigate("/brands")}>
            View all brands →
          </button>
        </div>

        {/* ── Grid ── */}
        <div className="lb-grid">

          {/* Hero card — spans 2 rows */}
          <div
            className="lb-card lb-card--hero"
            onClick={() => navigate("/products?brand=luxury")}
          >
            <img
              src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800"
              alt="Luxe Travel"
            />
            <div className="lb-overlay lb-overlay--hero" />
            <div className="lb-card-body">
              <div className="lb-card-tag">Featured Edit</div>
              <div className="lb-card-name lb-card-name--lg">
                Shop Beauty<br />On the Move
              </div>
            </div>
          </div>

          {/* Row 1 — 2 brand cards */}
          {row1.map((b) => (
            <div
              key={b._id || b.name}
              className="lb-card lb-card--md"
              onClick={() => navigate(`/products?brand=${b.name.toLowerCase()}`)}
            >
              <img src={resolveImg(b.logo)} alt={b.name} loading="lazy" />
              <div className="lb-overlay" />
              <div className="lb-card-body">
                <div className="lb-card-tag">{b.category || "Brand"}</div>
                <div className="lb-card-name">{b.name}</div>
                {b.sub && <div className="lb-card-sub">{b.sub}</div>}
              </div>
            </div>
          ))}

          {/* Row 2 — 3 brand cards */}
          {row2.map((b) => (
            <div
              key={b._id || b.name}
              className="lb-card lb-card--sm"
              onClick={() => navigate(`/products?brand=${b.name.toLowerCase()}`)}
            >
              <img src={resolveImg(b.logo)} alt={b.name} loading="lazy" />
              <div className="lb-overlay" />
              <div className="lb-card-body">
                <div className="lb-card-tag">{b.category || "Brand"}</div>
                <div className="lb-card-name">{b.name}</div>
                {b.sub && <div className="lb-card-sub">{b.sub}</div>}
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};



/* ─────────────────────────────────────────────────────────────────────────────
   SHOPPABLE REELS
───────────────────────────────────────────────────────────────────────────── */
const ShoppableReels = () => {
  const [active, setActive] = useState(null);
  const navigate = useNavigate();

  return (
    <section style={{ padding: "100px 0", background: "var(--charcoal)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 80%, rgba(124,58,237,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(124,58,237,0.05) 0%, transparent 50%)" }} />
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 48px", position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 52 }}>
          <div>
            <div className="etiquette" style={{ marginBottom: 18, background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", color: "var(--purple-2)" }}>▶ Beauty Reels</div>
            <h2 style={{ fontSize: "clamp(2.2rem,4vw,3.6rem)", fontWeight: 600, color: "white", letterSpacing: -.5 }}>
              Shop The <span className="shimmer-purple">Look</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14.5, marginTop: 8, fontFamily: "Outfit" }}>Click a reel to shop featured products instantly</p>
          </div>
          <button className="btn-ghost-white" onClick={() => navigate("/products")} style={{ fontSize: 12 }}>View All Reels →</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          {REELS_DATA.map(reel => (
            <div key={reel.id} style={{ position: "relative", borderRadius: 24, overflow: "hidden", cursor: "pointer", transition: "transform .35s" }}
              onClick={() => setActive(active === reel.id ? null : reel.id)}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-6px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}>
              <img src={reel.img} alt={reel.title} loading="lazy" style={{ width: "100%", height: 360, objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,26,46,0.9) 0%, rgba(26,26,46,0.2) 50%, transparent 100%)" }} />
              <div style={{ position: "absolute", top: 14, left: 14, background: "rgba(0,0,0,0.5)", borderRadius: 100, padding: "4px 12px", fontSize: 11, color: "white", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 9 }}>👁</span> {reel.views}
              </div>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "white", backdropFilter: "blur(8px)", transition: "all .25s" }}>▶</div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 18px 18px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "var(--purple-3)", textTransform: "uppercase", marginBottom: 4 }}>{reel.brand}</div>
                <p style={{ fontSize: 13.5, color: "white", lineHeight: 1.5, marginBottom: 12, fontFamily: "Outfit" }}>{reel.title}</p>
                {active === reel.id ? (
                  <div style={{ background: "white", borderRadius: 14, padding: "12px 16px", animation: "slideUp .3s ease", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--mid)", fontFamily: "Outfit" }}>{reel.products} products featured</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", fontFamily: "Cormorant Garamond, serif" }}>From {reel.price}</div>
                    </div>
                    <button className="btn-purple" style={{ padding: "8px 16px", fontSize: 11 }} onClick={e => { e.stopPropagation(); navigate("/products"); }}>Shop Now →</button>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontFamily: "Outfit" }}>{reel.products} products</span>
                    <span style={{ fontSize: 11, color: "var(--purple-3)", fontWeight: 600 }}>Tap to shop</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   TOP BRANDS CAROUSEL
───────────────────────────────────────────────────────────────────────────── */


const VISIBLE = 4;
const GAP = 28;

const TopBrandsCarousel = () => {
  const [offset, setOffset] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const trackRef = useRef(null);
  const timerRef = useRef(null);

  const dispatch = useDispatch();
  const brands = useSelector(state => state.brands.brands) ?? [];
  const activeBrands = (brands || []).filter(b => b.active);
  const max = Math.max(activeBrands.length - VISIBLE, 0);

  useEffect(() => { dispatch(fetchBrands()); }, [dispatch]);

  // ✅ Measure track width after paint + on resize
  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const totalGap = GAP * (VISIBLE - 1);
      setCardWidth((trackRef.current.offsetWidth - totalGap) / VISIBLE);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeBrands.length]);

  const goTo = useCallback((n) => {
    setOffset(Math.max(0, Math.min(n, max)));
  }, [max]);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setOffset(p => (p >= max ? 0 : p + 1));
    }, 3500);
  }, [max]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  const handleNav = (dir) => {
    goTo(offset + dir);
    startTimer();
  };

  const arrowBtn = {
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: "1px solid #e5e7eb",
    background: "white",
    fontSize: 20,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s",
  };

  return (
    <section style={{ padding: "60px 0 80px", background: "#fafafa", overflow: "hidden" }}>

      {/* Header */}
      <div style={{
        padding: "0 60px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 36,
      }}>
        <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 700, color: "#111" }}>
          Top Brands On Offer
        </h2>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => handleNav(-1)}
            disabled={offset === 0}
            style={{ ...arrowBtn, opacity: offset === 0 ? 0.4 : 1 }}
          >
            ‹
          </button>
          <button
            onClick={() => handleNav(1)}
            disabled={offset >= max}
            style={{ ...arrowBtn, opacity: offset >= max ? 0.4 : 1 }}
          >
            ›
          </button>
        </div>
      </div>

      {/* Track */}
      <div ref={trackRef} style={{ overflow: "hidden", margin: "0 60px" }}>
        <div
          style={{
            display: "flex",
            gap: GAP,
            alignItems: "flex-start",
            transition: "transform 0.5s cubic-bezier(.4,0,.2,1)",
            transform: `translateX(-${offset * (cardWidth + GAP)}px)`,
          }}
        >
          {activeBrands.map((b) => (
            <div
              key={b._id}
              style={{
                flex: `0 0 calc(${100 / VISIBLE}% - ${(GAP * (VISIBLE - 1)) / VISIBLE}px)`,
                borderRadius: 20,
                background: "#fff",
                border: "1px solid #efefef",
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              {/* Full-bleed image */}
              <div style={{ height: 200, overflow: "hidden", flexShrink: 0 }}>
                <img
                  src={resolveImg(b.logo)}
                  alt={b.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  onError={e => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `
                      <div style="
                        width:100%;height:100%;display:flex;
                        align-items:center;justify-content:center;
                        background:#f3f0ff;font-size:42px;
                        font-weight:700;color:#7c3aed;
                      ">${b.name[0]}</div>`;
                  }}
                />
              </div>

              {/* Card body */}
              <div style={{ padding: "16px 20px 22px" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111", margin: 0 }}>
                  {b.name}
                </h3>
                <p style={{ fontSize: 13, color: "#888", marginTop: 5, marginBottom: 0 }}>
                  {b.sub || "Premium Brand"}
                </p>
                <button
                  style={{
                    marginTop: 16,
                    padding: "9px 22px",
                    borderRadius: 30,
                    border: "none",
                    background: "#7c3aed",
                    color: "#fff",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 13,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#6d28d9"}
                  onMouseLeave={e => e.currentTarget.style.background = "#7c3aed"}
                >
                  Shop Now →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32 }}>
        {Array.from({ length: max + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => { goTo(i); startTimer(); }}
            style={{
              width: i === offset ? 24 : 8,
              height: 8,
              borderRadius: 20,
              border: "none",
              padding: 0,
              background: i === offset ? "#7c3aed" : "#ddd",
              cursor: "pointer",
              transition: "width 0.2s, background 0.2s",
            }}
          />
        ))}
      </div>

    </section>
  );
};









/* ─────────────────────────────────────────────────────────────────────────────
   FEATURES SECTION
───────────────────────────────────────────────────────────────────────────── */
const FeaturesSection = () => (
  <section style={{ padding: "100px 0", background: "var(--charcoal)", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 15% 85%, rgba(124,58,237,0.08) 0%, transparent 50%), radial-gradient(circle at 85% 15%, rgba(124,58,237,0.05) 0%, transparent 50%)" }} />
    <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 48px", position: "relative", zIndex: 2 }}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <div className="etiquette" style={{ marginBottom: 20, background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", color: "var(--purple-2)" }}>✦ Why Choose Us</div>
        <h2 style={{ fontSize: "clamp(2.2rem,4vw,3.6rem)", fontWeight: 600, color: "white", marginBottom: 14, letterSpacing: -.5 }}>
          Shopping that feels <span className="shimmer-purple">luxurious</span>
        </h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, maxWidth: 480, margin: "0 auto", lineHeight: 1.85, fontFamily: "Outfit" }}>
          Premium beauty shopping with authentic products and unmatched service.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, border: "1px solid rgba(124,58,237,0.15)", borderRadius: 24, overflow: "hidden" }}>
        {FEATURES.map((f, i) => (
          <div key={i} style={{ padding: "44px 32px", background: i % 2 === 0 ? "rgba(255,255,255,0.03)" : "rgba(124,58,237,0.04)", borderRight: i < 3 ? "1px solid rgba(124,58,237,0.12)" : "none", cursor: "default", transition: "background .3s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "rgba(255,255,255,0.03)" : "rgba(124,58,237,0.04)"}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "var(--purple-2)", textTransform: "uppercase", marginBottom: 14 }}>{f.stat}</div>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 20 }}>{f.icon}</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10, color: "white", fontFamily: "Cormorant Garamond,serif", letterSpacing: .3 }}>{f.title}</h3>
            <p style={{ color: "rgba(255,255,255,0.42)", lineHeight: 1.85, fontSize: 13.5, fontFamily: "Outfit" }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────────────────────────────────────────── */
const ProductCard = ({ p }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inWish = useSelector(s => s.wishlist.items.some(i => i.id === p._id || i.id === p.id));
  const [hov, setHov] = useState(false);

  const productId = p._id || p.id;
  const price = p.price || p.salePrice || 0;
  const name = p.name || p.title || "Product";
  const image = p.images?.[0] || p.image || null;
  const emoji = p.emoji || "✨";
  const rating = p.rating?.average || p.rating || 4.5;
  const reviews = p.rating?.count || p.reviews || 0;
  const badge = p.badge || (p.isBestSeller ? "Best Seller" : p.isNew ? "New" : "");
  const category = p.category || "Beauty";

  const cartProduct = { id: productId, name, price, image: resolveImg(image), emoji, category };

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ borderRadius: 20, overflow: "hidden", background: "white", border: `1.5px solid ${hov ? "var(--purple)" : "var(--border-2)"}`, transition: "all .4s cubic-bezier(0.16,1,0.3,1)", transform: hov ? "translateY(-10px)" : "none", boxShadow: hov ? "0 24px 56px rgba(124,58,237,0.14)" : "0 2px 12px rgba(0,0,0,0.04)", cursor: "pointer", position: "relative" }}>

      {badge && (
        <div style={{ position: "absolute", top: 14, left: 14, zIndex: 2, background: badge === "Best Seller" ? "var(--purple)" : badge === "New" ? "var(--forest)" : "var(--charcoal)", color: "white", borderRadius: 100, padding: "4px 13px", fontSize: 9.5, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{badge}</div>
      )}

      <button onClick={e => { e.stopPropagation(); dispatch(removeFromWishlist({ id: productId })); dispatch(showToast(inWish ? "Removed from wishlist" : "✦ Added to wishlist!")); }}
        style={{ position: "absolute", top: 14, right: 14, zIndex: 2, background: inWish ? "var(--purple-pale)" : "rgba(255,255,255,0.9)", border: `1px solid ${inWish ? "var(--purple)" : "var(--border-2)"}`, borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, cursor: "pointer", color: inWish ? "var(--purple)" : "var(--mid)", transition: "all .3s" }}>
        {inWish ? "♥" : "♡"}
      </button>

      <div onClick={() => navigate(`/product/${productId}`)}
        style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", background: `radial-gradient(ellipse at center, rgba(124,58,237,0.1) 0%, var(--white-2) 100%)`, overflow: "hidden", borderBottom: "1px solid var(--border-2)" }}>
        {image ? (
          <img src={resolveImg(image)} alt={name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s", transform: hov ? "scale(1.06)" : "scale(1)" }} />
        ) : (
          <span style={{ fontSize: 72, transition: "transform .4s", display: "block", transform: hov ? "scale(1.1)" : "scale(1)" }}>{emoji}</span>
        )}
      </div>

      <div style={{ padding: "20px 22px 24px" }}>
        <div style={{ fontSize: 9.5, color: "var(--purple)", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{category}</div>
        <h3 onClick={() => navigate(`/product/${productId}`)} style={{ fontSize: 17, fontWeight: 600, marginBottom: 10, lineHeight: 1.3, color: "var(--ink)", fontFamily: "Cormorant Garamond,serif" }}>{name}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 18 }}>
          <Stars rating={rating} />
          {reviews > 0 && <span style={{ fontSize: 11, color: "var(--mid)" }}>({reviews})</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 24, fontWeight: 600, color: "var(--ink)", fontFamily: "Cormorant Garamond,serif" }}>₹{price}</span>
          <button onClick={e => { e.stopPropagation(); dispatch(addToCartAsync(cartProduct)); dispatch(showToast(`✦ ${name} added!`)); }}
            className="btn-purple" style={{ borderRadius: 100, padding: "9px 20px", fontSize: 11 }}>
            + Cart
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   PRODUCTS SECTION
───────────────────────────────────────────────────────────────────────────── */
const ProductsSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    items = [],
    loading,
    error,
    selectedCategory
  } = useSelector((state) => state.products);

  const [categories, setCategories] = useState(["All"]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const activeCategory = selectedCategory;
  // ✅ Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const res = await fetchCategoriesApi();
        if (res.data.success) {
          setCategories(["All", ...res.data.categories]);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    loadCategories();
  }, []);

  // ✅ Single useEffect — fetch products when selectedCategory changes

  const handleCategoryClick = (c) => {
    dispatch(setCategory(c)); // keep display value as-is for UI
  };

  useEffect(() => {
    const category = selectedCategory === "All" ? "" : selectedCategory;
    console.log("🟡 dispatching fetchProducts, category:", category);
    dispatch(fetchProducts({ category }));
  }, [selectedCategory, dispatch]);
  const isActive = (c) => selectedCategory?.toLowerCase() === c.toLowerCase();

  const formatLabel = (c) =>
    c === "All" ? "All" : c.charAt(0).toUpperCase() + c.slice(1).toLowerCase();

  return (
    <section style={{ padding: "104px 0", background: "var(--white)" }}>
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 48px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div className="etiquette">✦ Our Collection</div>
          <h2>Bestselling <span className="gradient-text">Products</span></h2>
        </div>

        {/* Categories */}
        <div style={{
          display: "flex", gap: 10, flexWrap: "wrap",
          justifyContent: "center", marginBottom: 48
        }}>
          {categoriesLoading ? (
            <div>Loading categories...</div>
          ) : (
            categories.map((c) => (
              <button
                key={c}
                onClick={() => handleCategoryClick(c)}
                style={{
                  padding: "10px 26px",
                  borderRadius: 100,
                  border: isActive(c) ? "1.5px solid var(--purple)" : "1.5px solid var(--border-2)",
                  background: isActive(c) ? "var(--purple)" : "white",
                  color: isActive(c) ? "white" : "var(--mid)",
                  fontWeight: isActive(c) ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  textTransform: "uppercase"
                }}
              >
                {CAT_ICONS?.[c]} {formatLabel(c)}
              </button>
            ))
          )}
        </div>

        {/* Products */}
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : items.length === 0 ? (
          <div>No products found</div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 24
          }}>
            {items.map((p) => (
              <ProductCard key={p._id || p.id} p={p} />
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 52 }}>
          <button
            onClick={() => navigate("/products")}
            className="btn-purple"
            style={{
              padding: "14px 48px",
              fontSize: 13,
              letterSpacing: 1.5,
              borderRadius: 100,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "var(--purple-2)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 14px 36px rgba(124,58,237,0.38)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "var(--purple)";
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            VIEW ALL PRODUCTS
            <span style={{ fontSize: 16, transition: "transform 0.2s" }}>→</span>
          </button>
        </div>
      </div>
    </section>
  );
};
/* ─────────────────────────────────────────────────────────────────────────────
   CATEGORY BANNERS
───────────────────────────────────────────────────────────────────────────── */
const CategoryBanners = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { banners } = useSelector((state) => state.categoryBanners);
  const safeBanners = banners || [];

  useEffect(() => {
    dispatch(fetchCategoryBanners());
  }, [dispatch]);

  return (
    <section style={{ padding: "100px 0", background: "var(--white-2)" }}>
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 48px" }}>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div className="etiquette">✦ Shop By Category</div>
          <h2 style={{ fontSize: "clamp(2rem,4vw,3.4rem)", fontWeight: 600 }}>
            Explore <span className="gradient-text">Collections</span>
          </h2>
        </div>

        {/* GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>

          {safeBanners.map((b) => (
            <div
              key={b._id}
              style={{
                borderRadius: 24,
                overflow: "hidden",
                position: "relative",
                height: 300,
                cursor: "pointer",
                transition: "transform .35s, box-shadow .35s"
              }}
              onClick={() =>
                navigate(`/products?category=${b.category}`)
              }
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 24px 60px rgba(124,58,237,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
            >

              {/* Image */}
              <img
                src={b.img}
                alt={b.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />

              {/* Overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, rgba(26,26,46,0.7) 0%, rgba(26,26,46,0.15) 100%)"
                }}
              />

              {/* Content */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  padding: 32,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <p style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.7)",
                    textTransform: "uppercase",
                    letterSpacing: 1
                  }}>
                    {b.sub}
                  </p>

                  <h3 style={{
                    fontSize: "clamp(1.8rem,3vw,2.8rem)",
                    fontWeight: 700,
                    color: "white"
                  }}>
                    {b.offer}
                  </h3>
                </div>

                <div>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 2,
                    color: b.accent,
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: 100,
                    padding: "6px 16px"
                  }}>
                    Shop {b.title} →
                  </span>
                </div>
              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   PROMO BANNER
───────────────────────────────────────────────────────────────────────────── */
const PromoBanner = () => {
  const dispatch = useDispatch();
  const { offer } = useSelector((state) => state.offer);

  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [copied, setCopied] = useState(false);
  const [tick, setTick] = useState(false);

  useEffect(() => {
    dispatch(fetchActiveOffer());
  }, [dispatch]);

  useEffect(() => {
    if (!offer?.expiresAt) return;
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(offer.expiresAt).getTime();
      const distance = end - now;

      if (distance <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
        return;
      }

      setTick((t) => !t);
      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [offer?.expiresAt]);

  const handleCopy = () => {
    navigator.clipboard?.writeText("BEAUTY30");
    dispatch(showToast("✦ Code BEAUTY30 copied!"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const tiles = [
    { value: countdown.days, label: "Days" },
    { value: countdown.hours, label: "Hours" },
    { value: countdown.minutes, label: "Mins" },
    { value: countdown.seconds, label: "Secs" },
  ];

  return (
    <section className="pb-section">
      {/* Concentric rings */}
      <div className="pb-ring pb-ring--1" />
      <div className="pb-ring pb-ring--2" />
      <div className="pb-ring pb-ring--3" />
      <div className="pb-ring pb-ring--4" />

      {/* Ambient glow */}
      <div className="pb-glow" />

      <div className="pb-inner">
        {/* Eyebrow */}
        <div className="pb-eyebrow">
          <span className="pb-eyebrow-dot" />
          Limited time offer
        </div>

        {/* Headline */}
        <h2 className="pb-heading">
          Get{" "}
          <span className="pb-heading-accent">
            30% off
          </span>
          <br />
          <em className="pb-heading-italic">your first order</em>
        </h2>

        {/* Subtext */}
        <p className="pb-sub">
          Use code{" "}
          <span className="pb-code-inline">BEAUTY30</span>
          {" "}at checkout · Valid on all skincare &amp; makeup
        </p>

        {/* Countdown */}
        <div className="pb-clock">
          {tiles.map(({ value, label }, i) => (
            <>
              <div className="pb-tile" key={label}>
                <div className="pb-tile-top-line" />
                <div
                  className={`pb-tile-num ${label === "Secs" && tick ? "pb-tile-num--tick" : ""}`}
                >
                  {String(value).padStart(2, "0")}
                </div>
                <div className="pb-tile-label">{label}</div>
              </div>
              {i < tiles.length - 1 && (
                <div key={`sep-${i}`} className="pb-separator">:</div>
              )}
            </>
          ))}
        </div>

        {/* CTA */}
        <div className="pb-actions">
          <button className={`pb-btn-copy ${copied ? "pb-btn-copy--done" : ""}`} onClick={handleCopy}>
            <span className="pb-btn-icon">{copied ? "✓" : "⊕"}</span>
            {copied ? "Copied!" : "Copy code — BEAUTY30"}
          </button>
          <button className="pb-btn-ghost">Explore collection</button>
        </div>

        {/* Fine print */}
        <p className="pb-fine">One use per customer · Cannot be combined with other offers</p>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   SKINCARE ROUTINE
───────────────────────────────────────────────────────────────────────────── */
const SkincareRoutine = () => (
  <section style={{ padding: "104px 0", background: "var(--white-2)" }}>
    <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 48px" }}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <div className="etiquette" style={{ marginBottom: 18 }}>✦ Beauty Education</div>
        <h2 style={{ fontSize: "clamp(2.2rem,4vw,3.6rem)", fontWeight: 600, color: "var(--ink)", marginBottom: 12, letterSpacing: -.5 }}>
          The Perfect <span className="gradient-text">Skincare Ritual</span>
        </h2>
        <p style={{ color: "var(--mid)", fontSize: 15 }}>Your step-by-step guide to glowing, radiant skin</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 20, position: "relative" }}>
        <div style={{ position: "absolute", top: 52, left: "6%", right: "6%", height: 1, background: "linear-gradient(90deg, var(--purple), var(--blush), var(--purple))", opacity: .3 }} />
        {STEPS.map((step, i) => (
          <div key={step.n} style={{ textAlign: "center", position: "relative" }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", margin: "0 auto 24px", background: "white", border: "2px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, position: "relative", zIndex: 1, boxShadow: "0 8px 28px rgba(124,58,237,0.12)", transition: "all .35s", cursor: "default" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.12)"; e.currentTarget.style.boxShadow = "0 18px 44px rgba(124,58,237,0.22)"; e.currentTarget.style.borderColor = "var(--purple)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(124,58,237,0.12)"; e.currentTarget.style.borderColor = "var(--border)" }}>
              {step.emoji}
              <div style={{ position: "absolute", top: -8, right: -4, background: "var(--charcoal)", color: "var(--purple-2)", width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9.5, fontWeight: 700, border: "2px solid var(--white-2)" }}>{i + 1}</div>
            </div>
            <h4 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8, color: "var(--ink)", fontFamily: "Cormorant Garamond,serif", letterSpacing: .3 }}>{step.title}</h4>
            <p style={{ fontSize: 12.5, color: "var(--mid)", lineHeight: 1.8 }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────────────────────────────────────────── */
const TestimonialsSection = () => {
  const [active, setActive] = useState(0);
  return (
    <section style={{ padding: "104px 0", background: "white" }}>
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 48px" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div className="etiquette" style={{ marginBottom: 18 }}>✦ Customer Love</div>
          <h2 style={{ fontSize: "clamp(2.2rem,4vw,3.6rem)", fontWeight: 600, color: "var(--ink)", letterSpacing: -.5 }}>
            What Our <span className="gradient-text">Customers Say</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {REVIEWS.map((r, i) => (
            <div key={r.id} onClick={() => setActive(i)}
              style={{ padding: "38px 34px", background: active === i ? "var(--purple-pale)" : "white", border: `1.5px solid ${active === i ? "var(--purple)" : "var(--border-2)"}`, borderRadius: 24, transition: "all .4s cubic-bezier(0.16,1,0.3,1)", transform: active === i ? "translateY(-8px)" : "none", boxShadow: active === i ? "0 20px 48px rgba(124,58,237,0.14)" : "none", cursor: "pointer", position: "relative" }}>
              <div style={{ fontSize: 72, color: "var(--purple)", opacity: .15, lineHeight: .8, fontFamily: "Georgia", position: "absolute", top: 24, right: 28 }}>❝</div>
              <p style={{ color: "var(--ink-60)", lineHeight: 1.9, marginBottom: 24, fontSize: 14.5, fontStyle: "italic", fontFamily: "Cormorant Garamond,serif" }}>{r.text}</p>
              <Stars rating={r.rating} />
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--charcoal)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 600, color: "var(--purple)", flexShrink: 0, border: "2px solid var(--purple)" }}>{r.avatar}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14.5, color: "var(--ink)" }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: "var(--mid)" }}>{r.role} · {r.loc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   NEWSLETTER
───────────────────────────────────────────────────────────────────────────── */
const Newsletter = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSub = async () => {
    if (!email.includes("@")) return;
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      setSent(true);
      dispatch(showToast("✦ Welcome to ShopHub Beauty!"));
    } catch {
      dispatch(showToast("Something went wrong, try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: "104px 48px", background: "var(--white)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "10%", left: "5%", fontSize: 120, opacity: .04, fontFamily: "Cormorant Garamond,serif", color: "var(--purple)", lineHeight: 1, pointerEvents: "none" }}>✦</div>
      <div style={{ position: "absolute", bottom: "10%", right: "5%", fontSize: 120, opacity: .04, fontFamily: "Cormorant Garamond,serif", color: "var(--purple)", lineHeight: 1, pointerEvents: "none" }}>✦</div>
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div className="ornament-divider" style={{ marginBottom: 28 }}>
          <span className="etiquette">✦ Stay In The Loop</span>
        </div>
        <h2 style={{ fontSize: "clamp(2rem,3.5vw,3rem)", color: "var(--ink)", marginBottom: 14, fontFamily: "Cormorant Garamond,serif", fontWeight: 600, letterSpacing: -.5 }}>
          Beauty Secrets & <span className="shimmer-purple">Exclusive Deals</span>
        </h2>
        <p style={{ color: "var(--mid)", marginBottom: 40, fontSize: 15, lineHeight: 1.85 }}>
          Subscribe for exclusive offers, new arrivals, and expert beauty tips delivered weekly.
        </p>
        {!sent ? (
          <div style={{ display: "flex", borderRadius: 100, overflow: "hidden", border: "1.5px solid var(--border)", maxWidth: 460, margin: "0 auto", background: "white", boxShadow: "0 8px 32px rgba(124,58,237,0.1)" }}>
            <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSub()}
              style={{ flex: 1, padding: "15px 24px", background: "transparent", border: "none", outline: "none", color: "var(--ink)", fontSize: 14 }} />
            <button onClick={handleSub} disabled={loading} className="btn-purple"
              style={{ borderRadius: 0, borderTopRightRadius: 100, borderBottomRightRadius: 100, padding: "15px 28px", margin: 0, opacity: loading ? .7 : 1 }}>
              {loading ? "…" : "Subscribe ✦"}
            </button>
          </div>
        ) : (
          <div style={{ background: "var(--purple-pale)", border: "1.5px solid var(--purple)", borderRadius: 18, padding: "20px 32px", color: "var(--purple)", fontWeight: 600, fontSize: 15.5 }}>
            ✦ Welcome to the ShopHub Beauty Family!
          </div>
        )}
        <p style={{ fontSize: 11, color: "var(--mid)", marginTop: 16, letterSpacing: .3 }}>No spam, ever. Unsubscribe anytime.</p>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   CART DRAWER
───────────────────────────────────────────────────────────────────────────── */
const CartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector(s => s.cart);
  const cartOpen = useSelector(s => s.ui.cartOpen);

  return (
    <>
      {cartOpen && <div onClick={() => dispatch(toggleCart())} style={{ position: "fixed", inset: 0, background: "rgba(26,26,46,0.45)", zIndex: 1001, backdropFilter: "blur(6px)" }} />}
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 400, zIndex: 1002, background: "var(--white)", borderLeft: "1px solid var(--border)", transform: cartOpen ? "translateX(0)" : "translateX(100%)", transition: "transform .45s cubic-bezier(0.16,1,0.3,1)", display: "flex", flexDirection: "column", boxShadow: cartOpen ? "-12px 0 60px rgba(0,0,0,0.12)" : "none" }}>
        <div style={{ padding: "26px 26px 20px", borderBottom: "1px solid var(--border-2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontWeight: 600, fontSize: 22, color: "var(--ink)", fontFamily: "Cormorant Garamond,serif" }}>Your Cart</h3>
          <button onClick={() => dispatch(toggleCart())} style={{ background: "var(--white-2)", border: "1px solid var(--border-2)", color: "var(--ink)", fontSize: 12.5, cursor: "pointer", padding: "7px 16px", borderRadius: 100, fontWeight: 600, letterSpacing: .5, textTransform: "uppercase" }}>✕ Close</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 26px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "70px 20px", color: "var(--mid)" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🛒</div>
              <p style={{ fontSize: 18, fontWeight: 600, color: "var(--ink)", fontFamily: "Cormorant Garamond,serif" }}>Your cart is empty</p>
              <p style={{ fontSize: 13, marginTop: 8 }}>Add some beautiful products!</p>
            </div>
          ) : items.map(item => (
            <div key={item.id} style={{ display: "flex", gap: 14, alignItems: "center", padding: "16px 0", borderBottom: "1px solid var(--border-2)" }}>
              <div style={{ width: 58, height: 58, borderRadius: 14, background: "var(--white-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0, border: "1px solid var(--border)", overflow: "hidden" }}>
                {item.image ? <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : item.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 3, color: "var(--ink)" }}>{item.name}</div>
                <div style={{ color: "var(--purple)", fontSize: 13, fontWeight: 700 }}>₹{item.price} × {item.qty}</div>
              </div>
              <button onClick={() => dispatch(removeItemAsync(item.id))} style={{ background: "var(--blush-2)", border: "none", borderRadius: 8, padding: "5px 10px", color: "#7c3aed", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>✕</button>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div style={{ padding: "22px 26px", borderTop: "1px solid var(--border-2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ color: "var(--mid)", fontSize: 14, textTransform: "uppercase", letterSpacing: 1 }}>Total</span>
              <span style={{ color: "var(--ink)", fontSize: 26, fontWeight: 600, fontFamily: "Cormorant Garamond,serif" }}>₹{(total || 0).toFixed(2)}</span>
            </div>
            <button className="btn-purple" style={{ width: "100%", borderRadius: 14, padding: 15, fontSize: 14 }} onClick={() => { dispatch(toggleCart()); navigate("/checkoutpage"); }}>Checkout →</button>
            <button onClick={() => dispatch(toggleCart())} className="btn-outline-dark" style={{ width: "100%", marginTop: 10, borderRadius: 14, padding: 12, fontSize: 12 }}>Continue Shopping</button>
          </div>
        )}
      </div>
    </>
  );
};
function SaleBanner() {
  return (
    <aside className="bd-sale-banner" aria-label="Current promotion">
      <div className="bd-sale-orb bd-sale-orb-1" aria-hidden="true" />
      <div className="bd-sale-orb bd-sale-orb-2" aria-hidden="true" />
      <div className="bd-sale-left">
        <div className="bd-sale-eyebrow">Limited time offer</div>
        <div className="bd-sale-title">
          Summer Edit<br />
          Up to 40% off
        </div>
        <div className="bd-sale-sub">
          Ends June 30 · Free delivery above ₹999
        </div>
        <button className="bd-sale-btn">Shop the sale →</button>
      </div>
      <div className="bd-sale-badge" aria-hidden="true">
        <div className="bd-sale-badge-num">40%</div>
        <div className="bd-sale-badge-label">Max savings</div>
      </div>
    </aside>
  );
}
const BannerSection = () => {
  const banners = useSelector(selectBanners);
  return <BannerCarousel banners={banners} />;
};


/* ─────────────────────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────────────────────── */
const Footer = () => (
  <footer style={{ background: "var(--charcoal)", borderTop: "1px solid rgba(124,58,237,0.12)" }}>
    <div style={{ maxWidth: 1360, margin: "0 auto", padding: "76px 48px 36px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1fr", gap: 56 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "white", fontWeight: 700, fontFamily: "Cormorant Garamond,serif" }}>S</div>
            <div>
              <span style={{ fontFamily: "Cormorant Garamond,serif", fontWeight: 600, fontSize: 24, color: "white", letterSpacing: .5 }}>Shop<span style={{ color: "var(--purple)" }}>Hub</span></span>
              <div style={{ fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontWeight: 500 }}>Beauty Atelier</div>
            </div>
          </div>
          <p style={{ color: "rgba(255,255,255,0.32)", fontSize: 13.5, lineHeight: 1.9, maxWidth: 260 }}>Your ultimate destination for premium beauty & skincare products, curated with love for every skin type.</p>
          <div style={{ display: "flex", gap: 10, marginTop: 26 }}>
            {["📸", "🐦", "📌", "▶️"].map((icon, i) => (
              <button key={i} style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, cursor: "pointer", transition: "all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--purple)"; e.currentTarget.style.transform = "translateY(-3px)" }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(124,58,237,0.1)"; e.currentTarget.style.transform = "none" }}>{icon}</button>
            ))}
          </div>
        </div>
        {[
          { title: "Shop", links: ["New Arrivals", "Bestsellers", "Skincare", "Makeup", "Fragrance", "Tools"] },
          { title: "Help", links: ["Track Order", "Returns", "Shipping Info", "Size Guide", "FAQ"] },
          { title: "Company", links: ["About Us", "Careers", "Press", "Sustainability", "Affiliates"] },
        ].map(col => (
          <div key={col.title}>
            <h5 style={{ fontWeight: 700, fontSize: 9.5, marginBottom: 20, color: "var(--purple)", textTransform: "uppercase", letterSpacing: 2.5 }}>{col.title}</h5>
            {col.links.map(l => (
              <a key={l} href="#" style={{ display: "block", color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: 13.5, marginBottom: 12, transition: "color .2s" }}
                onMouseEnter={e => e.target.style.color = "var(--purple-2)"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.3)"}>{l}</a>
            ))}
          </div>
        ))}
      </div>
      <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(124,58,237,0.25),transparent)", margin: "52px 0 28px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.18)", fontSize: 12 }}>© 2025 ShopHub Beauty. All rights reserved.</p>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Cookies"].map(l => (
            <a key={l} href="#" style={{ color: "rgba(255,255,255,0.18)", fontSize: 12, textDecoration: "none", transition: "color .2s" }}
              onMouseEnter={e => e.target.style.color = "var(--purple-2)"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.18)"}>{l}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE EXPORT
───────────────────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <Navbar />
      <HeroCarousel />
      <BrandStrip />
      <InsiderBuzz />

      <StatsBand />
      <LuxeBrandsGrid />



      <BannerSection />


      <TopBrandsCarousel />
      <ShoppableReels />
      <DealsCarousel />
      <div className="section-line" />
      <FeaturesSection />
      <div className="section-line" />

      <ProductsSection />



      <CategoryBanners />

      <PromoBanner />
      <SkincareRoutine />

      <div className="section-line" />
      <TestimonialsSection />
      <Newsletter />
      <Footer />
      <CartDrawer />
      <Toast />
      <NewArrivalsSection />
      <FeaturedProductsSection />
      <BestSellersSection />
    </>
  );
}