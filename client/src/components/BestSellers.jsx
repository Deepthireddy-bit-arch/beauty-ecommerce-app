import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBestSellers } from "../redux/slices/bestsellersSlice";






// ─── Product Card ────────────────────────────────────────────────────────────

const GRADIENT_PAIRS = [
  ["#c9b8f0", "#e8e0fc"],
  ["#b8c8f0", "#dde6fc"],
  ["#d4b8f0", "#ede0fc"],
  ["#b8d4f0", "#deeafc"],
  ["#c4b8f0", "#e4e0fc"],
];

function ProductCard({ product, index }) {
  const [from, to] = GRADIENT_PAIRS[index % GRADIENT_PAIRS.length];
  return (
    <div
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
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "rgba(255,255,255,0.35)",
            border: "2px solid rgba(255,255,255,0.55)"
          }} />
        )}
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
    <section style={{
      background: "#f8f6fe",
      padding: "48px 0 40px",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 12, marginBottom: 6,
        }}>
          <div style={{ height: 1, width: 40, background: "#bba8e0" }} />
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.15em",
            textTransform: "uppercase", color: "#7c55c4"
          }}>
            THE BEST OF LUXURY
          </span>
          <div style={{ height: 1, width: 40, background: "#bba8e0" }} />
        </div>
        <h2 style={{
          fontSize: 34, fontWeight: 800, margin: "0 0 6px",
          color: "#1a0a2e", lineHeight: 1.15,
        }}>
          Best <span style={{ color: "#7c3aed" }}>Sellers</span>
        </h2>
        <p style={{ color: "#7a6e8a", fontSize: 14, margin: 0 }}>
          Loved by thousands, trusted by all
        </p>
      </div>

      {/* Track */}
      {loading ? (
        <div style={{ textAlign: "center", color: "#9b8ab0", padding: 40 }}>Loading…</div>
      ) : error ? (
        <div style={{ textAlign: "center", color: "#e05a5a", padding: 40 }}>{error}</div>
      ) : (
        <div
          ref={trackRef}
          onMouseEnter={() => setAutoScroll(false)}
          onMouseLeave={() => setAutoScroll(true)}
          style={{
            display: "flex",
            gap: 16,
            overflowX: "hidden",
            padding: "8px 32px 16px",
            scrollbarWidth: "none",
            cursor: "grab",
          }}
        >
          {doubled.map((product, i) => (
            <ProductCard key={`${product._id}-${i}`} product={product} index={i} />
          ))}
        </div>
      )}

      {/* Footer controls */}
      {/* <div style={{
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
      </div> */}
    </section>
  );
}
export default BestSellersSection;



