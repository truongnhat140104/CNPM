import mongoose from "mongoose";

const droneSchema = new mongoose.Schema({
    serialNumber: { type: String, required: true, unique: true },
    
    status: { 
        type: String, 
        enum: ['Idle', 'Moving to Restaurant', 'Delivering', 'Returning', 'Charging', 'Maintenance'], 
        default: 'Idle' 
    },
    
    battery: { type: Number, default: 100 },
    
    currentOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'order', default: null },
    
    // 1. Vị trí hiện tại của Drone (Cập nhật liên tục)
    location: { 
        lat: { type: Number, required: true }, 
        lng: { type: Number, required: true }
    },

    // 2. Vị trí Trạm Admin/Trạm Sạc (Cố định - Để Drone biết đường bay về)
    baseStation: {
        lat: { type: Number, default: 10.7387954 },
        lng: { type: Number, default: 106.61215 },
        address: { type: String, default: "Admin HQ - Center Station" }
    }

}, { minimize: false, timestamps: true });

const droneModel = mongoose.models.drone || mongoose.model("drone", droneSchema);
export default droneModel;