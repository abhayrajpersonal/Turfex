
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getDaysInMonth, getFirstDayOfMonth, formatDate } from '../../lib/utils';

interface CustomCalendarProps {
  selectedDate: string;
  onSelect: (date: string) => void;
  minDate?: string;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ selectedDate, onSelect, minDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date(selectedDate));
  const [viewYear, setViewYear] = useState(currentDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(currentDate.getMonth());

  useEffect(() => {
    const d = new Date(selectedDate);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }, [selectedDate]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(viewYear, viewMonth, day);
    const dateStr = formatDate(newDate);
    // Adjust for timezone offset to ensure string is YYYY-MM-DD local
    const offsetDate = new Date(newDate.getTime() - (newDate.getTimezoneOffset() * 60000));
    onSelect(offsetDate.toISOString().split('T')[0]);
  };

  const renderDays = () => {
    const days = [];
    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-full" />);
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateToCheck = new Date(viewYear, viewMonth, d);
      dateToCheck.setHours(0,0,0,0);
      
      const isSelected = selectedDate === formatDate(new Date(dateToCheck.getTime() - (dateToCheck.getTimezoneOffset() * 60000)));
      const isPast = minDate ? dateToCheck < new Date(minDate) : dateToCheck < today;
      const isToday = dateToCheck.getTime() === today.getTime();

      days.push(
        <button
          key={d}
          onClick={() => !isPast && handleDateClick(d)}
          disabled={isPast}
          className={`h-10 w-full rounded-lg text-sm font-bold flex items-center justify-center transition-all relative ${
            isSelected 
              ? 'bg-electric text-white shadow-md' 
              : isPast 
                ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
                : 'text-midnight dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
          } ${isToday && !isSelected ? 'border border-electric text-electric' : ''}`}
        >
          {d}
          {isToday && !isSelected && <div className="absolute bottom-1 w-1 h-1 bg-electric rounded-full"></div>}
        </button>
      );
    }
    return days;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-midnight dark:text-white"><ChevronLeft size={20}/></button>
        <span className="font-bold text-midnight dark:text-white">{monthNames[viewMonth]} {viewYear}</span>
        <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-midnight dark:text-white"><ChevronRight size={20}/></button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
    </div>
  );
};

export default CustomCalendar;
