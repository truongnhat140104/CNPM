import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const adminMiddleware = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({ success: false, message: 'Not Authorized. Login Again.' });
    }

    try {
        // 1. Giải mã token để lấy ID
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // 2. Lấy thông tin user từ DB
        const user = await userModel.findById(token_decode.id);
        
        // 3. Kiểm tra xem user có tồn tại VÀ có phải là admin không
        if (!user || user.role !== 'admin') {
            return res.json({ success: false, message: 'Authorization Failed: Admin access required.' });
        }

        // 4. Gắn userId vào request để controller sử dụng (giống authMiddleware của bạn)
        if (!req.body) req.body = {};
        req.body.userId = token_decode.id; // Gắn ID của admin
        
        next();

    } catch (error) {
        return res.json({ success: false, message: 'Token is not valid or expired.' });
    }
}

export default adminMiddleware;