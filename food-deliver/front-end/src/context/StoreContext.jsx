import { createContext, useEffect, useState } from "react";
import { menu_list } from "../assets/assets";
import axios from "axios";
export const StoreContext = createContext(null);
import { toast } from "react-toastify";

const StoreContextProvider = (props) => {

    const url = "http://localhost:4000";
    const [food_list, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");
    const [showLogin, setShowLogin] = useState(false);
    const [role, setRole] = useState(localStorage.getItem("role") || null);
    const [category, setCategory] = useState("All");

    const currency = "$";
    const deliveryCharge = 50;

    const addToCart = async (itemId, quantity = 1) => {
        const itemInfo = food_list.find((product) => product._id === itemId);
        if (!itemInfo) return;

        const resId = String(itemInfo.restaurantId);

        setCartItems((prev) => {
            const newCart = { ...prev };

            if (!newCart[resId]) {
                newCart[resId] = {};
            }

            newCart[resId][itemId] = (newCart[resId][itemId] || 0) + quantity;

            return newCart;
        });

        if (token) {
            await axios.post(
                url + "/api/cart/add",
                { itemId, quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        }
    };

    const removeFromCart = async (itemId, restaurantId) => {
        setCartItems((prev) => {
            const newCart = { ...prev };

            if (!newCart[restaurantId] || !newCart[restaurantId][itemId]) return prev;

            newCart[restaurantId][itemId] -= 1;

            if (newCart[restaurantId][itemId] <= 0) {
                delete newCart[restaurantId][itemId];
            }

            if (Object.keys(newCart[restaurantId]).length === 0) {
                delete newCart[restaurantId];
            }

            return newCart;
        });

        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { Authorization: `Bearer ${token}` } });
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const resId in cartItems) {
            const restaurantCart = cartItems[resId];
            for (const itemId in restaurantCart) {
                try {
                    if (restaurantCart[itemId] > 0) {
                        let itemInfo = food_list.find((product) => product._id === itemId);
                        if (itemInfo) {
                            totalAmount += itemInfo.price * restaurantCart[itemId];
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        try {
            let endpoint = (category === "All")
                ? "/api/food/all"
                : `/api/food/list/menu/${category}`;

            const response = await axios.get(url + endpoint);
            setFoodList(response.data.data);
        } catch (error) {
            console.error("Error fetching food list:", error);
            toast.error("Could not load food items.");
        }
    }

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(url + "/api/cart/get", {}, { headers: { Authorization: `Bearer ${token}` } });
            setCartItems(response.data.cartData);
        } catch (error) {
            console.error("Load cart error", error);
        }
    }

    useEffect(() => {
        async function loadInitialData() {
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"))
                await loadCartData(localStorage.getItem("token"))
            }
        }
        loadInitialData();
    }, [])

    useEffect(() => {
        fetchFoodList();
    }, [category]);

    const contextValue = {
        url,
        food_list,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        role,
        setRole,
        loadCartData,
        setCartItems,
        currency,
        deliveryCharge,
        showLogin,
        setShowLogin,
        category,
        setCategory
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;