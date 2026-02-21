import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { data } from './all_jsons.js';
import Product from '../models/productModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/food-analyser';

async function seedDB() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected to Database.');

        // 1. Clean Database
        console.log('Cleaning existing products...');
        await Product.deleteMany({});
        console.log('Database cleaned.');

        // 2. Insert Data directly from JSON
        console.log(`Ingesting ${data.length} records...`);

        // Minor pre-processing for known data issues
        const processedData = data.map(item => {
            const newItem = { ...item };

            // Fix salt normalization (assuming mg mislabeled as g for values > 100)
            if (newItem.serving && newItem.serving.per_100g && newItem.serving.per_100g.salt > 100) {
                newItem.serving.per_100g.salt /= 1000;
            }
            if (newItem.nutrients) {
                const saltNutri = newItem.nutrients.find(n => n.name === 'salt');
                if (saltNutri && saltNutri.amount_100g > 100) {
                    saltNutri.amount_100g /= 1000;
                }
            }

            return newItem;
        });

        const result = await Product.insertMany(processedData);
        console.log('--- Ingestion Completed ---');
        console.log(`Successfully Seeded: ${result.length} records.`);

    } catch (error) {
        console.error('Ingestion Failed:', error.message);
        if (error.errors) {
            Object.keys(error.errors).forEach(key => {
                console.error(`- Field ${key}: ${error.errors[key].message}`);
            });
        }
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
}

seedDB();
