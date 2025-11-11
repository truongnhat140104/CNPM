import express from 'express';
import { loginUser, registerUser, removeUser, listUsers, updateUserStatus} from '../controllers/userController.js';
import adminMiddleware from '../Middleware/adminMiddleware.js';

const userRouter = express.Router();

// --- Các route CÔNG KHAI (Public) ---
userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser); 

// --- Các route CỦA ADMIN (Yêu cầu quyền Admin) ---
userRouter.post('/remove', adminMiddleware, removeUser); 
userRouter.get('/list', adminMiddleware, listUsers);
userRouter.post('/update-status', adminMiddleware, updateUserStatus);

// userRouter.post('/create-owner', adminMiddleware, createOwnerFunction);

export default userRouter;