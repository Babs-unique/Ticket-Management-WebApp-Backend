const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user.models');



const User = userSchema;



const registerUser = async (req, res) => {
    const { name, email, password} = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try{
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    }catch(error){
        console.error("Registration error:", error);
        return res.status(500).json({ message: 'Server error' });
    }
}



const loginUser = async ( req , res) => {
    const {email , password} = req.body;
    if(!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try{
        const existingUser = await User.findOne({email});
        if(!existingUser){
            return res.status(400).json({message: "User not found"})
        }

        const isPasswordValid = bcrypt.compare(password, existingUser.password);
        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid Credentials"})
        }

        const token = jwt.sign({id: existingUser._id} , process.env.JWT_SECRET , {expiresIn  : '1h'})
        return res.status(200).json({Message : 'Login successful' , token})
    }catch(error){
        console.error("Login error:", error);
        return res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    registerUser,
    loginUser
}