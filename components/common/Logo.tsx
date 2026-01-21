
import React from 'react';

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: number;
  theme?: 'light' | 'dark'; 
}

export const TurfexIcon: React.FC<{ size?: number, className?: string }> = ({ size = 32, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={{ overflow: 'visible' }}
  >
    <defs>
      <linearGradient id="turfex-stripe-gradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#000000" />
      </linearGradient>
    </defs>

    {/* Left Stripe - Black/White Gradient */}
    {/* Tilted forward for speed */}
    <path 
      d="M4 100 L22 100 L52 0 L34 0 Z" 
      fill="url(#turfex-stripe-gradient)" 
    />
    
    {/* Middle Stripe - Volt/Neon */}
    <path 
      d="M26 100 L44 100 L74 0 L56 0 Z" 
      fill="#DFFF00" 
    />
    
    {/* Right Stripe - Black/White Gradient */}
    <path 
      d="M48 100 L66 100 L96 0 L78 0 Z" 
      fill="url(#turfex-stripe-gradient)" 
    />
  </svg>
);

export const Logo: React.FC<LogoProps> = ({ className = "", showWordmark = true, size = 32, theme }) => {
  // Determine text color based on explicit theme prop or inherit from parent
  const textColor = theme === 'dark' ? 'text-white' : theme === 'light' ? 'text-midnight' : 'text-current';

  return (
    <div className={`flex items-center gap-3 select-none ${textColor} ${className}`}>
      <TurfexIcon size={size} />
      {showWordmark && (
        <div className="flex flex-col justify-center leading-none">
          <span 
            className="font-display font-black italic tracking-tighter" 
            style={{ 
              fontSize: size * 0.9, 
              letterSpacing: '-0.02em',
              lineHeight: 0.8
            }}
          >
            TURFEX
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
