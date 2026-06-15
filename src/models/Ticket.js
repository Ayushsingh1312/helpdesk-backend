const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        description:{
            type: String,
            required: [true, 'Description is required'],
        },
        category:{
            type: String,
            enum: ['technical', 'billing', 'general'],
            default: 'general',
        },
        priority:{
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        status:{
            type: String,
            enum: ['open', 'in-progress', 'resolved'],
            default: 'open',
        },

        createdBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model('Ticket', ticketSchema);