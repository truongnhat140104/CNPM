import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurant', // Tham chiếu đến restaurantModel
        required: true
    },
    // -------------------
    
    name: {type: String, require: true},
    image: {type: String, require: true},
    description: {type: String, require: true},
    category: {type: String, require: true},
    price: {type: Number, require: true},    
});

const foodModel = mongoose.models.food || mongoose.model('foods', foodSchema);

export default foodModel;