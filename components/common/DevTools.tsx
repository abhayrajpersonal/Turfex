
import React, { useState } from 'react';
import { Database, UploadCloud, X, Check, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { MOCK_TURFS, MOCK_OPEN_MATCHES, MOCK_TEAMS } from '../../lib/mockData';

const DevTools = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SEEDING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [msg, setMsg] = useState('');

  if (!isSupabaseConfigured() && process.env.NODE_ENV === 'production') return null;

  const seedDatabase = async () => {
    if (!isSupabaseConfigured()) {
        setStatus('ERROR');
        setMsg('Supabase not connected');
        return;
    }
    
    setStatus('SEEDING');
    try {
        // Seed Turfs
        const { error: tErr } = await supabase!.from('turfs').upsert(MOCK_TURFS.map(({id, ...t}) => t), { onConflict: 'name' });
        if (tErr) throw tErr;

        // Seed Teams
        // Transform teams to match DB schema if needed
        const { error: tmErr } = await supabase!.from('teams').upsert(MOCK_TEAMS, { onConflict: 'id' });
        
        setStatus('SUCCESS');
        setMsg('Database seeded successfully!');
    } catch (e: any) {
        setStatus('ERROR');
        setMsg(e.message || 'Seeding failed');
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-[200]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-2xl border border-gray-800 hover:scale-110 transition-transform opacity-50 hover:opacity-100"
        >
          <Database size={16} />
        </button>
      ) : (
        <div className="bg-black border border-gray-800 p-4 rounded-xl shadow-2xl w-64 animate-fade-in-up">
           <div className="flex justify-between items-center mb-3">
               <h4 className="text-white text-xs font-bold uppercase tracking-wider">Dev Tools</h4>
               <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white"><X size={14}/></button>
           </div>
           
           <div className="space-y-2">
               <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-2">
                   <div className={`w-2 h-2 rounded-full ${isSupabaseConfigured() ? 'bg-green-500' : 'bg-red-500'}`}></div>
                   {isSupabaseConfigured() ? 'Supabase Connected' : 'Mock Mode (Local)'}
               </div>

               <button 
                 onClick={seedDatabase}
                 disabled={!isSupabaseConfigured() || status === 'SEEDING'}
                 className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold py-2 rounded flex items-center justify-center gap-2 disabled:opacity-50"
               >
                   {status === 'SEEDING' ? <UploadCloud className="animate-bounce" size={14} /> : <Database size={14} />}
                   Seed Mock Data
               </button>
               
               {msg && (
                   <div className={`text-[10px] p-2 rounded flex items-start gap-1 ${status === 'SUCCESS' ? 'text-green-400 bg-green-900/20' : 'text-red-400 bg-red-900/20'}`}>
                       {status === 'SUCCESS' ? <Check size={12} className="shrink-0 mt-0.5"/> : <AlertCircle size={12} className="shrink-0 mt-0.5"/>}
                       {msg}
                   </div>
               )}
           </div>
        </div>
      )}
    </div>
  );
};

export default DevTools;
