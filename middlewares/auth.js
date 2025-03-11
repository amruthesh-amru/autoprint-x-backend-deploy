import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;

    console.log("Cookies:", req.cookies);

    if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized, login again" });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", tokenDecode);

        req.userId = tokenDecode.userId;
        next();
    } catch (error) {
        console.log("Auth Error:", error);
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export default authMiddleware;
