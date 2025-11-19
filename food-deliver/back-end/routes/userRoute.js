import express from 'express';
import { loginUser, registerUser, removeUser, listUsers, updateUserStatus, registerRestaurant} from '../controllers/userController.js';
import checkAuth from '../middleware/checkAuth.js';
import checkRole from '../middleware/checkRole.js';
import multer from 'multer';

// Cấu hình multer để xử lý file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Thư mục lưu trữ file
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser); 

// Middleware chỉ cho phép admin truy cập
userRouter.post('/remove', checkAuth, checkRole(['admin']), removeUser); 
userRouter.get('/list', checkAuth, checkRole(['admin']), listUsers);
userRouter.post('/update-status', checkAuth, checkRole(['admin']), updateUserStatus);
userRouter.post("/register-restaurant",checkAuth, checkRole(['admin']), upload.single("image"), registerRestaurant);

export default userRouter;