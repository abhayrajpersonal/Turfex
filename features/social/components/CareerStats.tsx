
import React from 'react';
import { BarChart2, Award } from 'lucide-react';
import CountUp from '../../../components/common/CountUp';
import { PlayerStats } from '../../../lib/types';

interface CareerStatsProps {
  stats?: PlayerStats;
}

const CareerStats: React.FC<CareerStatsProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="bg-white dark:bg-darkcard p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
       <div className="flex justify-between items-center mb-6">
           <h3 className="font-bold text-lg text-midnight dark:text-white flex items-center gap-2">
               <BarChart2 size={20} className="text-electric" /> Career Stats
           </h3>
       </div>
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl text-center border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-1">Matches</p>
               <CountUp end={stats.matches_played} className="text-3xl font-black text-midnight dark:text-white" />
           </div>
           <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl text-center border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-1">Win Rate</p>
               <p className="text-3xl font-black text-green-500">{((stats.matches_won / (stats.matches_played || 1)) * 100).toFixed(0)}<span className="text-sm">%</span></p>
           </div>
           <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl text-center border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-1">M.O.M</p>
               <p className="text-3xl font-black text-orange-500 flex items-center justify-center gap-1"><Award size={20}/> <CountUp end={stats.man_of_the_match} /></p>
           </div>
           <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl text-center border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-1">Score</p>
               <CountUp end={stats.total_score} className="text-3xl font-black text-blue-500" />
           </div>
       </div>
    </div>
  );
};

export default CareerStats;
