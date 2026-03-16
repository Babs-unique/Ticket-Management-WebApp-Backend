const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next) => {
    console.log("Auth middleware called");
    console.log("All cookies:", req.cookies);
    let authHeader = req.cookies?.accessToken;
    
    // Fallback to refreshToken if accessToken missing
    if (!authHeader) {
        authHeader = req.cookies?.refreshToken;
    }
    if(!authHeader) {
        console.log("No accessToken or refreshToken cookie found");
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try{
        console.log("Auth header:", authHeader);
        const token = authHeader;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);
        req.user = decoded;
        next();
    }catch(error){
        console.error("Authentication error:", error.message);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = authMiddleware;
