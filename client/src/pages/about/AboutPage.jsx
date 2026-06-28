import { useState, useEffect, useRef } from "react";
import "./AboutPage.css";

/* ─── Placeholder image URLs (swap with your CDN assets) ─── */
const IMG = {
  hero: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1600&q=80&fit=crop",
  product: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=900&q=80&fit=crop",
  founder: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&q=80&fit=crop&facepad=3",
  eye: "https://images.unsplash.com/photo-1518932945647-7a1c969f8be2?w=1600&q=80&fit=crop",
};

/* ─── Scroll-reveal hook ─── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("ap-visible"); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ─── Reveal wrapper ─── */
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`ap-reveal${delay ? ` ap-reveal-delay-${delay}` : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── Skeleton ─── */
function Sk({ h, w, style }) {
  return <div className="ap-sk" style={{ height: h, width: w || "100%", ...style }} />;
}

/* ══════════════════════════════════════════════════════
   SECTION 1 — HERO
   ══════════════════════════════════════════════════════ */
function HeroSection({ loading }) {
  if (loading) return <div className="ap-hero--sk ap-sk" />;
  return (
    <section className="ap-hero" aria-label="About Us hero">
      <img src={IMG.hero} alt="Beauty botanicals" className="ap-hero__img" loading="eager" />
      <div className="ap-hero__overlay" />
      <div className="ap-hero__body">
        <Reveal><p className="ap-hero__eyebrow">Our Story</p></Reveal>
        <Reveal delay={1}>
          <h1 className="ap-hero__title">
            Beauty Born from <em>Nature</em>
          </h1>
        </Reveal>
        <Reveal delay={2}>
          <p className="ap-hero__sub">
            Every formula is a love letter to your skin — crafted with purpose, transparency, and the finest botanicals on earth.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION 2 — PHILOSOPHY
   ══════════════════════════════════════════════════════ */
function PhilosophySection({ loading }) {
  return (
    <section className="ap-philosophy">
      <div className="ap-inner">
        {loading ? (
          <div className="ap-philosophy__sk">
            <Sk h={14} w={140} />
            <Sk h={48} />
            <Sk h={48} w="80%" />
            <Sk h={48} w="60%" />
            <Sk h={2} w={56} />
          </div>
        ) : (
          <>
            <Reveal><p className="ap-philosophy__tag">Homemade Beauty Products</p></Reveal>
            <Reveal delay={1}>
              <p className="ap-philosophy__statement">
                <strong>Natural Ingredients Only</strong> is our philosophy
                for every beauty product we create — because your skin
                deserves nothing less than the purest gifts of nature.
              </p>
            </Reveal>
            <Reveal delay={2}><div className="ap-philosophy__rule" /></Reveal>
          </>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION 3 — FOUNDER STORY (2-col)
   ══════════════════════════════════════════════════════ */
function StorySection({ loading }) {
  return (
    <section className="ap-story">
      <div className="ap-inner">
        {loading ? (
          <div className="ap-story__grid">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Sk h={28} />
              <Sk h={28} w="85%" />
              <Sk h={28} w="70%" />
              <Sk h={12} w={100} style={{ marginTop: 8 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Sk h={28} w="60%" />
              <Sk h={18} />
              <Sk h={18} />
              <Sk h={18} w="80%" />
              <Sk h={18} />
              <Sk h={18} w="65%" />
              <div className="ap-story__product-img--sk ap-sk" />
            </div>
          </div>
        ) : (
          <div className="ap-story__grid">
            {/* Left: quote */}
            <div>
              <Reveal>
                <blockquote className="ap-story__quote">
                  "My vision was to create products that would make every woman feel radiant in her own skin — naturally, confidently, beautifully."
                </blockquote>
              </Reveal>
              <Reveal delay={1}>
                <p className="ap-story__attr">— Jane Doe, Founder &amp; CEO</p>
              </Reveal>
            </div>
            {/* Right: body + image */}
            <div>
              <Reveal>
                <h2 className="ap-story__body-title">We are all about skin that feels as good as it looks</h2>
              </Reveal>
              <Reveal delay={1}>
                <p className="ap-story__body-text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
                </p>
                <p className="ap-story__body-text">
                  Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation nisi ut aliquip ex ea commodo.
                </p>
              </Reveal>
              <Reveal delay={2}>
                <div className="ap-story__img-wrap">
                  <img src={IMG.product} alt="Natural beauty products" className="ap-story__product-img" loading="lazy" />
                  <div className="ap-story__badge">
                    <div className="ap-story__badge-num">12+</div>
                    <div className="ap-story__badge-label">Years of craftsmanship</div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION 4 — PULL QUOTE
   ══════════════════════════════════════════════════════ */
function PullQuoteSection({ loading }) {
  return (
    <section className="ap-pullquote">
      <div className="ap-inner">
        {loading ? (
          <>
            <Sk h={40} />
            <Sk h={40} w="75%" style={{ marginTop: 14 }} />
            <Sk h={2} w={42} style={{ marginTop: 28 }} />
          </>
        ) : (
          <Reveal>
            <p className="ap-pullquote__text">
              "Everything we need to nourish our bodies can be found in nature — so we&nbsp;built a brand around <em>never compromising</em> on that truth."
            </p>
            <div className="ap-pullquote__rule" />
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION 5 — FOUNDER SPLIT PANEL
   ══════════════════════════════════════════════════════ */
function FounderSection({ loading }) {
  return (
    <section className="ap-founder">
      <div className="ap-inner">
        {loading ? (
          <div className="ap-founder__grid" style={{ borderRadius: 28, overflow: "hidden" }}>
            <Sk h={480} style={{ borderRadius: 0 }} />
            <Sk h={480} style={{ borderRadius: 0 }} />
          </div>
        ) : (
          <Reveal>
            <div className="ap-founder__grid">
              {/* Card */}
              <div className="ap-founder__card">
                <div className="ap-founder__card-orb ap-founder__card-orb--1" />
                <div className="ap-founder__card-orb ap-founder__card-orb--2" />
                <div>
                  <p className="ap-founder__card-eyebrow">Meet the Founder</p>
                  <h2 className="ap-founder__card-name">Jane Doe</h2>
                  <p className="ap-founder__card-role">Founder &amp; Chief Formulator</p>
                  <p className="ap-founder__card-bio">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo.
                  </p>
                  <p className="ap-founder__card-bio">
                    Consectetur adipiscing elit, sed do eiusmod tempor ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud veniam, quis nostrud.
                  </p>
                </div>
                <p className="ap-founder__card-sig">Jane Doe</p>
              </div>
              {/* Photo */}
              <div className="ap-founder__photo">
                <img src={IMG.founder} alt="Jane Doe, founder" loading="lazy" />
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION 6 — VALUES STRIP
   ══════════════════════════════════════════════════════ */
const VALUES = [
  { icon: "🌿", name: "Natural Ingredients" },
  { icon: "🐰", name: "Cruelty Free" },
  { icon: "🍃", name: "Carbon Neutral" },
  { icon: "♻️", name: "Recyclable Packaging" },
];

function ValuesSection({ loading }) {
  return (
    <section className="ap-values">
      <div className="ap-inner">
        {loading ? (
          <div className="ap-values__layout">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Sk h={12} w={120} />
              <Sk h={18} />
              <Sk h={18} />
              <Sk h={18} w="80%" />
            </div>
            <div className="ap-values__grid">
              {[...Array(4)].map((_, i) => <Sk key={i} h={130} style={{ borderRadius: 20 }} />)}
            </div>
          </div>
        ) : (
          <div className="ap-values__layout">
            <Reveal>
              <p className="ap-values__left-tag">Our Promise</p>
              <p className="ap-values__left-text">
                We use only natural ingredients for our products, which are good for you and the environment. Every choice we make is guided by our commitment to conscious beauty.
              </p>
            </Reveal>
            <div className="ap-values__grid">
              {VALUES.map((v, i) => (
                <Reveal key={v.name} delay={i > 0 ? i : undefined}>
                  <div className="ap-values__item">
                    <span className="ap-values__icon">{v.icon}</span>
                    <p className="ap-values__name">{v.name}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION 7 — IMMERSIVE IMAGE
   ══════════════════════════════════════════════════════ */
function ImmersiveSection({ loading }) {
  if (loading) return <div className="ap-immersive--sk ap-sk" />;
  return (
    <section className="ap-immersive" aria-hidden="true">
      <img src={IMG.eye} alt="Close-up — pure beauty" className="ap-immersive__img" loading="lazy" />
      <div className="ap-immersive__overlay" />
      <p className="ap-immersive__label">
        Pure. Potent. <em>Purposeful.</em>
      </p>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION 8 — STATS ROW
   ══════════════════════════════════════════════════════ */
const STATS = [
  { num: "50K+", label: "Happy Customers", sub: "Across 40+ countries" },
  { num: "120+", label: "Products", sub: "All-natural formulas" },
  { num: "12",   label: "Years",   sub: "Of skin expertise" },
  { num: "98%",  label: "Satisfaction", sub: "Verified reviews" },
];

function StatsSection({ loading }) {
  return (
    <section className="ap-stats">
      <div className="ap-inner">
        {loading ? (
          <div className="ap-stats__grid">
            {[...Array(4)].map((_, i) => <Sk key={i} h={150} style={{ borderRadius: 0 }} />)}
          </div>
        ) : (
          <Reveal>
            <div className="ap-stats__grid">
              {STATS.map(s => (
                <div key={s.label} className="ap-stats__item">
                  <div className="ap-stats__num">{s.num}</div>
                  <div className="ap-stats__label">{s.label}</div>
                  <div className="ap-stats__sub">{s.sub}</div>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION 9 — PRESS / FEATURED ON
   ══════════════════════════════════════════════════════ */
const PRESS = ["Vogue", "Allure", "Byrdie", "InStyle", "Glamour", "Refinery29", "Elle", "Harper's Bazaar"];

function PressSection({ loading }) {
  return (
    <section className="ap-press">
      <div className="ap-inner">
        {loading ? (
          <>
            <Sk h={12} w={160} style={{ margin: "0 auto 44px" }} />
            <div className="ap-press__sk">
              {[...Array(8)].map((_, i) => <div key={i} className="ap-press__sk-item ap-sk" />)}
            </div>
          </>
        ) : (
          <>
            <Reveal><p className="ap-press__label">Featured On</p></Reveal>
            <Reveal delay={1}>
              <div className="ap-press__logos">
                {PRESS.map(name => (
                  <span key={name} className="ap-press__logo-item">{name}</span>
                ))}
              </div>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION 10 — FAQ / HELP BAND
   ══════════════════════════════════════════════════════ */
function HelpSection({ loading }) {
  return (
    <section className="ap-help">
      <div className="ap-inner">
        {loading ? (
          <div className="ap-help__grid">
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Sk h={32} />
                <Sk h={32} w="60%" />
                <Sk h={40} w={120} style={{ borderRadius: 100, marginTop: 8 }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="ap-help__grid">
            <Reveal>
              <h2 className="ap-help__cta-title">Have questions?</h2>
              <a href="/contact" className="ap-help__cta-btn">
                Get in Touch →
              </a>
            </Reveal>
            <Reveal delay={1}>
              <p className="ap-help__topic-title">Track Your Order</p>
              <p className="ap-help__topic-text">
                Get real-time updates on your shipment from dispatch to doorstep. We ship worldwide with full tracking.
              </p>
              <a href="/orders" className="ap-help__topic-link">Track Now →</a>
            </Reveal>
            <Reveal delay={2}>
              <p className="ap-help__topic-title">Returns &amp; Refunds</p>
              <p className="ap-help__topic-text">
                Not in love? We offer a 30-day hassle-free return policy. Your satisfaction is our top priority.
              </p>
              <a href="/returns" className="ap-help__topic-link">Learn More →</a>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SECTION 11 — FOOTER
   ══════════════════════════════════════════════════════ */
const FOOTER_LINKS = {
  "Useful Links": ["About Us", "Contact Us", "Best Deals", "FAQs"],
  "Categories":   ["Bath & Body", "Skin Care", "Hair Care", "Face Wash & Packs", "Body Care & Elixirs"],
  "Contact Us":   ["60 Fifth Avenue, New York, NY 10011", "1(800) 246-1898", "hello@beautyatelier.com"],
};

function FooterSection({ loading }) {
  const [email, setEmail] = useState("");
  if (loading) return null;
  return (
    <footer className="ap-footer">
      <div className="ap-inner">
        <div className="ap-footer__top">
          {/* Brand */}
          <div>
            <p className="ap-footer__brand-name">Beauty<span>Atelier</span></p>
            <p className="ap-footer__brand-tag">Natural Beauty Store</p>
            <p className="ap-footer__brand-desc">
              Handcrafted beauty rooted in nature. Every product is made with love, transparency, and ingredients you can trust.
            </p>
            <div className="ap-footer__socials">
              {["𝕏","f","▶","📷","in"].map(s => (
                <a key={s} href="#" className="ap-footer__social-btn" aria-label="Social link">{s}</a>
              ))}
            </div>
          </div>
          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([col, links]) => (
            <div key={col}>
              <p className="ap-footer__col-title">{col}</p>
              <ul className="ap-footer__col-links">
                {links.map(l => <li key={l}><a href="#" className="ap-footer__col-link">{l}</a></li>)}
              </ul>
            </div>
          ))}
          {/* Subscribe */}
          <div>
            <p className="ap-footer__col-title">Subscribe Now</p>
            <div className="ap-footer__sub-form">
              <input
                type="email"
                placeholder="Your email"
                className="ap-footer__sub-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                aria-label="Email address"
              />
              <button className="ap-footer__sub-btn" type="button">Join</button>
            </div>
          </div>
        </div>
        <div className="ap-footer__bottom">
          <p className="ap-footer__copy">© 2025 Beauty Atelier. All rights reserved.</p>
          <div className="ap-footer__legal">
            <a href="#" className="ap-footer__legal-link">Privacy Policy</a>
            <a href="#" className="ap-footer__legal-link">Terms of Service</a>
            <a href="#" className="ap-footer__legal-link">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════
   ROOT — AboutPage
   ══════════════════════════════════════════════════════ */
export default function AboutPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate page data fetch
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="ap-root">
        <div className="ap-hero--sk ap-sk" />
        <section className="ap-philosophy">
          <div className="ap-inner">
            <div className="ap-philosophy__sk">
              <Sk h={14} w={140} />
              <Sk h={48} />
              <Sk h={48} w="80%" />
              <Sk h={2} w={56} />
            </div>
          </div>
        </section>
        <section className="ap-story">
          <div className="ap-inner">
            <div className="ap-story__grid">
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Sk h={28} /><Sk h={28} w="85%" /><Sk h={28} w="70%" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Sk h={28} w="60%" /><Sk h={18} /><Sk h={18} /><Sk h={18} w="80%" />
                <div className="ap-story__product-img--sk ap-sk" />
              </div>
            </div>
          </div>
        </section>
        <section className="ap-pullquote">
          <div className="ap-inner"><Sk h={40} /><Sk h={40} w="75%" style={{ marginTop: 14 }} /></div>
        </section>
        <section className="ap-founder">
          <div className="ap-inner">
            <div className="ap-founder__grid" style={{ borderRadius: 28, overflow: "hidden" }}>
              <Sk h={480} style={{ borderRadius: 0 }} />
              <Sk h={480} style={{ borderRadius: 0 }} />
            </div>
          </div>
        </section>
        <section className="ap-values">
          <div className="ap-inner">
            <div className="ap-values__layout">
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Sk h={12} w={120} /><Sk h={18} /><Sk h={18} />
              </div>
              <div className="ap-values__grid">
                {[...Array(4)].map((_, i) => <Sk key={i} h={130} style={{ borderRadius: 20 }} />)}
              </div>
            </div>
          </div>
        </section>
        <div className="ap-immersive--sk ap-sk" />
        <section className="ap-stats">
          <div className="ap-inner">
            <div className="ap-stats__grid">
              {[...Array(4)].map((_, i) => <Sk key={i} h={150} style={{ borderRadius: 0 }} />)}
            </div>
          </div>
        </section>
        <section className="ap-press">
          <div className="ap-inner">
            <Sk h={12} w={160} style={{ margin: "0 auto 44px" }} />
            <div className="ap-press__sk">
              {[...Array(8)].map((_, i) => <div key={i} className="ap-press__sk-item ap-sk" />)}
            </div>
          </div>
        </section>
        <section className="ap-help">
          <div className="ap-inner">
            <div className="ap-help__grid">
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <Sk h={32} /><Sk h={32} w="60%" />
                  <Sk h={40} w={120} style={{ borderRadius: 100, marginTop: 8 }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="ap-root">
      <HeroSection loading={false} />
      <PhilosophySection loading={false} />
      <StorySection loading={false} />
      <PullQuoteSection loading={false} />
      <FounderSection loading={false} />
      <ValuesSection loading={false} />
      <ImmersiveSection loading={false} />
      <StatsSection loading={false} />
      <PressSection loading={false} />
      <HelpSection loading={false} />
      <FooterSection loading={false} />
    </div>
  );
}