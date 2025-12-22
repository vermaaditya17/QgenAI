import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PlusCircle, MessageSquare, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_URL from '../api'; // Import the dynamic URL helper

const Sidebar = ({ onSelect }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/history`);
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this lesson?")) return;
    try {
      await axios.delete(`${API_URL}/api/history/${id}`);
      setHistory(history.filter(item => item._id !== id));
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  return (
    <motion.div initial={{ x: -250 }} animate={{ x: 0 }} className="flex flex-col h-full p-4 bg-black/40 backdrop-blur-xl border-r border-white/10 w-64 flex-shrink-0">
      <div className="flex items-center gap-2 mb-8 px-2">
        <h1 className="text-xl font-bold text-white">QgenAi</h1>
      </div>
      <button onClick={() => onSelect(null)} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm text-white mb-6">
        <PlusCircle size={18} className="text-green-400" /> <span className="font-medium">New Lesson</span>
      </button>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
        {loading ? <div className="flex justify-center p-4"><Loader2 className="animate-spin text-gray-500"/></div> : 
          <AnimatePresence>
            {history.map((item) => (
              <motion.div key={item._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }} className="relative group">
                <button onClick={() => onSelect(item)} className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-gray-300 hover:bg-white/10 text-left pr-8 truncate">
                  <MessageSquare size={16} className="text-gray-500" /> <span className="truncate">{item.title}</span>
                </button>
                <button onClick={(e) => handleDelete(e, item._id)} className="absolute right-2 top-2 p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        }
      </div>
    </motion.div>
  );
};
export default Sidebar;