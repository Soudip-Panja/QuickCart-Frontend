import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MyOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");
    setOrders(savedOrders);
    setLoading(false);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "order placed":
        return "bg-success";
      case "processing":
        return "bg-warning";
      case "shipped":
        return "bg-info";
      case "delivered":
        return "bg-primary";
      case "cancelled":
        return "bg-danger";
      default:
        return "bg-secondary";
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

  return (
    <>
      <Header />
      <main className="container py-5">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0">
                <i className="bi bi-bag-check me-2"></i>
                My Orders
              </h2>
              <span className="badge bg-primary fs-6">
                {orders.length} {orders.length === 1 ? "Order" : "Orders"}
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="card">
                <div className="card-body text-center py-5">
                  <i className="bi bi-bag-x display-1 text-body-secondary mb-3"></i>
                  <h4 className="text-body-secondary">No Orders Found</h4>
                  <p className="text-body-secondary mb-4">You haven't placed any orders yet.</p>
                  <a href="/products" className="btn btn-primary">
                    <i className="bi bi-shop me-2"></i>
                    Start Shopping
                  </a>
                </div>
              </div>
            ) : (
              <div className="row g-4">
                {orders.map((order, index) => (
                  <div key={order.orderId} className="col-12">
                    <div className="card shadow-sm border border-secondary-subtle">
                      <div className="card-header bg-body-tertiary">
                        <div className="row align-items-center">
                          <div className="col-md-6">
                            <h5 className="mb-1 text-body">
                              <i className="bi bi-receipt me-2"></i>
                              Order #{order.orderId}
                            </h5>
                            <small className="text-body-secondary">
                              <i className="bi bi-calendar3 me-1"></i>
                              Placed on {formatDate(order.orderDate)}
                            </small>
                          </div>
                          <div className="col-md-6 text-md-end mt-2 mt-md-0">
                            <span className={`badge ${getStatusBadgeClass(order.status)} fs-6 me-2`}>
                              {order.status}
                            </span>
                            <h5 className="mb-0 d-inline text-body">
                              Total: ₹{order.totalAmount.toFixed(2)}
                            </h5>
                          </div>
                        </div>
                      </div>

                      <div className="card-body">
                        <div className="row mb-4">
                          {/* Delivery Address */}
                          <div className="col-md-6">
                            <h6 className="text-primary mb-2">
                              <i className="bi bi-geo-alt-fill me-2"></i>
                              Delivery Address
                            </h6>
                            <div className="bg-body-tertiary p-3 rounded">
                              <strong className="text-body">
                                {order.deliveryAddress.firstName} {order.deliveryAddress.lastName}
                              </strong>
                              <br />
                              <small className="text-body-secondary d-block mb-1">
                                <i className="bi bi-telephone me-1"></i>
                                {order.deliveryAddress.mobile}
                              </small>
                              <span className="text-body">
                                {order.deliveryAddress.street}, {order.deliveryAddress.locality}
                                <br />
                                {order.deliveryAddress.city}, {order.deliveryAddress.state} -{" "}
                                {order.deliveryAddress.pincode}
                              </span>
                            </div>
                          </div>

                          {/* Order Summary */}
                          <div className="col-md-6 mt-3 mt-md-0">
                            <h6 className="text-primary mb-2">
                              <i className="bi bi-box-seam me-2"></i>
                              Order Summary
                            </h6>
                            <div className="bg-body-tertiary p-3 rounded">
                              <div className="d-flex justify-content-between text-body">
                                <span>Items ({order.items.length})</span>
                                <span>₹{order.totalAmount.toFixed(2)}</span>
                              </div>
                              <div className="d-flex justify-content-between text-body">
                                <span>Shipping</span>
                                <span className="text-success">Free</span>
                              </div>
                              <hr className="my-2" />
                              <div className="d-flex justify-content-between fw-bold text-body">
                                <span>Total Amount</span>
                                <span>₹{order.totalAmount.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Items Ordered */}
                        <h6 className="text-primary mb-3">
                          <i className="bi bi-list-ul me-2"></i>
                          Items Ordered ({order.items.length})
                        </h6>
                        <div className="row g-3">
                          {order.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="col-12">
                              <div className="border rounded p-3">
                                <div className="row align-items-center">
                                  <div className="col-2 col-md-1">
                                    <img
                                      src={item.imageUrl}
                                      alt={item.name}
                                      className="img-fluid rounded border"
                                    />
                                  </div>
                                  <div className="col-10 col-md-4">
                                    <h6 className="mb-1 text-body">{item.name}</h6>
                                    <small className="text-body-secondary">
                                      {item.brand} | {item.category}
                                    </small>
                                  </div>
                                  <div className="col-6 col-md-2 mt-2 mt-md-0">
                                    <small className="text-body-secondary">Quantity:</small>
                                    <br />
                                    <span className="fw-semibold text-body">{item.quantity}</span>
                                  </div>
                                  <div className="col-6 col-md-2 mt-2 mt-md-0">
                                    <small className="text-body-secondary">Price:</small>
                                    <br />
                                    <span className="fw-semibold text-body">
                                      ₹{item.price.toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="col-12 col-md-3 mt-2 mt-md-0 text-md-end">
                                    <small className="text-body-secondary">Subtotal:</small>
                                    <br />
                                    <span className="fw-bold text-primary">
                                      ₹{(item.price * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center mt-5">
              <a href="/products" className="btn btn-outline-primary btn-lg">
                <i className="bi bi-arrow-left me-2"></i>
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
