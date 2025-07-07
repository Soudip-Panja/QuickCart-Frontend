import useFetch from "../useFetch";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FaArrowDownShortWide, FaArrowUpWideShort } from "react-icons/fa6";

import { CategoryFilter } from "../components/ListingData";
import { CollectionFilter } from "../components/ListingData";

import Header from "../components/Header";
import Footer from "../components/Footer";

//Star logic weather the start is full, half anf empty
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

//Card Star dynaic layout logic
function StarFilterLayout({ selectedRating, setSelectedRating }) {
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
            checked={selectedRating === rating}
            onChange={() => setSelectedRating(rating)}
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

  const location = useLocation();
  const categoryFromState = location.state?.selectedCategory || null;

  const [selectedCategories, setSelectedCategories] = useState(
    categoryFromState ? [categoryFromState] : []
  );
  const [priceRange, setPriceRange] = useState(10000);
  const [selectedRating, setSelectedRating] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedCategories([...selectedCategories, value]);
    } else {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== value));
    }
  };

  const handlePriceRangeChange = (event) => {
    setPriceRange(event.target.value);
  };

  //Card Layout add to cart button color changer
  const handleCartButton = (productId) => {
    setCartItems((prevCart) => [...prevCart, productId]);
  };

  //Card Layout wishlist button part
  const handleWishlistButton = (productId) => {
    if (wishListItem.includes(productId)) {
      setWishlistItem((prevWishlist) =>
        prevWishlist.filter((id) => id !== productId)
      );
    } else {
      setWishlistItem((prevWishlist) => [...prevWishlist, productId]);
    }
  };



  // Filtered Products logic part
  let filteredProducts = [];
  if (data && data.products) {
    filteredProducts = data.products.filter((product) => {
      let isInSelectedCategory = false;

      if (selectedCategories.length === 0) {
        isInSelectedCategory = true;
      } else {
        for (let i = 0; i < product.category.length; i++) {
          if (selectedCategories.includes(product.category[i])) {
            isInSelectedCategory = true;
            break;
          }
        }
      }

      if (isInSelectedCategory && product.price <= priceRange) {
        if (selectedRating === null || product.rating >= selectedRating) {
          return true;
        }
      }
      return false;
    });
  }

  if (sortOrder === "lowToHigh") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "highToLow") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange(10000);
    setSelectedRating(null);
    setSortOrder(null);
  };

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
                    <p
                      className="text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={handleClearFilters}
                    >
                      Clear
                    </p>
                  </div>
                  <hr />

                  <div>
                    <h5>Category</h5>
                    {CategoryFilter.map((category) => (
                      <div key={category}>
                        <label htmlFor={`${category}Checkbox`}>
                          <input
                            type="checkbox"
                            id={`${category}Checkbox`}
                            value={category}
                            checked={selectedCategories.includes(category)}
                            onChange={handleCategoryChange}
                          />
                          {""} {category}
                        </label>
                      </div>
                    ))}
                    <hr />
                  </div>

                  {/* <div className="mb-4">
                    <h5 className="mb-2">Special Collection</h5>
                    <div className="input-group">
                      <select className="form-select">
                        <option selected disabled>
                          Choose Collection...
                        </option>
                        {CollectionFilter.map((collection) => (
                          <option value={collection.optionName}>
                            {collection.optionText}
                          </option>
                        ))}
                      </select>
                    </div>
                    <hr />
                  </div> */}

                  <h5>Price Range</h5>
                  <label for="customRange3" class="form-label"></label>
                  <input
                    type="range"
                    class="form-range"
                    min="100"
                    max="20000"
                    step="100"
                    id="customRange3"
                    value={priceRange}
                    onChange={handlePriceRangeChange}
                  ></input>
                  <div className="d-flex justify-content-between align-items-center">
                    <p>₹100</p>
                    <p className="badge bg-primary">₹{priceRange}</p>
                    <p>₹20000</p>
                  </div>
                  <hr />

                  <h5>Rating</h5>
                  <StarFilterLayout
                    selectedRating={selectedRating}
                    setSelectedRating={setSelectedRating}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* All products heading, short by and card layout. */}
          <div className="col-md-9">
            <div className="d-flex justify-content-between align-items-center mb-3">
              {/* All products count, heading and shortlist button */}
              <div>
                <h3>All Products ({filteredProducts.length})</h3>
              </div>
              <div className="d-flex align-items-center gap-2">
                <h5 className="mb-0">Sort by</h5>
                <button
                  className={`btn ${
                    sortOrder === "highToLow" ? "btn-success" : "btn-primary"
                  }`}
                  onClick={() => setSortOrder("highToLow")}
                >
                  <FaArrowUpWideShort />
                </button>
                <button
                  className={`btn ${
                    sortOrder === "lowToHigh" ? "btn-success" : "btn-primary"
                  }`}
                  onClick={() => setSortOrder("lowToHigh")}
                >
                  <FaArrowDownShortWide />
                </button>
              </div>
            </div>

            {/* Card Layout */}
            {filteredProducts && filteredProducts.length > 0 ? (
              <div className="row g-3">
                {filteredProducts.map((product) => (
                  <div className="col-6 col-md-4 col-lg-3" key={product._id}>
                    <div className="card h-100 d-flex flex-column">
                      <div className="position-relative">
                        <Link
                          to={`/products/${product._id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <img
                            src={product.imageUrl[0]}
                            alt={product.name}
                            className="card-img-top"
                            style={{
                              height: "250px",
                              objectFit: "cover",
                            }}
                          />
                        </Link>
                        <div className="position-absolute top-0 end-0 m-2">
                          <button
                            onClick={() => handleWishlistButton(product._id)}
                            className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center"
                            style={{ width: "40px", height: "40px" }}
                          >
                            {wishListItem.includes(product._id) ? (
                              <span>
                                <i className="bi bi-heart-fill text-danger"></i>
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

                      <div className="card-body d-flex flex-column">
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

                        <div className="mt-auto">
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
