
import React from 'react';
import { X, QrCode } from 'lucide-react';
import { Booking } from '../lib/types';

interface QRCodeModalProps {
  booking: Booking;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ booking, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm p-8 relative animate-scale-in text-center">
         <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={20}/></button>
         
         <h3 className="text-xl font-bold text-midnight mb-2">Scan to Check-in</h3>
         <p className="text-gray-500 text-sm mb-6">{booking.turf?.name} • {new Date(booking.start_time).toLocaleDateString()}</p>
         
         <div className="bg-white p-4 rounded-xl border-4 border-gray-900 inline-block mb-6">
            <QrCode size={180} className="text-black" />
         </div>
         
         <div className="bg-gray-100 rounded-lg p-3 text-sm font-mono text-gray-600">
            Booking ID: {booking.id.toUpperCase()}
         </div>
         <p className="text-xs text-gray-400 mt-4">Show this to the turf manager at entry.</p>
      </div>
    </div>
  );
};

export default QRCodeModal;
