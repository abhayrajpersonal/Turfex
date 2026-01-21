
import React from 'react';
import { Zap } from 'lucide-react';
import CountUp from '../../../components/common/CountUp';
import { CredibilityScore } from '../../../lib/types';

interface CredibilityCardProps {
  credibility?: CredibilityScore;
}

const CredibilityCard: React.FC<CredibilityCardProps> = ({ credibility }) => {
  if (!credibility) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-midnight rounded-3xl p-6 text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-electric/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center relative z-10 gap-8">
            <div className="flex items-center gap-6">
                <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                     <svg className="w-full h-full transform -rotate-90">
                         <circle cx="56" cy="56" r="46" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                         <circle 
                            cx="56" cy="56" r="46" 
                            stroke="currentColor" strokeWidth="8" fill="transparent" 
                            strokeDasharray={289} // 2 * PI * 46
                            strokeDashoffset={289} // Start empty
                            strokeLinecap="round"
                            className="text-electric transition-all duration-[2000ms] ease-out" 
                            style={{ strokeDashoffset: 289 * (1 - credibility.total / 100) }}
                         />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <CountUp end={credibility.total} className="text-3xl font-black leading-none" />
                          <span className="text-[10px] font-bold text-white/60 uppercase">Score</span>
                     </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-1"><Zap className="text-yellow-400 fill-yellow-400 animate-pulse" size={20}/> Credibility</h3>
                    <p className="text-white/60 text-sm font-medium mb-3">Community Trust Score</p>
                    <div className="flex gap-3 text-xs font-bold bg-black/20 p-2 rounded-lg inline-flex">
                        <span className="text-green-400">{credibility.breakdown.reliability}% Reliable</span>
                        <div className="w-px bg-white/20"></div>
                        <span className="text-blue-400">{credibility.breakdown.fair_play}% Fair Play</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center md:justify-end max-w-xs">
                {credibility.endorsements.map((end, i) => (
                    <div key={i} className="bg-white/10 border border-white/5 px-3 py-1.5 rounded-lg flex items-center gap-2 backdrop-blur-md hover:bg-white/20 transition-colors cursor-default animate-scale-in" style={{animationDelay: `${i * 100}ms`}}>
                        <span className="text-xs font-bold">{end.skill}</span>
                        <span className="bg-electric text-white text-[10px] font-black px-1.5 rounded-full shadow-sm">+{end.count}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default CredibilityCard;
