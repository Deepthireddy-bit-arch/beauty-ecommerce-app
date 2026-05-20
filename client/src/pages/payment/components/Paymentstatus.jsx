import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentStatus = ({ status, error, onRetry }) => {
  const navigate = useNavigate();

  if (status === 'succeeded') {
    return (
      <div style={styles.wrap}>
        <div style={{ ...styles.iconCircle, background: 'linear-gradient(135deg,#22c55e,#16a34a)' }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 style={styles.heading}>Payment Successful!</h2>
        <p style={styles.sub}>Your order has been placed. We'll send a confirmation shortly.</p>
        <button style={{ ...styles.btn, background: 'var(--purple-mid,#7c3aed)' }} onClick={() => navigate('/orders')}>
          View My Orders
        </button>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div style={styles.wrap}>
        <div style={{ ...styles.iconCircle, background: 'linear-gradient(135deg,#ef4444,#b91c1c)' }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
        <h2 style={styles.heading}>Payment Failed</h2>
        <p style={styles.sub}>{error || 'Something went wrong. Please try again.'}</p>
        <button style={{ ...styles.btn, background: 'var(--purple-mid,#7c3aed)' }} onClick={onRetry}>
          Try Again
        </button>
        <button style={{ ...styles.btn, background: 'transparent', color: 'var(--ink-muted,#6b7280)', border: '1.5px solid var(--border,#e5e7eb)', marginTop: '0.5rem' }}
          onClick={() => navigate('/cart')}>
          Back to Cart
        </button>
      </div>
    );
  }

  return null;
};

const styles = {
  wrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '2.5rem 1.5rem', textAlign: 'center', gap: '0.6rem',
  },
  iconCircle: {
    width: 76, height: 76, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '0.5rem',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  },
  heading: { margin: 0, fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink,#111827)' },
  sub: { margin: 0, fontSize: '0.9rem', color: 'var(--ink-muted,#6b7280)', maxWidth: 320 },
  btn: {
    width: '100%', maxWidth: 320, padding: '0.75rem',
    borderRadius: 'var(--radius,8px)', border: 'none', cursor: 'pointer',
    fontWeight: 600, fontSize: '0.95rem', color: '#fff', marginTop: '0.8rem',
  },
};

export default PaymentStatus;