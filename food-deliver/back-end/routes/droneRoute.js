import express from "express";
import { registerDrone, getDrones, updateDroneStatus, removeDrone } from "../controllers/droneController.js";
import checkAuth from "../middleware/checkAuth.js"; // Middleware xác thực Admin
import checkRole from "../middleware/checkRole.js";

const droneRouter = express.Router();

// Chỉ Admin mới được quyền quản lý Drone
droneRouter.post("/add", checkAuth, checkRole(['admin']), registerDrone);
droneRouter.get("/list", checkAuth, checkRole(['admin']), getDrones);
droneRouter.post("/update", checkAuth, checkRole(['admin']), updateDroneStatus);
droneRouter.post("/remove", checkAuth, checkRole(['admin']), removeDrone);

export default droneRouter;