import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import connectDB from "./config/DBConnection.js";
import orderRouter from "./routes/order.route.js";
import cartRouter from "./routes/cart.route.js";
import Stripe from "stripe";
import paymentRouter from "./routes/payment.route.js";
import uploadRouter from "./routes/upload.route.js";
import cookieParser from "cookie-parser";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173"; // Use env variable for frontend

const io = new Server(server, {
    cors: {
        origin: CLIENT_URL,  // ✅ Allow only frontend URL
        credentials: true
    }
});

// Setup CORS properly
app.use(cors({
    origin: CLIENT_URL,  // ✅ Allow frontend only
    credentials: true,   // ✅ Needed for cookies/auth
}));

app.use(express.json());
app.use(cookieParser());

// Attach Socket.IO instance to app
app.set("io", io);

// Routes
app.use("/api/order", orderRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/payment/", paymentRouter);
app.use("/api/upload", uploadRouter);

// Default route
app.get("/", (req, res) => {
    res.send("Server is running!");
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Socket.IO connection log
io.on("connection", (socket) => {
    console.log("Vendor App Connected", socket.id);
});
