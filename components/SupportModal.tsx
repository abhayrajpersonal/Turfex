
import React from 'react';
import { X, Mail, MessageSquare, Phone } from 'lucide-react';

interface SupportModalProps {
  onClose: () => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-darkcard rounded-2xl w-full max-w-md p-6 relative animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white"><X size={20}/></button>
        
        <h3 className="text-xl font-bold text-midnight dark:text-white mb-2">Help & Support</h3>
        <p className="text-gray-500 text-sm mb-6">How can we assist you today?</p>

        <div className="space-y-4">
            <button className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full"><MessageSquare size={20}/></div>
                <div className="text-left">
                    <h4 className="font-bold text-midnight dark:text-white">Live Chat</h4>
                    <p className="text-xs text-gray-500">Connect with an agent instantly.</p>
                </div>
            </button>
            
            <button className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="bg-green-100 text-green-600 p-3 rounded-full"><Phone size={20}/></div>
                <div className="text-left">
                    <h4 className="font-bold text-midnight dark:text-white">Call Us</h4>
                    <p className="text-xs text-gray-500">+91 99999 88888 (9 AM - 9 PM)</p>
                </div>
            </button>

            <button className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="bg-orange-100 text-orange-600 p-3 rounded-full"><Mail size={20}/></div>
                <div className="text-left">
                    <h4 className="font-bold text-midnight dark:text-white">Email Support</h4>
                    <p className="text-xs text-gray-500">support@turfex.app</p>
                </div>
            </button>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
