const Ticket = require("../models/Ticket");

// @desc   Get all dashboard summary for admin
// @route  GET /api/dashboard/stats
const getDashboardStats = async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();

    const openTickets = await Ticket.countDocuments({ status: "open" });

    const inProgressTickets = await Ticket.countDocuments({
      status: "in-progress",
    });

    const resolvedTickets = await Ticket.countDocuments({ status: "resolved" });

    const highPriorityTickets = await Ticket.countDocuments({
      priority: "high",
    });

    res.status(200).json({
        totalTickets,
        openTickets,
        inProgressTickets,
        resolvedTickets,
        highPriorityTickets,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {getDashboardStats};
