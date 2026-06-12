import React, { useEffect, useState } from "react";

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
  autoPlay = true,
  autoPlayDuration = 4000,
}) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!autoPlay || banners.length <= 1) return;

    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % banners.length);
    }, autoPlayDuration);

    return () => clearInterval(timer);
  }, [banners.length, autoPlay, autoPlayDuration]);

  if (!banners.length) {
    return <div className="banner-skeleton" />;
  }

  const nextSlide = () => {
    setActive((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setActive((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div
      className="banner-section"
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="banner-track"
        style={{
          display: "flex",
          transition: "transform 0.6s ease",
          transform: `translateX(-${active * 100}%)`,
        }}
      >
        {banners.map((ban, i) => {
          const theme = SLIDE_THEMES[i % SLIDE_THEMES.length];

          return (
            <div
              key={ban._id || i}
              style={{
                minWidth: "100%",
                height: "500px",
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                }}
              >
                <img
                  src={ban.image}
                  alt={ban.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(90deg, rgba(0,0,0,.75) 0%, rgba(0,0,0,.4) 60%, rgba(0,0,0,.1) 100%)",
                  }}
                />
              </div>

              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  maxWidth: "600px",
                  padding: "0 64px",
                  color: "#fff",
                }}
              >
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
                  >
                    Shop Now
                  </button>

                  <button className="banner-btn-ghost">
                    Explore Brand
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
            className={`dot ${active === i ? "active" : ""}`}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;