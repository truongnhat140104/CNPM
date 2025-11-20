import foodModel from "../models/foodModel.js";
import restaurantModel from "../models/restaurantProfile.js";
import fs from 'fs';
import path from 'path';

const addFood = async (req, res) => {
    const userId = req.user.id;

    try {
        const restaurantProfile = await restaurantModel.findOne({ restaurant: userId });

        if (!restaurantProfile) {
            return res.json({ success: false, message: "Please create a restaurant profile before adding food." });
        }

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: req.file.filename,
            restaurantId: restaurantProfile._id // Lưu ID của Profile
        });

        await food.save();
        res.json({ success: true, message: "Food item added" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding food" });
    }
}

// 2. Restaurant xem danh sách món của mình
const listFood = async (req, res) => {
    try {
        const restaurantProfile = await restaurantModel.findOne({ restaurant: req.user.id });
        if (!restaurantProfile) {
            return res.json({ success: false, message: "Profile not found" });
        }

        const foods = await foodModel.find({ restaurantId: restaurantProfile._id });
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error listing food" });
    }
}

// 3. Xóa món ăn
const removeFood = async (req, res) => {
    try {
        const restaurantProfile = await restaurantModel.findOne({ restaurant: req.user.id });
        if (!restaurantProfile) {
            return res.json({ success: false, message: "Profile not found" });
        }

        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.json({ success: false, message: "Food not found" });
        }

        // Kiểm tra quyền sở hữu
        if (food.restaurantId.toString() !== restaurantProfile._id.toString()) {
            return res.json({ success: false, message: "Unauthorized action" });
        }

        // Xóa ảnh và xóa data
        fs.unlink(path.join('uploads', food.image), () => {});
        await foodModel.findByIdAndDelete(req.body.id);
        
        res.json({ success: true, message: "Food removed" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing food" });
    }
}

// 4. Cập nhật món ăn
const updateFood = async (req, res) => {
    try {
        const restaurantProfile = await restaurantModel.findOne({ restaurant: req.user.id });
        if (!restaurantProfile) return res.json({ success: false, message: "Profile not found" });

        const foodId = req.body.id;
        const food = await foodModel.findById(foodId);
        if (!food) return res.json({ success: false, message: "Food not found" });

        if (food.restaurantId.toString() !== restaurantProfile._id.toString()) {
            return res.json({ success: false, message: "Unauthorized action" });
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
        res.json({ success: true, message: "Food updated" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating food" });
    }
}

// 5. Lấy món theo ID
const getFoodById = async (req, res) => {
    try {
        const food = await foodModel.findById(req.params.id).populate('restaurantId', 'name address');
        if (food) {
            res.json({ success: true, data: food });
        } else {
            res.json({ success: false, message: "Food not found" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// 6. Lấy danh sách theo Nhà hàng (Public)
const listFoodByRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;
        const foods = await foodModel.find({ restaurantId: restaurantId });
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// 7. Lấy danh sách theo Menu/Category (Public) - CÓ POPULATE
const listFoodByMenu = async (req, res) => {
    try {
        const menuName = req.params.menuName;

        const foods = await foodModel.find({ category: menuName }).populate('restaurantId', 'name');
        
        const formattedFoods = foods.map(food => ({
            ...food._doc,
            restaurantName: food.restaurantId ? food.restaurantId.name : "Unknown",
            restaurantId: food.restaurantId ? food.restaurantId._id : null 
        }));

        res.json({ success: true, data: formattedFoods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

const listAllFoodPublic = async (req, res) => {
    try {

        const foods = await foodModel.find({}).populate('restaurantId', 'name address'); 

        const foodsWithData = foods.map(food => {
            const profile = food.restaurantId;
            return {
                ...food._doc,
                restaurantName: profile ? profile.name : "Unknown Restaurant",
                restaurantAddress: profile ? profile.address : "",
                restaurantId: profile ? profile._id : null 
            };
        });

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