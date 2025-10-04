import { createContext, useEffect, useState } from 'react';
import { food_list } from '../assets/assets';

export const StoreContext = createContext(null);


const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});

    const addToCart = (id) => {
        if (!cartItems[id]) {
            setCartItems(prev => ({ ...prev, [id]: 1 }));
        }
        else {
            setCartItems(prev => ({ ...prev, [id]: prev[id] + 1 }));
        }
    }

    const removeFromCart = (id) => {
        setCartItems(prev => ({ ...prev, [id]: prev[id] - 1 }));
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((food) => food._id === item);
                totalAmount += cartItems[item] * itemInfo.price;
            }
        }
        return totalAmount;
    }

    const contextValue = {
        food_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
    }
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}
export default StoreContextProvider;