import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

// Create an S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Pre-upload controller: receives a PDF and uploads it to S3
export async function preUpload(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        // Ensure the file is a PDF
        if (req.file.mimetype !== "application/pdf") {
            return res.status(400).json({ message: "Only PDF files are allowed." });
        }

        // Generate a unique file identifier
        const fileId = uuidv4();
        const key = `${fileId}.pdf`;

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        };

        await s3Client.send(new PutObjectCommand(params));

        // Construct the S3 URL
        const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        return res.status(200).json({ message: "File uploaded successfully", fileUrl, key });
    } catch (error) {
        console.error("Error in preUpload:", error);
        res.status(500).json({ message: "Error uploading file", error: error.message });
    }
}

// Optional: Delete file endpoint to remove file if payment fails
export async function deleteUploadedFile(req, res) {
    try {
        const { key } = req.body;
        if (!key) {
            return res.status(400).json({ message: "File key is required." });
        }
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key
        };

        await s3Client.send(new DeleteObjectCommand(params));
        return res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ message: "Error deleting file", error: error.message });
    }
}
