
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { clearError } from '../../redux/slices/orderSlice';
import { createOrder } from '../../redux/reducers/thunks/orderThunks';
import { createPaymentIntent } from '../../redux/reducers/thunks/paymentThunks';
import { fetchCart, clearCartAsync } from '../../redux/reducers/thunks/cartThunks';
import { useNavigate } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────────
// Stripe instance — created once. If the publishable key is missing,
// loadStripe() resolves to null and Stripe will silently refuse to
// mount an interactive PaymentElement (this is the #1 cause of "I can't
// type in the card field" bugs), so we detect and surface that case.
// ─────────────────────────────────────────────────────────────────────
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

const STEPS = ['Shipping', 'Payment', 'Review'];

const PINCODE_RE = /^[1-9][0-9]{5}$/; // Indian PIN: 6 digits, can't start with 0
const PHONE_RE = /^(\+91[\-\s]?)?[6-9]\d{9}$/; // Indian mobile, optional +91
const NAME_RE = /^[a-zA-Z\s.'-]{2,}$/; // city / state — letters only

/* ────────────────────────────────────────────────────────────────────
   Skeleton primitives
──────────────────────────────────────────────────────────────────── */
const Skel = ({ width = '100%', height = 14, radius = 6, style = {} }) => (
  <span
    className="skel-bar"
    style={{ width, height, borderRadius: radius, display: 'inline-block', ...style }}
  />
);

const CartItemSkeleton = () => (
  <div className="order-item-row">
    <span className="skel-bar" style={{ width: 56, height: 56, borderRadius: 10, flexShrink: 0 }} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Skel width="70%" height={13} />
      <Skel width="35%" height={11} />
    </div>
    <Skel width={50} height={14} />
  </div>
);

const OrderSummarySkeleton = () => (
  <div className="card-luxury">
    <p className="section-label">Order Summary</p>
    <CartItemSkeleton />
    <CartItemSkeleton />
    <hr className="divider" />
    <div className="price-row"><Skel width={70} height={12} /><Skel width={50} height={12} /></div>
    <div className="price-row"><Skel width={70} height={12} /><Skel width={50} height={12} /></div>
    <div className="price-row"><Skel width={50} height={16} /><Skel width={70} height={16} /></div>
  </div>
);

const PaymentElementSkeleton = () => (
  <div className="pe-skeleton">
    <Skel width="100%" height={42} style={{ marginBottom: 10 }} />
    <Skel width="60%" height={14} style={{ marginBottom: 14 }} />
    <Skel width="100%" height={42} />
  </div>
);

/* Image with a skeleton placeholder until it loads */
const ImageWithSkeleton = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: 56, height: 56, flexShrink: 0 }}>
      {!loaded && !failed && (
        <span className="skel-bar" style={{ position: 'absolute', inset: 0, borderRadius: 10 }} />
      )}
      {!failed && (
        <img
          className={className}
          src={src}
          alt={alt}
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.25s ease' }}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
      {failed && <span className="img-fallback">🖼</span>}
    </span>
  );
};

/* ────────────────────────────────────────────────────────────────────
   Stripe card form
   - Forces a clean remount per clientSecret via `key` on <Elements>.
   - Shows a skeleton over the PaymentElement until Stripe reports
     `onReady`, since attempting to type into a not-yet-ready iframe
     is what usually looks like "the card field won't accept input".
──────────────────────────────────────────────────────────────────── */
const StripeCardForm = ({ onConfirmed, onBack, totalPrice }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements || !ready) return;
    setBusy(true);
    setErr('');

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/payment-complete` },
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
      <div
        style={{
          border: '1.5px solid var(--border,#e5e7eb)',
          borderRadius: 'var(--radius,8px)',
          padding: '1rem',
          background: 'var(--white,#fff)',
          position: 'relative',
          minHeight: ready ? 'auto' : 120,
        }}
      >
        {!ready && <PaymentElementSkeleton />}
        <div style={{ display: ready ? 'block' : 'none' }}>
          <PaymentElement
            options={{ layout: 'tabs' }}
            onReady={() => setReady(true)}
            onLoadError={(e) => setErr(e?.error?.message || 'Could not load the card form. Please refresh and try again.')}
          />
        </div>
      </div>

      {err && <div className="alert-error">⚠ {err}</div>}

      <div className="mt-1 d-flex gap-1 checkout-btn-row">
        <button className="btn-outline" onClick={onBack} disabled={busy}>← Back</button>
        <button
          className="btn-primary"
          style={{ flex: 1 }}
          disabled={!stripe || !elements || !ready || busy}
          onClick={handlePay}
        >
          {busy
            ? <><span className="spinner" /> Processing…</>
            : !ready
              ? 'Loading payment form…'
              : `Pay ₹${totalPrice?.toLocaleString('en-IN')}`}
        </button>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--ink-muted,#9ca3af)', margin: 0 }}>
        🔒 Secured by Stripe. Your card details are never stored.
      </p>
    </div>
  );
};

/* ── Success screen ───────────────────────────────────────────────── */
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

/* ── Main CheckoutPage ────────────────────────────────────────────── */
const CheckoutPage = ({ onOrderSuccess }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.order);
  const navigate=useNavigate();
  const cartItems = useSelector((s) => s.cart.items);
  const cartLoading = useSelector((s) => s.cart.loading);

  useEffect(() => {
    if (cartItems.length === 0) {
      dispatch(fetchCart());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [step, setStep] = useState(0);
  const [orderDone, setOrderDone] = useState(false);
  const [shipping, setShipping] = useState({
    address: '', city: '', state: '', pincode: '', phone: '',
  });
  const [touched, setTouched] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [clientSecret, setClientSecret] = useState('');
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeInitErr, setStripeInitErr] = useState('');
  const [placeOrderErr, setPlaceOrderErr] = useState('');

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingFee = subtotal > 999 ? 0 : 49;
  const totalPrice = subtotal + shippingFee;

  /* ── Validation ───────────────────────────────────────────────── */
  const fieldErrors = useMemo(() => {
    const e = {};
    if (!shipping.address.trim()) e.address = 'Street address is required.';
    else if (shipping.address.trim().length < 6) e.address = 'Please enter a complete address.';

    if (!shipping.city.trim()) e.city = 'City is required.';
    else if (!NAME_RE.test(shipping.city.trim())) e.city = 'City should only contain letters.';

    if (!shipping.state.trim()) e.state = 'State is required.';
    else if (!NAME_RE.test(shipping.state.trim())) e.state = 'State should only contain letters.';

    if (!shipping.pincode.trim()) e.pincode = 'Pincode is required.';
    else if (!PINCODE_RE.test(shipping.pincode.trim())) e.pincode = 'Enter a valid 6-digit pincode.';

    if (!shipping.phone.trim()) e.phone = 'Phone number is required.';
    else if (!PHONE_RE.test(shipping.phone.trim().replace(/\s/g, ''))) e.phone = 'Enter a valid 10-digit mobile number.';

    return e;
  }, [shipping]);

  const isShippingValid = Object.keys(fieldErrors).length === 0;

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShipping((s) => ({ ...s, [name]: value }));
  };

  const handleShippingBlur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
  };

  const handleShippingSubmit = () => {
    setTouched({ address: true, city: true, state: true, pincode: true, phone: true });
    if (isShippingValid) setStep(1);
  };

  const showErr = (field) => touched[field] && fieldErrors[field];

  /* ── Payment ──────────────────────────────────────────────────── */
  const handlePaymentContinue = async () => {
    if (paymentMethod === 'Card') {
      if (!stripePromise) {
        setStripeInitErr('Card payments are not available right now (missing payment configuration). Please choose another payment method.');
        return;
      }
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

  const buildOrderItems = () =>
    cartItems.map((i) => ({
      product: i.productId,
      name: i.name,
      qty: i.quantity,
      price: i.price,
      image: i.image,
    }));

  const handlePlaceOrder = async () => {
    setPlaceOrderErr('');
    const result = await dispatch(
      createOrder({
        orderItems: buildOrderItems(),
        shippingAddress: shipping,
        paymentMethod,
        totalPrice,
      })
    );
    if (result.meta.requestStatus === 'fulfilled') {
      setOrderDone(true);
      dispatch(clearCartAsync()); // empty the cart now that the order exists
      onOrderSuccess?.(result.payload);
    } else {
      setPlaceOrderErr(result.payload || 'Could not place your order. Please try again.');
    }
  };

  const handleCardPaymentConfirmed = async (paymentIntentId) => {
    setPlaceOrderErr('');
    const result = await dispatch(
      createOrder({
        orderItems: buildOrderItems(),
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
      dispatch(clearCartAsync()); // empty the cart now that the order exists
      onOrderSuccess?.(result.payload);
    } else {
      setPlaceOrderErr(result.payload || 'Payment succeeded but we could not save your order. Please contact support.');
    }
  };

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#7c3aed',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#ef4444',
      borderRadius: '8px',
    },
  };

  if (orderDone) {
    return (
      <div className="page-wrap checkout-page-root" style={{ maxWidth: 520, margin: '0 auto' }}>
        <ResponsiveStyles />
        <SuccessScreen onViewOrders={() => onOrderSuccess?.()} />
      </div>
    );
  }

  /* ── Cart loading skeleton (full page) ───────────────────────── */
  if (cartLoading && cartItems.length === 0) {
    return (
      <div className="page-wrap checkout-page-root">
        <ResponsiveStyles />
        <div className="stepper">
          {STEPS.map((label) => (
            <div className="step" key={label}>
              <Skel width={28} height={28} radius={999} />
              <Skel width={60} height={11} style={{ marginTop: 6 }} />
            </div>
          ))}
        </div>
        <div className="checkout-layout">
          <div className="card-luxury">
            <Skel width={140} height={14} style={{ marginBottom: 16 }} />
            <Skel width="100%" height={42} style={{ marginBottom: 14 }} />
            <Skel width="100%" height={42} style={{ marginBottom: 14 }} />
            <Skel width="100%" height={42} />
          </div>
          <OrderSummarySkeleton />
        </div>
      </div>
    );
  }

  if (!cartLoading && cartItems.length === 0) {
    return (
      <div className="page-wrap checkout-page-root" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <ResponsiveStyles />
        <p style={{ fontSize: '1.1rem', color: 'var(--ink-muted)' }}>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="page-wrap checkout-page-root">
      <ResponsiveStyles />

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
            <div className="card-luxury checkout-sticky">
              <p className="section-label">Shipping Details</p>

              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input
                  className={`form-input ${showErr('address') ? 'input-error' : ''}`}
                  name="address" placeholder="123 MG Road"
                  value={shipping.address}
                  onChange={handleShippingChange}
                  onBlur={handleShippingBlur}
                />
                {showErr('address') && <span className="field-error">{fieldErrors.address}</span>}
              </div>

              <div className="two-col">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    className={`form-input ${showErr('city') ? 'input-error' : ''}`}
                    name="city" placeholder="Bangalore"
                    value={shipping.city}
                    onChange={handleShippingChange}
                    onBlur={handleShippingBlur}
                  />
                  {showErr('city') && <span className="field-error">{fieldErrors.city}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    className={`form-input ${showErr('state') ? 'input-error' : ''}`}
                    name="state" placeholder="Karnataka"
                    value={shipping.state}
                    onChange={handleShippingChange}
                    onBlur={handleShippingBlur}
                  />
                  {showErr('state') && <span className="field-error">{fieldErrors.state}</span>}
                </div>
              </div>

              <div className="two-col">
                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input
                    className={`form-input ${showErr('pincode') ? 'input-error' : ''}`}
                    name="pincode" placeholder="560001" inputMode="numeric" maxLength={6}
                    value={shipping.pincode}
                    onChange={(e) => handleShippingChange({ target: { name: 'pincode', value: e.target.value.replace(/\D/g, '') } })}
                    onBlur={handleShippingBlur}
                  />
                  {showErr('pincode') && <span className="field-error">{fieldErrors.pincode}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    className={`form-input ${showErr('phone') ? 'input-error' : ''}`}
                    name="phone" placeholder="+91 98765 43210" inputMode="tel"
                    value={shipping.phone}
                    onChange={handleShippingChange}
                    onBlur={handleShippingBlur}
                  />
                  {showErr('phone') && <span className="field-error">{fieldErrors.phone}</span>}
                </div>
              </div>

              <div className="mt-2">
                <button className="btn-primary" onClick={handleShippingSubmit}>
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Payment method */}
          {step === 1 && (
            <div className="card-luxury checkout-sticky">
              <p className="section-label">Payment Method</p>
              <div className="payment-options">
                {[
                  { value: 'COD', label: 'Cash on Delivery', icon: '💵' },
                  { value: 'UPI', label: 'UPI', icon: '📱' },
                  { value: 'Card', label: 'Credit / Debit Card', icon: '💳' },
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
              <div className="mt-3 d-flex gap-1 checkout-btn-row">
                <button className="btn-outline" onClick={() => setStep(0)}>← Back</button>
                <button className="btn-primary" style={{ flex: 1 }} disabled={stripeLoading} onClick={handlePaymentContinue}>
                  {stripeLoading ? <><span className="spinner" /> Setting up…</> : 'Review Order →'}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="card-luxury checkout-sticky">
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
                <div className="order-item-row" key={item.productId}>
                  <ImageWithSkeleton className="order-item-img" src={item.image} alt={item.name} />
                  <div>
                    <div className="order-item-name">{item.name}</div>
                    <div className="order-item-meta">Qty: {item.quantity}</div>
                  </div>
                  <div className="order-item-price">₹{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}

              <div className="mt-2 text-muted">
                💳 Payment: <strong style={{ color: 'var(--ink-soft)' }}>{paymentMethod}</strong>
              </div>

              {(error || placeOrderErr) && <div className="alert-error mt-2">⚠ {placeOrderErr || error}</div>}

              {paymentMethod === 'Card' && clientSecret ? (
                <div className="mt-3">
                  <Elements key={clientSecret} stripe={stripePromise} options={{ clientSecret, appearance }}>
                    <StripeCardForm
                      totalPrice={totalPrice}
                      onConfirmed={handleCardPaymentConfirmed}
                      onBack={() => { setStep(1); setClientSecret(''); }}
                    />
                  </Elements>
                </div>
              ) : (
                <div className="mt-3 d-flex gap-1 checkout-btn-row">
                  <button className="btn-outline" onClick={() => { dispatch(clearError()); setPlaceOrderErr(''); setStep(1); }}>← Back</button>
                  <button className="btn-primary" style={{ flex: 1 }} onClick={handlePlaceOrder} disabled={loading}>
                    {loading ? <><span className="spinner" /> Placing order…</> : '✓ Place Order'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Order summary */}
     <div className="card-luxury checkout-sticky">
  <p className="section-label">Order Summary</p>
  {cartItems.map((item) => (
    <div 
      className="order-item-row" 
      key={item.productId}
      onClick={() => navigate(`/product/${item.productId}`)}
      style={{ cursor: 'pointer' }}
    >
      <ImageWithSkeleton className="order-item-img" src={item.image} alt={item.name} />
      <div style={{ flex: 1 }}>
        <div className="order-item-name">{item.name}</div>
        <div className="order-item-meta">× {item.quantity}</div>
      </div>
      <div className="order-item-price">₹{(item.price * item.quantity).toLocaleString()}</div>
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

/* ────────────────────────────────────────────────────────────────────
   Scoped responsive + skeleton CSS.
   Mounted once per page; doesn't touch the global stylesheet, just
   adds the missing mobile breakpoints and shimmer animation under the
   `.checkout-page-root` namespace so it can't leak into other pages.
──────────────────────────────────────────────────────────────────── */
const ResponsiveStyles = () => (
  <style>{`
    /* Everything below is scoped to .checkout-page-root and uses
       !important on layout-affecting rules. This is intentional:
       most global stylesheets define .checkout-layout / .two-col /
       .card-luxury etc. with the same specificity (class selectors),
       so without !important the cascade order of your build (global
       CSS vs. this inline <style>) decides the winner — which is why
       the breakpoints didn't visibly apply before. !important here
       guarantees these mobile rules always win inside this component. */

    .checkout-page-root, .checkout-page-root * {
      box-sizing: border-box;
    }

    .checkout-page-root .skel-bar {
      background: linear-gradient(90deg, #ececec 25%, #f6f6f6 37%, #ececec 63%);
      background-size: 400% 100%;
      animation: checkout-shimmer 1.4s ease infinite;
    }
    @keyframes checkout-shimmer {
      0% { background-position: 100% 50%; }
      100% { background-position: 0 50%; }
    }
    .checkout-page-root .order-item-img {
      width: 56px; height: 56px; border-radius: 10px; object-fit: cover; display: block;
    }
    .checkout-page-root .img-fallback {
      width: 56px; height: 56px; border-radius: 10px; display: flex; align-items: center;
      justify-content: center; background: var(--purple-pale, #f3f0ff); font-size: 1.2rem;
    }
    .checkout-page-root .field-error {
      display: block; color: var(--danger, #ef4444); font-size: 0.78rem; margin-top: 4px;
    }
    .checkout-page-root .input-error {
      border-color: var(--danger, #ef4444) !important;
    }
    .checkout-page-root .pe-skeleton { width: 100%; }
    .checkout-page-root .order-item-row {
      display: flex !important;
      align-items: center;
      gap: 0.75rem;
    }

    /* ── Base mobile-first guardrails (apply at ALL sizes) ───────── */
    .checkout-page-root {
      width: 100%;
      max-width: 100%;
      overflow-x: hidden;
    }
    .checkout-page-root .form-input {
      width: 100% !important;
      max-width: 100%;
    }
    .checkout-page-root img {
      max-width: 100%;
    }

    /* ── ≤ 1024px: tighten side padding, keep 2-col layout ───────── */
    @media (max-width: 1024px) {
      .checkout-page-root .checkout-layout {
        grid-template-columns: 1fr !important;
      }
    }

    /* ── ≤ 860px: tablet/mobile — stack everything ───────────────── */
    @media (max-width: 860px) {
      .checkout-page-root .checkout-layout {
        display: flex !important;
        flex-direction: column-reverse !important;
        grid-template-columns: none !important;
        gap: 1rem !important;
        width: 100% !important;
      }
      .checkout-page-root .checkout-layout > * {
        width: 100% !important;
      }
      .checkout-page-root .checkout-sticky {
        position: static !important;
        top: auto !important;
      }
      .checkout-page-root .two-col {
        display: flex !important;
        flex-direction: column !important;
        gap: 0.75rem !important;
      }
      .checkout-page-root .stepper {
        gap: 0.25rem !important;
        overflow-x: auto !important;
        padding-bottom: 4px;
        -webkit-overflow-scrolling: touch;
      }
      .checkout-page-root .step-label {
        font-size: 0.68rem !important;
      }
      .checkout-page-root .payment-options {
        display: flex !important;
        flex-direction: column !important;
        gap: 0.5rem !important;
      }
      .checkout-page-root .payment-option {
        width: 100% !important;
      }
      .checkout-page-root .checkout-btn-row {
        flex-direction: column-reverse !important;
      }
      .checkout-page-root .checkout-btn-row button {
        width: 100% !important;
      }
      .checkout-page-root .card-luxury {
        padding: 1rem !important;
        width: 100% !important;
      }
    }

    /* ── ≤ 480px: phones ──────────────────────────────────────────── */
    @media (max-width: 480px) {
      .checkout-page-root.page-wrap,
      .checkout-page-root .page-wrap {
        padding: 0.75rem !important;
      }
      .checkout-page-root .step-label {
        display: none !important;
      }
      .checkout-page-root .step-circle {
        width: 26px !important;
        height: 26px !important;
        font-size: 0.78rem !important;
      }
      .checkout-page-root .order-item-img,
      .checkout-page-root .img-fallback {
        width: 44px !important;
        height: 44px !important;
      }
      .checkout-page-root .order-item-name {
        font-size: 0.82rem !important;
      }
      .checkout-page-root .order-item-meta {
        font-size: 0.72rem !important;
      }
      .checkout-page-root .order-item-price {
        font-size: 0.82rem !important;
      }
      .checkout-page-root .section-label {
        font-size: 0.95rem !important;
      }
      .checkout-page-root .two-col {
        gap: 0.6rem !important;
      }
    }

    /* ── ≤ 360px: very small phones ───────────────────────────────── */
    @media (max-width: 360px) {
      .checkout-page-root .order-item-row {
        flex-wrap: wrap;
      }
      .checkout-page-root .order-item-price {
        margin-left: auto;
      }
    }
  `}</style>
);

export default CheckoutPage;