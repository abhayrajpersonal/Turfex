
import React, { useState, useMemo } from 'react';
import { X, Calendar, Repeat, Users, ShoppingBag, AlertCircle, UserCheck, Flag, Zap, Plus, Trash2, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Turf, Sport, Booking } from '../lib/types';
import Logo from './common/Logo';

interface BookingModalProps {
  turf: Turf;
  existingBookings: Booking[];
  onClose: () => void;
  onConfirm: (date: string, time: string, sport: Sport, addOns: string[], equipment: string[], price: number, splitWith: string[]) => void;
  onWaitlist: (date: string, time: string, sport: Sport) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ turf, existingBookings, onClose, onConfirm, onWaitlist }) => {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedSport, setSelectedSport] = useState<Sport>(turf.sports_supported[0]);
  
  // Features State
  const [isRecurring, setIsRecurring] = useState(false);
  const [isSplit, setIsSplit] = useState(false);
  const [splitUsers, setSplitUsers] = useState<string[]>([]);
  const [newSplitUser, setNewSplitUser] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const allSlots = [
    { time: '06:00 AM', period: 'Morning' }, { time: '07:00 AM', period: 'Morning' }, { time: '08:00 AM', period: 'Morning' },
    { time: '04:00 PM', period: 'Evening' }, { time: '05:00 PM', period: 'Evening' }, 
    { time: '06:00 PM', period: 'Night' }, { time: '07:00 PM', period: 'Night' }, { time: '08:00 PM', period: 'Night' }, { time: '09:00 PM', period: 'Night' }
  ];

  // Collision Detection
  const bookedSlots = useMemo(() => {
    return existingBookings
      .filter(b => 
        b.turf_id === turf.id && 
        new Date(b.start_time).toISOString().split('T')[0] === date &&
        b.status !== 'CANCELLED'
      )
      .map(b => {
        const d = new Date(b.start_time);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      });
  }, [existingBookings, turf.id, date]);

  const isSelectedSlotBooked = selectedSlot && bookedSlots.includes(selectedSlot);

  // Dynamic Pricing Logic
  const getSlotPrice = (slotTime: string) => {
      if (!slotTime) return turf.price_per_hour;
      const isPm = slotTime.includes('PM');
      const hour = parseInt(slotTime.split(':')[0]);
      const isPeak = isPm && (hour === 6 || hour === 7 || hour === 8 || hour === 9);
      return isPeak ? turf.price_per_hour * 1.2 : turf.price_per_hour;
  };

  const basePrice = selectedSlot ? getSlotPrice(selectedSlot) : turf.price_per_hour;
  const isPeakHour = basePrice > turf.price_per_hour;

  const equipmentCost = turf.rental_equipment.filter(e => selectedEquipment.includes(e.id)).reduce((acc, curr) => acc + curr.price, 0);
  const addOnCost = (selectedAddOns.includes('COACH') ? 500 : 0) + (selectedAddOns.includes('REFEREE') ? 300 : 0);
  const totalCost = basePrice + equipmentCost + addOnCost;
  const perPersonCost = isSplit && splitUsers.length > 0 ? Math.ceil(totalCost / (splitUsers.length + 1)) : totalCost;

  const handleConfirm = () => {
    if (selectedSlot) {
      if (isSelectedSlotBooked) {
        onWaitlist(date, selectedSlot, selectedSport);
      } else {
        onConfirm(date, selectedSlot, selectedSport, selectedAddOns, selectedEquipment, totalCost, isSplit ? splitUsers : []);
      }
    }
  };

  const addSplitUser = () => {
    if (newSplitUser.trim()) {
      setSplitUsers([...splitUsers, newSplitUser.trim()]);
      setNewSplitUser('');
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  // --- WIZARD STEPS CONTENT ---

  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <label className="block text-xs font-bold text-courtgray uppercase tracking-wider mb-3">Select Sport</label>
        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Select Sport">
          {turf.sports_supported.map(sport => (
            <button
              key={sport}
              role="radio"
              aria-checked={selectedSport === sport}
              onClick={() => setSelectedSport(sport)}
              className={`p-4 rounded-xl text-sm font-bold border transition-all duration-200 flex items-center justify-between outline-none focus-visible:ring-2 focus-visible:ring-electric ${selectedSport === sport ? 'bg-electric text-white border-transparent shadow-lg shadow-blue-500/30' : 'bg-offwhite dark:bg-gray-800 border-transparent text-midnight dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              {sport}
              {selectedSport === sport && <Check size={16} aria-hidden="true" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-courtgray uppercase tracking-wider mb-3">Date & Type</label>
        <div className="grid grid-cols-1 gap-4">
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-courtgray" size={20} aria-hidden="true" />
            <input 
              type="date" 
              value={date}
              onChange={(e) => { setDate(e.target.value); setSelectedSlot(null); }}
              aria-label="Booking Date"
              className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-700 bg-offwhite dark:bg-gray-800 text-midnight dark:text-white rounded-xl text-base font-medium focus:ring-2 focus:ring-electric/20 outline-none transition-all"
            />
          </div>
          <button 
            onClick={() => setIsRecurring(!isRecurring)}
            aria-pressed={isRecurring}
            className={`w-full py-4 px-4 rounded-xl text-sm font-medium border flex items-center justify-center gap-2 transition-all outline-none focus-visible:ring-2 focus-visible:ring-electric ${isRecurring ? 'bg-electric/10 border-electric text-electric' : 'bg-offwhite dark:bg-gray-800 border-transparent text-gray-600 dark:text-gray-300'}`}
           >
             <Repeat size={18} aria-hidden="true" />
             {isRecurring ? 'Recurring Booking (Weekly)' : 'One-time Booking'}
           </button>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => {
    // Group slots
    const groups = { Morning: [], Evening: [], Night: [] } as any;
    allSlots.forEach(s => groups[s.period].push(s.time));

    return (
      <div className="space-y-6 animate-fade-in-up">
        {Object.keys(groups).map(period => (
          <div key={period}>
            <h4 className="text-xs font-bold text-courtgray uppercase mb-3 flex items-center gap-2">
              {period === 'Morning' ? '🌅' : period === 'Evening' ? '🌇' : '🌙'} {period}
            </h4>
            <div className="grid grid-cols-3 gap-3" role="listbox" aria-label={`${period} Slots`}>
              {groups[period].map((slot: string) => {
                const isBooked = bookedSlots.includes(slot);
                const slotPrice = getSlotPrice(slot);
                const isSlotPeak = slotPrice > turf.price_per_hour;

                return (
                  <button
                    key={slot}
                    role="option"
                    aria-selected={selectedSlot === slot}
                    disabled={isBooked}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-3 px-1 rounded-xl text-sm font-medium text-center border transition-all relative overflow-hidden flex flex-col items-center justify-center min-h-[60px] outline-none focus-visible:ring-2 focus-visible:ring-electric ${
                      selectedSlot === slot
                        ? 'bg-electric text-white border-transparent shadow-lg scale-[1.02]'
                        : isBooked 
                            ? 'bg-gray-100 dark:bg-gray-800 text-courtgray border-transparent cursor-not-allowed' 
                            : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <span>{slot}</span>
                    {isSlotPeak && !isBooked && selectedSlot !== slot && (
                        <span className="text-[9px] text-orange-500 flex items-center gap-0.5 mt-0.5"><Zap size={8} className="fill-orange-500" aria-hidden="true"/> Peak</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {bookedSlots.length > 0 && <p className="text-xs text-orange-500 mt-2 flex items-center gap-1"><AlertCircle size={12}/> Slots marked gray are fully booked.</p>}
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in-up">
      {/* Add-ons */}
      {(turf.has_coach || turf.has_referee) && (
        <div>
           <label className="block text-xs font-bold text-courtgray uppercase tracking-wider mb-3">Match Staff</label>
           <div className="grid grid-cols-2 gap-3">
              {turf.has_coach && (
                  <button 
                       onClick={() => setSelectedAddOns(prev => prev.includes('COACH') ? prev.filter(x => x !== 'COACH') : [...prev, 'COACH'])} 
                       aria-pressed={selectedAddOns.includes('COACH')}
                       className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all text-left outline-none focus-visible:ring-2 focus-visible:ring-electric ${selectedAddOns.includes('COACH') ? 'bg-electric/10 border-electric' : 'border-gray-100 dark:border-gray-700 hover:bg-offwhite'}`}>
                     <div className={`p-2 rounded-lg ${selectedAddOns.includes('COACH') ? 'bg-electric text-white' : 'bg-offwhite text-courtgray'}`}><UserCheck size={20} /></div>
                     <div>
                        <p className="text-sm font-bold text-midnight dark:text-white">Coach</p>
                        <p className="text-xs text-courtgray">+₹500</p>
                     </div>
                  </button>
              )}
              {turf.has_referee && (
                  <button 
                       onClick={() => setSelectedAddOns(prev => prev.includes('REFEREE') ? prev.filter(x => x !== 'REFEREE') : [...prev, 'REFEREE'])}
                       aria-pressed={selectedAddOns.includes('REFEREE')}
                       className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all text-left outline-none focus-visible:ring-2 focus-visible:ring-electric ${selectedAddOns.includes('REFEREE') ? 'bg-orange-50 border-orange-500' : 'border-gray-100 dark:border-gray-700 hover:bg-offwhite'}`}>
                     <div className={`p-2 rounded-lg ${selectedAddOns.includes('REFEREE') ? 'bg-orange-500 text-white' : 'bg-offwhite text-courtgray'}`}><Flag size={20} /></div>
                     <div>
                        <p className="text-sm font-bold text-midnight dark:text-white">Referee</p>
                        <p className="text-xs text-courtgray">+₹300</p>
                     </div>
                  </button>
              )}
           </div>
        </div>
      )}

      {/* Equipment */}
      {turf.rental_equipment.length > 0 && (
        <div>
          <label className="block text-xs font-bold text-courtgray uppercase tracking-wider mb-3">Rent Equipment</label>
          <div className="space-y-2">
            {turf.rental_equipment.map(item => (
              <button key={item.id} 
                onClick={() => setSelectedEquipment(prev => prev.includes(item.id) ? prev.filter(x => x !== item.id) : [...prev, item.id])}
                aria-pressed={selectedEquipment.includes(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all text-left outline-none focus-visible:ring-2 focus-visible:ring-electric ${
                  selectedEquipment.includes(item.id) 
                    ? 'bg-electric/10 border-electric' 
                    : 'border-gray-100 dark:border-gray-700 hover:bg-offwhite dark:hover:bg-gray-800'
                }`}
              >
                 <div className="flex items-center gap-3">
                    <span className="text-2xl" aria-hidden="true">{item.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-midnight dark:text-white">{item.name}</p>
                      <p className="text-xs text-courtgray dark:text-gray-400">+₹{item.price}</p>
                    </div>
                 </div>
                 {selectedEquipment.includes(item.id) && <div className="bg-electric text-white p-1 rounded-full"><Check size={12}/></div>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Split */}
      <div className="bg-offwhite dark:bg-gray-800 p-4 rounded-xl">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-gray-700 rounded-lg text-electric shadow-sm"><Users size={18} /></div>
                <div>
                <p className="text-sm font-bold text-midnight dark:text-white">Split Payment</p>
                <p className="text-xs text-courtgray dark:text-gray-400">Share cost with friends</p>
                </div>
            </div>
            <button 
                onClick={() => setIsSplit(!isSplit)}
                role="switch"
                aria-checked={isSplit}
                aria-label="Toggle split payment"
                className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-electric ${isSplit ? 'bg-electric' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${isSplit ? 'translate-x-5' : ''}`} />
            </button>
        </div>
        {isSplit && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fade-in-up">
                <div className="flex gap-2 mb-3">
                    <input 
                    type="text" 
                    placeholder="Enter phone or name"
                    value={newSplitUser}
                    onChange={(e) => setNewSplitUser(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-electric/20 outline-none"
                    />
                    <button 
                    onClick={addSplitUser}
                    aria-label="Add user to split"
                    className="bg-electric text-white p-2 rounded-lg hover:bg-blue-600 shadow-lg shadow-blue-500/30 outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                    <Plus size={18} aria-hidden="true" />
                    </button>
                </div>
                {splitUsers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                    {splitUsers.map((user, idx) => (
                        <div key={idx} className="flex items-center text-xs font-bold bg-white dark:bg-gray-700 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm text-midnight dark:text-white">
                        <span className="mr-2">{user}</span>
                        <button onClick={() => setSplitUsers(splitUsers.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700 outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded" aria-label={`Remove ${user}`}>
                            <X size={12} aria-hidden="true" />
                        </button>
                        </div>
                    ))}
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
     <div className="space-y-6 animate-fade-in-up text-center">
         <div className="bg-offwhite dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
             <div className="flex justify-center mb-4">
               <Logo size={40} showWordmark={false} />
             </div>
             <h4 className="text-courtgray dark:text-gray-400 text-sm uppercase tracking-wider mb-2">Total Amount</h4>
             <h1 className="text-5xl font-display font-black text-midnight dark:text-white">₹{totalCost}</h1>
             
             {isSplit && splitUsers.length > 0 && (
                 <div className="mt-4 inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold">
                    <Users size={12} aria-hidden="true" /> ₹{perPersonCost} / person
                 </div>
             )}

             <div className="mt-8 space-y-3">
                 <div className="flex justify-between text-sm">
                    <span className="text-courtgray">Turf Fee</span>
                    <span className="font-bold text-midnight dark:text-white">₹{basePrice}</span>
                 </div>
                 {equipmentCost > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-courtgray">Equipment</span>
                        <span className="font-bold text-midnight dark:text-white">+₹{equipmentCost}</span>
                    </div>
                 )}
                 {addOnCost > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-courtgray">Staff</span>
                        <span className="font-bold text-midnight dark:text-white">+₹{addOnCost}</span>
                    </div>
                 )}
             </div>
         </div>

         <div className="flex flex-col gap-2 text-sm text-courtgray">
             <p>{turf.name} • {selectedSport}</p>
             <p>{new Date(date).toLocaleDateString()} • {selectedSlot}</p>
         </div>
     </div>
  );

  return (
    <div className="fixed inset-0 bg-midnight/80 z-50 flex items-center justify-center p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title">
      <div className="bg-white/95 dark:bg-darkcard/95 backdrop-blur-xl rounded-3xl w-full max-w-md overflow-hidden animate-scale-in max-h-[90vh] flex flex-col shadow-2xl border border-white/20 dark:border-gray-700">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-offwhite/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
             {step > 1 && <button onClick={prevStep} aria-label="Go back" className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-electric"><ArrowLeft size={18} className="text-midnight dark:text-white"/></button>}
             <div>
                <h3 id="booking-modal-title" className="font-bold text-lg text-midnight dark:text-white leading-none">Step {step} of 4</h3>
                <span className="text-xs text-courtgray dark:text-gray-400">
                    {step === 1 ? 'Date & Sport' : step === 2 ? 'Select Slot' : step === 3 ? 'Customize' : 'Payment'}
                </span>
             </div>
          </div>
          <button onClick={onClose} aria-label="Close booking modal" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-midnight dark:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-electric"><X size={20} /></button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-gray-100 dark:bg-gray-800">
            <div className="h-full bg-electric transition-all duration-500" style={{ width: `${step * 25}%` }} />
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 relative">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-darkcard">
             {step < 4 ? (
                 <button 
                    onClick={nextStep}
                    disabled={step === 2 && !selectedSlot}
                    className="w-full bg-midnight dark:bg-white text-white dark:text-midnight font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 outline-none focus-visible:ring-2 focus-visible:ring-electric min-h-[48px]"
                 >
                    Next Step <ArrowRight size={18} aria-hidden="true" />
                 </button>
             ) : (
                 <button 
                    onClick={handleConfirm}
                    className={`w-full text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-electric min-h-[48px] ${isSelectedSlotBooked ? 'bg-orange-500 shadow-orange-500/30' : 'bg-electric shadow-blue-500/30'}`}
                 >
                    {isSelectedSlotBooked ? 'Join Waitlist' : `Pay ₹${perPersonCost}`}
                 </button>
             )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
