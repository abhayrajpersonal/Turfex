
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Debounce function for search
export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return function(this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  } as T;
}

// Date helpers
export const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Notification Helpers
export const requestNotificationPermission = async () => {
  if (typeof window === 'undefined' || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  return false;
};

export const sendBrowserNotification = (title: string, body: string) => {
  if (typeof window !== 'undefined' && "Notification" in window && Notification.permission === "granted") {
    // Check if we are in a service worker context or just main thread
    try {
        new Notification(title, { body, icon: 'https://cdn-icons-png.flaticon.com/512/3233/3233497.png' }); // Generic sports icon
    } catch (e) {
        console.error("Notification failed", e);
    }
  }
};

// Calendar Export
export const downloadCalendarEvent = (booking: any) => {
  if (!booking || !booking.start_time) return;
  
  const formatDateForICS = (dateStr: string) => {
      return new Date(dateStr).toISOString().replace(/-|:|\.\d\d\d/g, "");
  };

  const start = formatDateForICS(booking.start_time);
  const end = formatDateForICS(booking.end_time || booking.start_time); // Default to start if end missing
  const title = `Game at ${booking.turf?.name || 'Turfex Venue'}`;
  const location = booking.turf?.location || 'Unknown Location';
  
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Turfex//Sports Booking//EN
BEGIN:VEVENT
UID:${booking.id}@turfex.app
DTSTAMP:${new Date().toISOString().replace(/-|:|\.\d\d\d/g, "")}
DTSTART:${start}
DTEND:${end}
SUMMARY:${title}
DESCRIPTION:Booked via Turfex. Sport: ${booking.sport}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', 'turfex-match.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
