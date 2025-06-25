// // middlewares/upload.js
// import multer from 'multer';
// import path from 'path';

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Specify your desired upload directory
//     },
//     filename: (req, file, cb) => {
//         const userId = req.body.id; // Extract 'id' from the request body
//         const fileExtension = path.extname(file.originalname);
//         cb(null, `${userId}${fileExtension}`); // Set filename as 'id.pdf'
//     },
// });

// const upload = multer({ storage });

// export default upload;
import multer from 'multer';

// Use memory storage so that the file is available in req.file.buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });
export default upload;
