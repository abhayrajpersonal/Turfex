
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
    <div className="fixed bottom-20 md:bottom-10 left-1/2 transform -translate-x-1/2 bg-midnight text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 z-50 animate-fade-in-up">
      {type === 'success' ? <CheckCircle className="text-lime" size={20} /> : <XCircle className="text-red-500" size={20} />}
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
};

export default Toast;
