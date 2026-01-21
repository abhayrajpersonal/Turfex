
import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { QrCode, Calendar } from 'lucide-react';
import { Booking } from '../lib/types';
import { formatDate } from '../lib/utils';
import StatsOverview from '../features/dashboard/components/StatsOverview';
import SlotScheduler from '../features/dashboard/components/SlotScheduler';
import SlotManagerModal from '../features/dashboard/components/SlotManagerModal';

interface OwnerDashboardProps {
  bookings: Booking[];
  onAddOfflineBooking: (booking: any) => void;
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ bookings, onAddOfflineBooking }) => {
  const [schedulerDate, setSchedulerDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<{date: Date, time: string} | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Calculate dynamic stats
  const stats = useMemo(() => {
    const validBookings = bookings.filter(b => b.status !== 'MAINTENANCE' && b.status !== 'CANCELLED');
    const totalRevenue = validBookings.reduce((acc, curr) => acc + curr.price, 0);
    const totalBookings = validBookings.length;
    const totalPlayers = totalBookings * 10 + 45; 
    const occupancyRate = Math.min(100, Math.round((totalBookings / 50) * 100)); // Assuming 50 slots capacity for demo

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartData = days.map(day => ({ name: day, revenue: 0, bookings: 0 }));
    
    // Fill with some mock baseline so charts aren't empty
    chartData.forEach(d => {
       d.revenue = Math.floor(Math.random() * 2000) + 500;
       d.bookings = Math.floor(Math.random() * 5) + 1;
    });

    validBookings.forEach(b => {
      const dayIndex = new Date(b.start_time).getDay();
      chartData[dayIndex].revenue += b.price;
      chartData[dayIndex].bookings += 1;
    });

    return { totalRevenue, totalBookings, totalPlayers, occupancyRate, chartData };
  }, [bookings]);

  const handleSlotClick = (date: Date, time: string) => {
      const booking = getBookingForSlot(date, time);
      if (booking) {
          // In a real app, open booking details here
          return;
      }
      setSelectedSlot({ date, time });
  };

  const getBookingForSlot = (day: Date, time: string) => {
    const dateStr = formatDate(day);
    return bookings.find(b => {
        const bDate = new Date(b.start_time);
        const bDateStr = formatDate(bDate);
        const bTimeStr = bDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        // Fuzzy match for the hour block
        return bDateStr === dateStr && bTimeStr.startsWith(time.split(':')[0]) && b.status !== 'CANCELLED';
    });
  };

  const handleModalSubmit = (payload: any) => {
      onAddOfflineBooking({
          ...payload,
          turf_id: 't1', // context turf
          user_id: payload.status === 'MAINTENANCE' ? 'admin' : 'walk-in'
      });
      setSelectedSlot(null);
  };

  const getWeekDays = () => {
    const days = [];
    for(let i=0; i<7; i++) {
        const d = new Date(schedulerDate);
        d.setDate(schedulerDate.getDate() - schedulerDate.getDay() + i);
        days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDays();
  const timeSlots = Array.from({length: 16}, (_, i) => `${i + 6}:00`.padStart(5, '0')); // 06:00 to 21:00

  const changeWeek = (offset: number) => {
      const newDate = new Date(schedulerDate);
      newDate.setDate(newDate.getDate() + (offset * 7));
      setSchedulerDate(newDate);
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-20">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <h2 className="text-3xl font-display font-black text-midnight dark:text-white">Owner Dashboard</h2>
           <p className="text-gray-500 dark:text-gray-400 font-medium">Manage bookings, block slots, and track revenue.</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => setIsScanning(!isScanning)} 
                className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 transition-all ${isScanning ? 'bg-red-500 text-white' : 'bg-white dark:bg-darkcard text-midnight dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50'}`}
            >
               <QrCode size={18}/> {isScanning ? 'Stop Camera' : 'Scan Entry Pass'}
            </button>
            <button 
                onClick={() => {
                    const now = new Date();
                    now.setMinutes(0,0,0);
                    const timeStr = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
                    setSelectedSlot({ date: now, time: timeStr });
                }} 
                className="bg-electric text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all flex items-center gap-2"
            >
               <Calendar size={18} /> Quick Block
            </button>
        </div>
      </div>

      {isScanning && (
          <div className="bg-black text-white p-8 rounded-2xl text-center animate-scale-in relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
              <div className="relative z-10 flex flex-col items-center">
                  <div className="w-64 h-64 border-4 border-electric rounded-3xl relative mb-4 overflow-hidden bg-gray-900 flex items-center justify-center">
                      <div className="absolute inset-0 border-t-4 border-red-500 animate-[scan_2s_ease-in-out_infinite] opacity-50"></div>
                      <QrCode size={64} className="text-gray-700" />
                  </div>
                  <p className="font-bold text-lg">Point camera at player's QR Code</p>
                  <p className="text-sm text-gray-400">Verifying booking details...</p>
              </div>
          </div>
      )}

      {/* Stats Overview */}
      <StatsOverview stats={stats} />

      {/* Scheduler */}
      <SlotScheduler 
        schedulerDate={schedulerDate}
        changeWeek={changeWeek}
        weekDays={weekDays}
        timeSlots={timeSlots}
        bookings={bookings}
        onSlotClick={handleSlotClick}
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-darkcard p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-midnight dark:text-white mb-6">Revenue Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', backgroundColor: '#1E1E1E', color: '#fff'}}
                  cursor={{fill: '#F3F4F6'}}
                />
                <Bar dataKey="revenue" fill="#007BFF" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white dark:bg-darkcard p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-midnight dark:text-white mb-6">Booking Density</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', backgroundColor: '#1E1E1E', color: '#fff'}}
                />
                <Line type="monotone" dataKey="bookings" stroke="#32CD32" strokeWidth={3} dot={{r: 4, fill: '#32CD32', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

       {/* Slot Management Modal */}
       {selectedSlot && (
           <SlotManagerModal 
              selectedSlot={selectedSlot}
              onClose={() => setSelectedSlot(null)}
              onSubmit={handleModalSubmit}
           />
       )}
    </div>
  );
};

export default OwnerDashboard;
