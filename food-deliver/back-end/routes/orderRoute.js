import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import {placeOrder, verifyOrder, userOrders, listOrders, updateStatus, listRestaurantOrders} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", checkAuth ,placeOrder);
orderRouter.post("/verify",verifyOrder);

// Lấy đơn hàng của user
orderRouter.post("/userorders", checkAuth ,userOrders); 

// Admin lấy tất cả đơn hàng
orderRouter.post('/list', checkAuth ,listOrders);

orderRouter.post("/status", checkAuth ,updateStatus); 

// Nhà hàng lấy đơn hàng của mình
orderRouter.post("/restaurantorders", checkAuth ,listRestaurantOrders);

export default orderRouter;