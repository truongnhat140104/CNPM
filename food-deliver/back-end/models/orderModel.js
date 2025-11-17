// orderModel.js (Đã cập nhật)
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'restaurantProfile',required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    
    items: { type: Array, required:true},
    amount: { type: Number, required: true},
    address:{type:Object,required:true},
    status: {type:String,default:"Food Processing"},
    date: {type:Date,default:Date.now()},
    payment:{type:Boolean,default:false}
})

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;