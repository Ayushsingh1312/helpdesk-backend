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
    let tickets;

    if (req.user.role === "admin") {
      // Show all tickets to admin, also populate user info
      tickets = await Ticket.find()
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });
    } else {
      // For normal user
      tickets = await Ticket.find({ createdBy: req.user._id }).sort({
        createdAt: -1,
      });
    }

    res.status(200).json(tickets);
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
