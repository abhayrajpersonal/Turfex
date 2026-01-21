
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Booking, Sport } from '../../../lib/types';
import { formatCurrency } from '../../../lib/utils';
import { Filter, BarChart2, PieChart } from 'lucide-react';

interface AdvancedAnalyticsProps {
  bookings: Booking[];
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ bookings }) => {
  const [metric, setMetric] = useState<'REVENUE' | 'BOOKINGS'>('REVENUE');
  const [selectedSport, setSelectedSport] = useState<string>('All');

  // MOCK DATA GENERATOR if bookings are empty
  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();
    
    // Generate last 7 days labels
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        
        let revenue = 0;
        let count = 0;

        // If real bookings exist, filter them
        if (bookings && bookings.length > 5) {
            bookings.forEach(b => {
                const bDate = new Date(b.start_time);
                if (bDate.getDate() === d.getDate() && b.status !== 'CANCELLED') {
                    if (selectedSport === 'All' || b.sport === selectedSport) {
                        revenue += b.price;
                        count += 1;
                    }
                }
            });
        } else {
            // Fallback Mock Data
            const baseRev = selectedSport === 'Cricket' ? 5000 : selectedSport === 'Football' ? 4000 : 8000;
            revenue = Math.floor(Math.random() * 3000) + baseRev;
            count = Math.floor(revenue / 1200);
        }

        data.push({
            name: dayName,
            value: metric === 'REVENUE' ? revenue : count,
            displayValue: metric === 'REVENUE' ? `₹${revenue}` : `${count} Bookings`
        });
    }
    return data;
  }, [bookings, metric, selectedSport]);

  const totalValue = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-white dark:bg-darkcard p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm animate-fade-in-up">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
                <h3 className="text-lg font-bold text-midnight dark:text-white flex items-center gap-2">
                    <BarChart2 size={20} className="text-electric"/> Performance Trends
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                    Total {metric === 'REVENUE' ? 'Revenue' : 'Bookings'} (Last 7 Days): <span className="font-bold text-midnight dark:text-white">{metric === 'REVENUE' ? formatCurrency(totalValue) : totalValue}</span>
                </p>
            </div>

            <div className="flex gap-3 bg-gray-100 dark:bg-zinc-900 p-1.5 rounded-xl">
                {/* Metric Toggle */}
                <div className="flex bg-white dark:bg-black rounded-lg shadow-sm">
                    <button 
                        onClick={() => setMetric('REVENUE')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${metric === 'REVENUE' ? 'bg-electric text-black' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}
                    >
                        Revenue
                    </button>
                    <button 
                        onClick={() => setMetric('BOOKINGS')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${metric === 'BOOKINGS' ? 'bg-electric text-black' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}
                    >
                        Bookings
                    </button>
                </div>

                {/* Sport Filter */}
                <div className="relative group">
                    <select 
                        value={selectedSport}
                        onChange={(e) => setSelectedSport(e.target.value)}
                        className="appearance-none bg-white dark:bg-black border border-transparent dark:border-zinc-800 text-xs font-bold px-4 py-2 pr-8 rounded-lg outline-none cursor-pointer h-full hover:bg-gray-50 dark:hover:bg-zinc-800 text-midnight dark:text-white"
                    >
                        <option value="All">All Sports</option>
                        {Object.values(Sport).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                </div>
            </div>
        </div>

        <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={metric === 'REVENUE' ? '#007BFF' : '#32CD32'} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={metric === 'REVENUE' ? '#007BFF' : '#32CD32'} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeOpacity={0.5} />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 12, fill: '#9CA3AF', fontWeight: 600}} 
                        dy={10} 
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 12, fill: '#9CA3AF'}} 
                        tickFormatter={(val) => metric === 'REVENUE' ? `₹${val/1000}k` : val} 
                    />
                    <Tooltip 
                        contentStyle={{
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
                            backgroundColor: '#18181B', 
                            color: '#fff',
                            fontSize: '12px',
                            fontWeight: 'bold'
                        }}
                        formatter={(value: number) => [metric === 'REVENUE' ? `₹${value}` : value, metric === 'REVENUE' ? 'Revenue' : 'Bookings']}
                        cursor={{stroke: '#DFFF00', strokeWidth: 2}}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={metric === 'REVENUE' ? '#007BFF' : '#32CD32'} 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                        activeDot={{r: 6, strokeWidth: 0, fill: '#fff'}}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default AdvancedAnalytics;
