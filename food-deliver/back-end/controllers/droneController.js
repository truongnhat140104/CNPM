import droneModel from "../models/droneModel.js";
import orderModel from "../models/orderModel.js";

const registerDrone = async (req, res) => {
    try {
        const { serialNumber, location, baseStation } = req.body;

        // 1. Kiểm tra Serial Number
        if (!serialNumber) {
            return res.json({ success: false, message: "Missing Serial Number" });
        }

        // 2. Kiểm tra trùng lặp
        const existingDrone = await droneModel.findOne({ serialNumber });
        if (existingDrone) {
            return res.json({ success: false, message: "Drone serial number already exists." });
        }

        // 3. CẤU HÌNH TỌA ĐỘ MẶC ĐỊNH (TP.HCM)
        const defaultCoords = { 
            lat: 10.762622, 
            lng: 106.660172 
        };

        // 4. CHUẨN HÓA DỮ LIỆU (QUAN TRỌNG)
        // Ép kiểu về Number để tránh lỗi String hoặc Null
        let finalLocation = defaultCoords;
        
        if (location && location.lat !== undefined && location.lng !== undefined) {
             finalLocation = {
                lat: parseFloat(location.lat), // Dùng parseFloat thay vì Number để an toàn hơn
                lng: parseFloat(location.lng)
            };
        }

        let finalBaseStation = finalLocation; // Mặc định trạm sạc = vị trí ban đầu
        
        if (baseStation && baseStation.lat !== undefined && baseStation.lng !== undefined) {
            finalBaseStation = {
                lat: parseFloat(baseStation.lat),
                lng: parseFloat(baseStation.lng)
            };
        }

        // 5. Tạo Drone mới
        const newDrone = new droneModel({ 
            serialNumber: serialNumber,
            location: finalLocation,      
            baseStation: finalBaseStation,
            status: 'Idle',
            battery: 100
        });

        await newDrone.save();

        res.json({ success: true, message: "Drone registered successfully.", drone: newDrone });

    } catch (error) {
        console.error("Error registering drone:", error);
        // In ra lỗi chi tiết để bạn thấy trong Terminal
        res.json({ success: false, message: error.message });
    }
};

const getDrones = async (req, res) => {
    try {
        const drones = await droneModel.find({});
        res.json({ success: true, data: drones });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching drones" });
    }
}

// 3. Cập nhật trạng thái/Pin (Update) - Dùng cho nút "Sạc pin" hoặc "Bảo trì"
const updateDroneStatus = async (req, res) => {
    try {
        const { droneId, status, battery } = req.body;
        
        const updateData = {};
        if (status) updateData.status = status;
        if (battery) updateData.battery = battery;

        await droneModel.findByIdAndUpdate(droneId, updateData);
        res.json({ success: true, message: "Drone status updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating drone" });
    }
}

// 4. Xóa Drone (Delete)
const removeDrone = async (req, res) => {
    try {
        const { id } = req.body;
        await droneModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Drone removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing drone" });
    }
}

export { registerDrone, getDrones, updateDroneStatus, removeDrone };