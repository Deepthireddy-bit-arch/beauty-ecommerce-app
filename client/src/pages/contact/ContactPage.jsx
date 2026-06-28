import React, { useState, useRef } from "react";
import "./ContactPage.css";

// ─── ICONS (inline SVG, no deps) ─────────────────────────────────────────────
const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3"/>
    <path d="M2 7l10 7 10-7"/>
  </svg>
);
const IconPhone = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.6 10.8a15.2 15.2 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.57.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1L6.6 10.8z"/>
  </svg>
);
const IconMap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>
);
const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
  </svg>
);
const IconChevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
);
const IconSend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
  </svg>
);
const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);
const IconStar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);
const IconInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
  </svg>
);
const IconTwitter = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const IconWhatsapp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// ─── DECORATIVE PETAL SVG ─────────────────────────────────────────────────────
const PetalDecor = () => (
  <svg className="cp-petal-svg" viewBox="0 0 420 520" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {/* Outer glow ring */}
    <circle cx="210" cy="260" r="195" stroke="#ede9fe" strokeWidth="1"/>
    <circle cx="210" cy="260" r="165" stroke="#ddd6fe" strokeWidth="0.5"/>
    {/* Petals */}
    {[0,45,90,135,180,225,270,315].map((angle, i) => (
      <g key={i} transform={`rotate(${angle} 210 260)`}>
        <ellipse cx="210" cy="130" rx="28" ry="70" fill={i % 2 === 0 ? "#ede9fe" : "#f5f3ff"} />
      </g>
    ))}
    {/* Inner circle */}
    <circle cx="210" cy="260" r="60" fill="#f5f3ff" />
    <circle cx="210" cy="260" r="40" fill="#ede9fe" />
    <circle cx="210" cy="260" r="22" fill="#ddd6fe" />
    {/* Scattered dots */}
    {[[80,100],[340,90],[60,400],[370,420],[200,60],[210,460]].map(([cx,cy],i) => (
      <circle key={i} cx={cx} cy={cy} r={i % 2 === 0 ? 4 : 2.5} fill="#c4b5fd" opacity="0.6" />
    ))}
    {/* Thin cross lines */}
    <line x1="210" y1="50" x2="210" y2="470" stroke="#ddd6fe" strokeWidth="0.5" strokeDasharray="3 8"/>
    <line x1="20" y1="260" x2="400" y2="260" stroke="#ddd6fe" strokeWidth="0.5" strokeDasharray="3 8"/>
  </svg>
);

// ─── CONTACT INFO CARD ────────────────────────────────────────────────────────
function InfoCard({ icon, title, lines, accent }) {
  return (
    <div className="cp-info-card">
      <div className="cp-info-icon" style={accent ? { background: "#7c3aed", color: "#fff" } : {}}>
        {icon}
      </div>
      <div className="cp-info-text">
        <h3 className="cp-info-title">{title}</h3>
        {lines.map((line, i) =>
          typeof line === "string"
            ? <p key={i} className="cp-info-line">{line}</p>
            : <a key={i} href={line.href} className="cp-info-link">{line.label}</a>
        )}
      </div>
    </div>
  );
}

// ─── FAQ ITEM ─────────────────────────────────────────────────────────────────
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`cp-faq-item${open ? " open" : ""}`}>
      <button className="cp-faq-trigger" onClick={() => setOpen(o => !o)}>
        <span>{q}</span>
        <span className={`cp-faq-chevron${open ? " open" : ""}`}><IconChevron /></span>
      </button>
      <div className="cp-faq-body" style={{ maxHeight: open ? "200px" : "0" }}>
        <p className="cp-faq-answer">{a}</p>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ContactPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", subject: "", message: "", newsletter: false,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);

  const subjects = [
    "Order & Tracking", "Returns & Refunds", "Product Inquiry",
    "Brand Partnership", "Press & Media", "Something else",
  ];

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Your name is required";
    if (!form.email.trim()) e.email = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.subject) e.subject = "Please select a topic";
    if (!form.message.trim()) e.message = "Tell us what's on your mind";
    else if (form.message.trim().length < 20) e.message = "A little more detail helps us help you";
    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1400));
    setSubmitting(false);
    setSubmitted(true);
  };

  const faqs = [
    { q: "How long does delivery take?", a: "Standard delivery takes 3–5 business days. Express delivery (1–2 days) is available at checkout for most pin codes." },
    { q: "What is your return policy?", a: "We accept returns within 30 days of delivery for unopened products. Used or opened products can be returned only if they are defective." },
    { q: "Do you ship internationally?", a: "Currently we ship within India only. International shipping is on our roadmap — sign up for updates below." },
    { q: "How can I track my order?", a: "Once shipped, you'll receive a tracking link via email and SMS. You can also track from your ShopHub account under My Orders." },
    { q: "Are all products authentic?", a: "Absolutely. Beauty Atelier sources directly from brands and authorised distributors. Every product is 100% authentic and sealed." },
  ];

  return (
    <div className="cp-page">

      {/* ── HERO ── */}
      <section className="cp-hero">
        <div className="cp-hero-left">
          <span className="cp-eyebrow">
            <span className="cp-eyebrow-rule" />
            Beauty Atelier · Contact
          </span>
          <h1 className="cp-hero-heading">
            We'd love<br />
            to <em>hear</em><br />
            from you.
          </h1>
          <p className="cp-hero-sub">
            Whether it's a question about an order, a product you can't find,
            or just a beauty chat — our team is here for all of it.
          </p>
          <div className="cp-hero-badges">
            <span className="cp-badge"><IconCheck />&nbsp;Replies within 24h</span>
            <span className="cp-badge"><IconCheck />&nbsp;Mon – Sat, 9am – 7pm</span>
          </div>
          <div className="cp-hero-socials">
            <span className="cp-socials-label">Follow us</span>
            <a href="#instagram" className="cp-social-btn" aria-label="Instagram"><IconInstagram /></a>
            <a href="#twitter" className="cp-social-btn" aria-label="Twitter / X"><IconTwitter /></a>
            <a href="#whatsapp" className="cp-social-btn" aria-label="WhatsApp"><IconWhatsapp /></a>
          </div>
        </div>
        <div className="cp-hero-right">
          <PetalDecor />
          <div className="cp-hero-stat-cards">
            <div className="cp-stat-card">
              <span className="cp-stat-num">4.9</span>
              <span className="cp-stat-stars">{[1,2,3,4,5].map(i => <IconStar key={i} />)}</span>
              <span className="cp-stat-label">Customer rating</span>
            </div>
            <div className="cp-stat-card cp-stat-card--accent">
              <span className="cp-stat-num">2 min</span>
              <span className="cp-stat-label">Avg. response on WhatsApp</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── INFO CARDS ── */}
      <section className="cp-info-section">
        <InfoCard
          accent
          icon={<IconMail />}
          title="Email us"
          lines={[
            { href: "mailto:hello@shophub.in", label: "hello@shophub.in" },
            { href: "mailto:support@shophub.in", label: "support@shophub.in" },
          ]}
        />
        <InfoCard
          icon={<IconPhone />}
          title="Call or WhatsApp"
          lines={[
            { href: "tel:+918001234567", label: "+91 800 123 4567" },
            "Mon – Sat · 9am to 7pm IST",
          ]}
        />
        <InfoCard
          icon={<IconMap />}
          title="Visit us"
          lines={[
            "Beauty Atelier Studio",
            "12 Lavelle Road, Bengaluru",
            "Karnataka – 560001",
          ]}
        />
        <InfoCard
          icon={<IconClock />}
          title="Working hours"
          lines={[
            "Monday – Friday: 9am – 7pm",
            "Saturday: 10am – 5pm",
            "Sunday: Closed",
          ]}
        />
      </section>

      {/* ── FORM + SIDEBAR ── */}
      <section className="cp-form-section">

        {/* Sidebar */}
        <aside className="cp-form-sidebar">
          <div className="cp-sidebar-block">
            <span className="cp-sidebar-eyebrow">Why reach out?</span>
            <ul className="cp-sidebar-list">
              {[
                "Order status & tracking",
                "Returns & exchanges",
                "Shade matching help",
                "Bulk & gifting orders",
                "Brand collaboration",
                "Press & media queries",
              ].map((item, i) => (
                <li key={i} className="cp-sidebar-item">
                  <span className="cp-sidebar-dot" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="cp-sidebar-block cp-sidebar-promise">
            <div className="cp-promise-icon"><IconCheck /></div>
            <p className="cp-promise-text">
              Every message is read by a real person from our beauty team — not a bot.
            </p>
          </div>

          <div className="cp-sidebar-block">
            <span className="cp-sidebar-eyebrow">Quick links</span>
            <div className="cp-quicklinks">
              {["Track my order", "Start a return", "Find a product", "Size guide"].map((l, i) => (
                <a key={i} href="#" className="cp-quicklink">
                  {l} <IconChevron />
                </a>
              ))}
            </div>
          </div>
        </aside>

        {/* Form */}
        <div className="cp-form-wrap">
          {submitted ? (
            <div className="cp-success">
              <div className="cp-success-icon">
                <IconCheck />
              </div>
              <h2 className="cp-success-heading">Message sent!</h2>
              <p className="cp-success-sub">
                Thank you, {form.name.split(" ")[0]}. We'll get back to you at{" "}
                <strong>{form.email}</strong> within 24 hours.
              </p>
              <button className="cp-success-reset" onClick={() => { setSubmitted(false); setForm({ name:"",email:"",phone:"",subject:"",message:"",newsletter:false }); }}>
                Send another message
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} noValidate className="cp-form">
              <div className="cp-form-header">
                <h2 className="cp-form-title">Send us a message</h2>
                <p className="cp-form-desc">Fill in the details below and we'll be in touch shortly.</p>
              </div>

              <div className="cp-form-row">
                <div className={`cp-field${errors.name ? " error" : ""}`}>
                  <label className="cp-label" htmlFor="cp-name">Full name <span className="cp-req">*</span></label>
                  <input
                    id="cp-name" name="name" type="text"
                    className="cp-input" placeholder="Your name"
                    value={form.name} onChange={handleChange}
                  />
                  {errors.name && <span className="cp-error">{errors.name}</span>}
                </div>
                <div className={`cp-field${errors.email ? " error" : ""}`}>
                  <label className="cp-label" htmlFor="cp-email">Email address <span className="cp-req">*</span></label>
                  <input
                    id="cp-email" name="email" type="email"
                    className="cp-input" placeholder="you@example.com"
                    value={form.email} onChange={handleChange}
                  />
                  {errors.email && <span className="cp-error">{errors.email}</span>}
                </div>
              </div>

              <div className="cp-form-row">
                <div className="cp-field">
                  <label className="cp-label" htmlFor="cp-phone">Phone (optional)</label>
                  <input
                    id="cp-phone" name="phone" type="tel"
                    className="cp-input" placeholder="+91 9876543210"
                    value={form.phone} onChange={handleChange}
                  />
                </div>
                <div className={`cp-field${errors.subject ? " error" : ""}`}>
                  <label className="cp-label" htmlFor="cp-subject">Topic <span className="cp-req">*</span></label>
                  <div className="cp-select-wrap">
                    <select
                      id="cp-subject" name="subject"
                      className="cp-select"
                      value={form.subject} onChange={handleChange}
                    >
                      <option value="">Select a topic…</option>
                      {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <span className="cp-select-arrow"><IconChevron /></span>
                  </div>
                  {errors.subject && <span className="cp-error">{errors.subject}</span>}
                </div>
              </div>

              <div className={`cp-field${errors.message ? " error" : ""}`}>
                <label className="cp-label" htmlFor="cp-message">Your message <span className="cp-req">*</span></label>
                <textarea
                  id="cp-message" name="message"
                  className="cp-textarea" rows={5}
                  placeholder="Tell us how we can help…"
                  value={form.message} onChange={handleChange}
                />
                <div className="cp-textarea-footer">
                  {errors.message
                    ? <span className="cp-error">{errors.message}</span>
                    : <span />
                  }
                  <span className="cp-char-count">{form.message.length} chars</span>
                </div>
              </div>

              <label className="cp-checkbox-row">
                <input
                  type="checkbox" name="newsletter"
                  className="cp-checkbox-input"
                  checked={form.newsletter} onChange={handleChange}
                />
                <span className="cp-checkbox-box">
                  {form.newsletter && <IconCheck />}
                </span>
                <span className="cp-checkbox-label">
                  Subscribe to our newsletter for beauty tips and exclusive offers
                </span>
              </label>

              <button type="submit" className="cp-submit-btn" disabled={submitting}>
                {submitting ? (
                  <span className="cp-spinner" />
                ) : (
                  <><IconSend />&nbsp; Send message</>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="cp-faq-section">
        <div className="cp-faq-inner">
          <div className="cp-faq-header">
            <span className="cp-eyebrow">
              <span className="cp-eyebrow-rule" />
              FAQ
            </span>
            <h2 className="cp-faq-title">Quick answers</h2>
          </div>
          <div className="cp-faq-list">
            {faqs.map((faq, i) => <FaqItem key={i} {...faq} />)}
          </div>
        </div>
      </section>

      {/* ── MAP STRIP ── */}
      <section className="cp-map-section">
        <div className="cp-map-overlay">
          <div className="cp-map-card">
            <span className="cp-map-icon"><IconMap /></span>
            <div>
              <h3 className="cp-map-heading">Beauty Atelier Studio</h3>
              <p className="cp-map-addr">12 Lavelle Road, Bengaluru, Karnataka 560001</p>
            </div>
            <a
              href="https://maps.google.com/?q=Lavelle+Road+Bengaluru"
              target="_blank" rel="noreferrer"
              className="cp-map-btn"
            >
              Get directions <IconChevron />
            </a>
          </div>
        </div>
        {/* Decorative map grid — CSS only */}
        <div className="cp-map-bg" aria-hidden="true">
          <div className="cp-map-grid" />
          <div className="cp-map-pin">
            <div className="cp-pin-dot" />
            <div className="cp-pin-pulse" />
          </div>
        </div>
      </section>

    </div>
  );
}