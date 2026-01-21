
import React from 'react';
import { DollarSign, Users, Calendar, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';

interface StatsOverviewProps {
  stats: {
    totalRevenue: number;
    totalBookings: number;
    occupancyRate: number;
    totalPlayers: number;
  };
}

const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) => (
  <div className="bg-white dark:bg-darkcard p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 dark:bg-gradient-to-b dark:from-white/5 dark:to-transparent flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">{title}</p>
      <h3 className="text-2xl font-black text-midnight dark:text-white font-mono tracking-tight">{value}</h3>
    </div>
    <div className={`p-3 rounded-xl ${color} bg-opacity-10 border border-opacity-20 ${color.replace('bg-', 'border-')}`}>
      <Icon className={color.replace('bg-', 'text-')} size={24} />
    </div>
  </div>
);

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Weekly Revenue" value={formatCurrency(stats.totalRevenue)} icon={DollarSign} color="bg-green-500" />
      <StatCard title="Confirmed Bookings" value={stats.totalBookings.toString()} icon={Calendar} color="bg-blue-500" />
      <StatCard title="Occupancy" value={`${stats.occupancyRate}%`} icon={TrendingUp} color="bg-purple-500" />
      <StatCard title="Est. Footfall" value={stats.totalPlayers.toString()} icon={Users} color="bg-orange-500" />
    </div>
  );
};

export default StatsOverview;
