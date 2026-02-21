const mongoose = require('mongoose');
const User = require('./user.models');


const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'closed'],
        default: 'open'
    },
    priority: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    ticketId: {
        type : String,
        unique : true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date,
        default: null
    }
},{
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model("Ticket", ticketSchema);