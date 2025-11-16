import resModel from "../models/resModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

const createRestaurantToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

const registerRestaurant = async (req, res) => {
    const { name, address, phone, email, password, description, image } = req.body;
    try {
        const exists = await resModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Restaurant with this email already exists" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newRestaurant = new resModel({
            name,
            address,
            phone,
            email,
            password: hashedPassword,
            description,
            image
        });

        const restaurant = await newRestaurant.save();
        const token = createRestaurantToken(restaurant._id);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Server error" });
    }
};

// 2. Đăng nhập cho nhà hàng (MỚI)
const loginRestaurant = async (req, res) => {
    const { email, password } = req.body;
    try {
        const restaurant = await resModel.findOne({ email });
        if (!restaurant) {
            return res.json({ success: false, message: "Restaurant email does not exist" });
        }

        const isMatch = await bcrypt.compare(password, restaurant.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Incorrect password" });
        }

        const token = createRestaurantToken(restaurant._id);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Server error" });
    }
};

const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await resModel.find({});
        res.json({ success: true, data: restaurants });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching restaurants" });
    }
};

const getRestaurantById = async (req, res) => {
    const { id } = req.params;
    try {
        const restaurant = await resModel.findById(id);
        if (!restaurant) {
            return res.json({ success: false, message: "Restaurant not found" });
        }
        res.json({ success: true, data: restaurant });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching restaurant" });
    }
};

const getFoodsByRestaurantId = async (req, res) => {
    const { id } = req.params;
    try {
        const foods = await foodModel.find({ restaurant_id: id });
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching foods" });
    }
};

const createRestaurant = async (req, res) => {
    const userId = req.body.userId;
    const { name, address, phone, image, description } = req.body;

    try {
        const existingRestaurant = await resModel.findOne({ owner: userId });
        if (existingRestaurant) {
            return res.json({ success: false, message: "You already own a restaurant." });
        }

        const newRestaurant = new resModel({
            name,
            address,
            phone,
            // image: image || "",
            description: description || "",
            owner: userId
        });
        await newRestaurant.save();
        
        res.json({ success: true, message: "Restaurant created successfully", data: newRestaurant });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error creating restaurant" });
    }
};

const updateRestaurant = async (req, res) => {
    const restaurantId = req.params.id;
    const ownerId = req.body.userId;
    const updateData = req.body;

    try {
        const restaurant = await resModel.findById(restaurantId);
        if (!restaurant) {
            return res.json({ success: false, message: "Restaurant not found" });
        }

        if (restaurant.owner.toString() !== ownerId) {
            return res.json({ success: false, message: "Authorization Failed: This is not your restaurant." });
        }
        
        delete updateData.owner;
        delete updateData.userId;

        const updatedRestaurant = await resModel.findByIdAndUpdate(restaurantId, updateData, { new: true });
        res.json({ success: true, message: "Restaurant updated successfully", data: updatedRestaurant });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating restaurant" });
    }
};

const deleteRestaurant = async (req, res) => {
    const restaurantId = req.params.id;

    try {
        const restaurant = await resModel.findById(restaurantId);
        if (!restaurant) {
            return res.json({ success: false, message: "Restaurant not found" });
        }

        await resModel.findByIdAndDelete(restaurantId);
        await foodModel.deleteMany({ restaurant_id: restaurantId });

        res.json({ success: true, message: "Restaurant deleted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error deleting restaurant" });
    }
};

export { registerRestaurant, loginRestaurant, getAllRestaurants, getRestaurantById, getFoodsByRestaurantId, createRestaurant, updateRestaurant, deleteRestaurant };