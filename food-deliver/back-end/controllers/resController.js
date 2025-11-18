import resModel from "../models/restaurantProfile.js";
import foodModel from "../models/foodModel.js";

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
        const foods = await foodModel.find({ restaurantId: id }); 
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching foods" });
    }
};

const getMyRestaurantProfile = async (req, res) => {
    try {
        const profile = await resModel.findOne({ restaurant: req.user.id });

        if (!profile) {
            return res.json({ success: false, message: "Profile not found. Please create one.", data: null });
        }
        res.json({ success: true, data: profile });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Server Error" });
    }
};

const createRestaurantProfile = async (req, res) => {
    const userId = req.user.id; 

    try {
        const existingProfile = await resModel.findOne({ restaurant: userId });
        if (existingProfile) {
            return res.json({ success: false, message: "You already have a restaurant profile." });
        }

        const newProfile = new resModel({
            ...req.body,
            restaurant: userId, 
            image: req.file ? req.file.filename : ""
        });

        await newProfile.save();
        res.json({ success: true, message: "Restaurant profile created", data: newProfile });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error creating restaurant profile" });
    }
};

const updateRestaurantProfile = async (req, res) => {
    const userId = req.user.id; 

    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = req.file.filename;
        }

        const updatedProfile = await resModel.findOneAndUpdate(
            { restaurant: userId }, 
            updateData, 
            { new: true }
        );

        if (!updatedProfile) {
            return res.json({ success: false, message: "Restaurant profile not found" });
        }

        res.json({ success: true, message: "Profile updated", data: updatedProfile });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating restaurant profile" });
    }
};

const deleteMyRestaurant = async (req, res) => {
    const userId = req.user.id; 

    try {
        const profile = await resModel.findOneAndDelete({ restaurant: userId }); 
        
        if (!profile) {
            return res.json({ success: false, message: "Restaurant profile not found" });
        }
        await foodModel.deleteMany({ restaurantId: profile._id });

        res.json({ success: true, message: "Restaurant profile and all associated foods deleted" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error deleting restaurant" });
    }
};


export { 
    getAllRestaurants, 
    getRestaurantById, 
    getFoodsByRestaurantId, 
    getMyRestaurantProfile,
    createRestaurantProfile,
    updateRestaurantProfile,
    deleteMyRestaurant
};