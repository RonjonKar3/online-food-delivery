import fs from "fs";
import foodModel from "../models/foodModel.js";

const addFood = async (req, res) => {
    console.log("Received:", req.body, req.file);

    if (!req.file) {
        return res.status(400).json({ success: false, message: "Image file missing" });
    }

    const image_filename = req.file.filename;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename,
    });

    try {
        await food.save();
        res.status(201).json({ success: true, message: "Food Added" });
    } catch (error) {
        console.error("Error saving food:", error);
        res.status(500).json({ success: false, message: "Failed to add food" });
    }
};

// Get all food items
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Delete food item
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);

        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        // Remove image file
        fs.unlink(`uploads/${food.image}`, (err) => {
            if (err) {
                console.warn("Image delete failed:", err.message);
            }
        });

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.error("Error deleting food:", error.message);
        res.status(500).json({ success: false, message: "Error deleting food" });
    }
};

export { addFood, listFood, removeFood }; 