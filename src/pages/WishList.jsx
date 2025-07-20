import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function WishList() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Remove wishlist item
  const handleRemove = async (id) => {
    try {
      const res = await fetch(`https://shopping-backend-blush.vercel.app/wishlist/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setWishlistItems((prevItems) => prevItems.filter((item) => item._id !== id));
      } else {
        alert("Failed to remove item from wishlist.");
      }
    } catch (err) {
      console.error("Error removing wishlist item:", err);
    }
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
      <main className="container py-5">
        <h1 className="mb-4">My Wishlist ({wishlistItems.length})</h1>
        {wishlistItems.length > 0 ? (
          <ul className="list-group">
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
                  <button className="btn btn-outline-primary">
                    <i className="bi bi-cart3 me-2"></i>
                    Move to Cart
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No items in your wishlist.</p>
        )}
      </main>
      <Footer />
    </>
  );
}
