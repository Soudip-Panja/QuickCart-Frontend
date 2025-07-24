import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Profile() {
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const API_URL = "https://shopping-backend-git-main-soudip-panjas-projects.vercel.app/address";


  useEffect(() => {
    fetchDefaultAddress();
  }, []);

  const fetchDefaultAddress = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data && data.length > 0) {
        setDefaultAddress(data[0]); 
      }
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="container my-5">
        <div className="card mx-auto shadow-lg" style={{ maxWidth: "500px" }}>
          <div className="card-body text-center">

            <div className="position-relative d-inline-block mb-3">
              <img
                src="https://shorturl.at/oLPQF"
                alt="Profile Avatar"
                className="rounded-circle border border-3 border-primary"
                width="120"
                height="120"
              />

              <span 
                className="position-absolute bottom-0 end-0 bg-primary rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "30px", height: "30px", cursor: "pointer" }}
                title="Change Avatar"
              >
                <i className="bi bi-camera text-white"></i>
              </span>
            </div>


            <h4 className="card-title mb-3">Soudip Panja</h4>
            
            <div className="text-start mb-4">
              <p className="card-text text-muted mb-2">
                <i className="bi bi-envelope me-2 text-primary"></i>
                <strong>Email:</strong> soudip03panja@gmail.com
              </p>
              <p className="card-text text-muted mb-0">
                <i className="bi bi-telephone me-2 text-primary"></i>
                <strong>Phone:</strong> 8420903019
              </p>
            </div>

 
            <hr className="my-4" />
            
            <div className="text-start">
              <h6 className="text-primary mb-3">
                <i className="bi bi-geo-alt me-2"></i>
                Default Address
              </h6>
              
              {loading ? (
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted mt-2 mb-0 small">Loading address...</p>
                </div>
              ) : defaultAddress ? (
                <div className="bg-light rounded p-3">
                  <p className="mb-1 fw-bold">
                    {defaultAddress.firstName} {defaultAddress.lastName}
                  </p>
                  <p className="mb-1 text-muted small">
                    <i className="bi bi-telephone-fill me-1"></i>
                    {defaultAddress.mobile}
                  </p>
                  <p className="mb-0 text-muted small">
                    <i className="bi bi-house-fill me-1"></i>
                    {defaultAddress.street}, {defaultAddress.locality}<br />
                    {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.pincode}
                  </p>
                </div>
              ) : (
                <div className="bg-light rounded p-3 text-center">
                  <i className="bi bi-house-slash text-muted fs-4"></i>
                  <p className="text-muted mt-2 mb-0">No address found</p>
                  <small className="text-muted">Add an address in checkout to see it here</small>
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