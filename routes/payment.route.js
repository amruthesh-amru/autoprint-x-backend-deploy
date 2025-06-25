import express from 'express';
import { createCheckoutSession, verifySession } from '../controllers/payment.controller.js';

const router = express.Router();

// Endpoint to create a Stripe checkout session
router.post('/create-checkout-session', createCheckoutSession);
router.post("/verify-session", verifySession);
export default router;
