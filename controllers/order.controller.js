
import dotenv from "dotenv";
import Order from "../models/order.model.js";
import orderModel from "../models/order.model.js";


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
        // Parse the orderData JSON (it should include S3 URLs in each item)
        const orderData = JSON.parse(req.body.orderData);
        const { customer, vendor, costEstimate, items } = orderData;

        // Process each order item
        const processedItems = items.map((item) => {
            // Here, item should include a field like s3Url (or fileUrl) from the pre-upload
            const document = item.s3Url
                ? {
                    fileName: item.fileName, // You can store the file name
                    filePath: item.s3Url,      // S3 URL returned from pre-upload
                    pages: item.pages || 1,
                }
                : {}; // If no file URL, leave empty

            return {
                document,
                printOptions: item.printOptions,
            };
        });

        const newOrder = new Order({
            customer,
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

