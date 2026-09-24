
// here we define the routes for user-related operations
import express from "express";
import { getUserProfile, loginUser, registerUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";


const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser); 

// protected route as token will be required to access this route
userRouter.get("/profile", protect, getUserProfile); 



export default userRouter;




