import mongoose from "mongoose";

const restaurantProfileSchema = new mongoose.Schema({
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        required: true 
    },
    
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String },
    image: { type: String },
    description: { type: String },
        
}, { timestamps: true });

const restaurantProfileModel = mongoose.models.restaurantProfile || mongoose.model("restaurantProfile", restaurantProfileSchema);
export default restaurantProfileModel;