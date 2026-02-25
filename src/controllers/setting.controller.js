const cloudinary = require('cloudinary').v2;
const User = require('../models/user.models');
const bcrypt = require('bcryptjs')


const uploadImage = async (req, res, next) => {
    const userId = req.user.id;
    if (!userId) {
        const err = new Error('Unauthorized');
        err.status = 401;
        return next(err);
    }
    try {
        if (!req.file) {
            const err = new Error('No file uploaded');
            err.status = 400;
            return next(err);
        }
        const user = await User.findById(userId);
        if (!user) {
            const err = new Error('Unauthorized');
            err.status = 401;
            return next(err);
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'profile_pictures',
            public_id: `user_${userId}_${Date.now()}`
        })

        user.profilePicture = result.secure_url;
        await user.save();

        return res.status(200).json({ message: "Image uploaded successfully", profilePicture: result.secure_url });
    } catch (error) {
        console.error("Error in uploading image", error);
        next(error);
    }
}


const editProfile = async (req, res, next) => {
    const { name, email } = req.body;
    const userId = req.user.id;
    if (!userId) {
        const err = new Error('Unauthorized');
        err.status = 401;
        return next(err);
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            const err = new Error('Unauthorized');
            err.status = 401;
            return next(err);
        }
        user.name = name || user.name;
        user.email = email || user.email;

        await user.save();
        return res.status(200).json({ message: "Profile updated successfully", user })
    } catch (error) {
        console.error("Error in editing profile", error);
        next(error);
    }
}


const editPassword = async (req, res, next) => {
    const { password, confirmPassword } = req.body;
    const userId = req.user.id;
    if (!userId) {
        const err = new Error('Unauthorized');
        err.status = 401;
        return next(err);
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            const err = new Error('Unauthorized');
            err.status = 401;
            return next(err);
        }
        if (password !== confirmPassword) {
            const err = new Error("Password doesn't match");
            err.status = 400;
            return next(err);
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: "Password updated successfully" })
    } catch (error) {
        console.error("Error in editing password", error);
        next(error);
    }
}



module.exports = {
    uploadImage,
    editProfile,
    editPassword
}