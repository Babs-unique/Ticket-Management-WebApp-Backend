const express = require('express');
const AuthMiddleware = require('../middleware/auth');
const { registerUser, loginUser, getUserProfile, logout } = require('../controllers/user.controller');




const router = express.Router();


router.post('/register', registerUser);
router.post('/login' , loginUser)
router.get('/profile', AuthMiddleware, getUserProfile);
router.post('/logout', logout)


module.exports = router;