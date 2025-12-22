import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

async function checkModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log("🔑 Checking API Key Models...");

  try {
    // This asks Google: "What models can I use?"
    const model = genAI.getGenerativeModel({ model: "gemini-pro" }); 
    // We access the underlying API to list models
    // Note: The SDK doesn't always expose listModels simply, 
    // so we will try the most common names and print which one works.
    
    const candidates = [
      "gemini-1.5-flash",
      "gemini-1.5-flash-latest",
      "gemini-1.5-pro",
      "gemini-1.0-pro",
      "gemini-pro"
    ];

    console.log("\nTesting specific models...");
    
    for (const modelName of candidates) {
      process.stdout.write(`Testing ${modelName}... `);
      try {
        const testModel = genAI.getGenerativeModel({ model: modelName });
        await testModel.generateContent("Hi");
        console.log("✅ AVAILABLE!");
        console.log(`\n🎉 VICTORY! Update your aiController.js to use: "${modelName}"`);
        return; // Stop after finding the first working one
      } catch (e) {
        if (e.message.includes("404")) {
           console.log("❌ Not Found");
        } else {
           console.log("❌ Error: " + e.message);
        }
      }
    }
    
    console.log("\n🔴 FATAL: No models worked. This usually means the API Service is not enabled in Google Cloud.");

  } catch (error) {
    console.error("Connection Error:", error);
  }
}

checkModels();