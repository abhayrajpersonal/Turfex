
import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Lock, Smartphone, Store, Check } from 'lucide-react';
import { Booking } from '../../../lib/types';
import { formatDate } from '../../../lib/utils';

interface SlotSchedulerProps {
  schedulerDate: Date;
  changeWeek: (offset: number) => void;
  weekDays: Date[];
  timeSlots: string[];
  bookings: Booking[];
  onSlotClick: (date: Date, time: string) => void;
  isBulkMode: boolean;
  selectedSlots: string[]; // "YYYY-MM-DD|HH:MM"
  onBulkAction: () => void;
}

const PlusCircleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-electric opacity-50"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
);

const SlotScheduler: React.FC<SlotSchedulerProps> = ({ 
  schedulerDate, changeWeek, weekDays, timeSlots, bookings, onSlotClick,
  isBulkMode, selectedSlots, onBulkAction 
}) => {
  
  const getBookingForSlot = (day: Date, time: string) => {
    const dateStr = formatDate(day);
    return bookings.find(b => {
        const bDate = new Date(b.start_time);
        const bDateStr = formatDate(bDate);
        const bTimeStr = bDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        return bDateStr === dateStr && bTimeStr.startsWith(time.split(':')[0]) && b.status !== 'CANCELLED';
    });
  };

  const getSlotId = (date: Date, time: string) => `${formatDate(date)}|${time}`;

  return (
    <div className="bg-white dark:bg-darkcard p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative">
      {/* Floating Bulk Action Bar */}
      {isBulkMode && selectedSlots.length > 0 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-midnight dark:bg-white text-white dark:text-black py-3 px-6 rounded-full shadow-2xl flex items-center gap-4 animate-scale-in border border-zinc-700 dark:border-zinc-200">
              <span className="font-bold text-sm flex items-center gap-2"><Check size={16} className="text-volt dark:text-blue-600"/> {selectedSlots.length} Selected</span>
              <div className="w-px h-4 bg-gray-500"></div>
              <button onClick={onBulkAction} className="font-bold text-sm hover:text-volt dark:hover:text-blue-600 transition-colors uppercase tracking-wide">Manage Slots</button>
          </div>
      )}

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
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-600"></div> App</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-600"></div> Walk-in</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-[repeating-linear-gradient(45deg,#374151,#374151_5px,#1f2937_5px,#1f2937_10px)] border border-gray-600"></div> Blocked</div>
        </div>
      </div>

      <div className="overflow-x-auto pb-8">
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
                
                const slotId = getSlotId(day, time);
                const isSelected = selectedSlots.includes(slotId);
                const isSelectable = !booking; // Only empty slots selectable in bulk mode for now

                return (
                  <button 
                    key={slotId} 
                    onClick={() => onSlotClick(day, time)}
                    disabled={isBulkMode && !isSelectable}
                    className={`h-12 rounded-lg border transition-all relative group overflow-hidden ${
                      isSelected 
                        ? 'border-2 border-volt bg-volt/10 z-10 scale-105 shadow-lg' 
                        : booking 
                            ? isMaintenance
                                ? 'bg-gray-200 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 opacity-80' // Base for blocked
                                : isWalkIn
                                    ? 'bg-purple-600 border-purple-700' // Walk-in style
                                    : 'bg-blue-600 border-blue-700' // Online style
                            : 'bg-white dark:bg-zinc-900/50 border-dashed border-gray-200 dark:border-zinc-800 hover:border-electric hover:bg-blue-50 dark:hover:bg-zinc-800'
                    } ${isBulkMode && isSelectable && !isSelected ? 'hover:border-volt hover:bg-volt/5' : ''}`}
                  >
                    {/* Maintenance Pattern Overlay */}
                    {isMaintenance && (
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.1)_10px,rgba(0,0,0,0.1)_20px)] dark:bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_20px)]"></div>
                    )}

                    {booking ? (
                      <div className="w-full h-full flex items-center justify-center relative z-10">
                        {isMaintenance ? (
                          <div className="flex flex-col items-center">
                            <Lock size={14} className="text-gray-500 dark:text-gray-400"/>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-white">
                            {isWalkIn ? <Store size={14} className="opacity-90"/> : <Smartphone size={14} className="opacity-90"/>}
                            <span className="text-[9px] font-black uppercase opacity-90 tracking-wider">
                              {isWalkIn ? 'Walk-in' : 'App'}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        {isBulkMode ? (
                            <div className={`absolute top-2 right-2 w-4 h-4 rounded border-2 flex items-center justify-center ${isSelected ? 'bg-volt border-volt' : 'border-gray-300 dark:border-zinc-700'}`}>
                                {isSelected && <Check size={10} className="text-black" strokeWidth={4} />}
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <PlusCircleIcon />
                            </div>
                        )}
                      </>
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
