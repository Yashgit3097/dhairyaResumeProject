
import multer from 'multer';




// Configure multer for file uploads
// Set the destination and filename for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Use a timestamp to avoid filename conflicts, timestamp means the time of upload
    },
});





// Stroring our image in our disk storage
// File filter to allow only image files
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    }
    else {
        cb(new Error('Only .jpeg, .jpg and .png files are allowed!'), false); // Reject the file
    }
}



const upload = multer({ storage, fileFilter })

export default upload;

