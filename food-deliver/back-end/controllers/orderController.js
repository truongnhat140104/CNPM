// controllers/orderController.js
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js"; // Cần để lấy giá
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const placeOrder = async (req,res) => {
    const frontend_url = "http://localhost:5173";
    const userId = req.user.id;
    const frontendAddress = req.body.address; 

    try {
        const userData = await userModel.findById(userId);
        const cartData = userData.cartData;
        const restaurantId = cartData.restaurantId;

        if (!restaurantId || Object.keys(cartData.items).length === 0) {
            return res.json({ success: false, message: "Cart is empty." });
        }

        let totalAmount = 0;
        let lineItemsStripe = [];
        let orderItems = [];

        await Promise.all(Object.keys(cartData.items).map(async (itemId) => {
            const foodItem = await foodModel.findById(itemId);
            if (foodItem) {
                const itemTotal = foodItem.price * cartData.items[itemId];
                totalAmount += itemTotal;
                
                orderItems.push({
                    name: foodItem.name,
                    price: foodItem.price,
                    quantity: cartData.items[itemId],
                    image: foodItem.image,
                    foodId: itemId
                });

                lineItemsStripe.push({
                    price_data:{
                        currency:"usd", 
                        product_data:{ name: foodItem.name },
                        unit_amount: foodItem.price 
                    },
                    quantity: cartData.items[itemId]
                });
            }
        }));

        const deliveryFee = 5000;
        totalAmount += deliveryFee;
        lineItemsStripe.push({
            price_data:{
                currency:"usd",
                product_data:{ name:"Delivery Charges" },
                unit_amount: deliveryFee
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
            const order = await orderModel.findById(orderId);
            if (order) {
                await userModel.findByIdAndUpdate(order.userId, { 
                    cartData: { items: {}, restaurantId: null } 
                });
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
        const orders = await orderModel.find({userId: req.user.id }); // Dùng req.user.id
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching user orders"})
    }
}

// Hàm listOrders (admin)
const listOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error listing orders"})
    }
}

// Hàm updateStatus (admin)
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        res.json({ success: false, message: "Error updating status" })
    }
}

export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}