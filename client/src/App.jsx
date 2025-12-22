import React, { useState } from 'react';
import ChatBox from './components/ChatBox';
import Sidebar from './components/Sidebar';

function App() {
  const [currentTopic, setCurrentTopic] = useState(null);

  return (
    <div className="flex h-screen bg-[#343541]">
      {/* Sidebar for History */}
      <div className="w-64 hidden md:block bg-[#202123] border-r border-gray-700">
        <Sidebar onSelect={setCurrentTopic} />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col items-center relative">
        <ChatBox data={currentTopic} onGenerate={setCurrentTopic} />
      </div>
    </div>
  );
}

export default App;