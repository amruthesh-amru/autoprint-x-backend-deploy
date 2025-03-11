
import dotenv from "dotenv";
import Order from "../models/order.model.js";
import orderModel from "../models/order.model.js";
import userModel from "../models/user.model.js";


dotenv.config();


export const getOrders = async (req, res) => {
    try {
        const orders = await orderModel.find();
        if (orders && orders.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Orders fetched successfully",
                orders: orders,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "No orders found",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
export async function processOrder(req, res) {
    try {
        const orderData = JSON.parse(req.body.orderData);
        console.log("❤️❤️", orderData);

        const { customer, vendor, costEstimate, items } = orderData;

        // Fetch the customer's name using the ID
        const customerData = await userModel.findById(customer);
        if (!customerData) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const processedItems = items.map((item) => {
            const document = item.s3Url
                ? {
                    fileName: item.fileName,
                    filePath: item.s3Url,
                    pages: item.pages || 1,
                }
                : {};

            return {
                document,
                printOptions: item.printOptions,
            };
        });

        const newOrder = new Order({
            customer: customerData.name, // Send customer name instead of ID
            vendor,
            items: processedItems,
            costEstimate,
            status: "pending",
        });

        const savedOrder = await newOrder.save();

        // Emit event to connected vendors (if using Socket.IO)
        const io = req.app.get("io");
        if (io) io.emit("new-order", savedOrder);

        res.status(201).json({ message: "Order placed successfully", order: savedOrder });
    } catch (error) {
        console.error("Error processing order:", error);
        res.status(500).json({ message: "Error processing order", error: error.message });
    }
}

