import React, { useState, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';
import { Send, Loader2, Paperclip, X, FileText, Image as ImageIcon, Sparkles, BookOpen, FileQuestion } from 'lucide-react';
import API_URL from '../api'; // Import dynamic URL helper

const ChatBox = ({ data, onGenerate }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedFile) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('topicName', input);
      if (selectedFile) formData.append('file', selectedFile);
      const res = await axios.post(`${API_URL}/api/generate`, formData);
      onGenerate(res.data);
      setInput(''); setSelectedFile(null); if(fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) { alert("Error connecting to server."); } finally { setLoading(false); }
  };

  const handleExamRequest = async () => {
    if (!data) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('topicName', `Create a difficult exam paper for: "${data.title}". No explanations.`);
      const res = await axios.post(`${API_URL}/api/generate`, formData);
      onGenerate(res.data);
    } catch (err) { alert("Error generating exam."); } finally { setLoading(false); }
  };

  return (
    <div className="w-full max-w-5xl h-full flex flex-col p-4 relative mx-auto">
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-40 px-4">
        {!data && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 mt-10 opacity-70">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl"><Sparkles size={40} className="text-white"/></div>
            <h1 className="text-4xl font-bold text-white">QgenAi</h1>
            <p className="text-gray-400">Upload a PDF or type a topic.</p>
          </div>
        )}
        {loading && <div className="flex flex-col items-center justify-center h-[60vh] space-y-4"><Loader2 className="w-12 h-12 animate-spin text-green-500"/><p className="text-green-400 animate-pulse">Generating...</p></div>}
        
        {data && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="bg-[#1e1e24]/80 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3"><BookOpen className="text-blue-400"/><h2 className="text-3xl font-bold text-white">{data.title}</h2></div>
                <button onClick={handleExamRequest} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/50 px-4 py-2 rounded-lg text-sm font-bold"><FileQuestion size={18}/> Get Exam</button>
              </div>
              <div className="prose prose-invert max-w-none text-gray-200"><Markdown>{data.explanation}</Markdown></div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Questions</h3>
              {data.questions && data.questions.map((q, i) => (
                <div key={i} className="bg-[#25252d] p-6 rounded-xl border border-white/5 shadow-lg">
                  <p className="text-white font-medium mb-3">{q.question}</p>
                  {q.options && <div className="grid grid-cols-2 gap-2 mb-3">{q.options.map((opt, k) => <div key={k} className="p-2 bg-black/20 rounded text-gray-300 text-sm">{opt}</div>)}</div>}
                  <details className="mt-2"><summary className="cursor-pointer text-sm text-gray-500 hover:text-green-400">Answer</summary><div className="mt-2 text-green-400 font-bold">{q.answer}</div></details>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <div className="absolute bottom-8 left-0 right-0 px-4 flex justify-center z-20">
        <div className="relative w-full max-w-3xl">
          {selectedFile && <div className="absolute -top-12 left-0 bg-[#2a2b32] border border-green-500/30 text-white px-4 py-2 rounded-lg flex items-center gap-3 shadow-lg">{selectedFile.type.includes('pdf')?<FileText size={16} className="text-red-400"/>:<ImageIcon size={16} className="text-blue-400"/>}<span className="text-sm max-w-[200px] truncate">{selectedFile.name}</span><button onClick={()=>{setSelectedFile(null);fileInputRef.current.value=""}}><X size={16}/></button></div>}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          <div className="relative flex items-center">
            <button onClick={()=>fileInputRef.current.click()} className="absolute left-4 p-2 text-gray-400 hover:text-white rounded-full transition z-10"><Paperclip size={22}/></button>
            <input className="w-full bg-[#2a2b32]/90 backdrop-blur-xl text-white py-5 pl-16 pr-16 rounded-2xl shadow-2xl focus:outline-none focus:ring-1 focus:ring-green-500/50 border border-white/10 text-lg placeholder-gray-500" placeholder={selectedFile ? "Instructions..." : "Type topic..."} value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>e.key==='Enter' && handleSend()}/>
            <button onClick={handleSend} disabled={loading} className="absolute right-3 p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:shadow-lg transition">{loading?<Loader2 size={20} className="animate-spin text-white"/>:<Send size={20} className="text-white"/>}</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatBox;