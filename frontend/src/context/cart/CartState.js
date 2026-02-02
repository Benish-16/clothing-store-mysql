
import React, { createContext, useContext, useState, useEffect } from "react";

import CartContext from "./CartContext";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/cart/fetchcart", {
        headers: { "auth-token": localStorage.getItem("token") },
      });
      const data = await res.json();
      setCartItems(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item, qty ) => {
    try {
      const res = await fetch("http://localhost:5000/api/cart/addcart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ ...item, quantity: qty }),
      });
        fetchCart(); 
      const data = await res.json();
      if (data.success) {
     
      }
    } catch (err) {
      console.error(err);
    }
  };
 const removeFromCart = async (item ) => {
    console.log( item.product_id,item.variant_color, item.size);
    try {
      const res = await fetch("http://localhost:5000/api/cart/removecart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
          body: JSON.stringify({
        productId: item.product_id,  
        color: item.variant_color,
        size: item.size,
        quantity:item.qunatity
      }),
   

      });
        fetchCart(); 
      const data = await res.json();
      if (data.success) {
     
      }
    } catch (err) {
      console.error(err);
    }
  };
   const clearCart = () => {
    setCartItems([]);
  };
  return (
    <CartContext.Provider
      value={{ cartItems, setCartItems, loading, addToCart,removeFromCart,clearCart   }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
