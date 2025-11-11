import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";

const addToCart = async (req,res) =>{
    try { 
        const foodItem = await foodModel.findById(req.body.itemId);
        if (!foodItem) {
            return res.json({success:false, message: "Food item not found"});
        }
        const itemRestaurantId = foodItem.restaurant_id.toString(); // ID nhà hàng của món ăn

        // 2. Lấy giỏ hàng hiện tại của user
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData;
        
        // 3. Lấy ID nhà hàng hiện tại trong giỏ
        const currentRestaurantId = cartData.restaurantId ? cartData.restaurantId.toString() : null;

        // 4. KIỂM TRA QUAN TRỌNG:
        // Case A: Giỏ hàng trống
        if (currentRestaurantId === null) {
            cartData.restaurantId = itemRestaurantId; // Gán nhà hàng mới cho giỏ
            cartData.items[req.body.itemId] = 1;
        }
        // Case B: Món ăn cùng nhà hàng với giỏ hàng
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
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({success:true, message:"Added to Cart"});

    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}

// remove item from user cart
const removeFromCart = async (req,res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData;

        // Chỉ thao tác trên 'items'
        if (cartData.items[req.body.itemId] > 0) {
            cartData.items[req.body.itemId] -= 1;
            
            // Nếu giảm về 0, xóa hẳn key đó khỏi object
            if (cartData.items[req.body.itemId] === 0) {
                delete cartData.items[req.body.itemId];
            }
        }

        // Nếu 'items' rỗng, reset luôn restaurantId
        if (Object.keys(cartData.items).length === 0) {
            cartData.restaurantId = null;
        }

        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({success:true, message:"Removed from Cart"});

    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}

// fetch user cart data 
const getCart = async (req,res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        res.json({success:true, cartData}) // Trả về { restaurantId: "...", items: {...} }
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

export {addToCart,removeFromCart,getCart}