import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import {placeOrder, verifyOrder, userOrders, listOrders, updateStatus} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", checkAuth ,placeOrder);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/userorders", checkAuth ,userOrders); 
orderRouter.post('/list', checkAuth ,listOrders);
orderRouter.post("/status", checkAuth ,updateStatus); 

export default orderRouter;