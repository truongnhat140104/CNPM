import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    address: { type: Object, required: true },
    description: { type: String, required: true },
    
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Tham chiếu đến 'user' trong userModel
        required: true
    }
}, { timestamps: true });

const restaurantModel = mongoose.models.restaurant || mongoose.model("restaurant", restaurantSchema);
export default restaurantModel;