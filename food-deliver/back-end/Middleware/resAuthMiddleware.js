import jwt from 'jsonwebtoken';
import resModel from "../models/resModel.js";

const resAuthMiddleware = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({ success: false, message: "Not Authorized" });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.restaurantId = token_decode.id; 
        next();
    } catch (error) {
        res.json({ success: false, message: "Token không hợp lệ" });
    }
}
export default resAuthMiddleware;