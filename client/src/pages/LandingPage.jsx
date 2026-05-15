import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart, removeFromCart } from "../redux/slices/cartSlice";
import { toggleWishlist } from "../redux/slices/wishlistSlice";
import { hideToast, setCategory, showToast, toggleCart } from "../redux/slices/uiSlice";

/* ─────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');

:root {
  --white: #ffffff;
  --off-white: #faf9fc;
  --purple-light: #f0e9ff;
  --purple-mid: #c9b3f5;
  --purple-soft: #e4d5ff;
  --purple-deep: #7c3aed;
  --purple-darker: #4c1d95;
  --purple-darkest: #2e1065;
  --text-dark: #1a0a2e;
  --text-mid: #4a3b6b;
  --text-muted: #8b7aa8;
  --gold: #c8952a;
  --gold-light: #f5e6c0;
  --rose: #d946a8;
  --bg: var(--white);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Outfit', sans-serif;
  background: var(--white);
  color: var(--text-dark);
  overflow-x: hidden;
}

h1,h2,h3,h4,h5 { font-family: 'Cormorant Garamond', serif; }

::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: var(--purple-light); }
::-webkit-scrollbar-thumb { background: var(--purple-mid); border-radius: 3px; }

@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
@keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
@keyframes fade-up { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
@keyframes slide-in-right { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
@keyframes pulse-ring { 0%{transform:scale(0.95);box-shadow:0 0 0 0 rgba(124,58,237,0.4)} 70%{transform:scale(1);box-shadow:0 0 0 12px rgba(124,58,237,0)} 100%{transform:scale(0.95);box-shadow:0 0 0 0 rgba(124,58,237,0)} }
@keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
@keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes carousel-slide { from{opacity:0;transform:scale(1.04)} to{opacity:1;transform:scale(1)} }

.fade-up { animation: fade-up 0.7s ease forwards; }
.float { animation: float 4s ease-in-out infinite; }

/* Typography */
.display-serif {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, var(--purple-deep) 0%, var(--rose) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gold-text {
  background: linear-gradient(135deg, #c8952a 0%, #f0c96a 50%, #c8952a 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 4s linear infinite;
}

/* Dividers */
.section-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--purple-mid), transparent);
  margin: 0;
}

/* Pill tags */
.tag-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--purple-light);
  border: 1px solid var(--purple-soft);
  border-radius: 100px;
  padding: 6px 16px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--purple-deep);
  font-family: 'Outfit', sans-serif;
}

/* Buttons */
.btn-primary-purple {
  background: var(--purple-deep);
  color: white;
  border: none;
  border-radius: 100px;
  padding: 13px 30px;
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.3px;
  position: relative;
  overflow: hidden;
}
.btn-primary-purple:hover {
  background: var(--purple-darker);
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(124,58,237,0.35);
}

.btn-outline-purple {
  background: transparent;
  color: var(--purple-deep);
  border: 1.5px solid var(--purple-deep);
  border-radius: 100px;
  padding: 12px 28px;
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-outline-purple:hover {
  background: var(--purple-light);
  transform: translateY(-2px);
}

.btn-dark-purple {
  background: var(--purple-darkest);
  color: white;
  border: none;
  border-radius: 100px;
  padding: 13px 30px;
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-dark-purple:hover {
  background: var(--purple-darker);
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(76,29,149,0.4);
}

/* Cards */
.card-white {
  background: var(--white);
  border: 1px solid var(--purple-soft);
  border-radius: 20px;
  transition: all 0.35s ease;
}
.card-white:hover {
  border-color: var(--purple-mid);
  box-shadow: 0 16px 48px rgba(124,58,237,0.12);
  transform: translateY(-6px);
}

.card-purple-light {
  background: var(--purple-light);
  border: 1px solid var(--purple-soft);
  border-radius: 20px;
  transition: all 0.35s ease;
}

.card-deep {
  background: var(--purple-darkest);
  border-radius: 20px;
  transition: all 0.35s ease;
}
`;

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const PRODUCTS = [
  {id:1,name:"Velvet Matte Lipstick",  category:"Lips",     price:24,rating:4.8,reviews:312,badge:"Best Seller",emoji:"💄",color:"#c0392b"},
  {id:2,name:"Glow Serum Radiance",    category:"Skincare", price:68,rating:4.9,reviews:189,badge:"New",         emoji:"✨",color:"#7c3aed"},
  {id:3,name:"Smoky Eye Palette",      category:"Eyes",     price:45,rating:4.7,reviews:254,badge:"",            emoji:"👁️",color:"#8e44ad"},
  {id:4,name:"Cloud Blush Duo",        category:"Face",     price:32,rating:4.6,reviews:143,badge:"",            emoji:"🌸",color:"#d946a8"},
  {id:5,name:"Lash Amplify Mascara",   category:"Eyes",     price:28,rating:4.8,reviews:421,badge:"Best Seller", emoji:"🪄",color:"#1a1a2e"},
  {id:6,name:"Hyaluronic Moisturizer", category:"Skincare", price:54,rating:4.9,reviews:302,badge:"Top Rated",   emoji:"💧",color:"#3498db"},
  {id:7,name:"Satin Foundation SPF30", category:"Face",     price:48,rating:4.7,reviews:178,badge:"",            emoji:"🪞",color:"#d4a574"},
  {id:8,name:"Vitamin C Brightener",   category:"Skincare", price:72,rating:4.8,reviews:267,badge:"New",         emoji:"🍊",color:"#c8952a"},
];

const CATEGORIES = ["All","Skincare","Lips","Eyes","Face"];
const CAT_ICONS = {All:"✨",Skincare:"💧",Lips:"💄",Eyes:"👁️",Face:"🌸"};

const BRANDS = ["H&M","Nike","Fenty Beauty","Charlotte Tilbury","NARS","Rare Beauty","Huda Beauty","MAC","Urban Decay","Too Faced","PUMA","Cider"];
const BRAND_DISCOUNTS = ["Up to 60% off","Up to 40% off","Up to 70% off","Min 40-60% off","Up to 50% off","Up to 35% off"];

// Hero carousel slides — emoji placeholders for where real photos/videos would go
const HERO_SLIDES = [
  {
    tag:"New Arrivals 2025",
    title:"Unveil Your",
    highlight:"Inner Radiance",
    sub:"Premium beauty curated for every skin tone and type. 200+ brands, endless glow.",
    cta:"Explore Collection",
    bg:"linear-gradient(135deg, #f0e9ff 0%, #e4d5ff 60%, #c9b3f5 100%)",
    accent:"#7c3aed",
    visual:"💄",
    visualBg:"linear-gradient(135deg,#7c3aed22,#d946a833)",
  },
  {
    tag:"Skincare Edit",
    title:"Luxury Skincare",
    highlight:"For Every Skin",
    sub:"Science-backed formulas with natural botanicals. Your daily ritual, elevated.",
    cta:"Shop Skincare",
    bg:"linear-gradient(135deg, #faf9fc 0%, #f0e9ff 60%, #e4d5ff 100%)",
    accent:"#4c1d95",
    visual:"✨",
    visualBg:"linear-gradient(135deg,#4c1d9522,#7c3aed44)",
  },
  {
    tag:"Makeup Drop",
    title:"Bold Colors,",
    highlight:"Bold You",
    sub:"Makeup that celebrates your unique beauty story. Express, don't conform.",
    cta:"Shop Makeup",
    bg:"linear-gradient(135deg, #fff0fa 0%, #f0e9ff 60%, #e4d5ff 100%)",
    accent:"#d946a8",
    visual:"🌸",
    visualBg:"linear-gradient(135deg,#d946a822,#7c3aed33)",
  },
];

const REVIEWS = [
  {id:1,name:"Aanya Sharma",  loc:"Mumbai",   role:"Beauty Enthusiast", avatar:"A", rating:5, text:"ShopHub transformed my skincare routine completely. The glow serum is absolutely divine — my skin has never looked better!"},
  {id:2,name:"Priya Nair",    loc:"Bengaluru",role:"Makeup Artist",      avatar:"P", rating:5, text:"The lipstick collection is unreal. Velvet Matte stays all day without drying. I have bought every shade available!"},
  {id:3,name:"Kavya Reddy",   loc:"Chennai",  role:"Skincare Blogger",   avatar:"K", rating:5, text:"Best beauty destination online. Fast delivery, authentic products, and the packaging is so luxurious!"},
];

const STEPS = [
  {n:"01",title:"Cleanse",    desc:"Remove impurities and prep your skin.",                emoji:"🧼",color:"#7c3aed"},
  {n:"02",title:"Tone",       desc:"Balance skin pH for better absorption.",              emoji:"💦",color:"#9c4fee"},
  {n:"03",title:"Serum",      desc:"Target specific concerns with active ingredients.",   emoji:"✨",color:"#b668f5"},
  {n:"04",title:"Moisturise", desc:"Lock in hydration for plump, glowing skin.",         emoji:"💧",color:"#c9b3f5"},
  {n:"05",title:"SPF",        desc:"Always finish with broad-spectrum sun protection.",   emoji:"☀️",color:"#c8952a"},
];

const FEATURES = [
  {icon:"🚚",title:"Free Delivery",  desc:"Free shipping on orders above ₹499. Express delivery available.", bg:"#f0e9ff"},
  {icon:"🔄",title:"Easy Returns",   desc:"30-day hassle-free returns. No questions asked policy.",          bg:"#fff0fa"},
  {icon:"🔒",title:"Secure Payment", desc:"100% secure checkout with PCI-DSS compliance.",                  bg:"#f0e9ff"},
  {icon:"💯",title:"100% Authentic", desc:"All products sourced directly from authorised distributors.",     bg:"#fff8e6"},
];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const Stars = ({ rating, dark = false }) => (
  <span>
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{color: i <= Math.round(rating) ? "#c8952a" : dark ? "rgba(0,0,0,0.15)" : "rgba(200,149,42,0.25)", fontSize:13}}>★</span>
    ))}
  </span>
);

/* ─────────────────────────────────────────────
   TOAST
───────────────────────────────────────────── */
const Toast = () => {
  const dispatch = useDispatch();
  const toast = useSelector(s => s.ui.toast);
  useEffect(() => {
    if (toast) { const t = setTimeout(() => dispatch(hideToast()), 2500); return () => clearTimeout(t); }
  }, [toast, dispatch]);
  if (!toast) return null;
  return (
    <div style={{
      position:"fixed",bottom:32,right:32,zIndex:9999,
      background:"white",
      color:  "var(--text-dark)",
      padding:"14px 22px",borderRadius:14,
      boxShadow:"0 8px 40px rgba(124,58,237,0.2), 0 2px 8px rgba(0,0,0,0.08)",
      animation:"slide-in-right .4s ease",
      border:"1px solid var(--purple-soft)",fontSize:14,fontWeight:500,
      display:"flex",alignItems:"center",gap:8,
    }}>
      <span style={{width:8,height:8,borderRadius:"50%",background:"var(--purple-deep)",display:"inline-block",flexShrink:0}}/>
      {toast}
    </div>
  );
};

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
const Navbar = () => {
  const dispatch = useDispatch();
  const cartCount = useSelector(s => s.cart.items.reduce((a,i) => a + i.qty, 0));
  const wishCount = useSelector(s => s.wishlist.items.length);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navLinks = ["Home","Shop","Collections","Brands","About"];

  return (
    <nav style={{
      position:"fixed",top:0,left:0,right:0,zIndex:1000,
      background: scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.85)",
      backdropFilter:"blur(20px)",
      borderBottom:"1px solid var(--purple-soft)",
      transition:"all .3s ease",padding:"0 24px",
      boxShadow: scrolled ? "0 4px 20px rgba(124,58,237,0.08)" : "none",
    }}>
      <div style={{maxWidth:1280,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:68}}>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
          <div style={{
            width:36,height:36,borderRadius:10,
            background:"linear-gradient(135deg, var(--purple-deep), var(--rose))",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:15,color:"white",fontWeight:800,fontFamily:"Cormorant Garamond",
            letterSpacing:-1,
          }}>S</div>
          <span style={{fontFamily:"Cormorant Garamond",fontWeight:700,fontSize:22,color:"var(--text-dark)",letterSpacing:-0.5}}>
            Shop<span style={{color:"var(--purple-deep)"}}>Hub</span>
          </span>
        </div>

        {/* Desktop links */}
        <div style={{display:"flex",gap:32,alignItems:"center"}}>
          {navLinks.map(l => (
            <a key={l} href="#" style={{color:"var(--text-mid)",textDecoration:"none",fontSize:14,fontWeight:500,letterSpacing:0.2,transition:"color .2s"}}
               onMouseEnter={e=>e.target.style.color="var(--purple-deep)"}
               onMouseLeave={e=>e.target.style.color="var(--text-mid)"}>{l}</a>
          ))}
        </div>

        {/* Actions */}
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {/* Search */}
          <button style={{background:"var(--purple-light)",border:"1px solid var(--purple-soft)",color:"var(--text-mid)",fontSize:14,cursor:"pointer",padding:"8px 14px",borderRadius:100,display:"flex",alignItems:"center",gap:6}}>
            <span>🔍</span>
            <span style={{fontSize:13,color:"var(--text-muted)"}}>Search</span>
          </button>
          {/* Cart */}
          <button onClick={()=>dispatch(toggleCart())} style={{background:"var(--purple-light)",border:"1px solid var(--purple-soft)",color:"var(--text-dark)",fontSize:16,cursor:"pointer",position:"relative",padding:"8px 14px",borderRadius:100,display:"flex",alignItems:"center",gap:6}}>
            🛒
            {cartCount > 0 && <span style={{background:"var(--purple-deep)",color:"white",borderRadius:"50%",width:18,height:18,fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",position:"absolute",top:2,right:2}}>{cartCount}</span>}
            {cartCount > 0 && <span style={{fontSize:12,fontWeight:600,color:"var(--purple-deep)"}}>{cartCount}</span>}
          </button>
          {/* Wishlist */}
          <button style={{background:"transparent",border:"none",color:"var(--text-mid)",fontSize:18,cursor:"pointer",position:"relative",padding:8}}>
            ♡{wishCount > 0 && <span style={{position:"absolute",top:2,right:2,background:"var(--rose)",color:"white",borderRadius:"50%",width:16,height:16,fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{wishCount}</span>}
          </button>
          <Link to="/login" style={{borderRadius:100,padding:"9px 20px",fontSize:13,textDecoration:"none",color:"var(--purple-deep)",fontWeight:600,border:"1.5px solid var(--purple-deep)",fontFamily:"Outfit"}}>
            Sign In
          </Link>
          <Link to="/register" style={{borderRadius:100,padding:"9px 20px",fontSize:13,textDecoration:"none",color:"white",fontWeight:600,background:"var(--purple-deep)",fontFamily:"Outfit"}}>
            Join Free
          </Link>
        </div>
      </div>
    </nav>
  );
};

/* ─────────────────────────────────────────────
   HERO CAROUSEL (auto-play, supports photos/videos)
───────────────────────────────────────────── */
const HeroCarousel = () => {
  const [idx, setIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const goTo = (i) => {
    if (animating || i === idx) return;
    setAnimating(true);
    setIdx(i);
    setTimeout(() => setAnimating(false), 700);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIdx(p => (p + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timerRef.current);
  }, []);

  const s = HERO_SLIDES[idx];

  return (
    <section style={{
      marginTop:68, /* navbar height */
      minHeight:"92vh",
      background: s.bg,
      transition:"background 1.2s ease",
      position:"relative",
      overflow:"hidden",
      display:"flex",
      alignItems:"center",
    }}>
      {/* Decorative blobs */}
      <div style={{position:"absolute",width:600,height:600,borderRadius:"50%",background:"rgba(124,58,237,0.07)",top:"-15%",right:"-8%",filter:"blur(100px)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",width:300,height:300,borderRadius:"50%",background:"rgba(217,70,168,0.06)",bottom:"5%",left:"5%",filter:"blur(80px)",pointerEvents:"none"}}/>

      {/* Slide content */}
      <div style={{maxWidth:1280,margin:"0 auto",padding:"60px 40px",width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}}>
        {/* Left: copy */}
        <div key={idx} style={{animation:"fade-up 0.7s ease forwards"}}>
          <div className="tag-pill" style={{marginBottom:24}}>✦ {s.tag}</div>
          <h1 style={{
            fontSize:"clamp(3rem,6vw,5.5rem)",
            lineHeight:1.05,
            marginBottom:22,
            color:"var(--text-dark)",
            fontWeight:700,
          }}>
            {s.title}<br/>
            <span className="gradient-text">{s.highlight}</span>
          </h1>
          <p style={{fontSize:17,color:"var(--text-mid)",marginBottom:38,lineHeight:1.75,maxWidth:480,fontWeight:400}}>{s.sub}</p>
          <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:52}}>
            <button className="btn-primary-purple">🛍 {s.cta}</button>
            <button className="btn-outline-purple">Watch Story ▶</button>
          </div>
          {/* Stats */}
          <div style={{display:"flex",gap:40,flexWrap:"wrap"}}>
            {[["50K+","Happy Customers"],["200+","Premium Brands"],["4.9★","Avg Rating"]].map(([n,l]) => (
              <div key={l}>
                <div style={{fontSize:24,fontWeight:700,color:"var(--purple-deep)",fontFamily:"Cormorant Garamond"}}>{n}</div>
                <div style={{fontSize:12,color:"var(--text-muted)",fontWeight:500,marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Visual (replace div with <img> or <video> for real media) */}
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",position:"relative"}}>
          {/* Main visual placeholder — swap with <img src="..." /> or <video autoPlay muted loop /> */}
          <div key={`v-${idx}`} style={{
            width:380,height:420,borderRadius:32,
            background: s.visualBg,
            border:"1.5px solid rgba(124,58,237,0.2)",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:120,
            animation:"carousel-slide 0.7s ease forwards",
            boxShadow:"0 32px 80px rgba(124,58,237,0.15), 0 8px 24px rgba(0,0,0,0.06)",
            position:"relative",overflow:"hidden",
          }}>
            {/* Overlay gradient for image/video */}
            <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 60%,rgba(124,58,237,0.08) 100%)"}}/>
            {/* Emoji placeholder (replace with actual img/video) */}
            <span className="float" style={{position:"relative",zIndex:1}}>{s.visual}</span>
            {/* Photo upload hint overlay */}
            <div style={{position:"absolute",bottom:16,left:16,right:16,background:"rgba(255,255,255,0.9)",backdropFilter:"blur(8px)",borderRadius:12,padding:"10px 14px",border:"1px solid var(--purple-soft)"}}>
              <div style={{fontSize:11,color:"var(--text-muted)",fontWeight:500}}>📷 Replace with real photo/video</div>
            </div>
          </div>

          {/* Floating badges */}
          {[
            {emoji:"⭐",label:"4.9 Rating",top:"8%",right:"-2%"},
            {emoji:"🚚",label:"Free Ship",bottom:"22%",right:"-4%"},
            {emoji:"💯",label:"Authentic",bottom:"10%",left:"-2%"},
          ].map(b => (
            <div key={b.label} style={{
              position:"absolute",top:b.top,right:b.right,bottom:b.bottom,left:b.left,
              background:"white",
              border:"1px solid var(--purple-soft)",
              borderRadius:12,padding:"9px 14px",
              display:"flex",alignItems:"center",gap:7,fontSize:12,fontWeight:600,
              boxShadow:"0 8px 24px rgba(124,58,237,0.1)",
              color:"var(--text-dark)",
              animation:"float 3.5s ease-in-out infinite",
            }}>
              <span>{b.emoji}</span>
              <span style={{color:"var(--purple-deep)"}}>{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Slide indicators */}
      <div style={{position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",display:"flex",gap:8,alignItems:"center"}}>
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            width: i === idx ? 32 : 8, height:8,
            borderRadius:4,border:"none",cursor:"pointer",
            background: i === idx ? "var(--purple-deep)" : "rgba(124,58,237,0.25)",
            transition:"all .3s ease",
          }}/>
        ))}
      </div>

      {/* Nav arrows */}
      {[{dir:"prev",label:"‹",pos:{left:24}},{dir:"next",label:"›",pos:{right:24}}].map(({dir,label,pos}) => (
        <button key={dir} onClick={() => goTo(dir === "next" ? (idx+1)%HERO_SLIDES.length : (idx-1+HERO_SLIDES.length)%HERO_SLIDES.length)}
          style={{
            position:"absolute",top:"50%",transform:"translateY(-50%)",...pos,
            width:44,height:44,borderRadius:"50%",
            background:"white",border:"1px solid var(--purple-soft)",
            color:"var(--purple-deep)",fontSize:22,cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:"0 4px 16px rgba(124,58,237,0.12)",
            transition:"all .2s",fontWeight:300,
          }}
          onMouseEnter={e=>{e.currentTarget.style.background="var(--purple-deep)";e.currentTarget.style.color="white";}}
          onMouseLeave={e=>{e.currentTarget.style.background="white";e.currentTarget.style.color="var(--purple-deep)";}}
        >{label}</button>
      ))}
    </section>
  );
};

/* ─────────────────────────────────────────────
   BRAND STRIP
───────────────────────────────────────────── */
const BrandStrip = () => (
  <div style={{background:"var(--purple-light)",padding:"18px 0",overflow:"hidden",borderTop:"1px solid var(--purple-soft)",borderBottom:"1px solid var(--purple-soft)"}}>
    <div style={{display:"flex",gap:56,animation:"marquee 28s linear infinite",whiteSpace:"nowrap",width:"200%"}}>
      {[...BRANDS,...BRANDS].map((b,i) => (
        <span key={i} style={{fontSize:12,fontWeight:700,letterSpacing:1.5,color:"var(--purple-deep)",textTransform:"uppercase",opacity:0.65}}>{b}</span>
      ))}
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   TOP BRANDS CAROUSEL (like screenshot)
───────────────────────────────────────────── */
const BRAND_CARDS = [
  {name:"H&M",      discount:"Up to 60% off",  extra:"+ Extra 10% off*", emoji:"👗", bg:"#fff0f3", accent:"#e91e63"},
  {name:"Nike",     discount:"Up to 40% off",  extra:"",                 emoji:"👟", bg:"#f0f4ff", accent:"#1565c0"},
  {name:"Cider",    discount:"Up to 70% off",  extra:"",                 emoji:"🌺", bg:"#fff8f0", accent:"#e64a19"},
  {name:"Puma",     discount:"Min 40-60% off", extra:"+ Extra 10% off*", emoji:"🐆", bg:"#f5ffe0", accent:"#33691e"},
  {name:"MAC",      discount:"Up to 50% off",  extra:"",                 emoji:"💄", bg:"#fce4ec", accent:"#880e4f"},
  {name:"Fenty",    discount:"Up to 35% off",  extra:"+ Extra 5% off*",  emoji:"✨", bg:"#ede7f6", accent:"#4527a0"},
];

const TopBrandsCarousel = () => {
  const [offset, setOffset] = useState(0);
  const visible = 4;
  const max = BRAND_CARDS.length - visible;

  return (
    <section style={{padding:"72px 0",background:"var(--white)"}}>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 40px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:36}}>
          <div>
            <div className="tag-pill" style={{marginBottom:12}}>✦ Exclusive Deals</div>
            <h2 className="display-serif" style={{fontSize:"clamp(1.8rem,3vw,2.6rem)",color:"var(--text-dark)"}}>
              Top Brands <span className="gradient-text">On Offer</span>
            </h2>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={() => setOffset(Math.max(0, offset - 1))} style={{width:40,height:40,borderRadius:"50%",border:"1.5px solid var(--purple-soft)",background:"white",color:"var(--purple-deep)",fontSize:18,cursor:"pointer",transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center"}}
              onMouseEnter={e=>{e.currentTarget.style.background="var(--purple-deep)";e.currentTarget.style.color="white";e.currentTarget.style.borderColor="var(--purple-deep)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="white";e.currentTarget.style.color="var(--purple-deep)";e.currentTarget.style.borderColor="var(--purple-soft)";}}>‹</button>
            <button onClick={() => setOffset(Math.min(max, offset + 1))} style={{width:40,height:40,borderRadius:"50%",border:"1.5px solid var(--purple-soft)",background:"white",color:"var(--purple-deep)",fontSize:18,cursor:"pointer",transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center"}}
              onMouseEnter={e=>{e.currentTarget.style.background="var(--purple-deep)";e.currentTarget.style.color="white";e.currentTarget.style.borderColor="var(--purple-deep)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="white";e.currentTarget.style.color="var(--purple-deep)";e.currentTarget.style.borderColor="var(--purple-soft)";}}>›</button>
          </div>
        </div>

        <div style={{overflow:"hidden"}}>
          <div style={{display:"flex",gap:18,transition:"transform .5s cubic-bezier(.4,0,.2,1)",transform:`translateX(calc(-${offset * (100/visible)}% - ${offset * 18 / visible}px))`}}>
            {BRAND_CARDS.map((b, i) => (
              <div key={i} style={{
                flex:`0 0 calc(${100/visible}% - ${(visible-1)*18/visible}px)`,
                background:b.bg,
                borderRadius:20,
                overflow:"hidden",
                border:"1.5px solid rgba(124,58,237,0.12)",
                cursor:"pointer",
                transition:"all .35s",
              }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px)";e.currentTarget.style.boxShadow="0 16px 40px rgba(124,58,237,0.14)";e.currentTarget.style.borderColor="rgba(124,58,237,0.3)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor="rgba(124,58,237,0.12)";}}>
                {/* Image area (replace with <img>) */}
                <div style={{height:160,display:"flex",alignItems:"center",justifyContent:"center",fontSize:64,background:`linear-gradient(135deg,${b.bg},white)`}}>
                  {b.emoji}
                </div>
                <div style={{padding:"14px 16px 18px",background:"white",borderTop:`2px solid ${b.accent}18`}}>
                  <div style={{fontWeight:800,fontSize:15,color:b.accent,marginBottom:4,fontFamily:"Cormorant Garamond",letterSpacing:0.5}}>{b.name}</div>
                  <div style={{fontWeight:700,fontSize:13,color:"var(--text-dark)",marginBottom:b.extra ? 3 : 0}}>{b.discount}</div>
                  {b.extra && <div style={{fontSize:11,color:"var(--text-muted)"}}>{b.extra}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:24}}>
          {Array.from({length: max + 1}).map((_, i) => (
            <button key={i} onClick={() => setOffset(i)} style={{width: i === offset ? 24 : 7,height:7,borderRadius:4,border:"none",cursor:"pointer",background: i === offset ? "var(--purple-deep)" : "var(--purple-soft)",transition:"all .3s"}}/>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   FEATURES
───────────────────────────────────────────── */
const FeaturesSection = () => (
  <section style={{padding:"64px 0",background:"var(--purple-light)"}}>
    <div style={{maxWidth:1280,margin:"0 auto",padding:"0 40px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20}}>
        {FEATURES.map(f => (
          <div key={f.title} style={{
            background:"white",borderRadius:18,padding:"28px 22px",textAlign:"center",
            border:"1px solid var(--purple-soft)",
            transition:"all .3s",cursor:"default",
          }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow="0 12px 32px rgba(124,58,237,0.12)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
            <div style={{fontSize:36,marginBottom:14}}>{f.icon}</div>
            <h4 style={{fontSize:15,fontWeight:700,marginBottom:8,color:"var(--text-dark)",fontFamily:"Cormorant Garamond",letterSpacing:0.3}}>{f.title}</h4>
            <p style={{fontSize:12,color:"var(--text-muted)",lineHeight:1.7}}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   PRODUCTS
───────────────────────────────────────────── */
const ProductCard = ({ p }) => {
  const dispatch = useDispatch();
  const inWish = useSelector(s => s.wishlist.items.some(i => i.id === p.id));
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius:20,overflow:"hidden",
        background:"white",
        border: `1.5px solid ${hov ? "rgba(124,58,237,0.35)" : "var(--purple-soft)"}`,
        transition:"all .35s",
        transform: hov ? "translateY(-8px)" : "none",
        boxShadow: hov ? "0 20px 56px rgba(124,58,237,0.14)" : "0 2px 12px rgba(124,58,237,0.04)",
        cursor:"pointer",
        position:"relative",
      }}>
      {/* Badge */}
      {p.badge && (
        <div style={{
          position:"absolute",top:14,left:14,zIndex:2,
          background: p.badge === "Best Seller" ? "linear-gradient(135deg,#c8952a,#f0c96a)" : p.badge === "New" ? "var(--purple-deep)" : "var(--purple-darker)",
          color: p.badge === "Best Seller" ? "#1a0a2e" : "white",
          borderRadius:100,padding:"4px 12px",fontSize:10,fontWeight:700,letterSpacing:0.6,
        }}>{p.badge}</div>
      )}
      {/* Wishlist */}
      <button onClick={() => { dispatch(toggleWishlist(p)); dispatch(showToast(inWish ? "💔 Removed from wishlist" : "💜 Added to wishlist!")); }}
        style={{
          position:"absolute",top:14,right:14,zIndex:2,
          background: inWish ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.9)",
          border:"1px solid var(--purple-soft)",borderRadius:"50%",
          width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:15,cursor:"pointer",
          color: inWish ? "var(--purple-deep)" : "var(--text-muted)",
          transition:"all .3s",backdropFilter:"blur(8px)",
        }}>
        {inWish ? "♥" : "♡"}
      </button>
      {/* Product visual */}
      <div style={{
        height:180,display:"flex",alignItems:"center",justifyContent:"center",
        background: `radial-gradient(ellipse at center,${p.color}14 0%,var(--purple-light) 100%)`,
        fontSize:72,
        transition:"transform .4s",
        transform: hov ? "scale(1.08)" : "scale(1)",
      }}>
        {p.emoji}
      </div>
      {/* Info */}
      <div style={{padding:"16px 18px 18px"}}>
        <div style={{fontSize:10,color:"var(--purple-deep)",fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",marginBottom:5}}>{p.category}</div>
        <h3 style={{fontSize:15,fontWeight:700,marginBottom:8,lineHeight:1.3,color:"var(--text-dark)",fontFamily:"Cormorant Garamond"}}>{p.name}</h3>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:16}}>
          <Stars rating={p.rating} dark/>
          <span style={{fontSize:11,color:"var(--text-muted)"}}>({p.reviews})</span>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:21,fontWeight:700,color:"var(--text-dark)",fontFamily:"Cormorant Garamond"}}>${p.price}</span>
          <button onClick={() => { dispatch(addToCart(p)); dispatch(showToast(`✨ ${p.name} added to cart!`)); }}
            className="btn-primary-purple" style={{borderRadius:100,padding:"8px 18px",fontSize:12}}>
            + Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductsSection = () => {
  const dispatch = useDispatch();
  const active = useSelector(s => s.ui.activeCategory);
  const filtered = active === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === active);

  return (
    <section style={{padding:"80px 0",background:"var(--white)"}}>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 40px"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <div className="tag-pill" style={{marginBottom:14}}>✦ Our Collection</div>
          <h2 className="display-serif" style={{fontSize:"clamp(2rem,4vw,3rem)",color:"var(--text-dark)",marginBottom:12}}>
            Bestselling <span className="gradient-text">Products</span>
          </h2>
          <p style={{color:"var(--text-muted)",fontSize:16,maxWidth:480,margin:"0 auto"}}>Handpicked luxuries loved by thousands of beauty devotees worldwide</p>
        </div>

        {/* Category pills */}
        <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center",marginBottom:40}}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => dispatch(setCategory(c))} style={{
              padding:"10px 22px",borderRadius:100,
              border: active === c ? "1.5px solid var(--purple-deep)" : "1.5px solid var(--purple-soft)",
              background: active === c ? "var(--purple-deep)" : "white",
              color: active === c ? "white" : "var(--text-mid)",
              fontWeight:600,fontSize:13,cursor:"pointer",transition:"all .25s",
              fontFamily:"Outfit",
              boxShadow: active === c ? "0 4px 16px rgba(124,58,237,0.25)" : "none",
            }}>{CAT_ICONS[c]} {c}</button>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20}}>
          {filtered.map(p => <ProductCard key={p.id} p={p}/>)}
        </div>

        <div style={{textAlign:"center",marginTop:44}}>
          <button className="btn-outline-purple">View All Products →</button>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   PROMO BANNER (deep purple section)
───────────────────────────────────────────── */
const PromoBanner = () => {
  const dispatch = useDispatch();
  return (
    <section style={{
      padding:"80px 40px",
      background:"linear-gradient(135deg, var(--purple-darkest) 0%, var(--purple-darker) 60%, var(--purple-deep) 100%)",
      position:"relative",overflow:"hidden",
    }}>
      <div style={{position:"absolute",top:"-20%",right:"-5%",width:500,height:500,borderRadius:"50%",background:"rgba(217,70,168,0.1)",filter:"blur(100px)"}}/>
      <div style={{position:"absolute",bottom:"-30%",left:"-5%",width:400,height:400,borderRadius:"50%",background:"rgba(124,58,237,0.15)",filter:"blur(80px)"}}/>

      <div style={{maxWidth:780,margin:"0 auto",textAlign:"center",position:"relative",zIndex:1}}>
        <div style={{display:"inline-block",background:"rgba(200,149,42,0.2)",border:"1px solid rgba(200,149,42,0.4)",borderRadius:100,padding:"6px 20px",marginBottom:20,fontSize:11,fontWeight:700,letterSpacing:1.5,color:"#f0c96a",textTransform:"uppercase"}}>⚡ Limited Time Offer</div>
        <h2 className="display-serif" style={{fontSize:"clamp(2rem,5vw,3.5rem)",fontWeight:700,marginBottom:16,color:"white"}}>
          Get <span className="gold-text">30% OFF</span> on First Order
        </h2>
        <p style={{color:"rgba(255,255,255,0.7)",fontSize:16,marginBottom:32,lineHeight:1.8}}>
          Use code{" "}
          <strong style={{color:"#f0c96a",background:"rgba(200,149,42,0.15)",padding:"3px 12px",borderRadius:6,fontFamily:"Outfit",letterSpacing:1}}>BEAUTY30</strong>
          {" "}at checkout. Valid on all skincare & makeup products.
        </p>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={() => dispatch(showToast("🎉 Code BEAUTY30 copied!"))} className="btn-dark-purple" style={{background:"white",color:"var(--purple-deep)"}}>
            💎 Claim Offer
          </button>
          <button style={{borderRadius:100,padding:"13px 30px",fontSize:14,fontFamily:"Outfit",fontWeight:600,cursor:"pointer",background:"transparent",border:"1.5px solid rgba(255,255,255,0.3)",color:"white",transition:"all .3s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.1)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>Learn More</button>
        </div>
        {/* Countdown */}
        <div style={{display:"flex",gap:14,justifyContent:"center",marginTop:36}}>
          {[["12","Hours"],["34","Mins"],["56","Secs"]].map(([n,l]) => (
            <div key={l} style={{background:"rgba(255,255,255,0.08)",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,padding:"14px 20px",minWidth:76,textAlign:"center"}}>
              <div className="display-serif" style={{fontSize:28,fontWeight:700,color:"#f0c96a"}}>{n}</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.45)",fontWeight:600,letterSpacing:1}}>{l.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   SKINCARE ROUTINE (light purple bg)
───────────────────────────────────────────── */
const SkincareRoutine = () => (
  <section style={{padding:"80px 0",background:"var(--purple-light)"}}>
    <div style={{maxWidth:1280,margin:"0 auto",padding:"0 40px"}}>
      <div style={{textAlign:"center",marginBottom:56}}>
        <div className="tag-pill" style={{marginBottom:14}}>✦ Beauty Education</div>
        <h2 className="display-serif" style={{fontSize:"clamp(2rem,4vw,3rem)",color:"var(--text-dark)",marginBottom:12}}>
          Perfect <span className="gradient-text">Skincare Routine</span>
        </h2>
        <p style={{color:"var(--text-muted)",fontSize:16}}>Your step-by-step guide to glowing skin</p>
      </div>

      <div style={{position:"relative"}}>
        <div style={{position:"absolute",top:40,left:"8%",right:"8%",height:2,background:"linear-gradient(90deg,var(--purple-deep),var(--rose),var(--gold))",borderRadius:1,opacity:0.3}}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:20}}>
          {STEPS.map((step, i) => (
            <div key={step.n} style={{textAlign:"center"}}>
              <div style={{
                width:80,height:80,borderRadius:"50%",margin:"0 auto 18px",
                background:`linear-gradient(135deg,${step.color}22,${step.color}10)`,
                border:`2px solid ${step.color}44`,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:32,position:"relative",zIndex:1,
                boxShadow:`0 8px 24px ${step.color}20`,
                transition:"transform .3s",cursor:"default",
                background:"white",
              }}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
                onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                {step.emoji}
                <div style={{position:"absolute",top:-8,right:-4,background:step.color,color:"white",width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,border:"2px solid var(--purple-light)"}}>{i+1}</div>
              </div>
              <h4 className="display-serif" style={{fontSize:16,fontWeight:700,marginBottom:6,color:"var(--text-dark)"}}>{step.title}</h4>
              <p style={{fontSize:12,color:"var(--text-muted)",lineHeight:1.7}}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────
   TESTIMONIALS (white)
───────────────────────────────────────────── */
const TestimonialsSection = () => {
  const [active, setActive] = useState(0);
  return (
    <section style={{padding:"80px 0",background:"var(--white)"}}>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 40px"}}>
        <div style={{textAlign:"center",marginBottom:52}}>
          <div className="tag-pill" style={{marginBottom:14}}>✦ Customer Love</div>
          <h2 className="display-serif" style={{fontSize:"clamp(2rem,4vw,3rem)",color:"var(--text-dark)"}}>
            What Our <span className="gradient-text">Customers Say</span>
          </h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
          {REVIEWS.map((r, i) => (
            <div key={r.id} onClick={() => setActive(i)} style={{
              padding:"30px 26px",
              background: active === i ? "var(--purple-light)" : "white",
              border: `1.5px solid ${active === i ? "var(--purple-mid)" : "var(--purple-soft)"}`,
              borderRadius:20,
              transition:"all .35s",
              transform: active === i ? "translateY(-6px)" : "none",
              boxShadow: active === i ? "0 16px 40px rgba(124,58,237,0.12)" : "none",
              cursor:"pointer",
            }}>
              <div style={{fontSize:36,color:"var(--purple-mid)",marginBottom:14,opacity:0.6,fontFamily:"Georgia",lineHeight:1}}>"</div>
              <p style={{color:"var(--text-mid)",lineHeight:1.8,marginBottom:22,fontSize:14,fontStyle:"italic"}}>{r.text}</p>
              <Stars rating={r.rating} dark/>
              <div style={{display:"flex",alignItems:"center",gap:12,marginTop:18}}>
                <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,var(--purple-deep),var(--rose))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,fontFamily:"Cormorant Garamond",color:"white",flexShrink:0}}>{r.avatar}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:14,color:"var(--text-dark)"}}>{r.name}</div>
                  <div style={{fontSize:11,color:"var(--text-muted)"}}>{r.role} · {r.loc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   NEWSLETTER (light purple)
───────────────────────────────────────────── */
const Newsletter = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const handleSub = () => {
    if (email.includes("@")) { setSent(true); dispatch(showToast("🎉 Welcome to ShopHub Beauty!")); }
  };

  return (
    <section style={{padding:"80px 40px",background:"var(--purple-light)",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at 20% 80%,rgba(124,58,237,0.08) 0%,transparent 60%),radial-gradient(circle at 80% 20%,rgba(217,70,168,0.06) 0%,transparent 60%)"}}/>
      <div style={{maxWidth:560,margin:"0 auto",textAlign:"center",position:"relative",zIndex:1}}>
        <div style={{fontSize:48,marginBottom:14}}>💌</div>
        <h2 className="display-serif" style={{fontSize:"clamp(1.8rem,3vw,2.5rem)",color:"var(--text-dark)",marginBottom:12}}>
          Get Beauty <span className="gradient-text">Secrets & Deals</span>
        </h2>
        <p style={{color:"var(--text-muted)",marginBottom:32,fontSize:15,lineHeight:1.75}}>Subscribe for exclusive offers, new arrivals, and expert beauty tips delivered weekly.</p>
        {!sent ? (
          <div style={{display:"flex",gap:0,borderRadius:100,overflow:"hidden",border:"1.5px solid var(--purple-mid)",maxWidth:440,margin:"0 auto",background:"white",boxShadow:"0 8px 24px rgba(124,58,237,0.1)"}}>
            <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
              style={{flex:1,padding:"14px 22px",background:"transparent",border:"none",outline:"none",color:"var(--text-dark)",fontSize:14,fontFamily:"Outfit"}}/>
            <button onClick={handleSub} className="btn-primary-purple" style={{borderRadius:0,borderTopRightRadius:100,borderBottomRightRadius:100,padding:"14px 24px",fontSize:13,margin:0}}>
              Subscribe ✦
            </button>
          </div>
        ) : (
          <div style={{background:"white",border:"1.5px solid var(--purple-mid)",borderRadius:16,padding:"18px 28px",color:"var(--purple-deep)",fontWeight:600,fontSize:16}}>
            🎉 Welcome to the ShopHub Beauty Family!
          </div>
        )}
        <p style={{fontSize:11,color:"var(--text-muted)",marginTop:14}}>No spam, ever. Unsubscribe anytime.</p>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   CART DRAWER
───────────────────────────────────────────── */
const CartDrawer = () => {
  const dispatch = useDispatch();
  const {items, total} = useSelector(s => s.cart);
  const cartOpen = useSelector(s => s.ui.cartOpen);

  return (
    <>
      {cartOpen && <div onClick={() => dispatch(toggleCart())} style={{position:"fixed",inset:0,background:"rgba(46,16,101,0.3)",zIndex:1001,backdropFilter:"blur(4px)"}}/>}
      <div style={{
        position:"fixed",top:0,right:0,bottom:0,width:380,zIndex:1002,
        background:"white",
        borderLeft:"1px solid var(--purple-soft)",
        transform: cartOpen ? "translateX(0)" : "translateX(100%)",
        transition:"transform .4s cubic-bezier(.4,0,.2,1)",
        display:"flex",flexDirection:"column",
        boxShadow: cartOpen ? "-8px 0 40px rgba(124,58,237,0.12)" : "none",
      }}>
        <div style={{padding:"24px 24px 16px",borderBottom:"1px solid var(--purple-soft)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <h3 className="display-serif" style={{fontWeight:700,fontSize:20,color:"var(--text-dark)"}}>Your Cart 🛒</h3>
          <button onClick={() => dispatch(toggleCart())} style={{background:"var(--purple-light)",border:"none",color:"var(--purple-deep)",fontSize:16,cursor:"pointer",padding:"6px 12px",borderRadius:8,fontWeight:700}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"16px 24px"}}>
          {items.length === 0 ? (
            <div style={{textAlign:"center",padding:"60px 20px",color:"var(--text-muted)"}}>
              <div style={{fontSize:56,marginBottom:14}}>🛒</div>
              <p style={{fontSize:15,fontWeight:500}}>Your cart is empty</p>
              <p style={{fontSize:13,marginTop:8}}>Add some beautiful products!</p>
            </div>
          ) : items.map(item => (
            <div key={item.id} style={{display:"flex",gap:12,alignItems:"center",padding:"14px 0",borderBottom:"1px solid var(--purple-soft)"}}>
              <div style={{width:54,height:54,borderRadius:12,background:"var(--purple-light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0,border:"1px solid var(--purple-soft)"}}>{item.emoji}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontSize:13,marginBottom:2,color:"var(--text-dark)"}}>{item.name}</div>
                <div style={{color:"var(--purple-deep)",fontSize:13,fontWeight:700}}>${item.price} × {item.qty}</div>
              </div>
              <button onClick={() => dispatch(removeFromCart(item.id))} style={{background:"rgba(217,70,168,0.08)",border:"1px solid rgba(217,70,168,0.2)",borderRadius:8,padding:"4px 10px",color:"var(--rose)",cursor:"pointer",fontSize:12,fontWeight:700}}>✕</button>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div style={{padding:"18px 24px",borderTop:"1px solid var(--purple-soft)"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:18}}>
              <span style={{color:"var(--text-muted)",fontSize:15}}>Total</span>
              <span className="display-serif" style={{color:"var(--text-dark)",fontSize:22,fontWeight:700}}>${total.toFixed(2)}</span>
            </div>
            <button className="btn-primary-purple" style={{width:"100%",borderRadius:14,padding:14,fontSize:15}}>Checkout →</button>
            <button onClick={() => dispatch(toggleCart())} className="btn-outline-purple" style={{width:"100%",marginTop:8,borderRadius:14,padding:12,fontSize:13}}>Continue Shopping</button>
          </div>
        )}
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
const Footer = () => (
  <footer style={{background:"var(--purple-darkest)",borderTop:"1px solid rgba(201,179,245,0.12)"}}>
    <div style={{maxWidth:1280,margin:"0 auto",padding:"60px 40px 32px"}}>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:48}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
            <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,var(--purple-deep),var(--rose))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"white",fontWeight:800,fontFamily:"Cormorant Garamond"}}>S</div>
            <span style={{fontFamily:"Cormorant Garamond",fontWeight:700,fontSize:20,color:"white"}}>Shop<span style={{color:"var(--purple-mid)"}}>Hub</span></span>
          </div>
          <p style={{color:"rgba(255,255,255,0.4)",fontSize:13,lineHeight:1.8,maxWidth:260}}>Your ultimate destination for premium beauty & skincare products, curated with love.</p>
          <div style={{display:"flex",gap:10,marginTop:20}}>
            {["📸","🐦","📌","▶️"].map((icon,i) => (
              <button key={i} style={{width:36,height:36,borderRadius:"50%",background:"rgba(124,58,237,0.2)",border:"1px solid rgba(201,179,245,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,cursor:"pointer",transition:"all .2s"}}
                onMouseEnter={e=>{e.currentTarget.style.background="var(--purple-deep)";e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(124,58,237,0.2)";e.currentTarget.style.transform="none";}}>{icon}</button>
            ))}
          </div>
        </div>
        {[
          {title:"Shop",    links:["New Arrivals","Bestsellers","Skincare","Makeup","Fragrance","Tools"]},
          {title:"Help",    links:["Track Order","Returns","Shipping Info","Size Guide","FAQ"]},
          {title:"Company", links:["About Us","Careers","Press","Sustainability","Affiliates"]},
        ].map(col => (
          <div key={col.title}>
            <h5 style={{fontWeight:700,fontSize:11,marginBottom:18,color:"var(--purple-mid)",textTransform:"uppercase",letterSpacing:1.5,fontFamily:"Outfit"}}>{col.title}</h5>
            {col.links.map(l => (
              <a key={l} href="#" style={{display:"block",color:"rgba(255,255,255,0.4)",textDecoration:"none",fontSize:13,marginBottom:10,transition:"color .2s",fontFamily:"Outfit"}}
                onMouseEnter={e=>e.target.style.color="white"}
                onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.4)"}>{l}</a>
            ))}
          </div>
        ))}
      </div>
      <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(201,179,245,0.25),transparent)",margin:"40px 0 24px"}}/>
      <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10,alignItems:"center"}}>
        <p style={{color:"rgba(255,255,255,0.25)",fontSize:12}}>© 2025 ShopHub Beauty. All rights reserved.</p>
        <div style={{display:"flex",gap:20}}>
          {["Privacy","Terms","Cookies"].map(l => (
            <a key={l} href="#" style={{color:"rgba(255,255,255,0.25)",fontSize:12,textDecoration:"none"}}>{l}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

/* ─────────────────────────────────────────────
   PAGE EXPORT
───────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/css/bootstrap.min.css"/>

      <Navbar/>
      <HeroCarousel/>
      <BrandStrip/>
      <TopBrandsCarousel/>
      <div className="section-divider"/>
      <FeaturesSection/>
      <div className="section-divider"/>
      <ProductsSection/>
      <PromoBanner/>
      <SkincareRoutine/>
      <div className="section-divider"/>
      <TestimonialsSection/>
      <Newsletter/>
      <Footer/>
      <CartDrawer/>
      <Toast/>
    </>
  );
}