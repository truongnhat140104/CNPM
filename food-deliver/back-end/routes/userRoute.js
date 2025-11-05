import express from 'express';
import { loginUser, registerUser, removeUser, listUsers, updateUserStatus} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);
userRouter.post('/remove', removeUser); 
userRouter.get('/list', listUsers);
userRouter.post('/update-status', updateUserStatus);

export default userRouter