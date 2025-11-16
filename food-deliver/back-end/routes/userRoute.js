import express from 'express';
import { loginUser, registerUser, removeUser, listUsers, updateUserStatus} from '../controllers/userController.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser); 

userRouter.post('/remove', adminMiddleware, removeUser); 
userRouter.get('/list', adminMiddleware, listUsers);
userRouter.post('/update-status', adminMiddleware, updateUserStatus);

// userRouter.post('/create-owner', adminMiddleware, createOwnerFunction);

export default userRouter;