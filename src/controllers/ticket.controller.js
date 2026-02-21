const Ticket = require('../models/ticket.models');
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

        const ticketCount = await Ticket.countDocuments();
        const ticketId = `#TKT${ticketCount}`;
        const newTicket = new Ticket({
            title,
            description,
            priority: priority || 'medium',
            status: status || 'open',
            user : userId,
            ticketId : ticketId
        })
        await newTicket.save();
        return res.status(201).json(newTicket);
    }catch(error){
        console.error("Create Ticket error:", error)
        return res.status(500).json({ message: 'Server error' });
    }
}

const getAllTicket = async (req , res) => {
    const userId = req.user.id;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const allTickets = await Ticket.find({ user: userId });
        return res.status(200).json({
            tickets: allTickets,
            total: allTickets.length,
            openTickets: allTickets.filter(ticket => ticket.status === 'open').length,
            closedTickets: allTickets.filter(ticket => ticket.status === 'closed').length
        })
    } catch (error) {
        console.error("Error in getting Tickets", error)
        return res.status(500).json({message:"Server Error"})
    }
}
const searchTicket = async (req, res) => {
    const {q} = req.query;
    const userId = req.user.id;
    if(!q){
        return res.status(400).json({message:"No search query provided"})
    }
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try{
        const formattedQuery = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        const configuredQuery = formattedQuery(q);


        const tickets = await Ticket.find({
            $or : [
                {title : {$regex :configuredQuery , $options : "i"}},
                {description : {$regex : configuredQuery , $options : "i" }}
            ]
        })
        return res.status(200).json(tickets)
    }catch(error){
        console.error("Error in searching Tickets", error)
        return res.status(500).json({message:"Server Error"})
    }
}

const filterByStatus = async (req , res) => {
    const {status} = req.query;

    const filter = {};

    if(status) {
        filter.status = status;
    }
    try{
        const tickets = await Tickets.find({filter})
        return res.status(200).json(tickets)
    }catch(error){
        console.error(`Error in fetching tickets with status ${status}`, error)
        return res.status(500).json({message:"Server Error"})
    }
}


module.exports = {
    createTicket,
    getAllTicket,
    searchTicket,
    filterByStatus
}