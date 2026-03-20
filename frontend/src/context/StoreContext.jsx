import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [food_list, setFoodList] = useState([]);
  const url = "https://online-food-delivery-0ca5.onrender.com";

  // Get token from localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      fetchCartData();
    }
    fetchFoodList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCartData = async () => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData || {});
      }
    } catch (error) {
      console.error("Failed to fetch cart data:", error);
    }
  };

  const addToCart = async (itemId) => {
    if (!isLoggedIn) {
      alert("Please login to add items to cart.");
      return;
    }

    try {
      const response = await axios.post(
        `${url}/api/cart/add`,
        { itemId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setCartItems((prev) => ({
          ...prev,
          [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
        }));
      } else {
        alert("Failed to add item to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isLoggedIn) {
      alert("Please login to remove items from cart.");
      return;
    }

    try {
      const response = await axios.post(
        `${url}/api/cart/remove`,
        { itemId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setCartItems((prev) => {
          const newCart = { ...prev };
          if (newCart[itemId] > 1) {
            newCart[itemId] -= 1;
          } else {
            delete newCart[itemId];
          }
          return newCart;
        });
      } else {
        alert("Failed to remove item from cart.");
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const item = food_list.find((product) => product._id === itemId);
      if (item && cartItems[itemId] > 0) {
        totalAmount += item.price * cartItems[itemId];
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Failed to fetch food list:", error);
    }
  };

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    isLoggedIn,
    setIsLoggedIn,
    token, // ✅ Include token in the context!
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
