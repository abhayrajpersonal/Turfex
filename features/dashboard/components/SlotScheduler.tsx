
import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Lock, Smartphone, Store } from 'lucide-react';
import { Booking } from '../../../lib/types';
import { formatDate } from '../../../lib/utils';

interface SlotSchedulerProps {
  schedulerDate: Date;
  changeWeek: (offset: number) => void;
  weekDays: Date[];
  timeSlots: string[];
  bookings: Booking[];
  onSlotClick: (date: Date, time: string) => void;
}

const PlusCircleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-electric opacity-50"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
);

const SlotScheduler: React.FC<SlotSchedulerProps> = ({ schedulerDate, changeWeek, weekDays, timeSlots, bookings, onSlotClick }) => {
  
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

  return (
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
        
        <div className="flex gap-4 text-[10px] uppercase font-bold text-gray-500">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Online</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"></div> Walk-in</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-gray-300 striped-bg"></div> Blocked</div>
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
                const isWalkIn = booking?.user_id === 'walk-in' || booking?.payment_mode === 'OFFLINE';
                
                return (
                  <button 
                    key={day.toISOString()+time} 
                    onClick={() => onSlotClick(day, time)}
                    className={`h-12 rounded-lg border transition-all relative group overflow-hidden ${
                      booking 
                        ? isMaintenance
                          ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 cursor-not-allowed opacity-70' // Blocked style
                          : isWalkIn
                            ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800' // Walk-in style
                            : 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' // Online style
                        : 'bg-white dark:bg-gray-800 border-dashed border-gray-200 dark:border-gray-700 hover:border-electric hover:bg-blue-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {booking ? (
                      <div className="w-full h-full flex items-center justify-center">
                        {isMaintenance ? (
                          <div className="flex flex-col items-center opacity-60">
                            <Lock size={14} className="text-gray-500"/>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            {isWalkIn ? <Store size={14} className="text-purple-600 dark:text-purple-400"/> : <Smartphone size={14} className="text-blue-600 dark:text-blue-400"/>}
                            <span className={`text-[9px] font-black uppercase ${isWalkIn ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400'}`}>
                              {isWalkIn ? 'Walk-in' : 'App'}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlusCircleIcon />
                      </div>
                    )}
                    
                    {/* Simple Stripe Pattern for blocked */}
                    {isMaintenance && (
                      <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#000_5px,#000_10px)] pointer-events-none"></div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlotScheduler;
