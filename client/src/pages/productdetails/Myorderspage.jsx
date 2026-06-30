
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from '../../redux/reducers/thunks/orderThunks';
import './MyOrdersPage.css';  // ← ADD THIS IMPORT

// ─── Constants ──────────────────────────────────────────────────────────────

const STATUS_OPTIONS = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_CFG = {
  Pending:    { icon: '⏳', accent: '#f59e0b', bg: '#fef9e7', border: '#fde68a', text: '#92400e', dot: '#f59e0b' },
  Processing: { icon: '⚙️', accent: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', dot: '#3b82f6' },
  Shipped:    { icon: '🚚', accent: '#10b981', bg: '#ecfdf5', border: '#a7f3d0', text: '#065f46', dot: '#10b981' },
  Delivered:  { icon: '✅', accent: '#059669', bg: '#f0fdf4', border: '#86efac', text: '#14532d', dot: '#059669' },
  Cancelled:  { icon: '✕',  accent: '#ef4444', bg: '#fff1f1', border: '#fca5a5', text: '#991b1b', dot: '#ef4444' },
};

// ─── Atoms ──────────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CFG[status] || STATUS_CFG.Pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      padding: '0.25rem 0.7rem', borderRadius: '99px',
      background: cfg.bg, color: cfg.text,
      border: `1.5px solid ${cfg.border}`,
      fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap',
      letterSpacing: '0.01em',
    }}>
      <span style={{ fontSize: '0.78em' }}>{cfg.icon}</span>
      {status}
    </span>
  );
};

const Skeleton = ({ w = '100%', h = 14, r = 6 }) => (
  <span style={{
    display: 'inline-block', width: w, height: h, borderRadius: r,
    background: 'linear-gradient(90deg,#ede9f8 25%,#f5f3fd 50%,#ede9f8 75%)',
    backgroundSize: '300% 100%',
    animation: 'orders-shimmer 1.6s ease-in-out infinite',
  }} />
);

const ProductThumb = ({ src, alt, size = 48 }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError]   = useState(false);

  const initials = (alt || '?')[0].toUpperCase();

  if (!src || error) {
    return (
      <div style={{
        width: size, height: size, borderRadius: 10, flexShrink: 0,
        background: '#ede9fe', color: '#7c3aed',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: size * 0.36,
      }}>
        {initials}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {!loaded && (
        <span style={{
          position: 'absolute', inset: 0, borderRadius: 10,
          background: 'linear-gradient(90deg,#ede9f8 25%,#f5f3fd 50%,#ede9f8 75%)',
          backgroundSize: '300% 100%',
          animation: 'orders-shimmer 1.6s ease-in-out infinite',
        }} />
      )}
      <img
        src={src} alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{
          width: size, height: size, borderRadius: 10,
          objectFit: 'cover', border: '1.5px solid #ede9fe',
          opacity: loaded ? 1 : 0, transition: 'opacity 0.2s', display: 'block',
        }}
      />
    </div>
  );
};

// ─── Card Skeleton ───────────────────────────────────────────────────────────

const OrderCardSkeleton = () => (
  <div style={{
    display: 'flex', borderRadius: 16,
    background: '#fff', border: '1px solid #ede9fe', overflow: 'hidden',
  }}>
    <div style={{ width: 5, background: '#ede9fe', flexShrink: 0 }} />
    <div style={{ flex: 1, padding: '1rem 1.3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.9rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton w={150} h={14} r={4} />
          <Skeleton w={90} h={10} r={4} />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Skeleton w={80} h={24} r={99} />
          <Skeleton w={90} h={32} r={8} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: '0.75rem' }}>
        {[0, 1, 2].map(i => <Skeleton key={i} w={48} h={48} r={10} />)}
      </div>
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
        <Skeleton w={90} h={10} /><Skeleton w={70} h={10} /><Skeleton w={60} h={14} style={{ marginLeft: 'auto' }} />
      </div>
    </div>
  </div>
);

// ─── Order Card ──────────────────────────────────────────────────────────────

const OrderCard = ({ order, onView }) => {
  const cfg = STATUS_CFG[order.orderStatus] || STATUS_CFG.Pending;

  return (
    <article style={{
      display: 'flex', borderRadius: 16,
      background: '#fff', border: '1px solid #ede9fe', overflow: 'hidden',
      transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.15s',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(108,60,225,0.10)';
        e.currentTarget.style.borderColor = '#c4b5fd';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#ede9fe';
        e.currentTarget.style.transform = 'none';
      }}
    >
      {/* Left accent stripe */}
      <div style={{ width: 5, background: cfg.accent, flexShrink: 0 }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Top row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '0.6rem',
          padding: '0.95rem 1.3rem 0.8rem',
          borderBottom: '1px solid #f5f3fd',
          background: '#faf9ff',
        }}>
          <div>
            <p style={{
              fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 700,
              color: '#1a1033', letterSpacing: '0.04em', margin: '0 0 3px',
            }}>
              #{order._id.slice(-8).toUpperCase()}
            </p>
            <p style={{ fontSize: '0.73rem', color: '#9ca3af', margin: 0 }}>
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <StatusBadge status={order.orderStatus} />
            <button
              onClick={() => onView(order._id)}
              style={{
                padding: '0.38rem 1rem', borderRadius: 8,
                background: 'transparent', color: '#1a1033',
                border: '1.5px solid #d4c8f0', fontWeight: 600,
                fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.18s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#7c3aed';
                e.currentTarget.style.color = '#7c3aed';
                e.currentTarget.style.background = '#f5f3ff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#d4c8f0';
                e.currentTarget.style.color = '#1a1033';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              View Details
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '0.9rem 1.3rem 1rem' }}>
          {/* Thumbnails */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            {order.orderItems?.slice(0, 4).map((item, i) => (
              <ProductThumb key={i} src={item.image} alt={item.name} size={48} />
            ))}
            {order.orderItems?.length > 4 && (
              <div style={{
                width: 48, height: 48, borderRadius: 10,
                background: '#f3f0ff', border: '1.5px dashed #c4b5fd',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.73rem', fontWeight: 700, color: '#7c3aed',
              }}>
                +{order.orderItems.length - 4}
              </div>
            )}
          </div>

          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <Pill>🛒 {order.orderItems?.length} {order.orderItems?.length !== 1 ? 'items' : 'item'}</Pill>
            <Pill>💳 {order.paymentMethod}</Pill>
            <span style={{ marginLeft: 'auto', fontWeight: 700, fontSize: '1rem', color: '#5b21b6' }}>
              ₹{order.totalPrice?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

const Pill = ({ children }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
    background: '#f5f3ff', borderRadius: 99,
    padding: '0.2rem 0.65rem', fontSize: '0.75rem', color: '#4b4570',
  }}>
    {children}
  </span>
);

// ─── Empty State ─────────────────────────────────────────────────────────────

const EmptyState = ({ icon, title, body, action }) => (
  <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#9ca3af' }}>
    <div style={{ fontSize: '3.2rem', marginBottom: '1rem' }}>{icon}</div>
    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1033', margin: '0 0 0.4rem' }}>{title}</h3>
    <p style={{ fontSize: '0.87rem', margin: 0 }}>{body}</p>
    {action && <div style={{ marginTop: '1.2rem' }}>{action}</div>}
  </div>
);

// ─── Page ────────────────────────────────────────────────────────────────────

const MyOrdersPage = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { myOrders = [], loading, error } = useSelector(s => s.order);

  const [statusFilter, setStatusFilter] = useState('All');
  const [search,       setSearch]       = useState('');
  const [sortOrder,    setSortOrder]    = useState('newest');

  useEffect(() => { dispatch(getMyOrders()); }, [dispatch]);

  const handleView = useCallback((id) => {
    navigate(`/orders/${id}`);
  }, [navigate]);

  const clearFilters = () => { setStatusFilter('All'); setSearch(''); setSortOrder('newest'); };
  const filtersActive = statusFilter !== 'All' || search.trim() !== '';

  const filtered = useMemo(() => {
    let list = [...myOrders];
    if (statusFilter !== 'All') list = list.filter(o => o.orderStatus === statusFilter);
    const q = search.trim().toLowerCase();
    if (q) list = list.filter(o =>
      o._id.toLowerCase().includes(q) ||
      o.orderItems?.some(i => i.name?.toLowerCase().includes(q))
    );
    list.sort((a, b) => {
      const diff = new Date(b.createdAt) - new Date(a.createdAt);
      return sortOrder === 'newest' ? diff : -diff;
    });
    return list;
  }, [myOrders, statusFilter, search, sortOrder]);

  return (
    // ↓ className replaces the inline maxWidth/margin/padding
    <div className="orders-page">
      <OrdersGlobalStyles />

      {/* Header */}
      <div style={{ marginBottom: '1.8rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1a1033', margin: '0 0 4px' }}>
          My Orders
        </h1>
        <p style={{ fontSize: '0.87rem', color: '#9ca3af', margin: 0 }}>
          {loading
            ? 'Loading your orders…'
            : `${myOrders.length} order${myOrders.length !== 1 ? 's' : ''} placed`}
        </p>
      </div>

      {/* Toolbar */}
      {!loading && myOrders.length > 0 && (
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '0.6rem',
          marginBottom: '1.6rem', alignItems: 'center',
        }}>
          <input
            className="orders-input"
            placeholder="Search by order ID or item name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: '2 1 220px', minWidth: 0 }}
          />
          <select
            className="orders-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ flex: '1 1 140px', minWidth: 0 }}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s === 'All' ? 'All statuses' : s}</option>
            ))}
          </select>
          <select
            className="orders-select"
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
            style={{ flex: '1 1 140px', minWidth: 0 }}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
          {filtersActive && (
            <button className="orders-ghost-btn" onClick={clearFilters} style={{ whiteSpace: 'nowrap' }}>
              ✕ Clear
            </button>
          )}
        </div>
      )}

      {/* Status filter pills */}
      {!loading && myOrders.length > 0 && (
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1.4rem' }}>
          {STATUS_OPTIONS.map(s => {
            const active = statusFilter === s;
            const cfg    = s !== 'All' ? STATUS_CFG[s] : null;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '0.28rem 0.8rem', borderRadius: 99, fontSize: '0.75rem',
                  fontWeight: active ? 700 : 500, cursor: 'pointer',
                  border: active
                    ? `2px solid ${cfg?.accent || '#7c3aed'}`
                    : '1.5px solid #ede9fe',
                  background: active ? (cfg?.bg || '#f5f3ff') : '#fff',
                  color: active ? (cfg?.text || '#5b21b6') : '#6b7280',
                  transition: 'all 0.15s',
                }}
              >
                {s !== 'All' && <span style={{ marginRight: 3 }}>{cfg?.icon}</span>}
                {s}
              </button>
            );
          })}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[0, 1, 2].map(i => <OrderCardSkeleton key={i} />)}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div style={{
          background: '#fff1f1', border: '1.5px solid #fca5a5',
          borderRadius: 10, padding: '0.8rem 1rem',
          color: '#991b1b', fontSize: '0.87rem',
        }}>
          ⚠ {error}
        </div>
      )}

      {/* Empty states */}
      {!loading && myOrders.length === 0 && (
        <EmptyState
          icon="🛍️"
          title="No orders yet"
          body="Your placed orders will appear here once you complete a purchase."
        />
      )}
      {!loading && myOrders.length > 0 && filtered.length === 0 && (
        <EmptyState
          icon="🔍"
          title="No matching orders"
          body="Try a different search term or status filter."
          action={
            <button className="orders-outline-btn" onClick={clearFilters}>
              Clear filters
            </button>
          }
        />
      )}

      {/* Cards */}
      {!loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(order => (
            <OrderCard key={order._id} order={order} onView={handleView} />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Global Styles ────────────────────────────────────────────────────────────

const OrdersGlobalStyles = () => (
  <style>{`
    @keyframes orders-shimmer {
      0%   { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .orders-input {
      height: 40px;
      padding: 0 0.9rem;
      border-radius: 8px;
      border: 1.5px solid #e8e2f5;
      background: #fff;
      font-size: 0.85rem;
      color: #1a1033;
    
      outline: none;
      transition: border-color 0.18s;
    }
    .orders-input:focus {
      border-color: #7c3aed;
      box-shadow: 0 0 0 3px rgba(124,58,237,0.10);
    }
    .orders-input::placeholder { color: #b0a7cc; }

    .orders-select {
      height: 40px;
      padding: 0 0.9rem;
      border-radius: 8px;
      border: 1.5px solid #e8e2f5;
      background: #fff;
      font-size: 0.85rem;
      color: #1a1033;
    
      outline: none;
      cursor: pointer;
      transition: border-color 0.18s;
    }
    .orders-select:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.10); }

    .orders-ghost-btn {
      height: 40px;
      padding: 0 1rem;
      border-radius: 8px;
      background: #f5f3ff;
      color: #5b21b6;
      border: 1px solid #e8e2f5;
      font-weight: 600;
      font-size: 0.84rem;
      cursor: pointer;
    
      transition: background 0.15s;
    }
    .orders-ghost-btn:hover { background: #ede9fe; }

    .orders-outline-btn {
      padding: 0.45rem 1.1rem;
      border-radius: 8px;
      background: transparent;
      color: #1a1033;
      border: 1.5px solid #d4c8f0;
      font-weight: 600;
      font-size: 0.84rem;
      cursor: pointer;
    
      transition: all 0.15s;
    }
    .orders-outline-btn:hover { border-color: #7c3aed; color: #7c3aed; background: #f5f3ff; }

    @media (max-width: 600px) {
      .orders-input, .orders-select {
        flex: 1 1 100% !important;
      }
    }
  `}</style>
);

export default MyOrdersPage;