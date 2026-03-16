const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user.models');
const generateToken = require('../utils/genratedToken');



const User = userSchema;



const registerUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        const err = new Error('All fields are required');
        err.status = 400;
        return next(err);
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const err = new Error('User already exists');
            err.status = 400;
            return next(err);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error("Registration error:", error);
        next(error);
    }
}



const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        const err = new Error('All fields are required');
        err.status = 400;
        return next(err);
    }
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            const err = new Error('User not found');
            err.status = 400;
            return next(err);
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            const err = new Error('Invalid Credentials');
            err.status = 400;
            return next(err);
        }

       /*  const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' }) */
        const { accessToken, refreshToken } = generateToken(existingUser._id);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false, //Remember to set this to true in production
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, //Remember to set this to true in production
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ 
            message: 'Login successful',
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email
            }
        })
    } catch (error) {
        console.error("Login error:", error);
        next(error);
    }
}

const refresh = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        jwt.verify(refreshToken, process.env.JWT_SECRET,
            (error, decoded) => {
                console.log("REFRESH TOKEN DECODED:", decoded);
                if (error) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const { accessToken } = generateToken(decoded.id);
                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: false, //Remember to set this to true in production
                    sameSite: "lax",
                    maxAge: 15 * 60 * 1000
                });
                return res.status(200).json({ message: 'Token refreshed successfully' });
            }
        );
    } catch (error) {
        console.error("Refresh token error:", error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}
const getUserProfile = async (req, res, next) => {
    try {
        const userId = req.user?.id || req.user?.userId;
        if (!userId) {
            console.log("User ID from token:", req.user);
            return res.status(401).json({ message: "Unauthorized" });
            
        }
        const user = await User.findById(userId).select('-password');
        if (!user) {
            const err = new Error('User not found');
            err.status = 404;
            return next(err);
        }
        res.status(200).json({
            success: true,
            user
        });
    }catch(err){
        console.error("Get user profile error:", err);
        next(err);
    }
}
const logout  = (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(200).json({ message: 'Logout successful' });
}

module.exports = {
    registerUser,
    loginUser,
    refresh,
    getUserProfile,
    logout
}