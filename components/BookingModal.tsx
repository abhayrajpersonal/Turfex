
import React, { useState, useMemo, useEffect } from 'react';
import { X, Users, AlertCircle, ShieldCheck, Plus, ArrowRight, ArrowLeft, Skull, Wallet, Loader2 } from 'lucide-react';
import { Turf, Sport, Booking, CorporateDetails } from '../lib/types';
import CustomCalendar from './common/CustomCalendar';
import PaymentReceipt from './booking/PaymentReceipt';
import { useUI } from '../context/UIContext';
import { api } from '../services/api';

interface BookingModalProps {
  turf: Turf;
  existingBookings: Booking[]; // Kept for interface compatibility
  onClose: () => void;
  onConfirm: (date: string, time: string, sport: Sport, addOns: string[], equipment: string[], price: number, splitWith: string[], paymentMode?: string, corporateDetails?: CorporateDetails, hasInsurance?: boolean) => void;
  onWaitlist: (date: string, time: string, sport: Sport, bidAmount?: number) => void;
  initialDate?: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ turf, onClose, onConfirm, onWaitlist, initialDate }) => {
  const { showToast } = useUI();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedSport, setSelectedSport] = useState<Sport>(turf.sports_supported[0]);
  
  // Slot Availability State
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Features State
  const [isSplit, setIsSplit] = useState(false);
  const [isLoserPays, setIsLoserPays] = useState(false);
  const [isCorporate, setIsCorporate] = useState(false);
  const [corporateName, setCorporateName] = useState('');
  const [corporateGST, setCorporateGST] = useState('');
  const [hasInsurance, setHasInsurance] = useState(false);
  
  const [isBidding, setIsBidding] = useState(false);
  const [bidAmount, setBidAmount] = useState(0);
  
  const [splitUsers, setSplitUsers] = useState<{ name: string; avatar?: string; isVerified: boolean }[]>([]);
  const [newSplitUser, setNewSplitUser] = useState('');

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);

  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  // Fetch Slots on Date Change
  useEffect(() => {
      const fetchSlots = async () => {
          setIsLoadingSlots(true);
          const { data } = await api.data.checkAvailability(turf.id, date);
          if (data) {
              // Convert ISO strings to HH:MM AM/PM format matching allSlots
              const formatted = data.map((d: string) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
              setBookedSlots(formatted);
          }
          setIsLoadingSlots(false);
      };
      fetchSlots();
  }, [date, turf.id]);

  const allSlots = [
    { time: '06:00 AM', period: 'Morning' }, { time: '07:00 AM', period: 'Morning' }, { time: '08:00 AM', period: 'Morning' },
    { time: '04:00 PM', period: 'Evening' }, { time: '05:00 PM', period: 'Evening' }, 
    { time: '06:00 PM', period: 'Night' }, { time: '07:00 PM', period: 'Night' }, { time: '08:00 PM', period: 'Night' }, { time: '09:00 PM', period: 'Night' }
  ];

  const isSelectedSlotBooked = selectedSlot && bookedSlots.includes(selectedSlot);

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
  const insuranceCost = hasInsurance ? 20 : 0;
  
  let totalCost = basePrice + equipmentCost + addOnCost + insuranceCost;

  if (appliedCoupon) {
      totalCost = Math.max(0, totalCost - appliedCoupon.discount);
  }

  if (isBidding) {
      totalCost = bidAmount;
  }

  const perPersonCost = (isSplit || isLoserPays) && splitUsers.length > 0 ? Math.ceil(totalCost / (splitUsers.length + 1)) : totalCost;
  const paymentMode = isCorporate ? 'CORPORATE' : isLoserPays ? 'LOSER_PAYS' : isSplit ? 'SPLIT' : 'FULL';

  const handleApplyCoupon = () => {
     if (couponCode.toUpperCase() === 'TURFEX50') {
         setAppliedCoupon({ code: 'TURFEX50', discount: 50 });
         showToast("Coupon applied! ₹50 off.");
     } else {
         showToast("Invalid coupon code", "error");
         setAppliedCoupon(null);
     }
  };

  const processPayment = async () => {
      setIsProcessingPayment(true);
      try {
          const order = await api.payment.createOrder(perPersonCost, `rcpt_${Date.now()}`);
          
          if (!order || !order.id) {
              throw new Error("Failed to create payment order");
          }

          const options = {
              key: "rzp_test_1234567890", // Replace with env variable in prod
              amount: order.amount,
              currency: order.currency,
              name: "Turfex",
              description: `Booking at ${turf.name}`,
              order_id: order.id,
              handler: async function (response: any) {
                  const verify = await api.payment.verifyPayment(response);
                  if (verify.success) {
                      finishBooking();
                  } else {
                      showToast("Payment verification failed", "error");
                      setIsProcessingPayment(false);
                  }
              },
              prefill: {
                  name: "Turfex User",
                  contact: "9999999999"
              },
              theme: {
                  color: "#DFFF00"
              },
              modal: {
                  ondismiss: function() {
                      setIsProcessingPayment(false);
                  }
              }
          };

          // @ts-ignore
          const rzp1 = new window.Razorpay(options);
          rzp1.open();

      } catch (error) {
          console.error("Payment Error:", error);
          // Fallback for Demo if Razorpay script missing or failed
          setTimeout(() => {
              finishBooking();
          }, 1500);
      }
  };

  const finishBooking = () => {
      const corpDetails = isCorporate ? { company_name: corporateName, gst_number: corporateGST } : undefined;
      onConfirm(date, selectedSlot!, selectedSport, selectedAddOns, selectedEquipment, totalCost, (isSplit || isLoserPays) ? splitUsers.map(u => u.name) : [], paymentMode, corpDetails, hasInsurance);
      setIsProcessingPayment(false);
  };

  const handleConfirm = () => {
    if (selectedSlot) {
      if (isSelectedSlotBooked) {
        if (isBidding) {
            onWaitlist(date, selectedSlot, selectedSport, bidAmount);
        } else {
            onWaitlist(date, selectedSlot, selectedSport);
        }
      } else {
        if (isLoserPays && splitUsers.length === 0) {
            showToast("Add at least one opponent for Loser Pays mode!", "error");
            return;
        }
        if (isCorporate && (!corporateName || !corporateGST)) {
            showToast("Please enter corporate details", "error");
            return;
        }
        
        // Trigger Payment Flow
        processPayment();
      }
    }
  };

  const addSplitUser = () => {
    if (!newSplitUser.trim()) return;
    setSplitUsers([...splitUsers, { name: newSplitUser, isVerified: false }]);
    setNewSplitUser('');
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Select Sport</label>
        <div className="grid grid-cols-2 gap-3">
          {turf.sports_supported.map(sport => (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`p-6 text-sm font-bold border transition-all flex flex-col items-center justify-center gap-2 ${selectedSport === sport ? 'bg-volt text-black border-volt' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}
            >
              <span className="text-2xl">{sport === 'Football' ? '⚽' : sport === 'Cricket' ? '🏏' : '🏸'}</span>
              <span className="font-display uppercase tracking-wide">{sport}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Select Date</label>
        <CustomCalendar selectedDate={date} onSelect={(d) => { setDate(d); setSelectedSlot(null); }} minDate={new Date().toISOString().split('T')[0]} />
      </div>
    </div>
  );

  const renderStep2 = () => {
    const groups = { Morning: [], Evening: [], Night: [] } as any;
    allSlots.forEach(s => groups[s.period].push(s.time));

    return (
      <div className="space-y-6 animate-fade-in-up">
        {isLoadingSlots ? (
            <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-volt" />
            </div>
        ) : (
            Object.keys(groups).map(period => (
            <div key={period}>
                <h4 className="text-xs font-bold text-zinc-500 uppercase mb-3">{period}</h4>
                <div className="grid grid-cols-3 gap-2">
                {groups[period].map((slot: string) => {
                    const isBooked = bookedSlots.includes(slot);
                    const slotPrice = getSlotPrice(slot);
                    const isSlotPeak = slotPrice > turf.price_per_hour;

                    return (
                    <button
                        key={slot}
                        onClick={() => { setSelectedSlot(slot); setIsBidding(false); setBidAmount(slotPrice * 1.5); }}
                        className={`py-3 px-1 text-sm font-bold text-center border transition-all relative ${
                        selectedSlot === slot
                            ? 'bg-white text-black border-white'
                            : isBooked 
                                ? 'bg-zinc-900/50 text-zinc-700 border-zinc-800 cursor-not-allowed' 
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-500'
                        }`}
                    >
                        <span className="font-mono">{slot.replace(' AM', '').replace(' PM', '')}</span>
                        {isSlotPeak && !isBooked && selectedSlot !== slot && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-volt rounded-full"></span>}
                        {isBooked && <div className="absolute inset-0 flex items-center justify-center bg-black/50"><X size={12} className="text-red-600"/></div>}
                    </button>
                    );
                })}
                </div>
            </div>
            ))
        )}
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in-up pb-4">
      
      {/* Game Stakes Selection */}
      <div className="space-y-3">
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Game Stakes</label>
          <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => { setIsLoserPays(false); setIsSplit(false); }}
                className={`p-3 border rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${!isLoserPays && !isSplit ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}
              >
                  <Wallet size={18} />
                  <span className="text-[10px] font-bold uppercase">Me</span>
              </button>
              <button
                onClick={() => { setIsLoserPays(false); setIsSplit(true); }}
                className={`p-3 border rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${!isLoserPays && isSplit ? 'bg-volt text-black border-volt' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}
              >
                  <Users size={18} />
                  <span className="text-[10px] font-bold uppercase">Split</span>
              </button>
              <button
                onClick={() => { setIsLoserPays(true); setIsSplit(false); }}
                className={`p-3 border rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${isLoserPays ? 'bg-red-600 text-white border-red-600' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}
              >
                  <Skull size={18} />
                  <span className="text-[10px] font-bold uppercase">Loser Pays</span>
              </button>
          </div>
          {isLoserPays && (
              <p className="text-[10px] text-red-500 font-bold bg-red-900/20 p-2 rounded border border-red-900/30">
                  Winner takes all! The losing team/player pays the full booking amount.
              </p>
          )}
      </div>

      {/* Opponents / Split Section */}
      {(isSplit || isLoserPays) && (
        <div className="space-y-3">
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">{isLoserPays ? 'Add Opponents' : 'Split With'}</label>
            <div className="flex gap-2">
                <input 
                type="text" 
                placeholder="Username"
                value={newSplitUser}
                onChange={(e) => setNewSplitUser(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-800 p-3 text-sm font-bold outline-none text-white focus:border-volt transition-colors"
                />
                <button onClick={addSplitUser} className="bg-zinc-800 text-white p-3 hover:bg-zinc-700 transition-colors"><Plus size={18}/></button>
            </div>
            {splitUsers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {splitUsers.map((u, i) => (
                        <span key={i} className="text-xs font-bold bg-zinc-800 text-white px-2 py-1 flex items-center gap-1 border border-zinc-700">{u.name} <X size={10} className="cursor-pointer" onClick={() => setSplitUsers(splitUsers.filter((_, idx) => idx !== i))}/></span>
                    ))}
                </div>
            )}
        </div>
      )}

      {/* Options */}
      <div className="space-y-3">
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Extras</label>
          <button 
            onClick={() => setHasInsurance(!hasInsurance)}
            className={`w-full p-4 border transition-all flex items-center justify-between ${hasInsurance ? 'border-volt bg-volt/5' : 'border-zinc-800 bg-transparent hover:border-zinc-600'}`}
          >
              <div className="flex items-center gap-3">
                  <ShieldCheck size={20} className={hasInsurance ? 'text-volt' : 'text-zinc-500'} />
                  <div className="text-left">
                      <p className={`text-sm font-bold ${hasInsurance ? 'text-white' : 'text-zinc-400'}`}>Booking Insurance</p>
                      <p className="text-[10px] text-zinc-500">Full refund on cancellation</p>
                  </div>
              </div>
              <span className="font-mono font-bold text-sm text-volt">+₹20</span>
          </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/90 z-[80] flex items-end md:items-center justify-center sm:p-4 backdrop-blur-md">
      <div className="bg-black w-full max-w-md overflow-hidden animate-slide-up h-[90vh] md:h-auto border border-zinc-800 shadow-2xl flex flex-col relative">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-black">
          <div className="flex items-center gap-3">
             {step > 1 && <button onClick={prevStep} className="hover:text-volt transition-colors text-white"><ArrowLeft size={20} /></button>}
             <div>
                <h3 className="font-display font-bold text-xl uppercase italic tracking-wider text-white">
                    {step === 1 ? 'Select Sport' : step === 2 ? 'Pick Slot' : step === 3 ? 'Customize' : 'Checkout'}
                </h3>
             </div>
          </div>
          <button onClick={onClose} className="hover:text-red-500 transition-colors text-white"><X size={24} /></button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-black text-white">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && <PaymentReceipt 
              turf={turf} date={date} slot={selectedSlot} sport={selectedSport} basePrice={basePrice} equipmentCost={equipmentCost} addOnCost={addOnCost} totalCost={totalCost} perPersonCost={perPersonCost} isSplit={isSplit || isLoserPays} splitUsers={splitUsers} couponCode={couponCode} setCouponCode={setCouponCode} appliedCoupon={appliedCoupon} setAppliedCoupon={setAppliedCoupon} handleApplyCoupon={handleApplyCoupon} paymentMode={paymentMode}
            />}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-zinc-800 bg-black pb-safe-bottom">
             {step < 4 ? (
                 <button 
                    onClick={nextStep}
                    disabled={(step === 2 && !selectedSlot)}
                    className="w-full bg-white text-black font-display font-bold uppercase text-lg py-4 flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all disabled:opacity-50"
                 >
                    Next <ArrowRight size={20} />
                 </button>
             ) : (
                 <button 
                    onClick={handleConfirm}
                    disabled={isProcessingPayment}
                    className="w-full bg-volt text-black font-display font-bold uppercase text-lg py-4 flex items-center justify-center gap-2 hover:bg-white transition-all shadow-[0_0_20px_rgba(223,255,0,0.3)] disabled:opacity-50"
                 >
                    {isProcessingPayment ? <Loader2 className="animate-spin" /> : `${isLoserPays ? 'Stake Amount' : 'Pay'} ₹${perPersonCost}`}
                 </button>
             )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
