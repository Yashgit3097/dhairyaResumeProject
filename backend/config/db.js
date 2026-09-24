
import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb://localhost:27017/resume_Builder_test')
    .then(() => {
        console.log("MongoDB connected successfully");
    }) 
}
