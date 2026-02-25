const Ticket = require('../models/ticket.models');
const User = require('../models/user.models');



const createTicket = async (req, res, next) => {
    const { title, description, priority, status } = req.body;
    if (!title || !description) {
        const err = new Error('Title and description are required');
        err.status = 400;
        return next(err);
    }
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

        const ticketCount = await Ticket.countDocuments();
        const ticketId = `#TKT${ticketCount}`;
        const newTicket = new Ticket({
            title,
            description,
            priority: priority || 'medium',
            status: status || 'open',
            user: userId,
            ticketId: ticketId
        })
        await newTicket.save();
        return res.status(201).json(newTicket);
    } catch (error) {
        console.error("Create Ticket error:", error)
        next(error);
    }
}

const getAllTicket = async (req, res, next) => {
    const userId = req.user.id;
    if (!userId) {
        const err = new Error('Unauthorized');
        err.status = 401;
        return next(err);
    }
    try {
        const allTickets = await Ticket.find({ user: userId, isDeleted: { $ne: true } });
        if (allTickets.length === 0) {
            return res.status(200).json({ message: "No tickets found", tickets: [] })
        }
        return res.status(200).json({
            tickets: allTickets,
            total: allTickets.length,
            openTickets: allTickets.filter(ticket => ticket.status === 'open').length,
            closedTickets: allTickets.filter(ticket => ticket.status === 'closed').length
        })
    } catch (error) {
        console.error("Error in getting Tickets", error)
        next(error);
    }
}
const searchTicket = async (req, res, next) => {
    const { q } = req.query;
    const userId = req.user.id;
    if (!userId) {
        const err = new Error('Unauthorized');
        err.status = 401;
        return next(err);
    }
    if (!q) {
        const err = new Error('No search query provided');
        err.status = 400;
        return next(err);
    }
    try {
        const formattedQuery = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        const configuredQuery = formattedQuery(q);

        const tickets = await Ticket.find({
            $or: [
                { title: { $regex: configuredQuery, $options: "i" } },
                { description: { $regex: configuredQuery, $options: "i" } }
            ],
            user: userId
        })
        if (tickets.length === 0) {
            return res.status(200).json({ message: "No tickets found matching the search query", tickets: [] })
        }
        return res.status(200).json({
            tickets: tickets,
            total: tickets.length
        })
    } catch (error) {
        console.error("Error in searching Tickets", error)
        next(error);
    }
}

const filterByStatus = async (req, res, next) => {
    const { status } = req.query;
    const userId = req.user.id;
    if (!userId) {
        const err = new Error('Unauthorized');
        err.status = 401;
        return next(err);
    }

    try {
        const tickets = await Ticket.find({ status, user: userId })
        if (tickets.length === 0) {
            return res.status(200).json({ message: `No tickets found with status ${status}`, tickets: [] })
        }
        return res.status(200).json(tickets)
    } catch (error) {
        console.error(`Error in fetching tickets with status ${status}`, error)
        next(error);
    }
}

const updateTickets = async (req, res, next) => {
    const { id } = req.params;
    const { title, description, priority, status } = req.body;
    const userId = req.user.id
    if (!userId) {
        const err = new Error('Unauthorized');
        err.status = 401;
        return next(err);
    }
    try {
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (priority !== undefined) updateData.priority = priority;
        if (status !== undefined) updateData.status = status;

        const tickets = await Ticket.findOneAndUpdate({ _id: id, user: userId },
            updateData,
            { new: true }
        )
        if (!tickets) {
            const err = new Error('Ticket not found');
            err.status = 404;
            return next(err);
        }
        return res.status(200).json({ message: "Ticket updated successfully", tickets })
    } catch (error) {
        console.error("Error in updating ticket", error);
        next(error);
    }
}
const deleteTickets = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;
    if (!userId) {
        const err = new Error('Unauthorized');
        err.status = 401;
        return next(err);
    }
    try {
        const tickets = await Ticket.findOneAndUpdate({ _id: id, user: userId },
            { deletedAt: new Date(), isDeleted: true },
            { new: true }
        )
        if (!tickets) {
            const err = new Error('Ticket not found');
            err.status = 404;
            return next(err);
        }
        return res.status(200).json({ message: "Ticket deleted successfully", ticket: tickets })

    } catch (error) {
        console.error("Error in deleting ticket", error);
        next(error);
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