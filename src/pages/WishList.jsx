import { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { CartWishlistContext } from "../context/CartWishlistContext";

export default function WishList() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Get context functions and state
  const { cartItems, handleAddToCart } = useContext(CartWishlistContext);

  // Fetch wishlist items
  useEffect(() => {
    async function fetchWishlist() {
      try {
        const res = await fetch("https://shopping-backend-blush.vercel.app/wishlist");
        const data = await res.json();
        setWishlistItems(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load wishlist.");
        setLoading(false);
      }
    }

    fetchWishlist();
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

  // Remove wishlist item
  const handleRemove = async (id) => {
    try {
      const res = await fetch(`https://shopping-backend-blush.vercel.app/wishlist/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setWishlistItems((prevItems) => prevItems.filter((item) => item._id !== id));
        showNotification("Item removed from wishlist!", "success");
      } else {
        showNotification("Failed to remove item from wishlist.", "error");
      }
    } catch (err) {
      console.error("Error removing wishlist item:", err);
      showNotification("Failed to remove item from wishlist.", "error");
    }
  };


  const handleMoveToCart = async (item) => {
    try {

      await handleAddToCart(item.productId._id);


      await handleRemove(item._id);

      showNotification(
        `${item.productId.name} moved to cart successfully!`,
        "success"
      );
    } catch (err) {
      console.error("Error moving item to cart:", err);
      showNotification("Failed to move item to cart.", "error");
    }
  };

  const isInCart = (productId) => {
    return cartItems.includes(productId);
  };

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
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
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
        <h1 className="mb-4">My Wishlist ({wishlistItems.length})</h1>
        
        <div className="card p-3">
          {wishlistItems.length > 0 ? (
            <ul className="list-group list-group-flush">
              {wishlistItems.map((item) => (
                <li
                  key={item._id}
                  className="list-group-item d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-md-between"
                >
                  <div className="d-flex flex-column flex-md-row align-items-center">
                    <img
                      src={item.productId.imageUrl}
                      alt={item.productId.name}
                      className="rounded me-md-4 mb-3 mb-md-0 bg-white border p-2"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "contain",
                      }}
                    />
                    <div className="text-center text-md-start">
                      <h5 className="mb-1">{item.productId.name}</h5>
                      <strong className="text-primary">
                        ₹{item.productId.price}
                      </strong>
                      <p className="mb-1 text-muted">{item.productId.category}</p>
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-3 mt-md-0">
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleRemove(item._id)}
                    >
                      <i className="bi bi-trash-fill me-2"></i>
                      Remove
                    </button>
                    {isInCart(item.productId._id) ? (
                      <button className="btn btn-secondary" disabled>
                        <i className="bi bi-cart-check-fill me-2"></i>
                        Already in Cart
                      </button>
                    ) : (
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => handleMoveToCart(item)}
                      >
                        <i className="bi bi-cart3 me-2"></i>
                        Move to Cart
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-heart display-1 text-muted"></i>
              <h4 className="mt-3">Your wishlist is empty</h4>
              <p className="text-muted">Save items you love for later!</p>
            </div>
          )}
          
          {wishlistItems.length === 0 && (
            <div className="mt-4">
              <button className="btn btn-outline-primary">
                <Link style={{ textDecoration: "none" }} to="/products">
                  <i className="bi bi-arrow-left"></i> Continue Shopping
                </Link>
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}