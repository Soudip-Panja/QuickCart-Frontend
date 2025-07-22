import { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { CartWishlistContext } from "../context/CartWishlistContext";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Get context functions and state
  const { handleWishlistToggle, wishListItem } =
    useContext(CartWishlistContext);

  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await fetch(
          "https://shopping-backend-soudip-panjas-projects.vercel.app/cart"
        );
        const data = await res.json();
        setCartItems(data);
        const qtyMap = {};
        data.forEach((item) => {
          qtyMap[item._id] = 1;
        });
        setQuantities(qtyMap);
        setLoading(false);
      } catch (err) {
        setError("Failed to load cart.");
        setLoading(false);
      }
    }

    fetchCart();
  }, []);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  // Show notification function
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
  };

  const handleQuantityChange = (id, delta) => {
    setQuantities((prev) => {
      const updated = { ...prev, [id]: Math.max(1, prev[id] + delta) };
      return updated;
    });
  };

  const handleRemove = async (id) => {
    try {
      const res = await fetch(
        `https://shopping-backend-soudip-panjas-projects.vercel.app/cart/${id}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setCartItems((prev) => prev.filter((item) => item._id !== id));
        setQuantities((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      } else {
        showNotification("Failed to remove item.", "error");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Move to wishlist function
  const handleMoveToWishlist = async (item) => {
    try {
      // Add to wishlist using context
      await handleWishlistToggle(item.productId._id);

      // Remove from cart
      await handleRemove(item._id);

      showNotification(
        `${item.productId.name} moved to wishlist successfully!`,
        "success"
      );
    } catch (err) {
      console.error("Error moving item to wishlist:", err);
      showNotification("Failed to move item to wishlist.", "error");
    }
  };

  // Check if item is already in wishlist
  const isInWishlist = (productId) => {
    return wishListItem.includes(productId);
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const qty = quantities[item._id] || 1;
    return acc + item.productId.price * qty;
  }, 0);

  if (loading) {
    return (
      <>
        <Header />
        <main className="container py-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="container py-5 text-center">
          <div className="alert alert-danger">{error}</div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      {/* Notification */}
      {notification.show && (
        <div
          className={`alert ${
            notification.type === "success" ? "alert-success" : "alert-danger"
          } alert-dismissible fade show position-fixed`}
          style={{
            top: "20px",
            right: "20px",
            zIndex: 9999,
            minWidth: "300px",
          }}
          role="alert"
        >
          <strong>
            {notification.type === "success" ? "Success!" : "Error!"}
          </strong>{" "}
          {notification.message}
          <button
            type="button"
            className="btn-close"
            onClick={() =>
              setNotification({ show: false, message: "", type: "" })
            }
          ></button>
        </div>
      )}
      <main className="container py-5">
        <div className="row">
          {/* Cart Items */}
          <div className="col-md-8">
            <div className="card p-3">
              <h5 className="mb-4">Product</h5>
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="row align-items-center border-bottom py-3"
                  >
                    <div className="col-3 col-md-2">
                      <img
                        src={item.productId.imageUrl}
                        className="img-fluid rounded border"
                        alt={item.productId.name}
                      />
                    </div>
                    <div className="col-9 col-md-3">
                      <strong>{item.productId.name}</strong>
                      <p className="text-muted mb-0">
                        {item.productId.brand} | {item.productId.category}
                      </p>
                    </div>
                    <div className="col-4 col-md-2 mt-3 mt-md-0">
                      ₹{item.productId.price.toFixed(2)}
                    </div>
                    <div className="col-4 col-md-2 d-flex align-items-center mt-2 mt-md-0">
                      <button
                        className="btn btn-outline-secondary btn-sm me-1"
                        onClick={() => handleQuantityChange(item._id, -1)}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={quantities[item._id] || 1}
                        className="form-control form-control-sm text-center"
                        style={{ width: "40px" }}
                        readOnly
                      />
                      <button
                        className="btn btn-outline-secondary btn-sm ms-1"
                        onClick={() => handleQuantityChange(item._id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="col-4 col-md-2 mt-2 mt-md-0 fw-semibold">
                      ₹
                      {(
                        item.productId.price * (quantities[item._id] || 1)
                      ).toFixed(2)}
                    </div>

                    <div className="col-12 mt-3">
                      <div className="row g-2">
                        <div className="col-6">
                          {isInWishlist(item.productId._id) ? (
                            <button
                              className="btn btn-secondary btn-sm w-100"
                              disabled
                            >
                              <i className="bi bi-heart-fill me-1"></i>
                              Already in Wishlist
                            </button>
                          ) : (
                            <button
                              className="btn btn-outline-primary btn-sm w-100"
                              onClick={() => handleMoveToWishlist(item)}
                            >
                              <i className="bi bi-heart me-1"></i>
                              Move to Wishlist
                            </button>
                          )}
                        </div>
                        <div className="col-6">
                          <button
                            className="btn btn-outline-danger btn-sm w-100"
                            onClick={() => handleRemove(item._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-cart-x display-1 text-muted"></i>
                  <h4 className="mt-3">Your cart is empty</h4>
                  <p className="text-muted">Add some items to get started!</p>
                </div>
              )}
              <div className="mt-4">
                <button className="btn btn-outline-primary">
                  <Link style={{ textDecoration: "none" }} to="/products">
                    <i className="bi bi-arrow-left"></i> Continue Shopping
                  </Link>
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-md-4 mt-4 mt-md-0">
            <div className="card p-3">
              <h5>Order Summary</h5>
              <div className="d-flex justify-content-between mt-2">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {cartItems.length > 0 ? (
                <Link to="/address" className="btn btn-primary w-100 mt-3">
                  Proceed to Checkout
                </Link>
              ) : (
                <button className="btn btn-secondary w-100 mt-3" disabled>
                  Cart is Empty
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
