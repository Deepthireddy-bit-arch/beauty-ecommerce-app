
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  getOrderById,
  cancelOrderAsync,
} from '../../redux/reducers/thunks/orderThunks';

// ─── Constants ───────────────────────────────────────────────────────────────

const CANCELLABLE = ['Pending', 'Processing'];

const STATUS_CFG = {
  Pending:    { icon: '⏳', accent: '#f59e0b', bg: '#fef9e7', border: '#fde68a', text: '#92400e' },
  Processing: { icon: '⚙️', accent: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af' },
  Shipped:    { icon: '🚚', accent: '#10b981', bg: '#ecfdf5', border: '#a7f3d0', text: '#065f46' },
  Delivered:  { icon: '✅', accent: '#059669', bg: '#f0fdf4', border: '#86efac', text: '#14532d' },
  Cancelled:  { icon: '✕',  accent: '#ef4444', bg: '#fff1f1', border: '#fca5a5', text: '#991b1b' },
};

const TRACKING_STEPS = [
  { key: 'Pending',    label: 'Order Placed', desc: 'We received your order',         icon: '🛍️' },
  { key: 'Processing', label: 'Confirmed',    desc: 'Seller confirmed your order',    icon: '✅' },
  { key: 'Shipped',    label: 'Shipped',      desc: 'Your order is on the way',       icon: '🚚' },
  { key: 'Delivered',  label: 'Delivered',    desc: 'Package delivered successfully', icon: '📦' },
];

const STATUS_TO_STEP = { Pending: 0, Processing: 1, Shipped: 2, Delivered: 3, Cancelled: -1 };

// ─── Shared Atoms ────────────────────────────────────────────────────────────

const StatusBadge = ({ status, large }) => {
  const cfg = STATUS_CFG[status] || STATUS_CFG.Pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      padding: large ? '0.35rem 0.95rem' : '0.25rem 0.7rem',
      borderRadius: 99, background: cfg.bg, color: cfg.text,
      border: `1.5px solid ${cfg.border}`,
      fontSize: large ? '0.82rem' : '0.72rem',
      fontWeight: 700, whiteSpace: 'nowrap', letterSpacing: '0.01em',
    }}>
      <span style={{ fontSize: '0.8em' }}>{cfg.icon}</span>
      {status}
    </span>
  );
};

const Eyebrow = ({ children, style = {} }) => (
  <p style={{
    fontSize: '0.63rem', fontWeight: 700, letterSpacing: '0.11em',
    textTransform: 'uppercase', color: '#7c3aed', margin: '0 0 0.75rem',
    ...style,
  }}>
    {children}
  </p>
);

const Skel = ({ w = '100%', h = 14, r = 6 }) => (
  <span style={{
    display: 'inline-block', width: w, height: h, borderRadius: r,
    background: 'linear-gradient(90deg,#ede9f8 25%,#f5f3fd 50%,#ede9f8 75%)',
    backgroundSize: '300% 100%',
    animation: 'od-shimmer 1.6s ease-in-out infinite',
  }} />
);

const ProductThumb = ({ src, alt, size = 60 }) => {
  const [loaded, setLoaded] = useState(false);
  const [error,  setError]  = useState(false);

  if (!src || error) {
    return (
      <div style={{
        width: size, height: size, borderRadius: 12, flexShrink: 0,
        background: '#ede9fe', color: '#7c3aed',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: size * 0.34,
      }}>
        {(alt || '?')[0].toUpperCase()}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {!loaded && (
        <span style={{
          position: 'absolute', inset: 0, borderRadius: 12,
          background: 'linear-gradient(90deg,#ede9f8 25%,#f5f3fd 50%,#ede9f8 75%)',
          backgroundSize: '300% 100%',
          animation: 'od-shimmer 1.6s ease-in-out infinite',
        }} />
      )}
      <img
        src={src} alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{
          width: size, height: size, borderRadius: 12,
          objectFit: 'cover', border: '1.5px solid #ede9fe',
          opacity: loaded ? 1 : 0, transition: 'opacity 0.2s', display: 'block',
        }}
      />
    </div>
  );
};

// ─── Order Tracker ────────────────────────────────────────────────────────────

const OrderTracker = ({ status }) => {
  const isCancelled = status === 'Cancelled';
  const activeStep  = STATUS_TO_STEP[status] ?? 0;
  const fillHeights = ['0%', '33.33%', '66.66%', '100%'];
  const fillH       = fillHeights[activeStep] || '0%';

  if (isCancelled) {
    return (
      <div>
        <Eyebrow>Order Tracking</Eyebrow>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          background: '#fff1f1', border: '1.5px solid #fca5a5',
          borderRadius: 12, padding: '0.85rem 1rem', color: '#991b1b',
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: '#fee2e2', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '0.95rem', fontWeight: 700,
            flexShrink: 0, color: '#dc2626',
          }}>✕</div>
          <div>
            <p style={{ fontWeight: 700, margin: '0 0 2px', color: '#991b1b', fontSize: '0.88rem' }}>
              Order Cancelled
            </p>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#b91c1c' }}>
              This order has been cancelled.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Eyebrow>Order Tracking</Eyebrow>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 16, top: 20, bottom: 20,
          width: 2, background: '#e5e7eb', borderRadius: 99, zIndex: 0,
        }} />
        <div style={{
          position: 'absolute', left: 16, top: 20,
          width: 2, borderRadius: 99, zIndex: 1,
          background: 'linear-gradient(180deg, #7c3aed, #5b21b6)',
          height: fillH, transition: 'height 0.6s ease',
          maxHeight: 'calc(100% - 40px)',
        }} />

        {TRACKING_STEPS.map((step, idx) => {
          const done    = idx <= activeStep;
          const current = idx === activeStep;

          return (
            <div key={step.key} style={{
              display: 'flex', alignItems: 'flex-start', gap: '0.85rem',
              position: 'relative', zIndex: 2,
              paddingBottom: idx < TRACKING_STEPS.length - 1 ? '1.25rem' : 0,
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem',
                background: done ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : '#f3f0ff',
                border: `2px solid ${done ? '#5b21b6' : '#e5e7eb'}`,
                filter: done ? 'none' : 'grayscale(0.5) opacity(0.55)',
                boxShadow: current ? '0 0 0 5px rgba(124,58,237,0.13)' : 'none',
                transition: 'all 0.3s ease',
              }}>
                {step.icon}
              </div>
              <div style={{ paddingTop: 5 }}>
                <p style={{
                  margin: '0 0 2px', fontSize: '0.82rem',
                  fontWeight: current ? 700 : done ? 600 : 400,
                  color: done ? '#3b1fa0' : '#9ca3af',
                  lineHeight: 1.3,
                }}>
                  {step.label}
                </p>
                {current && (
                  <p style={{
                    margin: 0, fontSize: '0.73rem',
                    color: '#9ca3af', lineHeight: 1.4,
                  }}>
                    {step.desc}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Cancel Modal ─────────────────────────────────────────────────────────────

const CancelModal = ({ order, onConfirm, onClose, busy }) => {
  if (!order) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(10,6,30,0.55)', backdropFilter: 'blur(5px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', animation: 'od-fade-in 0.18s ease',
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 20, maxWidth: 420, width: '100%',
        padding: '2rem 1.8rem 1.6rem', textAlign: 'center',
        boxShadow: '0 24px 80px rgba(108,60,225,0.18)',
        animation: 'od-slide-up 0.22s ease',
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: '#fff1f1', border: '2px solid #fca5a5',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem', color: '#dc2626', margin: '0 auto 1rem', fontWeight: 700,
        }}>✕</div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a1033', margin: '0 0 0.3rem' }}>
          Cancel this order?
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#9ca3af', margin: '0 0 0.9rem', fontFamily: 'monospace' }}>
          Order #{order._id.slice(-8).toUpperCase()}
        </p>
        <p style={{ fontSize: '0.87rem', color: '#4b4570', lineHeight: 1.6, margin: '0 0 1.4rem' }}>
          This action cannot be undone. Your payment refund (if applicable) will be processed within 5–7 business days.
        </p>
        <div style={{ display: 'flex', gap: '0.7rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="od-ghost-btn" onClick={onClose} disabled={busy} style={{ flex: '1 1 130px' }}>
            Keep Order
          </button>
          <button className="od-danger-btn" onClick={onConfirm} disabled={busy} style={{ flex: '1 1 130px' }}>
            {busy ? <><span className="od-spinner od-spinner--white" /> Cancelling…</> : 'Yes, Cancel Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Review Form ──────────────────────────────────────────────────────────────

const ReviewForm = ({ itemName, onClose }) => {
  const [rating,  setRating]  = useState(0);
  const [hover,   setHover]   = useState(0);
  const [comment, setComment] = useState('');
  const [busy,    setBusy]    = useState(false);

  const submit = async () => {
    if (!rating) { toast.error('Please select a star rating.'); return; }
    setBusy(true);
    await new Promise(r => setTimeout(r, 600));
    setBusy(false);
    toast.success('Review submitted — thanks!');
    onClose();
  };

  return (
    <div style={{
      background: '#faf8ff', border: '1px solid #e8e2f5',
      borderRadius: 12, padding: '0.95rem 1.1rem', marginTop: '0.5rem',
    }}>
      <p style={{ fontWeight: 700, fontSize: '0.83rem', marginBottom: '0.45rem', color: '#1a1033' }}>
        Reviewing: <span style={{ color: '#7c3aed' }}>{itemName}</span>
      </p>
      <div style={{ display: 'flex', gap: 3, marginBottom: '0.55rem' }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '1.45rem', padding: 1,
              color: (hover || rating) >= n ? '#f59e0b' : '#d1d5db',
              transition: 'color 0.15s',
            }}>★</button>
        ))}
      </div>
      <textarea rows={3} placeholder="Share your experience…"
        value={comment} onChange={e => setComment(e.target.value)}
        style={{
          resize: 'vertical', marginBottom: '0.55rem', width: '100%', boxSizing: 'border-box',
          padding: '0.5rem 0.7rem', borderRadius: 8, border: '1.5px solid #e8e2f5',
          fontFamily: 'inherit', fontSize: '0.84rem', color: '#1a1033',
          outline: 'none', transition: 'border-color 0.18s', background: '#fff',
        }}
        onFocus={e => { e.target.style.borderColor = '#7c3aed'; }}
        onBlur={e  => { e.target.style.borderColor = '#e8e2f5'; }}
      />
      <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' }}>
        <button className="od-primary-btn" disabled={busy} onClick={submit} style={{ flex: '1 1 130px' }}>
          {busy ? 'Submitting…' : '★ Submit Review'}
        </button>
        <button className="od-ghost-btn" onClick={onClose} disabled={busy} style={{ flex: '1 1 80px' }}>
          Cancel
        </button>
      </div>
    </div>
  );
};

// ─── Invoice PDF ──────────────────────────────────────────────────────────────

const loadJsPDF = () => new Promise((resolve, reject) => {
  if (window.jspdf?.jsPDF) { resolve(window.jspdf.jsPDF); return; }
  const s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  s.onload = () => resolve(window.jspdf.jsPDF);
  s.onerror = reject;
  document.head.appendChild(s);
});

const fmt = n => `Rs.${Number(n || 0).toLocaleString('en-IN')}`;

const downloadInvoicePDF = async (order) => {
  let jsPDF;
  try   { jsPDF = await loadJsPDF(); }
  catch { fallbackInvoice(order); return; }

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const PW = doc.internal.pageSize.getWidth();
  const ML = 48, MR = 48, CW = PW - ML - MR;
  let y = 0;

  doc.setFillColor(108, 60, 225);
  doc.rect(0, 0, PW, 72, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(22);
  doc.text('ShopHub', ML, 32);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
  doc.setTextColor(220, 210, 255);
  doc.text('Beauty Atelier', ML, 46);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('INVOICE', PW - MR, 44, { align: 'right' });
  y = 92;

  const colW = CW / 4;
  const metaLabels = ['ORDER NUMBER', 'DATE', 'PAYMENT', 'STATUS'];
  const metaVals = [
    `#${order._id}`,
    new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    order.paymentMethod || '--',
    order.orderStatus || '--',
  ];

  doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); doc.setTextColor(140, 130, 180);
  metaLabels.forEach((lbl, i) => doc.text(lbl, ML + i * colW, y));
  y += 13;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(80, 60, 140);
  metaVals.forEach((val, i) => {
    const lines = doc.splitTextToSize(val, colW - 6);
    doc.text(lines, ML + i * colW, y);
  });
  y += 24;

  doc.setDrawColor(220, 210, 255); doc.setLineWidth(0.5);
  doc.line(ML, y, PW - MR, y); y += 18;

  const addr = order.shippingAddress;
  if (addr) {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); doc.setTextColor(140, 130, 180);
    doc.text('SHIP TO', ML, y); y += 12;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(60, 50, 100);
    [addr.address, `${addr.city}, ${addr.state} - ${addr.pincode}`, addr.phone ? `Phone: ${addr.phone}` : null]
      .filter(Boolean)
      .forEach(line => { const w = doc.splitTextToSize(line, CW * 0.6); doc.text(w, ML, y); y += w.length * 12; });
    y += 6;
  }

  doc.setDrawColor(220, 210, 255); doc.line(ML, y, PW - MR, y); y += 20;

  const C_ITEM = ML + 4, C_QTY = ML + CW * 0.62, C_PRICE = ML + CW * 0.76, C_SUB = PW - MR - 4;

  doc.setFillColor(245, 242, 255);
  doc.rect(ML, y - 5, CW, 22, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(108, 60, 225);
  doc.text('ITEM', C_ITEM, y + 9);
  doc.text('QTY', C_QTY, y + 9, { align: 'center' });
  doc.text('PRICE', C_PRICE, y + 9, { align: 'right' });
  doc.text('SUBTOTAL', C_SUB, y + 9, { align: 'right' });
  y += 26;

  (order.orderItems || []).forEach((item, idx) => {
    const rowH = 20;
    if (idx % 2 === 0) { doc.setFillColor(252, 251, 255); doc.rect(ML, y - 4, CW, rowH, 'F'); }
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(30, 20, 60);
    const name = (item.name || '').length > 42 ? item.name.slice(0, 39) + '...' : (item.name || '');
    doc.text(name, C_ITEM, y + 7);
    doc.setTextColor(90, 70, 140);
    doc.text(String(item.qty || 0), C_QTY, y + 7, { align: 'center' });
    doc.text(fmt(item.price), C_PRICE, y + 7, { align: 'right' });
    doc.text(fmt((item.price || 0) * (item.qty || 0)), C_SUB, y + 7, { align: 'right' });
    y += rowH;
  });

  y += 6;
  doc.setDrawColor(200, 185, 240); doc.line(ML, y, PW - MR, y); y += 12;
  doc.setFillColor(108, 60, 225);
  doc.roundedRect(ML, y, CW, 30, 4, 4, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(255, 255, 255);
  doc.text('TOTAL PAID', ML + CW * 0.5, y + 20, { align: 'center' });
  doc.text(fmt(order.totalPrice), C_SUB, y + 20, { align: 'right' });
  y += 66;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(180, 165, 220);
  doc.text('Thank you for shopping with ShopHub Beauty Atelier.', PW / 2, y, { align: 'center' });
  doc.text('For queries: support@shophub.in', PW / 2, y + 13, { align: 'center' });

  doc.save(`ShopHub_Invoice_${order._id.slice(-8).toUpperCase()}.pdf`);
  toast.success('Invoice downloaded!');
};

const fallbackInvoice = (order) => {
  const addr = order.shippingAddress;
  const rows = (order.orderItems || []).map(item => `
    <tr>
      <td>${item.name || ''}</td><td style="text-align:center">${item.qty}</td>
      <td style="text-align:right">Rs.${(item.price || 0).toLocaleString()}</td>
      <td style="text-align:right">Rs.${((item.price || 0) * (item.qty || 0)).toLocaleString()}</td>
    </tr>`).join('');
  const win = window.open('', '_blank');
  if (!win) { toast.error('Allow pop-ups to download invoice.'); return; }
  win.document.write(`<!DOCTYPE html><html><head><title>Invoice</title>
  <style>body{font-family:Arial,sans-serif;padding:40px;max-width:720px;margin:0 auto}
  .hdr{background:#6c3ce1;color:#fff;padding:20px 24px;display:flex;justify-content:space-between;align-items:center;margin:-40px -40px 30px}
  .meta{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
  .mc label{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#9b92b8;margin-bottom:3px}
  .mc p{margin:0;font-size:13px;color:#4c3a8a;font-weight:600}
  table{width:100%;border-collapse:collapse;margin-top:16px}
  th{background:#f5f2ff;color:#6c3ce1;text-align:left;padding:9px 8px;font-size:11px;border-bottom:2px solid #6c3ce1}
  td{padding:8px;font-size:13px;border-bottom:1px solid #e4dff7}
  .tr{background:#6c3ce1}.tr td{color:#fff;font-weight:700;border:none;padding:10px 8px}
  .footer{text-align:center;margin-top:28px;font-size:11px;color:#b0a0d0}</style>
  </head><body>
  <div class="hdr"><div><h2 style="margin:0">ShopHub</h2><small>Beauty Atelier</small></div><div style="font-size:18px;font-weight:700">INVOICE</div></div>
  <div class="meta">
    <div class="mc"><label>Order</label><p>#${order._id}</p></div>
    <div class="mc"><label>Date</label><p>${new Date(order.createdAt).toLocaleDateString('en-IN')}</p></div>
    <div class="mc"><label>Payment</label><p>${order.paymentMethod || '--'}</p></div>
    <div class="mc"><label>Status</label><p>${order.orderStatus || '--'}</p></div>
  </div>
  ${addr ? `<p style="font-size:12px;color:#6b5fa0"><strong>Ship to:</strong> ${addr.address}, ${addr.city}, ${addr.state} - ${addr.pincode}${addr.phone ? ' | ' + addr.phone : ''}</p>` : ''}
  <table><thead><tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Subtotal</th></tr></thead>
  <tbody>${rows}<tr class="tr"><td colspan="3" style="text-align:right">TOTAL PAID</td><td style="text-align:right">Rs.${(order.totalPrice || 0).toLocaleString()}</td></tr></tbody></table>
  <div class="footer"><p>Thank you for shopping with ShopHub Beauty Atelier.</p><p>support@shophub.in</p></div>
  </body></html>`);
  win.document.close();
  setTimeout(() => win.print(), 300);
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const DetailSkeleton = () => (
  <div className="od-container">
    <div className="od-grid">
      <div className="od-card od-card--left">
        <div style={{ height: 5, background: '#ede9fe' }} />
        <div style={{ padding: '1.5rem 1.6rem 1.2rem', borderBottom: '1px solid #f0ebfc', background: '#faf8ff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Skel w={50} h={9} /><Skel w={190} h={19} /><Skel w={120} h={10} />
            </div>
            <Skel w={82} h={24} r={99} />
          </div>
        </div>
        <div style={{ padding: '1.4rem 1.6rem' }}>
          <Skel w={80} h={9} style={{ marginBottom: 16 }} />
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < 3 ? '1.25rem' : 0 }}>
              <Skel w={34} h={34} r={999} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, paddingTop: 4 }}>
                <Skel w={70} h={12} /><Skel w={100} h={10} />
              </div>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #f0ebfc', margin: '1.4rem 0', paddingTop: '1.4rem' }}>
            <Skel w={80} h={9} style={{ marginBottom: 12 }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              {[0, 1, 2, 3].map(i => <Skel key={i} h={58} r={12} />)}
            </div>
          </div>
          <div style={{ borderTop: '1px solid #f0ebfc', paddingTop: '1.4rem' }}>
            <Skel w={110} h={9} style={{ marginBottom: 12 }} />
            <Skel h={70} r={12} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: '1.4rem' }}>
            <Skel h={38} r={8} /><Skel h={38} r={8} />
          </div>
        </div>
      </div>

      <div className="od-card od-card--right">
        <div style={{ padding: '1.4rem 1.6rem 0.6rem', borderBottom: '1px solid #f0ebfc', background: '#faf8ff' }}>
          <Skel w={60} h={9} />
        </div>
        <div style={{ padding: '0 1.6rem' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ display: 'flex', gap: '0.85rem', padding: '1rem 0', borderBottom: '1px solid #f5f3fc' }}>
              <Skel w={60} h={60} r={12} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 3 }}>
                <Skel w="60%" h={13} /><Skel w="35%" h={11} />
              </div>
              <Skel w={55} h={14} style={{ marginTop: 4 }} />
            </div>
          ))}
        </div>
        <div style={{ padding: '1rem 1.6rem 1.4rem', display: 'flex', justifyContent: 'flex-end' }}>
          <Skel w={180} h={46} r={12} />
        </div>
      </div>
    </div>
  </div>
);

// ─── LEFT PANEL ───────────────────────────────────────────────────────────────

const LeftPanel = ({ order, canCancel, cancelling, onCancelClick, onDownloadInvoice }) => {
  const statusCfg = STATUS_CFG[order.orderStatus] || STATUS_CFG.Pending;

  return (
    <div className="od-card od-card--left">
      <div style={{ height: 5, background: statusCfg.accent }} />

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        flexWrap: 'wrap', gap: '0.7rem',
        padding: '1.4rem 1.6rem 1.2rem',
        borderBottom: '1px solid #f0ebfc', background: '#faf8ff',
      }}>
        <div>
          <p style={{
            fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.11em',
            textTransform: 'uppercase', color: '#7c3aed', margin: '0 0 4px',
          }}>Order Details</p>
          <h2 style={{
            fontSize: '1rem', fontWeight: 700, margin: '0 0 2px',
            fontFamily: 'monospace', letterSpacing: '0.04em', color: '#1a1033',
          }}>
            #{order._id.slice(-12).toUpperCase()}
          </h2>
          <p style={{ fontSize: '0.68rem', color: '#b0a7cc', margin: 0, fontFamily: 'monospace' }}>
            {order._id}
          </p>
        </div>
        <StatusBadge status={order.orderStatus} large />
      </div>

      <div style={{ padding: '1.4rem 1.6rem' }}>
        {/* Order Tracker */}
        <OrderTracker status={order.orderStatus} />

        {/* Divider */}
        <hr style={{ border: 'none', borderTop: '1px solid #f0ebfc', margin: '1.2rem 0' }} />

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1.2rem' }}>
          <button
            className="od-outline-btn"
            onClick={onDownloadInvoice}
            style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
          >
            ⬇ Download Invoice
          </button>
          {canCancel && (
            <button
              className="od-danger-outline-btn"
              onClick={onCancelClick}
              disabled={cancelling}
              style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            >
              {cancelling
                ? <><span className="od-spinner" /> Cancelling…</>
                : <>✕ Cancel Order</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── RIGHT PANEL ──────────────────────────────────────────────────────────────

const RightPanel = ({ order, isDelivered }) => {
  const [reviewIdx, setReviewIdx] = useState(null);
  const navigate = useNavigate();

  // Helper function to get product ID
  const getProductId = (item) => {
    return item.product || item.productId || item._id || item.id || null;
  };

  return (
    <div className="od-card od-card--right">
      <div style={{
        padding: '1.2rem 1.6rem 1rem',
        borderBottom: '1px solid #f0ebfc', background: '#faf8ff',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Eyebrow style={{ margin: 0 }}>
          Items ({order.orderItems?.length || 0})
        </Eyebrow>
        <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
          {order.orderItems?.reduce((s, i) => s + (i.qty || 0), 0)} units
        </span>
      </div>

      <div style={{ padding: '0 1.6rem' }}>
        {order.orderItems?.map((item, i) => {
          const productId = getProductId(item);
          const hasValidId = productId !== null;

          return (
            <div key={i}>
              <div 
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '1rem',
                  padding: '1rem 0',
                  borderBottom: i < order.orderItems.length - 1 ? '1px solid #f5f3fc' : 'none',
                  cursor: hasValidId ? 'pointer' : 'default',
                  transition: 'background 0.15s',
                }}
                onClick={() => {
                  if (hasValidId) {
                    navigate(`/product/${productId}`);
                  }
                }}
                onMouseEnter={(e) => {
                  if (hasValidId) {
                    e.currentTarget.style.background = '#faf8ff';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <ProductThumb src={item.image} alt={item.name} size={60} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: '0.88rem', fontWeight: 600, color: '#1a1033',
                    margin: '0 0 3px', overflow: 'hidden',
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {item.name}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '0 0 3px' }}>
                    Qty: {item.qty} × ₹{item.price?.toLocaleString()}
                  </p>
                  {isDelivered && reviewIdx !== i && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setReviewIdx(i); }}
                      style={{
                        background: 'none', border: 'none',
                        color: '#7c3aed', fontSize: '0.74rem', fontWeight: 600,
                        cursor: 'pointer', padding: '1px 0',
                        textDecoration: 'underline', textUnderlineOffset: '2px',
                      }}
                    >
                      ★ Write a review
                    </button>
                  )}
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: '0.92rem', fontWeight: 700, color: '#5b21b6', margin: 0 }}>
                    ₹{((item.price || 0) * (item.qty || 0)).toLocaleString()}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: '#b0a7cc', margin: '2px 0 0' }}>
                    ₹{item.price?.toLocaleString()} each
                  </p>
                </div>
              </div>

              {reviewIdx === i && (
                <ReviewForm itemName={item.name} onClose={() => setReviewIdx(null)} />
              )}
            </div>
          );
        })}
      </div>

      {/* Total footer */}
      <div style={{
        margin: '0 1.6rem 1.4rem',
        borderTop: '1px solid #f0ebfc', paddingTop: '1rem',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#9ca3af' }}>
            <span>Subtotal ({order.orderItems?.reduce((s, i) => s + (i.qty || 0), 0)} items)</span>
            <span>₹{order.orderItems?.reduce((s, i) => s + ((i.price || 0) * (i.qty || 0)), 0).toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#9ca3af' }}>
            <span>Shipping</span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>Free</span>
          </div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
          border: '1px solid #ddd6fe',
          borderRadius: 14, padding: '0.85rem 1.1rem',
        }}>
          <div>
            <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7c3aed', margin: '0 0 2px' }}>
              Order Total
            </p>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>
              incl. of all taxes
            </p>
          </div>
          <span style={{ fontSize: '1.3rem', fontWeight: 700, color: '#5b21b6' }}>
            ₹{order.totalPrice?.toLocaleString()}
          </span>
        </div>

        {/* Shipping Address - Below Order Total */}
        <div style={{
          marginTop: '1rem',
          borderTop: '1px solid #f0ebfc', paddingTop: '1rem',
        }}>
          <Eyebrow>Shipping Address</Eyebrow>
          {order.shippingAddress ? (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '0.65rem',
              background: '#faf8ff', border: '1px solid #f0ebfc',
              borderRadius: 12, padding: '0.75rem 0.9rem',
              fontSize: '0.82rem', color: '#4b4570', lineHeight: 1.6,
            }}>
              <span style={{ fontSize: '0.95rem', flexShrink: 0, marginTop: 1 }}>📍</span>
              <div>
                <p style={{ margin: 0 }}>{order.shippingAddress.address}</p>
                <p style={{ margin: 0 }}>
                  {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
                </p>
                {order.shippingAddress.phone && (
                  <p style={{ margin: '2px 0 0', color: '#9ca3af', fontSize: '0.75rem' }}>
                    📞 {order.shippingAddress.phone}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p style={{ color: '#9ca3af', fontSize: '0.82rem', margin: 0 }}>No address on record.</p>
          )}
        </div>

        {/* Order Info - Below Shipping Address */}
        <div style={{
          marginTop: '1rem',
          borderTop: '1px solid #f0ebfc', paddingTop: '1rem',
        }}>
          <Eyebrow>Order Info</Eyebrow>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.6rem',
          }}>
            <div style={{
              background: '#faf8ff', border: '1px solid #f0ebfc',
              borderRadius: 12, padding: '0.65rem 0.85rem',
            }}>
              <p style={{
                fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.08em', color: '#b0a7cc', margin: '0 0 4px',
              }}>Status</p>
              <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1a1033', margin: 0 }}>
                <StatusBadge status={order.orderStatus} />
              </p>
            </div>
            <div style={{
              background: '#faf8ff', border: '1px solid #f0ebfc',
              borderRadius: 12, padding: '0.65rem 0.85rem',
            }}>
              <p style={{
                fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.08em', color: '#b0a7cc', margin: '0 0 4px',
              }}>Payment</p>
              <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1a1033', margin: 0 }}>
                {order.paymentMethod || '--'}
              </p>
            </div>
            <div style={{
              background: '#faf8ff', border: '1px solid #f0ebfc',
              borderRadius: 12, padding: '0.65rem 0.85rem',
            }}>
              <p style={{
                fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.08em', color: '#b0a7cc', margin: '0 0 4px',
              }}>Date</p>
              <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1a1033', margin: 0 }}>
                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div style={{
              background: '#faf8ff', border: '1px solid #f0ebfc',
              borderRadius: 12, padding: '0.65rem 0.85rem',
            }}>
              <p style={{
                fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.08em', color: '#b0a7cc', margin: '0 0 4px',
              }}>Total</p>
              <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1a1033', margin: 0 }}>
                ₹{order.totalPrice?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Page Root ────────────────────────────────────────────────────────────────

const OrderDetailPage = () => {
  const { id }   = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedOrder, loading, error } = useSelector(s => s.order);

  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling,   setCancelling]   = useState(false);

  useEffect(() => { if (id) dispatch(getOrderById(id)); }, [dispatch, id]);

  const handleBack = () => navigate('/orders');

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    setCancelTarget(null);
    await dispatch(cancelOrderAsync(cancelTarget._id));
    setCancelling(false);
    dispatch(getOrderById(id));
  };

  const order      = selectedOrder?._id === id ? selectedOrder : null;
  const isLoading  = loading || !order;
  const canCancel  = order && CANCELLABLE.includes(order.orderStatus);
  const isDelivered = order?.orderStatus === 'Delivered';

  return (
    <div className="od-page">
      <DetailGlobalStyles />

      {cancelTarget && (
        <CancelModal
          order={cancelTarget}
          onConfirm={handleCancelConfirm}
          onClose={() => setCancelTarget(null)}
          busy={cancelling}
        />
      )}

      <button className="od-back-btn" onClick={handleBack}>
        ← Back to Orders
      </button>

      {isLoading && <DetailSkeleton />}

      {!isLoading && error && (
        <div className="od-error-box">⚠ {error}</div>
      )}

      {!isLoading && order && (
        <div className="od-grid">
          <LeftPanel
            order={order}
            canCancel={canCancel}
            cancelling={cancelling}
            onCancelClick={() => setCancelTarget(order)}
            onDownloadInvoice={() => downloadInvoicePDF(order)}
          />
          <RightPanel order={order} isDelivered={isDelivered} />
        </div>
      )}
    </div>
  );
};

// ─── Global Styles ────────────────────────────────────────────────────────────

const DetailGlobalStyles = () => (
  <style>{`
    @keyframes od-shimmer {
      0% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes od-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes od-slide-up {
      from { transform: translateY(16px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes od-spin {
      to { transform: rotate(360deg); }
    }

    .od-page {
      /* No max-width - uses padding only like navbar */
      padding: 0 var(--od-px) 4rem;
      font-family: inherit;
      background: #f8f7fc;
      min-height: 100vh;
    }

    /* ── Gutter ladder — mirrors Navbar.css --nav-pad-x ── */
    :root {
      --od-px: var(--nav-pad-x, 48px);
    }

    /* 1920px+ → 80px */
    @media (min-width: 1920px) { 
      :root { --od-px: 80px; } 
    }

    /* 1440–1919px and 1280–1439px → 48px (root default) */

    /* ≤ 1279px → 36px */
    @media (max-width: 1279px) { 
      :root { --od-px: 36px; } 
    }

    /* ≤ 1159px → 28px */
    @media (max-width: 1159px) { 
      :root { --od-px: 28px; } 
    }

    /* ≤ 1023px → 20px */
    @media (max-width: 1023px) { 
      :root { --od-px: 20px; } 
    }

    /* ≤ 767px → 16px */
    @media (max-width: 767px) { 
      :root { --od-px: 16px; } 
    }

    /* ≤ 479px → 12px */
    @media (max-width: 479px) { 
      :root { --od-px: 12px; } 
    }

    .od-back-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      margin: 1.2rem 0;
      padding: 0.52rem 1rem;
      border-radius: 8px;
      background: #f5f3ff;
      color: #5b21b6;
      border: 1px solid #e8e2f5;
      font-weight: 600;
      font-size: 0.84rem;
      cursor: pointer;
      transition: background 0.15s;
      font-family: inherit;
    }
    .od-back-btn:hover {
      background: #ede9fe;
    }

    .od-error-box {
      background: #fff1f1;
      border: 1.5px solid #fca5a5;
      border-radius: 10px;
      padding: 0.8rem 1rem;
      color: #991b1b;
      font-size: 0.87rem;
    }

    /* Two-col grid */
    .od-grid {
      display: grid;
      grid-template-columns: 360px 1fr;
      gap: 1.25rem;
      align-items: start;
      margin-bottom: 1.25rem;
    }

    /* Cards */
    .od-card {
      background: #fff;
      border: 1px solid #ede9fe;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 4px 32px rgba(108,60,225,0.07);
    }

    .od-card--left {
      position: sticky;
      top: 1.5rem;
    }

    /* Full width sections */
    .od-fullwidth {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      margin-top: 0;
    }

    .od-fullwidth-card {
      background: #fff;
      border: 1px solid #ede9fe;
      border-radius: 20px;
      padding: 1.4rem 1.6rem;
      box-shadow: 0 4px 32px rgba(108,60,225,0.07);
    }

    /* Order Info Grid */
    .od-info-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.6rem;
    }

    .od-info-item {
      background: #faf8ff;
      border: 1px solid #f0ebfc;
      border-radius: 12px;
      padding: 0.65rem 0.85rem;
    }

    .od-info-label {
      font-size: 0.62rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #b0a7cc;
      margin: 0 0 4px;
    }

    .od-info-value {
      font-size: 0.88rem;
      font-weight: 600;
      color: #1a1033;
      margin: 0;
    }

    /* Address */
    .od-address-box {
      display: flex;
      align-items: flex-start;
      gap: 0.65rem;
      background: #faf8ff;
      border: 1px solid #f0ebfc;
      border-radius: 12px;
      padding: 0.85rem 1rem;
      font-size: 0.85rem;
      color: #4b4570;
      line-height: 1.65;
    }

    .od-address-icon {
      font-size: 1rem;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .od-address-line {
      margin: 0;
    }

    .od-address-phone {
      margin: 3px 0 0;
      color: #9ca3af;
      font-size: 0.8rem;
    }

    /* Spinner */
    .od-spinner {
      display: inline-block;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      border: 2px solid rgba(108,60,225,0.25);
      border-top-color: #7c3aed;
      animation: od-spin 0.7s linear infinite;
      flex-shrink: 0;
    }
    .od-spinner--white {
      border-color: rgba(255,255,255,0.3);
      border-top-color: #fff;
    }

    /* Buttons */
    .od-outline-btn {
      padding: 0.52rem 1rem;
      border-radius: 8px;
      background: transparent;
      color: #1a1033;
      border: 1.5px solid #d4c8f0;
      font-weight: 600;
      font-size: 0.84rem;
      cursor: pointer;
      transition: all 0.18s;
      font-family: inherit;
    }
    .od-outline-btn:hover {
      border-color: #7c3aed;
      color: #7c3aed;
      background: #f5f3ff;
    }

    .od-danger-outline-btn {
      padding: 0.52rem 1rem;
      border-radius: 8px;
      background: transparent;
      color: #b91c1c;
      border: 1.5px solid #fca5a5;
      font-weight: 600;
      font-size: 0.84rem;
      cursor: pointer;
      transition: all 0.18s;
      font-family: inherit;
    }
    .od-danger-outline-btn:hover:not(:disabled) {
      background: #fff1f1;
      border-color: #f87171;
    }
    .od-danger-outline-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .od-ghost-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.35rem;
      padding: 0.52rem 1rem;
      border-radius: 8px;
      background: #f5f3ff;
      color: #5b21b6;
      border: 1px solid #e8e2f5;
      font-weight: 600;
      font-size: 0.84rem;
      cursor: pointer;
      transition: background 0.15s;
      font-family: inherit;
    }
    .od-ghost-btn:hover:not(:disabled) {
      background: #ede9fe;
    }
    .od-ghost-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .od-danger-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      padding: 0.52rem 1rem;
      border-radius: 8px;
      background: #dc2626;
      color: #fff;
      border: none;
      font-weight: 600;
      font-size: 0.84rem;
      cursor: pointer;
      transition: background 0.18s;
      font-family: inherit;
    }
    .od-danger-btn:hover:not(:disabled) {
      background: #b91c1c;
    }
    .od-danger-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .od-primary-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.35rem;
      padding: 0.52rem 1rem;
      border-radius: 8px;
      background: #7c3aed;
      color: #fff;
      border: none;
      font-weight: 600;
      font-size: 0.84rem;
      cursor: pointer;
      transition: background 0.18s;
      font-family: inherit;
    }
    .od-primary-btn:hover:not(:disabled) {
      background: #5b21b6;
    }
    .od-primary-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* ── Responsive ── */

    /* Tablet */
    @media (max-width: 860px) {
      .od-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      .od-card--left {
        position: static;
      }
      .od-fullwidth-card {
        border-radius: 14px;
        padding: 1rem 1.2rem;
      }
      .od-info-grid {
        grid-template-columns: 1fr 1fr !important;
      }
      .od-page {
        padding: 0 var(--od-px) 2rem;
      }
    }

    /* Mobile */
    @media (max-width: 480px) {
      .od-card {
        border-radius: 14px;
      }
      .od-info-grid {
        grid-template-columns: 1fr !important;
      }
      .od-back-btn {
        font-size: 0.78rem;
        padding: 0.45rem 0.85rem;
      }
      .od-page {
        padding: 0 var(--od-px) 1.5rem;
      }
    }
  `}</style>
);

export default OrderDetailPage;