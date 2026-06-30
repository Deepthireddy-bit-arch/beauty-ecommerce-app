import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDeals } from "../redux/reducers/thunks/dealsThunks";
import './DealsCarousel.css';
const DealsCarousel = () => {
  const [index, setIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const cardRef = useRef(null);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: deals } = useSelector((state) => state.deals);
  const safeDeals = deals || [];
  const max = Math.max(safeDeals.length - 3, 0);

  useEffect(() => { dispatch(fetchDeals()); }, [dispatch]);

  useEffect(() => {
    if (cardRef.current) setCardWidth(cardRef.current.offsetWidth);
  }, [safeDeals.length]);

  const goTo = useCallback((n) => {
    setIndex(Math.max(0, Math.min(n, max)));
  }, [max]);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((p) => (p >= max ? 0 : p + 1));
    }, 3500);
  }, [max]);

  useEffect(() => {
    if (!safeDeals.length) return;
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer, safeDeals.length]);

  const handleNav = (dir) => {
    goTo(index + dir);
    startTimer();
  };
const resolveImg = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${MEDIA_URL}${path}`;
};
  return (
    <section className="dc-section">
      <div className="dc-container">

        {/* ── Header ── */}
        <div className="dc-header">
          <div>
            <div className="dc-eyebrow">Limited time only</div>
            <h2 className="dc-heading">
              Coolest Deals <em>Ever.</em>
            </h2>
          </div>
          <button className="dc-viewall" onClick={() => navigate("/products")}>
            Shop all deals →
          </button>
        </div>

        {/* ── Carousel ── */}
        <div className="dc-carousel-wrap">

          {/* Nav buttons */}
          <button
            className="dc-nav dc-nav--left"
            onClick={() => handleNav(-1)}
            disabled={index === 0}
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            className="dc-nav dc-nav--right"
            onClick={() => handleNav(1)}
            disabled={index >= max}
            aria-label="Next"
          >
            ›
          </button>

          {/* Track */}
          <div className="dc-overflow">
            <div
              className="dc-track"
              style={{ transform: `translateX(-${index * (cardWidth + 20)}px)` }}
            >
              {safeDeals.map((deal, i) => (
                <div
                  key={deal._id}
                  ref={i === 0 ? cardRef : null}
                  className="dc-card"
                onClick={() => navigate(`/product/${deal._id}`)}
                >
                  <img
                    src={resolveImg(deal.image)}
                    alt={deal.name}
                    loading="lazy"
                    className="dc-card-img"
                  />

                  {/* Gradient overlay */}
                  <div className="dc-card-overlay" />

                  {/* Discount badge */}
                  <div className="dc-badge">{deal.discount}% OFF</div>

                  {/* Card body */}
                  <div className="dc-card-body">
                    <div className="dc-card-brand">{deal.brand}</div>
                    <div className="dc-card-name">{deal.name}</div>
                    <button className="dc-card-btn">Shop now →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Dots ── */}
        <div className="dc-dots">
          {Array.from({ length: max + 1 }).map((_, i) => (
            <button
              key={i}
              className={`dc-dot ${i === index ? "dc-dot--active" : ""}`}
              onClick={() => { goTo(i); startTimer(); }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
export default DealsCarousel;
