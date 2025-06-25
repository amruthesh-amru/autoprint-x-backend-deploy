// import express from 'express';
// import upload from '../middlewares/upload.js'; // Adjust path if needed
// import { processOrder } from '../controllers/order.controller.js';
// import auth from '../middlewares/auth.js'
// const router = express.Router();

// // The client will send the file using the field name "file"
// // and include an "id" field in the body for naming.
// router.post('/upload', auth, upload.single('file'), processOrder);


// export default router;
// routes/order.route.js (or similar)
import express from "express";
import multer from "multer";
import { processOrder, getOrders } from "../controllers/order.controller.js";

const router = express.Router();
// Configure multer (e.g., use memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Use upload.array() if expecting multiple files under the same field name
router.post("/process-order", upload.array("pdfs"), processOrder);
router.get("/getOrders", getOrders);

export default router;
