const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user.models');



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

        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        return res.status(200).json({ Message: 'Login successful', token })
    } catch (error) {
        console.error("Login error:", error);
        next(error);
    }
}
const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            const err = new Error('User not found');
        }
        res.status(200).json(user);
    }catch(err){
        console.error("Get user profile error:", err);
        next(err);
    }
}
const logout  = (req, res) => {
    return res.status(200).json({ message: 'Logout successful' });
}

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    logout
}