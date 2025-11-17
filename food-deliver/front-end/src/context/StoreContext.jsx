import { createContext, useEffect, useState } from "react";
import { menu_list } from "../assets/assets"; // Giữ lại menu_list để render các nút
import axios from "axios";
export const StoreContext = createContext(null);
import { toast } from "react-toastify";

const StoreContextProvider = (props) => {

    const url = "http://localhost:4000"
    const [food_list, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("")
    const [showLogin, setShowLogin] = useState(false);
    const [role, setRole] = useState(localStorage.getItem("role") || null);
    
    // 1. Thêm state 'category' (sửa lỗi 'category is not defined')
    const [category, setCategory] = useState("All");

    const currency = "vnđ";
    const deliveryCharge = 50;

    // --- CÁC HÀM XỬ LÝ GIỎ HÀNG ---
    const addToCart = async (itemId, quantity = 1) => {
        setCartItems((prev) => {
            const currentQty = prev[itemId] || 0;
            return { ...prev, [itemId]: currentQty + quantity };
        }); 
        if (token) {
            await axios.post(
            url + "/api/cart/add",
            { itemId, quantity },
            { headers: { Authorization: `Bearer ${token}` } }
            );
        }
    };

    const removeFromCart = async (itemId) => {
        const currentQty = cartItems[itemId];
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { Authorization: `Bearer ${token}` } });
        }
        if (currentQty - 1 <= 0) {
            toast.success("Removed from cart successfully!");
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            try {
              if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }  
            } catch (error) {
                console.log(error);
            }
        }
        return totalAmount;
    }
    
    // --- CÁC HÀM TẢI DỮ LIỆU ---

    // 2. Hàm fetchFoodList (sẽ chạy dựa trên state 'category')
    const fetchFoodList = async () => {
        try {
            // Sửa logic: dùng API public, không cần token
            let endpoint = (category === "All")
                ? "/api/food/all" // API public lấy tất cả
                : `/api/food/list/menu/${category}`; // API public theo category

            const response = await axios.get(url + endpoint);
            setFoodList(response.data.data);
        } catch (error) {
            console.error("Error fetching food list:", error);
            toast.error("Could not load food items.");
        }
    }

    // Tải giỏ hàng (chỉ chạy khi có token)
    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: { Authorization: `Bearer ${token}` } });
        setCartItems(response.data.cartData);
    }

    // --- EFFECTS ---

    // 3. Tách useEffect: (Chỉ chạy 1 lần để load token/giỏ hàng)
    useEffect(() => {
        async function loadInitialData() {
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"))
                await loadCartData(localStorage.getItem("token"))
            }
        }
        loadInitialData();
    }, [])

    // 4. useEffect (Chạy khi category thay đổi)
    useEffect(() => {
        fetchFoodList();
    }, [category]); // <-- Tự động fetch lại khi category thay đổi

    // --- CONTEXT VALUE ---
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
        // 5. Thêm category và setCategory vào context
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