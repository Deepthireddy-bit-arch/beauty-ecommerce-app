import './footer.css';
const Footer = () => (
  <footer style={{ background: "var(--charcoal)", borderTop: "1px solid rgba(124,58,237,0.12)" }}>
    <div style={{ maxWidth: 1360, margin: "0 auto", padding: "76px 48px 36px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1fr", gap: 56 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "white", fontWeight: 700, fontFamily: "Cormorant Garamond,serif" }}>S</div>
            <div>
              <span style={{ fontFamily: "Cormorant Garamond,serif", fontWeight: 600, fontSize: 24, color: "white", letterSpacing: .5 }}>Shop<span style={{ color: "var(--purple)" }}>Hub</span></span>
              <div style={{ fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontWeight: 500 }}>Beauty Atelier</div>
            </div>
          </div>
          <p style={{ color: "rgba(255,255,255,0.32)", fontSize: 13.5, lineHeight: 1.9, maxWidth: 260 }}>Your ultimate destination for premium beauty & skincare products, curated with love for every skin type.</p>
          <div style={{ display: "flex", gap: 10, marginTop: 26 }}>
            {["📸", "🐦", "📌", "▶️"].map((icon, i) => (
              <button key={i} style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, cursor: "pointer", transition: "all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--purple)"; e.currentTarget.style.transform = "translateY(-3px)" }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(124,58,237,0.1)"; e.currentTarget.style.transform = "none" }}>{icon}</button>
            ))}
          </div>
        </div>
        {[
          { title: "Shop", links: ["New Arrivals", "Bestsellers", "Skincare", "Makeup", "Fragrance", "Tools"] },
          { title: "Help", links: ["Track Order", "Returns", "Shipping Info", "Size Guide", "FAQ"] },
          { title: "Company", links: ["About Us", "Careers", "Press", "Sustainability", "Affiliates"] },
        ].map(col => (
          <div key={col.title}>
            <h5 style={{ fontWeight: 700, fontSize: 9.5, marginBottom: 20, color: "var(--purple)", textTransform: "uppercase", letterSpacing: 2.5 }}>{col.title}</h5>
            {col.links.map(l => (
              <a key={l} href="#" style={{ display: "block", color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: 13.5, marginBottom: 12, transition: "color .2s" }}
                onMouseEnter={e => e.target.style.color = "var(--purple-2)"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.3)"}>{l}</a>
            ))}
          </div>
        ))}
      </div>
      <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(124,58,237,0.25),transparent)", margin: "52px 0 28px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.18)", fontSize: 12 }}>© 2025 ShopHub Beauty. All rights reserved.</p>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Cookies"].map(l => (
            <a key={l} href="#" style={{ color: "rgba(255,255,255,0.18)", fontSize: 12, textDecoration: "none", transition: "color .2s" }}
              onMouseEnter={e => e.target.style.color = "var(--purple-2)"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.18)"}>{l}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);
export default Footer;