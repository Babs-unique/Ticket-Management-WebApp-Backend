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
        const allTickets = await Ticket.find({ user: userId , isDeleted : { $ne : true }});
        if(allTickets.length === 0){
            return res.status(200).json({message:"No tickets found", tickets: []})
        }
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
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if(!q){
        return res.status(400).json({message:"No search query provided"})
    }
    try{
        const formattedQuery = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        const configuredQuery = formattedQuery(q);

        const tickets = await Ticket.find({
            $or : [
                {title : {$regex :configuredQuery , $options : "i"}},
                {description : {$regex : configuredQuery , $options : "i" }}
            ],
            user : userId
        })
        if(tickets.length === 0){
            return res.status(200).json({message:"No tickets found matching the search query", tickets: []})
        }
        return res.status(200).json({
            tickets : tickets,
            total: tickets.length
        })
    }catch(error){
        console.error("Error in searching Tickets", error)
        return res.status(500).json({message:"Server Error"})
    }
}

const filterByStatus = async (req , res) => {
    const {status} = req.query;
    const userId = req.user.id;
    if(!userId) { 
        return res.status(401).json({ message: 'Unauthorized' });
    }

    /* const filter = {};

    if(status) {
        filter.status = status;
    } */
    try{
        const tickets = await Ticket.find({status,
            user : userId
        })
        if(tickets.length === 0){
            return res.status(200).json({message:`No tickets found with status ${status}`, tickets: []})
        }
        return res.status(200).json(tickets)
    }catch(error){
        console.error(`Error in fetching tickets with status ${status}`, error)
        return res.status(500).json({message:"Server Error"})
    }
}

const updateTickets = async (req, res) => {
    const {id} = req.params;
    const { title, description, priority, status } = req.body;
    const userId = req.user.id
    if(!userId){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try{
        const updateData = {};
        if(title !== undefined) updateData.title = title;
        if(description !== undefined) updateData.description = description;
        if(priority !== undefined) updateData.priority = priority;
        if(status !== undefined) updateData.status = status;

        const tickets = await Ticket.findOneAndUpdate({_id : id, user : userId},
            updateData,
            {new : true}
        )
        if(!tickets){
            return res.status(404).json({message:"Ticket not found"})
        }
        return res.status(200).json({message : "Ticket updated successfully", tickets})
    }catch(error){
        console.error("Error in updating ticket", error);
        return res.status(500).json({message:"Server Error"})
    }
}
const deleteTickets = async (req ,res) => {
    const {id} = req.params;
    const userId = req.user.id;
    if(!userId) {
        return res.status(400).json({message: "Unauthorized"})
    }
    try{
        const tickets = await Ticket.findOneAndUpdate({_id : id, user : userId},
            {deletedAt : new Date(), isDeleted : true},
            /* {new : true} */
            {returnDocument : after}
        )
        if(!tickets){
            return res.status(404).json({message:"Ticket not found"})
        }
        return res.status(200).json({message:"Ticket deleted successfully", ticket: tickets})

    }catch(error){
        console.error("Error in deleting ticket", error);
        return res.status(500).json({message:"Server Error"})
    }
    
}


module.exports = {
    createTicket,
    getAllTicket,
    searchTicket,
    filterByStatus,
    updateTickets,
    deleteTickets
}