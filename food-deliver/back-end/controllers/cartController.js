import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";

const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId, quantity } = req.body;
        const addQuantity = quantity ? Number(quantity) : 1;

        const foodItem = await foodModel.findById(itemId);
        if (!foodItem) return res.json({ success: false, message: "Not found" });
        
        const itemRestaurantId = foodItem.restaurantId.toString();

        let userData = await userModel.findById(userId);
        
        if (!userData.cartData) userData.cartData = {}; 
        
        if (!userData.cartData[itemRestaurantId]) {
            userData.cartData[itemRestaurantId] = {};
        }
        if (!userData.cartData[itemRestaurantId][itemId]) {
            userData.cartData[itemRestaurantId][itemId] = addQuantity;
        } else {
            userData.cartData[itemRestaurantId][itemId] += addQuantity;
        }

        userData.markModified('cartData'); 

        await userData.save();

        res.json({ success: true, message: "Added to Cart" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        let userData = await userModel.findById(userId);
        let cartData = userData.cartData;

        if (cartData.items[req.body.itemId] > 0) {
            cartData.items[req.body.itemId] -= 1;

            if (cartData.items[req.body.itemId] === 0) {
                delete cartData.items[req.body.itemId];
            }
        }

        if (Object.keys(cartData.items).length === 0) {
            cartData.restaurantId = null;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Removed from Cart" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        let userData = await userModel.findById(userId);

        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData;
        res.json({ success: true, cartData })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

export { addToCart, removeFromCart, getCart }