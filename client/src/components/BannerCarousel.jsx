
import React, { useEffect, useState } from "react";
import "./Banner.scss";
import { useNavigate } from 'react-router-dom';
const SLIDE_THEMES = [
  {
    eyebrow: "✦ Featured Brand",
    btnBg: "#fff",
    btnColor: "#4c1d95",
  },
  {
    eyebrow: "⭐ Top Pick",
    btnBg: "#fff",
    btnColor: "#0c4a6e",
  },
  {
    eyebrow: "💄 Trending Now",
    btnBg: "#fff",
    btnColor: "#9d174d",
  },
];

const BannerCarousel = ({
  banners = [],
  loading = false,
  autoPlay = true,
  autoPlayDuration = 4000,
}) => {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!autoPlay || banners.length <= 1) return;

    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % banners.length);
    }, autoPlayDuration);

    return () => clearInterval(timer);
  }, [banners.length, autoPlay, autoPlayDuration]);

  // -----------------------------
  // LOADING STATE
  // -----------------------------
if (loading) {
  return (
    <div className="banner-skeleton">
      <div className="skeleton-overlay">
        <div className="skeleton-line w-120" />      {/* eyebrow */}
        <div className="skeleton-line w-350 h-lg" /> {/* headline line 1 */}
        <div className="skeleton-line w-250 h-lg" /> {/* headline line 2 */}
        <div className="skeleton-line w-300" />      {/* subtitle line 1 */}
        <div className="skeleton-line w-220" />      {/* subtitle line 2 */}
        <div className="skeleton-badge" />            {/* offer badge */}
        <div className="skeleton-btn-row">
          <div className="skeleton-btn" />
          <div className="skeleton-btn skeleton-btn--ghost" />
        </div>
      </div>

      <div className="skeleton-dots">
        <span className="skeleton-dot" />
        <span className="skeleton-dot" />
        <span className="skeleton-dot" />
      </div>
    </div>
  );
}

  // -----------------------------
  // EMPTY STATE
  // -----------------------------
  if (!loading && banners.length === 0) {
    return (
      <div className="banner-empty">
        <img
          src="/images/no-data-found.svg"
          alt="No Data Found"
          className="banner-empty-img"
        />

        <h3>No Banner Available</h3>

        <p>
          Currently there are no promotional banners available.
        </p>
      </div>
    );
  }

  const nextSlide = () => {
    setActive((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setActive((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="banner-section">
      <div
        className="banner-track"
        style={{
          transform: `translateX(-${active * 100}%)`,
        }}
      >
        {banners.map((ban, i) => {
          const theme =
            SLIDE_THEMES[i % SLIDE_THEMES.length];

          return (
            <div
              key={ban._id || i}
              className="banner-slide"
            >
              <div className="banner-bg">
                <img
                  src={ban.image}
                  alt={ban.title}
                />

                <div className="banner-overlay" />
              </div>

              <div className="banner-content">
                <div className="banner-eyebrow">
                  {theme.eyebrow}
                </div>

                <h2 className="banner-headline">
                  {ban.title}
                </h2>

                <p className="banner-sub">
                  {ban.sub}
                </p>

                {ban.offer && (
                  <div className="banner-offer-badge">
                    {ban.offer}
                  </div>
                )}

                <div className="banner-cta-row">
                  <button
                    className="banner-btn-primary"
                    style={{
                      background: theme.btnBg,
                      color: theme.btnColor,
                    }}
                     onClick={() => navigate('/products')}
                  >
                    Shop Now
                  </button>

                  <button className="banner-btn-ghost"  onClick={() => navigate('/brands')}>
                    Explore Brand
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {banners.length > 1 && (
        <>
          <button
            className="banner-arrow banner-arrow--prev"
            onClick={prevSlide}
          >
            ‹
          </button>

          <button
            className="banner-arrow banner-arrow--next"
            onClick={nextSlide}
          >
            ›
          </button>

          <div className="banner-dots">
            {banners.map((_, i) => (
              <button
                key={i}
                className={`dot ${
                  active === i ? "active" : ""
                }`}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BannerCarousel;