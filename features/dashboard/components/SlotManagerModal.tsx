
import React, { useState } from 'react';
import { X, Clock, Store, Lock, User, Shield, Check, CreditCard } from 'lucide-react';
import { Sport } from '../../../lib/types';

interface SlotManagerModalProps {
  selectedSlot: { date: Date, time: string };
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const SlotManagerModal: React.FC<SlotManagerModalProps> = ({ selectedSlot, onClose, onSubmit }) => {
  const [mode, setMode] = useState<'BOOKING' | 'BLOCK'>('BOOKING');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedSport, setSelectedSport] = useState<Sport>(Sport.FOOTBALL);
  const [price, setPrice] = useState(1200);
  const [blockReason, setBlockReason] = useState('Maintenance');
  const [paymentStatus, setPaymentStatus] = useState<'PAID' | 'PENDING'>('PAID');

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const startTime = new Date(selectedSlot.date);
      const [hours, minutes] = selectedSlot.time.split(':').map(Number);
      startTime.setHours(hours, minutes);

      const payload = {
        start_time: startTime.toISOString(),
        sport: selectedSport,
        status: mode === 'BLOCK' ? 'MAINTENANCE' : 'CONFIRMED',
        price: mode === 'BLOCK' ? 0 : price,
        payment_mode: mode === 'BLOCK' ? 'NONE' : 'OFFLINE',
        payment_status: paymentStatus,
        details: mode === 'BLOCK' ? blockReason : { name: customerName, phone: customerPhone }
      };

      onSubmit(payload);
  };

  return (
       <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in-up">
           <div className="bg-white dark:bg-darkcard rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
               <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 flex justify-between items-start text-white">
                   <div>
                       <h3 className="text-xl font-bold">Manage Slot</h3>
                       <p className="text-sm opacity-70 font-medium mt-1 flex items-center gap-2">
                           <Clock size={14}/> {selectedSlot.date.toDateString()}, {selectedSlot.time}
                       </p>
                   </div>
                   <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><X size={20}/></button>
               </div>
               
               <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                   <div className="flex bg-gray-200 dark:bg-gray-700 p-1 rounded-xl">
                       <button 
                         onClick={() => setMode('BOOKING')}
                         className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${mode === 'BOOKING' ? 'bg-white dark:bg-darkcard shadow-sm text-midnight dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                       >
                           <Store size={16} /> New Booking
                       </button>
                       <button 
                         onClick={() => setMode('BLOCK')}
                         className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${mode === 'BLOCK' ? 'bg-white dark:bg-darkcard shadow-sm text-red-500' : 'text-gray-500 hover:text-gray-700'}`}
                       >
                           <Lock size={16} /> Block Slot
                       </button>
                   </div>
               </div>

               <div className="p-6 overflow-y-auto flex-1">
                   <form id="booking-form" onSubmit={handleSubmit} className="space-y-5">
                       {mode === 'BOOKING' ? (
                           <>
                               <div className="space-y-4">
                                   <div>
                                       <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Customer Info</label>
                                       <div className="space-y-3">
                                           <div className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl focus-within:ring-2 focus-within:ring-electric transition-all shadow-sm">
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
                                           <div className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl focus-within:ring-2 focus-within:ring-electric transition-all shadow-sm">
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
                                       <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl shadow-sm">
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
                                       <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Price (₹)</label>
                                       <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl shadow-sm flex items-center">
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
                                   <div className="flex justify-between items-center mb-2">
                                       <label className="text-xs font-bold text-blue-500 uppercase tracking-wider flex items-center gap-2">
                                           <CreditCard size={14}/> Payment Status
                                       </label>
                                   </div>
                                   <div className="flex gap-2">
                                       <button 
                                           type="button"
                                           onClick={() => setPaymentStatus('PAID')}
                                           className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${paymentStatus === 'PAID' ? 'bg-green-500 text-white border-green-500 shadow-md' : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700'}`}
                                       >
                                           PAID
                                       </button>
                                       <button 
                                           type="button"
                                           onClick={() => setPaymentStatus('PENDING')}
                                           className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${paymentStatus === 'PENDING' ? 'bg-orange-500 text-white border-orange-500 shadow-md' : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700'}`}
                                       >
                                           PAY LATER
                                       </button>
                                   </div>
                               </div>
                           </>
                       ) : (
                           <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/30 text-center">
                               <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                   <Shield size={32} className="text-red-500" />
                               </div>
                               <h4 className="font-bold text-red-700 dark:text-red-300 text-lg mb-2">Block this Slot?</h4>
                               <p className="text-sm text-red-600/80 dark:text-red-300/70 mb-6 leading-relaxed">
                                   This will mark the slot as unavailable for all users on the app. Use this for maintenance or private events.
                               </p>
                               <div className="text-left">
                                   <label className="block text-xs font-bold text-red-400 uppercase tracking-wider mb-2">Reason</label>
                                   <select 
                                      value={blockReason} 
                                      onChange={e => setBlockReason(e.target.value)}
                                      className="w-full bg-white dark:bg-gray-800 p-3 rounded-xl border border-red-200 dark:border-red-900/50 font-bold text-sm outline-none focus:ring-2 focus:ring-red-500 text-midnight dark:text-white"
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
               
               <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex gap-3 bg-gray-50 dark:bg-gray-800/50">
                   <button onClick={onClose} className="flex-1 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                   <button 
                     onClick={handleSubmit} 
                     className={`flex-[2] py-3.5 rounded-xl font-bold text-white shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 ${mode === 'BOOKING' ? 'bg-midnight dark:bg-white dark:text-midnight' : 'bg-red-500 hover:bg-red-600'}`}
                   >
                       {mode === 'BOOKING' ? <><Check size={18}/> Confirm Booking</> : <><Lock size={18}/> Block Slot</>}
                   </button>
               </div>
           </div>
       </div>
  );
};

export default SlotManagerModal;
