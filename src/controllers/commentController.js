const Comment = require("../models/Comment");

//@desc   Create a new comment
//@route  POST /api/tickets/:tickedId/comments
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if(!text){
        return res.status(400).json({message: 'Comment text is required'});
    }

    const comment = await Comment.create({
      ticket: req.params.ticketId,
      user: req.user._id,
      text,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//@desc   Get all comments for a ticket
//@route  GET  /api/tickets/:ticketId/comments
const getComments = async (req, res) => {
  try {
    const comment = await Comment.find({ticket: req.params.ticketId}).populate(
      "user",
      "name"
    ).sort({createdAt: 1});

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {addComment, getComments};
