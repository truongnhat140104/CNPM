import foodModel from "../models/foodModel.js";
import resModel from "../models/resModel.js";

// get all restaurants
export const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await resModel.find({});
        res.json({ success: true, data: restaurants });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching restaurants" });
    }
};

// get restaurant by id
export const getRestaurantById = async (req, res) => {
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

// get foods by restaurant id
export const getFoodsByRestaurantId = async (req, res) => {
    const { id } = req.params;
    try {
        const foods = await foodModel.find({ restaurantId: id });
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching foods" });
    }
};

// create new restaurant
export const createRestaurant = async (req, res) => {
    const { name, address, phone } = req.body;
    try {
        const newRestaurant = new resModel({ name, address, phone });
        await newRestaurant.save();
        res.json({ success: true, message: "Restaurant created successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error creating restaurant" });
    }
};

// update restaurant
export const updateRestaurant = async (req, res) => {
    const { id } = req.params;
    const { name, address, phone } = req.body;
    try {
        const restaurant = await resModel.findById(id);
        if (!restaurant) {
            return res.json({ success: false, message: "Restaurant not found" });
        }
        restaurant.name = name || restaurant.name;
        restaurant.address = address || restaurant.address;
        restaurant.phone = phone || restaurant.phone;
        await restaurant.save();
        res.json({ success: true, message: "Restaurant updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating restaurant" });
    }
};

// delete restaurant
export const deleteRestaurant = async (req, res) => {
    const { id } = req.params;
    try {
        const restaurant = await resModel.findByIdAndDelete(id);
        if (!restaurant) {
            return res.json({ success: false, message: "Restaurant not found" });
        }
        res.json({ success: true, message: "Restaurant deleted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error deleting restaurant" });
    }
};
export {getAllRestaurants,getRestaurantById,getFoodsByRestaurantId,createRestaurant,updateRestaurant,deleteRestaurant}