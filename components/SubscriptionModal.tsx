
import React from 'react';
import { X, Check, Crown, Zap, Percent, Clock } from 'lucide-react';

interface SubscriptionModalProps {
  onClose: () => void;
  onSubscribe: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onClose, onSubscribe }) => {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-darkcard rounded-3xl w-full max-w-md overflow-hidden animate-scale-in relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white z-10 bg-black/20 p-1 rounded-full"><X size={20}/></button>
        
        {/* Header */}
        <div className="bg-gradient-to-br from-yellow-400 to-orange-600 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <Crown size={48} className="mx-auto mb-4 drop-shadow-lg" fill="white" />
          <h2 className="text-3xl font-display font-bold mb-2">Turfex Gold</h2>
          <p className="opacity-90 font-medium">Elevate your game.</p>
        </div>

        {/* Benefits */}
        <div className="p-8 space-y-6">
           <div className="space-y-4">
             <div className="flex items-center gap-4">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg text-yellow-600 dark:text-yellow-400"><Clock size={20} /></div>
                <div>
                   <h4 className="font-bold text-midnight dark:text-white">Early Access</h4>
                   <p className="text-xs text-gray-500 dark:text-gray-400">Book prime slots 24 hours before others.</p>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600 dark:text-green-400"><Percent size={20} /></div>
                <div>
                   <h4 className="font-bold text-midnight dark:text-white">Zero Booking Fees</h4>
                   <p className="text-xs text-gray-500 dark:text-gray-400">Save ₹50 on every single booking.</p>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400"><Zap size={20} /></div>
                <div>
                   <h4 className="font-bold text-midnight dark:text-white">Profile Badge</h4>
                   <p className="text-xs text-gray-500 dark:text-gray-400">Stand out with the exclusive Gold status.</p>
                </div>
             </div>
           </div>

           <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
             <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-gray-500 dark:text-gray-400">Monthly Plan</span>
                <span className="text-2xl font-bold text-midnight dark:text-white">₹199<span className="text-sm font-normal text-gray-400">/mo</span></span>
             </div>
             
             <button 
               onClick={onSubscribe}
               className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/30 hover:scale-[1.02] transition-transform"
             >
               Unlock Gold Now
             </button>
             <p className="text-xs text-center text-gray-400 mt-4">Cancel anytime. Terms apply.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
