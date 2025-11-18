import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const placeOrder = async (req,res) => {
    const frontend_url = "http://localhost:5173";
    const userId = req.user.id;
    const { address: frontendAddress, restaurantId } = req.body;

    try {
        if (!restaurantId){
            return res.json({success:false,message:"Restaurant ID is required."})
        }

        const userData = await userModel.findById(userId);
        const cartData = userData.cartData;
        const currentRestaurantCart = cartData[restaurantId];

        if (!currentRestaurantCart || Object.keys(currentRestaurantCart).length === 0){
            return res.json({success:false,message:"No items in cart for this restaurant."})
        }

        let totalAmount = 0;
        let lineItemsStripe = [];
        let orderItems = [];

        await Promise.all(Object.keys(currentRestaurantCart).map(async (itemId) => {
            const foodItem = await foodModel.findById(itemId);
            const quantity = currentRestaurantCart[itemId];

            if (foodItem) {
                const itemTotal = foodItem.price * quantity;
                totalAmount += itemTotal;
                
                orderItems.push({
                    name: foodItem.name,
                    price: foodItem.price,
                    quantity: quantity,
                    image: foodItem.image,
                    foodId: itemId
                });

                lineItemsStripe.push({
                    price_data:{
                        currency:"usd", 
                        product_data:{ name: foodItem.name },
                        unit_amount: foodItem.price 
                    },
                    quantity: quantity
                });
            }
        }));

        const deliveryFee = 2;
        totalAmount += deliveryFee;
        lineItemsStripe.push({
            price_data:{
                currency:"usd",
                product_data:{ name:"Delivery Charges" },
                unit_amount: deliveryFee * 100
            },
            quantity:1
        });
        
        const newOrder = new orderModel({
            userId: userId,           
            restaurantId: restaurantId,
            items: orderItems,
            amount: totalAmount,
            address: frontendAddress
        });
        
        await newOrder.save();

        const session = await stripe.checkout.sessions.create({
            line_items: lineItemsStripe,
            mode:'payment',
            success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })

        res.json({success:true, session_url:session.url})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error placing order."})
    }
}

// Hàm verifyOrder
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            
            // Lấy thông tin đơn hàng để biết nhà hàng nào và user nào
            const order = await orderModel.findById(orderId);
            if (order) {
                const userData = await userModel.findById(order.userId);
                
                // Chỉ xóa đúng cái "rổ" của nhà hàng đã thanh toán
                if (userData.cartData && userData.cartData[order.restaurantId]) {
                    delete userData.cartData[order.restaurantId];
                    
                    // Báo Mongoose lưu thay đổi Object
                    userData.markModified('cartData');
                    await userData.save();
                }
            }
            res.json({ success: true, message: "Paid" })
        }
        else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false, message: "Not Paid" })
        }
    } 
    catch (error) {
            console.log(error);
            res.json({ success: false, message: "Not Verified" })
        }
}

// Hàm userOrders
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({userId: req.user.id });
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching user orders"})
    }
}

// Hàm listOrders
const listOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error listing orders"})
    }
}

// Hàm updateStatus
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        res.json({ success: false, message: "Error updating status" })
    }
}

export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}