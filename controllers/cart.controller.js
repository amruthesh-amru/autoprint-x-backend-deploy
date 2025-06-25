// src/controllers/cart.controller.js
import userModel from "../models/user.model.js";

export const addToCart = async (req, res) => {
    try {
        // Find the user by the ID provided in req.userId
        let userData = await userModel.findById(req.userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Extract orderData from request body
        const { orderData } = req.body;
        if (!orderData) {
            return res.status(400).json({ success: false, message: "Missing order data" });
        }

        // Push the new orderData into the user's cartData array
        userData.cartData.push(orderData);

        // Save the updated user document
        await userData.save();

        console.log("Updated cartData:", userData.cartData);
        res.status(200).json({ success: true, message: "Item added to cart", cart: userData.cartData });
    } catch (err) {
        console.error("Error in addToCart:", err);
        res.status(500).json({ success: false, message: "Error adding item to cart" });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        // Get the index from the request body and convert to a number.
        let { index } = req.body;
        index = parseInt(index, 10);
        if (isNaN(index)) {
            return res.status(400).json({ success: false, message: "Invalid index provided" });
        }

        // Find the user using the userId set by auth middleware.
        const userData = await userModel.findById(req.userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check that the index is within the bounds of the cartData array.
        if (index < 0 || index >= userData.cartData.length) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid index provided" });
        }

        // Remove the item from the cartData array.
        userData.cartData.splice(index, 1);

        // Save the updated user document.
        await userData.save();

        console.log("Updated cartData:", userData.cartData);
        res.status(200).json({
            success: true,
            message: "Item removed from cart",
            cart: userData.cartData,
        });
    } catch (err) {
        console.error("Error in removeFromCart:", err);
        res.status(500).json({ success: false, message: "Error removing item from cart" });
    }
};

export const getCartTotal = async (req, res) => {
    const { cartItems, printOptions } = req.body;

    try {
        // Calculate the total cost of cart items
        let totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

        // Add the printOptions cost estimate
        totalAmount += printOptions.costEstimate;

        res.send({ totalAmount });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};