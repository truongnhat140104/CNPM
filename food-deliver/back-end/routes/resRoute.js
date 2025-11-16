import express from 'express';
import {
    getAllRestaurants, 
    getRestaurantById, 
    getFoodsByRestaurantId,
    getMyRestaurantProfile,
    createRestaurantProfile,
    updateRestaurantProfile,
    deleteMyRestaurant 
} from '../controllers/resController.js';

import checkAuth from '../middleware/checkAuth.js';
import checkRole from '../middleware/checkRole.js';

import multer from 'multer';
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => cb(null, `${Date.now()}${file.originalname}`)
});
const upload = multer({ storage });

const resRouter = express.Router();

resRouter.get('/my-profile', 
    checkAuth, 
    checkRole(['restaurant']), 
    getMyRestaurantProfile
);

resRouter.post('/create-profile', 
    checkAuth, 
    checkRole(['restaurant']), 
    upload.single('image'), 
    createRestaurantProfile
);

resRouter.put('/update', 
    checkAuth, 
    checkRole(['restaurant']), 
    upload.single('image'), 
    updateRestaurantProfile
);

resRouter.delete('/delete',
    checkAuth,
    checkRole(['restaurant']),
    deleteMyRestaurant
);

resRouter.get('/', getAllRestaurants);
resRouter.get('/:id', getRestaurantById); 
resRouter.get('/:id/foods', getFoodsByRestaurantId); 

export default resRouter;