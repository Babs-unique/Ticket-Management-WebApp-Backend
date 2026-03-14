const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next) => {
    const authHeader = req.cookies.accessToken; 
   /*  if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    } */
    if(!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try{
    /* const token = authHeader.split(' ')[1]; */
    const token = authHeader;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
    }catch(error){
        console.error("Authentication error:", error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = authMiddleware;
