import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { chatWithGymBuddy } from '../services/geminiService';

export const ChatBuddy: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: "Hey! I'm your Gym Buddy. Ready to crush some goals?", timestamp: Date.now() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await chatWithGymBuddy(userMsg.text, history);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText || "Sorry, I didn't catch that.",
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 pb-24">
       <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-full flex items-center justify-center mb-2 shadow-lg border border-white/10">
             <i className="fa-solid fa-robot text-2xl text-zinc-300"></i>
          </div>
          <h2 className="text-white font-semibold">Gym Buddy</h2>
          <span className="text-xs text-zinc-500">iMessage • Today</span>
       </div>

      <div className="flex-1 glass-panel rounded-[2rem] border border-white/10 overflow-hidden flex flex-col shadow-2xl max-w-4xl mx-auto w-full">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/20">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[75%] px-5 py-2.5 rounded-2xl text-[15px] leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-apple-blue text-white rounded-br-none' 
                    : 'bg-zinc-800 text-zinc-100 rounded-bl-none border border-white/5'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex justify-start">
               <div className="bg-zinc-800 text-zinc-400 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-1 border border-white/5">
                 <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                 <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                 <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-zinc-900/80 backdrop-blur-md border-t border-white/10 flex gap-3 items-center">
          <div className="flex-1 relative">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Message"
              className="w-full bg-black/50 text-white rounded-full pl-5 pr-10 py-2.5 focus:outline-none border border-zinc-700 focus:border-zinc-500 transition-colors placeholder-zinc-600"
            />
            <button 
               onClick={handleSend}
               disabled={!input.trim() || isTyping}
               className={`absolute right-1 top-1 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  input.trim() ? 'bg-apple-blue text-white' : 'bg-zinc-700 text-zinc-500'
               }`}
            >
              <i className="fa-solid fa-arrow-up text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};