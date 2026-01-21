
import React from 'react';
import { X, Siren, PhoneCall, Flame, Stethoscope } from 'lucide-react';

interface EmergencyModalProps {
  onClose: () => void;
}

const EmergencyModal: React.FC<EmergencyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-red-900/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-darkcard rounded-2xl w-full max-w-sm p-6 relative animate-scale-in shadow-2xl border-2 border-red-500">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white"><X size={20}/></button>
        
        <div className="text-center mb-6">
            <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                <Siren size={32} />
            </div>
            <h3 className="text-2xl font-bold text-red-600">Emergency Contacts</h3>
            <p className="text-gray-500 text-sm">Quick access for urgent help.</p>
        </div>

        <div className="space-y-3">
            <a href="tel:100" className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 transition-colors group">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full shadow-sm text-red-500"><PhoneCall size={20}/></div>
                    <span className="font-bold text-lg text-midnight dark:text-white">Police</span>
                </div>
                <span className="font-black text-xl text-red-600">100</span>
            </a>
            
            <a href="tel:102" className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 transition-colors group">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full shadow-sm text-red-500"><Stethoscope size={20}/></div>
                    <span className="font-bold text-lg text-midnight dark:text-white">Ambulance</span>
                </div>
                <span className="font-black text-xl text-red-600">102</span>
            </a>

            <a href="tel:101" className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 transition-colors group">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full shadow-sm text-red-500"><Flame size={20}/></div>
                    <span className="font-bold text-lg text-midnight dark:text-white">Fire Brigade</span>
                </div>
                <span className="font-black text-xl text-red-600">101</span>
            </a>
        </div>
        
        <p className="text-center text-xs text-gray-400 mt-4">These buttons will dial the number directly on mobile.</p>
      </div>
    </div>
  );
};

export default EmergencyModal;
