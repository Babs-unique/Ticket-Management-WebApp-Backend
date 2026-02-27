const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Automatically create uploads folder if it doesn't exist
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.tiff', '.svg','.mp4', '.mov', '.avi', '.pdf', '.docx'];
    const ext = path.extname(file.originalname);

    if(allowedExtensions.includes(ext.toLowerCase())) {
        cb(null, true);
    }else{
        cb(new Error('File type not allowed'), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;