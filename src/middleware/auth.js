const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next) => {
    console.log("Auth middleware called");
    console.log("All cookies:", req.cookies);
    const authHeader = req.cookies?.accessToken; 
   /*  if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    } */
    if(!authHeader) {
        console.log("No accessToken cookie found");
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try{
        console.log("Auth header:", authHeader);
    /* const token = authHeader.split(' ')[1]; */
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
