import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";

const addToCart = async (req,res) =>{
    try { 
        // 1. Lấy ID người dùng từ req.user (do checkAuth đính vào)
        const userId = req.user.id; 

        const foodItem = await foodModel.findById(req.body.itemId);
        if (!foodItem) {
            return res.json({success:false, message: "Food item not found"});
        }
        
        // SỬA LỖI 2: Dùng 'restaurantId' (camelCase)
        const itemRestaurantId = foodItem.restaurantId.toString(); 

        // 2. Lấy giỏ hàng hiện tại của user
        let userData = await userModel.findById(userId); // SỬA LỖI 1
        let cartData = userData.cartData;
        
        // 3. Lấy ID nhà hàng hiện tại trong giỏ
        const currentRestaurantId = cartData.restaurantId ? cartData.restaurantId.toString() : null;

        // 4. KIỂM TRA QUAN TRỌNG:
        // Case A: Giỏ hàng trống
        if (currentRestaurantId === null) {
            cartData.restaurantId = itemRestaurantId;
            cartData.items[req.body.itemId] = 1;
        }
        // Case B: Món ăn cùng nhà hàng
        else if (currentRestaurantId === itemRestaurantId) {
            if (!cartData.items[req.body.itemId]) {
                cartData.items[req.body.itemId] = 1;
            } else {
                cartData.items[req.body.itemId] += 1;
            }
        }
        // Case C: Món ăn KHÁC nhà hàng
        else {
            return res.json({
                success: false, 
                message: "Cannot add items from different restaurants. Please clear your cart first."
            });
        }

        // 5. Cập nhật lại giỏ hàng
        await userModel.findByIdAndUpdate(userId, { cartData }); // SỬA LỖI 1
        res.json({success:true, message:"Added to Cart"});

    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}

// remove item from user cart
const removeFromCart = async (req,res) => {
    try {
        const userId = req.user.id; // SỬA LỖI 1
        let userData = await userModel.findById(userId); // SỬA LỖI 1
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

        await userModel.findByIdAndUpdate(userId, { cartData }); // SỬA LỖI 1
        res.json({success:true, message:"Removed from Cart"});

    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}

// fetch user cart data 
const getCart = async (req,res) => {
    try {
        const userId = req.user.id; // SỬA LỖI 1
        let userData = await userModel.findById(userId); // SỬA LỖI 1

        // Thêm kiểm tra null (sửa lỗi 401)
        if (!userData) {
            return res.json({success: false, message: "User not found"});
        }

        let cartData = userData.cartData;
        res.json({success:true, cartData})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

export {addToCart,removeFromCart,getCart}