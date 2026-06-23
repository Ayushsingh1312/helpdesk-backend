const Ticket = require("../models/Ticket");

// @desc   Create new ticket
// @route  POST /api/tickets
// @access Private (logged in user)
const createTicket = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      category,
      priority,
      createdBy: req.user._id,
      attachment: req.file ? req.file.path : null,
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get tickets
// @route  GET /api/tickets
// @access Private
// Logic: Admin = all tickets, User = their tickets
const getTickets = async (req, res) => {
  try {
    // Query parameters
    const {status, priority, category, search, page, limit} = req.query;

    // Base filter
    let filter = {};
    if(req.user.role !== 'admin'){
        filter.createdBy = req.user._id;
    }

    // Status filter
    if(status){
        filter.status = status;
    }

    // Priority filter
    if(priority){
        filter.priority = priority;
    }

    // Category filter
    if(category){
        filter.category = category;
    }

    // Search  - find text in title or description
    if(search){
        filter.$or = [
            {title: {$regex: search, $options: 'i'}},
            {description: {$regex: search, $options: 'i'}},
        ];
    }

    // Pagination setup
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    // Total count
    const total = await Ticket.countDocuments(filter);

    // Fetch actual tickets
    const tickets = await Ticket.find(filter)
        .populate('createdBy', 'name email')
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limitNumber);

    res.status(200).json({
        tickets,
        pagination: {
            total,
            page: pageNumber,
            pages: Math.max(1, Math.ceil(total / limitNumber)),
            limit: limitNumber,
        },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get Single ticket
// @route  GET /api/tickets/:id
// @access Private
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // user can only view their own ticket.
    if (
      req.user.role !== "admin" &&
      ticket.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update ticket status
// @route  PUT /api/tickets/:id
// @access Private
const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Only admin can change the status
    // User can only update its tickets details
    if (req.user.role !== "admin") {
      if (ticket.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      // User cannot change the Status and createdBy
      const { title, description, category, priority } = req.body;
      const allowedUpdates = { title, description, category, priority };

      //Removed undefined fields
      Object.keys(allowedUpdates).forEach((key) => {
        if (allowedUpdates[key] === undefined) {
          delete allowedUpdates[key];
        }
      });

      const updatedTicket = await Ticket.findByIdAndUpdate(
        req.params.id,
        allowedUpdates,
        {new: true, runValidators: true}
      );

      return res.status(200).json(updatedTicket);
    }

    // Admin can update everything
    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete Ticket
// @route  DELETE /api/tickets/:id
// @access Private (owner or admin)
const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Only owner or admin can delete ticket
    if (
      req.user.role !== "admin" &&
      ticket.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await ticket.deleteOne();

    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
};
