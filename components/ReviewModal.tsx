
import React, { useState } from 'react';
import { X, Star, ThumbsUp } from 'lucide-react';
import { Booking } from '../lib/types';

interface ReviewModalProps {
  booking: Booking;
  onClose: () => void;
  onSubmit: (rating: number) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ booking, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-darkcard rounded-2xl w-full max-w-sm p-6 relative animate-scale-in text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white"><X size={20}/></button>
        
        <div className="mb-6">
           <h3 className="text-xl font-bold text-midnight dark:text-white">Rate your experience</h3>
           <p className="text-sm text-gray-500 dark:text-gray-400">How was your game at {booking.turf?.name}?</p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
           {[1, 2, 3, 4, 5].map(star => (
              <button 
                key={star}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                 <Star 
                    size={32} 
                    className={`${star <= (hovered || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                 />
              </button>
           ))}
        </div>

        <button 
          disabled={rating === 0}
          onClick={() => onSubmit(rating)}
          className="w-full bg-electric disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <ThumbsUp size={18} /> Submit Review
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;
