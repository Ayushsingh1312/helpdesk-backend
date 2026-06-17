const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const connectDB = require('./src/config/db');

const app = express();
connectDB();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const ticketRoutes = require('./src/routes/ticketRoutes');
app.use('/api/tickets', ticketRoutes);

const commentRoutes = require('./src/routes/commentRoutes');
app.use('/api/tickets', commentRoutes);

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) =>{
    res.json({status: 'HelpDesk API is running'});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));