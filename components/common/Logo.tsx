
import React from 'react';

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: number; // Size of the icon
  variant?: 'light' | 'dark'; // for text color in different contexts
}

export const TurfexIcon: React.FC<{ size?: number, className?: string }> = ({ size = 40, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Turf Green Rounded Square */}
    <rect width="100" height="100" rx="22" fill="#00A859" />
    
    {/* White 'T' */}
    <path 
      d="M32 28 H68 C70 28 72 30 72 32 V42 C72 44 70 46 68 46 H58 V78 C58 81 55 84 52 84 H48 C45 84 42 81 42 78 V46 H32 C30 46 28 44 28 42 V32 C28 30 30 28 32 28 Z" 
      fill="white" 
    />
    
    {/* Spark Lime Spark (4-pointed star) */}
    <path 
      d="M78 20 L82 28 L90 32 L82 36 L78 44 L74 36 L66 32 L74 28 Z" 
      fill="#CCFF00" 
    />
  </svg>
);

export const Logo: React.FC<LogoProps> = ({ className = "", showWordmark = true, size = 40, variant = 'dark' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <TurfexIcon size={size} />
      {showWordmark && (
        <span 
          className="font-sans font-bold tracking-tight leading-none" 
          style={{ 
            color: variant === 'dark' ? '#0057FF' : '#FFFFFF', // Electric Blue or White
            fontSize: size * 0.7 
          }}
        >
          TURFEX
        </span>
      )}
    </div>
  );
};

export default Logo;
