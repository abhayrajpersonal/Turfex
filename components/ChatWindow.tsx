
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, MoreVertical } from 'lucide-react';
import { ChatRoom, ChatMessage, UserProfile } from '../lib/types';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  chats: ChatRoom[];
  user: UserProfile;
}

const QUICK_REPLIES = [
  "I'm here! 👋", 
  "Running 5 mins late ⏰", 
  "Where do we park? 🚗", 
  "Good game! 🤝", 
  "What's the jersey color? 👕"
];

const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose, chats, user }) => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const selectedChat = chats.find(c => c.id === selectedChatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat, selectedChatId]);

  const handleSend = () => {
    if (!message.trim()) return;
    // In a real app, this would dispatch to backend
    // For visual feedback, we'll just clear input
    setMessage('');
  };

  const handleQuickReply = (text: string) => {
    setMessage(text);
  };

  return (
    // Fixed: z-index 60 to sit above nav/header but below notification/modals
    // Fixed: width constraint for mobile view (90vw instead of fixed 96)
    // Fixed: bottom positioning for mobile to avoid overlap
    <div className="fixed bottom-24 md:bottom-20 right-4 w-[90vw] md:w-96 bg-white/95 dark:bg-darkcard/95 backdrop-blur-xl border border-white/20 dark:border-gray-700 shadow-2xl rounded-3xl z-[60] flex flex-col overflow-hidden animate-scale-in h-[550px] max-h-[70vh] md:max-h-[600px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center shadow-md z-10">
        <h3 className="font-bold flex items-center gap-3">
          {selectedChatId && <button onClick={() => setSelectedChatId(null)} className="p-1 hover:bg-white/20 rounded-full transition-colors">←</button>}
          {selectedChat ? (
              <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs">
                    {selectedChat.avatar_url ? <img src={selectedChat.avatar_url} className="w-full h-full rounded-full"/> : selectedChat.name[0]}
                  </div>
                  <span>{selectedChat.name}</span>
              </div>
          ) : 'Messages'}
        </h3>
        <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-white/20 rounded-full"><MoreVertical size={18} /></button>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full"><X size={18} /></button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-darkbg/50">
        {!selectedChatId ? (
          // Chat List
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {chats.map(chat => (
              <div 
                key={chat.id} 
                onClick={() => setSelectedChatId(chat.id)}
                className="p-4 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 cursor-pointer flex items-center gap-4 transition-colors"
              >
                <div className="relative">
                    <img src={chat.avatar_url} className="w-12 h-12 rounded-full bg-gray-200 border-2 border-white dark:border-darkcard" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-darkcard"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-sm text-midnight dark:text-white truncate">{chat.name}</h4>
                      <span className="text-[10px] text-gray-400">12:30 PM</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-medium">{chat.last_message}</p>
                </div>
              </div>
            ))}
            {chats.length === 0 && <p className="text-center p-8 text-gray-400 text-sm">No chats yet.</p>}
          </div>
        ) : (
          // Message View
          <div className="flex flex-col h-full">
             <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                <div className="text-center text-[10px] text-gray-400 uppercase tracking-widest font-bold my-4">Today</div>
                {selectedChat?.messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.sender_id === user.id ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-700 text-midnight dark:text-white rounded-bl-none border border-gray-100 dark:border-gray-600'}`}>
                       {msg.text}
                    </div>
                  </div>
                ))}
                {selectedChat?.messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                        <MessageCircle size={32} className="opacity-20"/>
                        <p className="text-xs">Start the conversation!</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
             </div>
             
             {/* Quick Replies */}
             <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
                {QUICK_REPLIES.map((reply, i) => (
                   <button 
                     key={i}
                     onClick={() => handleQuickReply(reply)}
                     className="whitespace-nowrap bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-700 transition-colors"
                   >
                     {reply}
                   </button>
                ))}
             </div>

             {/* Input Area */}
             <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-white/80 dark:bg-darkcard/80 backdrop-blur-md flex gap-2">
                <input 
                  className="flex-1 bg-gray-100 dark:bg-gray-800 border-none rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white transition-all"
                  placeholder="Type a message..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend} className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 hover:scale-105 transition-all shadow-lg shadow-blue-500/30"><Send size={18} /></button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
