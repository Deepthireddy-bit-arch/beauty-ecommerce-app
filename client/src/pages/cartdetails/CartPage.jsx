// CartPage.jsx — React + Redux + Bootstrap | White + Purple Theme
// Fully integrated with backend cart API (no coupons)

import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "../../redux/store";
import {
  fetchCart,
  updateQuantityAsync,
  removeItemAsync,
} from "../../redux/reducers/thunks/cartThunks";
import FeaturedProductsSection from "../../components/FeaturedProductsSection";
import BestSellersSection from "../../components/BestSellers";

/* ─────────────────────────────────────────────
   SELECTORS (inline – no external file needed)
───────────────────────────────────────────── */
const selectItems = (state) => state.cart.items;
const selectLoading = (state) => state.cart.loading;
const selectError = (state) => state.cart.error;

const selectTotals = (state) => {
  const items = state.cart.items;
  const mrp = items.reduce((sum, i) => sum + (i.originalPrice * i.quantity), 0);
  const discount = items.reduce((sum, i) => sum + ((i.originalPrice - i.price) * i.quantity), 0);
  const payable = mrp - discount;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  return { mrp, discount, payable, itemCount };
};

/* ─────────────────────────────────────────────
   SUBCOMPONENTS
───────────────────────────────────────────── */
function QuantityControl({ productId, quantity }) {
  const dispatch = useDispatch();
  return (
    <div className="qty-control d-flex align-items-center gap-2">
      <button
        className="qty-btn"
        onClick={() => dispatch(updateQuantityAsync({ productId, quantity: quantity - 1 }))}
        disabled={quantity <= 1}
      >−</button>
      <span className="qty-value">{quantity}</span>
      <button
        className="qty-btn"
        onClick={() => dispatch(updateQuantityAsync({ productId, quantity: quantity + 1 }))}
      >+</button>
    </div>
  );
}

function CartItem({ item }) {
  const dispatch = useDispatch();
  const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);

  return (
    <div className="cart-item d-flex gap-3 align-items-start">
      <div className="item-img-wrap">
        <img src={item.image} alt={item.name} className="item-img" />
        <span className="discount-badge">{discount}% OFF</span>
      </div>

      <div className="flex-grow-1">
        <p className="item-name">{item.name}</p>
        <span className="variant-chip">{item.variant}</span>

        <div className="d-flex align-items-center justify-content-between mt-2">
          <QuantityControl productId={item.productId} quantity={item.quantity} />
          <div className="text-end">
            <span className="item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
            <span className="item-mrp ms-2">₹{(item.originalPrice * item.quantity).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <button
        className="remove-btn"
        onClick={() => dispatch(removeItemAsync({ productId: item.productId }))}
        title="Remove item"
      >✕</button>
    </div>
  );
}

function PriceDetails() {
  const totals = useSelector(selectTotals);
  const rows = [
    { label: `MRP (${totals.itemCount} items)`, value: `₹${totals.mrp.toLocaleString()}` },
    { label: "Product Discount", value: `-₹${totals.discount.toLocaleString()}`, green: true },
    { label: "Delivery Charges", value: "FREE", green: true },
  ];

  return (
    <div className="price-details">
      <div className="pd-title d-flex align-items-center justify-content-between">
        <span>Price Details</span>
        <span className="pd-total">₹{totals.payable.toLocaleString()}</span>
      </div>
      <hr className="pd-divider" />
      {rows.map((r, i) => (
        <div key={i} className="pd-row d-flex justify-content-between">
          <span className="pd-label">{r.label}</span>
          <span className={`pd-value ${r.green ? "text-saving" : ""}`}>{r.value}</span>
        </div>
      ))}
      <hr className="pd-divider" />
      <div className="pd-row d-flex justify-content-between fw-bold">
        <span>Grand Total</span>
        <span>₹{totals.payable.toLocaleString()}</span>
      </div>
      {totals.discount > 0 && (
        <div className="saving-strip">
          🎉 You are saving ₹{totals.discount.toLocaleString()} on this order
        </div>
      )}
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="empty-cart text-center py-5">
      <div className="empty-icon">🛒</div>
      <p className="empty-title">Your bag is empty</p>
      <p className="empty-sub">Add items to it now</p>
      <button className="btn-shop">Shop Now</button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN CART PAGE
───────────────────────────────────────────── */
function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const totals = useSelector(selectTotals);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (loading && items.length === 0) {
    return <div className="text-center py-5">Loading your cart...</div>;
  }

  if (error && items.length === 0) {
    return <div className="text-center py-5 text-danger">Error: {error}</div>;
  }

  return (
    <div className="cart-page">
      {/* Header */}
      <div className="cart-topbar d-flex align-items-center justify-content-between px-4">
        <div className="d-flex align-items-center gap-3">
          <button className="back-btn">←</button>
          <span className="topbar-title">
            My Bag
            <span className="item-count-badge">{items.length} items</span>
          </span>
        </div>
        <button className="wishlist-link">View Wishlist ♡</button>
      </div>

      <div className="cart-body container-fluid px-3 px-md-4">
        <div className="row g-4">
          {/* Left: items */}
          <div className="col-12 col-lg-7">
            {items.length === 0 ? (
              <EmptyCart />
            ) : (
              <div className="items-card">
                <p className="items-heading">
                  Items in your bag
                  <span className="items-count">{items.length}</span>
                </p>
                <div className="items-list">
                  {items.map((item, idx) => (
                    <div key={item.productId}>
                      <CartItem item={item} />
                      {idx < items.length - 1 && <hr className="item-divider" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: summary */}
          {items.length > 0 && (
            <div className="col-12 col-lg-5">
              <PriceDetails />

              <button className="btn-proceed w-100">
                Proceed to Checkout
                <span className="proceed-arrow">→</span>
              </button>

              <div className="safe-checkout d-flex align-items-center justify-content-center gap-2 mt-3">
                <span>🔒</span>
                <span>100% Secure Payments</span>
              </div>

              {/* Static offers banner (no coupon functionality) */}
              <div className="offers-banner mt-3">
                <span className="offer-icon">✨</span>
                <div>
                  <p className="offer-title">Pink Summer Sale is Live!</p>
                  <p className="offer-sub">Get extra discounts on all products</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky footer on mobile */}
      {items.length > 0 && (
        <div className="sticky-footer d-flex d-lg-none align-items-center justify-content-between px-4">
          <div>
            <p className="sf-total">₹{totals.payable.toLocaleString()}</p>
            <p className="sf-saving">Saving ₹{totals.discount.toLocaleString()}</p>
          </div>
          <button className="btn-proceed-sm">Proceed →</button>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   STYLES (same as original – coupon styles removed)
───────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600&display=swap');
  @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css');

  :root {
    --purple:       #6a0dad;
    --purple-light: #9b59b6;
    --purple-pale:  #f3e8ff;
    --purple-mid:   #d8b4fe;
    --accent:       #c084fc;
    --pink:         #ec4899;
    --white:        #ffffff;
    --off-white:    #fafafa;
    --border:       #e8d5f5;
    --text-main:    #1a1a2e;
    --text-muted:   #6b7280;
    --text-saving:  #16a34a;
    --shadow-sm:    0 2px 8px rgba(106,13,173,0.08);
    --shadow-md:    0 4px 20px rgba(106,13,173,0.14);
  }

  * { box-sizing: border-box; }

  body, .cart-page {
    font-family: 'DM Sans', sans-serif;
    background: var(--off-white);
    color: var(--text-main);
    min-height: 100vh;
  }

  .cart-topbar {
    background: var(--white);
    border-bottom: 2px solid var(--purple-pale);
    padding: 14px 24px;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: var(--shadow-sm);
  }
  .back-btn {
    background: var(--purple-pale);
    border: none;
    border-radius: 50%;
    width: 36px; height: 36px;
    font-size: 16px;
    color: var(--purple);
    cursor: pointer;
    transition: background .2s;
  }
  .back-btn:hover { background: var(--purple-mid); }
  .topbar-title {
    font-size: 18px;
    font-weight: 700;
    font-family: 'Playfair Display', serif;
    color: var(--purple);
    display: flex; align-items: center; gap: 8px;
  }
  .item-count-badge {
    background: var(--purple);
    color: #fff;
    font-size: 11px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 20px;
  }
  .wishlist-link {
    background: none;
    border: 1.5px solid var(--purple-light);
    color: var(--purple);
    font-size: 13px;
    font-weight: 500;
    padding: 6px 14px;
    border-radius: 20px;
    cursor: pointer;
    transition: all .2s;
  }
  .wishlist-link:hover {
    background: var(--purple-pale);
  }
  .cart-body { padding-top: 24px; padding-bottom: 100px; }
  .items-card {
    background: var(--white);
    border-radius: 16px;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    margin-bottom: 16px;
  }
  .items-heading {
    font-size: 14px;
    font-weight: 600;
    color: var(--purple);
    padding: 14px 20px;
    margin: 0;
    background: var(--purple-pale);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .items-count {
    background: var(--purple);
    color: #fff;
    font-size: 11px;
    padding: 1px 7px;
    border-radius: 10px;
  }
  .items-list { padding: 4px 0; }
  .item-divider { margin: 0 20px; border-color: var(--border); }
  .cart-item {
    padding: 16px 20px;
    transition: background .2s;
  }
  .cart-item:hover { background: #fdf8ff; }
  .item-img-wrap { position: relative; flex-shrink: 0; }
  .item-img {
    width: 80px;
    height: 100px;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid var(--border);
  }
  .discount-badge {
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--pink);
    color: #fff;
    font-size: 9px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 8px;
    white-space: nowrap;
  }
  .item-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-main);
    margin: 0 0 6px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .variant-chip {
    background: var(--purple-pale);
    color: var(--purple);
    font-size: 11px;
    font-weight: 500;
    padding: 2px 10px;
    border-radius: 12px;
    border: 1px solid var(--purple-mid);
  }
  .item-price {
    font-size: 15px;
    font-weight: 700;
    color: var(--text-main);
  }
  .item-mrp {
    font-size: 12px;
    color: var(--text-muted);
    text-decoration: line-through;
  }
  .remove-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 14px;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 6px;
    transition: all .2s;
    flex-shrink: 0;
  }
  .remove-btn:hover {
    color: #ef4444;
    background: #fee2e2;
  }
  .qty-btn {
    width: 28px; height: 28px;
    background: var(--white);
    border: 1.5px solid var(--purple-light);
    color: var(--purple);
    font-size: 16px;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all .2s;
    line-height: 1;
  }
  .qty-btn:hover:not(:disabled) {
    background: var(--purple);
    color: #fff;
    border-color: var(--purple);
  }
  .qty-btn:disabled { opacity: .4; cursor: not-allowed; }
  .qty-value {
    font-size: 14px;
    font-weight: 600;
    min-width: 22px;
    text-align: center;
  }
  .price-details {
    background: var(--white);
    border-radius: 16px;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    padding: 20px;
    margin-bottom: 16px;
  }
  .pd-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--text-main);
  }
  .pd-total { font-size: 17px; color: var(--purple); font-weight: 700; }
  .pd-divider { border-color: var(--border); margin: 12px 0; }
  .pd-row { margin-bottom: 10px; font-size: 13.5px; }
  .pd-label { color: var(--text-muted); }
  .pd-value { font-weight: 500; }
  .text-saving { color: var(--text-saving) !important; }
  .saving-strip {
    background: linear-gradient(90deg, #f3e8ff 0%, #fce7f3 100%);
    border: 1px dashed var(--purple-mid);
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 500;
    color: var(--purple);
    margin-top: 14px;
    text-align: center;
  }
  .btn-proceed {
    background: linear-gradient(135deg, var(--purple) 0%, var(--purple-light) 100%);
    color: #fff;
    border: none;
    border-radius: 14px;
    padding: 15px 24px;
    font-size: 15px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: .3px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-shadow: 0 6px 20px rgba(106,13,173,0.35);
    transition: all .25s;
  }
  .btn-proceed:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(106,13,173,0.4);
  }
  .proceed-arrow { font-size: 18px; }
  .safe-checkout {
    font-size: 12px;
    color: var(--text-muted);
  }
  .offers-banner {
    background: linear-gradient(135deg, #fdf4ff 0%, #fff0fb 100%);
    border: 1.5px solid var(--purple-mid);
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .offer-icon { font-size: 22px; }
  .offer-title { font-size: 13px; font-weight: 600; margin: 0; color: var(--purple); }
  .offer-sub { font-size: 12px; color: var(--text-muted); margin: 0; }
  .sticky-footer {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: var(--white);
    border-top: 2px solid var(--purple-pale);
    padding: 12px 20px;
    box-shadow: 0 -4px 20px rgba(106,13,173,.12);
    z-index: 200;
  }
  .sf-total { font-size: 16px; font-weight: 700; margin: 0; color: var(--purple); }
  .sf-saving { font-size: 11px; color: var(--text-saving); margin: 0; }
  .btn-proceed-sm {
    background: linear-gradient(135deg, var(--purple), var(--purple-light));
    color: #fff;
    border: none;
    border-radius: 12px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(106,13,173,.3);
  }
  .empty-cart { padding: 60px 0; }
  .empty-icon { font-size: 64px; }
  .empty-title { font-size: 20px; font-weight: 700; margin-top: 12px; color: var(--text-main); }
  .empty-sub { font-size: 14px; color: var(--text-muted); }
  .btn-shop {
    background: var(--purple);
    color: #fff;
    border: none;
    border-radius: 12px;
    padding: 12px 32px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 8px;
    transition: background .2s;
  }
  .btn-shop:hover { background: var(--purple-light); }
`;

/* ─────────────────────────────────────────────
   ROOT EXPORT
───────────────────────────────────────────── */
export default function App() {
  return (
    <Provider store={store}>
      <style>{styles}</style>
      <CartPage />
      <FeaturedProductsSection />

      <BestSellersSection />
    </Provider>
  );
}