import useFetch from "../useFetch";
import { useState } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

function StarRating({ productRating }) {
  const renderStar = (rating) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
      } else if (rating >= i - 0.5) {
        stars.push(<i key={i} className="bi bi-star-half text-warning"></i>);
      } else {
        stars.push(<i key={i} className="bi bi-star text-warning"></i>);
      }
    }
    return stars;
  };
  return renderStar(productRating);
}

function StarFilterLayout() {
  const ratingOptions = [];
  for (let rating = 4; rating >= 1; rating--) {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
    }
    ratingOptions.push(
      <div key={rating}>
        <label htmlFor={`rating-${rating}`}>
          <input
            type="radio"
            id={`rating-${rating}`}
            name="starRating"
            value={rating}
          />{" "}
          {`${rating}+`} {stars}
        </label>
      </div>
    );
  }
  return ratingOptions;
}

export default function Products() {
  const { data, loading, error } = useFetch(
    "https://shopping-backend-blush.vercel.app/products"
  );
  const [cartItems, setCartItems] = useState([]);
  const [wishListItem, setWishlistItem] = useState([]);
  const [priceRange, setPriceRange] = useState(1000);

  const handlePriceRangeChange = (event) => {
    setPriceRange(event.target.value);
  };

  const handleCartButton = (productId) => {
    setCartItems((prevCart) => [...prevCart, productId]);
  };

  const handleWishlistButton = (productId) => {
    if (wishListItem.includes(productId)) {
      setWishlistItem((prevWishlist) =>
        prevWishlist.filter((id) => id !== productId)
      );
    } else {
      setWishlistItem((prevWishlist) => [...prevWishlist, productId]);
    }
  };

  console.log(data);
  return (
    <>
      <Header />
      <main className="container py-5">
        {loading && <p>loading....</p>}
        {error && <p>error.....</p>}

        {/* Filter Layout Part */}
        <div className="d-md-none mb-3">
          <button
            className="btn btn-primary w-100"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#filterCollapse"
            aria-expanded="false"
            aria-controls="filterCollapse"
          >
            <i className="bi bi-funnel me-2"></i>
            Filters
            <i className="bi bi-chevron-down ms-2"></i>
          </button>
        </div>

        <div className="row g-3">
          <div className="col-md-3">
            <div className="collapse d-md-block" id="filterCollapse">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Filters</h5>
                    <p className="text-primary">Clear</p>
                  </div>
                  <hr />

                  <h5>Category</h5>
                  <label htmlFor="Men">
                    <input type="checkbox" value="Men" id="Men" /> Men
                  </label>
                  <br />
                  <label htmlFor="Women">
                    <input type="checkbox" value="Women" id="Women" /> Women
                  </label>
                  <br />
                  <label htmlFor="Kids">
                    <input type="checkbox" value="Kids" /> Kids
                  </label>
                  <br />
                  <label htmlFor="Electronics">
                    <input
                      type="checkbox"
                      value="Electronics"
                      id="Electronics"
                    />{" "}
                    Electronics
                  </label>
                  <br />
                  <label htmlFor="Home">
                    <input type="checkbox" value="Home" id="Home" /> Home
                  </label>
                  <br />
                  <label htmlFor="Accessories">
                    <input
                      type="checkbox"
                      value="Accessories"
                      id="Accessories"
                    />{" "}
                    Accessories
                  </label>
                  <br />
                  <label htmlFor="Footware">
                    <input type="checkbox" value="Footware" id="Footware" />{" "}
                    Footware
                  </label>
                  <br />
                  <label htmlFor="Cosmetics">
                    <input type="checkbox" value="Cosmetics" id="Cosmetics" />{" "}
                    Cosmetics
                  </label>
                  <br />
                  <hr />

                  
                  <h5>Price Range</h5>
                  <label for="customRange3" class="form-label"></label>
                  <input
                    type="range"
                    class="form-range"
                    min="100"
                    max="2000"
                    step="100"
                    id="customRange3"
                    value={priceRange}
                    onChange={handlePriceRangeChange}
                  ></input>
                  <div className="d-flex justify-content-between align-items-center">
                    <p>₹100</p>
                    <p className="badge bg-primary">₹{priceRange}</p>
                    <p>₹2000</p>
                  </div>
                  <hr />

                  <h5>Rating</h5>
                  <StarFilterLayout />
                  <hr />

                  <h5>Short by</h5>
                  <label htmlFor="LowToHigh">
                    <input
                      type="radio"
                      id="LowToHigh"
                      name="priceShort"
                      value="LowToHigh"
                    />{" "}
                    Price - Low to High
                  </label>
                  <br />
                  <label htmlFor="HighToLow">
                    <input
                      type="radio"
                      id="HighToLow"
                      name="priceShort"
                      value="HighToLow"
                    />{" "}
                    Price - High to Low
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Product Card Layout */}
          <div className="col-md-9">
            <h3>All Products</h3>
            {data && data.products && data.products.length > 0 ? (
              <div className="row g-3">
                {data.products.map((product) => (
                  <div className="col-6 col-md-4 col-lg-3" key={product._id}>
                    <div className="card h-100">
                      <div className="position-relative">
                        <img
                          src={product.imageUrl[0]}
                          alt={product.name}
                          className="card-img-top"
                        />
                        <div className="position-absolute top-0 end-0 m-2">
                          <button
                            onClick={() => handleWishlistButton(product._id)}
                            className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center"
                            style={{ width: "40px", height: "40px" }}
                          >
                            {wishListItem.includes(product._id) ? (
                              <span>
                                <i class="bi bi-heart-fill text-danger"></i>
                              </span>
                            ) : (
                              <span>
                                <i className="bi bi-heart"></i>
                              </span>
                            )}
                          </button>
                        </div>

                        <div>
                          <p className="badge bg-dark text-white text-uppercase position-absolute bottom-0 start-0 m-2">
                            {product.brand}
                          </p>
                        </div>
                      </div>

                      <div className="card-body">
                        <div
                          className="d-flex justify-content-between align-items-center"
                          style={{ fontSize: "13px" }}
                        >
                          <p className="card-text text-uppercase mb-0">
                            <small>{product.category}</small>
                          </p>
                          <p className="mb-0">
                            <StarRating productRating={product.rating} /> (
                            {product.rating})
                          </p>
                        </div>

                        <div className="text-center">
                          <h3 className="card-title">{product.name}</h3>
                          <p>
                            <strong>₹{product.price}</strong>
                          </p>
                        </div>

                        <button
                          className={`w-100 ${
                            cartItems.includes(product._id)
                              ? "btn btn-success"
                              : "btn btn-primary"
                          }`}
                          onClick={() => handleCartButton(product._id)}
                        >
                          {cartItems.includes(product._id) ? (
                            <span>
                              <i className="bi bi-cart4"></i> Go to Cart
                            </span>
                          ) : (
                            <span>
                              <i className="bi bi-cart3"></i> Add to Cart
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No products available.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
