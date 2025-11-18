import express from "express"
import { addToCart, removeFromCart, getCart } from "../controllers/cartController.js"
import checkAuth from "../middleware/checkAuth.js";
import checkRole from "../middleware/checkRole.js";

const cartRouter = express.Router();

cartRouter.post("/get",checkAuth, checkRole(['user']), getCart);
cartRouter.post("/add",checkAuth, checkRole(['user']), addToCart);
cartRouter.post("/remove",checkAuth, checkRole(['user']), removeFromCart);

export default cartRouter;