
import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryModalProps {
  images: string[];
  onClose: () => void;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ images, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
        <button onClick={onClose} className="absolute top-6 right-6 text-white bg-white/10 p-2 rounded-full hover:bg-white/20 z-50"><X size={24}/></button>
        
        <div className="relative w-full max-w-4xl h-[70vh] flex items-center justify-center">
            {images.length > 1 && (
                <button onClick={prev} className="absolute left-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 z-10">
                    <ChevronLeft size={32} />
                </button>
            )}
            
            <img 
                src={images[currentIndex]} 
                alt={`Gallery ${currentIndex + 1}`} 
                className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
            />

            {images.length > 1 && (
                <button onClick={next} className="absolute right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 z-10">
                    <ChevronRight size={32} />
                </button>
            )}
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
                <button 
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                />
            ))}
        </div>
    </div>
  );
};

export default GalleryModal;
