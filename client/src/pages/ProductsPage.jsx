import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSearchQuery,
  setCategory,
  setSortBy,
  selectFilteredProducts,
  selectCategories,
  fetchProducts,
} from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import '../components/ProductCard.css';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { loading, error, searchQuery, selectedCategory, sortBy } = useSelector(
    (state) => state.products
  );
  const products = useSelector(selectFilteredProducts);
  const categories = useSelector(selectCategories);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="products-page">

      <div className="page-header">
        <div className="container-fluid px-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <h1 className="page-title">All Products</h1>
             
            </div>

            <div className="d-flex align-items-center gap-3 flex-wrap">
              <div className="search-wrapper">
                <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24"
                  fill="none" stroke="#888" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                />
              </div>

              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => dispatch(setSortBy(e.target.value))}
              >
                <option value="default">Sort by</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>
          </div>

          <div className="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`cat-tab ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => dispatch(setCategory(cat))}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-fluid px-4 py-4">

        {loading && (
          <div className="state-box text-center py-5">
            <div className="loader-ring" />
            <p className="state-text mt-3">Fetching products...</p>
          </div>
        )}

        {error && (
          <div className="state-box text-center py-5">
            <div className="error-icon">!</div>
            <p className="state-text mt-3">{error}</p>
            <button className="retry-btn mt-2" onClick={() => dispatch(fetchProducts())}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="state-box text-center py-5">
            <div className="empty-icon">∅</div>
            <h5 className="mt-3" style={{ color: '#26215C' }}>No products found</h5>
            <p style={{ color: '#888780', fontSize: 14 }}>Try adjusting your filters or search query.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="row">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductsPage;