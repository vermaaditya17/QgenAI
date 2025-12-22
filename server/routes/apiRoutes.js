import express from 'express';
import multer from 'multer';

// 👇 ADDED deleteTopic to imports
import { generateSyllabus, getHistory, deleteTopic } from '../controllers/aiController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Routes
router.post('/generate', upload.single('file'), generateSyllabus);
router.get('/history', getHistory);

// 👇 ADDED THIS NEW ROUTE
router.delete('/history/:id', deleteTopic);

export default router;