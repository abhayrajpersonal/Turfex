
import type { Metadata, Viewport } from 'next';
import React from 'react';
import '../index.css'; // Assuming Tailwind directives are here or handled via global css

export const metadata: Metadata = {
  title: 'Turfex - Elite Sports Booking',
  description: 'Real-time social sports booking web app.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Oswald:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              darkMode: 'class',
              theme: {
                extend: {
                  screens: { 'xs': '375px', '3xl': '1920px' },
                  colors: {
                    volt: '#DFFF00', 'volt-hover': '#CCFF00',
                    obsidian: '#000000', charcoal: '#09090B', armor: '#18181B', steel: '#27272A',
                    ash: '#71717A', mist: '#A1A1AA',
                    danger: '#FF2E2E', success: '#00FF94', warning: '#FFC700', info: '#00B8FF',
                    electric: '#DFFF00', midnight: '#050505', darkbg: '#000000', darkcard: '#121212',
                  },
                  fontFamily: { sans: ['Inter', 'sans-serif'], display: ['Oswald', 'sans-serif'] },
                  padding: { 'safe-top': 'env(safe-area-inset-top)', 'safe-bottom': 'env(safe-area-inset-bottom)' },
                  animation: {
                    'fade-in-up': 'fade-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    'scale-in': 'scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  },
                  keyframes: {
                    'fade-in-up': { '0%': { transform: 'translateY(10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
                    'scale-in': { '0%': { transform: 'scale(0.98)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } }
                  }
                }
              }
            }
          `
        }} />
        <style>{`
          :root { font-size: 16px; }
          body { background-color: #000000; color: #FFFFFF; -webkit-tap-highlight-color: transparent; font-family: 'Inter', sans-serif; }
          ::-webkit-scrollbar { width: 4px; height: 4px; }
          ::-webkit-scrollbar-track { background: #09090B; }
          ::-webkit-scrollbar-thumb { background: #27272A; border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: #DFFF00; }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          :focus-visible { outline: 2px solid #DFFF00; outline-offset: 2px; }
          .leaflet-popup-content-wrapper { border-radius: 0; padding: 0; overflow: hidden; background: #18181B; color: white; border: 1px solid #333; }
          .leaflet-popup-tip { background: #18181B; }
          .leaflet-container { font-family: 'Inter', sans-serif; }
        `}</style>
      </head>
      <body>
        <div id="root" className="w-full max-w-[1920px] min-h-[100dvh] mx-auto flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
