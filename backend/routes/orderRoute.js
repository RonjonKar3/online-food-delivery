import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import verifyAdmin from "../middleware/verifyAdmin.js"; 
import { placeOrder, userOrders, listOrders, updateStatus } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", verifyToken, placeOrder);
orderRouter.post("/userorders", verifyToken, userOrders);
orderRouter.get('/list', verifyAdmin, listOrders);
orderRouter.post("/status", verifyAdmin, updateStatus);

export default orderRouter;
