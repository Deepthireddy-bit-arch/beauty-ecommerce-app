import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { removeFromWishlist } from "../../redux/reducers/thunks/wishlistActions";
import { addToCartAsync } from "../../redux/reducers/thunks/cartThunks";

const WishlistCard = ({ item, onToast = () => {} }) => {
  const dispatch = useDispatch();
  const [addingToCart, setAddingToCart] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (item.stock === 0 || addingToCart || removing) return;

    setAddingToCart(true);

    try {
      await dispatch(
        addToCartAsync({
          productId: item.productId,
          quantity: 1,
        })
      ).unwrap();

      onToast(`Added ${item.name} to cart 🛍️`, "cart");
    } catch (error) {
      onToast(`Couldn't add ${item.name} to cart`, "error");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleRemoveFromWishlist = async (e) => {
    e?.stopPropagation?.();

    if (removing) return;

    setRemoving(true);

    try {
      await dispatch(removeFromWishlist(item.productId)).unwrap();
      onToast(`Removed ${item.name} from wishlist`, "wishlist");
    } catch (error) {
      onToast("Couldn't remove item, please try again", "error");
      setRemoving(false);
    }
    // on success we deliberately don't reset `removing` - the item is about
    // to unmount once the parent's `items` list updates, so leaving the
    // disabled/faded state on prevents a flash back to the normal card.
  };

  return (
    <div className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
      <div
        className={`wishlist-card card h-100 border-0 shadow-sm${
          removing ? " removing" : ""
        }`}
      >

        {/* Product Image */}
        <div className="card-img-wrapper position-relative overflow-hidden">

          <img
            src={
              item.image ||
              "https://placehold.co/400x280/f3e8ff/7c3aed?text=Product"
            }
            alt={item.name}
            className="card-img-top"
          />

          {/* Discount Badge */}
          {item.discount > 0 && (
            <span className="badge-discount position-absolute top-0 start-0 m-2 px-2 py-1 rounded-pill">
              -{item.discount}%
            </span>
          )}

          {/* Remove Button */}
          <button
            onClick={handleRemoveFromWishlist}
            disabled={removing}
            className="btn-remove position-absolute top-0 end-0 m-2 d-flex align-items-center justify-content-center"
            title="Remove from wishlist"
            aria-label="Remove from wishlist"
          >
            {removing ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                style={{ width: "13px", height: "13px", borderWidth: "2px" }}
              ></span>
            ) : (
              <i className="bi bi-trash3-fill" style={{ fontSize: "15px" }}></i>
            )}
          </button>

        </div>

        {/* Card Body */}
        <div className="card-body d-flex flex-column px-3 py-3">

          {/* Category */}
          <p className="product-category text-uppercase mb-1">
            {item.category || "General"}
          </p>

          {/* Product Name */}
          <h6
            className="product-name fw-semibold mb-1 text-truncate"
            title={item.name}
          >
            {item.name}
          </h6>

          {/* Rating */}
          <div className="d-flex align-items-center gap-1 mb-2">

            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`bi ${star <= Math.round(item.rating || 4)
                  ? "bi-star-fill star-filled"
                  : "bi-star star-empty"
                  }`}
                style={{ fontSize: "0.7rem" }}
              ></i>
            ))}

            <span
              className="text-muted ms-1"
              style={{ fontSize: "0.75rem" }}
            >
              ({item.numReviews || 0})
            </span>

          </div>

          {/* Price */}
          <div className="d-flex align-items-center gap-2 mb-3">

            <span className="product-price fw-bold">
              ₹{item.price?.toLocaleString() || "0"}
            </span>

            {item.originalPrice && (
              <span className="product-original-price text-decoration-line-through text-muted">
                ₹{item.originalPrice.toLocaleString()}
              </span>
            )}

          </div>

          {/* Stock Status */}
          <div className="mb-3">

            {item.stock > 0 ? (
              <span className="stock-badge in-stock px-2 py-1 rounded-pill">
                <i className="bi bi-check-circle-fill me-1"></i>
                In Stock
              </span>
            ) : (
              <span className="stock-badge out-of-stock px-2 py-1 rounded-pill">
                <i className="bi bi-x-circle-fill me-1"></i>
                Out of Stock
              </span>
            )}

          </div>

          {/* Actions */}
          <div className="mt-auto d-flex gap-2">

            <button
              onClick={handleAddToCart}
              disabled={item.stock === 0 || addingToCart || removing}
              className="btn btn-add-cart flex-grow-1 d-flex align-items-center justify-content-center"
            >
              {addingToCart ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Adding...
                </>
              ) : (
                <>
                  <i className="bi bi-cart-plus me-1"></i>
                  Add to Cart
                </>
              )}
            </button>

            <button
              onClick={handleRemoveFromWishlist}
              disabled={removing}
              className="btn btn-remove-outline"
              title="Remove"
              aria-label="Remove from wishlist"
            >
              {removing ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                ></span>
              ) : (
                <i className="bi bi-trash3"></i>
              )}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default WishlistCard;