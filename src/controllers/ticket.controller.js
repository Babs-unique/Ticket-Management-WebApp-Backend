const Ticket = require('../models/ticket.model');
const User = require('../models/user.models');



const createTicket = async (req, res) => {
    const { title, description, priority, status } = req.body;
    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required' });
    }
    const userId = req.user.id;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try{
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const newTicket = new Ticket({
            title,
            description,
            priority: priority || 'medium',
            status: status || 'open',
        })
        await newTicket.save();
        return res.status(201).json(newTicket);
    }catch(error){
        console.error("Create Ticket error:", error)
        return res.status(500).json({ message: 'Server error' });
    }
}


module.exports = {
    createTicket
}