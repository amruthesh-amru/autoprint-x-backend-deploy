// import mongoose from "mongoose";
// const OrderSchema = new mongoose.Schema({
//     customer: { type: String, ref: "User", required: true },
//     vendor: { type: String, ref: "User" },
//     document: {
//         fileName: String,
//         filePath: String,  // URL or path where the document is stored
//         pages: Number,
//     },
//     printOptions: {
//         paperSize: String, // "A4", "A3", etc.
//         color: Boolean,    // true for color, false for B&W
//         duplex: Boolean,   // double-sided printing
//         copies: Number,
//         allPageprint: Boolean,
//         pagerange: String,
//         binding: { type: String, default: "none" }  // e.g., "staple", "spiral", etc.
//     },
//     status: { type: String, enum: ["pending", "accepted", "printing", "completed", "rejected"], default: "pending" },
//     costEstimate: Number,
// }, { timestamps: true });

// export default mongoose.model("Order", OrderSchema);

// models/order.model.js
import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
    // Document information (S3 file details)
    document: {
        fileName: { type: String },
        filePath: { type: String }, // S3 URL
        pages: { type: Number, default: 1 },
    },
    // Print options for that item
    printOptions: {
        binding: { type: String, default: "none" }, // e.g., "staple", "spiral"
        color: { type: String }, // e.g., "bw" or "color"
        copies: { type: Number },
        duplex: { type: Boolean },
        estimatedCost: { type: Number },
        orientation: { type: String },
        pageRange: { type: String },
        paperSize: { type: String },
        selectAll: { type: Boolean },
    }
});

const OrderSchema = new mongoose.Schema({
    customer: { type: String, ref: "User", required: true },
    vendor: { type: String, ref: "User" },
    // Array of cart items
    items: [OrderItemSchema],
    // Overall cost estimate (if applicable)
    costEstimate: { type: Number },
    status: {
        type: String,
        enum: ["pending", "accepted", "printing", "completed", "rejected"],
        default: "pending"
    }
}, { timestamps: true });

export default mongoose.model("Order", OrderSchema);
