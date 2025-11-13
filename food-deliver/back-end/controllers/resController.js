import foodModel from "../models/foodModel.js";
import resModel from "../models/resModel.js";
import userModel from "../models/userModel.js";

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
    const ownerId = req.body.userId;
    const { name, address, phone, image, description } = req.body;

    try {
        const user = await userModel.findById(ownerId);
        if (!user || user.role !== 'owner') {
            return res.json({ success: false, message: "Authorization Failed: Only owners can create." });
        }

        const existingRestaurant = await resModel.findOne({ owner: ownerId });
        if (existingRestaurant) {
            return res.json({ success: false, message: "You already own a restaurant." });
        }

        const newRestaurant = new resModel({
            name,
            address,
            phone,
            image: image || "",
            description: description || "",
            owner: ownerId
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
    const ownerId = req.body.userId;

    try {
        const restaurant = await resModel.findById(restaurantId);
        if (!restaurant) {
            return res.json({ success: false, message: "Restaurant not found" });
        }

        if (restaurant.owner.toString() !== ownerId) {
            return res.json({ success: false, message: "Authorization Failed: This is not your restaurant." });
        }

        await resModel.findByIdAndDelete(restaurantId);
        await foodModel.deleteMany({ restaurant_id: restaurantId });

        res.json({ success: true, message: "Restaurant deleted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error deleting restaurant" });
    }
};

export { getAllRestaurants, getRestaurantById, getFoodsByRestaurantId, createRestaurant, updateRestaurant, deleteRestaurant };