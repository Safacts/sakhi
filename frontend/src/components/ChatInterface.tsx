import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  model?: string;
}

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message: input, 
          history: messages.slice(-5),
          token: token // This enables RAG in the backend
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
          const data = JSON.parse(line);
          
          if (data.type === 'info') {
            assistantMessage.model = data.model;
          } else if (data.type === 'content') {
            assistantMessage.content += data.text;
          }
          
          setMessages(prev => {
            const last = prev[prev.length - 1];
            return [...prev.slice(0, -1), { ...last, ...assistantMessage }];
          });
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-interface">
      <div className="messages-list h-96 overflow-y-auto p-4 bg-gray-900 rounded-lg">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role} mb-4`}>
             <div className="text-xs text-gray-400 mb-1">
                {m.role === 'assistant' ? `Sakhi (${m.model || 'Thinking...'})` : 'You'}
             </div>
             <div className={`p-2 rounded-lg ${m.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                {m.content}
             </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="input-area mt-4 flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Sakhi anything..."
          className="flex-1 p-2 bg-gray-800 rounded border border-gray-700 outline-none"
        />
        <button onClick={handleSend} disabled={loading} className="px-4 py-2 bg-blue-500 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
