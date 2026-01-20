
import React from 'react';
import { X, Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { UserProfile, WalletTransaction } from '../lib/types';

interface WalletModalProps {
  user: UserProfile;
  transactions: WalletTransaction[];
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ user, transactions, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-white dark:bg-darkcard rounded-3xl w-full max-w-md overflow-hidden animate-scale-in shadow-2xl">
         <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative">
             <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 p-1 rounded-full"><X size={20}/></button>
             
             <div className="flex items-center gap-2 opacity-80 mb-6">
                <div className="bg-white/20 p-1.5 rounded-lg"><WalletIcon size={18} /></div>
                <span className="text-sm font-bold tracking-wider uppercase">Turfex Wallet</span>
             </div>
             
             <div>
                <p className="text-sm opacity-80 mb-1">Available Balance</p>
                <h2 className="text-5xl font-black tracking-tight">₹{user.wallet_balance.toLocaleString()}</h2>
             </div>
             
             <div className="flex gap-4 mt-8">
                <button className="flex-1 bg-white text-blue-600 py-3 rounded-xl text-sm font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                  + Add Money
                </button>
                <button className="flex-1 bg-blue-800/50 hover:bg-blue-800/70 border border-blue-400/30 py-3 rounded-xl text-sm font-bold backdrop-blur-sm transition-all">
                   Withdraw
                </button>
             </div>
         </div>
         
         <div className="p-6 bg-gray-50 dark:bg-darkbg h-[300px] flex flex-col">
            <h4 className="font-bold text-midnight dark:text-white mb-4 text-sm uppercase tracking-wider opacity-60">Recent Transactions</h4>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
               {transactions.map(tx => (
                 <div key={tx.id} className="flex justify-between items-center bg-white dark:bg-darkcard p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-3">
                       <div className={`p-2.5 rounded-xl ${tx.type === 'CREDIT' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                          {tx.type === 'CREDIT' ? <ArrowDownLeft size={18}/> : <ArrowUpRight size={18}/>}
                       </div>
                       <div>
                          <p className="font-bold text-sm text-midnight dark:text-white">{tx.description}</p>
                          <p className="text-[10px] text-gray-500 font-medium uppercase mt-0.5">{new Date(tx.date).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <span className={`font-bold text-sm ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-midnight dark:text-white'}`}>
                       {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount}
                    </span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default WalletModal;
