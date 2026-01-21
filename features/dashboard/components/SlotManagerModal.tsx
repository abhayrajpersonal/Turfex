
import React, { useState } from 'react';
import { X, Store, Lock, User, Shield, Check, CreditCard, CalendarDays } from 'lucide-react';
import { Sport } from '../../../lib/types';

interface SlotManagerModalProps {
  selectedSlots: { date: Date, time: string }[];
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const SlotManagerModal: React.FC<SlotManagerModalProps> = ({ selectedSlots, onClose, onSubmit }) => {
  const [mode, setMode] = useState<'BOOKING' | 'BLOCK'>('BOOKING');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedSport, setSelectedSport] = useState<Sport>(Sport.FOOTBALL);
  const [price, setPrice] = useState(1200);
  const [blockReason, setBlockReason] = useState('Maintenance');
  const [paymentStatus, setPaymentStatus] = useState<'PAID' | 'PENDING'>('PAID');

  const isBulk = selectedSlots.length > 1;

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const payload = selectedSlots.map(slot => {
          const startTime = new Date(slot.date);
          const [hours, minutes] = slot.time.split(':').map(Number);
          startTime.setHours(hours, minutes);

          return {
            start_time: startTime.toISOString(),
            sport: selectedSport,
            status: mode === 'BLOCK' ? 'MAINTENANCE' : 'CONFIRMED',
            price: mode === 'BLOCK' ? 0 : price,
            payment_mode: mode === 'BLOCK' ? 'NONE' : 'OFFLINE',
            payment_status: paymentStatus,
            details: mode === 'BLOCK' ? blockReason : { name: customerName, phone: customerPhone }
          };
      });

      // Pass the array of bookings/blocks back to parent
      onSubmit(payload);
  };

  // Calculate total price if booking
  const totalPrice = price * selectedSlots.length;

  return (
       <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in-up">
           <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-gray-200 dark:border-zinc-800">
               {/* Header */}
               <div className="bg-zinc-100 dark:bg-black p-6 flex justify-between items-start border-b border-gray-200 dark:border-zinc-800">
                   <div>
                       <h3 className="text-xl font-bold text-midnight dark:text-white flex items-center gap-2">
                           {isBulk ? <LayersIcon count={selectedSlots.length} /> : <CalendarDays size={20} className="text-electric"/>}
                           {isBulk ? `Manage ${selectedSlots.length} Slots` : 'Manage Slot'}
                       </h3>
                       <div className="flex flex-wrap gap-2 mt-2">
                           {selectedSlots.slice(0, 3).map((s, i) => (
                               <span key={i} className="text-[10px] font-mono font-bold bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 px-2 py-1 rounded text-gray-500">
                                   {s.date.toLocaleDateString('en-US', {weekday: 'short'})} {s.time}
                               </span>
                           ))}
                           {selectedSlots.length > 3 && <span className="text-[10px] text-gray-400 self-center">+{selectedSlots.length - 3} more</span>}
                       </div>
                   </div>
                   <button onClick={onClose} className="p-2 bg-gray-200 dark:bg-zinc-800 rounded-full hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors"><X size={20}/></button>
               </div>
               
               {/* Tabs */}
               <div className="p-4 bg-white dark:bg-zinc-900">
                   <div className="flex bg-gray-100 dark:bg-zinc-950 p-1 rounded-xl border border-gray-200 dark:border-zinc-800">
                       <button 
                         onClick={() => setMode('BOOKING')}
                         className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${mode === 'BOOKING' ? 'bg-white dark:bg-zinc-800 shadow-sm text-midnight dark:text-white border border-gray-200 dark:border-zinc-700' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                       >
                           <Store size={16} className={mode === 'BOOKING' ? 'text-blue-500' : ''} /> New Booking
                       </button>
                       <button 
                         onClick={() => setMode('BLOCK')}
                         className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${mode === 'BLOCK' ? 'bg-white dark:bg-zinc-800 shadow-sm text-midnight dark:text-white border border-gray-200 dark:border-zinc-700' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                       >
                           <Lock size={16} className={mode === 'BLOCK' ? 'text-red-500' : ''} /> Maintenance / Block
                       </button>
                   </div>
               </div>

               {/* Content */}
               <div className="p-6 overflow-y-auto flex-1 bg-white dark:bg-zinc-900">
                   <form id="booking-form" onSubmit={handleSubmit} className="space-y-6">
                       {mode === 'BOOKING' ? (
                           <>
                               <div className="space-y-4">
                                   <div>
                                       <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Customer Info</label>
                                       <div className="space-y-3">
                                           <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 p-3.5 rounded-xl focus-within:ring-2 focus-within:ring-electric transition-all">
                                               <User size={18} className="text-gray-400" />
                                               <input 
                                                 required
                                                 autoFocus
                                                 placeholder="Customer Name" 
                                                 className="bg-transparent w-full outline-none text-sm font-bold text-midnight dark:text-white placeholder-gray-400"
                                                 value={customerName}
                                                 onChange={e => setCustomerName(e.target.value)}
                                               />
                                           </div>
                                           <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 p-3.5 rounded-xl focus-within:ring-2 focus-within:ring-electric transition-all">
                                               <span className="text-sm font-bold text-gray-400 pl-1">+91</span>
                                               <input 
                                                 type="tel"
                                                 placeholder="Phone Number (Optional)" 
                                                 className="bg-transparent w-full outline-none text-sm font-bold text-midnight dark:text-white placeholder-gray-400"
                                                 value={customerPhone}
                                                 onChange={e => setCustomerPhone(e.target.value)}
                                               />
                                           </div>
                                       </div>
                                   </div>
                               </div>

                               <div className="grid grid-cols-2 gap-4">
                                   <div>
                                       <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Details</label>
                                       <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 p-3.5 rounded-xl">
                                           <select 
                                              value={selectedSport}
                                              onChange={e => setSelectedSport(e.target.value as Sport)}
                                              className="w-full bg-transparent font-bold text-sm outline-none text-midnight dark:text-white"
                                           >
                                               {(Object.values(Sport) as string[]).map(s => <option key={s} value={s}>{s}</option>)}
                                           </select>
                                       </div>
                                   </div>
                                   <div>
                                       <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Price Per Slot (₹)</label>
                                       <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 p-3.5 rounded-xl flex items-center">
                                           <span className="text-gray-400 mr-1">₹</span>
                                           <input 
                                             type="number"
                                             value={price}
                                             onChange={e => setPrice(Number(e.target.value))}
                                             className="w-full bg-transparent font-bold text-sm outline-none text-midnight dark:text-white"
                                           />
                                       </div>
                                   </div>
                               </div>

                               {/* Payment Status Toggle */}
                               <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                   <div className="flex justify-between items-center mb-3">
                                       <label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-2">
                                           <CreditCard size={14}/> Payment Status
                                       </label>
                                       {isBulk && <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Total: ₹{totalPrice}</span>}
                                   </div>
                                   <div className="flex gap-2">
                                       <button 
                                           type="button"
                                           onClick={() => setPaymentStatus('PAID')}
                                           className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all border ${paymentStatus === 'PAID' ? 'bg-green-500 text-white border-green-500 shadow-md' : 'bg-white dark:bg-zinc-800 text-gray-500 border-gray-200 dark:border-zinc-700'}`}
                                       >
                                           PAID
                                       </button>
                                       <button 
                                           type="button"
                                           onClick={() => setPaymentStatus('PENDING')}
                                           className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all border ${paymentStatus === 'PENDING' ? 'bg-orange-500 text-white border-orange-500 shadow-md' : 'bg-white dark:bg-zinc-800 text-gray-500 border-gray-200 dark:border-zinc-700'}`}
                                       >
                                           PAY LATER
                                       </button>
                                   </div>
                               </div>
                           </>
                       ) : (
                           <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/30 text-center">
                               <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                   <Shield size={32} className="text-red-500" />
                               </div>
                               <h4 className="font-bold text-red-700 dark:text-red-400 text-lg mb-2">
                                   Block {isBulk ? `${selectedSlots.length} Slots` : 'this Slot'}?
                               </h4>
                               <p className="text-sm text-red-600/80 dark:text-red-300/70 mb-6 leading-relaxed">
                                   This will mark the selected time slots as unavailable for all users on the app.
                               </p>
                               <div className="text-left">
                                   <label className="block text-xs font-bold text-red-400 uppercase tracking-wider mb-2">Reason</label>
                                   <select 
                                      value={blockReason} 
                                      onChange={e => setBlockReason(e.target.value)}
                                      className="w-full bg-white dark:bg-zinc-950 p-3 rounded-xl border border-red-200 dark:border-red-900/50 font-bold text-sm outline-none focus:ring-2 focus:ring-red-500 text-midnight dark:text-white"
                                   >
                                       <option>Maintenance</option>
                                       <option>Private Event</option>
                                       <option>Coaching Camp</option>
                                       <option>Weather Issue</option>
                                       <option>Other</option>
                                   </select>
                               </div>
                           </div>
                       )}
                   </form>
               </div>
               
               <div className="p-6 border-t border-gray-200 dark:border-zinc-800 flex gap-3 bg-gray-50 dark:bg-zinc-950">
                   <button onClick={onClose} className="flex-1 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors">Cancel</button>
                   <button 
                     onClick={handleSubmit} 
                     className={`flex-[2] py-3.5 rounded-xl font-bold text-white shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 ${mode === 'BOOKING' ? 'bg-midnight dark:bg-white dark:text-midnight' : 'bg-red-500 hover:bg-red-600'}`}
                   >
                       {mode === 'BOOKING' ? <><Check size={18}/> Confirm Booking</> : <><Lock size={18}/> Block {isBulk ? 'Slots' : 'Slot'}</>}
                   </button>
               </div>
           </div>
       </div>
  );
};

const LayersIcon = ({ count }: { count: number }) => (
    <div className="relative w-6 h-6 flex items-center justify-center">
        <div className="absolute top-0 right-0 bg-electric text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-black z-10">{count}</div>
        <Store size={20} className="text-gray-400" />
    </div>
);

export default SlotManagerModal;
