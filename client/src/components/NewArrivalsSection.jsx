
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNewArrivals } from '../redux/slices/newArrivalsSlice';

const PLACEHOLDER = 'https://placehold.co/600x400?text=New+Arrival';

const NewArrivalsSection = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.newArrivals);

  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating]     = useState(false);
  const autoRef = useRef(null);

  const activeItems = items.filter((i) => i.isActive !== false);

  useEffect(() => { dispatch(fetchNewArrivals()); }, [dispatch]);

  useEffect(() => {
    if (activeItems.length <= 1) return;
    autoRef.current = setInterval(() => slide('next'), 4500);
    return () => clearInterval(autoRef.current);
  }, [activeItems.length, activeIndex]);

  const slide = (dir) => {
    if (animating || activeItems.length <= 1) return;
    clearInterval(autoRef.current);
    setAnimating(true);
    setTimeout(() => {
      setActiveIndex((prev) =>
        dir === 'next'
          ? (prev + 1) % activeItems.length
          : (prev - 1 + activeItems.length) % activeItems.length
      );
      setAnimating(false);
    }, 450);
  };

  const goTo = (idx) => {
    if (idx === activeIndex || animating) return;
    clearInterval(autoRef.current);
    setAnimating(true);
    setTimeout(() => { setActiveIndex(idx); setAnimating(false); }, 450);
  };

  return (
    <>
      <style>{`
        @keyframes na-shimmer {
          0%   { background-position: -500px 0; }
          100% { background-position:  500px 0; }
        }

        .na-section {
          padding: 72px 0;
          background: #fff;
        
        }

        /* ── Gutter ladder — mirrors Navbar.css --nav-pad-x ── */
        .na-inner {
          margin: 0 auto;
          padding: 0 var(--na-px);
        }

        :root {
          --na-px: var(--nav-pad-x, 48px);
        }

        /* 1920px+ → 80px */
        @media (min-width: 1920px) { 
          :root { --na-px: 80px; } 
        }

        /* 1440–1919px and 1280–1439px → 48px (root default) */

        /* ≤ 1279px → 36px */
        @media (max-width: 1279px) { 
          :root { --na-px: 36px; } 
        }

        /* ≤ 1159px → 28px */
        @media (max-width: 1159px) { 
          :root { --na-px: 28px; } 
        }

        /* ≤ 1023px → 20px */
        @media (max-width: 1023px) { 
          :root { --na-px: 20px; } 
        }

        /* ≤ 767px → 16px */
        @media (max-width: 767px) { 
          :root { --na-px: 16px; } 
        }

        /* ≤ 479px → 12px */
        @media (max-width: 479px) { 
          :root { --na-px: 12px; } 
        }

        /* heading */
        .na-eyebrow {
          font-size: .7rem;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: #7c3aed;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .na-eyebrow::before {
          content: '';
          display: inline-block;
          width: 28px; height: 2px;
          background: #7c3aed;
          border-radius: 2px;
        }
        .na-heading {
          font-size: 2.1rem;
          font-weight: 800;
          color: #1a0533;
          margin: 0 0 2px;
          line-height: 1.15;
        }
        .na-heading em {
          font-style: normal;
          color: #7c3aed;
        }
        .na-subtext {
          font-size: .88rem;
          color: #9ca3af;
          margin: 0;
        }
        .na-viewall {
          font-size: .82rem;
          font-weight: 600;
          color: #7c3aed;
          border: 1.5px solid #ddd6fe;
          border-radius: 8px;
          padding: 9px 20px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: background .2s, border-color .2s, color .2s;
          white-space: nowrap;
        }
        .na-viewall:hover {
          background: #7c3aed;
          border-color: #7c3aed;
          color: #fff;
        }

        /* ── Heading flex layout ── */
        .na-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        /* carousel */
        .na-carousel {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          background: #faf8ff;
          border: 1px solid #ede9fe;
          min-height: 360px;
        }

        /* slides */
        .na-slide {
          position: absolute;
          inset: 0;
          display: flex;
          opacity: 0;
          transform: translateX(48px);
          transition: opacity .45s cubic-bezier(.4,0,.2,1), transform .45s cubic-bezier(.4,0,.2,1);
          pointer-events: none;
        }
        .na-slide.active {
          opacity: 1;
          transform: translateX(0);
          pointer-events: auto;
          position: relative;
        }

        /* image side */
        .na-img-wrap {
          width: 48%;
          flex-shrink: 0;
          overflow: hidden;
          position: relative;
        }
        .na-img-wrap img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 7s ease;
          display: block;
        }
        .na-slide.active .na-img-wrap img { transform: scale(1.05); }

        /* purple overlay badge on image */
        .na-img-badge {
          position: absolute;
          top: 18px; left: 18px;
          background: rgba(124,58,237,.88);
          color: #fff;
          font-size: .65rem;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 20px;
          backdrop-filter: blur(4px);
        }

        /* content side */
        .na-content {
          flex: 1;
          padding: 44px 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 16px;
          background: #fff;
        }
        .na-tag {
          font-size: .68rem;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: #7c3aed;
        }
        .na-slide-title {
          font-size: 1.65rem;
          font-weight: 800;
          color: #1a0533;
          line-height: 1.2;
          margin: 0;
        }
        .na-slide-desc {
          font-size: .9rem;
          color: #6b7280;
          line-height: 1.65;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .na-slide-meta {
          font-size: .75rem;
          color: #a78bfa;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .na-cta {
          margin-top: 4px;
          align-self: flex-start;
          padding: 11px 26px;
          background: #7c3aed;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: .85rem;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: background .2s, transform .2s, box-shadow .2s;
          box-shadow: 0 4px 14px rgba(124,58,237,.25);
        }
        .na-cta:hover {
          background: #6d28d9;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(124,58,237,.35);
        }
        .na-cta svg {
          transition: transform .2s;
        }
        .na-cta:hover svg { transform: translateX(3px); }

        /* arrows */
        .na-arrow {
          position: absolute;
          top: 50%; transform: translateY(-50%);
          z-index: 10;
          width: 38px; height: 38px;
          border-radius: 50%;
          border: 1.5px solid #ede9fe;
          background: #fff;
          color: #7c3aed;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          font-size: .95rem;
          transition: background .2s, border-color .2s, color .2s, transform .2s;
        }
        .na-arrow:hover {
          background: #7c3aed;
          border-color: #7c3aed;
          color: #fff;
          transform: translateY(-50%) scale(1.08);
        }
        .na-arrow.prev { left: 14px; }
        .na-arrow.next { right: 14px; }

        /* dots */
        .na-dots {
          display: flex; gap: 7px;
          justify-content: center;
          margin-top: 20px;
        }
        .na-dot {
          height: 7px; width: 7px;
          border-radius: 99px;
          border: none;
          background: #ddd6fe;
          cursor: pointer;
          padding: 0;
          transition: background .3s, width .3s;
        }
        .na-dot.active {
          background: #7c3aed;
          width: 22px;
        }

        /* shimmer skeleton */
        .na-shimmer {
          background: linear-gradient(90deg, #f3f0ff 25%, #ede9fe 50%, #f3f0ff 75%);
          background-size: 500px 100%;
          animation: na-shimmer 1.5s infinite;
          border-radius: 8px;
        }
        .na-skel {
          display: flex;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #ede9fe;
          min-height: 360px;
        }

        /* ── Responsive ── */

        /* Tablet */
        @media (max-width: 1023px) {
          .na-section { 
            padding: 56px 0; 
          }
          .na-heading {
            font-size: 1.75rem;
          }
          .na-content {
            padding: 32px 28px;
          }
          .na-slide-title {
            font-size: 1.4rem;
          }
          .na-slide-desc {
            font-size: .84rem;
          }
          .na-carousel {
            min-height: 320px;
          }
          .na-skel {
            min-height: 320px;
          }
        }

        /* Mobile */
        @media (max-width: 767px) {
          .na-section { 
            padding: 40px 0; 
          }
          .na-carousel, 
          .na-skel { 
            min-height: unset; 
          }
          .na-slide { 
            flex-direction: column; 
          }
          .na-img-wrap { 
            width: 100%; 
            height: 220px; 
          }
          .na-content { 
            padding: 24px 20px; 
          }
          .na-slide-title { 
            font-size: 1.25rem; 
          }
          .na-arrow { 
            display: none; 
          }
          .na-heading { 
            font-size: 1.5rem; 
          }
          .na-subtext {
            font-size: .8rem;
          }
          .na-viewall {
            font-size: .74rem;
            padding: 7px 14px;
          }
          .na-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          .na-img-badge {
            top: 12px;
            left: 12px;
            font-size: .58rem;
            padding: 4px 10px;
          }
          .na-cta {
            padding: 9px 20px;
            font-size: .78rem;
          }
        }

        /* Small mobile */
        @media (max-width: 479px) {
          .na-section { 
            padding: 32px 0; 
          }
          .na-heading { 
            font-size: 1.25rem; 
          }
          .na-eyebrow {
            font-size: .62rem;
          }
          .na-subtext {
            font-size: .72rem;
          }
          .na-viewall {
            font-size: .68rem;
            padding: 6px 12px;
          }
          .na-img-wrap { 
            height: 180px; 
          }
          .na-content { 
            padding: 18px 16px;
            gap: 12px;
          }
          .na-slide-title { 
            font-size: 1.05rem; 
          }
          .na-slide-desc {
            font-size: .78rem;
          }
          .na-tag {
            font-size: .6rem;
          }
          .na-slide-meta {
            font-size: .68rem;
          }
          .na-cta {
            padding: 8px 16px;
            font-size: .72rem;
            border-radius: 8px;
          }
          .na-img-badge {
            top: 10px;
            left: 10px;
            font-size: .52rem;
            padding: 3px 8px;
          }
          .na-dots {
            gap: 5px;
            margin-top: 14px;
          }
          .na-dot {
            height: 6px;
            width: 6px;
          }
          .na-dot.active {
            width: 18px;
          }
        }

        /* Very small screens */
        @media (max-width: 360px) {
          .na-section { 
            padding: 24px 0; 
          }
          .na-heading { 
            font-size: 1.1rem; 
          }
          .na-img-wrap { 
            height: 150px; 
          }
          .na-content { 
            padding: 14px 12px;
            gap: 10px;
          }
          .na-slide-title { 
            font-size: .95rem; 
          }
          .na-slide-desc {
            font-size: .72rem;
            -webkit-line-clamp: 2;
          }
          .na-cta {
            padding: 6px 14px;
            font-size: .68rem;
          }
          .na-img-badge {
            top: 8px;
            left: 8px;
            font-size: .48rem;
            padding: 2px 6px;
          }
          .na-dots {
            gap: 4px;
            margin-top: 12px;
          }
          .na-dot {
            height: 5px;
            width: 5px;
          }
          .na-dot.active {
            width: 14px;
          }
        }
      `}</style>

      <section className="na-section">
        <div className="na-inner">

          {/* ── Heading row ── */}
          <div className="na-header">
            <div>
              <p className="na-eyebrow">Just dropped</p>
              <h2 className="na-heading">New <em>Arrivals</em></h2>
              <p className="na-subtext">Fresh picks added this week</p>
            </div>
            <a href="/new-arrivals" className="na-viewall">
              View All
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          {/* ── Loading skeleton ── */}
          {loading && (
            <div className="na-skel">
              <div className="na-shimmer" style={{ width: '48%' }} />
              <div style={{ flex: 1, padding: '44px 48px', display: 'flex', flexDirection: 'column', gap: 16, background: '#fff' }}>
                <div className="na-shimmer" style={{ height: 11, width: '35%' }} />
                <div className="na-shimmer" style={{ height: 26, width: '75%' }} />
                <div className="na-shimmer" style={{ height: 11, width: '90%' }} />
                <div className="na-shimmer" style={{ height: 11, width: '70%' }} />
                <div className="na-shimmer" style={{ height: 11, width: '50%' }} />
                <div className="na-shimmer" style={{ height: 42, width: 130, marginTop: 8, borderRadius: 10 }} />
              </div>
            </div>
          )}

          {/* ── Error ── */}
          {error && !loading && (
            <div className="alert py-2" style={{ background: '#fdf2f8', border: '1px solid #f3c5db', color: '#9d174d', borderRadius: 10 }}>
              {error}
            </div>
          )}

          {/* ── Empty ── */}
          {!loading && !error && activeItems.length === 0 && (
            <div className="text-center py-5" style={{ color: '#a78bfa' }}>No new arrivals yet.</div>
          )}

          {/* ── Carousel ── */}
          {!loading && activeItems.length > 0 && (
            <>
              <div className="na-carousel">
                {activeItems.map((item, idx) => (
                  <div key={item._id} className={`na-slide${idx === activeIndex ? ' active' : ''}`}>
                    <div className="na-img-wrap">
                      <img
                        src={item.image || PLACEHOLDER}
                        alt={item.title}
                        onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
                      />
                      <span className="na-img-badge">New Arrival</span>
                    </div>

                    <div className="na-content">
                      <span className="na-tag">✦ Featured Drop</span>
                      <h3 className="na-slide-title">{item.title}</h3>
                      {item.description && (
                        <p className="na-slide-desc">{item.description}</p>
                      )}
                      <span className="na-slide-meta">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <a href="#" className="na-cta">
                        Shop Now
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}

                {activeItems.length > 1 && (
                  <>
                    <button className="na-arrow prev" onClick={() => slide('prev')} aria-label="Previous">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6"/>
                      </svg>
                    </button>
                    <button className="na-arrow next" onClick={() => slide('next')} aria-label="Next">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {activeItems.length > 1 && (
                <div className="na-dots">
                  {activeItems.map((_, idx) => (
                    <button
                      key={idx}
                      className={`na-dot${idx === activeIndex ? ' active' : ''}`}
                      onClick={() => goTo(idx)}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </section>
    </>
  );
};

export default NewArrivalsSection;