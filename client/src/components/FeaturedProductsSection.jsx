import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedProducts } from '../redux/reducers/thunks/productThunks';


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

const ProductCard = ({ product }) => {
  const { name, brand, price, discount, rating, images, image } = product;
  const img = (images && images[0]) || image || PLACEHOLDER;

  return (
    <div className="fp-card">
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
        <button className="fp-buy">Add to Cart</button>
      </div>
    </div>
  );
};

const FeaturedProductsSection = () => {
  const dispatch = useDispatch();
  const { featuredItems = [], featuredLoading, featuredError } = useSelector((s) => s.products);

  const trackRef   = useRef(null);
  const posRef     = useRef(0);
  const rafRef     = useRef(null);
  const pausedRef  = useRef(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

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
        .fp-section {
          padding: 72px 0;
          background: #fff;
          font-family: 'Segoe UI', system-ui, sans-serif;
          overflow: hidden;
        }
        .fp-inner { max-width: 1280px; margin: 0 auto; padding: 0 32px; }

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
        .fp-h2 { font-size: 2rem; font-weight: 800; color: #1a0533; line-height: 1.1; margin: 0; }
        .fp-h2 em { font-style: normal; color: #7c3aed; }
        .fp-sub { font-size: .84rem; color: #9ca3af; margin: 3px 0 0; }
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
          overflow: hidden; position: relative;
        }
        .fp-outer::before, .fp-outer::after {
          content: ''; position: absolute; top: 0; bottom: 0;
          width: 60px; z-index: 2; pointer-events: none;
        }
        .fp-outer::before { left: 0; background: linear-gradient(to right, #fff 30%, transparent); }
        .fp-outer::after  { right: 0; background: linear-gradient(to left, #fff 30%, transparent); }
        .fp-track { display: flex; gap: 18px; width: max-content; will-change: transform; padding: 12px 0; }

        /* card */
        .fp-card {
          width: 200px; flex-shrink: 0;
          background: #fff; border: 1px solid #ede9fe;
          border-radius: 16px; overflow: hidden;
          transition: transform .25s ease, border-color .25s ease;
          cursor: pointer;
        }
        .fp-card:hover { transform: translateY(-7px); border-color: #a78bfa; }
        .fp-card-img {
          width: 100%; height: 165px; overflow: hidden;
          position: relative; background: #f5f3ff;
        }
        .fp-card-img img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform .45s ease; display: block;
        }
        .fp-card:hover .fp-card-img img { transform: scale(1.08); }
        .fp-badge {
          position: absolute; top: 10px; left: 10px;
          background: #7c3aed; color: #fff;
          font-size: .58rem; font-weight: 700; letter-spacing: .08em;
          text-transform: uppercase; padding: 3px 9px; border-radius: 20px;
        }
        .fp-disc {
          position: absolute; top: 10px; right: 10px;
          background: #fef3c7; color: #92400e;
          font-size: .6rem; font-weight: 700; padding: 3px 8px; border-radius: 20px;
        }
        .fp-card-body { padding: 13px 14px 15px; }
        .fp-brand {
          font-size: .62rem; font-weight: 700; letter-spacing: .08em;
          text-transform: uppercase; color: #a78bfa; margin-bottom: 3px;
        }
        .fp-name {
          font-size: .88rem; font-weight: 700; color: #1a0533;
          line-height: 1.25; margin-bottom: 7px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .fp-row { display: flex; align-items: center; justify-content: space-between; }
        .fp-price { font-size: .95rem; font-weight: 800; color: #7c3aed; }
        .fp-buy {
          margin-top: 10px; width: 100%; padding: 8px 0;
          background: #7c3aed; color: #fff; border: none;
          border-radius: 8px; font-size: .78rem; font-weight: 700;
          cursor: pointer; transition: background .2s;
        }
        .fp-buy:hover { background: #6d28d9; }

        /* skeleton */
        @keyframes fp-shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
        .fp-skel-card {
          width: 200px; flex-shrink: 0;
          border: 1px solid #ede9fe; border-radius: 16px; overflow: hidden;
        }
        .fp-skel {
          background: linear-gradient(90deg, #f3f0ff 25%, #ede9fe 50%, #f3f0ff 75%);
          background-size: 400px 100%;
          animation: fp-shimmer 1.4s infinite;
        }

        /* controls */
        .fp-controls {
          display: flex; align-items: center; justify-content: center;
          gap: 12px; margin-top: 24px;
        }
        .fp-ctrl {
          width: 34px; height: 34px; border-radius: 50%;
          border: 1.5px solid #ddd6fe; background: #fff; color: #7c3aed;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background .2s, border-color .2s, color .2s;
        }
        .fp-ctrl:hover { background: #7c3aed; border-color: #7c3aed; color: #fff; }
        .fp-ctrl svg { width: 14px; height: 14px; }
        .fp-pause-label { font-size: .74rem; color: #a78bfa; font-weight: 600; min-width: 88px; text-align: center; }

        @media (max-width: 640px) {
          .fp-section { padding: 48px 0; }
          .fp-inner { padding: 0 16px; }
          .fp-h2 { font-size: 1.5rem; }
        }
      `}</style>

      <section className="fp-section">
        <div className="fp-inner">

          {/* Heading */}
          <div className="d-flex align-items-end justify-content-between flex-wrap gap-3 mb-4">
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
                    <ProductCard key={`${product._id}-${idx}`} product={product} />
                  ))
              }
            </div>
          </div>

          {/* Controls */}
          {!featuredLoading && featuredItems.length > 0 && (
            <div className="fp-controls">
              <button className="fp-ctrl" onClick={() => scrollBy(-1)} aria-label="Scroll left">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <span className="fp-pause-label">{isPaused ? 'Paused' : 'Auto-scrolling'}</span>
              <button className="fp-ctrl" onClick={togglePause} aria-label={isPaused ? 'Play' : 'Pause'}>
                {isPaused
                  ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                }
              </button>
              <button className="fp-ctrl" onClick={() => scrollBy(1)} aria-label="Scroll right">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          )}

        </div>
      </section>
    </>
  );
};

export default FeaturedProductsSection;