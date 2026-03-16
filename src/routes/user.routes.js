const express = require('express');
const authMiddleware = require('../middleware/auth');
const { registerUser, loginUser, getUserProfile, logout, refresh } = require('../controllers/user.controller');




const router = express.Router();


router.post('/register', registerUser);
router.post('/login' , loginUser)
router.get('/me', authMiddleware, getUserProfile);
router.post('/refresh', refresh) ;
router.post('/logout', logout)


module.exports = router;