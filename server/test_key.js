// server/test-key.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  console.log("Checking API Key...");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    // We just want to see if we can list models or run a basic prompt
    const result = await model.generateContent("Hello");
    console.log("✅ SUCCESS! Model found. Response:", result.response.text());
  } catch (error) {
    console.log("❌ ERROR DETAILS:");
    console.log(error.message);
  }
}

test();