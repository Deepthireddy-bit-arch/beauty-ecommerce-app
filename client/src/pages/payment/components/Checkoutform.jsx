import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import PaymentStatus from './PaymentStatus';

/**
 * Props:
 *  - amount: number  (order total in ₹)
 *  - onSuccess: () => void  (optional — called after successful payment)
 */
const CheckoutForm = ({ amount, onSuccess }) => {
  const stripe   = useStripe();
  const elements = useElements();

  const [status, setStatus]   = useState('idle');  // idle | processing | succeeded | failed
  const [errMsg, setErrMsg]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setStatus('processing');
    setErrMsg('');

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Stripe will redirect here only for redirect-based methods (e.g. UPI, netbanking).
        // For cards this is not used but required by Stripe.
        return_url: `${window.location.origin}/payment-complete`,
      },
      redirect: 'if_required', // prevents full-page redirect for cards
    });

    if (error) {
      setErrMsg(error.message);
      setStatus('failed');
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      setStatus('succeeded');
      onSuccess?.();
    } else {
      setErrMsg('Unexpected payment state. Please contact support.');
      setStatus('failed');
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setErrMsg('');
  };

  // ── Show result screens ──────────────────────────────────────────
  if (status === 'succeeded' || status === 'failed') {
    return <PaymentStatus status={status} error={errMsg} onRetry={handleRetry} />;
  }

  // ── Card form ────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

      <div style={styles.sectionLabel}>Payment Details</div>

      {/* Stripe's unified Payment Element (handles cards, UPI, wallets, etc.) */}
      <div style={styles.stripeBox}>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {/* Order summary line */}
      <div style={styles.summary}>
        <span style={{ color: 'var(--ink-muted,#6b7280)', fontSize: '0.88rem' }}>Total payable</span>
        <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--purple-deep,#5b21b6)' }}>
          ₹{amount?.toLocaleString('en-IN')}
        </span>
      </div>

      {/* Error banner */}
      {errMsg && (
        <div style={styles.errorBanner}>⚠ {errMsg}</div>
      )}

      {/* Pay button */}
      <button
        type="submit"
        disabled={!stripe || !elements || status === 'processing'}
        style={{
          ...styles.payBtn,
          opacity: (!stripe || !elements || status === 'processing') ? 0.65 : 1,
          cursor:  (!stripe || !elements || status === 'processing') ? 'not-allowed' : 'pointer',
        }}
      >
        {status === 'processing' ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <span style={styles.spinner} /> Processing…
          </span>
        ) : (
          `Pay ₹${amount?.toLocaleString('en-IN')}`
        )}
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--ink-muted,#9ca3af)', margin: 0 }}>
        🔒 Secured by Stripe. Your card details are never stored.
      </p>
    </form>
  );
};

const styles = {
  sectionLabel: {
    fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: 'var(--ink-muted,#6b7280)',
  },
  stripeBox: {
    border: '1.5px solid var(--border,#e5e7eb)',
    borderRadius: 'var(--radius,8px)',
    padding: '1rem',
    background: 'var(--white,#fff)',
  },
  summary: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: 'var(--purple-ghost,#f5f3ff)', borderRadius: 'var(--radius,8px)',
    padding: '0.7rem 1rem',
  },
  errorBanner: {
    background: '#fef2f2', border: '1px solid #fca5a5',
    borderRadius: 'var(--radius,8px)', padding: '0.65rem 1rem',
    color: '#b91c1c', fontSize: '0.85rem',
  },
  payBtn: {
    width: '100%', padding: '0.85rem',
    background: 'linear-gradient(135deg, var(--purple-mid,#7c3aed), var(--purple-deep,#5b21b6))',
    color: '#fff', border: 'none', borderRadius: 'var(--radius,8px)',
    fontWeight: 700, fontSize: '1rem', letterSpacing: '0.02em',
    boxShadow: '0 4px 14px rgba(124,58,237,0.35)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  },
  spinner: {
    display: 'inline-block', width: 16, height: 16,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid #fff', borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
};

export default CheckoutForm;