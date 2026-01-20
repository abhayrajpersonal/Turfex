
import React, { useState } from 'react';
import { Calendar, QrCode, Clock, History } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { SPORTS_ICONS } from '../../lib/constants';

const MyMatchesScreen: React.FC = () => {
  const { bookings, openMatches, cancelBooking } = useData();
  const { user } = useAuth();
  const { setActiveModal, setActiveTab } = useUI();
  const [activeMatchTab, setActiveMatchTab] = useState<'upcoming' | 'history'>('upcoming');

  // Helpers
  const isUpcoming = (dateStr: string) => new Date(dateStr) > new Date();
  
  // Filter logic
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

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <h2 className="text-2xl font-display font-bold text-midnight dark:text-white">My Matches</h2>
        <div className="flex bg-white dark:bg-darkcard p-1 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm w-full md:w-auto">
             <button 
               onClick={() => setActiveMatchTab('upcoming')}
               className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeMatchTab === 'upcoming' ? 'bg-electric text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
             >
                <Clock size={16}/> Upcoming
             </button>
             <button 
               onClick={() => setActiveMatchTab('history')}
               className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeMatchTab === 'history' ? 'bg-gray-500 text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
             >
                <History size={16}/> History
             </button>
        </div>
      </div>
      
      {isEmpty ? (
          <div className="text-center py-20 bg-white dark:bg-darkcard rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} className="text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-400 mb-2">
                {activeMatchTab === 'upcoming' ? 'No upcoming matches' : 'No match history'}
            </h3>
            <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">
                {activeMatchTab === 'upcoming' 
                    ? "Your schedule is clear. Time to book a turf or join a game!" 
                    : "You haven't played any matches yet."}
            </p>
            {activeMatchTab === 'upcoming' && (
                <button onClick={() => setActiveTab('discover')} className="bg-electric text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-blue-500/20">
                    Explore Turfs
                </button>
            )}
          </div>
      ) : (
          <div className="space-y-8">
            {filteredBookings.length > 0 && (
                <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 ml-1">Private Bookings</h3>
                <div className="grid gap-4">
                    {filteredBookings.map(booking => (
                    <div key={booking.id} className={`bg-white dark:bg-darkcard p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-blue-200 dark:hover:border-blue-800 ${activeMatchTab === 'history' ? 'opacity-80 grayscale-[0.5]' : ''}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${activeMatchTab === 'history' ? 'bg-gray-100 dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                                {SPORTS_ICONS[booking.sport]}
                            </div>
                            <div>
                            <h4 className="font-bold text-midnight dark:text-white text-lg">{booking.turf?.name || 'Walk-in'}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Calendar size={12}/> {new Date(booking.start_time).toLocaleDateString()} 
                                <span className="mx-1">•</span> 
                                <Clock size={12}/> {new Date(booking.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 w-full md:w-auto border-t md:border-t-0 border-gray-100 dark:border-gray-800 pt-3 md:pt-0">
                            {activeMatchTab === 'upcoming' && booking.status === 'CONFIRMED' && (
                                <>
                                    <button onClick={() => setActiveModal('qr', booking)} className="text-xs flex items-center gap-1 font-bold text-midnight dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
                                        <QrCode size={14} /> Entry Pass
                                    </button>
                                    <button onClick={() => cancelBooking(booking.id)} className="text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold px-3 py-2 rounded-lg transition-colors">
                                        Cancel
                                    </button>
                                </>
                            )}
                            {activeMatchTab === 'history' && booking.status === 'CONFIRMED' && (
                                <button onClick={() => setActiveModal('review', booking)} className="text-xs flex items-center gap-1 text-electric border border-electric/30 px-4 py-2 rounded-lg font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                    Rate & Review
                                </button>
                            )}
                            {booking.status === 'CANCELLED' && (
                                <span className="text-xs px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-lg font-bold">Cancelled</span>
                            )}
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            )}

            {filteredMatches.length > 0 && (
                <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 ml-1">Joined Matches</h3>
                <div className="grid gap-4">
                    {filteredMatches.map(match => (
                    <div key={match.id} className={`bg-white dark:bg-darkcard p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:shadow-md transition-shadow ${activeMatchTab === 'history' ? 'opacity-80' : ''}`}>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center text-2xl">
                                {SPORTS_ICONS[match.sport]}
                            </div>
                            <div>
                            <h4 className="font-bold text-midnight dark:text-white text-lg">{match.turf?.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(match.start_time).toLocaleDateString()} • {match.joined_players.length} Players</p>
                            </div>
                        </div>
                        <span className={`text-xs px-3 py-1.5 rounded-full font-bold ${activeMatchTab === 'upcoming' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                             {activeMatchTab === 'upcoming' ? 'Joined' : 'Completed'}
                        </span>
                    </div>
                    ))}
                </div>
                </div>
            )}
          </div>
      )}
    </div>
  );
};

export default MyMatchesScreen;
