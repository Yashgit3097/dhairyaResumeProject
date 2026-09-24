import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

// Middleware to generate JWT token
export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1]; // Extract the token from the header
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
      req.user = await User.findById(decoded.id).select("-password"); // Find the user and exclude password
      next(); // Proceed to the next middleware or route handler
    } else {
      res.status(401).json({ message: "Not authorized, no token" }); // Unauthorized if no token
    }
  } catch (error) {
    res.status(401).json({
      message: "Not authorized, token failed",
      error: error.message, // Include the error message for debugging
    }); // Unauthorized if token verification fails
  }
};
