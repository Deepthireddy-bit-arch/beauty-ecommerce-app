// ProductDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import './Productdetailpage.css';
import { fetchProductById } from '../../redux/reducers/thunks/productThunks';
import { clearSelectedProduct } from '../../redux/slices/productSlice';
import { addToCartAsync } from '../../redux/reducers/thunks/cartThunks';
import { addToWishlist, removeFromWishlist } from '../../redux/reducers/thunks/wishlistActions';

/* ═══════════════════════════════════════════════════════
   STAR RATING — pure SVG, no unicode glitches
═══════════════════════════════════════════════════════ */
const StarRating = ({ rating = 0, count = 0 }) => {
  const stars = [1, 2, 3, 4, 5].map((n) => {
    const fill = Math.min(1, Math.max(0, rating - (n - 1)));
    return fill >= 1 ? 'full' : fill >= 0.5 ? 'half' : 'empty';
  });

  return (
    <div className="rating-row">
      <div className="rating-stars-wrap">
        {stars.map((type, i) => (
          <svg key={i} width="16" height="16" viewBox="0 0 24 24" className={`star star--${type}`}>
            {type === 'half' ? (
              <>
                <defs>
                  <linearGradient id={`hg${i}`}>
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="50%" stopColor="#E2E8F0" />
                  </linearGradient>
                </defs>
                <polygon
                  points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                  fill={`url(#hg${i})`} stroke="#F59E0B" strokeWidth="1"
                />
              </>
            ) : (
              <polygon
                points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                fill={type === 'full' ? '#F59E0B' : '#E2E8F0'}
                stroke={type === 'full' ? '#F59E0B' : '#CBD5E1'}
                strokeWidth="1"
              />
            )}
          </svg>
        ))}
      </div>
      <span className="rating-value">{rating.toFixed(1)}</span>
      {count > 0 && <span className="rating-count">({count} reviews)</span>}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   SKELETON — shimmer placeholders for every section
═══════════════════════════════════════════════════════ */
const S = ({ w, h, r = 8, mb = 0, style = {} }) => (
  <div
    className="skel-box"
    style={{ width: w, height: h, borderRadius: r, marginBottom: mb, flexShrink: 0, ...style }}
  />
);

const ProductDetailSkeleton = () => (
  <div className="detail-page">
    {/* Breadcrumb skeleton */}
    <div className="pdp-breadcrumb">
      <S w={240} h={13} r={6} />
    </div>

    <div className="pdp-outer">
      <div className="pdp-card">
        <div className="pdp-grid">

          {/* LEFT — gallery */}
          <div className="pdp-gallery">
            <S w="100%" h={0} r={16} style={{ aspectRatio: '1/1', height: 'auto' }} />
            <div className="pdp-thumbs" style={{ marginTop: 14, display: 'flex', gap: 10 }}>
              <S w={68} h={68} r={10} />
              <S w={68} h={68} r={10} />
              <S w={68} h={68} r={10} />
            </div>
          </div>

          {/* RIGHT — info */}
          <div className="pdp-info">
            {/* Pills row */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
              <S w={72} h={26} r={20} />
              <S w={90} h={26} r={20} />
              <S w={88} h={26} r={20} />
            </div>
            {/* Brand */}
            <S w={90} h={13} r={6} mb={10} />
            {/* Title */}
            <S w="68%" h={32} r={8} mb={8} />
            <S w="42%" h={32} r={8} mb={16} />
            {/* Description */}
            <S w="100%" h={14} r={6} mb={7} />
            <S w="92%" h={14} r={6} mb={7} />
            <S w="76%" h={14} r={6} mb={20} />
            {/* Stars */}
            <S w={160} h={20} r={6} mb={20} />

            <div className="pdp-divider" />

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <S w={110} h={40} r={8} />
              <S w={70} h={22} r={6} />
              <S w={96} h={26} r={20} />
            </div>

            <div className="pdp-divider" />

            {/* Qty */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <S w={72} h={14} r={6} />
              <S w={128} h={42} r={10} />
              <S w={80} h={13} r={6} />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12 }}>
              <S w="100%" h={52} r={14} style={{ flex: 1 }} />
              <S w={52} h={52} r={14} />
            </div>

            <div className="pdp-divider" />

            {/* Meta */}
            {[100, 120, 150, 80].map((w, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                <S w={90} h={14} r={6} />
                <S w={w} h={14} r={6} />
              </div>
            ))}

            <S w={148} h={38} r={10} style={{ marginTop: 20 }} />
          </div>

        </div>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════
   WISHLIST HEART ICON
═══════════════════════════════════════════════════════ */
const HeartIcon = ({ filled }) => (
  <svg width="19" height="19" viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

/* ═══════════════════════════════════════════════════════
   CART ICON
═══════════════════════════════════════════════════════ */
const CartIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

/* ═══════════════════════════════════════════════════════
   SPINNER
═══════════════════════════════════════════════════════ */
const Spinner = ({ color = '#fff', size = 16 }) => (
  <span
    className="pdp-spinner"
    style={{ width: size, height: size, borderTopColor: color, borderColor: `${color}33` }}
  />
);

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════ */
const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedProduct: product, loading, error } = useSelector((s) => s.products);
  const wishlistItems  = useSelector((s) => s.wishlist?.items ?? []);
  const isAuthenticated = useSelector((s) => s.login?.isAuthenticated ?? false);

  const [activeImg,       setActiveImg]       = useState(0);
  const [quantity,        setQuantity]        = useState(1);
  const [imgError,        setImgError]        = useState(false);
  const [addingToCart,    setAddingToCart]    = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearSelectedProduct());
  }, [id, dispatch]);

  useEffect(() => {
    setActiveImg(0);
    setImgError(false);
    setQuantity(1);
  }, [product]);

  const getPlaceholder = (name = 'Product') =>
    `https://placehold.co/600x600/EEEDFE/534AB7?text=${encodeURIComponent(name)}`;

  const isWishlisted = product
    ? wishlistItems.some(
        (item) =>
          item?.product?._id === product._id ||
          item?.productId    === product._id ||
          item?._id          === product._id
      )
    : false;

  const discount = product?.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  /* ── Handlers ── */
  const handleAddToCart = async () => {
    if (!product || product.stock === 0 || addingToCart) return;
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your cart');
      navigate('/login');
      return;
    }
    setAddingToCart(true);
    try {
      await dispatch(addToCartAsync({ productId: product._id, quantity })).unwrap();
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      console.error('Add to cart failed:', err);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!product || wishlistLoading) return;
    if (!isAuthenticated) {
      toast.error('Please sign in to save items');
      navigate('/login');
      return;
    }
    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist(product._id)).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await dispatch(addToWishlist(product._id)).unwrap();
        toast.success('Saved to wishlist ♥');
      }
    } catch (err) {
      toast.error('Could not update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  /* ── Loading ── */
  if (loading) return <ProductDetailSkeleton />;

  /* ── Error ── */
  if (error) {
    return (
      <div className="detail-page">
        <div className="pdp-state-center">
          <div className="pdp-error-icon">!</div>
          <h5 style={{ margin: '14px 0 6px', color: '#1a1a2e', fontSize: 18 }}>
            Something went wrong
          </h5>
          <p style={{ color: '#888780', marginBottom: 20 }}>{error}</p>
          <button className="btn-back" onClick={() => navigate(-1)}>← Go Back</button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images?.length ? product.images : [getPlaceholder(product.name)];
  const currentImg = !imgError ? images[activeImg] : getPlaceholder(product.name);

  /* ── Render ── */
  return (
    <div className="detail-page">

      {/* ── Breadcrumb ───────────────────────────────── */}
      <div className="pdp-breadcrumb">
        <span className="bc-link" onClick={() => navigate('/')}>Home</span>
        <span className="bc-sep">›</span>
        <span className="bc-link" onClick={() => navigate('/')}>Products</span>
        <span className="bc-sep">›</span>
        {product.category && (
          <>
            <span className="bc-link" onClick={() => navigate('/')}>
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </span>
            <span className="bc-sep">›</span>
          </>
        )}
        <span className="bc-current">{product.name}</span>
      </div>

      {/* ── Main content ─────────────────────────────── */}
      <div className="pdp-outer">
        <div className="pdp-card">
          <div className="pdp-grid">

            {/* ════ LEFT — Gallery ════ */}
            <div className="pdp-gallery">
              {/* Main image */}
              <div className="pdp-main-img-wrap">
                {product.isFeatured && (
                  <span className="pdp-badge pdp-badge--featured">✦ Featured</span>
                )}
                {discount && (
                  <span className="pdp-badge pdp-badge--discount">{discount}% off</span>
                )}
                <img
                  src={currentImg}
                  alt={product.name}
                  className="pdp-main-img"
                  onError={() => setImgError(true)}
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="pdp-thumbs">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      className={`pdp-thumb${activeImg === i ? ' pdp-thumb--active' : ''}`}
                      onClick={() => { setActiveImg(i); setImgError(false); }}
                      aria-label={`Image ${i + 1}`}
                    >
                      <img src={img} alt={`view-${i}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ════ RIGHT — Info ════ */}
            <div className="pdp-info">

              {/* Pills row */}
              <div className="pdp-pills-row">
                {product.category && (
                  <span className="pdp-pill pdp-pill--cat">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </span>
                )}
                <span className={`pdp-pill ${product.stock > 0 ? 'pdp-pill--in' : 'pdp-pill--out'}`}>
                  <span className="pill-dot" />
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
                {product.isBestseller && (
                  <span className="pdp-pill pdp-pill--best">Bestseller</span>
                )}
              </div>

              {/* Brand */}
              <p className="pdp-brand">{product.brand}</p>

              {/* Title */}
              <h1 className="pdp-title">{product.name}</h1>

              {/* Description */}
              {product.description && (
                <p className="pdp-desc">{product.description}</p>
              )}

              {/* Stars */}
              {product.rating > 0 && (
                <StarRating rating={product.rating} count={product.reviews ?? 0} />
              )}

              <div className="pdp-divider" />

              {/* Pricing */}
              <div className="pdp-price-block">
                <span className="pdp-price-now">
                  ₹{product.price?.toLocaleString('en-IN') ?? '0'}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="pdp-price-was">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="pdp-save-chip">
                      Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                    </span>
                  </>
                )}
              </div>

              <div className="pdp-divider" />

              {/* Quantity */}
              {product.stock > 0 && (
                <div className="pdp-qty-row">
                  <span className="pdp-qty-label">Quantity</span>
                  <div className="pdp-qty-ctrl">
                    <button
                      className="pdp-qty-btn"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease"
                    >−</button>
                    <span className="pdp-qty-val">{quantity}</span>
                    <button
                      className="pdp-qty-btn"
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      disabled={quantity >= product.stock}
                      aria-label="Increase"
                    >+</button>
                  </div>
                  <span className="pdp-stock-hint">{product.stock} available</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="pdp-action-row">
                <button
                  className={`pdp-btn-cart${product.stock === 0 ? ' pdp-btn-cart--oos' : ''}`}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addingToCart}
                >
                  {addingToCart ? (
                    <><Spinner /><span>Adding…</span></>
                  ) : (
                    <><CartIcon /><span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span></>
                  )}
                </button>

                <button
                  className={`pdp-btn-wish${isWishlisted ? ' pdp-btn-wish--active' : ''}`}
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {wishlistLoading
                    ? <Spinner color={isWishlisted ? '#DC2626' : '#534AB7'} size={17} />
                    : <HeartIcon filled={isWishlisted} />
                  }
                </button>
              </div>

              <div className="pdp-divider" />

              {/* Meta table */}
              <dl className="pdp-meta">
                <div className="pdp-meta-row">
                  <dt className="pdp-meta-key">Brand</dt>
                  <dd className="pdp-meta-val">{product.brand}</dd>
                </div>
                <div className="pdp-meta-row">
                  <dt className="pdp-meta-key">Category</dt>
                  <dd className="pdp-meta-val" style={{ textTransform: 'capitalize' }}>
                    {product.category}
                  </dd>
                </div>
                <div className="pdp-meta-row">
                  <dt className="pdp-meta-key">Availability</dt>
                  <dd className={`pdp-meta-val ${product.stock > 0 ? 'pdp-meta-val--in' : 'pdp-meta-val--out'}`}>
                    {product.stock > 0
                      ? `In Stock (${product.stock} units)`
                      : 'Out of Stock'}
                  </dd>
                </div>
                {product.shades > 1 && (
                  <div className="pdp-meta-row">
                    <dt className="pdp-meta-key">Shades</dt>
                    <dd className="pdp-meta-val">{product.shades} available</dd>
                  </div>
                )}
                {product.isFeatured && (
                  <div className="pdp-meta-row">
                    <dt className="pdp-meta-key">Tag</dt>
                    <dd className="pdp-meta-val">✦ Featured Product</dd>
                  </div>
                )}
              </dl>

              {/* Back */}
              <button className="btn-back" onClick={() => navigate(-1)}>
                ← Back to Products
              </button>

            </div>
            {/* end pdp-info */}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductDetailPage;