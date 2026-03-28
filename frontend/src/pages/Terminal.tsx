import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Sparkles, Loader2, User, Globe, Shield } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const Terminal = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Neural connection established. I am Sakhi, your academic intelligence node. How may I assist you today?', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user, token } = useAuth();

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { 
      role: 'user', 
      content: input, 
      timestamp: new Date().toLocaleTimeString() 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const resp = await fetch(`${API_BASE}/api/chat/ask`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ message: input, history: messages.slice(-5) })
      });

      if (!resp.ok) throw new Error('API Sync Failed');

      const data = await resp.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response || 'I am processing your request through the Aacharya nodes.', 
        timestamp: new Date().toLocaleTimeString() 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Error: Connection to Aacharya Core timed out. Please verify your node status.', 
        timestamp: new Date().toLocaleTimeString() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden text-white font-sans selection:bg-blue-500/30">
      <Sidebar />

      <main className="flex-grow flex flex-col relative overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 neural-grid pointer-events-none opacity-40"></div>
        
        {/* Terminal Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 relative z-10 backdrop-blur-md bg-black/20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Node: Localhost-8000</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-600/10 border border-green-500/20">
              <Globe className="w-3 h-3 text-green-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-green-400">JNWN Sync Active</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Authenticated as</p>
              <p className="text-sm font-bold tracking-tight">{user?.name || 'Anonymous User'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden">
               {user?.photo_url ? <img src={user.photo_url} alt="User" /> : <User size={20} className="text-white/50" />}
            </div>
          </div>
        </header>

        {/* Chat Feed */}
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto px-6 sm:px-10 py-10 space-y-8 relative z-10 custom-scrollbar"
        >
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                  msg.role === 'assistant' 
                    ? 'bg-blue-600/10 border border-blue-500/30 text-blue-500' 
                    : 'bg-zinc-800/50 border border-white/10 text-zinc-400'
                }`}>
                  {msg.role === 'assistant' ? <Bot size={24} /> : <User size={24} />}
                </div>

                <div className={`max-w-[85%] sm:max-w-2xl group relative`}>
                  <div className={`
                    p-6 rounded-3xl backdrop-blur-md transition-all duration-300
                    ${msg.role === 'assistant' 
                      ? 'bg-zinc-900/40 border border-white/5 shadow-[0_0_20px_rgba(0,0,0,0.4)] group-hover:border-blue-500/30' 
                      : 'bg-blue-600 shadow-[0_10px_30px_rgba(37,99,235,0.2)] text-white'}
                  `}>
                    {msg.role === 'assistant' && (
                      <div className="absolute -top-3 left-6 flex items-center gap-2">
                         <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/20 backdrop-blur-xl">
                            <Sparkles size={10} className="text-blue-400" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-blue-300">Sakhi Neural Response</span>
                         </div>
                      </div>
                    )}
                    <p className="text-[15px] leading-relaxed font-medium whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 mt-3 block ${msg.role === 'user' ? 'text-right' : ''}`}>
                    {msg.timestamp} // Node Verified
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               className="flex gap-4 items-center pl-18"
            >
               <div className="flex gap-1.5">
                 {[0, 1, 2].map(i => (
                   <motion.div
                     key={i}
                     animate={{ y: [0, -5, 0] }}
                     transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                     className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,1)]"
                   />
                 ))}
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-blue-500/70 italic">Processing Prompts...</span>
            </motion.div>
          )}
        </div>

        {/* Input Bar Section */}
        <section className="p-8 sm:p-12 relative z-20">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
            <div className="relative glass-panel rounded-[40px] p-2 pr-4 flex items-center gap-4 border border-white/5 shadow-2xl focus-within:border-blue-500/30 transition-all focus-within:scale-[1.01]">
              <div className="pl-6 text-zinc-600">
                <Shield size={20} className="group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Synchronize with Sakhi AI nodes..."
                className="flex-grow bg-transparent py-6 text-lg font-bold text-white outline-none placeholder:text-zinc-700 placeholder:italic"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="w-14 h-14 bg-blue-600 rounded-3xl flex items-center justify-center shadow-[0_10px_20px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 transition-all text-white disabled:opacity-30 disabled:grayscale group/send overflow-hidden"
              >
                {isLoading ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <div className="relative">
                    <Send size={24} className="relative z-10 group-hover/send:translate-x-1 group-hover/send:-translate-y-1 transition-transform" />
                    <div className="absolute inset-0 bg-white/20 blur-lg rounded-full animate-pulse"></div>
                  </div>
                )}
              </button>
            </div>
            <div className="mt-4 flex justify-between items-center px-6">
              <div className="flex gap-4">
                 <button className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Clear History</button>
                 <button className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Privacy Shield: ON</button>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">Powered by Ollama x JNWN Engine</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Terminal;
