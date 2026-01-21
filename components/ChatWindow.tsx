
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot } from 'lucide-react';
import { UserProfile } from '../lib/types';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

interface Message {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  "Explain Offside Rule ⚽",
  "Badminton Service Faults 🏸",
  "Pickleball Kitchen Rule 🥒",
  "LBW Explained 🏏",
  "Solve a Score Dispute ⚖️"
];

const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose, user }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'intro',
      sender: 'coach',
      text: `Hi ${user.full_name.split(' ')[0]}! I'm your Virtual Coach. Need a rule clarification or help with a dispute?`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (text: string = inputText) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // Use the internal API route to protect the key
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `User Question: ${text}`,
          context: "The user is asking a question about sports rules or needs a dispute resolved. Sport might be Football, Cricket, Badminton, Pickleball, or Tennis.",
          systemInstruction: "You are the Turfex Virtual Coach. Your role is to assist amateur sports players on the field. \n1. Provide clear, extremely concise explanations of rules (under 3 sentences if possible).\n2. Act as a neutral arbitrator for disputes.\n3. Be encouraging.\n4. Do not provide medical advice.\n5. Keep formatting simple for mobile reading."
        })
      });

      let aiText;
      if (res.ok) {
          const data = await res.json();
          aiText = data.text;
      } else {
          // Robust Fallback if API fails (e.g., 404 in static build or 500)
          console.warn("AI API unreachable, using fallback");
          aiText = "I'm having trouble connecting to the rulebook server. But generally, the referee's decision is final! 😅";
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'coach',
        text: aiText || "Could not generate response.",
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'coach',
        text: "My connection is weak. Please check your internet or try again later.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 md:bottom-20 right-4 w-[90vw] md:w-96 bg-black border border-zinc-800 shadow-2xl rounded-3xl z-[60] flex flex-col overflow-hidden animate-scale-in h-[600px] max-h-[75vh]">
      
      {/* Header - Strictly Black with Volt Accent */}
      <div className="bg-black p-4 text-white flex justify-between items-center shadow-md z-10 border-b border-volt/30">
        <div className="flex items-center gap-3">
          <div className="bg-volt text-black p-2 rounded-xl shadow-[0_0_15px_rgba(223,255,0,0.3)]">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg leading-none italic uppercase tracking-wider">Virtual Coach</h3>
            <p className="text-[10px] text-zinc-400 flex items-center gap-1 mt-1 font-mono">
              <span className="w-1.5 h-1.5 bg-volt rounded-full animate-pulse"></span> ONLINE
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-400 hover:text-white"><X size={20} /></button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950/50 relative">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} relative z-10`}>
            <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-md leading-relaxed ${
              msg.sender === 'user' 
                ? 'bg-volt text-black font-bold rounded-br-none' 
                : 'bg-zinc-800 text-white rounded-bl-none border border-zinc-700'
            }`}>
              {msg.text}
              <p className={`text-[9px] mt-1.5 text-right font-mono ${msg.sender === 'user' ? 'text-black/60' : 'text-zinc-500'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start relative z-10">
            <div className="bg-zinc-800 p-4 rounded-2xl rounded-bl-none shadow-sm border border-zinc-700 flex gap-1">
              <span className="w-2 h-2 bg-volt rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-volt rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
              <span className="w-2 h-2 bg-volt rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {messages.length < 4 && (
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide bg-black/50 backdrop-blur-sm pt-2">
          {SUGGESTIONS.map((s, i) => (
            <button 
              key={i}
              onClick={() => handleSend(s)}
              className="whitespace-nowrap bg-zinc-900 text-zinc-300 border border-zinc-800 px-3 py-2 rounded-lg text-[10px] font-bold hover:border-volt hover:text-volt transition-colors uppercase tracking-wide"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 border-t border-zinc-800 bg-black flex gap-2">
        <input 
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-volt outline-none text-white transition-all placeholder-zinc-600 font-medium"
          placeholder="Ask about rules..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={() => handleSend()} 
          disabled={!inputText.trim() || isTyping}
          className="p-3 bg-volt text-black rounded-xl hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
