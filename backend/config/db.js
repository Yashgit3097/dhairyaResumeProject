
import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://yashgithub907_db_user:yashgithub907_db_user@sabhamanagementtest.lglzu7w.mongodb.net/resume?appName=sabhamanagementtest')
    .then(() => {
        console.log("MongoDB connected successfully");
    }) 
}
