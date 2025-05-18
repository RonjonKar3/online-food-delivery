import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://SwiftMeal:SwiftMeal@cluster0.kidxg01.mongodb.net/food-del');
        console.log("✅ DB connected");
    } catch (error) {
        console.error("❌ DB connection failed:", error);
        process.exit(1);
    }
}; 