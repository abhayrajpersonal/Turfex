
import React, { useState, useEffect } from 'react';
import { X, Bell, Calendar, UserPlus, Wallet, Info, BellRing } from 'lucide-react';
import { Notification } from '../../lib/types';
import { requestNotificationPermission } from '../../lib/utils';

interface NotificationPanelProps {
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, isOpen, onClose, onClear }) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, [isOpen]);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setPermission('granted');
      new Notification('Notifications Enabled! 🔔', { body: 'You will now receive match reminders.' });
    } else {
      setPermission('denied');
    }
  };

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch(type) {
      case 'BOOKING_CONFIRMED': return <Calendar size={18} className="text-green-500" />;
      case 'BOOKING_CANCELLED': return <Calendar size={18} className="text-red-500" />;
      case 'FRIEND_REQUEST': return <UserPlus size={18} className="text-blue-500" />;
      case 'WALLET': return <Wallet size={18} className="text-orange-500" />;
      default: return <Info size={18} className="text-gray-500" />;
    }
  };

  return (
    // Fixed: z-index 70 to sit between chat (60) and modals (80)
    <div className="fixed inset-y-0 right-0 w-80 md:w-96 bg-white/95 dark:bg-darkcard/95 backdrop-blur-xl shadow-2xl z-[70] transform transition-transform duration-300 animate-fade-in-up border-l border-white/20 dark:border-gray-700 flex flex-col">
       <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h3 className="font-bold text-lg text-midnight dark:text-white flex items-center gap-2">
             <Bell size={20} /> Notifications
          </h3>
          <div className="flex gap-2">
              {notifications.length > 0 && (
                <button onClick={onClear} className="text-xs text-blue-600 font-bold hover:underline">Clear All</button>
              )}
              <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-midnight dark:text-white transition-colors"><X size={20} /></button>
          </div>
       </div>
       
       <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {permission === 'default' && (
             <div className="bg-electric/10 border border-electric/20 p-4 rounded-xl mb-4 flex items-start gap-3">
                <BellRing size={20} className="text-electric shrink-0 mt-1" />
                <div>
                   <p className="text-sm font-bold text-midnight dark:text-white mb-1">Get Match Reminders</p>
                   <p className="text-xs text-gray-500 mb-3">Enable push notifications to never miss a game.</p>
                   <button 
                     onClick={handleEnableNotifications}
                     className="bg-electric text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                   >
                     Enable Notifications
                   </button>
                </div>
             </div>
          )}

          {notifications.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
               <Bell size={48} className="mx-auto mb-4 opacity-20" />
               <p className="text-sm font-medium">No new notifications</p>
               <p className="text-xs opacity-70 mt-1">We'll let you know when something happens.</p>
            </div>
          ) : (
            notifications.map(n => (
               <div key={n.id} className={`p-4 rounded-2xl border flex gap-3 transition-colors ${n.is_read ? 'bg-white/50 dark:bg-darkcard/50 border-gray-100 dark:border-gray-700' : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30'}`}>
                  <div className={`mt-1 p-2 rounded-full ${n.is_read ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-700 shadow-sm'}`}>
                      {getIcon(n.type)}
                  </div>
                  <div>
                     <p className="text-sm font-medium text-midnight dark:text-white leading-snug">{n.message}</p>
                     <p className="text-[10px] text-gray-400 mt-2 font-medium">{new Date(n.created_at).toLocaleDateString()} • {new Date(n.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
               </div>
            ))
          )}
       </div>
    </div>
  );
};

export default NotificationPanel;
