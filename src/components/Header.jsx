import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { CartWishlistContext } from "../context/CartWishlistContext";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const { cartItems, wishListItem } = useContext(CartWishlistContext);

  useEffect(() => {
    // Check localStorage first, then fall back to system preference
    const savedTheme = localStorage.getItem("theme");
    let isDarkMode = false;

    if (savedTheme) {
      isDarkMode = savedTheme === "dark";
    } else {
      // If no saved preference, check system preference
      isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    setDarkMode(isDarkMode);
    document.documentElement.setAttribute("data-bs-theme", isDarkMode ? "dark" : "light");
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    
    // Save to localStorage
    localStorage.setItem("theme", newMode ? "dark" : "light");
    
    // Update DOM attribute
    document.documentElement.setAttribute("data-bs-theme", newMode ? "dark" : "light");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src="/QuickCart Nav Logo.png" style={{ height: "50px" }} alt="QuickCart Logo" />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapseButton"
            aria-controls="navbarCollapseButton"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarCollapseButton">
            <div className="col-12 col-lg-6 mx-auto my-2 my-lg-0 order-2 order-lg-1">
              <form className="d-flex" role="search">
                <div className="input-group">
                  <input
                    className="form-control"
                    type="search"
                    placeholder="Search products by name, brand or category..."
                    aria-label="Search"
                  />
                  <button className="btn btn-outline-secondary" type="submit">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </form>
            </div>

            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 order-1 order-lg-2">
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-1"></i>
                  Profile
                </Link>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="bi bi-person me-2"></i> My Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/orders">
                      <i className="bi bi-bag me-2"></i> My Orders
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log("Logout clicked");
                      }}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="nav-item position-relative">
                <Link className="nav-link d-flex align-items-center" to="/wishlist">
                  <i className="bi bi-heart me-1"></i> Wishlist
                  {wishListItem.length > 0 && (
                    <span className="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill">
                      {wishListItem.length}
                    </span>
                  )}
                </Link>
              </li>

              <li className="nav-item position-relative">
                <Link className="nav-link d-flex align-items-center" to="/cart">
                  <i className="bi bi-cart3 me-1"></i> Cart
                  {cartItems.length > 0 && (
                    <span className="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
              </li>

              <li className="nav-item">
                <button
                  className="nav-link btn btn-link d-flex align-items-center"
                  onClick={toggleDarkMode}
                  aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  <i className={`bi ${darkMode ? "bi-sun" : "bi-moon"} me-1`}></i>
                  {darkMode ? "Light" : "Dark"}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}