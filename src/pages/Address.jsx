import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartWishlistContext } from "../context/CartWishlistContext"; // Add this import
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Address() {
  const [showForm, setShowForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    street: "",
    locality: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [processingAddressId, setProcessingAddressId] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  
  const navigate = useNavigate();
  
  // Add context to access refreshCartItems
  const { refreshCartItems } = useContext(CartWishlistContext);
  
  const API_URL = "https://shopping-backend-git-main-soudip-panjas-projects.vercel.app/address";
  const CART_API_URL = "https://shopping-backend-soudip-panjas-projects.vercel.app/cart";

  // Fetch all addresses on mount
  useEffect(() => {
    fetchAddresses();
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

  const fetchAddresses = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setAddresses(data);
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    
    // Handle mobile number - only numbers, max 10 digits
    if (id === 'mobile') {
      const numericValue = value.replace(/\D/g, ''); // Remove non-numeric characters
      if (numericValue.length <= 10) {
        setFormData((prev) => ({ ...prev, [id]: numericValue }));
      }
      return;
    }
    
    // Handle pincode - only numbers, max 7 digits
    if (id === 'pincode') {
      const numericValue = value.replace(/\D/g, ''); // Remove non-numeric characters
      if (numericValue.length <= 6) {
        setFormData((prev) => ({ ...prev, [id]: numericValue }));
      }
      return;
    }
    
    // For other fields, set value normally
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}${editingId ? `/${editingId}` : ""}`, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save address");

      await fetchAddresses();
      setShowForm(false);
      setFormData({
        firstName: "",
        lastName: "",
        mobile: "",
        street: "",
        locality: "",
        city: "",
        state: "",
        pincode: "",
      });
      
      // Show success notification
      const successMessage = editingId 
        ? "Address updated successfully!" 
        : "Address added successfully!";
      showNotification(successMessage, "success");
      
      setEditingId(null);
    } catch (err) {
      console.error(err);
      showNotification("Something went wrong while saving address.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchAddresses();
      showNotification("Address deleted successfully!", "success");
    } catch (err) {
      console.error(err);
      showNotification("Failed to delete address.", "error");
    }
  };

  const handleEdit = (address) => {
    setFormData({ ...address });
    setEditingId(address._id);
    setShowForm(true);
  };

  // Updated function to save order details and clear cart
  const handleDeliveryHere = async (selectedAddress) => {
    setProcessingAddressId(selectedAddress._id);
    
    try {
      // First, get all cart items
      const cartRes = await fetch(CART_API_URL);
      const cartItems = await cartRes.json();
      
      if (cartItems.length === 0) {
        alert("Your cart is empty!");
        setProcessingAddressId(null);
        return;
      }

      // Get quantities from localStorage (saved from Cart page)
      const savedQuantities = JSON.parse(localStorage.getItem('cartQuantities') || '{}');

      // Create order object
      const orderData = {
        orderId: `ORD${Date.now()}`,
        orderDate: new Date().toISOString(),
        items: cartItems.map(item => {
          const quantity = savedQuantities[item._id] || 1;
          return {
            productId: item.productId._id,
            name: item.productId.name,
            brand: item.productId.brand,
            category: item.productId.category,
            price: item.productId.price,
            imageUrl: item.productId.imageUrl,
            quantity: quantity,
          };
        }),
        deliveryAddress: {
          firstName: selectedAddress.firstName,
          lastName: selectedAddress.lastName,
          mobile: selectedAddress.mobile,
          street: selectedAddress.street,
          locality: selectedAddress.locality,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
        },
        totalAmount: cartItems.reduce((acc, item) => {
          const quantity = savedQuantities[item._id] || 1;
          return acc + (item.productId.price * quantity);
        }, 0),
        status: "Order Placed"
      };

      // Save to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('myOrders') || '[]');
      existingOrders.unshift(orderData); // Add new order at the beginning
      localStorage.setItem('myOrders', JSON.stringify(existingOrders));
      
      // Delete each cart item from backend
      const deletePromises = cartItems.map(item => 
        fetch(`${CART_API_URL}/${item._id}`, { method: "DELETE" })
      );
      
      await Promise.all(deletePromises);
      
      // **KEY CHANGE: Refresh cart items in context after clearing cart**
      await refreshCartItems();
      
      // Clear quantities from localStorage as well
      localStorage.removeItem('cartQuantities');
      
      // Redirect to order page
      navigate("/order");
    } catch (err) {
      console.error("Failed to clear cart:", err);
      alert("Something went wrong while processing your order.");
    } finally {
      setProcessingAddressId(null);
    }
  };

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
      <main className="container py-4">
        <h1 className="text-center">Checkout</h1>
        <div className="py-3">
          <div className="card">
            <h3 className="text-center py-2 bg-primary text-white">
              <span>
                <i className="bi bi-geo-alt"></i>
              </span>{" "}
              Delivery Address
            </h3>
            <div className="card-body">
              <div className="card">
                <button
                  className="btn p-0 border-0 bg-transparent shadow-none py-3 text-primary"
                  onClick={() => {
                    setShowForm(!showForm);
                    setFormData({
                      firstName: "",
                      lastName: "",
                      mobile: "",
                      street: "",
                      locality: "",
                      city: "",
                      state: "",
                      pincode: "",
                    });
                    setEditingId(null);
                  }}
                >
                  <i className="bi bi-plus-circle"></i> Add a new address
                </button>
              </div>

              {/* Address Form */}
              {showForm && (
                <form className="card p-3 mt-3" onSubmit={handleSubmit}>
                  <h4 className="text-primary">Address Information</h4>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="firstName" className="form-label">First Name</label>
                      <input id="firstName" value={formData.firstName} onChange={handleChange} type="text" className="form-control" />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="lastName" className="form-label">Last Name</label>
                      <input id="lastName" value={formData.lastName} onChange={handleChange} type="text" className="form-control" />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="mobile" className="form-label">Mobile Number</label>
                    <input 
                      id="mobile" 
                      value={formData.mobile} 
                      onChange={handleChange} 
                      type="text" 
                      className="form-control" 
                      placeholder="Enter 10-digit mobile number"
                      inputMode="numeric"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="street" className="form-label">Street</label>
                    <input id="street" value={formData.street} onChange={handleChange} type="text" className="form-control" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="locality" className="form-label">Locality</label>
                    <input id="locality" value={formData.locality} onChange={handleChange} type="text" className="form-control" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="city" className="form-label">City</label>
                    <input id="city" value={formData.city} onChange={handleChange} type="text" className="form-control" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="state" className="form-label">State</label>
                    <input id="state" value={formData.state} onChange={handleChange} type="text" className="form-control" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="pincode" className="form-label">Pincode</label>
                    <input 
                      id="pincode" 
                      value={formData.pincode} 
                      onChange={handleChange} 
                      type="text" 
                      className="form-control" 
                      placeholder="Enter 6 digit pincode"
                      inputMode="numeric"
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary w-100">{editingId ? "Update" : "Save"} Address</button>
                    <button type="button" className="btn btn-outline-secondary w-100" onClick={() => setShowForm(false)}>Cancel</button>
                  </div>
                </form>
              )}

              {/* Address List */}
              {addresses.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-center text-muted">Saved Addresses</h5>
                  <ul className="list-group mt-3">
                    {addresses.map((addr) => (
                      <li key={addr._id} className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                        <div>
                          <strong>{addr.firstName} {addr.lastName}</strong><br />
                          {addr.mobile}<br />
                          {addr.street}, {addr.locality}<br />
                          {addr.city}, {addr.state} - {addr.pincode}
                        </div>
                        <div className="mt-3 mt-md-0 d-flex gap-2">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(addr)}>
                            <i className="bi bi-pencil-square me-1"></i>Edit
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(addr._id)}>
                            <i className="bi bi-trash me-1"></i>Delete
                          </button>
                          <button 
                            className="btn btn-primary" 
                            onClick={() => handleDeliveryHere(addr)}
                            disabled={processingAddressId === addr._id}
                          >
                            {processingAddressId === addr._id ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Processing...
                              </>
                            ) : (
                              "Delivery Here"
                            )}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}