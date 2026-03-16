const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next) => {
    let authHeader = req.cookies?.accessToken;
    
    // Fallback to refreshToken if accessToken missing
    if (!authHeader) {
        authHeader = req.cookies?.refreshToken;
    }
    if(!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try{
        const token = authHeader;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(error){
        console.error("Authentication error:", error.message);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = authMiddleware;
