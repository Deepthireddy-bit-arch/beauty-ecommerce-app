import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { clearError } from '../../redux/slices/orderSlice';
import { createOrder } from '../../redux/reducers/thunks/orderThunks';
import { createPaymentIntent } from '../../redux/reducers/thunks/paymentThunks';

// ── Stripe instance (created once outside component) ─────────────────
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Demo cart — replace with useSelector((s) => s.cart.items) in your real app
const DEMO_CART = [
  {
    product: '6a0ad8c8870ae94c91f079af',
    name: 'Hydrating Lip Balm',
    qty: 2,
    price: 199,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=80&h=80&fit=crop',
  },
  {
    product: '6a0ac5b95104b812cea099e9',
    name: 'Matte Lipstick No.2',
    qty: 1,
    price: 599,
    image: 'https://images.unsplash.com/photo-1586495777744-4e6b7c1b1c1b?w=80&h=80&fit=crop',
  },
];

const STEPS = ['Shipping', 'Payment', 'Review'];

/* ─────────────────────────────────────────────────────────────────────
   Inner Stripe form — only rendered when paymentMethod === 'Card'
   and a clientSecret is available.
───────────────────────────────────────────────────────────────────── */
const StripeCardForm = ({ onConfirmed, onBack, totalPrice }) => {
  const stripe   = useStripe();
  const elements = useElements();
  const [err, setErr]   = useState('');
  const [busy, setBusy] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setBusy(true);
    setErr('');

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-complete`,
      },
      redirect: 'if_required',
    });

    setBusy(false);

    if (error) {
      setErr(error.message);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      onConfirmed(paymentIntent.id);
    } else {
      setErr('Unexpected payment state. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{
        border: '1.5px solid var(--border,#e5e7eb)',
        borderRadius: 'var(--radius,8px)',
        padding: '1rem',
        background: 'var(--white,#fff)',
      }}>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {err && <div className="alert-error">⚠ {err}</div>}

      <div className="mt-1 d-flex gap-1">
        <button className="btn-outline" onClick={onBack}>← Back</button>
        <button
          className="btn-primary"
          style={{ flex: 1 }}
          disabled={!stripe || !elements || busy}
          onClick={handlePay}
        >
          {busy
            ? <><span className="spinner" /> Processing…</>
            : `Pay ₹${totalPrice?.toLocaleString('en-IN')}`}
        </button>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--ink-muted,#9ca3af)', margin: 0 }}>
        🔒 Secured by Stripe. Your card details are never stored.
      </p>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────
   Success screen
───────────────────────────────────────────────────────────────────── */
const SuccessScreen = ({ onViewOrders }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '3rem 1.5rem', textAlign: 'center', gap: '0.8rem',
  }}>
    <div style={{
      width: 76, height: 76, borderRadius: '50%',
      background: 'linear-gradient(135deg,#22c55e,#16a34a)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 8px 24px rgba(34,197,94,0.25)', marginBottom: '0.5rem',
    }}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
    <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>Order Placed!</h2>
    <p style={{ margin: 0, color: 'var(--ink-muted)', fontSize: '0.9rem', maxWidth: 320 }}>
      Your order has been confirmed. We'll send you updates by email.
    </p>
    <button className="btn-primary" style={{ marginTop: '0.8rem', minWidth: 200 }} onClick={onViewOrders}>
      View My Orders
    </button>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────
   Main CheckoutPage
───────────────────────────────────────────────────────────────────── */
const CheckoutPage = ({ onOrderSuccess }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.order);

  const [step, setStep]           = useState(0);
  const [orderDone, setOrderDone] = useState(false);
  const [shipping, setShipping]   = useState({
    address: '', city: '', state: '', pincode: '', phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');

  // Stripe card state
  const [clientSecret, setClientSecret]   = useState('');
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeInitErr, setStripeInitErr] = useState('');

  const cartItems   = DEMO_CART; // replace with useSelector((s) => s.cart.items)
  const subtotal    = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingFee = subtotal > 999 ? 0 : 49;
  const totalPrice  = subtotal + shippingFee;

  const handleShippingChange = (e) =>
    setShipping({ ...shipping, [e.target.name]: e.target.value });

  const isShippingValid = () =>
    shipping.address && shipping.city && shipping.state && shipping.pincode && shipping.phone;

  // When user clicks "Review Order →" on the Payment step
  const handlePaymentContinue = async () => {
    if (paymentMethod === 'Card') {
      setStripeLoading(true);
      setStripeInitErr('');
      try {
        const secret = await dispatch(createPaymentIntent(totalPrice)).unwrap();
        setClientSecret(secret);
        setStep(2);
      } catch (e) {
        setStripeInitErr(e || 'Could not initialise payment. Try again.');
      } finally {
        setStripeLoading(false);
      }
    } else {
      setClientSecret('');
      setStep(2);
    }
  };

  // COD / UPI — no Stripe charge
  const handlePlaceOrder = async () => {
    const result = await dispatch(
      createOrder({
        orderItems: cartItems,
        shippingAddress: shipping,
        paymentMethod,
        totalPrice,
      })
    );
    if (result.meta.requestStatus === 'fulfilled') {
      setOrderDone(true);
      onOrderSuccess?.(result.payload);
    }
  };

  // Called by StripeCardForm after card charge succeeds
  const handleCardPaymentConfirmed = async (paymentIntentId) => {
    const result = await dispatch(
      createOrder({
        orderItems: cartItems,
        shippingAddress: shipping,
        paymentMethod: 'Card',
        totalPrice,
        paymentIntentId,
        isPaid: true,
        paidAt: new Date().toISOString(),
      })
    );
    if (result.meta.requestStatus === 'fulfilled') {
      setOrderDone(true);
      onOrderSuccess?.(result.payload);
    }
  };

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary:    '#7c3aed',
      colorBackground: '#ffffff',
      colorText:       '#1f2937',
      colorDanger:     '#ef4444',
      borderRadius:    '8px',
    },
  };

  if (orderDone) {
    return (
      <div className="page-wrap" style={{ maxWidth: 520, margin: '0 auto' }}>
        <SuccessScreen onViewOrders={() => onOrderSuccess?.()} />
      </div>
    );
  }

  return (
    <div className="page-wrap">
      {/* Stepper */}
      <div className="stepper">
        {STEPS.map((label, i) => (
          <React.Fragment key={label}>
            {i > 0 && <div className={`step-line ${i <= step ? 'done' : ''}`} />}
            <div className={`step ${i === step ? 'active' : i < step ? 'done' : ''}`}>
              <div className="step-circle">{i < step ? '✓' : i + 1}</div>
              <span className="step-label">{label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="checkout-layout">
        {/* Left panel */}
        <div>

          {/* Step 0: Shipping */}
          {step === 0 && (
            <div className="card-luxury">
              <p className="section-label">Shipping Details</p>
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input className="form-input" name="address" placeholder="123 MG Road"
                  value={shipping.address} onChange={handleShippingChange} />
              </div>
              <div className="two-col">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className="form-input" name="city" placeholder="Bangalore"
                    value={shipping.city} onChange={handleShippingChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input className="form-input" name="state" placeholder="Karnataka"
                    value={shipping.state} onChange={handleShippingChange} />
                </div>
              </div>
              <div className="two-col">
                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input className="form-input" name="pincode" placeholder="560001"
                    value={shipping.pincode} onChange={handleShippingChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" name="phone" placeholder="+91 98765 43210"
                    value={shipping.phone} onChange={handleShippingChange} />
                </div>
              </div>
              <div className="mt-2">
                <button className="btn-primary" disabled={!isShippingValid()} onClick={() => setStep(1)}>
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Payment method */}
          {step === 1 && (
            <div className="card-luxury">
              <p className="section-label">Payment Method</p>
              <div className="payment-options">
                {[
                  { value: 'COD',  label: 'Cash on Delivery',      icon: '💵' },
                  { value: 'UPI',  label: 'UPI',                   icon: '📱' },
                  { value: 'Card', label: 'Credit / Debit Card',   icon: '💳' },
                ].map((m) => (
                  <label key={m.value} className={`payment-option ${paymentMethod === m.value ? 'selected' : ''}`}>
                    <input type="radio" name="payment" value={m.value}
                      checked={paymentMethod === m.value}
                      onChange={() => setPaymentMethod(m.value)} />
                    {m.icon} {m.label}
                  </label>
                ))}
              </div>

              {stripeInitErr && <div className="alert-error mt-2">⚠ {stripeInitErr}</div>}

              <div className="mt-3 d-flex gap-1">
                <button className="btn-outline" onClick={() => setStep(0)}>← Back</button>
                <button className="btn-primary" style={{ flex: 1 }} disabled={stripeLoading} onClick={handlePaymentContinue}>
                  {stripeLoading ? <><span className="spinner" /> Setting up…</> : 'Review Order →'}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="card-luxury">
              <p className="section-label">Review Your Order</p>

              <div style={{ background: 'var(--purple-ghost)', borderRadius: 'var(--radius)', padding: '0.8rem 1rem', marginBottom: '1rem' }}>
                <div className="d-flex justify-between align-center mb-1">
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--purple-mid)', letterSpacing: '1px', textTransform: 'uppercase' }}>Shipping To</span>
                  <button className="btn-outline" style={{ padding: '0.2rem 0.7rem', fontSize: '0.78rem' }} onClick={() => setStep(0)}>Edit</button>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)' }}>
                  {shipping.address}, {shipping.city}, {shipping.state} – {shipping.pincode}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--ink-muted)' }}>📞 {shipping.phone}</p>
              </div>

              {cartItems.map((item) => (
                <div className="order-item-row" key={item.product}>
                  <img className="order-item-img" src={item.image} alt={item.name}
                    onError={(e) => { e.target.style.background = 'var(--purple-pale)'; }} />
                  <div>
                    <div className="order-item-name">{item.name}</div>
                    <div className="order-item-meta">Qty: {item.qty}</div>
                  </div>
                  <div className="order-item-price">₹{(item.price * item.qty).toLocaleString()}</div>
                </div>
              ))}

              <div className="mt-2 text-muted">
                💳 Payment: <strong style={{ color: 'var(--ink-soft)' }}>{paymentMethod}</strong>
              </div>

              {error && <div className="alert-error mt-2">⚠ {error}</div>}

              {/* Card: Stripe form inline */}
              {paymentMethod === 'Card' && clientSecret ? (
                <div className="mt-3">
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                    <StripeCardForm
                      totalPrice={totalPrice}
                      onConfirmed={handleCardPaymentConfirmed}
                      onBack={() => { setStep(1); setClientSecret(''); }}
                    />
                  </Elements>
                </div>
              ) : (
                /* COD / UPI */
                <div className="mt-3 d-flex gap-1">
                  <button className="btn-outline" onClick={() => { dispatch(clearError()); setStep(1); }}>← Back</button>
                  <button className="btn-primary" style={{ flex: 1 }} onClick={handlePlaceOrder} disabled={loading}>
                    {loading ? <><span className="spinner" /> Placing order…</> : '✓ Place Order'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Order summary */}
        <div className="card-luxury" style={{ position: 'sticky', top: '80px' }}>
          <p className="section-label">Order Summary</p>
          {cartItems.map((item) => (
            <div className="order-item-row" key={item.product}>
              <img className="order-item-img" src={item.image} alt={item.name}
                onError={(e) => { e.target.style.background = 'var(--purple-pale)'; }} />
              <div style={{ flex: 1 }}>
                <div className="order-item-name">{item.name}</div>
                <div className="order-item-meta">× {item.qty}</div>
              </div>
              <div className="order-item-price">₹{(item.price * item.qty).toLocaleString()}</div>
            </div>
          ))}
          <hr className="divider" />
          <div className="price-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
          <div className="price-row">
            <span>Shipping</span>
            <span style={{ color: shippingFee === 0 ? 'var(--success)' : 'inherit' }}>
              {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
            </span>
          </div>
          <div className="price-row total"><span>Total</span><span>₹{totalPrice.toLocaleString()}</span></div>
          {shippingFee > 0 && (
            <p className="text-muted mt-1">Add ₹{(1000 - subtotal).toLocaleString()} more for free shipping</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;