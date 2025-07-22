import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await fetch("https://shopping-backend-soudip-panjas-projects.vercel.app/cart");
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

  const handleQuantityChange = (id, delta) => {
    setQuantities((prev) => {
      const updated = { ...prev, [id]: Math.max(1, prev[id] + delta) };
      return updated;
    });
  };

  const handleRemove = async (id) => {
    try {
      const res = await fetch(`https://shopping-backend-soudip-panjas-projects.vercel.app/cart/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCartItems((prev) => prev.filter((item) => item._id !== id));
        setQuantities((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      } else {
        alert("Failed to remove item.");
      }
    } catch (err) {
      console.error(err);
    }
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
      <main className="container py-5">
        <div className="row">
          {/* Cart Items */}
          <div className="col-md-8">
            <div className="card p-3">
              <h5 className="mb-4">Product</h5>
              {cartItems.map((item) => (
                <div key={item._id} className="row align-items-center border-bottom py-3">
                  <div className="col-3 col-md-2">
                    <img
                      src={item.productId.imageUrl}
                      className="img-fluid rounded border"
                      alt={item.productId.name}
                    />
                  </div>
                  <div className="col-9 col-md-3">
                    <strong>{item.productId.name}</strong>
                    <p className="text-muted mb-0">{item.productId.brand} | {item.productId.category}</p>
                  </div>
                  <div className="col-4 col-md-2 mt-3 mt-md-0">₹{item.productId.price.toFixed(2)}</div>
                  <div className="col-4 col-md-2 d-flex align-items-center mt-2 mt-md-0">
                    <button className="btn btn-outline-secondary btn-sm me-1" onClick={() => handleQuantityChange(item._id, -1)}>-</button>
                    <input
                      type="text"
                      value={quantities[item._id] || 1}
                      className="form-control form-control-sm text-center"
                      style={{ width: "40px" }}
                      readOnly
                    />
                    <button className="btn btn-outline-secondary btn-sm ms-1" onClick={() => handleQuantityChange(item._id, 1)}>+</button>
                  </div>
                  <div className="col-4 col-md-2 mt-2 mt-md-0 fw-semibold">
                    ₹{(item.productId.price * (quantities[item._id] || 1)).toFixed(2)}
                  </div>
                  <div className="col-12 col-md-1 text-end mt-2 mt-md-0">
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleRemove(item._id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                  <div className="col-12 text-end mt-2">
                    <button className="btn btn-primary btn-sm">Move to Wishlist</button>
                  </div>
                </div>
              ))}
              <div className="mt-4">
                <button className="btn btn-outline-primary">
                  <Link style={{textDecoration: "none"}} to="/products"><i className="bi bi-arrow-left"></i> Continue Shopping</Link>
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
              <Link to="/address" className="btn btn-primary w-100 mt-3">Proceed to Checkout</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
