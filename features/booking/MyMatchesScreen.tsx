
import React, { useState } from 'react';
import { Calendar, QrCode, Clock, History, Megaphone, ThumbsUp, Skull, ShieldCheck, Flag, CalendarCheck, MapPin } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { SPORTS_ICONS } from '../../lib/constants';
import { downloadCalendarEvent } from '../../lib/utils';

const MyMatchesScreen: React.FC = () => {
  const { bookings, openMatches, cancelBooking } = useData();
  const { user } = useAuth();
  const { setActiveModal, setActiveTab, showToast } = useUI();
  const [activeMatchTab, setActiveMatchTab] = useState<'upcoming' | 'history'>('upcoming');

  const isUpcoming = (dateStr: string) => new Date(dateStr) > new Date();
  
  const myUserBookings = bookings.filter(b => b.user_id === user?.id && b.status !== 'MAINTENANCE');
  const joinedMatches = openMatches.filter(m => m.joined_players.includes(user?.id || ''));

  const filteredBookings = myUserBookings.filter(b => 
    activeMatchTab === 'upcoming' 
      ? isUpcoming(b.start_time) && b.status !== 'CANCELLED'
      : !isUpcoming(b.start_time) || b.status === 'CANCELLED'
  ).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  const filteredMatches = joinedMatches.filter(m => 
    activeMatchTab === 'upcoming'
      ? isUpcoming(m.start_time)
      : !isUpcoming(m.start_time)
  ).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  
  const isEmpty = filteredBookings.length === 0 && filteredMatches.length === 0;

  const handleCancel = (booking: any) => {
      cancelBooking(booking.id);
      showToast("Booking Cancelled", "success");
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <h2 className="text-3xl font-display font-bold uppercase italic text-midnight dark:text-white">My Matches<span className="text-volt">.</span></h2>
        
        <div className="flex bg-gray-200 dark:bg-zinc-800 p-1 rounded-lg w-full md:w-auto">
             <button 
               onClick={() => setActiveMatchTab('upcoming')}
               className={`flex-1 md:flex-none px-8 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${activeMatchTab === 'upcoming' ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}
             >
                Upcoming
             </button>
             <button 
               onClick={() => setActiveMatchTab('history')}
               className={`flex-1 md:flex-none px-8 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${activeMatchTab === 'history' ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}
             >
                History
             </button>
        </div>
      </div>
      
      {isEmpty ? (
          <div className="text-center py-24 border border-dashed border-gray-300 dark:border-zinc-800 rounded-xl">
            <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                <Calendar size={40} />
            </div>
            <h3 className="text-xl font-display font-bold text-midnight dark:text-white mb-2 uppercase">No Matches Found</h3>
            <p className="text-sm text-gray-500 mb-8 font-medium">Your schedule is clearer than a clean sheet.</p>
            {activeMatchTab === 'upcoming' && (
                <button onClick={() => setActiveTab('discover')} className="bg-volt text-black px-8 py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-white transition-colors shadow-lg shadow-volt/20">
                    Book a Turf
                </button>
            )}
          </div>
      ) : (
          <div className="space-y-6">
            {filteredBookings.map(booking => (
                <div key={booking.id} className="relative group">
                    {/* Ticket Visual */}
                    <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800 flex flex-col md:flex-row shadow-sm hover:shadow-xl transition-all hover:border-gray-300 dark:hover:border-zinc-600">
                        {/* Left Strip (Date) */}
                        <div className="bg-black text-white p-4 md:w-24 flex flex-row md:flex-col items-center justify-center gap-1 md:gap-0 border-r border-zinc-800 relative overflow-hidden">
                            <div className="text-xs font-bold uppercase text-zinc-500">{new Date(booking.start_time).toLocaleDateString('en-US', {month: 'short'})}</div>
                            <div className="text-2xl font-display font-bold text-volt">{new Date(booking.start_time).getDate()}</div>
                            <div className="absolute inset-y-0 right-0 w-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIxIiBmaWxsPSIjMjcyNzJhIi8+PC9zdmc+')] opacity-50 h-full"></div>
                        </div>

                        {/* Main Content */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">{booking.sport}</span>
                                        {booking.payment_mode === 'LOSER_PAYS' && <span className="text-[10px] font-bold text-red-500 border border-red-500/30 px-2 py-0.5 rounded uppercase">Loser Pays</span>}
                                    </div>
                                    <h3 className="text-xl font-bold text-midnight dark:text-white font-display uppercase tracking-wide">{booking.turf?.name || 'Venue'}</h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><MapPin size={12}/> {booking.turf?.location || 'Location'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-mono font-black text-midnight dark:text-white">{new Date(booking.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Start Time</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-zinc-800">
                                {activeMatchTab === 'upcoming' ? (
                                    <>
                                        <button onClick={() => setActiveModal('qr', booking)} className="flex-1 bg-black dark:bg-white text-white dark:text-black py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90">
                                            <QrCode size={16}/> Entry Pass
                                        </button>
                                        <button onClick={() => setActiveModal('ringer')} className="px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-1">
                                            <Megaphone size={14}/> Need Sub
                                        </button>
                                        <button onClick={() => handleCancel(booking)} className="px-4 py-2.5 border border-red-200 dark:border-red-900/30 text-red-500 rounded-lg text-xs font-bold hover:bg-red-50 dark:hover:bg-red-900/10">
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => setActiveModal('review', booking)} className="w-full border border-gray-200 dark:border-zinc-700 py-2 rounded-lg text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white hover:border-gray-400">
                                        Rate Experience
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
          </div>
      )}
    </div>
  );
};

export default MyMatchesScreen;
