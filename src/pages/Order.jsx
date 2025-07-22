import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Order() {
  return (
    <>
      <Header />
      <main className="container py-5 d-flex justify-content-center">
        <div className="card p-4 text-center shadow-sm w-100" style={{ maxWidth: "600px" }}>
          <div className="mb-3">
            <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center"
                 style={{ width: "80px", height: "80px" }}>
              <i className="bi bi-check-lg text-success fs-2"></i>
            </div>
          </div>
          <h3 className="fw-bold mb-2">Order Placed Successfully!</h3>
          <p className="text-muted">
            Thank you for your purchase. Your order has been received and will be processed shortly.
          </p>
          <a href="/products" className="btn btn-primary btn-lg mt-3">Continue Shopping</a>
        </div>
      </main>
      <Footer />
    </>
  );
}
