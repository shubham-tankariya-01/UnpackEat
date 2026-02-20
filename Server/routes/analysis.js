import express from "express";
import { IsLoggedIn } from "../middlewares/isLoggedIn.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// Analysis page - renders the detailed food analytics or performs a new search
router.get("/", IsLoggedIn, async (req, res) => {
    const { barcode } = req.query;

    if (barcode) {
        try {
            // Path to the local JSON data folder
            const dataPath = path.join(__dirname, "../py-backend/app/data", `${barcode}.json`);

            // Read and parse the local JSON file
            const rawData = await fs.readFile(dataPath, "utf-8");
            const data = JSON.parse(rawData);

            // Storing data in session
            req.session.searchProductdata = data;

            return res.render("analysis.ejs", { productData: data });

        } catch (error) {
            console.error("Search Error:", error);
            req.flash("error", "Product not found in our database. Please try another barcode.");
            return res.redirect("/home");
        }
    }

    const productData = req.session.searchProductdata;

    if (!productData) {
        req.flash("error", "No product data found to analyze. Please search for a product first.");
        return res.redirect("/home");
    }

    res.render("analysis.ejs", { productData });
});

export default router;
