import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
import connectDB from './config/DBConnection.js'
import orderRouter from "./routes/order.route.js";
import cartRouter from "./routes/cart.route.js";
import Stripe from "stripe";
import paymentRouter from './routes/payment.route.js';
import uploadRouter from "./routes/upload.route.js";
import cookieParser from "cookie-parser";


dotenv.config();
connectDB()
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
app.use(
    cors({
        origin: true, // Allow all origins during development
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        optionsSuccessStatus: 200 // For legacy browser support
    })
);
app.use(express.json());
app.use(cookieParser());

// Handle preflight requests
app.options('*', cors());

app.set('io', io);

app.use("/api/order", orderRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/payment/", paymentRouter);
app.use("/api/upload", uploadRouter);

// Route for Stripe webhook
// (Optional) Default route
app.get("/", (req, res) => {
    res.send("Server is running!");

});


const PORT = process.env.PORT || 5000;

// For traditional server deployment (not serverless)
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Log connection event from Socket.IO
io.on("connection", (socket) => {
    console.log("Vendor App Connected", socket.id);
});

export default server;

