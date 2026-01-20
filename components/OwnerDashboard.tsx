
import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, Users, Calendar, TrendingUp, Wrench, QrCode, ClipboardList, PlusCircle, Power, Clock } from 'lucide-react';
import { Booking, Sport } from '../lib/types';

interface OwnerDashboardProps {
  bookings: Booking[];
  onAddOfflineBooking: (booking: any) => void;
}

const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) => (
  <div className="bg-white dark:bg-darkcard p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-start justify-between">
    <div>
      <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-midnight dark:text-white">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
      <Icon className={color.replace('bg-', 'text-')} size={24} />
    </div>
  </div>
);

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ bookings, onAddOfflineBooking }) => {
  const [showOfflineForm, setShowOfflineForm] = useState(false);
  const [offlineDetails, setOfflineDetails] = useState({ name: '', time: '10:00 AM', price: 1000 });
  const [isScanning, setIsScanning] = useState(false);
  
  // Calculate dynamic stats based on props
  const stats = useMemo(() => {
    const totalRevenue = bookings.filter(b => b.status !== 'MAINTENANCE').reduce((acc, curr) => acc + curr.price, 0);
    const totalBookings = bookings.filter(b => b.status !== 'MAINTENANCE').length;
    // Mocking player count as 2x bookings for now
    const totalPlayers = totalBookings * 2 + 120; 
    const occupancyRate = Math.min(100, Math.round((totalBookings / 100) * 100)); // Assuming 100 slots capacity

    // Group by day for charts (mock logic for demo to distribute static bookings + new ones)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartData = days.map(day => ({ name: day, revenue: 0, bookings: 0 }));
    
    // Seed with some base data so charts aren't empty initially
    chartData.forEach(d => {
       d.revenue = Math.floor(Math.random() * 2000) + 1000;
       d.bookings = Math.floor(Math.random() * 10) + 2;
    });

    // Add actual bookings to chart
    bookings.filter(b => b.status !== 'MAINTENANCE').forEach(b => {
      const dayIndex = new Date(b.start_time).getDay();
      chartData[dayIndex].revenue += b.price;
      chartData[dayIndex].bookings += 1;
    });

    return { totalRevenue, totalBookings, totalPlayers, occupancyRate, chartData };
  }, [bookings]);

  // Generate Slots for Today's Heatmap
  const slots = useMemo(() => {
     const times = [
         '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
         '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'
     ];
     return times.map(time => {
         const isBooked = Math.random() > 0.6; // Mock status
         const isMaintenance = !isBooked && Math.random() > 0.9;
         return { time, status: isMaintenance ? 'MAINTENANCE' : isBooked ? 'BOOKED' : 'AVAILABLE' };
     });
  }, []);

  const handleMaintenanceToggle = () => {
    // In a real app, select specific slot. Here we simulate blocking the "Next Slot"
    onAddOfflineBooking({
        status: 'MAINTENANCE',
        sport: Sport.FOOTBALL, // Mock default
        price: 0,
        start_time: new Date().toISOString()
    });
    alert("Next slot marked for Maintenance.");
  };

  const handleOfflineSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onAddOfflineBooking({
        status: 'CONFIRMED',
        payment_mode: 'OFFLINE',
        price: offlineDetails.price,
        start_time: new Date().toISOString(), // Mocking "now" + time logic
        sport: Sport.FOOTBALL
      });
      setShowOfflineForm(false);
      alert("Offline booking added!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-2xl font-display font-bold text-midnight dark:text-white">Dashboard</h2>
           <p className="text-gray-500 dark:text-gray-400">Welcome back, here's what's happening at your turf today.</p>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setIsScanning(!isScanning)} className="bg-midnight dark:bg-white text-white dark:text-midnight px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2">
               <QrCode size={16}/> {isScanning ? 'Stop Scan' : 'Scan Entry'}
            </button>
            <button className="bg-electric text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-blue-600">
               Export Report
            </button>
        </div>
      </div>

      {isScanning && (
          <div className="bg-black text-white p-8 rounded-xl text-center animate-scale-in">
              <QrCode size={48} className="mx-auto mb-4 animate-pulse"/>
              <p>Camera Active... Scanning for Player QR...</p>
          </div>
      )}

      {/* Live Operations Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Operations Controls */}
        <div className="lg:col-span-1 bg-white dark:bg-darkcard p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
           <h3 className="font-bold text-midnight dark:text-white mb-4 flex items-center gap-2"><ClipboardList size={20}/> Operations</h3>
           <div className="flex flex-col gap-4">
               <button onClick={() => setShowOfflineForm(!showOfflineForm)} className="w-full bg-gray-100 dark:bg-gray-800 p-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <PlusCircle className="text-green-600" />
                  <span className="font-bold text-gray-700 dark:text-gray-300">Add Walk-in Booking</span>
               </button>
               <button onClick={handleMaintenanceToggle} className="w-full bg-red-50 dark:bg-red-900/20 p-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                  <Wrench className="text-red-600" />
                  <span className="font-bold text-red-700 dark:text-red-400">Block Slot (Maintenance)</span>
               </button>
           </div>
           
           {showOfflineForm && (
               <form onSubmit={handleOfflineSubmit} className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-4 animate-fade-in-up">
                   <h4 className="font-bold text-sm">New Offline Booking</h4>
                   <div className="space-y-2">
                      <input className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="Customer Name" value={offlineDetails.name} onChange={e => setOfflineDetails({...offlineDetails, name: e.target.value})}/>
                      <input className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="Amount (₹)" type="number" value={offlineDetails.price} onChange={e => setOfflineDetails({...offlineDetails, price: parseInt(e.target.value)})}/>
                      <button type="submit" className="w-full bg-green-600 text-white p-2 rounded font-bold">Save</button>
                   </div>
               </form>
           )}
        </div>

        {/* Live Slot Grid (Heatmap) */}
        <div className="lg:col-span-2 bg-white dark:bg-darkcard p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
           <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-midnight dark:text-white flex items-center gap-2"><Clock size={20}/> Today's Schedule</h3>
               <div className="flex gap-4 text-xs font-medium">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Available</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Booked</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-400"></div> Maint.</span>
               </div>
           </div>
           
           <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {slots.map((slot, i) => (
                  <div 
                    key={i} 
                    className={`p-3 rounded-lg text-center border transition-all hover:scale-105 cursor-pointer ${
                        slot.status === 'AVAILABLE' ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' :
                        slot.status === 'BOOKED' ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800' :
                        'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 opacity-70'
                    }`}
                  >
                      <span className={`text-xs font-bold block mb-1 ${
                          slot.status === 'AVAILABLE' ? 'text-green-700 dark:text-green-400' :
                          slot.status === 'BOOKED' ? 'text-red-700 dark:text-red-400' :
                          'text-gray-500'
                      }`}>{slot.time}</span>
                      <span className="text-[10px] font-medium uppercase text-gray-400">
                          {slot.status === 'AVAILABLE' ? 'Open' : slot.status === 'BOOKED' ? 'Full' : 'Closed'}
                      </span>
                  </div>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} color="bg-green-500" />
        <StatCard title="Active Bookings" value={stats.totalBookings.toString()} icon={Calendar} color="bg-blue-500" />
        <StatCard title="Occupancy Rate" value={`${stats.occupancyRate}%`} icon={TrendingUp} color="bg-purple-500" />
        <StatCard title="Total Players" value={stats.totalPlayers.toLocaleString()} icon={Users} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-darkcard p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-midnight dark:text-white mb-4">Revenue Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" strokeOpacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', backgroundColor: '#1E1E1E', color: '#fff'}}
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                />
                <Bar dataKey="revenue" fill="#007BFF" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-darkcard p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-midnight dark:text-white mb-4">Booking Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" strokeOpacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', backgroundColor: '#1E1E1E', color: '#fff'}}
                />
                <Line type="monotone" dataKey="bookings" stroke="#32CD32" strokeWidth={3} dot={{r: 4, fill: '#32CD32', strokeWidth: 0}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
