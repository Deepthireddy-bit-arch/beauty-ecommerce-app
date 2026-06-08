import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCollections,
  setFilter,
  toggleLike,
  selectFilteredCollections,
  selectAllCollections,
  selectStatus,
  selectError,
  selectFilter,
  selectLiked,
} from "../../redux/slices/collectionsSlice";
import "./Collections.css";

// ─── TOAST HOOK ──────────────────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState({ msg: "", show: false });
  const showToast = (msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2400);
  };
  return { toast, showToast };
}

// ─── SKELETON CARD ───────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="skeleton">
      <div className="sk-img" />
      <div className="sk-body">
        <div className="sk-line short" />
        <div className="sk-line med" />
        <div className="sk-line" />
        <div className="sk-line short" />
      </div>
    </div>
  );
}

// ─── COLLECTION CARD ─────────────────────────────────────────────────────────
function CollectionCard({ item, onToast }) {
  const dispatch = useDispatch();
  const liked = useSelector(selectLiked)[item._id];

  const handleLike = (e) => {
    e.stopPropagation();
    dispatch(toggleLike(item._id));
    onToast(liked ? "Removed from wishlist ✦" : "Added to wishlist ♥");
  };

  return (
    <div className="card">
      {/* Image */}
      <div className="card-img-wrap">
        <img src={item.image} alt={item.title} loading="lazy" />
        <span className="card-badge">{item.category}</span>
        <button
          className={`card-wishlist${liked ? " liked" : ""}`}
          onClick={handleLike}
          aria-label="Toggle wishlist"
        >
          {liked ? "♥" : "♡"}
        </button>
        <div className="card-overlay">
          <button
            className="quick-shop"
            onClick={() => onToast(`Quick shop: ${item.title}`)}
          >
            ⚡ Quick Shop
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="card-body">
        <div className="card-category">{item.category}</div>
        <h3 className="card-title">{item.title}</h3>
        <p className="card-sub">{item.sub}</p>
        <div className="card-footer">
          <span className="offer-pill">✦ {item.offer}</span>
          <button
            className="explore-btn"
            onClick={() => onToast(`Exploring ${item.title}...`)}
          >
            Explore
            <svg
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1={5} y1={12} x2={19} y2={12} />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}




// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function CollectionsPage() {
  const dispatch = useDispatch();
  const { toast, showToast } = useToast();

  const status = useSelector(selectStatus);
  const error = useSelector(selectError);
  const filter = useSelector(selectFilter);
  const filtered = useSelector(selectFilteredCollections);

  useEffect(() => {
    dispatch(fetchCollections());
  }, [dispatch]);

  const filterLabel =
    filter === "all"
      ? "All Collections"
      : filter.charAt(0).toUpperCase() + filter.slice(1) + " Collection";

  return (
    <>
    

      {/* ── HERO ── */}
      {/* <div className="hero-strip">
        <div className="hero-label">2026 Curated Drops</div>
        <h1 className="hero-title">
          Shop By <em>Collection</em>
        </h1>
        <p className="hero-sub">
          Handpicked beauty universes for every ritual, mood, and moment.
        </p>
      </div> */}

     

   

      {/* ── MAIN GRID ── */}
      <main className="main">
        {status !== "loading" && (
          <div className="section-meta">
            <h2 className="section-title">{filterLabel}</h2>
            <span className="section-count">
              {filtered.length} collection{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Loading */}
        {status === "loading" && (
          <div className="grid">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {status === "failed" && (
          <div className="error-state">
            <div className="error-icon">✦</div>
            <h3 className="error-title">Something went wrong</h3>
            <p className="error-msg">{error || "Failed to load collections"}</p>
            <button
              className="retry-btn"
              onClick={() => dispatch(fetchCollections())}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Grid */}
        {status === "succeeded" &&
          (filtered.length === 0 ? (
            <div className="empty-state">
              <h3 className="empty-title">No collections found</h3>
              <p className="empty-sub">Try a different filter</p>
            </div>
          ) : (
            <div className="grid">
              {filtered.map((item) => (
                <CollectionCard key={item._id} item={item} onToast={showToast} />
              ))}
            </div>
          ))}
      </main>

      {/* ── TOAST ── */}
      <div className={`toast${toast.show ? " show" : ""}`}>{toast.msg}</div>
    </>
  );
}