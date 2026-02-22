const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        unique: true
    },
    profilePicture: {
        type: String,
        default: null
    }
},{
    timestamps: true,
    versionKey: false
});


module.exports = mongoose.model("User", userSchema);