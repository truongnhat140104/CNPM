import { } from '../controllers/resController.js';
import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { 
    getAllRestaurants, 
    getRestaurantById, 
    getFoodsByRestaurantId, 
    createRestaurant, 
    updateRestaurant,
    deleteRestaurant
} from '../controllers/resController.js';

const resRouter = express.Router();

resRouter.get('/', getAllRestaurants);
resRouter.get('/:id', getRestaurantById);
resRouter.get('/:id/foods', getFoodsByRestaurantId);
resRouter.post('/create', authMiddleware, createRestaurant); // Bảo vệ route này
resRouter.put('/update/:id', authMiddleware, updateRestaurant); // Bảo vệ route này
resRouter.delete('/delete/:id', authMiddleware, deleteRestaurant); // Bảo vệ route này

export default resRouter;