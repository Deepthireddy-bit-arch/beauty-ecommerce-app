import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  hideToast,
  setCategory,
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
import { fetchBrands } from "../redux/reducers/thunks/brandThunks";

/* ─────────────────────────────────────────────────────────────────────────────
   API BASE
───────────────────────────────────────────────────────────────────────────── */
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
const CATEGORIES = ["All", "Skincare", "Lips", "Eyes", "Face"];
const CAT_ICONS = { All: "✦", Skincare: "💧", Lips: "💄", Eyes: "👁", Face: "🌸" };

const BRANDS = [
  "Fenty Beauty", "Charlotte Tilbury", "NARS", "Rare Beauty", "Huda Beauty",
  "MAC", "Urban Decay", "Too Faced", "Estée Lauder", "Dior Beauty", "YSL Beauty", "Givenchy",
];

const HERO_SLIDES = [
  { type: "image", media: hero1, label: "New Season", title: "Glow\nNaturally", subtitle: "Luxury skincare and beauty essentials crafted for radiant, effortless confidence.", button: "Shop Now" },
  { type: "video", media: beautyVideo, label: "Trending Now", title: "Beauty\nRedefined", subtitle: "Experience premium beauty products designed for every skin tone and style.", button: "Explore Collection" },
  { type: "image", media: hero2, label: "Bestsellers", title: "Luxury Makeup\nCollection", subtitle: "Elevate your everyday look with our most-loved makeup products.", button: "Discover More" },
  { type: "image", media: hero3, label: "Skincare Edit", title: "Skincare That\nLoves You", subtitle: "Hydrate, nourish, and glow with dermatologist-approved formulas.", button: "View Products" },
];

const INSIDER_BUZZ = [
  { label: "The 9-to-5 Edit", img: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=600" },
  { label: "Serving Now: Mocha Mousse", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600" },
  { label: "Viral Beauty Essentials", img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600" },
  { label: "Skincare For All St(ages)", img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600" },
  { label: "Bonjour, French Pharmacy", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=600" },
];

const SHOP_CATEGORIES = [
  { name: "Skin", emoji: "✨", discount: "Upto 40% Off", img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=400" },
  { name: "Tools", emoji: "🪄", discount: "Upto 50% Off", img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400" },
  { name: "Hair", emoji: "💆", discount: "Upto 50% Off", img: "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?q=80&w=400" },
  { name: "Fragrance", emoji: "🌸", discount: "Upto 30% Off", img: "https://images.unsplash.com/photo-1541643600914-78b084683702?q=80&w=400" },
  { name: "Perfumes", emoji: "🫧", discount: "Upto 30% Off", img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400" },
  { name: "Cosmetics", emoji: "💄", discount: "Upto 45% Off", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=400" },
];

const LUXE_BRANDS = [
  { name: "Clinique", sub: "Best Sellers Starting at ₹1200", img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=600" },
  { name: "Kama Ayurveda", sub: "New launch", img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=600" },
  { name: "NARS", sub: "New Launch! Bronzing Stick", img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600" },
  { name: "MAC", sub: "NEW! Powder Kiss Lip And Cheek", img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600" },
  { name: "Chanel", sub: "Rogue Allure Velvet Limited Ed.", img: "https://images.unsplash.com/photo-1541643600914-78b084683702?q=80&w=600" },
  { name: "Versace", sub: "Crystal Emerald", img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600" },
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

const IMAGE_CARDS = [
  { id: 1, image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200", title: "Luxury Lipsticks", offer: "Up To 40% Off", sub: "Matte • Glossy • Nude Shades", btn: "Shop Now" },
  { id: 2, image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200", title: "Makeup Essentials", offer: "Flat 50% Off", sub: "Trending Beauty Collection", btn: "Explore" },
  { id: 3, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1200", title: "Skincare Sale", offer: "Buy 1 Get 1", sub: "Glow Boosting Products", btn: "Shop Sale" },
  { id: 4, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200", title: "Premium Beauty", offer: "Up To 60% Off", sub: "Exclusive Brand Offers", btn: "Grab Deal" },
];

const BRAND_CARDS = [
  { name: "H&M", discount: "Up to 60% off", extra: "+ Extra 10% off*", emoji: "👗", bg: "#f0eaff" },
  { name: "Nike", discount: "Up to 40% off", extra: "", emoji: "👟", bg: "#ede9fe" },
  { name: "Cider", discount: "Up to 70% off", extra: "", emoji: "🌺", bg: "#f5f3ff" },
  { name: "Puma", discount: "Min 40-60% off", extra: "+ Extra 10% off*", emoji: "🐆", bg: "#f0eaff" },
  { name: "MAC", discount: "Up to 50% off", extra: "", emoji: "💄", bg: "#ede9fe" },
  { name: "Fenty", discount: "Up to 35% off", extra: "+ Extra 5% off*", emoji: "✨", bg: "#f5f3ff" },
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
  const cartCount = useSelector(s => s.cart.items.reduce((a, i) => a + i.qty, 0));
  const wishCount = useSelector(s => s.wishlist.items.length);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Search overlay */}
      {searchOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(26,26,46,0.5)", zIndex: 1100, backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 120 }}
          onClick={() => setSearchOpen(false)}>
          <div style={{ background: "white", borderRadius: 20, padding: 8, width: "min(640px,90vw)", boxShadow: "0 32px 80px rgba(0,0,0,0.2)", border: "1px solid var(--border)", animation: "slideUp .3s ease" }}
            onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSearch} style={{ display: "flex", gap: 0 }}>
              <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands, categories…"
                style={{ flex: 1, padding: "16px 24px", border: "none", outline: "none", fontSize: 15, fontFamily: "Outfit", color: "var(--ink)", background: "transparent" }} />
              <button type="submit" className="btn-purple" style={{ borderRadius: 14, padding: "12px 24px", margin: 4 }}>🔍</button>
            </form>
          </div>
        </div>
      )}

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: scrolled ? "1px solid rgba(124,58,237,0.2)" : "1px solid transparent",
        transition: "all .35s ease",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.06)" : "none",
      }}>
        <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 48px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>

          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", textDecoration: "none" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 18, fontFamily: "Cormorant Garamond, serif", letterSpacing: 1 }}>S</div>
            <div>
              <span style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 600, fontSize: 24, color: "var(--charcoal)", letterSpacing: .5 }}>
                Shop<span style={{ color: "var(--purple)" }}>Hub</span>
              </span>
              <div style={{ fontSize: 9, letterSpacing: 3, color: "var(--mid)", textTransform: "uppercase", fontWeight: 500, marginTop: -2 }}>Beauty Atelier</div>
            </div>
          </Link>

          {/* Nav links */}
          <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
            {[
              { label: "Home", to: "/" },
              { label: "Shop", to: "/products" },
              { label: "Collections", to: "/products?category=all" },
              { label: "Brands", to: "/products?brand=all" },
              { label: "About", to: "/" },
            ].map(l => (
              <Link key={l.label} to={l.to} style={{ color: "var(--mid)", textDecoration: "none", fontSize: 13.5, fontWeight: 500, letterSpacing: .8, fontFamily: "Outfit", textTransform: "uppercase", transition: "color .2s" }}
                onMouseEnter={e => { e.target.style.color = "var(--ink)" }}
                onMouseLeave={e => { e.target.style.color = "var(--mid)" }}>{l.label}</Link>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setSearchOpen(true)} style={{ background: "transparent", border: "1px solid var(--border-2)", color: "var(--mid)", fontSize: 13, cursor: "pointer", padding: "8px 18px", borderRadius: 100, display: "flex", alignItems: "center", gap: 6, fontFamily: "Outfit", fontWeight: 500, transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--purple)"; e.currentTarget.style.color = "var(--ink)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-2)"; e.currentTarget.style.color = "var(--mid)" }}>
              🔍 <span>Search</span>
            </button>

            <button onClick={() => dispatch(toggleCart())} style={{ background: "transparent", border: "1px solid var(--border-2)", borderRadius: 100, padding: "8px 18px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", position: "relative", fontSize: 14, transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--purple)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-2)" }}>
              🛒
              {cartCount > 0 && (
                <span style={{ background: "var(--purple)", color: "white", borderRadius: "50%", width: 18, height: 18, fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", top: 2, right: 2 }}>{cartCount}</span>
              )}
              {cartCount > 0 && <span style={{ fontSize: 12, fontWeight: 700, color: "var(--purple)" }}>{cartCount}</span>}
            </button>

            <Link to="/wishlist" style={{ background: "transparent", border: "1px solid var(--border-2)", borderRadius: 100, padding: "8px 14px", color: "var(--mid)", fontSize: 16, cursor: "pointer", position: "relative", transition: "all .2s", textDecoration: "none", display: "flex" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--purple)"; e.currentTarget.style.color = "var(--ink)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-2)"; e.currentTarget.style.color = "var(--mid)" }}>
              ♡{wishCount > 0 && <span style={{ position: "absolute", top: 2, right: 2, background: "var(--blush)", color: "var(--purple)", borderRadius: "50%", width: 16, height: 16, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{wishCount}</span>}
            </Link>

            <Link to="/login" style={{ borderRadius: 100, padding: "9px 22px", fontSize: 12.5, textDecoration: "none", color: "var(--ink)", fontWeight: 600, border: "1.5px solid var(--border-2)", fontFamily: "Outfit", transition: "all .2s", letterSpacing: .5, textTransform: "uppercase" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--purple)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-2)" }}>
              Sign In
            </Link>
            <Link to="/register" style={{ borderRadius: 100, padding: "9px 22px", fontSize: 12.5, textDecoration: "none", color: "white", fontWeight: 700, background: "var(--purple)", fontFamily: "Outfit", transition: "all .2s", letterSpacing: .5, textTransform: "uppercase" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--purple-2)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--purple)" }}>
              Join Free
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

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
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden"
      }}
    >
      {slide.type === "video" ? (
        <video
          key={current}
          autoPlay
          muted
          loop
          playsInline
          src={slide.media}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />
      ) : (
        <img
          src={slide.media}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />
      )}

      {/* Optional Dark Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.15)"
        }}
      />

      {/* Dots */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 10,
          zIndex: 10
        }}
      >
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: current === i ? 30 : 8,
              height: 8,
              borderRadius: 20,
              border: "none",
              background:
                current === i
                  ? "#7c3aed"
                  : "rgba(255,255,255,0.5)",
              transition: "0.3s",
              cursor: "pointer"
            }}
          />
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
  useEffect(() => {
    console.log("BrandStrip Mounted");
    dispatch(fetchBrands());
  }, [dispatch]);
  const { brands, loading } = useSelector(
    (state) => state.brands
  );
  console.log("Brands State:", brands);



  if (loading) return null;

  const marqueeBrands = [...brands, ...brands];

  return (
    <div
      style={{
        background: "var(--charcoal)",
        padding: "14px 0",
        overflow: "hidden",
      }}
    >
      <div
        className="marquee-track"
        style={{
          display: "flex",
          gap: 64,
          whiteSpace: "nowrap",
          width: "max-content",
          alignItems: "center",
        }}
      >
        {marqueeBrands.map((brand, index) => (
          <div
            key={`${brand._id}-${index}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            {/* <img
              src={brand.logo}
              alt={brand.name}
              style={{
                height: "40px",
                width: "80px",
                objectFit: "contain",
                display: "block",
                background: "white",
                padding: "4px",
                borderRadius: "6px",
              }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/80x40?text=Brand";
              }}
            /> */}

            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 3,
                color: "rgba(139,92,246,0.55)",
                textTransform: "uppercase",
              }}
            >
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   INSIDER BUZZ SECTION  (inspired by Nykaa editorial strip)
───────────────────────────────────────────────────────────────────────────── */
const InsiderBuzz = () => {
  const navigate = useNavigate();
  return (
    <section style={{ padding: "72px 0", background: "var(--white-2)" }}>
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 28, alignItems: "start" }}>

          {/* Left promo card */}
          <div style={{ background: "linear-gradient(135deg, var(--purple) 0%, var(--purple-2) 100%)", borderRadius: 24, padding: "36px 28px", color: "white", cursor: "pointer", position: "relative", overflow: "hidden", minHeight: 240, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
            onClick={() => navigate("/products")}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
            <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "Cormorant Garamond, serif", lineHeight: 1.1, marginBottom: 8 }}>INSIDER<br />BUZZ</div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, opacity: .7, textTransform: "uppercase" }}>✦ Beauty Edition</div>
            </div>
            <div>
              <p style={{ fontSize: 13, opacity: .85, lineHeight: 1.7, marginBottom: 16, fontFamily: "Outfit" }}>Get The Complete Beauty Lowdown</p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", background: "rgba(255,255,255,0.15)", borderRadius: 100, padding: "8px 18px" }}>
                EXPLORE MORE →
              </div>
            </div>
          </div>

          {/* Editorial image scroll */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 16 }}>
            {INSIDER_BUZZ.map((item, i) => (
              <div key={i} style={{ cursor: "pointer", transition: "transform .3s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                <div style={{ height: 180, borderRadius: 16, overflow: "hidden", marginBottom: 10, position: "relative" }}>
                  <img src={item.img} alt={item.label} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s" }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.08)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(124,58,237,0.25), transparent)" }} />
                </div>
                <p style={{ fontSize: 12, color: "var(--mid)", lineHeight: 1.5, fontFamily: "Outfit", fontWeight: 500 }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Category tiles row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 16, marginTop: 40 }}>
          {SHOP_CATEGORIES.map((cat, i) => (
            <div key={i} style={{ cursor: "pointer", textAlign: "center", transition: "transform .3s" }}
              onClick={() => navigate(`/products?category=${cat.name.toLowerCase()}`)}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}>
              <div style={{ height: 140, borderRadius: 18, overflow: "hidden", position: "relative", marginBottom: 10 }}>
                <img src={cat.img} alt={cat.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,26,46,0.7), transparent)" }} />
                <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, textAlign: "center" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#fce7f3", background: "rgba(124,58,237,0.8)", borderRadius: 100, padding: "3px 10px", letterSpacing: .5 }}>
                    {cat.discount}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--ink)", fontFamily: "Outfit" }}>
                {cat.name}
              </div>
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
   LUXE BRANDS GRID  (inspired by Nykaa Luxe screenshot)
───────────────────────────────────────────────────────────────────────────── */
const LuxeBrandsGrid = () => {
  const navigate = useNavigate();
  return (
    <section style={{ padding: "100px 0", background: "var(--white-2)" }}>
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 48px" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2.4rem,5vw,4rem)", fontWeight: 700, color: "var(--purple)", letterSpacing: -1, marginBottom: 6 }}>ShopHub <span style={{ fontStyle: "italic" }}>Luxe</span></div>
          <div style={{ fontSize: 12, letterSpacing: 3, color: "var(--mid)", textTransform: "uppercase", fontFamily: "Outfit", fontWeight: 500 }}>THE BEST OF LUXURY</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 16 }}>
          {/* Featured large card */}
          <div style={{ gridColumn: "1", gridRow: "1", borderRadius: 20, overflow: "hidden", position: "relative", height: 300, cursor: "pointer" }}
            onClick={() => navigate("/products?brand=luxury")}>
            <img src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800" alt="Luxe Travel" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,26,46,0.75), transparent)" }} />
            <div style={{ position: "absolute", bottom: 20, left: 20, color: "white" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", opacity: .7, marginBottom: 4 }}>Featured Edit</div>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 600 }}>Shop Beauty On the Move</div>
            </div>
          </div>

          {/* 5 brand cards */}
          {LUXE_BRANDS.slice(0, 5).map((b, i) => (
            <div key={i} style={{ borderRadius: 20, overflow: "hidden", position: "relative", height: 145, cursor: "pointer", transition: "transform .3s" }}
              onClick={() => navigate(`/products?brand=${b.name.toLowerCase()}`)}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}>
              <img src={b.img} alt={b.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "rgba(26,26,46,0.45)" }} />
              <div style={{ position: "absolute", bottom: 14, left: 14, color: "white" }}>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18, fontWeight: 700, marginBottom: 2 }}>{b.name}</div>
                <div style={{ fontSize: 11, opacity: .75, fontFamily: "Outfit" }}>{b.sub}</div>
              </div>
            </div>
          ))}

          {/* Remaining brand cards in second row */}
          {LUXE_BRANDS.slice(0).map((b, i) => (
            <div key={`r2-${i}`} style={{ borderRadius: 20, overflow: "hidden", position: "relative", height: 145, cursor: "pointer", transition: "transform .3s" }}
              onClick={() => navigate(`/products?brand=${b.name.toLowerCase()}`)}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}>
              <img src={LUXE_BRANDS[(i + 2) % LUXE_BRANDS.length].img} alt={b.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "rgba(26,26,46,0.45)" }} />
              <div style={{ position: "absolute", bottom: 14, left: 14, color: "white" }}>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18, fontWeight: 700, marginBottom: 2 }}>{LUXE_BRANDS[(i + 2) % LUXE_BRANDS.length].name}</div>
                <div style={{ fontSize: 11, opacity: .75, fontFamily: "Outfit" }}>{LUXE_BRANDS[(i + 2) % LUXE_BRANDS.length].sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   SHOPPABLE VIDEO REELS  (inspired by Tira screenshot)
───────────────────────────────────────────────────────────────────────────── */
const ShoppableReels = () => {
  const [active, setActive] = useState(null);
  const dispatch = useDispatch();
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

              {/* Views badge */}
              <div style={{ position: "absolute", top: 14, left: 14, background: "rgba(0,0,0,0.5)", borderRadius: 100, padding: "4px 12px", fontSize: 11, color: "white", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 9 }}>👁</span> {reel.views}
              </div>

              {/* Play button */}
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "white", backdropFilter: "blur(8px)", transition: "all .25s" }}>▶</div>

              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 18px 18px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "var(--purple-3)", textTransform: "uppercase", marginBottom: 4 }}>{reel.brand}</div>
                <p style={{ fontSize: 13.5, color: "white", lineHeight: 1.5, marginBottom: 12, fontFamily: "Outfit" }}>{reel.title}</p>

                {/* Shop now overlay */}
                {active === reel.id && (
                  <div style={{ background: "white", borderRadius: 14, padding: "12px 16px", animation: "slideUp .3s ease", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--mid)", fontFamily: "Outfit" }}>{reel.products} products featured</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", fontFamily: "Cormorant Garamond, serif" }}>From {reel.price}</div>
                    </div>
                    <button className="btn-purple" style={{ padding: "8px 16px", fontSize: 11 }} onClick={e => { e.stopPropagation(); navigate("/products"); }}>Shop Now →</button>
                  </div>
                )}

                {active !== reel.id && (
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
const TopBrandsCarousel = () => {
  const [offset, setOffset] = useState(0);
  const visible = 4;
  const max = BRAND_CARDS.length - visible;

  useEffect(() => {
    const interval = setInterval(() => setOffset(p => p >= max ? 0 : p + 1), 3500);
    return () => clearInterval(interval);
  }, [max]);

  const arrowBtn = { width: 48, height: 48, borderRadius: "50%", border: "1.5px solid var(--purple-3)", background: "white", color: "var(--purple)", fontSize: 22, cursor: "pointer", transition: ".3s", boxShadow: "0 4px 16px rgba(124,58,237,0.1)" };

  return (
    <section style={{ width: "100%", padding: "100px 0", background: "linear-gradient(to bottom, #fff 0%, #faf7ff 100%)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "rgba(124,58,237,0.06)", top: -150, right: -150, filter: "blur(120px)" }} />

      <div style={{ padding: "0 60px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 55, flexWrap: "wrap", gap: 20 }}>
        <div>
          <div className="etiquette" style={{ marginBottom: 18 }}>✦ Luxury Beauty Brands</div>
          <h2 style={{ fontSize: "clamp(2.2rem,5vw,3.8rem)", fontWeight: 700, lineHeight: 1.15, color: "var(--ink)" }}>
            Top Brands <span className="gradient-text">On Offer</span>
          </h2>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => setOffset(Math.max(0, offset - 1))} style={arrowBtn}>‹</button>
          <button onClick={() => setOffset(Math.min(max, offset + 1))} style={arrowBtn}>›</button>
        </div>
      </div>

      <div style={{ overflow: "hidden", paddingLeft: 60 }}>
        <div style={{ display: "flex", gap: 28, transition: "transform .6s cubic-bezier(0.16,1,0.3,1)", transform: `translateX(calc(-${offset * (100 / visible)}% - ${offset * 28}px))` }}>
          {BRAND_CARDS.map((b, i) => (
            <div key={i} style={{ flex: `0 0 calc(${100 / visible}% - ${((visible - 1) * 28) / visible}px)`, borderRadius: 32, overflow: "hidden", background: "white", border: "1px solid var(--purple-light)", transition: ".4s ease", cursor: "pointer", boxShadow: "0 12px 40px rgba(124,58,237,0.06)" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-12px)"; e.currentTarget.style.boxShadow = "0 28px 60px rgba(124,58,237,0.16)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(124,58,237,0.06)" }}>
              <div style={{ height: 260, background: `linear-gradient(135deg, ${b.bg}, #fff)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <div style={{ position: "absolute", top: 20, left: 20, background: "linear-gradient(to right, #7c3aed, #8b5cf6)", color: "white", padding: "7px 16px", borderRadius: 40, fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>HOT DEAL</div>
                <div style={{ fontSize: 110, filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.15))" }}>{b.emoji}</div>
              </div>
              <div style={{ padding: 28 }}>
                <h3 style={{ fontSize: 26, marginBottom: 10, color: "var(--ink)", fontWeight: 700 }}>{b.name}</h3>
                <p style={{ fontSize: 14, color: "var(--mid)", marginBottom: 22, lineHeight: 1.8 }}>Premium beauty collections crafted for radiant beauty and luxury skincare experiences.</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ color: "var(--purple)", fontSize: 22, fontWeight: 800 }}>{b.discount}</div>
                    {b.extra && <div style={{ fontSize: 12, color: "var(--mid)", marginTop: 4 }}>{b.extra}</div>}
                  </div>
                  <button style={{ padding: "13px 24px", borderRadius: 50, border: "none", background: "linear-gradient(to right, var(--purple), var(--purple-2))", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 10px 24px rgba(124,58,237,0.25)" }}>Shop</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 40 }}>
        {Array.from({ length: max + 1 }).map((_, i) => (
          <button key={i} onClick={() => setOffset(i)}
            style={{ width: i === offset ? 32 : 10, height: 10, borderRadius: 40, border: "none", background: i === offset ? "var(--purple)" : "var(--purple-light)", cursor: "pointer", transition: ".4s" }} />
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
   PRODUCT CARD  (API-aware)
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

  const cartProduct = { id: productId, name, price, image, emoji, category };

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
          <img src={image} alt={name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s", transform: hov ? "scale(1.06)" : "scale(1)" }} />
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
   PRODUCTS SECTION  – fetches from /api/products
───────────────────────────────────────────────────────────────────────────── */
const ProductsSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeCategory = useSelector(s => s.ui.activeCategory) || "All";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (cat) => {
    setLoading(true);
    setError(null);
    try {
      const params = cat && cat !== "All" ? { category: cat } : {};
      const res = await axios.get(`${BASE_URL}/products`, { params });
      const data = res.data?.products || res.data?.data || res.data || [];
      setProducts(Array.isArray(data) ? data.slice(0, 8) : []);
    } catch (err) {
      console.error("Products fetch error:", err);
      setError("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(activeCategory); }, [activeCategory, fetchProducts]);

  return (
    <section style={{ padding: "104px 0", background: "var(--white)" }}>
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 48px" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div className="etiquette" style={{ marginBottom: 18 }}>✦ Our Collection</div>
          <h2 style={{ fontSize: "clamp(2.2rem,4.5vw,3.8rem)", fontWeight: 600, color: "var(--ink)", marginBottom: 14, letterSpacing: -.5 }}>
            Bestselling <span className="gradient-text">Products</span>
          </h2>
          <p style={{ color: "var(--mid)", fontSize: 15.5, maxWidth: 460, margin: "0 auto", lineHeight: 1.85 }}>
            Handpicked luxuries loved by thousands of beauty devotees worldwide
          </p>
        </div>

        {/* Category filter pills */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 48 }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => dispatch(setCategory(c))}
              style={{ padding: "10px 26px", borderRadius: 100, border: activeCategory === c ? "1.5px solid var(--purple)" : "1.5px solid var(--border-2)", background: activeCategory === c ? "var(--purple)" : "white", color: activeCategory === c ? "white" : "var(--mid)", fontWeight: activeCategory === c ? 700 : 500, fontSize: 12.5, cursor: "pointer", transition: "all .25s", letterSpacing: .5, textTransform: "uppercase", boxShadow: activeCategory === c ? "0 6px 20px rgba(124,58,237,0.3)" : "none" }}>
              {CAT_ICONS[c]} {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
            {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
            <p style={{ color: "var(--mid)", fontSize: 16, marginBottom: 20 }}>{error}</p>
            <button className="btn-purple" onClick={() => fetchProducts(activeCategory)}>Try Again</button>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ color: "var(--mid)", fontSize: 16 }}>No products found in this category.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
            {products.map(p => <ProductCard key={p._id || p.id} p={p} />)}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 52 }}>
          <button className="btn-outline-dark" onClick={() => navigate("/products")}>View All Products →</button>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   CATEGORY BANNER GRID  (inspired by Sugar Cosmetics / Nails banner)
───────────────────────────────────────────────────────────────────────────── */
const CategoryBanners = () => {
  const navigate = useNavigate();
  const banners = [
    { title: "Skincare", offer: "Save ₹2000 Instantly", sub: "Don't Miss the Big Savings!", img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=1200", accent: "#7c3aed" },
    { title: "Nails", offer: "Buy 2 Get 1 Free", sub: "Nail Lacquer & Treatments", img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1200", accent: "#c4b5fd" },
    { title: "Makeup", offer: "Upto 50% Off", sub: "All New Summer Collection", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200", accent: "#8b5cf6" },
  ];

  return (
    <section style={{ padding: "100px 0", background: "var(--white-2)" }}>
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 48px" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div className="etiquette" style={{ marginBottom: 18 }}>✦ Shop By Category</div>
          <h2 style={{ fontSize: "clamp(2rem,4vw,3.4rem)", fontWeight: 600, color: "var(--ink)", letterSpacing: -.5 }}>
            Explore <span className="gradient-text">Collections</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
          {banners.map((b, i) => (
            <div key={i} style={{ borderRadius: 24, overflow: "hidden", position: "relative", height: 300, cursor: "pointer", transition: "transform .35s, box-shadow .35s" }}
              onClick={() => navigate(`/products?category=${b.title.toLowerCase()}`)}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 24px 60px rgba(124,58,237,0.2)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none" }}>
              <img src={b.img} alt={b.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, rgba(26,26,46,0.7) 0%, rgba(26,26,46,0.15) 100%)` }} />

              {/* Content */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, padding: 32, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: "Outfit", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{b.sub}</p>
                  <h3 style={{ fontSize: "clamp(1.8rem,3vw,2.8rem)", fontWeight: 700, color: "white", fontFamily: "Cormorant Garamond, serif", lineHeight: 1.1 }}>{b.offer}</h3>
                </div>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: b.accent, background: "rgba(255,255,255,0.15)", borderRadius: 100, padding: "6px 16px", textTransform: "uppercase", backdropFilter: "blur(8px)" }}>Shop {b.title} →</span>
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
  return (
    <section style={{ padding: "112px 48px", background: "var(--charcoal)", position: "relative", overflow: "hidden", textAlign: "center" }}>
      <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: 700, height: 700, borderRadius: "50%", background: "rgba(124,58,237,0.06)", filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 820, height: 820, borderRadius: "50%", border: "1px solid rgba(124,58,237,0.07)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 760, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-block", background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 100, padding: "6px 20px", marginBottom: 24, fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: "var(--purple-2)", textTransform: "uppercase" }}>⚡ Limited Time Offer</div>

        <h2 style={{ fontSize: "clamp(2.4rem,5vw,4.2rem)", fontWeight: 600, marginBottom: 18, color: "white", fontFamily: "Cormorant Garamond,serif", letterSpacing: -.5 }}>
          Get <span className="shimmer-purple">30% OFF</span> on First Order
        </h2>

        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15.5, marginBottom: 36, lineHeight: 1.85, maxWidth: 540, margin: "0 auto 36px" }}>
          Use code{" "}
          <strong style={{ color: "var(--purple-2)", background: "rgba(124,58,237,0.12)", padding: "3px 16px", borderRadius: 8, letterSpacing: 2, fontSize: 13 }}>BEAUTY30</strong>
          {" "}at checkout. Valid on all skincare & makeup.
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
          <button onClick={() => { navigator.clipboard?.writeText("BEAUTY30"); dispatch(showToast("✦ Code BEAUTY30 copied!")); }} className="btn-purple" style={{ fontSize: 14, padding: "15px 38px" }}>✦ Copy Code</button>
          <button className="btn-ghost-white" style={{ fontSize: 14, padding: "15px 38px" }}>Learn More</button>
        </div>

        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          {[["12", "Hours"], ["34", "Mins"], ["56", "Secs"]].map(([n, l]) => (
            <div key={l} style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 18, padding: "18px 28px", minWidth: 88, textAlign: "center" }}>
              <div style={{ fontSize: 36, fontWeight: 600, color: "var(--purple)", fontFamily: "Cormorant Garamond,serif" }}>{n}</div>
              <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.35)", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>{l}</div>
            </div>
          ))}
        </div>
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
   DEALS CAROUSEL
───────────────────────────────────────────────────────────────────────────── */
const DealsCarousel = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const next = () => setIndex(p => p >= IMAGE_CARDS.length - 3 ? 0 : p + 1);
  const prev = () => setIndex(p => p <= 0 ? IMAGE_CARDS.length - 3 : p - 1);
  useEffect(() => { const t = setInterval(next, 3500); return () => clearInterval(t); }, []);

  return (
    <section style={{ padding: "90px 0", background: "#f5f5f5", overflow: "hidden" }}>
      <div style={{ textAlign: "center", marginBottom: 50 }}>
        <h2 style={{ fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 900, textTransform: "uppercase", lineHeight: 1, background: "linear-gradient(to bottom, #7c3aed, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: 2 }}>Coolest Deals Ever.</h2>
      </div>
      <div style={{ position: "relative" }}>
        <button onClick={prev} style={{ position: "absolute", top: "50%", left: 20, transform: "translateY(-50%)", width: 58, height: 58, borderRadius: "50%", border: "none", background: "white", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", fontSize: 32, cursor: "pointer", zIndex: 10 }}>‹</button>
        <button onClick={next} style={{ position: "absolute", top: "50%", right: 20, transform: "translateY(-50%)", width: 58, height: 58, borderRadius: "50%", border: "none", background: "white", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", fontSize: 32, cursor: "pointer", zIndex: 10 }}>›</button>
        <div style={{ overflow: "hidden", padding: "0 70px" }}>
          <div style={{ display: "flex", gap: 24, transition: "transform .6s ease", transform: `translateX(calc(-${index * 33.33}% - ${index * 16}px))` }}>
            {IMAGE_CARDS.map(card => (
              <div key={card.id} style={{ minWidth: "32%", height: 420, borderRadius: 30, overflow: "hidden", position: "relative", flexShrink: 0, cursor: "pointer", boxShadow: "0 15px 40px rgba(0,0,0,0.12)" }}
                onClick={() => navigate("/products")}>
                <img src={card.image} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.1))" }} />
                <div style={{ position: "absolute", bottom: 30, left: 30, right: 30, color: "white" }}>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{card.title}</div>
                  <div style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.1, marginBottom: 10, fontFamily: "Cormorant Garamond, serif" }}>{card.offer}</div>
                  <div style={{ fontSize: 16, opacity: .9, marginBottom: 24 }}>{card.sub}</div>
                  <button style={{ padding: "15px 28px", borderRadius: 50, border: "none", background: "white", color: "#7c3aed", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>{card.btn} →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 35 }}>
          {Array.from({ length: IMAGE_CARDS.length - 2 }).map((_, i) => (
            <button key={i} onClick={() => setIndex(i)}
              style={{ width: i === index ? 32 : 10, height: 10, borderRadius: 20, border: "none", cursor: "pointer", transition: ".4s", background: i === index ? "linear-gradient(to right, #7c3aed, #8b5cf6)" : "#fbcfe8" }} />
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
      // Future: await axios.post(`${BASE_URL}/newsletter/subscribe`, { email });
      await new Promise(r => setTimeout(r, 800)); // mock
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
      <ShoppableReels />
      <TopBrandsCarousel />
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
    </>
  );
}