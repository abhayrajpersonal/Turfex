
import React, { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-24 md:bottom-10 left-1/2 transform -translate-x-1/2 bg-midnight dark:bg-white text-white dark:text-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-[110] animate-fade-in-up border border-white/10 dark:border-gray-200 backdrop-blur-md">
      {type === 'success' ? <CheckCircle className="text-lime dark:text-green-600" size={20} /> : <XCircle className="text-red-500" size={20} />}
      <span className="font-bold text-sm">{message}</span>
    </div>
  );
};

export default Toast;
