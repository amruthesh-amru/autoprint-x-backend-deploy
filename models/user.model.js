import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "vendor"], required: true },
    contactInfo: {
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            unique: true,
            sparse: true
        },
        address: {
            type: String,
            required: [true, 'Address is required']
        }
    },
    cartData: {
        type: [Object],
        default: []
    }
},
    { timestamps: true },
)

export default mongoose.model("Customer", UserSchema);