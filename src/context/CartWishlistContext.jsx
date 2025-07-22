// src/context/CartWishlistContext.jsx
import { createContext, useState, useEffect } from "react";

export const CartWishlistContext = createContext();

export default function CartWishlistProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [wishListItem, setWishlistItem] = useState([]);

  // Fetch Cart Items
  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await fetch("https://shopping-backend-soudip-panjas-projects.vercel.app/cart");
        const data = await res.json();
        const ids = data.map(item => item.productId._id);
        setCartItems(ids);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    }
    fetchCart();
  }, []);

  // Fetch Wishlist Items
  useEffect(() => {
    async function fetchWishlist() {
      try {
        const res = await fetch("https://shopping-backend-blush.vercel.app/wishlist");
        const data = await res.json();
        const ids = data.map(item => item.productId._id);
        setWishlistItem(ids);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      }
    }
    fetchWishlist();
  }, []);

  // Add to Cart
  const handleAddToCart = async (productId) => {
    if (cartItems.includes(productId)) return;
    setCartItems(prev => [...prev, productId]);
    try {
      const res = await fetch("https://shopping-backend-soudip-panjas-projects.vercel.app/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) {
        setCartItems(prev => prev.filter(id => id !== productId));
        console.error("Failed to add to cart");
      }
    } catch (err) {
      setCartItems(prev => prev.filter(id => id !== productId));
      console.error("Error adding to cart:", err);
    }
  };

  // Add/Remove from Wishlist
  const handleWishlistToggle = async (productId) => {
    if (wishListItem.includes(productId)) {
      // Remove
      setWishlistItem(prev => prev.filter(id => id !== productId));
      try {
        const res = await fetch("https://shopping-backend-blush.vercel.app/wishlist");
        const data = await res.json();
        const item = data.find(item => item.productId._id === productId);
        if (item) {
          await fetch(`https://shopping-backend-blush.vercel.app/wishlist/${item._id}`, {
            method: "DELETE",
          });
        }
      } catch (err) {
        console.error("Failed to remove from wishlist:", err);
      }
    } else {
      // Add
      setWishlistItem(prev => [...prev, productId]);
      try {
        const res = await fetch("https://shopping-backend-blush.vercel.app/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        if (!res.ok) {
          console.error("Failed to add to wishlist");
        }
      } catch (err) {
        console.error("Error adding to wishlist:", err);
      }
    }
  };

  return (
    <CartWishlistContext.Provider
      value={{
        cartItems,
        wishListItem,
        handleAddToCart,
        handleWishlistToggle,
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
}
