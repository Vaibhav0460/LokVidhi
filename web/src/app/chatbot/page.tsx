"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertTriangle } from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
  sources?: { title: string; uri: string }[];
}

export default function ChatbotPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'bot',
      text: "Namaste! I am LokVidhi. How can I help you with Indian Law today? (e.g., 'How do I file an RTI?' or 'What are my rights if arrested?')"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput('');

    // Add user message
    const userMsg: Message = { id: Date.now(), role: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/api/chatbot/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();

      if (res.ok) {
        const botMsg: Message = { 
          id: Date.now() + 1, 
          role: 'bot', 
          text: data.reply,
          sources: data.sources
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error(data.error || "Server error");
      }
    } catch (err) {
      const errorMsg: Message = { 
        id: Date.now() + 1, 
        role: 'bot', 
        text: "I'm having trouble connecting to the legal database right now. Please try again later." 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 w-full flex flex-col bg-gray-50 overflow-hidden">
      
      {/* Chat Container - Scrollbar stays on the edge */}
      <div className="flex-1 overflow-y-auto p-4">
        
        {/* Content Wrapper - Centers the messages */}
        <div className="max-w-4xl mx-auto space-y-6 w-full"> {/* Added w-full to ensure full usage of max-width */}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mx-2 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-green-600'}`}>
                  {msg.role === 'user' ? <User className="text-white w-5 h-5" /> : <Bot className="text-white w-5 h-5" />}
                </div>

                {/* Bubble */}
                <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  
                  {/* Sources Section */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200/20">
                      <p className="text-xs font-semibold mb-1 opacity-80 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                        Sources:
                      </p>
                      <ul className="space-y-1">
                        {msg.sources.map((source, idx) => (
                          <li key={idx}>
                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs underline opacity-90 hover:opacity-100 truncate block">
                              {source.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
          
          {/* Loading State */}
          {loading && (
            <div className="flex justify-start">
               <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-600 flex items-center justify-center mx-2">
                  <Bot className="text-white w-5 h-5" />
               </div>
               <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm">
                 <div className="flex space-x-1.5">
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                 </div>
               </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a legal question..."
              disabled={loading}
              className="w-full py-3 pl-5 pr-12 bg-gray-100 text-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all border-transparent focus:border-blue-500"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex justify-center items-center mt-3 gap-1.5 text-xs text-gray-400">
            <AlertTriangle className="w-3 h-3" />
            <span>Bot can make mistakes. Not a substitute for a lawyer.</span>
          </div>
        </div>
      </div>
    </main>
  );
}