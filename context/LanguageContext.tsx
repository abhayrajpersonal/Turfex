
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '../lib/types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    discover: 'Discover',
    matches: 'My Matches',
    scoreboard: 'Scoreboard',
    store: 'Store',
    social: 'Social',
    leaderboard: 'Leaderboard',
    dashboard: 'Dashboard',
    book_now: 'Book Now',
    upcoming: 'Upcoming',
    history: 'History'
  },
  hi: {
    discover: 'खोजें',
    matches: 'मेरे मैच',
    scoreboard: 'स्कोरबोर्ड',
    store: 'दुकान',
    social: 'सामाजिक',
    leaderboard: 'लीडरबोर्ड',
    dashboard: 'डैशबोर्ड',
    book_now: 'बुक करें',
    upcoming: 'आगामी',
    history: 'इतिहास'
  },
  mr: {
    discover: 'शोधा',
    matches: 'माझे सामने',
    scoreboard: 'गुणफलक',
    store: 'दुकान',
    social: 'सामाजिक',
    leaderboard: 'लीडरबोर्ड',
    dashboard: 'डैशबोर्ड',
    book_now: 'बुक करा',
    upcoming: 'आगामी',
    history: 'इतिहास'
  },
  kn: {
    discover: 'ಅನ್ವೇಷಿಸಿ',
    matches: 'ನನ್ನ ಪಂದ್ಯಗಳು',
    scoreboard: 'ಅಂಕಪಟ್ಟಿ',
    store: 'ಅಂಗಡಿ',
    social: 'ಸಾಮಾಜಿಕ',
    leaderboard: 'ಲೀಡರ್‌ಬೋರ್ಡ್',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    book_now: 'ಬುಕ್ ಮಾಡಿ',
    upcoming: 'ಮುಂಬರುವ',
    history: 'ಇತಿಹಾಸ'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
