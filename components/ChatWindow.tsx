
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, Sparkles, User } from 'lucide-react';
import { UserProfile } from '../lib/types';
import { GoogleGenAI } from "@google/genai";

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

  // Initialize Gemini Client
  // NOTE: In a real production app, API calls should go through a backend proxy to secure the key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (text: string = inputText) => {
    if (!text.trim()) return;

    // 1. Add User Message
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
      // 2. Call Gemini API
      // Using 'gemini-2.0-flash-lite-preview-02-05' for low latency response
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-lite-preview-02-05',
        contents: [
          {
            role: 'user',
            parts: [
              { text: `Context: The user is asking a question about sports rules or needs a dispute resolved. Sport might be Football, Cricket, Badminton, Pickleball, or Tennis.\n\nUser Question: ${text}` }
            ]
          }
        ],
        config: {
          systemInstruction: "You are the Turfex Virtual Coach. Your role is to assist amateur sports players on the field. \n1. Provide clear, extremely concise explanations of rules (under 3 sentences if possible).\n2. Act as a neutral arbitrator for disputes.\n3. Be encouraging.\n4. Do not provide medical advice.\n5. Keep formatting simple for mobile reading.",
          temperature: 0.3,
        }
      });

      const aiText = response.text || "I'm having trouble checking the rulebook right now. Please try again.";

      // 3. Add AI Response
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'coach',
        text: aiText,
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error("AI Error:", error);
      let errorMessage = "⚠️ Connection interference. I couldn't reach the server. Please try again.";
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'coach',
        text: errorMessage,
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 md:bottom-20 right-4 w-[90vw] md:w-96 bg-white/95 dark:bg-darkcard/95 backdrop-blur-xl border border-white/20 dark:border-gray-700 shadow-2xl rounded-3xl z-[60] flex flex-col overflow-hidden animate-scale-in h-[600px] max-h-[75vh]">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-none">Virtual Coach</h3>
            <p className="text-[10px] text-white/80 flex items-center gap-1 mt-1">
              <Sparkles size={10} /> AI-Powered • Always Online
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors"><X size={20} /></button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-darkbg/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm leading-relaxed ${
              msg.sender === 'user' 
                ? 'bg-electric text-white rounded-br-none' 
                : 'bg-white dark:bg-gray-700 text-midnight dark:text-white rounded-bl-none border border-gray-100 dark:border-gray-600'
            }`}>
              {msg.text}
              <p className={`text-[9px] mt-1.5 text-right opacity-60 ${msg.sender === 'user' ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-600 flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions (Only if chat is short) */}
      {messages.length < 4 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {SUGGESTIONS.map((s, i) => (
            <button 
              key={i}
              onClick={() => handleSend(s)}
              className="whitespace-nowrap bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-white/90 dark:bg-darkcard/90 backdrop-blur-md flex gap-2">
        <input 
          className="flex-1 bg-gray-100 dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none dark:text-white transition-all placeholder-gray-400 font-medium"
          placeholder="Ask about rules, fouls, scoring..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={() => handleSend()} 
          disabled={!inputText.trim() || isTyping}
          className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
