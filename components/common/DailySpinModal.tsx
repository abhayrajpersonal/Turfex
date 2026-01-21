
import React, { useState, useEffect } from 'react';
import { X, Gift, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';

interface DailySpinModalProps {
  onClose: () => void;
}

const DailySpinModal: React.FC<DailySpinModalProps> = ({ onClose }) => {
  const { user, updateWallet, updateUserFields } = useAuth();
  const { showToast, triggerConfetti } = useUI();
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [canSpin, setCanSpin] = useState(false);

  const rewards = [10, 50, 100, 20, 500, 0, 50, 200];
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFD700', '#A9A9A9', '#00FFFF', '#FF8C00'];

  useEffect(() => {
      if (user) {
          const lastSpin = user.last_spin_date ? new Date(user.last_spin_date) : null;
          const today = new Date();
          const isSameDay = lastSpin && lastSpin.getDate() === today.getDate() && lastSpin.getMonth() === today.getMonth() && lastSpin.getFullYear() === today.getFullYear();
          setCanSpin(!isSameDay);
      }
  }, [user]);

  const handleSpin = () => {
    if (isSpinning || result !== null || !canSpin) return;
    setIsSpinning(true);

    const randomDegree = Math.floor(Math.random() * 360) + 720; // At least 2 spins
    const segmentAngle = 360 / rewards.length;
    
    // Calculate result index based on rotation
    const finalAngle = randomDegree % 360;
    const winningIndex = Math.floor(((360 - finalAngle) % 360) / segmentAngle);
    
    setTimeout(() => {
        setIsSpinning(false);
        setResult(rewards[winningIndex]);
        if (rewards[winningIndex] > 0) {
            updateWallet(rewards[winningIndex]);
            showToast(`You won ₹${rewards[winningIndex]}!`, 'success');
            triggerConfetti();
        } else {
            showToast('Better luck next time!', 'error');
        }
        // Persist Spin Date
        updateUserFields({ last_spin_date: new Date().toISOString() });
        setCanSpin(false);
    }, 3000);

    const wheel = document.getElementById('spin-wheel');
    if (wheel) {
        wheel.style.transform = `rotate(${randomDegree}deg)`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-darkcard rounded-3xl w-full max-w-sm p-8 relative animate-scale-in flex flex-col items-center overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white"><X size={20}/></button>
        
        <h3 className="text-2xl font-display font-bold text-midnight dark:text-white mb-2">Daily Spin</h3>
        <p className="text-gray-500 text-sm mb-6">Spin to win Turfex Cash!</p>

        <div className="relative w-64 h-64 mb-8">
            {/* Arrow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-midnight dark:border-t-white"></div>
            
            {/* Wheel */}
            <div 
                id="spin-wheel" 
                className={`w-full h-full rounded-full border-4 border-gray-200 dark:border-gray-700 relative overflow-hidden transition-transform duration-[3000ms] cubic-bezier(0.1, 0.7, 0.1, 1) ${!canSpin && !result ? 'opacity-50 grayscale' : ''}`}
                style={{ transform: 'rotate(0deg)' }}
            >
                {rewards.map((reward, i) => (
                    <div 
                        key={i}
                        className="absolute w-1/2 h-full top-0 right-0 origin-left flex items-center justify-center"
                        style={{ 
                            transform: `rotate(${i * (360/rewards.length)}deg)`,
                            transformOrigin: '0% 50%',
                            backgroundColor: colors[i],
                            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                        }}
                    >
                        <span 
                            className="text-white font-bold text-lg transform rotate-90" 
                            style={{ marginLeft: '80px' }}
                        >
                            {reward}
                        </span>
                    </div>
                ))}
            </div>
        </div>

        {canSpin && result === null ? (
            <button 
                onClick={handleSpin}
                disabled={isSpinning}
                className="w-full bg-electric text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
                <Gift size={20} /> {isSpinning ? 'Spinning...' : 'Spin Now'}
            </button>
        ) : result !== null ? (
            <button 
                onClick={onClose}
                className="w-full bg-green-500 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
            >
                Claim Reward
            </button>
        ) : (
            <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-xl w-full">
                <Clock size={24} className="mx-auto text-gray-400 mb-2"/>
                <p className="text-sm font-bold text-gray-500">Come back tomorrow!</p>
                <p className="text-xs text-gray-400">Next spin available in 24h.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default DailySpinModal;
