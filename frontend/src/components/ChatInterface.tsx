import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { Send, Loader2, Sparkles } from 'lucide-react';
import MessageBubble from './chat/MessageBubble';
import ToolExecutionIndicator from './chat/ToolExecutionIndicator';
import QuickActions from './chat/QuickActions';

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const { messages, isStreaming, sendMessage } = useChat();
  const { user } = useAuth();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;
    const message = input;
    setInput('');
    await sendMessage(message);
  };

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-5xl mx-auto p-4 md:p-8">
      <div className="flex-grow overflow-y-auto space-y-4 pr-4 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-16 h-16 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-500 mb-4">
                <Sparkles size={32} />
             </div>
             <h3 className="text-2xl font-bold text-white">How can I assist you, {user?.name?.split(' ')[0]}?</h3>
             <p className="text-zinc-500 max-w-sm">Ask about your courses, attendance records, or get help with academic concepts.</p>
             <QuickActions userRole={user?.role || 'student'} onAction={handleQuickAction} />
          </div>
        )}
        
        {messages.length > 0 && (
          <QuickActions userRole={user?.role || 'student'} onAction={handleQuickAction} />
        )}
        
        {isStreaming && (
          <ToolExecutionIndicator toolName="processing" message="Sakhi is thinking..." />
        )}
        
        {messages.map((m, i) => (
          <MessageBubble
            key={i}
            role={m.role as any}
            content={m.content}
            toolData={m.toolData}
            toolName={m.toolData?.tool_name}
            timestamp={new Date().toLocaleTimeString()}
          />
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
            disabled={isStreaming}
          />
          <button 
            onClick={handleSend} 
            disabled={isStreaming || !input.trim()}
            className="w-12 h-12 bg-blue-600 hover:bg-blue-50 hover:text-black rounded-2xl flex items-center justify-center transition-all disabled:opacity-20 disabled:grayscale group"
          >
            {isStreaming ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
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
