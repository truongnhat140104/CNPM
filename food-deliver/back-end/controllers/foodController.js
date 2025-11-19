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

// Restaurant xem danh sách món ăn của mình
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

// User xóa món ăn của mình trong menu
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

// Restaurant cập nhật món ăn của mình
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

// Lấy món ăn theo ID để cập nhật hoặc hiển thị
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

// Tìm kiếm theo nhà hàng
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

// Tìm kiếm theo menu (category)
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
        const foods = await foodModel.find({});
        
        const foodsWithData = await Promise.all(foods.map(async (food) => {
                        
            const profile = await restaurantModel.findById(food.restaurantId);
            
            return {
                ...food._doc, 
                restaurantName: profile ? profile.name : "Unknown Restaurant" 
            };
        }));

        res.json({ success: true, data: foodsWithData });

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