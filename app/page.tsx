
'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import App to ensure it's treated as a client-side component 
// and to avoid hydration mismatches with browser-specific APIs in initial render.
const App = dynamic(() => import('../App'), { ssr: false });

export default function Page() {
  return <App />;
}
