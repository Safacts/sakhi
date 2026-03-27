import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, Bot, User as UserIcon, Loader2, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  model?: string;
}

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8005';

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/chat/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input, 
          history: messages.slice(-10),
          token: token 
        })
      });

      if (!response.body) throw new Error('No response body');
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage: Message = { role: 'assistant', content: '' };
      
      setMessages(prev => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            if (data.type === 'info') {
              assistantMessage.model = data.model;
            } else if (data.type === 'content') {
              assistantMessage.content += data.text;
            }
            
            setMessages(prev => {
              const last = [...prev];
              last[last.length - 1] = { ...assistantMessage };
              return last;
            });
          } catch (err) {
            console.error('Failed to parse chunk:', line);
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'I encountered an error connecting to my neural core. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-5xl mx-auto p-4 md:p-8">
      <div className="flex-grow overflow-y-auto space-y-6 pr-4 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-16 h-16 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-500 mb-4">
                <Sparkles size={32} />
             </div>
             <h3 className="text-2xl font-bold text-white">How can I assist you, {user?.name?.split(' ')[0]}?</h3>
             <p className="text-zinc-500 max-w-sm">Ask about your courses, attendance records, or get help with academic concepts.</p>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              m.role === 'assistant' 
                ? 'bg-blue-600/20 text-blue-500 border border-blue-500/20' 
                : 'bg-zinc-800 text-zinc-400 border border-white/5'
            }`}>
              {m.role === 'assistant' ? <Bot size={20} /> : <UserIcon size={20} />}
            </div>
            
            <div className={`max-w-[80%] rounded-3xl p-5 ${
              m.role === 'assistant' 
                ? 'bg-zinc-900/50 backdrop-blur-md border border-white/5 text-zinc-100' 
                : 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
            }`}>
              {m.role === 'assistant' && m.model && (
                <div className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2 opacity-80">
                  {m.model}
                </div>
              )}
              <div className="text-[15px] leading-relaxed whitespace-pre-wrap">{m.content}</div>
              {m.role === 'assistant' && !m.content && (
                <div className="flex gap-1.5 py-4">
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-8 relative">
        <div className="glass-panel p-2 rounded-[32px] flex items-center gap-2 shadow-2xl">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Sakhi about your academics..."
            className="flex-grow bg-transparent px-6 py-4 text-white outline-none placeholder:text-zinc-600 font-medium"
            disabled={loading}
          />
          <button 
            onClick={handleSend} 
            disabled={loading || !input.trim()}
            className="w-12 h-12 bg-blue-600 hover:bg-blue-50 hover:text-black rounded-2xl flex items-center justify-center transition-all disabled:opacity-20 disabled:grayscale group"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
          </button>
        </div>
        <p className="text-[10px] text-center mt-3 text-zinc-600 font-bold uppercase tracking-widest">
          Agentic RAG Core // Connected to Aacharya Data Nodes
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
