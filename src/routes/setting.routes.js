const router = require('express').Router();
const upload = require('../utils/multer');

const authMiddleware = require('../middleware/auth');
const { uploadImage, editProfile, editPassword } = require('../controllers/setting.controller');


router.put('/update/profilePicture', authMiddleware, upload.single('profilePicture'), uploadImage);
router.put('/update/profileDetails', authMiddleware, editProfile);
router.put('/update/password', authMiddleware, editPassword);



module.exports = router;