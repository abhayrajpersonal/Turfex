
import React, { useState } from 'react';
import { User, Bell, Globe, Moon, Sun, Shield, LogOut, ChevronRight, Edit3, Lock, HelpCircle, FileText, CheckCircle, Gift } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserTier } from '../../lib/types';

const SettingsScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme, setActiveModal, showToast } = useUI();
  const { language, setLanguage } = useLanguage();

  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: true,
    promo: false
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    showToast("Preferences updated");
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi (हिंदी)' },
    { code: 'mr', name: 'Marathi (मराठी)' },
    { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
  ];

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up pb-24">
      <h2 className="text-3xl font-display font-bold uppercase italic text-midnight dark:text-white tracking-tighter mb-8">
        Settings<span className="text-volt">.</span>
      </h2>

      {/* Profile Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm mb-6 flex flex-col md:flex-row items-center gap-6">
         <div className="relative">
            <img src={user?.avatar_url || "https://picsum.photos/100"} alt="" className="w-20 h-20 rounded-full object-cover border-4 border-gray-100 dark:border-zinc-800" />
            {user?.tier === UserTier.GOLD && <div className="absolute -bottom-1 -right-1 bg-volt text-black p-1 rounded-full border-2 border-white dark:border-zinc-900"><User size={12}/></div>}
         </div>
         <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-midnight dark:text-white mb-1">{user?.full_name}</h3>
            <p className="text-sm text-gray-500 font-mono mb-4">@{user?.username} • {user?.phone}</p>
            <div className="flex gap-3 justify-center md:justify-start">
                <button 
                  onClick={() => setActiveModal('profile')}
                  className="bg-gray-100 dark:bg-zinc-800 text-midnight dark:text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
                >
                   <Edit3 size={14} /> Edit Profile
                </button>
                {user?.kyc_status !== 'VERIFIED' && (
                    <button 
                      onClick={() => setActiveModal('kyc')}
                      className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center gap-2"
                    >
                       <Shield size={14} /> Verify Identity
                    </button>
                )}
            </div>
         </div>
      </div>

      {/* Preferences Section */}
      <div className="space-y-6">
          {/* Appearance & Language */}
          <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Preferences</h4>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-800">
                      <div className="flex items-center gap-3">
                          <div className="bg-gray-100 dark:bg-zinc-800 p-2 rounded-lg"><Globe size={18} className="text-blue-500"/></div>
                          <span className="font-bold text-sm text-midnight dark:text-white">Language</span>
                      </div>
                      <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as any)}
                        className="bg-gray-50 dark:bg-zinc-800 text-sm font-bold text-midnight dark:text-white py-2 px-3 rounded-lg outline-none border border-transparent focus:border-volt"
                      >
                          {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                      </select>
                  </div>
                  
                  <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                          <div className="bg-gray-100 dark:bg-zinc-800 p-2 rounded-lg">
                              {isDarkMode ? <Moon size={18} className="text-purple-500"/> : <Sun size={18} className="text-orange-500"/>}
                          </div>
                          <span className="font-bold text-sm text-midnight dark:text-white">Dark Mode</span>
                      </div>
                      <button 
                        onClick={toggleTheme}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 flex items-center ${isDarkMode ? 'bg-volt justify-end' : 'bg-gray-300 justify-start'}`}
                      >
                          <div className="w-4 h-4 bg-black rounded-full shadow-md"></div>
                      </button>
                  </div>
              </div>
          </section>

          {/* Notifications */}
          <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Notifications</h4>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                          <div className="bg-gray-100 dark:bg-zinc-800 p-2 rounded-lg"><Bell size={18} className="text-red-500"/></div>
                          <div>
                              <p className="font-bold text-sm text-midnight dark:text-white">Match Reminders</p>
                              <p className="text-xs text-gray-500">Get notified 1 hour before games</p>
                          </div>
                      </div>
                      <input type="checkbox" checked={notifications.push} onChange={() => toggleNotification('push')} className="w-5 h-5 accent-volt" />
                  </div>
                  <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                          <div className="bg-gray-100 dark:bg-zinc-800 p-2 rounded-lg"><FileText size={18} className="text-green-500"/></div>
                          <div>
                              <p className="font-bold text-sm text-midnight dark:text-white">SMS Alerts</p>
                              <p className="text-xs text-gray-500">Booking confirmations via text</p>
                          </div>
                      </div>
                      <input type="checkbox" checked={notifications.sms} onChange={() => toggleNotification('sms')} className="w-5 h-5 accent-volt" />
                  </div>
                  <div className="p-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                          <div className="bg-gray-100 dark:bg-zinc-800 p-2 rounded-lg"><Gift size={18} className="text-pink-500"/></div>
                          <div>
                              <p className="font-bold text-sm text-midnight dark:text-white">Promotions</p>
                              <p className="text-xs text-gray-500">Offers and deals</p>
                          </div>
                      </div>
                      <input type="checkbox" checked={notifications.promo} onChange={() => toggleNotification('promo')} className="w-5 h-5 accent-volt" />
                  </div>
              </div>
          </section>

          {/* Support */}
          <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Support & Legal</h4>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
                  <button 
                    onClick={() => setActiveModal('support')}
                    className="w-full flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors text-left"
                  >
                      <div className="flex items-center gap-3">
                          <HelpCircle size={18} className="text-gray-400"/>
                          <span className="font-bold text-sm text-midnight dark:text-white">Help & Support</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400"/>
                  </button>
                  <button className="w-full flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors text-left">
                      <div className="flex items-center gap-3">
                          <Lock size={18} className="text-gray-400"/>
                          <span className="font-bold text-sm text-midnight dark:text-white">Privacy Policy</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400"/>
                  </button>
                  <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors text-left">
                      <div className="flex items-center gap-3">
                          <FileText size={18} className="text-gray-400"/>
                          <span className="font-bold text-sm text-midnight dark:text-white">Terms of Service</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400"/>
                  </button>
              </div>
          </section>

          <button 
            onClick={logout}
            className="w-full py-4 text-red-500 font-bold bg-red-50 dark:bg-red-900/10 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
          >
              <LogOut size={18} /> Log Out
          </button>

          <div className="text-center pt-4 pb-8">
              <p className="text-[10px] text-gray-400 font-mono">Turfex v1.0.2 (Build 2024)</p>
          </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
