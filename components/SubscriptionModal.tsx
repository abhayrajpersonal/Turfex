
import React from 'react';
import { X, Check, Crown, Zap, Percent, CalendarClock, ShoppingBag, BarChart2, TrendingUp } from 'lucide-react';

interface SubscriptionModalProps {
  onClose: () => void;
  onSubscribe: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onClose, onSubscribe }) => {
  const benefits = [
    {
      icon: <Percent size={20} className="text-green-600 dark:text-green-400" />,
      bg: "bg-green-100 dark:bg-green-900/30",
      title: "Zero Convenience Fees",
      desc: "Save ₹40-₹80 on every single booking."
    },
    {
      icon: <CalendarClock size={20} className="text-blue-600 dark:text-blue-400" />,
      bg: "bg-blue-100 dark:bg-blue-900/30",
      title: "7-Day Advance Booking",
      desc: "Beat the rush. Book prime slots before anyone else."
    },
    {
      icon: <TrendingUp size={20} className="text-purple-600 dark:text-purple-400" />,
      bg: "bg-purple-100 dark:bg-purple-900/30",
      title: "2x XP & Points",
      desc: "Level up twice as fast & top the leaderboards."
    },
    {
      icon: <ShoppingBag size={20} className="text-orange-600 dark:text-orange-400" />,
      bg: "bg-orange-100 dark:bg-orange-900/30",
      title: "Flat 15% Off Store",
      desc: "Exclusive discounts on jerseys, equipment & more."
    },
    {
      icon: <BarChart2 size={20} className="text-pink-600 dark:text-pink-400" />,
      bg: "bg-pink-100 dark:bg-pink-900/30",
      title: "Pro Analytics",
      desc: "Unlock detailed heatmaps & performance insights."
    },
    {
      icon: <Crown size={20} className="text-yellow-600 dark:text-yellow-400" />,
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      title: "Gold Badge",
      desc: "Exclusive profile flair & chat highlight."
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-white dark:bg-darkcard rounded-3xl w-full max-w-md overflow-hidden animate-scale-in relative border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/90 hover:text-white z-20 bg-black/30 p-1.5 rounded-full backdrop-blur-md transition-colors"><X size={20}/></button>
        
        {/* Header */}
        <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 p-8 pt-10 text-white text-center relative shrink-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          
          <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-3 shadow-lg border border-white/30 animate-float">
                <Crown size={32} className="text-white drop-shadow-md" fill="currentColor" />
              </div>
              <h2 className="text-3xl font-display font-black mb-1 tracking-tight">TURFEX GOLD</h2>
              <p className="font-medium text-white/90 text-sm">Join the elite club of power players.</p>
          </div>
        </div>

        {/* Benefits Scroll Area */}
        <div className="p-6 overflow-y-auto flex-1">
           <div className="grid gap-4">
             {benefits.map((b, i) => (
               <div key={i} className="flex items-start gap-4 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className={`p-3 rounded-xl shrink-0 ${b.bg}`}>
                    {b.icon}
                  </div>
                  <div>
                     <h4 className="font-bold text-midnight dark:text-white text-sm">{b.title}</h4>
                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{b.desc}</p>
                  </div>
               </div>
             ))}
           </div>
        </div>

        {/* Footer / Pricing */}
        <div className="p-5 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shrink-0">
             <div className="flex justify-between items-end mb-4 px-2">
                <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider line-through decoration-red-500">₹499/mo</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-midnight dark:text-white">₹199</span>
                        <span className="text-sm font-bold text-gray-500">/ month</span>
                    </div>
                </div>
                <div className="text-right">
                    <span className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-md text-[10px] font-black uppercase">Save 60%</span>
                </div>
             </div>
             
             <button 
               onClick={onSubscribe}
               className="w-full bg-gradient-to-r from-midnight to-black dark:from-white dark:to-gray-200 text-white dark:text-midnight font-black py-4 rounded-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
             >
               <span className="relative z-10 flex items-center gap-2">Unlock Gold Access <Zap size={18} className="fill-current" /></span>
               {/* Shine Effect */}
               <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine skew-x-12" />
             </button>
             <p className="text-[10px] text-center text-gray-400 mt-3 font-medium">Cancel anytime in settings. Recurring billing applies.</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
