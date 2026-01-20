
import React, { useState, useMemo } from 'react';
import { X, Calendar, Repeat, Users, ShoppingBag, AlertCircle, UserCheck, Flag, Zap, Plus, Trash2, ArrowRight, ArrowLeft, Check, Link, Copy, Search, Loader2 } from 'lucide-react';
import { Turf, Sport, Booking } from '../lib/types';
import Logo from './common/Logo';
import CustomCalendar from './common/CustomCalendar';
import { useUI } from '../context/UIContext';
import { MOCK_SEARCHABLE_USERS } from '../lib/mockData';

interface BookingModalProps {
  turf: Turf;
  existingBookings: Booking[];
  onClose: () => void;
  onConfirm: (date: string, time: string, sport: Sport, addOns: string[], equipment: string[], price: number, splitWith: string[]) => void;
  onWaitlist: (date: string, time: string, sport: Sport) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ turf, existingBookings, onClose, onConfirm, onWaitlist }) => {
  const { showToast } = useUI();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedSport, setSelectedSport] = useState<Sport>(turf.sports_supported[0]);
  
  // Features State
  const [isRecurring, setIsRecurring] = useState(false);
  const [isSplit, setIsSplit] = useState(false);
  
  // Enhanced Split User State
  const [splitUsers, setSplitUsers] = useState<{ name: string; avatar?: string; isVerified: boolean }[]>([]);
  const [newSplitUser, setNewSplitUser] = useState('');
  const [isSearchingUser, setIsSearchingUser] = useState(false);
  const [splitLinkCopied, setSplitLinkCopied] = useState(false);

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
  
  const equipmentCost = turf.rental_equipment.filter(e => selectedEquipment.includes(e.id)).reduce((acc, curr) => acc + curr.price, 0);
  const addOnCost = (selectedAddOns.includes('COACH') ? 500 : 0) + (selectedAddOns.includes('REFEREE') ? 300 : 0);
  const totalCost = basePrice + equipmentCost + addOnCost;
  const perPersonCost = isSplit && splitUsers.length > 0 ? Math.ceil(totalCost / (splitUsers.length + 1)) : totalCost;

  const handleConfirm = () => {
    if (selectedSlot) {
      if (isSelectedSlotBooked) {
        onWaitlist(date, selectedSlot, selectedSport);
      } else {
        onConfirm(
            date, 
            selectedSlot, 
            selectedSport, 
            selectedAddOns, 
            selectedEquipment, 
            totalCost, 
            isSplit ? splitUsers.map(u => u.name) : []
        );
      }
    }
  };

  const findUserByUsername = (username: string) => {
    const term = username.toLowerCase().replace('@', '');
    return MOCK_SEARCHABLE_USERS.find(u => u.username.toLowerCase() === term);
  };

  const addSplitUser = () => {
    if (!newSplitUser.trim()) return;
    const rawInput = newSplitUser.trim();
    
    if (splitUsers.some(u => u.name.toLowerCase() === rawInput.toLowerCase() || u.name.toLowerCase() === `@${rawInput.toLowerCase()}`)) {
        showToast("User already added", 'error');
        return;
    }

    setIsSearchingUser(true);
    
    setTimeout(() => {
        const foundUser = findUserByUsername(rawInput);
        if (foundUser) {
            setSplitUsers([...splitUsers, { name: `@${foundUser.username}`, avatar: foundUser.avatar, isVerified: true }]);
            showToast(`Added ${foundUser.username}`);
        } else {
            // Fallback for phone numbers or unknown users
            setSplitUsers([...splitUsers, { name: rawInput, isVerified: false }]);
        }
        setNewSplitUser('');
        setIsSearchingUser(false);
    }, 400);
  };

  const copySplitLink = () => {
    navigator.clipboard.writeText(`https://turfex.app/pay/split/${Math.random().toString(36).substring(7)}`);
    setSplitLinkCopied(true);
    showToast("Split link copied!");
    setTimeout(() => setSplitLinkCopied(false), 2000);
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
        <label className="block text-xs font-bold text-courtgray uppercase tracking-wider mb-3">Select Date</label>
        <CustomCalendar 
           selectedDate={date} 
           onSelect={(d) => { setDate(d); setSelectedSlot(null); }} 
           minDate={new Date().toISOString().split('T')[0]} 
        />
        <button 
          onClick={() => setIsRecurring(!isRecurring)}
          aria-pressed={isRecurring}
          className={`w-full mt-4 py-3 px-4 rounded-xl text-sm font-medium border flex items-center justify-center gap-2 transition-all outline-none focus-visible:ring-2 focus-visible:ring-electric ${isRecurring ? 'bg-electric/10 border-electric text-electric' : 'bg-offwhite dark:bg-gray-800 border-transparent text-gray-600 dark:text-gray-300'}`}
          >
            <Repeat size={16} aria-hidden="true" />
            {isRecurring ? 'Recurring Booking (Weekly)' : 'One-time Booking'}
        </button>
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
            {/* Improved grid layout for better spacing on mobile */}
            <div className="grid grid-cols-3 md:grid-cols-3 gap-2" role="listbox" aria-label={`${period} Slots`}>
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
                    className={`py-3 px-1 rounded-xl text-sm font-medium text-center border transition-all relative overflow-hidden flex flex-col items-center justify-center min-h-[50px] outline-none focus-visible:ring-2 focus-visible:ring-electric ${
                      selectedSlot === slot
                        ? 'bg-electric text-white border-transparent shadow-lg scale-[1.02]'
                        : isBooked 
                            ? 'bg-gray-100 dark:bg-gray-800 text-courtgray border-transparent cursor-not-allowed opacity-50' 
                            : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <span>{slot.replace(' AM', '').replace(' PM', '')} <span className="text-[10px]">{slot.slice(-2)}</span></span>
                    {isSlotPeak && !isBooked && selectedSlot !== slot && (
                        <span className="absolute top-0.5 right-0.5 text-[8px] text-orange-500"><Zap size={8} className="fill-orange-500" aria-hidden="true"/></span>
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
    <div className="space-y-6 animate-fade-in-up pb-10">
      {/* Add-ons */}
      {(turf.has_coach || turf.has_referee) && (
        <div>
           <label className="block text-xs font-bold text-courtgray uppercase tracking-wider mb-3">Match Staff</label>
           <div className="grid grid-cols-2 gap-3">
              {turf.has_coach && (
                  <button 
                       onClick={() => setSelectedAddOns(prev => prev.includes('COACH') ? prev.filter(x => x !== 'COACH') : [...prev, 'COACH'])} 
                       aria-pressed={selectedAddOns.includes('COACH')}
                       className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all text-left outline-none focus-visible:ring-2 focus-visible:ring-electric ${selectedAddOns.includes('COACH') ? 'bg-electric/10 border-electric' : 'border-gray-100 dark:border-gray-700 hover:bg-offwhite dark:hover:bg-gray-800'}`}>
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
                       className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all text-left outline-none focus-visible:ring-2 focus-visible:ring-electric ${selectedAddOns.includes('REFEREE') ? 'bg-orange-50 border-orange-500' : 'border-gray-100 dark:border-gray-700 hover:bg-offwhite dark:hover:bg-gray-800'}`}>
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
                
                {/* Username Search Input */}
                <div className="flex gap-2 mb-3">
                    <input 
                    type="text" 
                    placeholder="Enter @username or phone"
                    value={newSplitUser}
                    onChange={(e) => setNewSplitUser(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSplitUser()}
                    disabled={isSearchingUser}
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-electric/20 outline-none disabled:opacity-70"
                    />
                    <button 
                    onClick={addSplitUser}
                    disabled={isSearchingUser}
                    aria-label="Add user to split"
                    className="bg-electric text-white p-2 rounded-lg hover:bg-blue-600 shadow-lg shadow-blue-500/30 outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-70"
                    >
                    {isSearchingUser ? <Loader2 size={18} className="animate-spin"/> : <Plus size={18} aria-hidden="true" />}
                    </button>
                </div>

                {/* Added Users List */}
                {splitUsers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                    {splitUsers.map((user, idx) => (
                        <div key={idx} className="flex items-center text-xs font-bold bg-white dark:bg-gray-700 pr-2 pl-1 py-1 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm text-midnight dark:text-white animate-scale-in">
                        {user.avatar ? (
                            <img src={user.avatar} className="w-5 h-5 rounded-full mr-2" alt={user.name} />
                        ) : (
                            <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-600 mr-2 flex items-center justify-center text-[8px]">{user.name.charAt(0).toUpperCase()}</div>
                        )}
                        <span className="mr-2">{user.name}</span>
                        <button onClick={() => setSplitUsers(splitUsers.filter((_, i) => i !== idx))} className="text-gray-400 hover:text-red-500 outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-full" aria-label={`Remove ${user.name}`}>
                            <X size={12} aria-hidden="true" />
                        </button>
                        </div>
                    ))}
                    </div>
                )}

                <p className="text-xs text-center text-gray-400 mb-3">- OR -</p>

                <div className="flex gap-2">
                    <button 
                      onClick={copySplitLink}
                      className="flex-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg py-2 px-3 text-sm text-midnight dark:text-white flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      {splitLinkCopied ? <Check size={16} className="text-green-500" /> : <Link size={16} />}
                      {splitLinkCopied ? 'Link Copied' : 'Copy Split Link'}
                    </button>
                </div>
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
                 <div className="mt-4 flex flex-col items-center gap-2">
                     <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold">
                        <Users size={12} aria-hidden="true" /> ₹{perPersonCost} / person
                     </div>
                     <div className="flex -space-x-2 mt-1">
                         <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[8px] font-bold">YOU</div>
                         {splitUsers.slice(0, 4).map((u, i) => (
                             <img key={i} src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=random`} className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800" alt={u.name}/>
                         ))}
                         {splitUsers.length > 4 && (
                             <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[8px] font-bold">+{splitUsers.length - 4}</div>
                         )}
                     </div>
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
    // Responsive: Center modal on MD+, Bottom Sheet on SM/Mobile
    <div className="fixed inset-0 bg-midnight/80 z-[80] flex items-end md:items-center justify-center sm:p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title">
      <div className="bg-white/95 dark:bg-darkcard/95 backdrop-blur-xl rounded-t-3xl md:rounded-3xl w-full max-w-md overflow-hidden animate-fade-in-up h-[90vh] md:h-auto md:max-h-[90vh] flex flex-col shadow-2xl border-t md:border border-white/20 dark:border-gray-700">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-offwhite/50 dark:bg-gray-800/50 shrink-0">
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
        <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 shrink-0">
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
        <div className="p-5 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-darkcard shrink-0 pb-safe-bottom">
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
