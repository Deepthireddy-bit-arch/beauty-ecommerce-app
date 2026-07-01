import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './footer.css';

const SOCIAL_ICONS = [
  { icon: "📸", label: "Instagram" },
  { icon: "🐦", label: "Twitter"   },
  { icon: "📌", label: "Pinterest" },
  { icon: "▶️", label: "YouTube"   },
];

const LINKS = [
  {
    title: "Shop",
    links: [
      { label: "Nails",  to: "/products?category=nails"              },
      { label: "Fragrances",   to: "/products?category=Fragrances"       },
      { label: "Skincare",      to: "/products?category=skincare"     },
      { label: "Makeup",        to: "/products?category=makeup"       },
      { label: "Brands",        to: "/brands"                         },
      { label: "Collections",   to: "/collections"                    },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Track Order",   to: "/orders"   },
      { label: "My Cart",       to: "/cart"     },
      { label: "Wishlist",      to: "/wishlist" },
     
      { label: "Contact Us",    to: "/contact"  },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us",      to: "/about"    },
      { label: "Search",        to: "/search"   },
    ],
  },
];

const Footer = () => {
  const [email, setEmail] = useState('');
  const [sent,  setSent]  = useState(false);

  const handleSub = (e) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setSent(true);
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="footer-root">
      <div className="footer-inner">

        {/* ── Main grid ── */}
        <div className="footer-grid">

          {/* Brand column */}
          <div className="footer-brand-col">
            <div className="footer-brand-logo">
              <div className="footer-logo-icon">S</div>
              <div>
                <div className="footer-logo-name">
                  Shop<span>Hub</span>
                </div>
                <div className="footer-logo-sub">Beauty Atelier</div>
              </div>
            </div>

            <p className="footer-tagline">
              Your ultimate destination for premium beauty &amp; skincare products,
              curated with love for every skin type.
            </p>

            {/* Socials */}
            <div className="footer-socials">
              {SOCIAL_ICONS.map(({ icon, label }) => (
                <button key={label} className="footer-social-btn" aria-label={label}>
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {LINKS.map(col => (
            <div key={col.title} className="footer-col">
              <h5 className="footer-col-title">{col.title}</h5>
              {col.links.map(({ label, to }) => (
                <Link key={label} to={to} className="footer-col-link">
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} ShopHub Beauty. All rights reserved.
          </p>

          <div className="footer-legal">
            {['Privacy', 'Terms', 'Cookies'].map(l => (
              <a key={l} href={`/${l.toLowerCase()}`} className="footer-legal-link">{l}</a>
            ))}
          </div>

          <button className="footer-top-btn" onClick={scrollTop} aria-label="Back to top">
            ↑
          </button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;