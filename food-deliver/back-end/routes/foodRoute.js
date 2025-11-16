import express from 'express';
import {
    addFood,
    listFood,
    removeFood,
    updateFood,
    getFoodById,
    listFoodByRestaurant
} from '../controllers/foodController.js';
import checkAuth from '../middleware/checkAuth.js';
import multer from 'multer';
import checkRole from '../middleware/checkRole.js';

const foodRouter = express.Router();
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => cb(null, `${Date.now()}${file.originalname}`)
});
const upload = multer({ storage });

// Chỉ cho phép nhà hàng (restaurant) thêm, xóa, cập nhật, xem danh sách món ăn
foodRouter.post('/add', checkAuth, checkRole(['restaurant']), upload.single("image"), addFood);
foodRouter.post('/remove', checkAuth, checkRole(['restaurant']), removeFood);
foodRouter.post('/update', checkAuth, checkRole(['restaurant']), upload.single("image"), updateFood);
foodRouter.get('/list', checkAuth, checkRole(['restaurant']), listFood);

// Cho phép tất cả người dùng đã xác thực xem món ăn theo ID và danh sách món ăn của nhà hàng
foodRouter.get("/get/:id", getFoodById);
foodRouter.get("/list/restaurant/:restaurantId", listFoodByRestaurant);

export default foodRouter;