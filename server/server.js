import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({ path: path.resolve(__dirname, './.env') });


console.log("------------------------------------------------");
console.log("DEBUG: GEMINI_API_KEY ->", process.env.GEMINI_API_KEY ? "Loaded ✅" : "Missing ❌");
console.log("DEBUG: MONGO_URI      ->", process.env.MONGO_URI ? "Loaded ✅" : "Missing ❌");
console.log("------------------------------------------------");



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));
app.use(express.json());


app.use('/api', apiRoutes);


if (!process.env.MONGO_URI) {
  console.error("🔴 FATAL ERROR: MONGO_URI is missing from .env file");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('🟢 MongoDB Connected Successfully');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('🔴 MongoDB Connection Failed:', err);
  });