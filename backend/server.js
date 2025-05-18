import express from "express";
import cors from "cors";
import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(cors());
app.use(express.json());
app.use("/images", express.static(uploadDir));

// ✅ Register routers
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/food", foodRouter);
app.use("/api/order", orderRouter);

connectDB();

app.get("/", (req, res) => {
  res.send("API working");
});

// Global error handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: err.message });
  } else if (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
  next();
});

app.listen(port, () => {
  console.log(`🚀 Server started at http://localhost:${port}`);
});
