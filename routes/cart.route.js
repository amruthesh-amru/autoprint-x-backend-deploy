import express from 'express'
import authMiddleware from '../middlewares/auth.js'
import { addToCart, getCartTotal } from '../controllers/cart.controller.js'
import { removeFromCart } from '../controllers/cart.controller.js'

const router = express.Router()

router.post('/addToCart', authMiddleware, addToCart)
router.post('/removeFromCart', authMiddleware, removeFromCart)
router.post('/getCartTotal', authMiddleware, getCartTotal)
export default router;