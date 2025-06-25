import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
    {
        paymentIntentId: { type: String, required: true },
        sessionId: { type: String, required: true },
        paymentStatus: { type: String, required: true },
        amountPaid: { type: Number, required: true },
        currency: { type: String, required: true },
        customerEmail: { type: String, required: true },
        customerName: { type: String },
        paymentMethodType: { type: String, required: true },
        receiptUrl: { type: String },
        paymentDate: { type: Date, required: true },
    },
    { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
