import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CartWishlistProvider from "./context/CartWishlistContext";

import App from "./App.jsx";
import Products from "./pages/Products.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import WishList from "./pages/WishList.jsx";
import Cart from "./pages/Cart.jsx";
import Address from "./pages/Address.jsx";
import Order from "./pages/Order.jsx";
import Profile from "./pages/Profile.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/products/:productId",
    element: <ProductDetails />,
  },
  {
    path: "/wishlist",
    element: <WishList />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/address",
    element: <Address />,
  },
  {
    path: "/order",
    element: <Order />,
  },
  {
    path: "/profile",
    element: <Profile />
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartWishlistProvider>
      <RouterProvider router={router} />
    </CartWishlistProvider>
  </StrictMode>
);
