// userController.js (Đã cập nhật)

import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

// Token bây giờ sẽ chứa cả ID và ROLE
const createToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET)
}

// login user (Đã cập nhật)
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

//register user (Đã cập nhật)
const registerUser = async (req,res) => {
    const {name,password,email} = req.body;
    try {
        const exists = await userModel.findOne({email})
        if (exists) {
            return res.json({success:false,message:"User already exists"})
        }

        if (!validator.isEmail(email)) {
            return res.json({success:false,message:"Please enter a valid email"})
        }

        if (password.length<8) {
            return res.json({success:false,message:"please enter a strong password"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

        const user = await newUser.save()
        
        // Truyền cả user._id và user.role (là 'customer')
        const token = createToken(user._id, user.role)
        
        // Trả về thêm role
        res.json({success:true, token, role: user.role});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}


const removeUser = async (req, res) => {
    const { id } = req.body;
    try {
        const deletedUser = await userModel.findByIdAndDelete(id);
        if (deletedUser) {
            // TODO: Nếu user này là 'owner', bạn cũng nên xóa 'restaurant' của họ
            res.json({ success: true, message: "User deleted successfully" });
        } else {
            res.json({ success: false, message: "User not found" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error deleting user" });
    }
}

const listUsers = async (req, res) => {
    const role = req.query.role;
    try {
        const users = await userModel.find({role : { $in: ['customer'] } }); // Lọc chỉ lấy customer
        res.json({ success: true, data: users });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching users" });
    }   
}

const updateUserStatus = async (req, res) => {
    // ... (Giữ nguyên code của bạn)
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

export {loginUser,registerUser, removeUser, listUsers, updateUserStatus}