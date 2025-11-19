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
        const { itemId } = req.body; // Lấy itemId từ request

        // 1. Tìm món ăn để lấy ID nhà hàng
        const foodItem = await foodModel.findById(itemId);
        if (!foodItem) {
            return res.json({ success: false, message: "Food item not found" });
        }
        const itemRestaurantId = foodItem.restaurantId.toString();

        // 2. Lấy dữ liệu user
        let userData = await userModel.findById(userId);
        let cartData = userData.cartData;

        // 3. Kiểm tra xem có giỏ hàng của nhà hàng này không
        if (cartData && cartData[itemRestaurantId]) {
            
            // 4. Kiểm tra món ăn có trong giỏ không
            if (cartData[itemRestaurantId][itemId] > 1) {
                
                // Giảm số lượng
                cartData[itemRestaurantId][itemId] -= 1;
            }
        }

        userData.markModified('cartData');
        await userData.save();

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
        
        let cartData = userData.cartData || {};
        res.json({ success: true, cartData })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const deleteItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.body;

        const foodItem = await foodModel.findById(itemId);
        if (!foodItem) return res.json({ success: false, message: "Not found" });
        const itemRestaurantId = foodItem.restaurantId.toString();

        let userData = await userModel.findById(userId);

        // Kiểm tra và xóa hẳn món ăn
        if (userData.cartData && userData.cartData[itemRestaurantId]) {
            if (userData.cartData[itemRestaurantId][itemId]) {
                
                // LỆNH QUAN TRỌNG: Xóa key món ăn khỏi object
                delete userData.cartData[itemRestaurantId][itemId]; 

                // Nếu nhà hàng không còn món nào, xóa luôn nhà hàng
                if (Object.keys(userData.cartData[itemRestaurantId]).length === 0) {
                    delete userData.cartData[itemRestaurantId];
                }

                userData.markModified('cartData');
                await userData.save();
            }
        }

        res.json({ success: true, message: "Item Deleted" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export { addToCart, removeFromCart, getCart, deleteItem }