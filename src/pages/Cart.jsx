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

  const { 
    cartItems: contextCartItems,
    handleWishlistToggle, 
    wishListItem,
    refreshCartItems,
    refreshWishlistItems
  } = useContext(CartWishlistContext);

  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await fetch(
          "https://shopping-backend-soudip-panjas-projects.vercel.app/cart"
        );
        const data = await res.json();
        setCartItems(data);
        
        // Load quantities from localStorage or initialize with 1
        const savedQuantities = JSON.parse(localStorage.getItem('cartQuantities') || '{}');
        const qtyMap = {};
        data.forEach((item) => {
          qtyMap[item._id] = savedQuantities[item._id] || 1;
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

  // Save quantities to localStorage whenever quantities change
  useEffect(() => {
    localStorage.setItem('cartQuantities', JSON.stringify(quantities));
  }, [quantities]);

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  // Sync local cart with context state changes
  useEffect(() => {
    if (!loading && contextCartItems) {
      // Filter out items that are no longer in the context cart
      setCartItems(prevItems => 
        prevItems.filter(item => contextCartItems.includes(item.productId._id))
      );
      
      // Clean up quantities for removed items
      setQuantities(prevQuantities => {
        const updatedQuantities = { ...prevQuantities };
        Object.keys(updatedQuantities).forEach(itemId => {
          const cartItem = cartItems.find(item => item._id === itemId);
          if (!cartItem || !contextCartItems.includes(cartItem.productId._id)) {
            delete updatedQuantities[itemId];
          }
        });
        return updatedQuantities;
      });
    }
  }, [contextCartItems, loading]);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
  };

  const handleQuantityChange = (id, delta) => {
    setQuantities((prev) => {
      const updated = { ...prev, [id]: Math.max(1, prev[id] + delta) };
      return updated;
    });
  };

  const handleRemove = async (item) => {
    const itemName = item?.productId?.name || 'Item';

    try {
      // Remove from backend
      const res = await fetch(
        `https://shopping-backend-soudip-panjas-projects.vercel.app/cart/${item._id}`,
        {
          method: "DELETE",
        }
      );
      
      if (res.ok) {
        // Update local state immediately for better UX
        setCartItems((prev) => prev.filter((cartItem) => cartItem._id !== item._id));
        setQuantities((prev) => {
          const updated = { ...prev };
          delete updated[item._id];
          return updated;
        });

        // Refresh context cart state to update other components
        await refreshCartItems();

        showNotification(`${itemName} removed from cart successfully!`, "success");
      } else {
        showNotification("Failed to remove item.", "error");
      }
    } catch (err) {
      console.error("Error removing cart item:", err);
      showNotification("Failed to remove item.", "error");
      
      // Refresh cart data if there's an error
      try {
        const res = await fetch(
          "https://shopping-backend-soudip-panjas-projects.vercel.app/cart"
        );
        const data = await res.json();
        setCartItems(data);
        await refreshCartItems();
      } catch (fetchErr) {
        console.error("Error refreshing cart:", fetchErr);
      }
    }
  };

  const handleMoveToWishlist = async (item) => {
    try {
      // Add to wishlist using context function
      await handleWishlistToggle(item.productId._id);
      
      // Remove from cart
      const res = await fetch(
        `https://shopping-backend-soudip-panjas-projects.vercel.app/cart/${item._id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        // Update local state immediately
        setCartItems((prev) => prev.filter((cartItem) => cartItem._id !== item._id));
        setQuantities((prev) => {
          const updated = { ...prev };
          delete updated[item._id];
          return updated;
        });

        // Refresh context states
        await refreshCartItems();
        await refreshWishlistItems();

        showNotification(
          `${item.productId.name} moved to wishlist successfully!`,
          "success"
        );
      } else {
        // If cart removal failed, remove from wishlist to maintain consistency
        await handleWishlistToggle(item.productId._id);
        showNotification("Failed to move item to wishlist.", "error");
      }
    } catch (err) {
      console.error("Error moving item to wishlist:", err);
      showNotification("Failed to move item to wishlist.", "error");
      
      // Refresh states if there's an error
      try {
        const res = await fetch(
          "https://shopping-backend-soudip-panjas-projects.vercel.app/cart"
        );
        const data = await res.json();
        setCartItems(data);
        await refreshCartItems();
        await refreshWishlistItems();
      } catch (fetchErr) {
        console.error("Error refreshing data:", fetchErr);
      }
    }
  };

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
                            onClick={() => handleRemove(item)}
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