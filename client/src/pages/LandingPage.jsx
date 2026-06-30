import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  hideToast,
  showToast,
  toggleCart,
} from "../redux/slices/uiSlice";
// import hero1 from "../assets/hero1.png";
import hero1 from "../assets/beautytwo.mp4";
import hero2 from "../assets/hero2.png";
import hero3 from "../assets/beauty-3.mp4";
import hero4 from '../assets/beauty-4.mp4';
import hero5 from '../assets/beauty-5.mp4';
import beautyVideo from "../assets/beauty-video.mp4";
import {
  addToCartAsync,
  removeItemAsync,
} from "../redux/reducers/thunks/cartThunks";
import { removeFromWishlist } from "../redux/reducers/thunks/wishlistActions";
import { fetchHomeData } from "../redux/reducers/thunks/homeThunks";
import { fetchDeals } from "../redux/reducers/thunks/dealsThunks";
import { fetchCategoryBanners } from "../redux/reducers/thunks/categoryBannersThunks";
import {
  fetchBrandBanners,
  fetchBrands,
  selectActiveBanner,
  selectBanners,
  setActiveBanner,
} from "../redux/slices/brandpageSlice";
import { loginReset } from "../redux/slices/loginSlice";
import { clearSuggestions, fetchSuggestions } from "../redux/slices/searchSlice";
import { fetchActiveOffer } from "../redux/slices/offerSlice";
import "./promoBanner.css";
import "./luxebrand.css";
import "./DealsCarousel.css";
import { fetchProducts } from "../redux/reducers/thunks/productThunks";
import { fetchCategoriesApi } from "../api/productApi";
import { setCategory } from "../redux/slices/productSlice";
import BannerCarousel from "../components/BannerCarousel";
import DealsCarousel from "../components/DealsCarousel";
import NewArrivalsSection from "../components/NewArrivalsSection";
import FeaturedProductsSection from "../components/FeaturedProductsSection";
import BestSellersSection from "../components/BestSellers";
import Footer from "../components/footer/Footer";
import Navbar from "../components/Navbar/Navbar";

/* ─────────────────────────────────────────────────────────
   API BASE
───────────────────────────────────────────────────────── */
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const MEDIA_URL = BASE_URL.replace("/api", "");
const resolveImg = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${MEDIA_URL}${path}`;
};

/* ─────────────────────────────────────────────────────────
   GLOBAL CSS
   • Uses --page-px from Navbar.css for ALL horizontal gutters
   • No hardcoded 48px — Navbar.css owns the ladder
───────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');

/* ── Design tokens (extend Navbar.css tokens) ── */
:root {
  --ink:         #1a1a2e;
  --ink-60:      rgba(26,26,46,0.6);
  --ink-30:      rgba(26,26,46,0.3);
  --white:       #ffffff;
  --white-2:     #f8f9ff;
  --ivory:       #faf9f7;
  --purple:      #7c3aed;
  --purple-2:    #8b5cf6;
  --purple-3:    #a78bfa;
  --purple-pale: #f0eaff;
  --purple-light:#ede9fe;
  --lavender:    #c4b5fd;
  --blush:       #fbcfe8;
  --blush-2:     #fce7f3;
  --forest:      #2d4a3e;
  --charcoal:    #1e1e2f;
  --mid:         #6b6b7a;
  --border:      rgba(124,58,237,0.18);
  --border-2:    rgba(26,26,46,0.08);
  --r:           16px;
  --r2:          24px;
  --r3:          40px;
  --shadow-card: 0 2px 12px rgba(0,0,0,0.04);
  --shadow-hover:0 24px 56px rgba(124,58,237,0.14);
}

/* ── Base reset ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {

  background: var(--white);
  color: var(--ink);
  overflow-x: hidden;
}
h1,h2,h3,h4,h5 {
  
  line-height: 1.1;
}
::selection { background: var(--purple-2); color: white; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--white-2); }
::-webkit-scrollbar-thumb { background: var(--purple); border-radius: 4px; }

/* ── Animations ── */
@keyframes fadeUp     { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn     { from{opacity:0} to{opacity:1} }
@keyframes slideRight { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
@keyframes marquee    { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
@keyframes shimmerP   { 0%{background-position:-400% center} 100%{background-position:400% center} }
@keyframes float      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
@keyframes carouselIn { from{opacity:0;transform:scale(1.04)} to{opacity:1;transform:scale(1)} }
@keyframes pulseRing  {
  0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,0.4)}
  50%{box-shadow:0 0 0 14px rgba(124,58,237,0)}
}
@keyframes spin       { to{transform:rotate(360deg)} }
@keyframes skShimmer  {
  0%  {background-position:-600px 0}
  100%{background-position: 600px 0}
}
@prefers-reduced-motion: reduce {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}

/* ── Utility classes ── */
.anim-fadeUp { animation: fadeUp 0.75s cubic-bezier(0.16,1,0.3,1) both; }
.anim-fadeIn { animation: fadeIn 0.6s ease both; }
.float       { animation: float 5s ease-in-out infinite; }


.shimmer-purple {
  background: linear-gradient(90deg,var(--purple) 0%,var(--purple-2) 40%,var(--purple) 60%,var(--purple-2) 100%);
  background-size: 400% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmerP 5s linear infinite;
}
.gradient-text {
  background: linear-gradient(135deg,var(--purple) 0%,var(--purple-2) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.etiquette {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: var(--purple-pale);
  border: 1px solid var(--border);
  color: var(--purple);
  border-radius: 100px;
  padding: 5px 16px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  
}

.btn-purple {
  background: var(--purple);
  color: white;
  border: none;
  border-radius: 100px;
  padding: 13px 32px;
  
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all .3s ease;
  letter-spacing: .5px;
  text-transform: uppercase;
}
.btn-purple:hover {
  background: var(--purple-2);
  transform: translateY(-2px);
  box-shadow: 0 14px 36px rgba(124,58,237,.38);
}
.btn-outline-dark {
  background: transparent;
  color: var(--ink);
  border: 1.5px solid var(--ink);
  border-radius: 100px;
  padding: 12px 30px;
  
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all .3s ease;
  letter-spacing: .5px;
  text-transform: uppercase;
}
.btn-outline-dark:hover {
  background: var(--ink);
  color: var(--white);
  transform: translateY(-2px);
}
.btn-ghost-white {
  background: rgba(255,255,255,.12);
  color: white;
  border: 1.5px solid rgba(255,255,255,.3);
  border-radius: 100px;
  padding: 12px 30px;
  
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all .3s ease;
  letter-spacing: .5px;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
}
.btn-ghost-white:hover {
  background: rgba(255,255,255,.22);
  transform: translateY(-2px);
}

.section-line {
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--purple) 50%, transparent 100%);
  opacity: .3;
}

/* ── Skeleton base ── */
.sk-pulse {
  background: linear-gradient(
    90deg,
    #f0eaff 25%,
    #e4d8ff 50%,
    #f0eaff 75%
  );
  background-size: 600px 100%;
  animation: skShimmer 1.6s infinite linear;
  border-radius: 8px;
}

/* ═══════════════════════════════════════════════════════
   SECTION INNER — THE ONE RULE THAT ALIGNS EVERYTHING
   Uses --page-px from Navbar.css. No max-width + margin:
   auto centering anywhere on this page.
═══════════════════════════════════════════════════════ */
.lp-inner {
  width: 100%;
  padding-left: var(--page-px);
  padding-right: var(--page-px);
  box-sizing: border-box;
}

/* ── Marquee ── */
.marquee-track { animation: marquee 28s linear infinite; }
.marquee-track:hover { animation-play-state: paused; }

/* ═══════════════════════════════════════════════════════
   HERO CAROUSEL
═══════════════════════════════════════════════════════ */
.lp-hero {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 520px;
  overflow: hidden;
}
.lp-hero__media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.lp-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(26,26,46,0.55) 0%,
    rgba(124,58,237,0.18) 60%,
    rgba(0,0,0,0.08) 100%
  );
  pointer-events: none;
}
.lp-hero__content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 100px;
}
.lp-hero__text {
  padding-left: var(--page-px);
  padding-right: var(--page-px);
}
.lp-hero__label {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--lavender);
  margin-bottom: 16px;
}
.lp-hero__title {
  font-size: clamp(2.6rem, 6vw, 5.5rem);
  font-weight: 600;
  color: #fff;
  white-space: pre-line;
  line-height: 1.05;
  letter-spacing: -0.02em;
  margin-bottom: 18px;

}
.lp-hero__sub {
  font-size: clamp(13px, 1.5vw, 15px);
  color: rgba(255,255,255,0.72);
  line-height: 1.8;
  max-width: 480px;
  margin-bottom: 32px;
 
}
.lp-hero__dots {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}
.lp-hero__dot {
  height: 8px;
  border-radius: 20px;
  border: none;
  background: rgba(255,255,255,0.45);
  cursor: pointer;
  transition: width .3s, background .3s;
}
.lp-hero__dot--active {
  background: var(--purple);
}

@media (max-width: 767px) {
  .lp-hero { min-height: 420px; height: 80vh; }
  .lp-hero__content { padding-bottom: 72px; }
  .lp-hero__sub { display: none; }
}
@media (max-width: 479px) {
  .lp-hero { height: 70vh; }
}

/* ═══════════════════════════════════════════════════════
   BRAND STRIP MARQUEE
═══════════════════════════════════════════════════════ */
.lp-strip {
  background: var(--charcoal);
  padding: 14px 0;
  overflow: hidden;
}
.lp-strip__track {
  display: flex;
  gap: 64px;
  white-space: nowrap;
  width: max-content;
  align-items: center;
}
.lp-strip__item {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 3px;
  color: rgba(139,92,246,0.55);
  text-transform: uppercase;
}

/* ═══════════════════════════════════════════════════════
   SECTION HEADERS (shared pattern)
═══════════════════════════════════════════════════════ */
.lp-sec-head {
  text-align: center;
  margin-bottom: 52px;
}
.lp-sec-head h2 {
  font-size: clamp(1.9rem, 4vw, 3.4rem);
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.02em;
  margin-top: 12px;
}
.lp-sec-head p {
  color: var(--mid);
  font-size: 15px;
  margin-top: 10px;

}
.lp-sec-head--light h2 { color: white; }
.lp-sec-head--light p  { color: rgba(255,255,255,0.45); }

/* view-all link */
.lp-viewall {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--purple);
  background: none;
  border: 1.5px solid var(--purple);
  border-radius: 100px;
  padding: 9px 22px;
  cursor: pointer;
  transition: all .25s ease;
  text-decoration: none;
 
}
.lp-viewall:hover {
  background: var(--purple);
  color: white;
  transform: translateY(-1px);
}
.lp-viewall--ghost {
  border-color: rgba(255,255,255,0.35);
  color: white;
}
.lp-viewall--ghost:hover {
  background: rgba(255,255,255,0.15);
  color: white;
  transform: translateY(-1px);
}

/* ═══════════════════════════════════════════════════════
   LUXE BRANDS GRID  (uses .lp-inner)
═══════════════════════════════════════════════════════ */
.lp-brands {
  padding: 96px 0;
  background: var(--white);
}
.lp-brands__hd {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 36px;
  gap: 16px;
  flex-wrap: wrap;
}
.lp-brands__eyebrow {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--purple);
  margin-bottom: 8px;
}
.lp-brands__title {
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.02em;
}
.lp-brands__title em {
  font-style: italic;
  color: var(--purple);
}

/* skeleton for brands */
.lp-brands__sk-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 16px;
}
.lp-brands__sk-hero  { grid-row: 1/3; border-radius: 20px; min-height: 340px; }
.lp-brands__sk-card  { border-radius: 16px; height: 160px; }

@media (max-width: 899px) {
  .lp-brands { padding: 72px 0; }
}
@media (max-width: 639px) {
  .lp-brands { padding: 56px 0; }
  .lp-brands__hd { flex-direction: column; align-items: flex-start; }
}

/* ═══════════════════════════════════════════════════════
   TOP BRANDS CAROUSEL
═══════════════════════════════════════════════════════ */
.lp-tbc {
  padding: 80px 0;
  background: var(--ivory);
  overflow: hidden;
}
.lp-tbc__hd {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 36px;
  gap: 16px;
  flex-wrap: wrap;
}
.lp-tbc__title {
  font-size: clamp(1.5rem, 3vw, 2.4rem);
  font-weight: 700;
  color: var(--ink);
}
.lp-tbc__arrows { display: flex; gap: 10px; }
.lp-tbc__arrow {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--border-2);
  background: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color .2s, color .2s;
  color: var(--ink);
}
.lp-tbc__arrow:hover:not(:disabled) { border-color: var(--purple); color: var(--purple); }
.lp-tbc__arrow:disabled { opacity: 0.35; cursor: not-allowed; }

.lp-tbc__track-wrap { overflow: hidden; }
.lp-tbc__track {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  transition: transform 0.5s cubic-bezier(.4,0,.2,1);
}
.lp-tbc__card {
  flex: 0 0 calc(25% - 18px);
  border-radius: 20px;
  background: white;
  border: 1px solid var(--border-2);
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow-card);
  transition: transform .3s, box-shadow .3s, border-color .3s;
}
.lp-tbc__card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-hover);
  border-color: var(--purple);
}
.lp-tbc__card-img {
  height: 200px;
  overflow: hidden;
  background: var(--purple-pale);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42px;
  font-weight: 700;
  color: var(--purple);
}
.lp-tbc__card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform .35s ease;
}
.lp-tbc__card:hover .lp-tbc__card-img img { transform: scale(1.05); }
.lp-tbc__card-body { padding: 18px 20px 22px; }
.lp-tbc__card-name { font-size: 16px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
.lp-tbc__card-sub  { font-size: 12px; color: var(--mid); margin-bottom: 14px; }
.lp-tbc__card-btn {
  padding: 9px 22px;
  border-radius: 30px;
  border: none;
  background: var(--purple);
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 12px;

  transition: background .2s;
}
.lp-tbc__card-btn:hover { background: var(--purple-2); }

.lp-tbc__sk {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.lp-tbc__sk-card { border-radius: 20px; overflow: hidden; }
.lp-tbc__sk-img  { height: 200px; }
.lp-tbc__sk-body { padding: 18px 20px 22px; display: flex; flex-direction: column; gap: 10px; }
.lp-tbc__sk-line { height: 12px; border-radius: 6px; }

.lp-tbc__dots { display: flex; justify-content: center; gap: 8px; margin-top: 28px; }
.lp-tbc__dot {
  height: 8px;
  border-radius: 20px;
  border: none;
  background: #ddd;
  cursor: pointer;
  padding: 0;
  transition: width .2s, background .2s;
}
.lp-tbc__dot--active { background: var(--purple); }

@media (max-width: 1023px) {
  .lp-tbc__card { flex: 0 0 calc(33.33% - 16px); }
  .lp-tbc__sk   { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 767px) {
  .lp-tbc__card { flex: 0 0 calc(50% - 12px); }
  .lp-tbc__sk   { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 479px) {
  .lp-tbc__card { flex: 0 0 80%; }
  .lp-tbc__sk   { grid-template-columns: 1fr; }
}

/* ═══════════════════════════════════════════════════════
   SHOPPABLE REELS
═══════════════════════════════════════════════════════ */
.lp-reels {
  padding: 100px 0;
  background: var(--charcoal);
  position: relative;
  overflow: hidden;
}
.lp-reels__bg {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 80%, rgba(124,58,237,0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(124,58,237,0.05) 0%, transparent 50%);
  pointer-events: none;
}
.lp-reels__hd {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 52px;
  gap: 16px;
  flex-wrap: wrap;
}
.lp-reels__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.lp-reels__card {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  transition: transform .35s;
}
.lp-reels__card:hover { transform: translateY(-6px); }
.lp-reels__card-img {
  width: 100%;
  height: 360px;
  object-fit: cover;
  display: block;
}
.lp-reels__card-grad {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(26,26,46,0.9) 0%, rgba(26,26,46,0.2) 50%, transparent 100%);
}

@media (max-width: 1023px) { .lp-reels__grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 639px)  { .lp-reels__grid { grid-template-columns: 1fr 1fr; gap: 12px; } }
@media (max-width: 479px)  {
  .lp-reels__grid { grid-template-columns: 1fr; }
  .lp-reels__card-img { height: 280px; }
  .lp-reels { padding: 72px 0; }
}

/* ═══════════════════════════════════════════════════════
   STATS BAND
═══════════════════════════════════════════════════════ */
.lp-stats {
  padding: 72px 0;
  background: var(--white);
}
.lp-stats__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--border-2);
  border: 1px solid var(--border-2);
  border-radius: 20px;
  overflow: hidden;
}
.lp-stats__item {
  padding: 48px 32px;
  text-align: center;
  background: white;
  cursor: default;
  border-top: 3px solid transparent;
  transition: border-top-color .3s;
}
.lp-stats__item:hover { border-top-color: var(--purple); }
.lp-stats__num {
  font-size: 46px;
  font-weight: 700;

  color: var(--charcoal);
  margin-bottom: 8px;
  letter-spacing: -1px;
}
.lp-stats__label { font-size: 15px; font-weight: 600; color: var(--ink); margin-bottom: 5px; }
.lp-stats__sub   { font-size: 12px; color: var(--mid); }

@media (max-width: 1023px) {
  .lp-stats__grid  { grid-template-columns: repeat(2, 1fr); }
  .lp-stats__item  { padding: 36px 24px; }
  .lp-stats__num   { font-size: 38px; }
}
@media (max-width: 479px) {
  .lp-stats__grid { grid-template-columns: 1fr 1fr; }
  .lp-stats__item { padding: 28px 16px; }
  .lp-stats__num  { font-size: 30px; }
}

/* ═══════════════════════════════════════════════════════
   PRODUCTS SECTION
═══════════════════════════════════════════════════════ */
.lp-products {
  padding: 104px 0;
  background: var(--white);
}
.lp-products__cats {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 48px;
}
.lp-cat-btn {
  padding: 10px 26px;
  border-radius: 100px;
  border: 1.5px solid var(--border-2);
  background: white;
  color: var(--mid);
  font-weight: 500;
  cursor: pointer;
  transition: all .25s ease;
  text-transform: uppercase;
  font-size: 12px;
 
}
.lp-cat-btn--active {
  border-color: var(--purple);
  background: var(--purple);
  color: white;
  font-weight: 700;
}
.lp-products__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.lp-products__footer {
  text-align: center;
  margin-top: 52px;
}

/* product card */
.lp-pcard {
  border-radius: 20px;
  overflow: hidden;
  background: white;
  border: 1.5px solid var(--border-2);
  transition: all .4s cubic-bezier(0.16,1,0.3,1);
  cursor: pointer;
  position: relative;
}
.lp-pcard:hover {
  border-color: var(--purple);
  transform: translateY(-10px);
  box-shadow: var(--shadow-hover);
}
.lp-pcard__img {
  height: 220px;
  overflow: hidden;
  background: radial-gradient(ellipse at center, rgba(124,58,237,0.1) 0%, var(--white-2) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--border-2);
}
.lp-pcard__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .4s;
}
.lp-pcard:hover .lp-pcard__img img { transform: scale(1.06); }
.lp-pcard__img-emoji { font-size: 72px; transition: transform .4s; }
.lp-pcard:hover .lp-pcard__img-emoji { transform: scale(1.1); }
.lp-pcard__badge {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 2;
  background: var(--purple);
  color: white;
  border-radius: 100px;
  padding: 4px 13px;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.lp-pcard__wish {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 2;
  background: rgba(255,255,255,0.92);
  border: 1px solid var(--border-2);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  cursor: pointer;
  color: var(--mid);
  transition: all .3s;
}
.lp-pcard__wish--active {
  background: var(--purple-pale);
  border-color: var(--purple);
  color: var(--purple);
}
.lp-pcard__body { padding: 18px 20px 22px; }
.lp-pcard__cat  { font-size: 9.5px; color: var(--purple); font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
.lp-pcard__name {
  font-size: 17px;
  font-weight: 600;
  color: var(--ink);
 
  margin-bottom: 10px;
  line-height: 1.3;
}
.lp-pcard__stars { display: flex; align-items: center; gap: 6px; margin-bottom: 16px; }
.lp-pcard__rev   { font-size: 11px; color: var(--mid); }
.lp-pcard__foot  { display: flex; align-items: center; justify-content: space-between; }
.lp-pcard__price { font-size: 24px; font-weight: 600; color: var(--ink);  }

/* product skeleton */
.lp-pcard__sk {
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--border-2);
}
.lp-pcard__sk-img  { height: 220px; }
.lp-pcard__sk-body { padding: 18px 20px 22px; display: flex; flex-direction: column; gap: 10px; }
.lp-pcard__sk-line { height: 12px; border-radius: 6px; }

@media (max-width: 1159px) { .lp-products__grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 767px)  { .lp-products__grid { grid-template-columns: repeat(2, 1fr); gap: 16px; } }
@media (max-width: 479px)  { .lp-products__grid { grid-template-columns: 1fr 1fr; gap: 12px; } }

/* ═══════════════════════════════════════════════════════
   CATEGORY BANNERS
═══════════════════════════════════════════════════════ */
.lp-catbanner {
  padding: 100px 0;
  background: var(--white-2);
}
.lp-catbanner__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.lp-catbanner__card {
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  height: 300px;
  cursor: pointer;
  transition: transform .35s, box-shadow .35s;
}
.lp-catbanner__card:hover {
  transform: scale(1.02);
  box-shadow: 0 24px 60px rgba(124,58,237,0.2);
}
.lp-catbanner__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.lp-catbanner__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(26,26,46,0.7) 0%, rgba(26,26,46,0.15) 100%);
}
.lp-catbanner__body {
  position: absolute;
  inset: 0;
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.lp-catbanner__sub  { font-size: 12px; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 1px; }
.lp-catbanner__offer {
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  font-weight: 700;
  color: white;
  
}
.lp-catbanner__cta {
  display: inline-flex;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  color: white;
  background: rgba(255,255,255,0.15);
  border-radius: 100px;
  padding: 6px 16px;
}

/* skeleton */
.lp-catbanner__sk {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.lp-catbanner__sk-card { border-radius: 24px; height: 300px; }

@media (max-width: 1023px) {
  .lp-catbanner__grid  { grid-template-columns: 1fr 1fr; }
  .lp-catbanner__sk    { grid-template-columns: 1fr 1fr; }
  .lp-catbanner__card  { height: 240px; }
  .lp-catbanner__sk-card { height: 240px; }
}
@media (max-width: 639px) {
  .lp-catbanner__grid  { grid-template-columns: 1fr; }
  .lp-catbanner__sk    { grid-template-columns: 1fr; }
  .lp-catbanner__card  { height: 200px; }
  .lp-catbanner__sk-card { height: 200px; }
}

/* ═══════════════════════════════════════════════════════
   FEATURES
═══════════════════════════════════════════════════════ */
.lp-features {
  padding: 100px 0;
  background: var(--charcoal);
  position: relative;
  overflow: hidden;
}
.lp-features__bg {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 15% 85%, rgba(124,58,237,0.08) 0%, transparent 50%),
    radial-gradient(circle at 85% 15%, rgba(124,58,237,0.05) 0%, transparent 50%);
  pointer-events: none;
}
.lp-features__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  border: 1px solid rgba(124,58,237,0.15);
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  z-index: 2;
}
.lp-features__item {
  padding: 44px 32px;
  background: rgba(255,255,255,0.03);
  border-right: 1px solid rgba(124,58,237,0.12);
  transition: background .3s;
  cursor: default;
}
.lp-features__item:last-child { border-right: none; }
.lp-features__item:hover { background: rgba(124,58,237,0.08); }
.lp-features__stat  { font-size: 10px; font-weight: 700; letter-spacing: 2px; color: var(--purple-2); text-transform: uppercase; margin-bottom: 14px; }
.lp-features__icon  {
  width: 52px; height: 52px;
  border-radius: 14px;
  background: rgba(124,58,237,0.15);
  border: 1px solid rgba(124,58,237,0.25);
  display: flex; align-items: center; justify-content: center;
  font-size: 24px;
  margin-bottom: 20px;
}
.lp-features__title { font-size: 18px; font-weight: 600; color: white; margin-bottom: 10px;  }
.lp-features__desc  { color: rgba(255,255,255,0.42); line-height: 1.85; font-size: 13px; }

@media (max-width: 1023px) {
  .lp-features__grid { grid-template-columns: repeat(2, 1fr); }
  .lp-features__item { border-right: none; border-bottom: 1px solid rgba(124,58,237,0.12); }
  .lp-features__item:last-child { border-bottom: none; }
}
@media (max-width: 479px) {
  .lp-features__grid { grid-template-columns: 1fr; }
  .lp-features { padding: 72px 0; }
}

/* ═══════════════════════════════════════════════════════
   TESTIMONIALS
═══════════════════════════════════════════════════════ */
.lp-reviews {
  padding: 104px 0;
  background: var(--white);
}
.lp-reviews__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.lp-review {
  padding: 36px 32px;
  background: white;
  border: 1.5px solid var(--border-2);
  border-radius: 24px;
  transition: all .4s cubic-bezier(0.16,1,0.3,1);
  cursor: pointer;
  position: relative;
}
.lp-review--active {
  background: var(--purple-pale);
  border-color: var(--purple);
  transform: translateY(-8px);
  box-shadow: 0 20px 48px rgba(124,58,237,0.14);
}
.lp-review__quote {
  font-size: 72px;
  color: var(--purple);
  opacity: .12;
  line-height: .8;
 
  position: absolute;
  top: 24px; right: 28px;
}
.lp-review__text {
  color: var(--ink-60);
  line-height: 1.9;
  margin-bottom: 20px;
  font-size: 14.5px;
  font-style: italic;
 
}
.lp-review__author {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 20px;
}
.lp-review__avatar {
  width: 48px; height: 48px;
  border-radius: 50%;
  background: var(--charcoal);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; font-weight: 600; color: var(--purple);
  flex-shrink: 0;
  border: 2px solid var(--purple);
}
.lp-review__name { font-weight: 600; font-size: 14.5px; color: var(--ink); }
.lp-review__role { font-size: 11px; color: var(--mid); }

@media (max-width: 1023px) { .lp-reviews__grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 639px)  { .lp-reviews__grid { grid-template-columns: 1fr; } }

/* ═══════════════════════════════════════════════════════
   NEWSLETTER
═══════════════════════════════════════════════════════ */
.lp-nl {
  padding: 104px 0;
  background: var(--white);
  position: relative;
  overflow: hidden;
}
.lp-nl__deco {
  position: absolute;
  font-size: 120px;
  opacity: .04;
 
  color: var(--purple);
  line-height: 1;
  pointer-events: none;
  user-select: none;
}
.lp-nl__deco--tl { top: 10%; left: 5%; }
.lp-nl__deco--br { bottom: 10%; right: 5%; }
.lp-nl__inner {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
  padding: 0 var(--page-px);
}
.lp-nl__title {
  font-size: clamp(2rem, 3.5vw, 3rem);
  color: var(--ink);
  margin-bottom: 14px;
  font-weight: 600;
  letter-spacing: -.03em;
}
.lp-nl__sub { color: var(--mid); margin-bottom: 40px; font-size: 15px; line-height: 1.85; }
.lp-nl__form {
  display: flex;
  border-radius: 100px;
  overflow: hidden;
  border: 1.5px solid var(--border);
  background: white;
  box-shadow: 0 8px 32px rgba(124,58,237,0.1);
}
.lp-nl__input {
  flex: 1;
  padding: 15px 24px;
  background: transparent;
  border: none;
  outline: none;
  color: var(--ink);
  font-size: 14px;

  min-width: 0;
}
.lp-nl__success {
  background: var(--purple-pale);
  border: 1.5px solid var(--purple);
  border-radius: 18px;
  padding: 20px 32px;
  color: var(--purple);
  font-weight: 600;
  font-size: 15.5px;
}
.lp-nl__fine { font-size: 11px; color: var(--mid); margin-top: 16px; letter-spacing: .3px; }

@media (max-width: 639px) {
  .lp-nl__form { flex-direction: column; border-radius: 18px; }
  .lp-nl__input { padding: 14px 20px; }
}

/* ═══════════════════════════════════════════════════════
   CART DRAWER
═══════════════════════════════════════════════════════ */
.lp-cart-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(26,26,46,0.45);
  z-index: 1001;
  backdrop-filter: blur(6px);
}
.lp-cart-drawer {
  position: fixed;
  top: 0; right: 0; bottom: 0;
  width: 400px;
  z-index: 1002;
  background: var(--white);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  box-shadow: -12px 0 60px rgba(0,0,0,0.12);
  transition: transform .45s cubic-bezier(0.16,1,0.3,1);
}
.lp-cart-drawer--closed { transform: translateX(100%); box-shadow: none; }

@media (max-width: 479px) {
  .lp-cart-drawer { width: 100%; }
}

/* ═══════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════ */
.lp-toast {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 9999;
  background: var(--charcoal);
  color: white;
  padding: 14px 24px;
  border-radius: 14px;
  box-shadow: 0 12px 48px rgba(0,0,0,0.28);
  animation: slideRight .4s cubic-bezier(0.16,1,0.3,1);
  border: 1px solid rgba(124,58,237,0.3);
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;

}
.lp-toast__dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--purple);
  display: inline-block;
  flex-shrink: 0;
  animation: pulseRing 2s infinite;
}

@media (max-width: 479px) {
  .lp-toast { bottom: 16px; right: 16px; left: 16px; font-size: 13px; }
}
`;

/* ─────────────────────────────────────────────────────────
   STATIC DATA
───────────────────────────────────────────────────────── */
const CAT_ICONS = { All: "✦", Skincare: "💧", Lips: "💄", Eyes: "👁", Face: "🌸" };

const HERO_SLIDES = [
 
  { type: "video", media: beautyVideo, label: "Trending Now", title: "Beauty\nRedefined", subtitle: "Experience premium beauty products designed for every skin tone and style.", button: "Explore Collection" },
 { type: "video", media: hero1, label: "New Season", title: "Glow\nNaturally", subtitle: "Luxury skincare and beauty essentials crafted for radiant, effortless confidence.", button: "Shop Now" },
  { type: "video", media: hero3, label: "Skincare Edit", title: "Skincare That\nLoves You", subtitle: "Hydrate, nourish, and glow with dermatologist-approved formulas.", button: "View Products" },
];

// const REELS_DATA = [
//   { id: 1, views: "285K", brand: "Maybelline", title: "New Cloudtopia cheek & lip mousse", img: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=400", products: 5, price: "₹699" },
//   { id: 2, views: "65.3K", brand: "YSL", title: "Cute packaging made me buy it", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=400", products: 4, price: "₹7,600" },
//   { id: 3, views: "5.6K", brand: "Trending", title: "Fruit inspired beauty trend: Guava", img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=400", products: 6, price: "₹1,299" },
//   { id: 4, views: "120K", brand: "Maybelline", title: "JUST IN: Maybelline's Serum Lipstick", img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400", products: 6, price: "₹850" },
// ];
export const REELS_DATA = [
  {
    id: 1,
    views: "285K",
    brand: "Maybelline",
    title: "New Cloudtopia Cheek & Lip Mousse",
    video: hero1,
    products: 5,
    price: "₹699",
  },
  {
    id: 2,
    views: "65.3K",
    brand: "YSL",
    title: "Cute packaging made me buy it",
    video: hero3,
    products: 4,
    price: "₹7,600",
  },
  {
    id: 3,
    views: "5.6K",
    brand: "Trending",
    title: "Fruit Inspired Beauty Trend: Guava",
    video: hero4,
    products: 6,
    price: "₹1,299",
  },
  {
    id: 4,
    views: "120K",
    brand: "Maybelline",
    title: "JUST IN: Maybelline's Serum Lipstick",
 video:hero5,
    products: 6,
    price: "₹1,299",
  }
]

const REVIEWS = [
  { id: 1, name: "Aanya Sharma", loc: "Mumbai", role: "Beauty Enthusiast", avatar: "A", rating: 5, text: "ShopHub transformed my skincare routine. The glow serum is absolutely divine — my skin has never looked better!" },
  { id: 2, name: "Priya Nair", loc: "Bengaluru", role: "Makeup Artist", avatar: "P", rating: 5, text: "The lipstick collection is unreal. Velvet Matte stays all day without drying. I have bought every shade available!" },
  { id: 3, name: "Kavya Reddy", loc: "Chennai", role: "Skincare Blogger", avatar: "K", rating: 5, text: "Best beauty destination online. Fast delivery, authentic products, and the packaging is so luxurious!" },
];

const FEATURES = [
  { icon: "🚚", title: "Free Delivery", desc: "Free shipping on orders above ₹499. Express delivery available.", stat: "2-Day" },
  { icon: "🔄", title: "Easy Returns", desc: "30-day hassle-free returns. No questions asked policy.", stat: "30 Days" },
  { icon: "🔒", title: "Secure Payment", desc: "100% secure checkout with PCI-DSS compliance.", stat: "100%" },
  { icon: "💯", title: "100% Authentic", desc: "All products sourced directly from authorised distributors.", stat: "Verified" },
];

const VISIBLE = 4;
const GAP = 24;

/* ─────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────── */
const Stars = ({ rating }) => (
  <span>
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{ color: i <= Math.round(rating) ? "#7c3aed" : "#d8cfc0", fontSize: 13 }}>★</span>
    ))}
  </span>
);

/* ─────────────────────────────────────────────────────────
   TOAST
───────────────────────────────────────────────────────── */
const Toast = () => {
  const dispatch = useDispatch();
  const toast = useSelector(s => s.ui.toast);
  useEffect(() => {
    if (toast) { const t = setTimeout(() => dispatch(hideToast()), 2800); return () => clearTimeout(t); }
  }, [toast, dispatch]);
  if (!toast) return null;
  return (
    <div className="lp-toast">
      <span className="lp-toast__dot" />
      {toast}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   HERO CAROUSEL
───────────────────────────────────────────────────────── */
const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);
  const slide = HERO_SLIDES[current];
  return (
    <section className="lp-hero">
      {slide.type === "video" ? (
        <video key={current} autoPlay muted loop playsInline src={slide.media} className="lp-hero__media" />
      ) : (
        <img key={current} src={slide.media} alt="" className="lp-hero__media" />
      )}
      <div className="lp-hero__overlay" />
      <div className="lp-hero__content">
        <div className="lp-hero__text">
          <span className="lp-hero__label">{slide.label}</span>
          <h1 className="lp-hero__title">{slide.title}</h1>
          <p className="lp-hero__sub">{slide.subtitle}</p>
          <button className="btn-purple" onClick={() => navigate("/products")}>
            {slide.button} →
          </button>
        </div>
      </div>
      <div className="lp-hero__dots">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`lp-hero__dot${current === i ? " lp-hero__dot--active" : ""}`}
            style={{ width: current === i ? 30 : 8 }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────
   BRAND STRIP MARQUEE
───────────────────────────────────────────────────────── */
const BrandStrip = () => {
  const dispatch = useDispatch();
  useEffect(() => { dispatch(fetchBrands()); }, [dispatch]);
  const { brands, brandsStatus } = useSelector(s => s.brands);
  if (brandsStatus === "loading" || !brands?.length) return null;
  const doubled = [...brands, ...brands];
  return (
    <div className="lp-strip">
      <div className="lp-strip__track marquee-track">
        {doubled.map((b, i) => (
          <span key={`${b._id}-${i}`} className="lp-strip__item">{b.name}</span>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   LUXE BRANDS GRID
───────────────────────────────────────────────────────── */
const LuxeBrandsGrid = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { brands, brandsStatus } = useSelector(s => s.brands);
  useEffect(() => { dispatch(fetchBrands()); }, [dispatch]);

  const row1 = brands?.slice(0, 2) ?? [];
  const row2 = brands?.slice(2, 5) ?? [];
  const loading = brandsStatus === "loading" || !brands?.length;

  return (
    <section className="lp-brands">
      <div className="lp-inner">
        <div className="lp-brands__hd">
          <div>
            <div className="lp-brands__eyebrow">Curated Selection</div>
            <h2 className="lp-brands__title">ShopHub <em>Luxe</em></h2>
          </div>
          <button className="lp-viewall" onClick={() => navigate("/brands")}>
            View all brands →
          </button>
        </div>

        {loading ? (
          <div className="lp-brands__sk-grid">
            <div className="sk-pulse lp-brands__sk-hero" />
            {[1,2,3,4].map(i => <div key={i} className="sk-pulse lp-brands__sk-card" />)}
          </div>
        ) : (
          /* The lb-grid is defined in luxebrand.css — we leave that intact */
          <div className="lb-grid">
            <div className="lb-card lb-card--hero" onClick={() => navigate(`/brands/${b._id}`)}>
              <img src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800" alt="Luxe Travel" />
              <div className="lb-overlay lb-overlay--hero" />
              <div className="lb-card-body">
                <div className="lb-card-tag">Featured Edit</div>
                <div className="lb-card-name lb-card-name--lg">Shop Beauty<br />On the Move</div>
              </div>
            </div>
            {row1.map(b => (
              <div key={b._id || b.name} className="lb-card lb-card--md"
             onClick={() => navigate(`/brands/${b._id}`)}>
                <img src={resolveImg(b.logo)} alt={b.name} loading="lazy" />
                <div className="lb-overlay" />
                <div className="lb-card-body">
                  <div className="lb-card-tag">{b.category || "Brand"}</div>
                  <div className="lb-card-name">{b.name}</div>
                  {b.sub && <div className="lb-card-sub">{b.sub}</div>}
                </div>
              </div>
            ))}
            {row2.map(b => (
              <div key={b._id || b.name} className="lb-card lb-card--sm"
         onClick={() => navigate(`/brands/${b._id}`)}>
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
        )}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────
   BANNER SECTION (uses BannerCarousel component)
───────────────────────────────────────────────────────── */
const BannerSection = () => {
  const dispatch = useDispatch();
  const banners = useSelector(selectBanners);
  useEffect(() => { dispatch(fetchBrandBanners()); }, [dispatch]);
  return <BannerCarousel banners={banners} />;
};

/* ─────────────────────────────────────────────────────────
   TOP BRANDS CAROUSEL
───────────────────────────────────────────────────────── */
const TopBrandsCarousel = () => {
  const [offset, setOffset]     = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const trackRef  = useRef(null);
  const timerRef  = useRef(null);
  const dispatch  = useDispatch();
  const { brands, brandsStatus } = useSelector(s => s.brands);
  const activeBrands = brands?.filter(b => b.active) ?? [];
  const navigate = useNavigate();
  const max = Math.max(activeBrands.length - VISIBLE, 0);

  useEffect(() => { dispatch(fetchBrands()); }, [dispatch]);

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setCardWidth((trackRef.current.offsetWidth - GAP * (VISIBLE - 1)) / VISIBLE);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeBrands.length]);

  const goTo = useCallback(n => setOffset(Math.max(0, Math.min(n, max))), [max]);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setOffset(p => (p >= max ? 0 : p + 1));
    }, 3500);
  }, [max]);

  useEffect(() => { startTimer(); return () => clearInterval(timerRef.current); }, [startTimer]);

  const handleNav = dir => { goTo(offset + dir); startTimer(); };
  const loading = brandsStatus === "loading";

  return (
    <section className="lp-tbc">
      <div className="lp-inner">
        <div className="lp-tbc__hd">
          <h2 className="lp-tbc__title">Top Brands On Offer</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div className="lp-tbc__arrows">
              <button className="lp-tbc__arrow" onClick={() => handleNav(-1)} disabled={offset === 0}>‹</button>
              <button className="lp-tbc__arrow" onClick={() => handleNav(1)} disabled={offset >= max}>›</button>
            </div>
            <button className="lp-viewall" onClick={() => navigate("/brands")}>View all →</button>
          </div>
        </div>

        {loading ? (
          <div className="lp-tbc__sk">
            {[1,2,3,4].map(i => (
              <div key={i} className="lp-tbc__sk-card">
                <div className="sk-pulse lp-tbc__sk-img" />
                <div className="lp-tbc__sk-body">
                  <div className="sk-pulse lp-tbc__sk-line" style={{ width: "70%" }} />
                  <div className="sk-pulse lp-tbc__sk-line" style={{ width: "50%" }} />
                  <div className="sk-pulse lp-tbc__sk-line" style={{ width: "40%", height: 32, borderRadius: 100 }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="lp-tbc__track-wrap" ref={trackRef}>
            <div className="lp-tbc__track"
              style={{ transform: `translateX(-${offset * (cardWidth + GAP)}px)` }}>
              {activeBrands.map(b => (
                <div key={b._id} className="lp-tbc__card" onClick={() => navigate(`/brands/${b._id}`)}>
                  <div className="lp-tbc__card-img">
                    <img src={resolveImg(b.logo)} alt={b.name}
                      onError={e => {
                        e.target.style.display = "none";
                        e.target.parentElement.textContent = b.name[0];
                      }}
                    />
                  </div>
                  <div className="lp-tbc__card-body">
                    <div className="lp-tbc__card-name">{b.name}</div>
                    <div className="lp-tbc__card-sub">{b.sub || "Premium Brand"}</div>
                    <button className="lp-tbc__card-btn">Shop Now →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && (
          <div className="lp-tbc__dots">
            {Array.from({ length: max + 1 }).map((_, i) => (
              <button key={i} className={`lp-tbc__dot${i === offset ? " lp-tbc__dot--active" : ""}`}
                style={{ width: i === offset ? 24 : 8 }}
                onClick={() => { goTo(i); startTimer(); }}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};



const ShoppableReels = () => {
  const [active, setActive] = useState(null);
  const navigate = useNavigate();

  return (
    <section className="lp-reels">
      <div className="lp-reels__bg" />
      <div className="lp-inner" style={{ position: "relative", zIndex: 2 }}>
        <div className="lp-reels__hd">
          <div>
            <div className="etiquette" style={{ marginBottom: 18, background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", color: "var(--purple-2)" }}>
              ▶ Beauty Reels
            </div>
            <h2 style={{ fontSize: "clamp(2.2rem,4vw,3.6rem)", fontWeight: 600, color: "white", letterSpacing: -.5 }}>
              Shop The <span className="shimmer-purple">Look</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14.5, marginTop: 8, fontFamily: "Outfit" }}>
              Click a reel to shop featured products instantly
            </p>
          </div>
          <button className="lp-viewall lp-viewall--ghost" onClick={() => navigate("/products")}>
            View All Reels →
          </button>
        </div>

        <div className="lp-reels__grid">
          {REELS_DATA.map((reel) => (
            <div 
              key={reel.id} 
              className="lp-reels__card"
              onClick={() => setActive(active === reel.id ? null : reel.id)}
            >
              {/* Video or Image */}
              {reel.video ? (
                <video
                  src={reel.video}
                  className="lp-reels__card-img"
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              ) : reel.img ? (
                <img 
                  src={reel.img} 
                  alt={reel.title} 
                  loading="lazy" 
                  className="lp-reels__card-img" 
                />
              ) : (
                <div className="lp-reels__card-img" style={{ background: "linear-gradient(135deg, #1a0a2e, #3b1fa8)" }} />
              )}
              
              <div className="lp-reels__card-grad" />
              
              {/* Views Badge */}
              <div style={{ 
                position: "absolute", top: 14, left: 14, 
                background: "rgba(0,0,0,0.5)", borderRadius: 100, 
                padding: "4px 12px", fontSize: 11, color: "white", 
                fontWeight: 600, backdropFilter: "blur(4px)"
              }}>
                👁 {reel.views}
              </div>
              
              {/* Play Button */}
              <div style={{ 
                position: "absolute", top: "50%", left: "50%", 
                transform: "translate(-50%,-50%)", 
                width: 52, height: 52, borderRadius: "50%", 
                background: "rgba(255,255,255,0.15)", 
                border: "2px solid rgba(255,255,255,0.4)", 
                display: "flex", alignItems: "center", justifyContent: "center", 
                fontSize: 18, color: "white", backdropFilter: "blur(8px)",
                pointerEvents: "none"
              }}>▶</div>
              
              {/* Bottom Content */}
              <div style={{ 
                position: "absolute", bottom: 0, left: 0, right: 0, 
                padding: "0 18px 18px" 
              }}>
                <div style={{ 
                  fontSize: 10, fontWeight: 700, letterSpacing: 1.5, 
                  color: "var(--purple-3)", textTransform: "uppercase", 
                  marginBottom: 4 
                }}>
                  {reel.brand}
                </div>
                <p style={{ 
                  fontSize: 13.5, color: "white", lineHeight: 1.5, 
                  marginBottom: 12, fontFamily: "Outfit" 
                }}>
                  {reel.title}
                </p>
                
                {active === reel.id ? (
                  <div style={{ 
                    background: "white", borderRadius: 14, 
                    padding: "12px 16px", 
                    display: "flex", alignItems: "center", 
                    justifyContent: "space-between",
                    animation: "slideUp 0.3s ease"
                  }}>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--mid)", fontFamily: "Outfit" }}>
                        {reel.products} products
                      </div>
                      <div style={{ 
                        fontSize: 15, fontWeight: 700, 
                        color: "var(--ink)", 
                        fontFamily: "Cormorant Garamond, serif" 
                      }}>
                        From {reel.price}
                      </div>
                    </div>
                    <button 
                      className="btn-purple" 
                      style={{ padding: "8px 16px", fontSize: 11 }}
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        navigate("/products"); 
                      }}
                    >
                      Shop Now →
                    </button>
                  </div>
                ) : (
                  <div style={{ 
                    display: "flex", alignItems: "center", 
                    justifyContent: "space-between" 
                  }}>
                    <span style={{ 
                      fontSize: 11, color: "rgba(255,255,255,0.6)", 
                      fontFamily: "Outfit" 
                    }}>
                      {reel.products} products
                    </span>
                    <span style={{ 
                      fontSize: 11, color: "var(--purple-3)", 
                      fontWeight: 600 
                    }}>
                      Tap to shop
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};



/* ─────────────────────────────────────────────────────────
   STATS BAND
───────────────────────────────────────────────────────── */
const StatsBand = () => (
  <section className="lp-stats">
    <div className="lp-inner">
      <div className="lp-stats__grid">
        {[
          { num: "4.8★", label: "Average Rating",    sub: "From 50K+ verified reviews" },
          { num: "200K+", label: "Happy Customers",  sub: "Worldwide beauty devotees" },
          { num: "5000+", label: "Premium Products", sub: "Curated collection" },
          { num: "100%",  label: "Authentic Always", sub: "Verified sourcing" },
        ].map((s, i) => (
          <div key={i} className="lp-stats__item">
            <div className="lp-stats__num">{s.num}</div>
            <div className="lp-stats__label">{s.label}</div>
            <div className="lp-stats__sub">{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────────────────────── */
const ProductCard = ({ p, isLoggedIn }) => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const inWish    = useSelector(s => s.wishlist.items.some(i => i.id === (p._id || p.id)));

  const productId = p._id || p.id;
  const price     = p.price || p.salePrice || 0;
  const name      = p.name || p.title || "Product";
  const image     = p.images?.[0] || p.image || null;
  const emoji     = p.emoji || "✨";
  const rating    = p.rating?.average || p.rating || 4.5;
  const reviews   = p.rating?.count || p.reviews || 0;
  const badge     = p.badge || (p.isBestSeller ? "Best Seller" : p.isNew ? "New" : "");
  const category  = p.category || "Beauty";

  // Handle wishlist click with login check
  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    // You need to implement toggleWishlist action
    // dispatch(toggleWishlist({ id: productId }));
    dispatch(showToast(inWish ? "Removed from wishlist" : "✦ Added to wishlist!"));
  };

  // Handle add to cart with login check
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    // Send productId and quantity as expected by the thunk
    dispatch(addToCartAsync({ 
      productId: productId,  // ← Send productId
      quantity: 1 
    }));
    dispatch(showToast(`✦ ${name} added!`));
  };

  return (
    <div className="lp-pcard">
      {badge && <div className="lp-pcard__badge" style={{ background: badge === "Best Seller" ? "var(--purple)" : badge === "New" ? "var(--forest)" : "var(--charcoal)" }}>{badge}</div>}
      <button
        className={`lp-pcard__wish${inWish ? " lp-pcard__wish--active" : ""}`}
        onClick={handleWishlistClick}
        aria-label={inWish ? "Remove from wishlist" : "Add to wishlist"}
      >
        {inWish ? "♥" : "♡"}
      </button>
      <div className="lp-pcard__img" onClick={() => navigate(`/product/${productId}`)}>
        {image ? (
          <img src={resolveImg(image)} alt={name} loading="lazy" />
        ) : (
          <span className="lp-pcard__img-emoji">{emoji}</span>
        )}
      </div>
      <div className="lp-pcard__body">
        <div className="lp-pcard__cat">{category}</div>
        <h3 className="lp-pcard__name" onClick={() => navigate(`/product/${productId}`)}>{name}</h3>
        <div className="lp-pcard__stars">
          <Stars rating={rating} />
          {reviews > 0 && <span className="lp-pcard__rev">({reviews})</span>}
        </div>
        <div className="lp-pcard__foot">
          <span className="lp-pcard__price">₹{price}</span>
          <button className="btn-purple" style={{ borderRadius: 100, padding: "9px 20px", fontSize: 11 }}
            onClick={handleAddToCart}>
            + Cart
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   PRODUCTS SECTION
───────────────────────────────────────────────────────── */



const ProductsSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items = [], loading, error, selectedCategory } = useSelector(s => s.products);
  const { token } = useSelector(s => s.login) || { token: null };
  const [categories, setCategories] = useState(["All"]);
  const [catsLoading, setCatsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setCatsLoading(true);
      try {
        const res = await fetchCategoriesApi();
        if (res.data.success) setCategories(["All", ...res.data.categories]);
      } catch (err) { console.error(err); }
      finally { setCatsLoading(false); }
    };
    load();
  }, []);

  useEffect(() => {
    const cat = selectedCategory === "All" ? "" : selectedCategory;
    dispatch(fetchProducts({ category: cat }));
  }, [selectedCategory, dispatch]);

  const isActive  = c => selectedCategory?.toLowerCase() === c.toLowerCase();
  const formatLbl = c => c === "All" ? "All" : c.charAt(0).toUpperCase() + c.slice(1).toLowerCase();

  const isLoggedIn = !!token;

  return (
    <section className="lp-products">
      <div className="lp-inner">
        <div className="lp-sec-head">
          <div className="etiquette">✦ Our Collection</div>
          <h2>Bestselling <span className="gradient-text">Products</span></h2>
        </div>

        <div className="lp-products__cats">
          {catsLoading ? (
            [1,2,3,4].map(i => (
              <div key={i} className="sk-pulse" style={{ width: 90, height: 40, borderRadius: 100 }} />
            ))
          ) : categories.map(c => (
            <button key={c}
              className={`lp-cat-btn${isActive(c) ? " lp-cat-btn--active" : ""}`}
              onClick={() => dispatch(setCategory(c))}>
              {CAT_ICONS?.[c]} {formatLbl(c)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="lp-products__grid">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="lp-pcard__sk">
                <div className="sk-pulse lp-pcard__sk-img" />
                <div className="lp-pcard__sk-body">
                  <div className="sk-pulse lp-pcard__sk-line" style={{ width: "60%" }} />
                  <div className="sk-pulse lp-pcard__sk-line" style={{ width: "80%" }} />
                  <div className="sk-pulse lp-pcard__sk-line" style={{ width: "40%" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                    <div className="sk-pulse" style={{ width: 60, height: 22, borderRadius: 4 }} />
                    <div className="sk-pulse" style={{ width: 90, height: 36, borderRadius: 100 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--mid)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <p style={{ fontSize: 16, color: "var(--ink)" }}>Something went wrong.</p>
            <button className="btn-purple" style={{ marginTop: 20 }} onClick={() => dispatch(fetchProducts({ category: "" }))}>Try again</button>
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--mid)" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 20, fontWeight: 600, color: "var(--ink)", fontFamily: "Cormorant Garamond, serif" }}>No products found</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>Try a different category</p>
            <button className="btn-purple" style={{ marginTop: 24 }} onClick={() => dispatch(setCategory("All"))}>View all products</button>
          </div>
        ) : (
          <div className="lp-products__grid">
            {items.slice(0, 8).map(p => (
              <ProductCard key={p._id || p.id} p={p} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        )}

        <div className="lp-products__footer">
          <button className="btn-purple" style={{ padding: "14px 48px", fontSize: 13, letterSpacing: 1.5 }}
            onClick={() => navigate("/products")}>
            VIEW ALL PRODUCTS →
          </button>
        </div>
      </div>
    </section>
  );
};



/* ─────────────────────────────────────────────────────────
   CATEGORY BANNERS
───────────────────────────────────────────────────────── */
const CategoryBanners = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { banners, loading } = useSelector(s => s.categoryBanners);
  const safeBanners = banners || [];
  useEffect(() => { dispatch(fetchCategoryBanners()); }, [dispatch]);

  return (
    <section className="lp-catbanner">
      <div className="lp-inner">
        <div className="lp-sec-head">
          <div className="etiquette">✦ Shop By Category</div>
          <h2>Explore <span className="gradient-text">Collections</span></h2>
        </div>

        {loading ? (
          <div className="lp-catbanner__sk">
            {[1,2,3].map(i => <div key={i} className="sk-pulse lp-catbanner__sk-card" />)}
          </div>
        ) : safeBanners.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--mid)" }}>No categories yet</div>
        ) : (
          <div className="lp-catbanner__grid">
            {safeBanners.map(b => (
              <div key={b._id} className="lp-catbanner__card"
                onClick={() => navigate(`/products?category=${b.category}`)}>
                <img src={b.img} alt={b.title} className="lp-catbanner__img" loading="lazy" />
                <div className="lp-catbanner__overlay" />
                <div className="lp-catbanner__body">
                  <div>
                    <p className="lp-catbanner__sub">{b.sub}</p>
                    <h3 className="lp-catbanner__offer">{b.offer}</h3>
                  </div>
                  <span className="lp-catbanner__cta">Shop {b.title} →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────
   FEATURES
───────────────────────────────────────────────────────── */
const FeaturesSection = () => (
  <section className="lp-features">
    <div className="lp-features__bg" />
    <div className="lp-inner" style={{ position: "relative", zIndex: 2 }}>
      <div className="lp-sec-head lp-sec-head--light" style={{ marginBottom: 52 }}>
        <div className="etiquette" style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", color: "var(--purple-2)" }}>✦ Why Choose Us</div>
        <h2>Shopping that feels <span className="shimmer-purple">luxurious</span></h2>
        <p>Premium beauty shopping with authentic products and unmatched service.</p>
      </div>
      <div className="lp-features__grid">
        {FEATURES.map((f, i) => (
          <div key={i} className="lp-features__item">
            <div className="lp-features__stat">{f.stat}</div>
            <div className="lp-features__icon">{f.icon}</div>
            <h3 className="lp-features__title">{f.title}</h3>
            <p className="lp-features__desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────────────────────── */
const TestimonialsSection = () => {
  const [active, setActive] = useState(0);
  return (
    <section className="lp-reviews">
      <div className="lp-inner">
        <div className="lp-sec-head">
          <div className="etiquette">✦ Customer Love</div>
          <h2>What Our <span className="gradient-text">Customers Say</span></h2>
        </div>
        <div className="lp-reviews__grid">
          {REVIEWS.map((r, i) => (
            <div key={r.id} className={`lp-review${active === i ? " lp-review--active" : ""}`}
              onClick={() => setActive(i)}>
              <div className="lp-review__quote">❝</div>
              <p className="lp-review__text">{r.text}</p>
              <Stars rating={r.rating} />
              <div className="lp-review__author">
                <div className="lp-review__avatar">{r.avatar}</div>
                <div>
                  <div className="lp-review__name">{r.name}</div>
                  <div className="lp-review__role">{r.role} · {r.loc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────
   NEWSLETTER
───────────────────────────────────────────────────────── */
const Newsletter = () => {
  const dispatch = useDispatch();
  const [email, setEmail]   = useState("");
  const [sent, setSent]     = useState(false);
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
    } finally { setLoading(false); }
  };

  return (
    <section className="lp-nl">
      <div className="lp-nl__deco lp-nl__deco--tl">✦</div>
      <div className="lp-nl__deco lp-nl__deco--br">✦</div>
      <div className="lp-nl__inner">
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <span className="etiquette">✦ Stay In The Loop</span>
        </div>
        <h2 className="lp-nl__title">
          Beauty Secrets &{" "}
          <span className="shimmer-purple">Exclusive Deals</span>
        </h2>
        <p className="lp-nl__sub">
          Subscribe for exclusive offers, new arrivals, and expert beauty tips delivered weekly.
        </p>
        {!sent ? (
          <div className="lp-nl__form">
            <input type="email" placeholder="your@email.com" value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSub()}
              className="lp-nl__input" />
            <button onClick={handleSub} disabled={loading} className="btn-purple"
              style={{ borderRadius: "0 100px 100px 0", padding: "15px 28px", margin: 0, opacity: loading ? .7 : 1 }}>
              {loading ? "…" : "Subscribe ✦"}
            </button>
          </div>
        ) : (
          <div className="lp-nl__success">✦ Welcome to the ShopHub Beauty Family!</div>
        )}
        <p className="lp-nl__fine">No spam, ever. Unsubscribe anytime.</p>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────
   CART DRAWER
───────────────────────────────────────────────────────── */
const CartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector(s => s.cart);
  const cartOpen = useSelector(s => s.ui.cartOpen);

  return (
    <>
      {cartOpen && <div className="lp-cart-backdrop" onClick={() => dispatch(toggleCart())} />}
      <div className={`lp-cart-drawer${cartOpen ? "" : " lp-cart-drawer--closed"}`}>
        <div style={{ padding: "26px 26px 20px", borderBottom: "1px solid var(--border-2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ fontWeight: 600, fontSize: 22, color: "var(--ink)", fontFamily: "Cormorant Garamond, serif" }}>Your Cart</h3>
          <button onClick={() => dispatch(toggleCart())} style={{ background: "var(--white-2)", border: "1px solid var(--border-2)", color: "var(--ink)", fontSize: 12, cursor: "pointer", padding: "7px 16px", borderRadius: 100, fontWeight: 600, letterSpacing: .5, textTransform: "uppercase" }}>✕ Close</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 26px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "70px 20px", color: "var(--mid)" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🛒</div>
              <p style={{ fontSize: 18, fontWeight: 600, color: "var(--ink)", fontFamily: "Cormorant Garamond, serif" }}>Your cart is empty</p>
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
              <button onClick={() => dispatch(removeItemAsync(item.id))} style={{ background: "var(--blush-2)", border: "none", borderRadius: 8, padding: "5px 10px", color: "var(--purple)", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>✕</button>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div style={{ padding: "22px 26px", borderTop: "1px solid var(--border-2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ color: "var(--mid)", fontSize: 14, textTransform: "uppercase", letterSpacing: 1 }}>Total</span>
              <span style={{ color: "var(--ink)", fontSize: 26, fontWeight: 600, fontFamily: "Cormorant Garamond, serif" }}>₹{(total || 0).toFixed(2)}</span>
            </div>
            <button className="btn-purple" style={{ width: "100%", borderRadius: 14, padding: 15, fontSize: 14 }}
              onClick={() => { dispatch(toggleCart()); navigate("/checkoutpage"); }}>
              Checkout →
            </button>
            <button onClick={() => dispatch(toggleCart())} className="btn-outline-dark"
              style={{ width: "100%", marginTop: 10, borderRadius: 14, padding: 12, fontSize: 12 }}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

/* ═══════════════════════════════════════════════════════════
   PAGE — SECTION ORDER (beauty e-commerce funnel)

   1.  Hero Carousel          ← first impression / brand statement
   2.  Brand Strip Marquee    ← social proof, brand names
   3.  Banner Carousel        ← campaign / sale banners
   4.  Luxe Brands Grid       ← editorial brand showcase
   5.  Top Brands Carousel    ← browsable brand discovery
   6.  Deals Carousel         ← urgency / deals
   7.  Products Section       ← primary shop with categories
   8.  Category Banners       ← category entry points
   9.  New Arrivals           ← freshness signal
   10. Featured Products      ← curated editorial
   11. Best Sellers           ← social proof products
   12. Shoppable Reels        ← engagement / inspiration
   13. Stats Band             ← trust signals
   14. Features               ← logistics/trust
   15. Testimonials           ← customer proof
   16. Newsletter             ← retention
   17. Footer
═══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <Navbar />

      {/* 1 — Hero */}
      <HeroCarousel />

      {/* 2 — Brand strip */}
      <BrandStrip />

      {/* 3 — Campaign banners */}
      <BannerSection />

      {/* 4 — Luxe brands grid */}
      <LuxeBrandsGrid />

      {/* 5 — Top brands carousel */}
      <TopBrandsCarousel />

      <div className="section-line" />

      {/* 6 — Deals */}
      <DealsCarousel />

      <div className="section-line" />

      {/* 7 — Products with category filter */}
      <ProductsSection />

      {/* 8 — Category banners */}
      <CategoryBanners />

      {/* 9 — New arrivals */}
      <NewArrivalsSection />

      {/* 10 — Featured products */}
      <FeaturedProductsSection />

      {/* 11 — Best sellers */}
      <BestSellersSection />

      <div className="section-line" />

      {/* 12 — Shoppable reels */}
      <ShoppableReels />

      <div className="section-line" />

      {/* 13 — Stats */}
      <StatsBand />

      {/* 14 — Features / why us */}
      <FeaturesSection />

      {/* 15 — Testimonials */}
      <TestimonialsSection />

      {/* 16 — Newsletter */}
      <Newsletter />

      

      {/* Global overlays */}
      <CartDrawer />
      <Toast />
    </>
  );
}