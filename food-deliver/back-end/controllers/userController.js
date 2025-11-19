import userModel from "../models/userModel.js";
import restaurantProfileModel from "../models/restaurantProfile.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

// Token bây giờ sẽ chứa cả ID và ROLE
const createToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET)
}

// login user
const loginUser = async (req,res) => {
    const {email,password} = req.body;
    try {
        const user = await userModel.findOne({email});

        if (!user) {
            return res.json({success:false,message:"User doesn't exist"});
        }
        
        // Kiểm tra xem tài khoản có bị "deactive" không
        if (user.status === 'deactive') {
            return res.json({ success: false, message: "Account is deactivated." });
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch) {
            return res.json({success:false,message:"Wrong Password"});
        }

        // Truyền cả user._id và user.role vào
        const token = createToken(user._id, user.role); 
        
        // Trả về thêm role để front-end biết
        res.json({success:true, token, role: user.role }) 
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

// register user (res and customer)
const registerUser = async (req, res) => {
    const { name, password, email, role } = req.body;
    
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        const userRole = role || 'user';

        if (userRole === 'admin') {
            return res.json({ success: false, message: "Cannot register as admin" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
            role: userRole
        });

        const user = await newUser.save();
        
        const token = createToken(user._id, user.role);
        
        res.json({ success: true, token, role: user.role });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// remove user (admin)
const removeUser = async (req, res) => {
    const { id } = req.body;
    try {
        const deletedUser = await userModel.findByIdAndDelete(id);
        if (deletedUser) {
            res.json({ success: true, message: "User deleted successfully" });
        } else {
            res.json({ success: false, message: "User not found" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error deleting user" });
    }
}

// list users (admin)
const listUsers = async (req, res) => {
    const role = req.query.role;
    try {
        const users = await userModel.find({});
        res.json({ success: true, data: users });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching users" });
    }   
}

// update user status (admin)
const updateUserStatus = async (req, res) => {
    const { userId, status } = req.body;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        user.status = status;
        await user.save();
        res.json({ success: true, message: "User status updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating user status" });
    }
}

//admin register restaurant
const registerRestaurant = async (req, res) => {
    try {
        // Lấy dữ liệu từ FormData gửi lên
        const { 
            ownerName, email, password, // Thông tin User
            name, address, phone, description // Thông tin Profile quán
        } = req.body;

        const image_filename = req.file ? req.file.filename : "default.png";

        // 1. Kiểm tra xem email đã tồn tại chưa
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Email đã tồn tại" });
        }

        // 2. Validate định dạng
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Email không hợp lệ" });
        }
        if (password.length < 6) {
            return res.json({ success: false, message: "Mật khẩu phải trên 6 ký tự" });
        }

        // 3. Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. TẠO USER (Role = 'restaurant')
        const newUser = new userModel({
            name: ownerName, // Tên chủ quán
            email: email,
            password: hashedPassword,
            role: "restaurant", // <-- Quan trọng
            status: "active"
        });

        const savedUser = await newUser.save();

        // 5. TẠO PROFILE NHÀ HÀNG (Liên kết với User vừa tạo)
        const newProfile = new restaurantProfileModel({
            restaurant: savedUser._id, // Lấy ID của user trên
            name: name, // Tên quán ăn
            address: address,
            phone: phone,
            description: description,
            image: image_filename
        });

        await newProfile.save();

        // Tạo token để tự động đăng nhập luôn nếu muốn (hoặc chỉ trả về success)
        const token = createToken(savedUser._id, savedUser.role);

        res.json({ success: true, token, message: "Đăng ký nhà hàng thành công!" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi server" });
    }
}

export {loginUser,registerUser, removeUser, listUsers, updateUserStatus, registerRestaurant}