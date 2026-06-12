const express = require('express');
const router = express.Router();
const {registerUser, loginUser, getMe} = require('../controllers/authController');
const {protect, adminOnly} = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

//Test route
router.get('/admin-test', protect, adminOnly, (req, res)=>{
    res.json({message: 'Welcome Admin!'});
});

module.exports = router;