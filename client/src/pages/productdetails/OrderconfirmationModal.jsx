
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = `
  @keyframes overlayIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes modalPop {
    0%   { opacity: 0; transform: scale(0.88) translateY(24px); }
    60%  { transform: scale(1.03) translateY(-4px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes checkDraw {
    from { stroke-dashoffset: 40; opacity: 0; }
    to   { stroke-dashoffset: 0;  opacity: 1; }
  }
  @keyframes ringPulse {
    0%   { box-shadow: 0 0 0 0 rgba(108,60,225,0.35); }
    60%  { box-shadow: 0 0 0 14px rgba(108,60,225,0); }
    100% { box-shadow: 0 0 0 0 rgba(108,60,225,0); }
  }
  @keyframes rowSlideIn {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes btnFadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .confirm-overlay {
    animation: overlayIn 0.25s ease forwards;
  }
  .confirm-modal {
    animation: modalPop 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards;
  }
  .confirm-ring {
    animation: ringPulse 0.9s ease 0.4s forwards;
  }
  .confirm-check path {
    stroke-dasharray: 40;
    stroke-dashoffset: 40;
    animation: checkDraw 0.4s ease 0.35s forwards;
  }
  .confirm-row-1 { animation: rowSlideIn 0.3s ease 0.45s both; }
  .confirm-row-2 { animation: rowSlideIn 0.3s ease 0.55s both; }
  .confirm-row-3 { animation: rowSlideIn 0.3s ease 0.65s both; }
  .confirm-row-4 { animation: rowSlideIn 0.3s ease 0.75s both; }
  .confirm-btn-1 { animation: btnFadeUp 0.3s ease 0.8s both; }
  .confirm-btn-2 { animation: btnFadeUp 0.3s ease 0.9s both; }

  /* ── Fluid responsiveness ─────────────────────────────────────────
     The modal's own sizing (width/padding/font-size) is handled with
     clamp() inline below, so it scales continuously with the viewport
     instead of jumping at 2-3 fixed breakpoints. These rules cover the
     bits that inline styles can't (box-sizing, scroll containment,
     and row wrapping on very narrow / very tall-content phones). */
  .confirm-overlay, .confirm-overlay * {
    box-sizing: border-box;
  }
  .confirm-row-1, .confirm-row-2, .confirm-row-3, .confirm-row-4 {
    flex-wrap: wrap;
    row-gap: 4px;
  }
  @media (max-width: 360px) {
    .confirm-row-1 span:last-child,
    .confirm-row-2 span:last-child,
    .confirm-row-3 span:last-child,
    .confirm-row-4 span:last-child {
      text-align: right;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .confirm-overlay, .confirm-modal, .confirm-ring, .confirm-check path,
    .confirm-row-1, .confirm-row-2, .confirm-row-3, .confirm-row-4,
    .confirm-btn-1, .confirm-btn-2 {
      animation: none !important;
    }
  }
`;

const OrderConfirmationModal = ({ order, onViewOrders, onContinueShopping }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const navigate=useNavigate();

  if (!order || !mounted) return null;

  return (
    <>
      <style>{styles}</style>
      <div
        className="confirm-overlay"
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(26,16,51,0.55)',
          backdropFilter: 'blur(6px)',
          zIndex: 300,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 'clamp(0.5rem, 4vw, 1.5rem)',
          overflowY: 'auto',
        }}
      >
        <div
          className="confirm-modal"
          style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius-lg)',
            padding: 'clamp(1.25rem, 5vw, 2.4rem) clamp(1rem, 4.5vw, 2.2rem)',
            width: '100%',
            maxWidth: 'min(520px, 100%)',
            maxHeight: '90dvh',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            boxShadow: '0 24px 60px rgba(59,31,168,0.22)',
            textAlign: 'center',
          }}
        >
          {/* Success ring + icon */}
          <div
            className="confirm-ring"
            style={{
              width: 'clamp(52px, 14vw, 68px)',
              height: 'clamp(52px, 14vw, 68px)',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--purple-pale), var(--purple-ghost))',
              border: '2.5px solid var(--purple-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto clamp(0.85rem, 3vw, 1.2rem)',
            }}
          >
            <svg
              className="confirm-check"
              width="30" height="30" fill="none"
              stroke="var(--purple-mid)" strokeWidth="2.8"
              viewBox="0 0 24 24"
              style={{ width: 'clamp(22px, 6vw, 30px)', height: 'clamp(22px, 6vw, 30px)' }}
            >
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(1.35rem, 5.5vw, 2rem)',
            fontWeight: 600,
            color: 'var(--ink)',
            marginBottom: '0.3rem',
            lineHeight: 1.2,
          }}>
            Order Placed!
          </h2>
          <p style={{
            fontSize: 'clamp(0.8rem, 2.6vw, 0.9rem)',
            color: 'var(--ink-muted)',
            marginBottom: 'clamp(1.2rem, 4vw, 1.8rem)',
            lineHeight: 1.45,
          }}>
            Your order has been confirmed. We'll get it to you soon.
          </p>

          {/* Order details card */}
          <div style={{
            background: 'var(--purple-ghost)',
            borderRadius: 'var(--radius)',
            padding: 'clamp(0.85rem, 3.5vw, 1.1rem) clamp(0.9rem, 4vw, 1.4rem)',
            marginBottom: 'clamp(1.2rem, 4vw, 1.8rem)',
            textAlign: 'left',
          }}>
            <div className="confirm-row-1 d-flex justify-between align-center" style={{ marginBottom: '0.7rem', gap: '0.5rem' }}>
              <span className="text-muted" style={{ fontSize: 'clamp(0.78rem, 2.4vw, 0.85rem)' }}>Order ID</span>
              <span style={{ fontFamily: 'monospace', fontSize: 'clamp(0.72rem, 2.2vw, 0.82rem)', color: 'var(--ink-soft)', fontWeight: 700, letterSpacing: '0.5px', wordBreak: 'break-all' }}>
                #{order._id?.slice(-10).toUpperCase()}
              </span>
            </div>
            <div className="confirm-row-2 d-flex justify-between align-center" style={{ marginBottom: '0.7rem', gap: '0.5rem' }}>
              <span className="text-muted" style={{ fontSize: 'clamp(0.78rem, 2.4vw, 0.85rem)' }}>Items</span>
              <span className="fw-600" style={{ fontSize: 'clamp(0.82rem, 2.6vw, 0.92rem)' }}>
                {order.orderItems?.length} item{order.orderItems?.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="confirm-row-3 d-flex justify-between align-center" style={{ marginBottom: '0.7rem', gap: '0.5rem' }}>
              <span className="text-muted" style={{ fontSize: 'clamp(0.78rem, 2.4vw, 0.85rem)' }}>Payment</span>
              <span className="fw-600" style={{ fontSize: 'clamp(0.82rem, 2.6vw, 0.92rem)' }}>{order.paymentMethod}</span>
            </div>
            <hr className="divider" style={{ margin: '0.7rem 0' }} />
            <div className="confirm-row-4 d-flex justify-between align-center" style={{ gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--ink)', fontSize: 'clamp(0.85rem, 2.7vw, 0.95rem)' }}>Total Paid</span>
              <span style={{ fontWeight: 700, fontSize: 'clamp(1rem, 4vw, 1.2rem)', color: 'var(--purple-deep)' }}>
                ₹{order.totalPrice?.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="confirm-btn-1" style={{ marginBottom: '0.75rem' }}>
            <button className="btn-primary" style={{ width: '100%' }} onClick={onViewOrders}>
              View My Orders
            </button>
          </div>
          <div className="confirm-btn-2" style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/products')}
              style={{
                background: 'none', border: 'none',
                color: 'var(--ink-muted)', fontSize: 'clamp(0.82rem, 2.6vw, 0.88rem)',
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                textDecoration: 'underline', textUnderlineOffset: '3px',
                padding: '0.3rem 0.5rem',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--purple-mid)'}
              onMouseLeave={e => e.target.style.color = 'var(--ink-muted)'}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmationModal;