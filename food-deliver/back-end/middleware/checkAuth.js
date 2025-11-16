import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Not Authorized. Login Again.' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = token_decode; 
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Token is invalid or expired." });
    }
}

export default authMiddleware;