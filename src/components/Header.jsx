import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { CartWishlistContext } from "../context/CartWishlistContext";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const {
    cartItems,
    wishListItem,
    searchQuery,
    updateSearchQuery,
    addToSearchHistory,
    getSearchSuggestions,
  } = useContext(CartWishlistContext);
  const navigate = useNavigate();

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
    document.documentElement.setAttribute(
      "data-bs-theme",
      isDarkMode ? "dark" : "light"
    );
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    // Save to localStorage
    localStorage.setItem("theme", newMode ? "dark" : "light");

    // Update DOM attribute
    document.documentElement.setAttribute(
      "data-bs-theme",
      newMode ? "dark" : "light"
    );
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      const trimmedQuery = localSearchQuery.trim();

      // Add to search history
      addToSearchHistory(trimmedQuery);

      // Update context search query
      updateSearchQuery(trimmedQuery);

      // Hide suggestions
      setShowSuggestions(false);

      // Navigate to products page with search query
      navigate("/products", {
        state: {
          searchQuery: trimmedQuery,
        },
      });
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSuggestionClick = (suggestion) => {
    setLocalSearchQuery(suggestion);
    setShowSuggestions(false);

    // Add to search history
    addToSearchHistory(suggestion);

    // Update context search query
    updateSearchQuery(suggestion);

    // Navigate to products page
    navigate("/products", {
      state: {
        searchQuery: suggestion,
      },
    });
  };

  const handleSearchFocus = () => {
    if (localSearchQuery.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img
              src="/QuickCart Nav Logo.png"
              style={{ height: "50px" }}
              alt="QuickCart Logo"
            />
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
            <div className="col-12 col-lg-6 mx-auto my-2 my-lg-0 order-2 order-lg-1 position-relative">
              <form
                className="d-flex"
                role="search"
                onSubmit={handleSearchSubmit}
              >
                <div className="input-group">
                  <input
                    className="form-control"
                    type="search"
                    placeholder="Search products by name, brand or category..."
                    aria-label="Search"
                    value={localSearchQuery}
                    onChange={handleSearchInputChange}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                  />
                  <button className="btn btn-outline-secondary" type="submit">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </form>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && (
                <div
                  className="position-absolute w-100 mt-1"
                  style={{ zIndex: 1050 }}
                >
                  <div className="card shadow">
                    <div className="list-group list-group-flush">
                      {getSearchSuggestions(localSearchQuery).length > 0 ? (
                        <>
                          <div className="list-group-item list-group-item-action disabled">
                            <small className="text-muted">
                              <i className="bi bi-clock-history me-2"></i>Recent
                              searches
                            </small>
                          </div>
                          {getSearchSuggestions(localSearchQuery).map(
                            (suggestion, index) => (
                              <button
                                key={index}
                                className="list-group-item list-group-item-action d-flex align-items-center"
                                onClick={() =>
                                  handleSuggestionClick(suggestion)
                                }
                                type="button"
                              >
                                <i className="bi bi-search me-2 text-muted"></i>
                                {suggestion}
                              </button>
                            )
                          )}
                        </>
                      ) : (
                        <div className="list-group-item text-muted text-center py-3">
                          <small>No recent searches</small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
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
                    <Link className="dropdown-item" to="/myOrder">
                      <i className="bi bi-bag me-2"></i> My Orders
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
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
                <Link
                  className="nav-link d-flex align-items-center"
                  to="/wishlist"
                >
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
                  aria-label={
                    darkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                >
                  <i
                    className={`bi ${darkMode ? "bi-sun" : "bi-moon"} me-1`}
                  ></i>
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
