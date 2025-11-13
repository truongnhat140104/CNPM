// foodController.js (Đã sửa cho logic nhiều nhà hàng)
import foodModel from "../models/foodModel.js";
import restaurantModel from "../models/restaurantModel.js";
import userModel from "../models/userModel.js";
import fs from 'fs';
import path from 'path';

// Lấy nhà hàng của chủ sở hữu ---
const getRestaurantByOwner = async (ownerId) => {
    const user = await userModel.findById(ownerId);
    if (user.role !== 'owner') {
        throw new Error("User is not an owner");
    }
    const restaurant = await restaurantModel.findOne({ owner: ownerId });
    if (!restaurant) {
        throw new Error("Restaurant not found for this owner");
    }
    return restaurant;
}

// add food item (Chỉ chủ nhà hàng mới được thêm)
const addFood = async(req,res)=>{
    try{
        // 1. Tìm nhà hàng của người đang đăng nhập
        const restaurant = await getRestaurantByOwner(req.body.userId);

        // 2. Tạo món ăn với restaurant_id
        const image_filename = req.file.filename;
        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            image: image_filename,
            restaurant_id: restaurant._id
        });
    
        await food.save();
        res.json({success:true, message: "Food item added"});

    } catch(error){
        console.log(error.message);
        res.json({success:false, message: error.message});
    }
}

const listFood = async(req,res)=>{
    try{
        // 1. Tìm nhà hàng của người đang đăng nhập
        const restaurant = await getRestaurantByOwner(req.body.userId);

        // 2. Chỉ tìm món ăn thuộc nhà hàng đó
        const foods = await foodModel.find({ restaurant_id: restaurant._id });
        res.json({success:true, data: foods});
    } catch(error){
        console.log(error.message);
        res.json({success:false, message: error.message});
    }
}

const removeFood = async(req,res)=>{
    try{
        // 1. Tìm nhà hàng của người đang đăng nhập
        const restaurant = await getRestaurantByOwner(req.body.userId);

        // 2. Tìm món ăn cần xóa
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.json({success:false, message: "Food item not found"});
        }

        // 3. KIỂM TRA QUYỀN SỞ HỮU (Quan trọng nhất)
        if (food.restaurant_id.toString() !== restaurant._id.toString()) {
            return res.json({success:false, message: "Authorization Failed: This is not your food."});
        }

        // 4. Xóa file ảnh (Sửa lại đường dẫn và lỗi backtick)
        fs.unlink(path.join('uploads', food.image), ()=>{});

        // 5. Xóa khỏi DB
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message: "Food item removed"});

    } catch(error){
        console.log(error.message);
        res.json({success:false, message: error.message});
    }
}

const updateFood = async(req,res)=>{
    try{
        // 1. Tìm nhà hàng của người đang đăng nhập
        const restaurant = await getRestaurantByOwner(req.body.userId);
        const foodId = req.body.id;

        // 2. Tìm món ăn cần sửa
        const food = await foodModel.findById(foodId);
        if (!food) {
            return res.json({success:false, message: "Food item not found"});
        }
        
        // 3. KIỂM TRA QUYỀN SỞ HỮU (Quan trọng nhất)
        if (food.restaurant_id.toString() !== restaurant._id.toString()) {
            return res.json({success:false, message: "Authorization Failed: This is not your food."});
        }

        // 4. Chuẩn bị dữ liệu cập nhật
        const updateData = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
        };

        // 5. Nếu có ảnh mới, xóa ảnh cũ và thêm ảnh mới
        if (req.file) {
            // Xóa file cũ
            fs.unlink(path.join('uploads', food.image), () => {});
            // Thêm file mới
            updateData.image = req.file.filename;
        }

        // 6. Cập nhật DB
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

// list food (Cho khách hàng xem menu của 1 nhà hàng cụ thể)
const listFoodByRestaurant = async (req, res) => {
    try {
        // Lấy restaurantId từ URL, ví dụ: /api/food/list/restaurant/60b8...
        const restaurantId = req.params.restaurantId; 
        const foods = await foodModel.find({ restaurant_id: restaurantId });
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Something went wrong" });
    }
}


export {
    addFood, 
    listFood, // Dùng cho chủ nhà hàng (yêu cầu auth)
    removeFood, 
    updateFood, 
    getFoodById, // Dùng cho khách hàng (công khai)
    listFoodByRestaurant // Dùng cho khách hàng (công khai)
};