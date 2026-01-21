
import React, { useState } from 'react';
import { X, Calendar, Clock, Check } from 'lucide-react';
import { Coach } from '../lib/types';
import CustomCalendar from './common/CustomCalendar';

interface CoachBookingModalProps {
  coach: Coach;
  onClose: () => void;
  onConfirm: (date: string, time: string) => void;
}

const CoachBookingModal: React.FC<CoachBookingModalProps> = ({ coach, onClose, onConfirm }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const times = ['07:00 AM', '08:00 AM', '09:00 AM', '04:00 PM', '05:00 PM', '06:00 PM'];

  const handleSubmit = () => {
    if (selectedTime) {
      onConfirm(date, selectedTime);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-darkcard rounded-3xl w-full max-w-md p-6 relative animate-scale-in flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white"><X size={20}/></button>
        
        <div className="flex items-center gap-4 mb-6">
            <img src={coach.avatar_url} className="w-16 h-16 rounded-2xl bg-gray-200 object-cover" />
            <div>
                <h3 className="text-xl font-bold text-midnight dark:text-white leading-tight">Book {coach.name}</h3>
                <p className="text-sm text-electric font-bold">₹{coach.rate_per_session}/session</p>
            </div>
        </div>

        <div className="overflow-y-auto flex-1 space-y-6 pb-4">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1"><Calendar size={14}/> Select Date</label>
                <CustomCalendar selectedDate={date} onSelect={setDate} minDate={new Date().toISOString().split('T')[0]} />
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1"><Clock size={14}/> Select Time Slot</label>
                <div className="grid grid-cols-3 gap-2">
                    {times.map(t => (
                        <button 
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className={`py-3 rounded-xl text-sm font-bold border transition-all ${selectedTime === t ? 'bg-electric text-white border-electric shadow-md' : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <button 
            disabled={!selectedTime}
            onClick={handleSubmit}
            className="w-full bg-midnight dark:bg-white text-white dark:text-midnight font-bold py-4 rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100 mt-4"
        >
            Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default CoachBookingModal;
