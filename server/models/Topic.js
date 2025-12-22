import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  type: { type: String, enum: ['mcq', 'short', 'long'] },
  question: String,
  options: [String], 
  answer: String     
});

const TopicSchema = new mongoose.Schema({
  title: String,
  explanation: String, 
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Topic', TopicSchema);