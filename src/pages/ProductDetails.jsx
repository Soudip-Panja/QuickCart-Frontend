import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import useFetch from "../useFetch";

import Header from "../components/Header";
import Footer from "../components/Footer";

import { useContext } from "react";
import { CartWishlistContext } from "../context/CartWishlistContext";

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

export default function ProductDetails() {
  const { productId } = useParams();

  const { cartItems, wishListItem, handleAddToCart, handleWishlistToggle } =
    useContext(CartWishlistContext);

  const { data, loading, error } = useFetch(
    `https://shopping-backend-blush.vercel.app/products/${productId}`
  );

  console.log(data);

  // Loading state - similar to Cart.jsx
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

  // Error state - similar to Cart.jsx
  if (error || !data?.product) {
    return (
      <>
        <Header />
        <main className="container py-5 text-center">
          <div className="alert alert-danger">
            {error || "Error loading product details."}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const product = data.product;

  return (
    <>
      <Header />
      <main className="container my-4">
        <h2 className="mb-4">Product Details</h2>

        <div className="row">
          <div className="col-md-5">
            <div className="card">
              <div
                className="position-relative"
                style={{ paddingBottom: "100%" }}
              >
                <img
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{ objectFit: "contain" }}
                  src={product.imageUrl[0]}
                  alt={`${product.name} image`}
                />
              </div>
            </div>
          </div>

          <div className="col-md-7">
            <div className="card border-0">
              <div className="card-body">
                <p className="card-text">
                  <span className="badge bg-danger text-uppercase">
                    {product.category[0]}
                  </span>
                  <span className="mx-2">
                    <StarRating productRating={product.rating} />
                  </span>
                  ({product.rating})
                </p>
                <h2 className="card-text">{product.name}</h2>
                <h3 className="text-primary card-text">{`₹${product.price}`}</h3>
                <p className="card-text py-3">{product.description}</p>

                <div className="d-flex align-items-center gap-3">

                  
                  {/* Fixed Add to Cart Button */}
                  <button
                    className={`btn ${
                      cartItems.includes(product._id)
                        ? "btn btn-success"
                        : "btn btn-primary"
                    }`}
                    onClick={() => handleAddToCart(product._id)}
                  >
                    {cartItems.includes(product._id) ? (
                      <Link
                        to="/cart"
                        className="text-white text-decoration-none"
                      >
                        <i className="bi bi-cart4"></i> Go to Cart
                      </Link>
                    ) : (
                      <span>
                        <i className="bi bi-cart3"></i> Add to Cart
                      </span>
                    )}
                  </button>

                  {/* Fixed Wishlist Button */}
                  <button
                    onClick={() => handleWishlistToggle(product._id)}
                    className="btn btn-outline-danger"
                  >
                    {wishListItem.includes(product._id) ? (
                      <i className="bi bi-heart-fill text-danger"></i>
                    ) : (
                      <i className="bi bi-heart"></i>
                    )}
                  </button>
                </div>
                <br />
                <hr />

                <div className="d-flex justify-content-between">
                  <div>
                    <div>
                      <strong>SKU</strong>
                    </div>
                    <div>{product.SKU}</div>
                  </div>
                  <div>
                    <div>
                      <strong>Category</strong>
                    </div>
                    <div>{product.category}</div>
                  </div>
                  <div>
                    <div>
                      <strong>Availability</strong>
                    </div>
                    <div
                      className={
                        product.stock > 0 ? "text-success" : "text-danger"
                      }
                    >
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details part */}
        <div className="card border-0 my-5">
          <nav>
            <div className="nav nav-tabs" id="nav-tab" role="tablist">
              <button
                className="nav-link active"
                id="nav-home-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-home"
                type="button"
                role="tab"
                aria-controls="nav-home"
                aria-selected="true"
              >
                Description
              </button>

              <button
                className="nav-link"
                id="nav-profile-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-profile"
                type="button"
                role="tab"
                aria-controls="nav-profile"
                aria-selected="false"
              >
                Specifications
              </button>
            </div>
          </nav>
          <div className="tab-content" id="nav-tabContent">
            <div
              className="mx-3 my-3 tab-pane fade show active"
              id="nav-home"
              role="tabpanel"
              aria-labelledby="nav-home-tab"
              tabIndex="0"
            >
              {product.description}
            </div>

            <div
              className="mx-3 my-3 tab-pane fade"
              id="nav-profile"
              role="tabpanel"
              aria-labelledby="nav-profile-tab"
              tabIndex="0"
            >
              <table className="table border">
                <thead>
                  <tr>
                    <th colSpan="2">
                      <h5 className="my-2">Product Specifications</h5>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="fw-bold border-end" style={{ width: "25%" }}>
                      Category
                    </td>
                    <td>{product.category[0]}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold border-end" style={{ width: "25%" }}>
                      Rating
                    </td>
                    <td>{`${product.rating} out of 5`}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold border-end" style={{ width: "25%" }}>
                      Price
                    </td>
                    <td>{`₹${product.price}`}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold border-end" style={{ width: "25%" }}>
                      Product ID
                    </td>
                    <td>{product._id}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}