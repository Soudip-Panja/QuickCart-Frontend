
import { createContext, useState, useEffect } from "react";

export const CartWishlistContext = createContext();

export default function CartWishlistProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [wishListItem, setWishlistItem] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);


  useEffect(() => {
    try {
      const savedSearchHistory = localStorage.getItem("searchHistory");
      if (savedSearchHistory) {
        setSearchHistory(JSON.parse(savedSearchHistory));
      }
    } catch (err) {
      console.error("Failed to load search history:", err);
    }
  }, []);


  useEffect(() => {
    try {
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    } catch (err) {
      console.error("Failed to save search history:", err);
    }
  }, [searchHistory]);


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


  const handleWishlistToggle = async (productId) => {
    if (wishListItem.includes(productId)) {

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


  const updateSearchQuery = (query) => {
    setSearchQuery(query);
  };

  const addToSearchHistory = (query) => {
    if (!query.trim()) return;
    
    const trimmedQuery = query.trim();
    

    const updatedHistory = [
      trimmedQuery,
      ...searchHistory.filter(item => item.toLowerCase() !== trimmedQuery.toLowerCase())
    ].slice(0, 10); // Keep only last 10 searches
    
    setSearchHistory(updatedHistory);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const removeFromSearchHistory = (queryToRemove) => {
    setSearchHistory(prev => 
      prev.filter(query => query.toLowerCase() !== queryToRemove.toLowerCase())
    );
  };

  // Search function that can be used across components
  const searchProducts = (products, query) => {
    if (!query || !products) return products;
    
    const searchTerm = query.toLowerCase();
    
    return products.filter(product => {
      // Search in product name
      const nameMatch = product.name.toLowerCase().includes(searchTerm);
      
      // Search in brand
      const brandMatch = product.brand.toLowerCase().includes(searchTerm);
      
      // Search in categories (assuming product.category is an array)
      const categoryMatch = Array.isArray(product.category) 
        ? product.category.some(cat => cat.toLowerCase().includes(searchTerm))
        : product.category.toLowerCase().includes(searchTerm);
      
      // Search in description if available
      const descriptionMatch = product.description 
        ? product.description.toLowerCase().includes(searchTerm)
        : false;

      return nameMatch || brandMatch || categoryMatch || descriptionMatch;
    });
  };

  // Get search suggestions based on history
  const getSearchSuggestions = (currentQuery) => {
    if (!currentQuery.trim()) return searchHistory.slice(0, 5);
    
    const query = currentQuery.toLowerCase();
    return searchHistory
      .filter(item => item.toLowerCase().includes(query))
      .slice(0, 5);
  };

  return (
    <CartWishlistContext.Provider
      value={{
        // Cart & Wishlist
        cartItems,
        wishListItem,
        handleAddToCart,
        handleWishlistToggle,
        
        // Search functionality
        searchQuery,
        searchHistory,
        updateSearchQuery,
        addToSearchHistory,
        clearSearchHistory,
        removeFromSearchHistory,
        searchProducts,
        getSearchSuggestions,
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
}