
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Booking } from '../../../lib/types';

interface DetailedAnalyticsProps {
  bookings: Booking[];
}

const COLORS = ['#007BFF', '#32CD32', '#FF7043', '#FFD700', '#A9A9A9'];

const DetailedAnalytics: React.FC<DetailedAnalyticsProps> = ({ bookings }) => {
  const data = useMemo(() => {
    // Only consider confirmed/completed bookings for analytics
    const activeBookings = bookings.filter(b => b.status !== 'CANCELLED' && b.status !== 'MAINTENANCE');

    // 1. Peak Hours
    const hours = Array(24).fill(0);
    activeBookings.forEach(b => {
      const hour = new Date(b.start_time).getHours();
      hours[hour]++;
    });
    const peakHoursData = hours.map((count, i) => ({
      hour: `${i}:00`,
      count
    })).filter((_, i) => i >= 6 && i <= 23); 

    // 2. Revenue per Sport
    const sportStats: Record<string, number> = {};
    activeBookings.forEach(b => {
      if (!sportStats[b.sport]) sportStats[b.sport] = 0;
      sportStats[b.sport] += b.price;
    });
    const sportData = Object.keys(sportStats).map(sport => ({
      name: sport,
      value: sportStats[sport]
    })).filter(d => d.value > 0);

    // 3. Customer Retention (Mock)
    const userCounts: Record<string, number> = {};
    activeBookings.forEach(b => {
        if(b.user_id && b.user_id !== 'walk-in') {
            userCounts[b.user_id] = (userCounts[b.user_id] || 0) + 1;
        }
    });
    let returning = 0;
    let newCust = 0;
    Object.values(userCounts).forEach(c => c > 1 ? returning++ : newCust++);
    const totalCust = returning + newCust || 1;

    return { peakHoursData, sportData, retention: { returning, totalCust } };
  }, [bookings]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 animate-fade-in-up">
        {/* Peak Hours */}
        <div className="bg-white dark:bg-darkcard p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm lg:col-span-2">
            <h3 className="font-bold text-midnight dark:text-white mb-6 text-sm uppercase tracking-wider">Peak Activity Hours</h3>
            <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.peakHoursData}>
                        <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} dy={10} />
                        <Tooltip 
                            contentStyle={{borderRadius: '8px', border: 'none', backgroundColor: '#1E1E1E', color: '#fff', fontSize: '12px'}}
                            cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        />
                        <Bar dataKey="count" fill="#007BFF" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Revenue Distribution */}
        <div className="bg-white dark:bg-darkcard p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
            <h3 className="font-bold text-midnight dark:text-white mb-4 text-sm uppercase tracking-wider">Revenue Mix</h3>
            <div className="flex-1 min-h-[160px] relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data.sportData}
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.sportData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            formatter={(value: number) => `₹${value}`}
                            contentStyle={{borderRadius: '8px', border: 'none', backgroundColor: '#1E1E1E', color: '#fff'}} 
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} wrapperStyle={{fontSize: '10px'}}/>
                    </PieChart>
                 </ResponsiveContainer>
            </div>
            
            {/* Retention Bar */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between text-[10px] uppercase font-bold mb-1.5">
                    <span className="text-gray-500">Retention Rate</span>
                    <span className="text-purple-500">{Math.round((data.retention.returning / data.retention.totalCust) * 100)}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-purple-500 rounded-full transition-all duration-1000" 
                        style={{ width: `${(data.retention.returning / data.retention.totalCust) * 100}%` }}
                    ></div>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">Returning customers vs New</p>
            </div>
        </div>
    </div>
  );
};

export default DetailedAnalytics;
