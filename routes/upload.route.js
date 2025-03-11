import express from "express";
import multer from "multer";
import { preUpload, deleteUploadedFile } from "../controllers/upload.controller.js";

const router = express.Router();

// Use memory storage so that the file is available in req.file.buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint to pre-upload a single PDF file (field name: 'pdf')
router.post("/pre-upload", upload.single("pdf"), preUpload);

// Optional endpoint to delete a file if payment fails
router.post("/delete-file", deleteUploadedFile);

export default router;
