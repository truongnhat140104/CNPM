import foodModel from "../models/foodModel.js";
import restaurantModel from "../models/restaurantProfile.js";
import fs from 'fs';
import path from 'path';

const addFood = async (req, res) => {
    const userId = req.user.id;

    try {
        const restaurantProfile = await restaurantModel.findOne({ restaurant: userId });

        if (!restaurantProfile) {
            return res.json({ success: false, message: "Restaurant profile not found for this user." });
        }

        const restaurantId = restaurantProfile._id;

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: req.file.filename,
            restaurantId: restaurantId
        });

        await food.save();
        res.json({ success: true, message: "Food item added" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

const listFood = async (req, res) => {
    try {
        const restaurantProfile = await restaurantModel.findOne({ restaurant: req.user.id });
        if (!restaurantProfile) {
            return res.json({ success: false, message: "Restaurant profile not found" });
        }

        const foods = await foodModel.find({ restaurantId: restaurantProfile._id });
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

const removeFood = async (req, res) => {
    try {
        const restaurantProfile = await restaurantModel.findOne({ restaurant: req.user.id });
        if (!restaurantProfile) {
            return res.json({ success: false, message: "Restaurant profile not found" });
        }

        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.json({ success: false, message: "Food item not found" });
        }

        if (food.restaurantId.toString() !== restaurantProfile._id.toString()) {
            return res.json({ success: false, message: "Authorization Failed: This is not your food." });
        }

        fs.unlink(path.join('uploads', food.image), () => {});

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food item removed" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

const updateFood = async (req, res) => {
    try {
        const restaurantProfile = await restaurantModel.findOne({ restaurant: req.user.id });
        if (!restaurantProfile) {
            return res.json({ success: false, message: "Restaurant profile not found" });
        }

        const foodId = req.body.id;

        const food = await foodModel.findById(foodId);
        if (!food) {
            return res.json({ success: false, message: "Food item not found" });
        }

        if (food.restaurantId.toString() !== restaurantProfile._id.toString()) {
            return res.json({ success: false, message: "Authorization Failed: This is not your food." });
        }

        const updateData = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
        };

        if (req.file) {
            fs.unlink(path.join('uploads', food.image), () => {});
            updateData.image = req.file.filename;
        }

        await foodModel.findByIdAndUpdate(foodId, updateData);
        res.json({ success: true, message: "Food item updated" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

const getFoodById = async (req, res) => {
    try {
        const food = await foodModel.findById(req.params.id);

        if (food) {
            res.json({ success: true, data: food });
        } else {
            res.json({ success: false, message: "Food not found" });
        }
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Something went wrong" });
    }
}

const listFoodByRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;

        const foods = await foodModel.find({ restaurantId: restaurantId });
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Something went wrong" });
    }
}

const listFoodByMenu = async (req, res) => {
    try {
        const menuName = req.params.menuName;

        const foods = await foodModel.find({ category: menuName });
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Something went wrong" });
    }
}

const listAllFoodPublic = async (req, res) => {
    try {
        // Tìm tất cả món ăn
        const foods = await foodModel.find({}); 
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Server Error" });
    }
}

export {
    addFood,
    listFood,
    removeFood,
    updateFood,
    getFoodById,
    listFoodByRestaurant,
    listFoodByMenu,
    listAllFoodPublic
};