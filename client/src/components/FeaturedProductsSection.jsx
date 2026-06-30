import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { fetchFeaturedProducts } from '../redux/reducers/thunks/productThunks';
import { addToCartAsync } from '../redux/reducers/thunks/cartThunks';

const PLACEHOLDER = 'https://placehold.co/300x220?text=Product';

const StarRating = ({ rating = 0 }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ fontSize: 11, color: '#f59e0b', letterSpacing: 1 }}>
      {'★'.repeat(full)}{half ? '½' : ''}
    </span>
  );
};

const ProductCard = ({ product, showToast }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { _id, id, name, brand, price, discount, rating, images, image } = product;
  const img = (images && images[0]) || image || PLACEHOLDER;
  const productId = _id || id;

  // Check if user is logged in
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const handleCardClick = () => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    try {
      await dispatch(addToCartAsync({ 
        productId: productId, 
        quantity: 1 
      })).unwrap();
      
      showToast(`${name} added to cart! 🛍️`, 'success');
    } catch (error) {
      showToast('Failed to add to cart', 'error');
    }
  };

  return (
    <div className="fp-card" onClick={handleCardClick}>
      <div className="fp-card-img">
        <img
          src={img}
          alt={name}
          onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
        />
        <span className="fp-badge">Featured</span>
        {discount > 0 && (
          <span className="fp-disc">{discount}% off</span>
        )}
      </div>
      <div className="fp-card-body">
        {brand && <div className="fp-brand">{brand}</div>}
        <div className="fp-name" title={name}>{name}</div>
        <div className="fp-row">
          <span className="fp-price">₹{Number(price).toLocaleString('en-IN')}</span>
          {rating > 0 && <StarRating rating={rating} />}
        </div>
        <button className="fp-buy" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const FeaturedProductsSection = () => {
  const dispatch = useDispatch();
  const { featuredItems = [], featuredLoading, featuredError } = useSelector((s) => s.products);
  const [globalToast, setGlobalToast] = useState({ show: false, message: '', type: 'success' });

  const trackRef   = useRef(null);
  const posRef     = useRef(0);
  const rafRef     = useRef(null);
  const pausedRef  = useRef(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  const showGlobalToast = (message, type = 'success') => {
    setGlobalToast({ show: true, message, type });
    setTimeout(() => setGlobalToast({ show: false, message: '', type: 'success' }), 2500);
  };

  // Infinite scroll loop
  const CARD_W = 218; // card 200px + gap 18px

  const startLoop = useCallback(() => {
    const total = featuredItems.length * CARD_W;
    if (!total) return;

    const step = () => {
      if (!pausedRef.current) {
        posRef.current += 0.55;
        if (posRef.current >= total) posRef.current -= total;
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [featuredItems.length]);

  useEffect(() => {
    const cancel = startLoop();
    return cancel;
  }, [startLoop]);

  const togglePause = () => {
    pausedRef.current = !pausedRef.current;
    setIsPaused(pausedRef.current);
  };

  const scrollBy = (dir) => {
    posRef.current += dir * CARD_W * 2;
    const total = featuredItems.length * CARD_W;
    if (posRef.current < 0) posRef.current += total;
    if (posRef.current >= total) posRef.current -= total;
  };

  // Skeleton cards
  const skeletons = Array.from({ length: 5 });

  return (
    <>
      <style>{`
        @keyframes fp-shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }

        .fp-section {
          padding: 72px 0;
          background: #fff;
       
          overflow: hidden;
        }

        /* ── Gutter ladder — mirrors Navbar.css --nav-pad-x ── */
        .fp-inner {
          margin: 0 auto;
          padding: 0 var(--fp-px);
        }

        :root {
          --fp-px: var(--nav-pad-x, 48px);
        }

        /* 1920px+ → 80px */
        @media (min-width: 1920px) { 
          :root { --fp-px: 80px; } 
        }

        /* 1440–1919px and 1280–1439px → 48px (root default) */

        /* ≤ 1279px → 36px */
        @media (max-width: 1279px) { 
          :root { --fp-px: 36px; } 
        }

        /* ≤ 1159px → 28px */
        @media (max-width: 1159px) { 
          :root { --fp-px: 28px; } 
        }

        /* ≤ 1023px → 20px */
        @media (max-width: 1023px) { 
          :root { --fp-px: 20px; } 
        }

        /* ≤ 767px → 16px */
        @media (max-width: 767px) { 
          :root { --fp-px: 16px; } 
        }

        /* ≤ 479px → 12px */
        @media (max-width: 479px) { 
          :root { --fp-px: 12px; } 
        }

        /* heading */
        .fp-eyebrow {
          font-size: .68rem; font-weight: 700; letter-spacing: .15em;
          text-transform: uppercase; color: #7c3aed;
          display: flex; align-items: center; gap: 7px; margin-bottom: 5px;
        }
        .fp-eyebrow::before {
          content: ''; display: inline-block;
          width: 20px; height: 2px; background: #7c3aed; border-radius: 2px;
        }
        .fp-h2 { 
          font-size: 2rem; 
          font-weight: 800; 
          color: #1a0533; 
          line-height: 1.1; 
          margin: 0; 
        }
        .fp-h2 em { font-style: normal; color: #7c3aed; }
        .fp-sub { 
          font-size: .84rem; 
          color: #9ca3af; 
          margin: 3px 0 0; 
        }
        .fp-link {
          font-size: .8rem; font-weight: 600; color: #7c3aed;
          border: 1.5px solid #ddd6fe; border-radius: 8px;
          padding: 9px 18px; text-decoration: none;
          display: inline-flex; align-items: center; gap: 6px;
          transition: background .2s, color .2s, border-color .2s;
          white-space: nowrap;
        }
        .fp-link:hover { background: #7c3aed; color: #fff; border-color: #7c3aed; }

        /* track */
        .fp-outer {
          overflow: hidden; 
          position: relative;
          margin-top: 8px;
        }
        .fp-outer::before, .fp-outer::after {
          content: ''; 
          position: absolute; 
          top: 0; 
          bottom: 0;
          width: 60px; 
          z-index: 2; 
          pointer-events: none;
        }
        .fp-outer::before { 
          left: 0; 
          background: linear-gradient(to right, #fff 30%, transparent); 
        }
        .fp-outer::after  { 
          right: 0; 
          background: linear-gradient(to left, #fff 30%, transparent); 
        }
        .fp-track { 
          display: flex; 
          gap: 18px; 
          width: max-content; 
          will-change: transform; 
          padding: 12px 0; 
        }

        /* card */
        .fp-card {
          width: 200px; 
          flex-shrink: 0;
          background: #fff; 
          border: 1px solid #ede9fe;
          border-radius: 16px; 
          overflow: hidden;
          transition: transform .25s ease, border-color .25s ease;
          cursor: pointer;
        }
        .fp-card:hover { 
          transform: translateY(-7px); 
          border-color: #a78bfa; 
        }
        .fp-card-img {
          width: 100%; 
          height: 165px; 
          overflow: hidden;
          position: relative; 
          background: #f5f3ff;
        }
        .fp-card-img img {
          width: 100%; 
          height: 100%; 
          object-fit: cover;
          transition: transform .45s ease; 
          display: block;
        }
        .fp-card:hover .fp-card-img img { 
          transform: scale(1.08); 
        }
        .fp-badge {
          position: absolute; 
          top: 10px; 
          left: 10px;
          background: #7c3aed; 
          color: #fff;
          font-size: .58rem; 
          font-weight: 700; 
          letter-spacing: .08em;
          text-transform: uppercase; 
          padding: 3px 9px; 
          border-radius: 20px;
        }
        .fp-disc {
          position: absolute; 
          top: 10px; 
          right: 10px;
          background: #fef3c7; 
          color: #92400e;
          font-size: .6rem; 
          font-weight: 700; 
          padding: 3px 8px; 
          border-radius: 20px;
        }
        .fp-card-body { 
          padding: 13px 14px 15px; 
        }
        .fp-brand {
          font-size: .62rem; 
          font-weight: 700; 
          letter-spacing: .08em;
          text-transform: uppercase; 
          color: #a78bfa; 
          margin-bottom: 3px;
        }
        .fp-name {
          font-size: .88rem; 
          font-weight: 700; 
          color: #1a0533;
          line-height: 1.25; 
          margin-bottom: 7px;
          white-space: nowrap; 
          overflow: hidden; 
          text-overflow: ellipsis;
        }
        .fp-row { 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
        }
        .fp-price { 
          font-size: .95rem; 
          font-weight: 800; 
          color: #7c3aed; 
        }
        .fp-buy {
          margin-top: 10px; 
          width: 100%; 
          padding: 8px 0;
          background: #7c3aed; 
          color: #fff; 
          border: none;
          border-radius: 8px; 
          font-size: .78rem; 
          font-weight: 700;
          cursor: pointer; 
          transition: background .2s;
        }
        .fp-buy:hover { 
          background: #6d28d9; 
        }

        /* skeleton */
        .fp-skel-card {
          width: 200px; 
          flex-shrink: 0;
          border: 1px solid #ede9fe; 
          border-radius: 16px; 
          overflow: hidden;
        }
        .fp-skel {
          background: linear-gradient(90deg, #f3f0ff 25%, #ede9fe 50%, #f3f0ff 75%);
          background-size: 400px 100%;
          animation: fp-shimmer 1.4s infinite;
        }

        /* controls */
        .fp-controls {
          display: flex; 
          align-items: center; 
          justify-content: center;
          gap: 12px; 
          margin-top: 24px;
        }
        .fp-ctrl {
          width: 34px; 
          height: 34px; 
          border-radius: 50%;
          border: 1.5px solid #ddd6fe; 
          background: #fff; 
          color: #7c3aed;
          display: flex; 
          align-items: center; 
          justify-content: center;
          cursor: pointer; 
          transition: background .2s, border-color .2s, color .2s;
        }
        .fp-ctrl:hover { 
          background: #7c3aed; 
          border-color: #7c3aed; 
          color: #fff; 
        }
        .fp-ctrl svg { 
          width: 14px; 
          height: 14px; 
        }
        .fp-pause-label { 
          font-size: .74rem; 
          color: #a78bfa; 
          font-weight: 600; 
          min-width: 88px; 
          text-align: center; 
        }

        /* ── Heading flex layout ── */
        .fp-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        /* ── Toast Styles - Purple & White ── */
        .fp-toast-container {
          position: fixed;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 99999;
          width: auto;
          max-width: 500px;
          min-width: 280px;
          pointer-events: none;
          animation: fp-toast-fade-in 0.4s ease-out;
        }

        .fp-toast {
          background: #ffffff;
          color: #1a0533;
          padding: 16px 28px;
          border-radius: 14px;
          font-size: 1rem;
          font-weight: 600;
          box-shadow: 0 12px 50px rgba(124, 58, 237, 0.25);
          display: flex;
          align-items: center;
          gap: 14px;
          border: 2px solid #7c3aed;
          pointer-events: auto;
        }

        .fp-toast--success {
          border-left: 6px solid #7c3aed;
          background: #ffffff;
        }

        .fp-toast--error {
          border-left: 6px solid #dc2626;
          background: #ffffff;
        }

        .fp-toast-icon {
          font-size: 1.4rem;
          flex-shrink: 0;
        }

        .fp-toast-message {
          flex: 1;
          font-size: 0.95rem;
          letter-spacing: 0.3px;
          color: #1a0533;
        }

        @keyframes fp-toast-fade-in {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(30px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
        }

        /* ── Responsive ── */

        /* Tablet */
        @media (max-width: 1023px) {
          .fp-section { 
            padding: 56px 0; 
          }
          .fp-h2 { 
            font-size: 1.75rem; 
          }
          .fp-card {
            width: 180px;
          }
          .fp-card-img {
            height: 148px;
          }
          .fp-skel-card {
            width: 180px;
          }
          .fp-outer::before, 
          .fp-outer::after {
            width: 40px;
          }
          .fp-toast {
            padding: 14px 22px;
            font-size: 0.9rem;
          }
        }

        /* Mobile */
        @media (max-width: 767px) {
          .fp-section { 
            padding: 40px 0; 
          }
          .fp-h2 { 
            font-size: 1.5rem; 
          }
          .fp-sub { 
            font-size: .78rem; 
          }
          .fp-link {
            font-size: .74rem;
            padding: 7px 14px;
          }
          .fp-card {
            width: 160px;
          }
          .fp-card-img {
            height: 132px;
          }
          .fp-card-body { 
            padding: 10px 12px 12px; 
          }
          .fp-name {
            font-size: .8rem;
          }
          .fp-price {
            font-size: .85rem;
          }
          .fp-buy {
            font-size: .72rem;
            padding: 6px 0;
          }
          .fp-skel-card {
            width: 160px;
          }
          .fp-outer::before, 
          .fp-outer::after {
            width: 30px;
          }
          .fp-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          .fp-controls {
            gap: 8px;
            margin-top: 18px;
          }
          .fp-ctrl {
            width: 30px;
            height: 30px;
          }
          .fp-ctrl svg {
            width: 12px;
            height: 12px;
          }
          .fp-pause-label {
            font-size: .68rem;
            min-width: 70px;
          }
          .fp-toast-container {
            bottom: 20px;
            max-width: 90%;
            min-width: auto;
          }
          .fp-toast {
            padding: 12px 18px;
            font-size: 0.85rem;
            border-radius: 12px;
          }
          .fp-toast-icon {
            font-size: 1.2rem;
          }
          .fp-toast-message {
            font-size: 0.85rem;
          }
        }

        /* Small mobile */
        @media (max-width: 479px) {
          .fp-section { 
            padding: 32px 0; 
          }
          .fp-h2 { 
            font-size: 1.25rem; 
          }
          .fp-eyebrow {
            font-size: .6rem;
          }
          .fp-sub { 
            font-size: .72rem; 
          }
          .fp-link {
            font-size: .68rem;
            padding: 6px 12px;
          }
          .fp-card {
            width: 140px;
          }
          .fp-card-img {
            height: 115px;
          }
          .fp-card-body { 
            padding: 8px 10px 10px; 
          }
          .fp-name {
            font-size: .72rem;
            margin-bottom: 4px;
          }
          .fp-price {
            font-size: .78rem;
          }
          .fp-brand {
            font-size: .56rem;
          }
          .fp-buy {
            font-size: .65rem;
            padding: 5px 0;
            margin-top: 6px;
          }
          .fp-badge,
          .fp-disc {
            font-size: .5rem;
            padding: 2px 6px;
          }
          .fp-skel-card {
            width: 140px;
          }
          .fp-outer::before, 
          .fp-outer::after {
            width: 20px;
          }
          .fp-track {
            gap: 12px;
          }
          .fp-controls {
            gap: 6px;
            margin-top: 14px;
          }
          .fp-ctrl {
            width: 26px;
            height: 26px;
          }
          .fp-ctrl svg {
            width: 10px;
            height: 10px;
          }
          .fp-pause-label {
            font-size: .62rem;
            min-width: 60px;
          }
          .fp-toast-container {
            bottom: 15px;
            max-width: 95%;
          }
          .fp-toast {
            padding: 10px 16px;
            font-size: 0.8rem;
            border-radius: 10px;
            gap: 10px;
          }
          .fp-toast-icon {
            font-size: 1rem;
          }
          .fp-toast-message {
            font-size: 0.8rem;
          }
        }

        /* Very small screens */
        @media (max-width: 360px) {
          .fp-card {
            width: 120px;
          }
          .fp-card-img {
            height: 100px;
          }
          .fp-skel-card {
            width: 120px;
          }
          .fp-track {
            gap: 10px;
          }
          .fp-card-body { 
            padding: 6px 8px 8px; 
          }
          .fp-name {
            font-size: .65rem;
          }
          .fp-price {
            font-size: .7rem;
          }
          .fp-buy {
            font-size: .58rem;
            padding: 4px 0;
          }
          .fp-badge,
          .fp-disc {
            font-size: .45rem;
            padding: 2px 5px;
            top: 6px;
          }
          .fp-badge {
            left: 6px;
          }
          .fp-disc {
            right: 6px;
          }
        }
      `}</style>

      <section className="fp-section">
        <div className="fp-inner">

          {/* Heading */}
          <div className="fp-header">
            <div>
              <p className="fp-eyebrow">Hand-picked for you</p>
              <h2 className="fp-h2">Featured <em>Products</em></h2>
              <p className="fp-sub">Our best sellers, curated weekly</p>
            </div>
            <a href="/products?sortBy=featured" className="fp-link">
              View All
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          {/* Error */}
          {featuredError && (
            <div className="alert alert-danger py-2 mb-3">{featuredError}</div>
          )}

          {/* Track */}
          <div
            className="fp-outer"
            onMouseEnter={() => { pausedRef.current = true; }}
            onMouseLeave={() => { if (!isPaused) pausedRef.current = false; }}
          >
            <div className="fp-track" ref={trackRef}>
              {featuredLoading
                ? skeletons.map((_, i) => (
                    <div key={i} className="fp-skel-card">
                      <div className="fp-skel" style={{ height: 165 }} />
                      <div style={{ padding: '13px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div className="fp-skel" style={{ height: 10, width: '40%', borderRadius: 6 }} />
                        <div className="fp-skel" style={{ height: 14, width: '80%', borderRadius: 6 }} />
                        <div className="fp-skel" style={{ height: 10, width: '35%', borderRadius: 6 }} />
                        <div className="fp-skel" style={{ height: 32, borderRadius: 8, marginTop: 4 }} />
                      </div>
                    </div>
                  ))
                : /* Duplicate for seamless loop */
                  [...featuredItems, ...featuredItems].map((product, idx) => (
                    <ProductCard 
                      key={`${product._id}-${idx}`} 
                      product={product}
                      showToast={showGlobalToast}
                    />
                  ))
              }
            </div>
          </div>

          {/* Controls */}
          {/* <div className="fp-controls">
            <button className="fp-ctrl" onClick={() => scrollBy(-1)} aria-label="Scroll left">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <button className="fp-ctrl" onClick={togglePause} aria-label={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}>
              {isPaused ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="4" height="16"/>
                  <rect x="14" y="4" width="4" height="16"/>
                </svg>
              )}
            </button>
            <button className="fp-ctrl" onClick={() => scrollBy(1)} aria-label="Scroll right">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
            <span className="fp-pause-label">{isPaused ? 'Paused' : 'Auto-scroll'}</span>
          </div> */}

        </div>
      </section>

      {/* Toast Portal - Renders at the bottom center of the page */}
      {globalToast.show && createPortal(
        <div className="fp-toast-container">
          <div className={`fp-toast fp-toast--${globalToast.type}`}>
            <span className="fp-toast-icon">
              {globalToast.type === 'success' ? '✅' : '❌'}
            </span>
            <span className="fp-toast-message">{globalToast.message}</span>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default FeaturedProductsSection;