
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBestSellers } from "../redux/slices/bestsellersSlice";

// ─── Product Card ────────────────────────────────────────────────────────────

import { useNavigate } from "react-router-dom";

const GRADIENT_PAIRS = [
  ["#c9b8f0", "#e8e0fc"],
  ["#b8c8f0", "#dde6fc"],
  ["#d4b8f0", "#ede0fc"],
  ["#b8d4f0", "#deeafc"],
  ["#c4b8f0", "#e4e0fc"],
];

function ProductCard({ product, index }) {
  const navigate = useNavigate();
  const [from, to] = GRADIENT_PAIRS[index % GRADIENT_PAIRS.length];
  
  // Get image from images array or image field
  const productImage = product.images?.[0] || product.image || null;

  const handleClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        flexShrink: 0,
        width: 200,
        borderRadius: 16,
        overflow: "hidden",
        background: `linear-gradient(160deg, ${from} 0%, ${to} 100%)`,
        boxShadow: "0 2px 16px rgba(120,100,200,0.10)",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "transform 0.18s, box-shadow 0.18s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 28px rgba(120,100,200,0.18)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 16px rgba(120,100,200,0.10)";
      }}
    >
      {/* Image area */}
      <div
        style={{
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {productImage ? (
          <img
            src={productImage}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.querySelector('.fallback-icon').style.display = "flex";
            }}
          />
        ) : null}
        <div 
          className="fallback-icon"
          style={{
            display: productImage ? "none" : "flex",
            width: 64, height: 64, borderRadius: "50%",
            background: "rgba(255,255,255,0.35)",
            border: "2px solid rgba(255,255,255,0.55)",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
          }}
        >
          🛍️
        </div>
        
        {product.tag && (
          <span style={{
            position: "absolute", top: 10, right: 10,
            background: "rgba(255,255,255,0.75)",
            color: "#6b3fa0",
            fontSize: 10, fontWeight: 700,
            borderRadius: 20, padding: "2px 10px",
            letterSpacing: "0.04em", textTransform: "uppercase"
          }}>
            {product.tag}
          </span>
        )}
      </div>

      {/* Brand banner */}
      <div style={{
        background: "rgba(80,50,140,0.82)",
        color: "#fff",
        fontWeight: 700,
        fontSize: 13,
        textAlign: "center",
        padding: "8px 0",
        letterSpacing: "0.06em",
      }}>
        {product.brand}
      </div>

      {/* Name */}
      <div style={{
        background: "#fff",
        color: "#2d1a4a",
        fontSize: 12,
        textAlign: "center",
        padding: "10px 12px 14px",
        fontWeight: 500,
        lineHeight: 1.4,
      }}>
        {product.name}
      </div>
    </div>
  );
}

// ─── Best Sellers Section ────────────────────────────────────────────────────

function BestSellersSection() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.bestSellers);

  const trackRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const autoScrollRef = useRef(autoScroll);
  autoScrollRef.current = autoScroll;

  useEffect(() => {
    dispatch(fetchBestSellers(20));
  }, [dispatch]);

  // Auto-scroll logic
  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;

    let animId;
    let speed = 0.6; // px per frame

    const step = () => {
      if (autoScrollRef.current && track) {
        track.scrollLeft += speed;
        // Loop: if we've scrolled past half (duplicated list), reset to start
        if (track.scrollLeft >= track.scrollWidth / 2) {
          track.scrollLeft = 0;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [items]);

  const handleViewAll = () => alert("Navigate to all best sellers");

  const doubled = [...items, ...items]; // duplicate for seamless loop

  return (
    <>
      <style>{`
        .bs-section {
          background: #f8f6fe;
          padding: 48px 0 40px;
          font-family: 'Segoe UI', system-ui, sans-serif;
        }

        /* ── Gutter ladder — mirrors Navbar.css --nav-pad-x ── */
        .bs-inner {
          margin: 0 auto;
          padding: 0 var(--bs-px);
        }

        :root {
          --bs-px: var(--nav-pad-x, 48px);
        }

        /* 1920px+ → 80px */
        @media (min-width: 1920px) { 
          :root { --bs-px: 80px; } 
        }

        /* 1440–1919px and 1280–1439px → 48px (root default) */

        /* ≤ 1279px → 36px */
        @media (max-width: 1279px) { 
          :root { --bs-px: 36px; } 
        }

        /* ≤ 1159px → 28px */
        @media (max-width: 1159px) { 
          :root { --bs-px: 28px; } 
        }

        /* ≤ 1023px → 20px */
        @media (max-width: 1023px) { 
          :root { --bs-px: 20px; } 
        }

        /* ≤ 767px → 16px */
        @media (max-width: 767px) { 
          :root { --bs-px: 16px; } 
        }

        /* ≤ 479px → 12px */
        @media (max-width: 479px) { 
          :root { --bs-px: 12px; } 
        }

        /* ── Header ── */
        .bs-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .bs-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 6px;
        }

        .bs-divider-line {
          height: 1px;
          width: 40px;
          background: #bba8e0;
        }

        .bs-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #7c55c4;
        }

        .bs-title {
          font-size: 34px;
          font-weight: 800;
          margin: 0 0 6px;
          color: #1a0a2e;
          line-height: 1.15;
        }

        .bs-title span {
          color: #7c3aed;
        }

        .bs-sub {
          color: #7a6e8a;
          font-size: 14px;
          margin: 0;
        }

        /* ── Track ── */
        .bs-track {
          display: flex;
          gap: 16px;
          overflow-x: hidden;
          padding: 8px 0 16px;
          scrollbar-width: none;
          cursor: grab;
        }

        .bs-track::-webkit-scrollbar {
          display: none;
        }

        .bs-loading {
          text-align: center;
          color: #9b8ab0;
          padding: 40px;
        }

        .bs-error {
          text-align: center;
          color: #e05a5a;
          padding: 40px;
        }

        /* ── Responsive ── */

        /* Tablet */
        @media (max-width: 1023px) {
          .bs-section {
            padding: 40px 0 32px;
          }
          .bs-title {
            font-size: 28px;
          }
          .bs-header {
            margin-bottom: 24px;
          }
          .bs-track {
            gap: 14px;
          }
          /* Card resizing via inline styles - handled in JS */
        }

        /* Mobile */
        @media (max-width: 767px) {
          .bs-section {
            padding: 32px 0 24px;
          }
          .bs-title {
            font-size: 24px;
          }
          .bs-sub {
            font-size: 13px;
          }
          .bs-eyebrow {
            font-size: 10px;
          }
          .bs-divider-line {
            width: 28px;
          }
          .bs-divider {
            gap: 8px;
          }
          .bs-header {
            margin-bottom: 18px;
          }
          .bs-track {
            gap: 12px;
            padding: 4px 0 12px;
          }
        }

        /* Small mobile */
        @media (max-width: 479px) {
          .bs-section {
            padding: 24px 0 18px;
          }
          .bs-title {
            font-size: 20px;
          }
          .bs-sub {
            font-size: 12px;
          }
          .bs-eyebrow {
            font-size: 9px;
            letter-spacing: 0.12em;
          }
          .bs-divider-line {
            width: 20px;
          }
          .bs-divider {
            gap: 6px;
          }
          .bs-header {
            margin-bottom: 14px;
          }
          .bs-track {
            gap: 10px;
            padding: 2px 0 10px;
          }
        }

        /* Very small screens */
        @media (max-width: 360px) {
          .bs-section {
            padding: 18px 0 14px;
          }
          .bs-title {
            font-size: 17px;
          }
          .bs-sub {
            font-size: 11px;
          }
          .bs-eyebrow {
            font-size: 8px;
          }
          .bs-divider-line {
            width: 16px;
          }
          .bs-divider {
            gap: 4px;
          }
          .bs-header {
            margin-bottom: 12px;
          }
          .bs-track {
            gap: 8px;
            padding: 2px 0 8px;
          }
        }
      `}</style>

      <section className="bs-section">
        <div className="bs-inner">
          {/* Header */}
          <div className="bs-header">
            <div className="bs-divider">
              <div className="bs-divider-line" />
              <span className="bs-eyebrow">THE BEST OF LUXURY</span>
              <div className="bs-divider-line" />
            </div>
            <h2 className="bs-title">
              Best <span>Sellers</span>
            </h2>
            <p className="bs-sub">Loved by thousands, trusted by all</p>
          </div>

          {/* Track */}
          {loading ? (
            <div className="bs-loading">Loading…</div>
          ) : error ? (
            <div className="bs-error">{error}</div>
          ) : (
            <div
              ref={trackRef}
              onMouseEnter={() => setAutoScroll(false)}
              onMouseLeave={() => setAutoScroll(true)}
              className="bs-track"
            >
              {doubled.map((product, i) => (
                <ProductCard key={`${product._id}-${i}`} product={product} index={i} />
              ))}
            </div>
          )}

          {/* Footer controls - hidden per your code, but kept for reference */}
          {/* 
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 12, marginTop: 20,
          }}>
            <button
              onClick={() => setAutoScroll((v) => !v)}
              style={{
                background: autoScroll ? "#ede8fb" : "#fff",
                color: "#7c3aed",
                border: "1.5px solid #c4b2f0",
                borderRadius: 20, padding: "7px 20px",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              {autoScroll ? "Auto-scrolling" : "Paused"}
            </button>

            <button
              onClick={handleViewAll}
              style={{
                background: "#7c3aed",
                color: "#fff",
                border: "none",
                borderRadius: 20, padding: "7px 22px",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
                transition: "background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#6226d1"}
              onMouseLeave={e => e.currentTarget.style.background = "#7c3aed"}
            >
              View All <span style={{ fontSize: 15 }}>→</span>
            </button>
          </div>
          */}
        </div>
      </section>
    </>
  );
}

export default BestSellersSection;



