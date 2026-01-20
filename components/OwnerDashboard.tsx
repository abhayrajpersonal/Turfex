
import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, Users, Calendar, TrendingUp, QrCode, ChevronLeft, ChevronRight, User, Shield, AlertTriangle, Check, Clock, X } from 'lucide-react';
import { Booking, Sport } from '../lib/types';
import { formatDate, formatCurrency } from '../lib/utils';

interface OwnerDashboardProps {
  bookings: Booking[];
  onAddOfflineBooking: (booking: any) => void;
}

const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) => (
  <div className="bg-white dark:bg-darkcard p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
      <h3 className="text-2xl font-black text-midnight dark:text-white font-display">{value}</h3>
    </div>
    <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
      <Icon className={color.replace('bg-', 'text-')} size={24} />
    </div>
  </div>
);

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ bookings, onAddOfflineBooking }) => {
  const [schedulerDate, setSchedulerDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<{date: Date, time: string} | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Form State
  const [mode, setMode] = useState<'BOOKING' | 'BLOCK'>('BOOKING');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedSport, setSelectedSport] = useState<Sport>(Sport.FOOTBALL);
  const [price, setPrice] = useState(1200);
  const [blockReason, setBlockReason] = useState('Maintenance');

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
          alert(`Slot already booked by ${booking.user_id === 'walk-in' ? 'Walk-in' : 'Online User'}`);
          return;
      }
      // Open Modal
      setSelectedSlot({ date, time });
      setMode('BOOKING');
      setCustomerName('');
      setCustomerPhone('');
      setPrice(1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedSlot) return;

      const startTime = new Date(selectedSlot.date);
      const [hours, minutes] = selectedSlot.time.split(':').map(Number);
      startTime.setHours(hours, minutes);

      const payload = {
        start_time: startTime.toISOString(),
        sport: selectedSport,
        status: mode === 'BLOCK' ? 'MAINTENANCE' : 'CONFIRMED',
        price: mode === 'BLOCK' ? 0 : price,
        payment_mode: 'OFFLINE',
        // Additional metadata would go here in a real app
        user_id: mode === 'BLOCK' ? 'admin' : 'walk-in',
        turf_id: 't1', // context turf
        details: mode === 'BLOCK' ? blockReason : { name: customerName, phone: customerPhone }
      };

      onAddOfflineBooking(payload);
      setSelectedSlot(null);
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(schedulerDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
    startOfWeek.setDate(diff); // This logic might need strict locality checks, keeping simple for demo
    
    // Actually, simple "Next 7 days" or "Current Week" logic:
    // Let's stick to "Current view starting from schedulerDate"
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Weekly Revenue" value={formatCurrency(stats.totalRevenue)} icon={DollarSign} color="bg-green-500" />
        <StatCard title="Confirmed Bookings" value={stats.totalBookings.toString()} icon={Calendar} color="bg-blue-500" />
        <StatCard title="Occupancy" value={`${stats.occupancyRate}%`} icon={TrendingUp} color="bg-purple-500" />
        <StatCard title="Est. Footfall" value={stats.totalPlayers.toString()} icon={Users} color="bg-orange-500" />
      </div>

      {/* Scheduler */}
      <div className="bg-white dark:bg-darkcard p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
         <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
             <h3 className="font-bold text-xl text-midnight dark:text-white flex items-center gap-2"><Calendar className="text-electric" size={24}/> Slot Manager</h3>
             
             <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                 <button onClick={() => changeWeek(-1)} className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-all shadow-sm"><ChevronLeft size={16} /></button>
                 <span className="px-4 text-sm font-bold text-midnight dark:text-white min-w-[140px] text-center">
                     {weekDays[0].toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} - {weekDays[6].toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                 </span>
                 <button onClick={() => changeWeek(1)} className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-all shadow-sm"><ChevronRight size={16} /></button>
             </div>
             
             <div className="flex gap-4 text-xs font-bold">
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></div> Booked</div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-300"></div> Empty</div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-50 border border-red-200"></div> Blocked</div>
             </div>
         </div>

         <div className="overflow-x-auto pb-2">
             <div className="min-w-[800px]">
                 {/* Header Row */}
                 <div className="grid grid-cols-8 gap-2 mb-4">
                    <div className="text-center text-xs font-black text-gray-400 uppercase tracking-wider pt-2">IST</div>
                    {weekDays.map(d => {
                        const isToday = new Date().toDateString() === d.toDateString();
                        return (
                            <div key={d.toISOString()} className={`text-center p-2 rounded-xl border ${isToday ? 'bg-electric text-white border-electric' : 'bg-gray-50 dark:bg-gray-800 border-transparent text-gray-500 dark:text-gray-400'}`}>
                                <div className="text-[10px] font-bold uppercase mb-0.5 opacity-80">{d.toLocaleDateString('en-US', {weekday: 'short'})}</div>
                                <div className="text-lg font-black leading-none">{d.getDate()}</div>
                            </div>
                        );
                    })}
                 </div>
                 
                 {/* Time Rows */}
                 {timeSlots.map(time => (
                     <div key={time} className="grid grid-cols-8 gap-2 mb-2">
                         <div className="text-xs font-bold text-gray-400 text-center py-3">{time}</div>
                         {weekDays.map(day => {
                             const booking = getBookingForSlot(day, time);
                             const isMaintenance = booking?.status === 'MAINTENANCE';
                             
                             return (
                                 <button 
                                    key={day.toISOString()+time} 
                                    onClick={() => handleSlotClick(day, time)}
                                    className={`h-12 rounded-lg border transition-all relative group overflow-hidden ${
                                        booking 
                                            ? isMaintenance
                                                ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30 cursor-not-allowed'
                                                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 cursor-pointer hover:bg-blue-100' 
                                            : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-electric hover:shadow-md'
                                    }`}
                                 >
                                     {booking ? (
                                         <div className="w-full h-full flex items-center justify-center">
                                            {isMaintenance ? (
                                                <div className="flex flex-col items-center opacity-50">
                                                    <AlertTriangle size={14} className="text-red-500"/>
                                                    <span className="text-[9px] font-bold text-red-500">BLOCKED</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400">BOOKED</span>
                                                </div>
                                            )}
                                         </div>
                                     ) : (
                                         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                             <PlusCircleIcon />
                                         </div>
                                     )}
                                 </button>
                             );
                         })}
                     </div>
                 ))}
             </div>
         </div>
      </div>

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
           <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in-up">
               <div className="bg-white dark:bg-darkcard rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                   <div className="bg-gray-50 dark:bg-gray-800 p-6 flex justify-between items-start border-b border-gray-100 dark:border-gray-700">
                       <div>
                           <h3 className="text-xl font-bold text-midnight dark:text-white">Manage Slot</h3>
                           <p className="text-sm text-gray-500 font-medium mt-1 flex items-center gap-2">
                               <Clock size={14}/> {selectedSlot.date.toDateString()}, {selectedSlot.time}
                           </p>
                       </div>
                       <button onClick={() => setSelectedSlot(null)} className="p-2 bg-white dark:bg-gray-700 rounded-full hover:bg-gray-100 transition-colors"><X size={20}/></button>
                   </div>
                   
                   <div className="p-2 grid grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-800 px-6 pb-0">
                       <button 
                         onClick={() => setMode('BOOKING')}
                         className={`py-3 text-sm font-bold border-b-2 transition-colors ${mode === 'BOOKING' ? 'border-electric text-electric' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                       >
                           Customer Booking
                       </button>
                       <button 
                         onClick={() => setMode('BLOCK')}
                         className={`py-3 text-sm font-bold border-b-2 transition-colors ${mode === 'BLOCK' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                       >
                           Block Slot
                       </button>
                   </div>

                   <div className="p-6 overflow-y-auto">
                       <form id="booking-form" onSubmit={handleSubmit} className="space-y-5">
                           {mode === 'BOOKING' ? (
                               <>
                                   <div className="space-y-4">
                                       <div>
                                           <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Customer Name</label>
                                           <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-electric transition-all">
                                               <User size={18} className="text-gray-400" />
                                               <input 
                                                 required
                                                 autoFocus
                                                 placeholder="e.g. Rahul Sharma" 
                                                 className="bg-transparent w-full outline-none text-sm font-bold text-midnight dark:text-white placeholder-gray-400"
                                                 value={customerName}
                                                 onChange={e => setCustomerName(e.target.value)}
                                               />
                                           </div>
                                       </div>
                                       <div>
                                           <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone Number (Optional)</label>
                                           <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-electric transition-all">
                                               <span className="text-sm font-bold text-gray-400">+91</span>
                                               <input 
                                                 type="tel"
                                                 placeholder="98765 43210" 
                                                 className="bg-transparent w-full outline-none text-sm font-bold text-midnight dark:text-white placeholder-gray-400"
                                                 value={customerPhone}
                                                 onChange={e => setCustomerPhone(e.target.value)}
                                               />
                                           </div>
                                       </div>
                                   </div>

                                   <div className="grid grid-cols-2 gap-4">
                                       <div>
                                           <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Sport</label>
                                           <select 
                                              value={selectedSport}
                                              onChange={e => setSelectedSport(e.target.value as Sport)}
                                              className="w-full bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700 font-bold text-sm outline-none focus:ring-2 focus:ring-electric"
                                           >
                                               {(Object.values(Sport) as string[]).map(s => <option key={s} value={s}>{s}</option>)}
                                           </select>
                                       </div>
                                       <div>
                                           <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Price (₹)</label>
                                           <input 
                                             type="number"
                                             value={price}
                                             onChange={e => setPrice(Number(e.target.value))}
                                             className="w-full bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700 font-bold text-sm outline-none focus:ring-2 focus:ring-electric"
                                           />
                                       </div>
                                   </div>
                               </>
                           ) : (
                               <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                                   <div className="flex gap-3 mb-4">
                                       <AlertTriangle className="text-red-500 shrink-0" />
                                       <p className="text-sm text-red-800 dark:text-red-200 leading-snug">
                                           Blocking this slot will prevent online users from booking it. It will be marked as "Under Maintenance".
                                       </p>
                                   </div>
                                   <div>
                                       <label className="block text-xs font-bold text-red-400 uppercase tracking-wider mb-2">Reason</label>
                                       <select 
                                          value={blockReason} 
                                          onChange={e => setBlockReason(e.target.value)}
                                          className="w-full bg-white dark:bg-gray-800 p-3 rounded-xl border border-red-200 dark:border-red-900/50 font-bold text-sm outline-none focus:ring-2 focus:ring-red-500"
                                       >
                                           <option>Maintenance</option>
                                           <option>Private Event</option>
                                           <option>Coaching Camp</option>
                                           <option>Other</option>
                                       </select>
                                   </div>
                               </div>
                           )}
                       </form>
                   </div>
                   
                   <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex gap-3 bg-gray-50 dark:bg-gray-800">
                       <button onClick={() => setSelectedSlot(null)} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                       <button 
                         onClick={handleSubmit} 
                         className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 ${mode === 'BOOKING' ? 'bg-electric hover:bg-blue-600 shadow-blue-500/30' : 'bg-red-500 hover:bg-red-600 shadow-red-500/30'}`}
                       >
                           {mode === 'BOOKING' ? <><Check size={18}/> Confirm Booking</> : <><Shield size={18}/> Block Slot</>}
                       </button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};

const PlusCircleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-electric opacity-50"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
);

export default OwnerDashboard;
