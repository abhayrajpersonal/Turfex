
import React, { useMemo, useState } from 'react';
import { QrCode, CheckSquare, XSquare, BarChart2, CalendarDays, Lock } from 'lucide-react';
import { Booking, UserType } from '../lib/types';
import { formatDate } from '../lib/utils';
import StatsOverview from '../features/dashboard/components/StatsOverview';
import DashboardHeroInsights from '../features/dashboard/components/DashboardHeroInsights';
import AdvancedAnalytics from '../features/dashboard/components/AdvancedAnalytics';
import DetailedAnalytics from '../features/dashboard/components/DetailedAnalytics';
import SlotScheduler from '../features/dashboard/components/SlotScheduler';
import SlotManagerModal from '../features/dashboard/components/SlotManagerModal';
import InventoryManager from '../features/dashboard/components/InventoryManager'; 
import { useAuth } from '../context/AuthContext';

interface OwnerDashboardProps {
  bookings: Booking[];
  onAddOfflineBooking: (booking: any) => void;
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ bookings, onAddOfflineBooking }) => {
  const { user } = useAuth();
  const isOwner = user?.user_type === UserType.OWNER;
  
  // View State: Managers forced to MANAGEMENT, Owners default to ANALYTICS
  const [currentView, setCurrentView] = useState<'ANALYTICS' | 'MANAGEMENT'>(isOwner ? 'ANALYTICS' : 'MANAGEMENT');

  const [schedulerDate, setSchedulerDate] = useState(new Date());
  
  // Bulk Mode States
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedBulkSlots, setSelectedBulkSlots] = useState<string[]>([]); // Format: "YYYY-MM-DD|HH:mm"
  const [showModal, setShowModal] = useState(false);
  const [targetSlots, setTargetSlots] = useState<{date: Date, time: string}[]>([]);

  const [isScanning, setIsScanning] = useState(false);

  // Stats Calculation (Always calculate, selectively render)
  const stats = useMemo(() => {
    const validBookings = bookings.filter(b => b.status !== 'MAINTENANCE' && b.status !== 'CANCELLED');
    
    const totalRevenue = validBookings.length > 0 ? validBookings.reduce((acc, curr) => acc + curr.price, 0) : 145000;
    const totalBookings = validBookings.length > 0 ? validBookings.length : 124;
    const totalPlayers = totalBookings * 10 + 45; 
    const occupancyRate = Math.min(100, Math.round((totalBookings / 150) * 100)) || 78;

    return { totalRevenue, totalBookings, totalPlayers, occupancyRate };
  }, [bookings]);

  // Slot ID Helper
  const getSlotId = (date: Date, time: string) => `${formatDate(date)}|${time}`;

  const handleSlotClick = (date: Date, time: string) => {
      const slotId = getSlotId(date, time);
      
      const isBooked = bookings.some(b => {
          const bDate = new Date(b.start_time);
          const bTimeStr = bDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
          return formatDate(bDate) === formatDate(date) && bTimeStr.startsWith(time.split(':')[0]) && b.status !== 'CANCELLED';
      });

      if (isBooked) return;

      if (isBulkMode) {
          setSelectedBulkSlots(prev => 
              prev.includes(slotId) 
                  ? prev.filter(id => id !== slotId) 
                  : [...prev, slotId]
          );
      } else {
          setTargetSlots([{ date, time }]);
          setShowModal(true);
      }
  };

  const handleBulkAction = () => {
      if (selectedBulkSlots.length === 0) return;
      
      const slots = selectedBulkSlots.map(id => {
          const [dateStr, time] = id.split('|');
          return { date: new Date(dateStr), time };
      });
      setTargetSlots(slots);
      setShowModal(true);
  };

  const handleModalSubmit = (payload: any[]) => {
      payload.forEach(item => {
          onAddOfflineBooking(item);
      });
      setShowModal(false);
      setSelectedBulkSlots([]);
      setIsBulkMode(false);
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
  const timeSlots = Array.from({length: 16}, (_, i) => `${i + 6}:00`.padStart(5, '0'));

  const changeWeek = (offset: number) => {
      const newDate = new Date(schedulerDate);
      newDate.setDate(newDate.getDate() + (offset * 7));
      setSchedulerDate(newDate);
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h2 className="text-3xl font-display font-black text-midnight dark:text-white">{isOwner ? 'Owner Dashboard' : 'Manager Dashboard'}</h2>
           <p className="text-gray-500 dark:text-gray-400 font-medium">
               {currentView === 'ANALYTICS' ? 'Financial overview & performance metrics.' : 'Daily operations, bookings & inventory.'}
           </p>
        </div>
        
        {/* Toggle Switcher - Only for Owners */}
        {isOwner && (
            <div className="flex bg-gray-200 dark:bg-zinc-800 p-1 rounded-xl shadow-inner">
                <button 
                    onClick={() => setCurrentView('ANALYTICS')}
                    className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${currentView === 'ANALYTICS' ? 'bg-white dark:bg-black text-black dark:text-white shadow-md' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}
                >
                    <BarChart2 size={16}/> Analytics
                </button>
                <button 
                    onClick={() => setCurrentView('MANAGEMENT')}
                    className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${currentView === 'MANAGEMENT' ? 'bg-white dark:bg-black text-black dark:text-white shadow-md' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}
                >
                    <CalendarDays size={16}/> Management
                </button>
            </div>
        )}
      </div>

      {/* ANALYTICS VIEW */}
      {currentView === 'ANALYTICS' && isOwner && (
          <div className="space-y-8 animate-scale-in">
              <DashboardHeroInsights bookings={bookings} />
              <StatsOverview stats={stats} />
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <AdvancedAnalytics bookings={bookings} />
                  <DetailedAnalytics bookings={bookings} />
              </div>
          </div>
      )}

      {/* MANAGEMENT VIEW */}
      {currentView === 'MANAGEMENT' && (
          <div className="space-y-6 animate-scale-in">
              {/* Action Bar */}
              <div className="flex justify-end gap-3">
                  <button 
                      onClick={() => setIsScanning(!isScanning)} 
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 transition-all ${isScanning ? 'bg-red-500 text-white' : 'bg-white dark:bg-darkcard text-midnight dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50'}`}
                  >
                    <QrCode size={18}/> {isScanning ? 'Stop Camera' : 'Scan Entry Pass'}
                  </button>
                  <button 
                      onClick={() => {
                          setIsBulkMode(!isBulkMode);
                          setSelectedBulkSlots([]);
                      }} 
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all flex items-center gap-2 ${isBulkMode ? 'bg-zinc-800 text-white border border-zinc-700' : 'bg-electric text-white shadow-blue-500/30 hover:bg-blue-600'}`}
                  >
                    {isBulkMode ? <XSquare size={18}/> : <CheckSquare size={18} />} 
                    {isBulkMode ? 'Exit Bulk Mode' : 'Bulk Select'}
                  </button>
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

              <SlotScheduler 
                schedulerDate={schedulerDate}
                changeWeek={changeWeek}
                weekDays={weekDays}
                timeSlots={timeSlots}
                bookings={bookings}
                onSlotClick={handleSlotClick}
                isBulkMode={isBulkMode}
                selectedSlots={selectedBulkSlots}
                onBulkAction={handleBulkAction}
              />

              <InventoryManager />
          </div>
      )}

       {/* Slot Management Modal */}
       {showModal && targetSlots.length > 0 && (
           <SlotManagerModal 
              selectedSlots={targetSlots}
              onClose={() => setShowModal(false)}
              onSubmit={handleModalSubmit}
           />
       )}
    </div>
  );
};

export default OwnerDashboard;
