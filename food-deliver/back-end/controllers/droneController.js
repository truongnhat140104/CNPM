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

const updateDroneStatus = async (req, res) => {
    try {
        // Nhận thêm serialNumber, lat, lng từ Frontend
        const { droneId, serialNumber, lat, lng } = req.body;
        
        const updateData = {};

        // Chỉ cập nhật nếu có dữ liệu gửi lên
        if (serialNumber) updateData.serialNumber = serialNumber;
        
        if (lat !== undefined && lng !== undefined) {
            updateData.location = {
                lat: parseFloat(lat),
                lng: parseFloat(lng)
            };
            // Cập nhật luôn baseStation nếu muốn drone đổi nhà
            updateData.baseStation = {
                lat: parseFloat(lat),
                lng: parseFloat(lng)
            };
        }

        await droneModel.findByIdAndUpdate(droneId, updateData);
        res.json({ success: true, message: "Drone info updated successfully" });
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

const dispatchDrone = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await orderModel.findById(orderId);
        if (!order) return res.json({ success: false, message: "Order not found" });

        const availableDrone = await droneModel.findOne({ 
            status: 'Idle',
            battery: { $gt: 20 } // Chỉ chọn drone có pin > 20%
        });

        if (!availableDrone) {
            return res.json({ success: false, message: "No available drones (busy or low battery)!" });
        }

        order.status = "Drone Moving"; 
        await order.save();

        availableDrone.status = "Moving to Restaurant";
        availableDrone.currentOrderId = order._id;
        await availableDrone.save();

        res.json({ 
            success: true, 
            message: `Drone ${availableDrone.serialNumber} dispatched to Restaurant!`,
            drone: availableDrone
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error dispatching drone" });
    }
}

const updateDeliveryStep = async (req, res) => {
    try {
        const { orderId, action } = req.body;

        const order = await orderModel.findById(orderId);
        if (!order) return res.json({ success: false, message: "Order not found" });

        // Tìm con Drone đang nhận đơn này
        const drone = await droneModel.findOne({ currentOrderId: orderId });
        if (!drone) return res.json({ success: false, message: "Drone not found for this order" });

        // --- LOGIC CHUYỂN TRẠNG THÁI ---
        
        // 1. Drone đã đến nhà hàng -> Bắt đầu giao đi
        if (action === 'arrived_res') {
            order.status = "Out for delivery"; 
            drone.status = "Delivering";
        } 
        // 2. Drone đã giao cho khách -> Bắt đầu quay về
        else if (action === 'delivered') {
            // Tạm thời set status order là 'Returning' để nó hiện ở Tab Returning
            // (Khách hàng vẫn có thể thấy là Delivered, hoặc Returning tùy bạn xử lý hiển thị)
            order.status = "Returning"; 
            drone.status = "Returning";
            drone.battery -= 10; // Trừ pin giả lập
        } 
        // 3. Drone đã về trạm -> Hoàn tất
        else if (action === 'returned') {
            order.status = "Delivered"; // Trạng thái cuối cùng
            drone.status = "Idle";      // Drone rảnh
            drone.currentOrderId = null; // Gỡ đơn hàng khỏi Drone
        }

        await order.save();
        await drone.save();

        res.json({ success: true, message: "Status updated successfully!" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating step" });
    }
}

const chargeDrone = async (req, res) => {
    try {
        const { droneId } = req.body;
        const drone = await droneModel.findById(droneId);
        
        if (drone.status !== 'Idle') {
            return res.json({ success: false, message: "Drone đang bận, không thể sạc!" });
        }

        // Giả lập sạc đầy ngay lập tức
        drone.battery = 100;
        drone.status = 'Idle'; 
        await drone.save();

        res.json({ success: true, message: "Đã sạc đầy pin (100%)" });
    } catch (error) {
         // ...
    }
}

export { registerDrone, getDrones, updateDroneStatus, removeDrone, dispatchDrone, updateDeliveryStep, chargeDrone };