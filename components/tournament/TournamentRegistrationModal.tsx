
import React, { useState } from 'react';
import { X, Trophy, Users, CheckCircle, Wallet, ArrowRight, AlertCircle, Plus, Calendar, MapPin } from 'lucide-react';
import { Tournament, Team } from '../../lib/types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useUI } from '../../context/UIContext';

interface TournamentRegistrationModalProps {
  tournament: Tournament;
  onClose: () => void;
  onConfirm: (teamId: string) => void;
  onCreateTeamRedirect: () => void;
}

const TournamentRegistrationModal: React.FC<TournamentRegistrationModalProps> = ({ tournament, onClose, onConfirm, onCreateTeamRedirect }) => {
  const { user } = useAuth();
  const { teams } = useData();
  const [step, setStep] = useState(1);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter teams where user is a member
  const myTeams = teams.filter(t => t.members.includes(user?.id || ''));
  const selectedTeam = teams.find(t => t.id === selectedTeamId);

  const hasSufficientFunds = (user?.wallet_balance || 0) >= tournament.entry_fee;

  const handleNext = () => {
    if (step === 1 && selectedTeamId) {
        setStep(2);
    }
  };

  const handlePayAndRegister = () => {
      if (!selectedTeamId) return;
      setIsProcessing(true);
      // Simulate API
      setTimeout(() => {
          setIsProcessing(false);
          onConfirm(selectedTeamId);
      }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-darkcard rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl animate-fade-in-up border border-white/10 relative">
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-black/10 dark:bg-white/10 hover:bg-black/20 rounded-full text-white"><X size={20}/></button>
        
        {/* Header with Image */}
        <div className="h-40 relative">
            <img src={tournament.image_url} className="w-full h-full object-cover" alt={tournament.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
            <div className="absolute bottom-4 left-6 right-6">
                <span className="bg-electric text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block">{tournament.sport}</span>
                <h2 className="text-2xl font-display font-black text-white leading-tight">{tournament.name}</h2>
                <div className="flex gap-4 mt-1 text-xs text-gray-300">
                    <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(tournament.start_date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><MapPin size={12}/> {tournament.location}</span>
                </div>
            </div>
        </div>

        <div className="p-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
                <div className={`h-1.5 w-8 rounded-full ${step >= 1 ? 'bg-electric' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                <div className={`h-1.5 w-8 rounded-full ${step >= 2 ? 'bg-electric' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
            </div>

            {step === 1 ? (
                // STEP 1: SELECT TEAM
                <div className="space-y-4 animate-slide-left">
                    <div className="text-center mb-4">
                        <h3 className="text-lg font-bold text-midnight dark:text-white">Select Your Team</h3>
                        <p className="text-sm text-gray-500">Choose the squad you want to enter with.</p>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3">
                        {myTeams.length > 0 ? (
                            myTeams.map(team => (
                                <button
                                    key={team.id}
                                    onClick={() => setSelectedTeamId(team.id)}
                                    className={`w-full p-3 rounded-xl border-2 flex items-center justify-between transition-all group ${selectedTeamId === team.id ? 'border-electric bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <img src={team.logo_url} className="w-10 h-10 rounded-full bg-gray-200 object-cover" alt={team.name} />
                                        <div className="text-left">
                                            <p className="font-bold text-sm text-midnight dark:text-white">{team.name}</p>
                                            <p className="text-xs text-gray-500">{team.members.length} Members</p>
                                        </div>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedTeamId === team.id ? 'border-electric bg-electric' : 'border-gray-300'}`}>
                                        {selectedTeamId === team.id && <CheckCircle size={12} className="text-white"/>}
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                                <Users size={32} className="mx-auto text-gray-300 mb-2" />
                                <p className="text-sm font-medium text-gray-500">No teams found.</p>
                                <button 
                                    onClick={onCreateTeamRedirect}
                                    className="mt-3 text-electric font-bold text-sm hover:underline"
                                >
                                    Create a Team first
                                </button>
                            </div>
                        )}
                        
                        {/* Always show option to create new */}
                        {myTeams.length > 0 && (
                            <button 
                                onClick={onCreateTeamRedirect}
                                className="w-full p-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <Plus size={16} /> Create New Team
                            </button>
                        )}
                    </div>

                    <button 
                        onClick={handleNext}
                        disabled={!selectedTeamId}
                        className="w-full bg-electric disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all flex items-center justify-center gap-2 mt-4 active:scale-95"
                    >
                        Next Step <ArrowRight size={18} />
                    </button>
                </div>
            ) : (
                // STEP 2: SUMMARY & PAYMENT
                <div className="space-y-6 animate-slide-left">
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-midnight dark:text-white">Confirm Registration</h3>
                        <p className="text-sm text-gray-500">Review details before paying.</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl space-y-3 border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Selected Team</span>
                            <span className="font-bold text-midnight dark:text-white flex items-center gap-2">
                                <img src={selectedTeam?.logo_url} className="w-5 h-5 rounded-full" />
                                {selectedTeam?.name}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Entry Fee</span>
                            <span className="font-bold text-midnight dark:text-white">₹{tournament.entry_fee}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm pt-3 border-t border-gray-200 dark:border-gray-700">
                            <span className="text-gray-500">Platform Fee</span>
                            <span className="font-bold text-green-600">FREE</span>
                        </div>
                        <div className="flex justify-between items-center text-lg pt-2">
                            <span className="font-bold text-midnight dark:text-white">Total</span>
                            <span className="font-black text-electric">₹{tournament.entry_fee}</span>
                        </div>
                    </div>

                    {/* Wallet Check */}
                    <div className={`p-4 rounded-xl flex items-center justify-between border ${hasSufficientFunds ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800' : 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${hasSufficientFunds ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200' : 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-200'}`}>
                                <Wallet size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase opacity-60">Wallet Balance</p>
                                <p className="text-sm font-bold">₹{user?.wallet_balance}</p>
                            </div>
                        </div>
                        {!hasSufficientFunds && (
                            <span className="text-xs font-bold text-red-500 flex items-center gap-1 bg-white dark:bg-darkcard px-2 py-1 rounded border border-red-200">
                                <AlertCircle size={12}/> Low Balance
                            </span>
                        )}
                    </div>

                    <button 
                        onClick={handlePayAndRegister}
                        disabled={!hasSufficientFunds || isProcessing}
                        className="w-full bg-midnight dark:bg-white text-white dark:text-midnight font-bold py-4 rounded-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
                    >
                        {isProcessing ? 'Processing...' : `Pay ₹${tournament.entry_fee} & Register`}
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TournamentRegistrationModal;
