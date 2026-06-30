import React, { useState, useRef } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ChevronRight,
  Send,
  Check,
  Star,
  X,
  MessageCircle,
} from "lucide-react";
import "./ContactPage.css";

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
        <span className={`cp-faq-chevron${open ? " open" : ""}`}>
          <ChevronRight size={14} strokeWidth={2.5} />
        </span>
      </button>
      <div className="cp-faq-body" style={{ maxHeight: open ? "200px" : "0" }}>
        <p className="cp-faq-answer">{a}</p>
      </div>
    </div>
  );
}

// ─── CUSTOM INSTAGRAM ICON ────────────────────────────────────────────────────
const InstagramIcon = ({ size = 18, strokeWidth = 1.8 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

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

      {/* ── FORM + SIDEBAR ── */}
      <section className="cp-form-section">

        {/* Form */}
        <div className="cp-form-wrap">
          {submitted ? (
            <div className="cp-success">
              <div className="cp-success-icon">
                <Check size={28} strokeWidth={2.5} />
              </div>
              <h2 className="cp-success-heading">Message sent!</h2>
              <p className="cp-success-sub">
                Thank you, {form.name.split(" ")[0]}. We'll get back to you at{" "}
                <strong>{form.email}</strong> within 24 hours.
              </p>
              <button
                className="cp-success-reset"
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name:"", email:"", phone:"", subject:"", message:"", newsletter:false });
                }}
              >
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
                    <span className="cp-select-arrow">
                      <ChevronRight size={14} strokeWidth={2.5} />
                    </span>
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
                  {form.newsletter && <Check size={11} strokeWidth={2.5} />}
                </span>
                <span className="cp-checkbox-label">
                  Subscribe to our newsletter for beauty tips and exclusive offers
                </span>
              </label>

              <button type="submit" className="cp-submit-btn" disabled={submitting}>
                {submitting ? (
                  <span className="cp-spinner" />
                ) : (
                  <><Send size={16} strokeWidth={2} />&nbsp; Send message</>
                )}
              </button>
            </form>
          )}
        </div>

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
            <div className="cp-promise-icon">
              <Check size={16} strokeWidth={2.5} />
            </div>
            <p className="cp-promise-text">
              Every message is read by a real person from our beauty team — not a bot.
            </p>
          </div>

          <div className="cp-sidebar-block">
            <span className="cp-sidebar-eyebrow">Quick links</span>
            <div className="cp-quicklinks">
              {["Track my order", "Start a return", "Find a product", "Size guide"].map((l, i) => (
                <a key={i} href="#" className="cp-quicklink">
                  {l} <ChevronRight size={14} strokeWidth={2.5} />
                </a>
              ))}
            </div>
          </div>
        </aside>

      </section>

      {/* ── INFO CARDS ── */}
      <section className="cp-info-section">
        <InfoCard
          icon={<Phone size={20} strokeWidth={1.8} />}
          title="Call or WhatsApp"
          lines={[
            { href: "tel:+918001234567", label: "+91 800 123 4567" },
            "Mon – Sat · 9am to 7pm IST",
          ]}
        />
        <InfoCard
          icon={<MapPin size={20} strokeWidth={1.8} />}
          title="Visit us"
          lines={[
            "Beauty Atelier Studio",
            "12 Lavelle Road, Bengaluru",
            "Karnataka – 560001",
          ]}
        />
        <InfoCard
          icon={<Clock size={20} strokeWidth={1.8} />}
          title="Working hours"
          lines={[
            "Monday – Friday: 9am – 7pm",
            "Saturday: 10am – 5pm",
            "Sunday: Closed",
          ]}
        />
        <InfoCard
          accent
          icon={<Mail size={20} strokeWidth={1.8} />}
          title="Email us"
          lines={[
            { href: "mailto:hello@shophub.in", label: "hello@shophub.in" },
            { href: "mailto:support@shophub.in", label: "support@shophub.in" },
          ]}
        />
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

    </div>
  );
}