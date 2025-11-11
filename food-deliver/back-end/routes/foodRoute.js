import express from 'express';
import { 
    addFood, 
    listFood, // Đây là API cho Chủ nhà hàng (Owner)
    removeFood, 
    updateFood, 
    getFoodById,
    listFoodByRestaurant // Đây là API cho Khách hàng (Customer)
} from '../controllers/foodController.js';
import authMiddleware from '../middleware/auth.js'; 
import multer from 'multer';

const foodRouter = express.Router();

//img storage engine (Phần này của bạn đã OK)
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb)=>{
        return cb(null, `${Date.now()}${file.originalname}`);
    }
})
const upload = multer({storage: storage});

// === CÁC ROUTE CỦA CHỦ NHÀ HÀNG (OWNER) ===
foodRouter.post('/add', authMiddleware, upload.single("image"), addFood);
foodRouter.post('/remove', authMiddleware, removeFood);
foodRouter.post('/update', authMiddleware, upload.single("image"), updateFood);
foodRouter.get('/list', authMiddleware, listFood); // Lấy danh sách món ăn CỦA CHỦ NHÀ HÀNG

// === CÁC ROUTE CÔNG KHAI (PUBLIC) CHO KHÁCH HÀNG ===
foodRouter.get("/get/:id", getFoodById); // Lấy chi tiết 1 món ăn
foodRouter.get("/list/restaurant/:restaurantId", listFoodByRestaurant); // Lấy menu của 1 nhà hàng

export default foodRouter;