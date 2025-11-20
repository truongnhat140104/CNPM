import express from "express";
import { registerDrone, getDrones, updateDroneStatus, removeDrone, dispatchDrone, updateDeliveryStep, chargeDrone } from "../controllers/droneController.js";
import checkAuth from "../middleware/checkAuth.js"; // Middleware xác thực Admin
import checkRole from "../middleware/checkRole.js";

const droneRouter = express.Router();

// Chỉ Admin mới được quyền quản lý Drone
droneRouter.post("/add", checkAuth, checkRole(['admin']), registerDrone);
droneRouter.get("/list", checkAuth, checkRole(['admin']), getDrones);
droneRouter.post("/update", checkAuth, checkRole(['admin']), updateDroneStatus);
droneRouter.post("/remove", checkAuth, checkRole(['admin']), removeDrone);
droneRouter.post("/dispatch", checkAuth, checkRole(['admin']), dispatchDrone);
droneRouter.post("/next-step", checkAuth, checkRole(['admin']), updateDeliveryStep);
droneRouter.post("/charge", checkAuth, checkRole(['admin']), chargeDrone);

export default droneRouter;