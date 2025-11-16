import express from 'express';
import resAuthMiddleware from '../middleware/resAuthMiddleware.js'; 
import { 
    getAllRestaurants, 
    getRestaurantById, 
    getFoodsByRestaurantId, 
    registerRestaurant,
    loginRestaurant,
    updateRestaurant,
    deleteRestaurant
} from '../controllers/resController.js';

const resRouter = express.Router();

resRouter.get('/', getAllRestaurants);
resRouter.get('/:id', getRestaurantById);
resRouter.get('/:id/foods', getFoodsByRestaurantId);

resRouter.post('/register', registerRestaurant);
resRouter.post('/login', loginRestaurant);

resRouter.put('/update', resAuthMiddleware, updateRestaurant); 
resRouter.delete('/delete', resAuthMiddleware, deleteRestaurant); 

export default resRouter;