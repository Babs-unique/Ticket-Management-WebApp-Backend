const cloudinary = require('cloudinary').v2;
const User = require('../models/user.models');


const uploadImage = async (req, res) => {
    const userId = req.user.id;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try{
        if(!req.file){
            return res.status(400).json({message:"No file uploaded"})
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(401).json({message:"Unauthorized"})
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder : 'profile_pictures',
            public_id : `user_${userId}_${Date.now()}`
        })

        user.profilePicture = result.secure_url;
        await user.save();

        return res.status(200).json({message:"Image uploaded successfully", profilePicture: result.secure_url});
    }catch(error){
        console.error("Error in uploading image", error);
        return res.status(500).json({message:"Server Error"})
    }
}


const editProfile = async (req, res) => {
    const {name , email} = req.body;
    const userId = req.user.id;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(401).json({message:"Unauthorized"})
        }
        user.name = name || user.name;
        user.email = email || user.email;

        await user.save();
        return res.status(200).json({message:"Profile updated successfully", user})
    }catch(error){
        console.error("Error in editing profile", error);
        return res.status(500).json({message:"Server Error"})
    }
}


const editPassword = async (req, res) => {
    const {password, confirmPassword} = req.body;
    const userId = req.user.id;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(401).json({message:"Unauthorized"})
        }
        if(password !== confirmPassword){
            return res.status(400).json({message:"Password doesn't match"})
        }
        user.password = password;
        await user.save();

        return res.status(200).json({message:"Password updated successfully"})
    }catch(error){
        console.error("Error in editing password", error);
        return res.status(500).json({message:"Server Error"})
    }
}



module.exports = {
    uploadImage,
    editProfile,
    editPassword
}