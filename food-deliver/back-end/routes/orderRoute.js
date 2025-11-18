import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import {placeOrder, verifyOrder, userOrders, listOrders, updateStatus} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", checkAuth ,placeOrder);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/userorders", checkAuth ,userOrders); 
orderRouter.get('/list',listOrders);
orderRouter.post("/status",updateStatus); 

export default orderRouter;