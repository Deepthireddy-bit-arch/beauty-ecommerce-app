import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyOrders, getOrderById } from '../../redux/reducers/thunks/orderThunks';

const StatusBadge = ({ status }) => {
  const map = {
    Pending:    'status-pending',
    Processing: 'status-processing',
    Shipped:    'status-shipped',
    Delivered:  'status-delivered',
    Cancelled:  'status-cancelled',
  };
  const icons = { Pending: '⏳', Processing: '⚙️', Shipped: '🚚', Delivered: '✅', Cancelled: '✗' };
  return (
    <span className={`status-badge ${map[status] || 'status-pending'}`}>
      {icons[status]} {status}
    </span>
  );
};

/* ── Tracking stepper ───────────────────────────────────────────────── */
const TRACKING_STEPS = [
  {
    key: 'Placed',
    label: 'Order Placed',
    desc: 'We received your order',
    icon: '🛍️',
  },
  {
    key: 'Confirmed',
    label: 'Confirmed',
    desc: 'Seller confirmed your order',
    icon: '✅',
  },
  {
    key: 'Shipped',
    label: 'Shipped',
    desc: 'Your order is on the way',
    icon: '🚚',
  },
  {
    key: 'Delivered',
    label: 'Delivered',
    desc: 'Package delivered successfully',
    icon: '📦',
  },
];

/**
 * Maps the order's `orderStatus` value to a step index (0-based).
 * Cancelled orders are handled separately.
 */
const statusToStep = (status) => {
  const map = {
    Pending:    0,   // "Order Placed"
    Processing: 1,   // "Confirmed"
    Shipped:    2,
    Delivered:  3,
    Cancelled:  -1,  // special case
  };
  return map[status] ?? 0;
};

const OrderTracker = ({ status }) => {
  const isCancelled = status === 'Cancelled';
  const activeStep  = statusToStep(status);

  return (
    <div style={{ margin: '1.2rem 0 0.4rem' }}>
      <p className="section-label" style={{ marginBottom: '1rem' }}>Order Tracking</p>

      {isCancelled ? (
        /* ── Cancelled banner ── */
        <div style={{
          background: '#fff1f1',
          border: '1.5px solid #fca5a5',
          borderRadius: 'var(--radius)',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          color: '#b91c1c',
          fontSize: '0.88rem',
          fontWeight: 600,
        }}>
          <span style={{ fontSize: '1.2rem' }}>✗</span>
          This order has been cancelled.
        </div>
      ) : (
        /* ── Stepper ── */
        <div style={{ position: 'relative' }}>

          {/* Connector track (background grey line) */}
          <div style={{
            position: 'absolute',
            top: 20,
            left: 20,
            right: 20,
            height: 3,
            background: 'var(--border, #e5e7eb)',
            borderRadius: 99,
            zIndex: 0,
          }} />

          {/* Filled progress line */}
          <div style={{
            position: 'absolute',
            top: 20,
            left: 20,
            height: 3,
            borderRadius: 99,
            background: 'linear-gradient(90deg, var(--purple-mid, #7c3aed), var(--purple-deep, #5b21b6))',
            zIndex: 1,
            transition: 'width 0.6s ease',
            // Each gap is 1/3 of the full width between first and last dot
            width: activeStep === 0 ? '0%'
                 : activeStep === 1 ? '33.3%'
                 : activeStep === 2 ? '66.6%'
                 : '100%',
          }} />

          {/* Steps row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            position: 'relative',
            zIndex: 2,
          }}>
            {TRACKING_STEPS.map((step, idx) => {
              const done    = idx <= activeStep;
              const current = idx === activeStep;

              return (
                <div key={step.key} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.45rem',
                }}>
                  {/* Circle */}
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: current ? '1.2rem' : '1rem',
                    background: done
                      ? 'linear-gradient(135deg, var(--purple-mid, #7c3aed), var(--purple-deep, #5b21b6))'
                      : 'var(--purple-ghost, #f3f0ff)',
                    border: current
                      ? '2.5px solid var(--purple-deep, #5b21b6)'
                      : done
                        ? '2.5px solid var(--purple-deep, #5b21b6)'
                        : '2px solid var(--border, #e5e7eb)',
                    boxShadow: current ? '0 0 0 4px rgba(124,58,237,0.15)' : 'none',
                    transition: 'all 0.3s ease',
                    filter: done ? 'none' : 'grayscale(0.6) opacity(0.5)',
                  }}>
                    {step.icon}
                  </div>

                  {/* Label */}
                  <p style={{
                    margin: 0,
                    fontSize: '0.72rem',
                    fontWeight: current ? 700 : done ? 600 : 400,
                    color: done ? 'var(--purple-deep, #5b21b6)' : 'var(--ink-muted, #9ca3af)',
                    textAlign: 'center',
                    lineHeight: 1.3,
                  }}>
                    {step.label}
                  </p>

                  {/* Sub-desc — only for current step */}
                  {current && (
                    <p style={{
                      margin: 0,
                      fontSize: '0.65rem',
                      color: 'var(--ink-muted, #9ca3af)',
                      textAlign: 'center',
                      lineHeight: 1.3,
                    }}>
                      {step.desc}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Modal ──────────────────────────────────────────────────────────── */
const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(26,16,51,0.45)',
      backdropFilter: 'blur(4px)', zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }} onClick={onClose}>
      <div
        style={{
          background: 'var(--white)', borderRadius: 'var(--radius-lg)',
          padding: '1.8rem', maxWidth: 520, width: '100%',
          maxHeight: '85vh', overflowY: 'auto',
          boxShadow: 'var(--shadow-lg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="d-flex justify-between align-center mb-2" style={{ marginBottom: '1rem' }}>
          <div>
            <p className="section-label" style={{ marginBottom: 2 }}>Order Details</p>
            <p style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
              #{order._id}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '1.2rem', color: 'var(--ink-muted)', lineHeight: 1,
          }}>✕</button>
        </div>

        {/* ── TRACKING STEPPER ── */}
        <OrderTracker status={order.orderStatus} />

        <hr className="divider" style={{ margin: '1.2rem 0' }} />

        {/* Meta grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem', marginBottom: '1rem' }}>
          {[
            { label: 'Status',  value: <StatusBadge status={order.orderStatus} /> },
            { label: 'Payment', value: order.paymentMethod },
            { label: 'Date',    value: new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
            { label: 'Total',   value: `₹${order.totalPrice?.toLocaleString()}` },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: 'var(--purple-ghost)', borderRadius: 'var(--radius)', padding: '0.6rem 0.8rem' }}>
              <p className="text-muted" style={{ marginBottom: 2 }}>{label}</p>
              <p className="fw-600" style={{ fontSize: '0.9rem' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Items */}
        <p className="section-label">Items</p>
        {order.orderItems?.map((item, i) => (
          <div className="order-item-row" key={i}>
            {item.image && (
              <img className="order-item-img" src={item.image} alt={item.name}
                onError={(e) => { e.target.style.background = 'var(--purple-pale)'; }} />
            )}
            <div style={{ flex: 1 }}>
              <div className="order-item-name">{item.name}</div>
              <div className="order-item-meta">Qty: {item.qty} × ₹{item.price?.toLocaleString()}</div>
            </div>
            <div className="order-item-price">₹{(item.price * item.qty).toLocaleString()}</div>
          </div>
        ))}

        <hr className="divider" />

        {/* Shipping */}
        <p className="section-label">Shipping Address</p>
        <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          {order.shippingAddress?.address}, {order.shippingAddress?.city},<br />
          {order.shippingAddress?.state} – {order.shippingAddress?.pincode}<br />
          📞 {order.shippingAddress?.phone}
        </p>
      </div>
    </div>
  );
};

/* ── Page ───────────────────────────────────────────────────────────── */
const MyOrdersPage = () => {
  const dispatch = useDispatch();
  const { myOrders, selectedOrder, loading, error } = useSelector((s) => s.order);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  const handleViewOrder = (id) => {
    dispatch(getOrderById(id));
    setModalOpen(true);
  };

  return (
    <div className="page-wrap">
      <h1 className="page-title">My Orders</h1>
      <p className="page-subtitle">{myOrders.length} order{myOrders.length !== 1 ? 's' : ''} placed</p>

      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ink-muted)' }}>
          <div className="spinner" style={{ borderColor: 'rgba(108,60,225,0.2)', borderTopColor: 'var(--purple-mid)', width: 28, height: 28, borderWidth: 3 }} />
          <p style={{ marginTop: '1rem' }}>Loading your orders…</p>
        </div>
      )}

      {error && <div className="alert-error">⚠ {error}</div>}

      {!loading && myOrders.length === 0 && (
        <div className="empty-state">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛍️</div>
          <h3>No orders yet</h3>
          <p>Your placed orders will appear here.</p>
        </div>
      )}

      {myOrders.map((order) => (
        <div className="order-card" key={order._id}>
          <div className="order-card-header">
            <div>
              <span className="order-card-id">Order #{order._id.slice(-8).toUpperCase()}</span>
            </div>
            <div className="d-flex align-center gap-1" style={{ gap: '0.7rem' }}>
              <StatusBadge status={order.orderStatus} />
              <button
                className="btn-outline"
                style={{ padding: '0.3rem 0.9rem', fontSize: '0.8rem' }}
                onClick={() => handleViewOrder(order._id)}
              >
                View Details
              </button>
            </div>
          </div>

          <div className="order-card-body">
            <div className="d-flex align-center" style={{ gap: '0.6rem', marginBottom: '0.9rem', flexWrap: 'wrap' }}>
              {order.orderItems?.slice(0, 4).map((item, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  {item.image ? (
                    <img
                      src={item.image} alt={item.name}
                      style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }}
                      onError={(e) => { e.target.style.background = 'var(--purple-pale)'; e.target.src = ''; }}
                    />
                  ) : (
                    <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--purple-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--purple-mid)' }}>
                      {item.name?.[0]}
                    </div>
                  )}
                </div>
              ))}
              {order.orderItems?.length > 4 && (
                <span style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
                  +{order.orderItems.length - 4} more
                </span>
              )}
            </div>

            <div className="order-card-meta">
              <span>📅 {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span>🛒 {order.orderItems?.length} item(s)</span>
              <span>💳 {order.paymentMethod}</span>
              <span style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--purple-deep)', fontSize: '0.95rem' }}>
                ₹{order.totalPrice?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ))}

      {modalOpen && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MyOrdersPage;