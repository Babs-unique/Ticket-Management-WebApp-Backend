const jwt = require('jsonwebtoken');


const generateToken = (userId) => {
    const accessToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
}

module.exports = generateToken;