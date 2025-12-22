import { GoogleGenerativeAI } from "@google/generative-ai";
import Topic from '../models/Topic.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// 1. GENERATE
export const generateSyllabus = async (req, res) => {
  try {
    const { topicName } = req.body;
    const file = req.file;

    if (!topicName && !file) {
      return res.status(400).json({ error: "Please provide a topic OR upload a file." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let parts = [];
    const instruction = `
      You are an educational AI. Generate a lesson or exam.
      Return ONLY valid JSON (no markdown). Structure:
      {
        "title": "Topic Title",
        "explanation": "Detailed explanation...",
        "questions": [
           { "type": "mcq", "question": "...", "options": ["A","B","C","D"], "answer": "Option" },
           { "type": "short", "question": "...", "answer": "Answer" }
        ]
      }
    `;
    parts.push({ text: instruction });

    // PDF Handling
    if (file && file.mimetype === 'application/pdf') {
      try {
        const pdfParse = require('pdf-parse');
        if (typeof pdfParse !== 'function') throw new Error("pdf-parse library error.");
        const pdfData = await pdfParse(file.buffer);
        const pdfText = pdfData.text.substring(0, 30000); 
        parts.push({ text: `Document content:\n${pdfText}` });
        parts.push({ text: `Task: ${topicName || "Summarize"}` });
      } catch (err) {
        return res.status(500).json({ error: "PDF Error", details: err.message });
      }
    } 
    // Image Handling
    else if (file && file.mimetype.startsWith('image/')) {
      parts.push({
        inlineData: {
          data: file.buffer.toString('base64'),
          mimeType: file.mimetype,
        },
      });
      parts.push({ text: `Analyze image and: ${topicName || "Explain content"}` });
    } 
    // Text Handling
    else {
      parts.push({ text: `Task: "${topicName}"` });
    }

    const result = await model.generateContent({ contents: [{ role: "user", parts }] });
    const response = await result.response;
    let text = response.text(); 
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let aiData;
    try {
        aiData = JSON.parse(text);
    } catch (e) {
        return res.status(500).json({ error: "AI returned invalid JSON." });
    }

    const newTopic = await Topic.create(aiData);
    res.status(201).json(newTopic);

  } catch (error) {
    console.error("Global Error:", error);
    res.status(500).json({ error: "Generation Failed", details: error.message });
  }
};

// 2. GET HISTORY
export const getHistory = async (req, res) => {
  try {
    const history = await Topic.find().sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

// 3. DELETE TOPIC
export const deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;
    await Topic.findByIdAndDelete(id);
    res.status(200).json({ message: "Topic deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete topic" });
  }
};