import { useNavigate } from "react-router-dom";

import "./NotFoundPage.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/footer/Footer";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <main className="nf-root">
        <div className="nf-deco nf-deco--tl">✦</div>
        <div className="nf-deco nf-deco--br">✦</div>

        <div className="nf-content">
          <span className="nf-pill">✦ Page not found</span>

          <h1 className="nf-num">
            4<span>0</span>4
          </h1>

          <h2 className="nf-title">Lost in the Beauty Aisle</h2>

          <p className="nf-sub">
            The page you're looking for seems to have wandered off.
            Let's get you back to something beautiful.
          </p>

          <div className="nf-btns">
            <button className="nf-btn-primary" onClick={() => navigate("/")}>
              Back to Home →
            </button>
            <button className="nf-btn-outline" onClick={() => navigate("/products")}>
              Browse Products
            </button>
          </div>

          <div className="nf-quick-links">
            {[
              { label: "Skincare",    to: "/products?category=skincare"  },
              { label: "Makeup",      to: "/products?category=makeup"    },
              { label: "Brands",      to: "/brands"                      },
              { label: "Collections", to: "/collections"                 },
              { label: "Contact Us",  to: "/contact"                     },
            ].map(({ label, to }) => (
              <button key={label} className="nf-ql" onClick={() => navigate(to)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default NotFoundPage;