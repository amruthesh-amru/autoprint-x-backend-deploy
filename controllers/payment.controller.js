import Stripe from 'stripe';
import Payment from '../models/payment.model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Controller to create a Stripe checkout session
export const createCheckoutSession = async (req, res) => {
    const { amount, cartItems } = req.body;

    try {
        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: 'Print Order',
                        },
                        unit_amount: amount * 100, // Amount in paise
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: "http://localhost:5173/cancel",
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Error creating Stripe session', error);
        res.status(500).json({ error: error.message });
    }
};

// Controller to handle payment success and save data in MongoDB
export const handlePaymentSuccess = async (sessionId) => {
    try {
        // Retrieve session details from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // Prepare data to save
        const paymentData = {
            paymentIntentId: session.payment_intent,
            sessionId: session.id,
            paymentStatus: session.payment_status, // 'paid', 'unpaid', etc.
            amountPaid: session.amount_total,
            currency: session.currency,
            customerEmail: session.customer_email,
            customerName: session.customer_name || '',
            paymentMethodType: session.payment_method_types[0], // E.g., 'card'
            receiptUrl: session.receipt_url,
            paymentDate: new Date(),
        };

        // Save payment data in MongoDB
        const payment = new Payment(paymentData);
        await payment.save();

        console.log('Payment data saved successfully');
    } catch (error) {
        console.error('Error handling payment success:', error);
    }
};
// export const verifySession = async (req, res) => {
//     const { sessionId } = req.body;

//     try {
//         // Retrieve session details from Stripe
//         const session = await stripe.checkout.sessions.retrieve(sessionId);
//         const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
//         console.log("Session:", session);
//         console.log("PaymentIntent:", paymentIntent);

//         // Use optional chaining to safely access charge details
//         const charge = paymentIntent.charges?.data?.[0];

//         res.json({
//             paymentIntentId: paymentIntent.id,
//             paymentStatus: paymentIntent.status,  // e.g., 'succeeded'
//             amountPaid: session.amount_total,
//             currency: session.currency,
//             customerEmail: session.customer_email,
//             customerName: session.customer_name || '',
//             paymentMethodType: charge?.payment_method_details?.type || "N/A",
//             cardType: charge?.payment_method_details?.card?.brand || "N/A",
//             cardLast4: charge?.payment_method_details?.card?.last4 || "N/A",
//             stripeFee: charge?.balance_transaction?.fee || 0,
//             receiptUrl: session.receipt_url || ""
//         });
//     } catch (error) {
//         console.error("Error verifying session:", error);
//         res.status(500).json({ error: "Error verifying session" });
//     }
// };

export const verifySession = async (req, res) => {
    const { sessionId } = req.body;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // Check if session.payment_intent exists
        if (!session.payment_intent) {
            console.error("Payment Intent not found in session");
            return res.status(400).json({ error: "Payment Intent not found" }); // Or appropriate error
        }

        const paymentIntentId = session.payment_intent; // Get the Payment Intent ID

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId); // Use Payment Intent ID

        // ... (rest of your code, using paymentIntent)
        const charge = paymentIntent.charges?.data?.[0]; // Access charge details safely

        res.json({
            paymentIntentId: paymentIntent.id,
            paymentStatus: paymentIntent.status,
            amountPaid: session.amount_total,
            currency: session.currency,
            customerEmail: session.customer_email,
            customerName: session.customer_name || '',
            paymentMethodType: charge?.payment_method_details?.type || "N/A",
            cardType: charge?.payment_method_details?.card?.brand || "N/A",
            cardLast4: charge?.payment_method_details?.card?.last4 || "N/A",
            stripeFee: charge?.balance_transaction?.fee || 0,
            receiptUrl: session.receipt_url || ""
        });

    } catch (error) {
        console.error("Error verifying session:", error);
        res.status(500).json({ error: "Error verifying session" });
    }
};