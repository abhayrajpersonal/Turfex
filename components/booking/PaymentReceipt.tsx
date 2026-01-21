
import React from 'react';
import { Ticket, Tag, X, Users, Check, Skull } from 'lucide-react';
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
  paymentMode: 'FULL' | 'SPLIT' | 'LOSER_PAYS';
}

const PaymentReceipt: React.FC<PaymentReceiptProps> = ({
  turf, date, slot, sport, basePrice, equipmentCost, addOnCost, totalCost, perPersonCost,
  isSplit, splitUsers, couponCode, setCouponCode, appliedCoupon, setAppliedCoupon, handleApplyCoupon, paymentMode
}) => {
  const isLoserPays = paymentMode === 'LOSER_PAYS';

  return (
    <div className="space-y-6 animate-fade-in-up text-center">
      {/* Receipt Card */}
      <div className={`bg-white dark:bg-darkcard rounded-2xl overflow-hidden shadow-lg border ${isLoserPays ? 'border-red-200 dark:border-red-900/50' : 'border-gray-100 dark:border-white/5 dark:bg-gradient-to-b dark:from-white/5 dark:to-transparent'} relative transition-colors duration-300`}>
        {/* Serrated Edge Top Visual */}
        <div className={`h-2 w-full ${isLoserPays ? 'bg-red-600' : 'bg-electric'}`}></div>
        
        <div className="p-6">
          <div className="flex justify-center mb-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isLoserPays ? 'bg-red-100 dark:bg-red-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
              {isLoserPays ? <Skull size={24} className="text-red-600 dark:text-red-500" /> : <Ticket size={24} className="text-midnight dark:text-white" />}
            </div>
          </div>
          <h4 className={`text-xs uppercase tracking-widest mb-1 font-bold ${isLoserPays ? 'text-red-500' : 'text-courtgray dark:text-gray-400'}`}>
              {isLoserPays ? 'Total Stake (Winner Takes All)' : 'Total Payable'}
          </h4>
          <h1 className={`text-4xl font-mono font-black animate-scale-in mb-4 ${isLoserPays ? 'text-red-600 dark:text-red-500' : 'text-midnight dark:text-white'}`}>₹{totalCost}</h1>
          
          {isLoserPays && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold px-3 py-2 rounded-lg mb-4">
                  WARNING: The loser will be charged the full ₹{totalCost} automatically after the match result.
              </div>
          )}

          {/* Coupon Section */}
          <div className="flex gap-2 justify-center mb-6">
            {appliedCoupon ? (
              <div className="bg-gradient-to-r from-green-500/10 to-green-500/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 animate-scale-in border border-green-500/20">
                <Tag size={12}/> Coupon {appliedCoupon.code} applied (-₹{appliedCoupon.discount})
                <button onClick={() => setAppliedCoupon(null)} className="hover:text-red-500"><X size={12}/></button>
              </div>
            ) : (
              <div className="flex gap-2 w-full max-w-xs relative">
                <input 
                  placeholder="Promo Code" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-electric flex-1 uppercase placeholder-gray-400"
                />
                <button onClick={handleApplyCoupon} className="absolute right-1 top-1 bottom-1 bg-white dark:bg-gray-700 text-midnight dark:text-white px-3 rounded-md text-[10px] font-bold shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 active:scale-95 transition-transform">Apply</button>
              </div>
            )}
          </div>

          {/* Dashed Separator */}
          <div className="border-t-2 border-dashed border-gray-100 dark:border-gray-700 my-4 relative">
            <div className="absolute -left-8 -top-3 w-6 h-6 bg-offwhite dark:bg-darkbg rounded-full"></div>
            <div className="absolute -right-8 -top-3 w-6 h-6 bg-offwhite dark:bg-darkbg rounded-full"></div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Turf Fee</span>
              <span className="font-bold text-midnight dark:text-white font-mono">₹{basePrice}</span>
            </div>
            {equipmentCost > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Equipment</span>
                <span className="font-bold text-midnight dark:text-white font-mono">+₹{equipmentCost}</span>
              </div>
            )}
            {addOnCost > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Staff</span>
                <span className="font-bold text-midnight dark:text-white font-mono">+₹{addOnCost}</span>
              </div>
            )}
            {appliedCoupon && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Discount</span>
                <span className="font-bold font-mono">-₹{appliedCoupon.discount}</span>
              </div>
            )}
          </div>
          
          {(isSplit || isLoserPays) && splitUsers.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className={`text-xs font-bold ${isLoserPays ? 'text-red-500' : 'text-gray-500'}`}>
                    {isLoserPays ? 'Opponents' : 'Split Breakdown'}
                </span>
                {!isLoserPays && <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-[10px] font-bold font-mono">₹{perPersonCost}/person</span>}
              </div>
              <div className="flex -space-x-2 justify-center">
                <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[8px] font-bold z-10">You</div>
                {splitUsers.slice(0, 4).map((u, i) => (
                  <img key={i} src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=random`} className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800" alt={u.name}/>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 text-xs text-center text-gray-400">
        <p className="font-medium text-midnight dark:text-white">{turf.name} • {sport}</p>
        <p>{new Date(date).toLocaleDateString()} • {slot}</p>
      </div>
    </div>
  );
};

export default PaymentReceipt;
