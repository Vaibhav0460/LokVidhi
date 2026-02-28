"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertTriangle } from 'lucide-react';
// NEW: Import react-markdown
import ReactMarkdown from 'react-markdown';

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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput('');

    const userMsg: Message = { id: Date.now(), role: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // PRO TIP: Change 'localhost' to an environment variable for deployment
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/chatbot/query`, {
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
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6 w-full">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mx-2 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-green-600'}`}>
                  {msg.role === 'user' ? <User className="text-white w-5 h-5" /> : <Bot className="text-white w-5 h-5" />}
                </div>

                <div className={`p-4 rounded-2xl shadow-sm text-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                }`}>
                  {/* NEW: Updated to use ReactMarkdown with custom styles */}
                  <div className="markdown-container">
                    <ReactMarkdown
                      components={{
                        // Custom styling for headers and lists
                        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                        strong: ({ children }) => <strong className="font-bold text-inherit">{children}</strong>,
                        ul: ({ children }) => <ul className="list-disc ml-5 mb-2 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal ml-5 mb-2 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="pl-1">{children}</li>,
                        hr: () => <hr className="my-4 border-gray-200 opacity-30" />,
                        // Style for legal disclaimers at the bottom
                        em: ({ children }) => <em className="italic opacity-80 text-xs block mt-2">{children}</em>,
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                  
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="text-[10px] font-bold mb-2 opacity-60 uppercase tracking-widest flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        Legal Sources:
                      </div>
                      <ul className="flex flex-wrap gap-2">
                        {msg.sources.map((source, idx) => (
                          <li key={idx}>
                            <a 
                              href={source.uri} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className={`inline-block px-2 py-1 rounded border text-[10px] transition-colors ${
                                msg.role === 'user'
                                ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                                : 'bg-gray-50 border-gray-200 text-blue-600 hover:bg-blue-50'
                              }`}
                            >
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
          
          {loading && (
            <div className="flex justify-start">
               <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-600 flex items-center justify-center mx-2">
                  <Bot className="text-white w-5 h-5" />
               </div>
               <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm">
                 <div className="flex space-x-1.5">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100"></div>
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></div>
                 </div>
               </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a legal question..."
              disabled={loading}
              className="w-full py-4 pl-6 pr-14 bg-gray-50 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all border border-gray-200"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="absolute right-3 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="flex justify-center items-center mt-3 gap-1.5 text-[10px] text-gray-400 font-medium">
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            <span className="uppercase tracking-tight">AI can misinterpret laws. Consult a verified legal professional.</span>
          </div>
        </div>
      </div>
    </main>
  );
}