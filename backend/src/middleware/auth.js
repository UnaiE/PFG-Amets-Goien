import jwt from 'jsonwebtoken';

// Middleware to authenticate JWT tokens
export const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next(); 
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
};