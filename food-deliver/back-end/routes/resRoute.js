import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import checkRole from '../middleware/checkRole.js'; 
import { 
    getAllRestaurants, 
    getRestaurantById, 
    getFoodsByRestaurantId, 
    updateRestaurant,
    deleteRestaurant
} from '../controllers/resController.js';

const resRouter = express.Router();

resRouter.get('/', getAllRestaurants);
resRouter.get('/:id', getRestaurantById);
resRouter.get('/:id/foods', getFoodsByRestaurantId);

resRouter.put('/:id', checkAuth, checkRole(['restaurant']), updateRestaurant);
resRouter.delete('/:id', checkAuth, checkRole(['restaurant']), deleteRestaurant);

export default resRouter;