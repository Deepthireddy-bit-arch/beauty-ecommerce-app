// ProductDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; //connect to store 
import { useParams, useNavigate } from 'react-router-dom'; //gets productId from url and naviagte 
import toast from 'react-hot-toast';

import './ProductDetailPage.css';
import { fetchProductById } from '../../redux/reducers/thunks/productThunks';
import { clearSelectedProduct } from '../../redux/slices/productSlice';
import { addToCartAsync } from '../../redux/reducers/thunks/cartThunks'; // ✅ import

const ProductDetailPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        selectedProduct: product, //current selected product details
        loading,
        error,
    } = useSelector((state) => state.products);

    const [activeImg, setActiveImg] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [imgError, setImgError] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false); // ✅ rename / add

    useEffect(() => {
        dispatch(fetchProductById(id));
        return () => dispatch(clearSelectedProduct());
    }, [id, dispatch]);

    useEffect(() => {
        setActiveImg(0);
        setImgError(false);
    }, [product]);

    const discount = product?.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null;

    // ✅ NEW: add to cart handler with API call
    const handleAddToCart = async () => {
        if (!product || product.stock === 0 || addingToCart) return;

        setAddingToCart(true);
        try {
            await dispatch(addToCartAsync({ productId: product._id, quantity })).unwrap();
            
        } catch (err) {
            // Error toast already shown in thunk; optional extra logging
            console.error('Add to cart failed:', err);
        } finally {
            setAddingToCart(false);
        }
    };

    const getPlaceholder = (name = 'Product') =>
        `https://placehold.co/600x500/EEEDFE/534AB7?text=${encodeURIComponent(name)}`;

    if (loading) {
        return (
            <div className="detail-page">
                <div className="detail-loading">
                    <div className="loader-ring" />
                    <p>Loading product...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="detail-page">
                <div className="detail-error text-center">
                    <div className="error-circle">!</div>
                    <h5 className="mt-3">Something went wrong</h5>
                    <p>{error}</p>
                    <button className="btn-back" onClick={() => navigate(-1)}>← Go Back</button>
                </div>
            </div>
        );
    }

    if (!product) return null;

    const images = product.images?.length
        ? product.images
        : [getPlaceholder(product.name)];

    return (
        <div className="detail-page">

            {/* Breadcrumb */}
            <div className="detail-breadcrumb container-fluid px-4">
                <span className="bc-link" onClick={() => navigate('/')}>Home</span>
                <span className="bc-sep">›</span>
                <span className="bc-link" onClick={() => navigate('/')}>Products</span>
                <span className="bc-sep">›</span>
                <span className="bc-current">{product.name}</span>
            </div>

            <div className="container-fluid px-4 py-4">
                <div className="detail-card">
                    <div className="row g-0">

                        {/* Left: Images */}
                        <div className="col-lg-5">
                            <div className="gallery-section">
                                <div className="main-img-wrapper">
                                    {product.isFeatured && <span className="badge-featured">✦ Featured</span>}
                                    {discount && <span className="badge-discount">{discount}% off</span>}
                                    <img
                                        src={!imgError ? images[activeImg] : getPlaceholder(product.name)}
                                        alt={product.name}
                                        className="main-img"
                                        onError={() => setImgError(true)}
                                    />
                                </div>

                                {images.length > 1 && (
                                    <div className="thumb-row">
                                        {images.map((img, i) => (
                                            <div
                                                key={i}
                                                className={`thumb ${activeImg === i ? 'active' : ''}`}
                                                onClick={() => { setActiveImg(i); setImgError(false); }}
                                            >
                                                <img src={img} alt={`thumb-${i}`} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Details */}
                        <div className="col-lg-7">
                            <div className="detail-info">

                                <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                                    <span className="category-pill">{product.category}</span>
                                    <span className={`stock-badge ${product.stock > 0 ? 'in' : 'out'}`}>
                                        {product.stock > 0 ? '● In Stock' : '● Out of Stock'}
                                    </span>
                                </div>

                                <p className="brand-label">{product.brand}</p>
                                <h1 className="product-title">{product.name}</h1>
                                <p className="product-desc">{product.description}</p>

                                <div className="divider" />

                                <div className="price-block">
                                    <span className="price-now">
                                        ₹{product?.price ? product.price.toLocaleString() : "0"}
                                    </span>
                                    {product?.originalPrice ? (
                                        <>
                                            <span className="price-was">
                                                ₹{product.originalPrice.toLocaleString()}
                                            </span>
                                            <span className="save-chip">
                                                Save ₹{(product.originalPrice - product.price).toLocaleString()}
                                            </span>
                                        </>
                                    ) : null}
                                </div>

                                <div className="divider" />

                                {product.stock > 0 && (
                                    <div className="qty-row">
                                        <span className="qty-label">Quantity</span>
                                        <div className="qty-control">
                                            <button
                                                className="qty-btn"
                                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                                disabled={quantity <= 1}
                                            >−</button>
                                            <span className="qty-value">{quantity}</span>
                                            <button
                                                className="qty-btn"
                                                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                                                disabled={quantity >= product.stock}
                                            >+</button>
                                        </div>
                                        <span className="stock-hint">{product.stock} available</span>
                                    </div>
                                )}

                                <div className="action-row">
                                    <button
                                        className={`btn-cart ${addingToCart ? 'loading' : ''}`}
                                        onClick={handleAddToCart}
                                        disabled={product.stock === 0 || addingToCart}
                                    >
                                        {addingToCart ? (
                                            <>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 7, verticalAlign: -2 }}>
                                                    <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="8" />
                                                </svg>
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 7, verticalAlign: -2 }}>
                                                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                                </svg>
                                                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                            </>
                                        )}
                                    </button>

                                    <button className="btn-wishlist" aria-label="Wishlist">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="divider" />
                                <div className="meta-table">
                                    <div className="meta-row">
                                        <span className="meta-key">Brand</span>
                                        <span className="meta-val">{product.brand}</span>
                                    </div>
                                    <div className="meta-row">
                                        <span className="meta-key">Category</span>
                                        <span className="meta-val">{product.category}</span>
                                    </div>
                                    <div className="meta-row">
                                        <span className="meta-key">Availability</span>
                                        <span className={`meta-val ${product.stock > 0 ? 'text-success' : 'text-danger'}`}>
                                            {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
                                        </span>
                                    </div>
                                    {product.isFeatured && (
                                        <div className="meta-row">
                                            <span className="meta-key">Tag</span>
                                            <span className="meta-val">✦ Featured Product</span>
                                        </div>
                                    )}
                                </div>

                                <button className="btn-back mt-4" onClick={() => navigate(-1)}>
                                    ← Back to Products
                                </button>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;