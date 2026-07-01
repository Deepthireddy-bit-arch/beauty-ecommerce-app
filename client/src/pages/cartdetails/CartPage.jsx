// CartPage.jsx — ShopHub Beauty Atelier | White + Purple Theme
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchCart,
  updateQuantityAsync,
  removeItemAsync,
} from "../../redux/reducers/thunks/cartThunks";
import "./Cart.css";

/* ─────────────────────────────────────────────
   SELECTORS
───────────────────────────────────────────── */
const selectItems   = (s) => s.cart.items;
const selectLoading = (s) => s.cart.loading;
const selectError   = (s) => s.cart.error;
const selectTotals  = (s) => {
  const items     = s.cart.items;
  const mrp       = items.reduce((sum, i) => sum + i.originalPrice * i.quantity, 0);
  const discount  = items.reduce((sum, i) => sum + (i.originalPrice - i.price) * i.quantity, 0);
  const payable   = mrp - discount;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  return { mrp, discount, payable, itemCount };
};

/* ─────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────── */
function CartSkeleton() {
  return (
    <>
      {/* Left col — item cards */}
      <div className="cart-items-col">
        {/* header bar skeleton */}
        <div className="cart-skeleton-header shimmer" />

        {/* 3 item row skeletons */}
        {[1, 2, 3].map((n) => (
          <div key={n} className="cart-skeleton-card">
            <div className="sk-img shimmer" />
            <div className="sk-body">
              <div className="sk-line w-30 shimmer" />
              <div className="sk-line w-70 shimmer" />
              <div className="sk-line w-55 shimmer" />
              <div className="sk-footer">
                <div className="sk-qty shimmer" />
                <div className="sk-price shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right col — summary skeleton */}
      <div className="cart-summary-col">
        <div className="cart-skeleton-summary-card">
          <div className="sk-line w-40 shimmer" style={{ height: 16 }} />
          {[70, 55, 45].map((w, i) => (
            <div key={i} className={`sk-line w-${w} shimmer`} style={{ height: 13 }} />
          ))}
          <div className="sk-line w-full shimmer" style={{ height: 46, marginTop: 8, borderRadius: 12 }} />
          <div className="sk-line w-55 shimmer" style={{ height: 13, margin: "12px auto 0" }} />
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   EMPTY CART
───────────────────────────────────────────── */
function EmptyCart() {
  return (
    <div className="empty-cart">
      <img
        src="/src/assets/nodata.avif"
        alt="Empty bag"
        className="empty-cart__img"
        onError={(e) => {
          e.target.style.display = "none";
          e.target.nextSibling.style.display = "block";
        }}
      />
      <span className="empty-cart__emoji" style={{ display: "none" }}>🛒</span>
      <h3 className="empty-cart__title">Your bag is empty</h3>
      <p className="empty-cart__sub">Looks like you haven't added anything yet.</p>
      <Link to="/products" className="empty-cart__cta">Explore products</Link>
    </div>
  );
}

/* ─────────────────────────────────────────────
   QUANTITY CONTROL
───────────────────────────────────────────── */
function QtyControl({ productId, quantity }) {
  const dispatch = useDispatch();
  return (
    <div className="qty-control" onClick={(e) => e.stopPropagation()}>
      <button
        className="qty-btn"
        onClick={(e) => { e.stopPropagation(); dispatch(updateQuantityAsync({ productId, quantity: quantity - 1 })); }}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
      >−</button>
      <span className="qty-display">{quantity}</span>
      <button
        className="qty-btn"
        onClick={(e) => { e.stopPropagation(); dispatch(updateQuantityAsync({ productId, quantity: quantity + 1 })); }}
        aria-label="Increase quantity"
      >+</button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CART ITEM
───────────────────────────────────────────── */
function CartItem({ item }) {
  const dispatch  = useDispatch();
  const navigate = useNavigate();
  const discount  = item.originalPrice > item.price
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0;

  const handleCardClick = () => {
    const productId = item.productId || item._id || item.id;
    navigate(`/product/${productId}`);
  };

  return (
    <div className="cart-item" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      {/* Image */}
      <div className="cart-item__img-wrap">
        <img
          src={item.image}
          alt={item.name}
          className="cart-item__img"
          onError={(e) => { e.target.src = ""; e.target.style.display = "none"; }}
        />
        {discount > 0 && (
          <span className="cart-item__discount-badge">{discount}% OFF</span>
        )}
      </div>

      {/* Body */}
      <div className="cart-item__body">
        <div className="cart-item__top">
          <div className="cart-item__meta">
            {item.brand && <span className="cart-item__brand">{item.brand}</span>}
            <p className="cart-item__name">{item.name}</p>
            {item.variant && (
              <span className="cart-item__variant">{item.variant}</span>
            )}
          </div>

          <button
            className="cart-item__remove"
            onClick={(e) => { e.stopPropagation(); dispatch(removeItemAsync({ productId: item.productId })); }}
            aria-label="Remove item"
            title="Remove"
          >✕</button>
        </div>

        <div className="cart-item__footer">
          <QtyControl productId={item.productId} quantity={item.quantity} />
          <div className="cart-item__prices">
            <span className="cart-item__price">₹{(item.price * item.quantity).toLocaleString()}</span>
            {item.originalPrice > item.price && (
              <span className="cart-item__mrp">₹{(item.originalPrice * item.quantity).toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PRICE SUMMARY (sticky on desktop)
───────────────────────────────────────────── */
function PriceSummary({ totals }) {
  const navigate = useNavigate();

  return (
    <div className="price-summary">
      <h3 className="price-summary__title">Price Details</h3>

      <div className="price-summary__rows">
        <div className="price-summary__row">
          <span>MRP ({totals.itemCount} {totals.itemCount === 1 ? "item" : "items"})</span>
          <span>₹{totals.mrp.toLocaleString()}</span>
        </div>
        <div className="price-summary__row">
          <span>Discount</span>
          <span className="price-summary__saving">−₹{totals.discount.toLocaleString()}</span>
        </div>
        <div className="price-summary__row">
          <span>Delivery</span>
          <span className="price-summary__saving">FREE</span>
        </div>
      </div>

      <div className="price-summary__divider" />

      <div className="price-summary__total">
        <span>Grand Total</span>
        <span>₹{totals.payable.toLocaleString()}</span>
      </div>

      {totals.discount > 0 && (
        <div className="price-summary__saving-strip">
          🎉 You save ₹{totals.discount.toLocaleString()} on this order
        </div>
      )}

      <button
        className="price-summary__cta"
        onClick={() => navigate("/checkoutpage")}
      >
        Proceed to Checkout <span>→</span>
      </button>

      <p className="price-summary__trust">🔒 100% Secure Payments</p>

      <div className="price-summary__offer">
        <span className="price-summary__offer-icon">✨</span>
        <div>
          <p className="price-summary__offer-title">Pink Summer Sale is Live!</p>
          <p className="price-summary__offer-sub">Extra discounts on all products</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MOBILE STICKY FOOTER
───────────────────────────────────────────── */
function StickyFooter({ totals }) {
  const navigate = useNavigate();
  return (
    <div className="sticky-footer">
      <div className="sticky-footer__left">
        <p className="sticky-footer__total">₹{totals.payable.toLocaleString()}</p>
        {totals.discount > 0 && (
          <p className="sticky-footer__saving">You save ₹{totals.discount.toLocaleString()}</p>
        )}
      </div>
      <button className="sticky-footer__btn" onClick={() => navigate("/checkoutpage")}>
        Checkout →
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items   = useSelector(selectItems);
  const loading = useSelector(selectLoading);
  const error   = useSelector(selectError);
  const totals  = useSelector(selectTotals);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  /* Full-page loading — first load, no items cached */
  if (loading && items.length === 0) {
    return (
      <div className="cart-page">
        <CartTopbar itemCount={0} loading />
        <div className="cart-layout">
          <CartSkeleton />
        </div>
      </div>
    );
  }
  /* CartSkeleton renders as two direct children of cart-layout (items-col + summary-col)
     so the flex layout works correctly — no wrapper div needed */

  if (error && items.length === 0) {
    return (
      <div className="cart-page">
        <CartTopbar itemCount={0} />
        <div className="cart-error">
          <span className="cart-error__icon">⚠️</span>
          <p className="cart-error__msg">Couldn't load your cart. Please try again.</p>
          <button className="cart-error__retry" onClick={() => dispatch(fetchCart())}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <CartTopbar itemCount={items.length} />

      <div className="cart-layout">
        {/* ── Left: item list ── */}
        <div className="cart-items-col">
          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="cart-items-card">
              <div className="cart-items-card__header">
                <span className="cart-items-card__heading">Items in your bag</span>
                <span className="cart-items-card__count">{items.length}</span>
              </div>

              {/* Subtle loading overlay while refreshing */}
              {loading && (
                <div className="cart-items-card__loading">Updating…</div>
              )}

              <div className="cart-items-list">
                {items.map((item, idx) => (
                  <div key={item.productId}>
                    <CartItem item={item} />
                    {idx < items.length - 1 && <div className="cart-item-divider" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: sticky summary ── */}
        {items.length > 0 && (
          <div className="cart-summary-col">
            <PriceSummary totals={totals} />
          </div>
        )}
      </div>

      {/* Mobile sticky footer */}
      {items.length > 0 && <StickyFooter totals={totals} />}
    </div>
  );
}

/* Small topbar — extracted to reuse in skeleton state */
function CartTopbar({ itemCount, loading }) {
  const navigate = useNavigate();
  return (
    <div className="cart-topbar">
      <div className="cart-topbar__inner">
        <div className="cart-topbar__left">
          <button className="cart-topbar__back" onClick={() => navigate(-1)} aria-label="Go back">
            ←
          </button>
          <span className="cart-topbar__title">
            My Bag
            {!loading && itemCount > 0 && (
              <span className="cart-topbar__badge">{itemCount}</span>
            )}
          </span>
        </div>
        <Link to="/wishlist" className="cart-topbar__wishlist">
          Wishlist ♡
        </Link>
      </div>
    </div>
  );
}