
import React from 'react';
import { Ticket, Tag, X, Skull } from 'lucide-react';
import { Turf, Sport } from '../../lib/types';

interface PaymentReceiptProps {
  turf: Turf;
  date: string;
  slot: string | null;
  sport: Sport;
  basePrice: number;
  equipmentCost: number;
  addOnCost: number;
  totalCost: number;
  perPersonCost: number;
  isSplit: boolean;
  splitUsers: { name: string; avatar?: string }[];
  couponCode: string;
  setCouponCode: (val: string) => void;
  appliedCoupon: { code: string; discount: number } | null;
  setAppliedCoupon: (val: { code: string; discount: number } | null) => void;
  handleApplyCoupon: () => void;
  paymentMode: 'FULL' | 'SPLIT' | 'LOSER_PAYS' | 'CORPORATE';
}

const PaymentReceipt: React.FC<PaymentReceiptProps> = ({
  turf, date, slot, sport, basePrice, equipmentCost, addOnCost, totalCost, perPersonCost,
  isSplit, splitUsers, couponCode, setCouponCode, appliedCoupon, setAppliedCoupon, handleApplyCoupon, paymentMode
}) => {
  const isLoserPays = paymentMode === 'LOSER_PAYS';

  return (
    <div className="space-y-6 animate-fade-in-up text-center">
      {/* Receipt Card */}
      <div className={`bg-zinc-900 border ${isLoserPays ? 'border-red-900' : 'border-zinc-800'} relative transition-colors duration-300 overflow-hidden`}>
        {/* Serrated Edge Top Visual */}
        <div className={`h-1 w-full ${isLoserPays ? 'bg-red-600' : 'bg-volt'}`}></div>
        
        <div className="p-6">
          <div className="flex justify-center mb-4">
            <div className={`w-12 h-12 flex items-center justify-center border-2 ${isLoserPays ? 'border-red-600 text-red-600' : 'border-white text-white'}`}>
              {isLoserPays ? <Skull size={24} /> : <Ticket size={24} />}
            </div>
          </div>
          <h4 className={`text-[10px] uppercase tracking-[0.2em] mb-2 font-bold ${isLoserPays ? 'text-red-500' : 'text-zinc-500'}`}>
              {isLoserPays ? 'Total Stake (Winner Takes All)' : 'Total Payable'}
          </h4>
          <h1 className={`text-5xl font-display font-black animate-scale-in mb-6 ${isLoserPays ? 'text-red-600' : 'text-white'}`}>₹{totalCost}</h1>
          
          {isLoserPays && (
              <div className="bg-red-900/20 border border-red-900/50 text-red-400 text-[10px] font-bold px-3 py-2 mb-4 uppercase tracking-wide">
                  WARNING: The loser will be charged the full ₹{totalCost} automatically.
              </div>
          )}

          {/* Coupon Section */}
          <div className="flex gap-2 justify-center mb-6">
            {appliedCoupon ? (
              <div className="bg-zinc-800 text-green-400 px-3 py-1.5 text-xs font-bold flex items-center gap-2 animate-scale-in border border-green-900">
                <Tag size={12}/> Coupon {appliedCoupon.code} applied (-₹{appliedCoupon.discount})
                <button onClick={() => setAppliedCoupon(null)} className="hover:text-red-500"><X size={12}/></button>
              </div>
            ) : (
              <div className="flex gap-2 w-full max-w-xs relative">
                <input 
                  placeholder="Promo Code" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="bg-black border border-zinc-700 px-3 py-3 text-xs font-bold outline-none focus:border-volt flex-1 uppercase placeholder-zinc-600 text-white"
                />
                <button onClick={handleApplyCoupon} className="absolute right-1 top-1 bottom-1 bg-zinc-800 text-white px-3 text-[10px] font-bold hover:bg-zinc-700 border border-zinc-700 uppercase tracking-wider">Apply</button>
              </div>
            )}
          </div>

          {/* Dashed Separator */}
          <div className="border-t-2 border-dashed border-zinc-800 my-4 relative">
            <div className="absolute -left-8 -top-3 w-6 h-6 bg-black rounded-full"></div>
            <div className="absolute -right-8 -top-3 w-6 h-6 bg-black rounded-full"></div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-500 font-mono uppercase text-xs">Turf Fee</span>
              <span className="font-bold text-white font-mono">₹{basePrice}</span>
            </div>
            {equipmentCost > 0 && (
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-500 font-mono uppercase text-xs">Equipment</span>
                <span className="font-bold text-white font-mono">+₹{equipmentCost}</span>
              </div>
            )}
            {addOnCost > 0 && (
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-500 font-mono uppercase text-xs">Staff</span>
                <span className="font-bold text-white font-mono">+₹{addOnCost}</span>
              </div>
            )}
            {appliedCoupon && (
              <div className="flex justify-between text-green-400">
                <span className="font-mono uppercase text-xs">Discount</span>
                <span className="font-bold font-mono">-₹{appliedCoupon.discount}</span>
              </div>
            )}
          </div>
          
          {(isSplit || isLoserPays) && splitUsers.length > 0 && (
            <div className="mt-6 pt-4 border-t border-zinc-800">
              <div className="flex justify-between items-center mb-2">
                <span className={`text-xs font-bold uppercase tracking-widest ${isLoserPays ? 'text-red-500' : 'text-zinc-500'}`}>
                    {isLoserPays ? 'Opponents' : 'Split Breakdown'}
                </span>
                {!isLoserPays && <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 text-[10px] font-bold font-mono">₹{perPersonCost}/person</span>}
              </div>
              <div className="flex -space-x-2 justify-center">
                <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-black flex items-center justify-center text-[8px] font-bold z-10 text-white">YOU</div>
                {splitUsers.slice(0, 4).map((u, i) => (
                  <img key={i} src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=random`} className="w-8 h-8 rounded-full border-2 border-black grayscale" alt={u.name}/>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 text-xs text-center text-zinc-500">
        <p className="font-bold text-white uppercase tracking-wider">{turf.name} • {sport}</p>
        <p className="font-mono">{new Date(date).toLocaleDateString()} • {slot}</p>
      </div>
    </div>
  );
};

export default PaymentReceipt;
