
'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-black text-white flex items-center justify-center min-h-screen p-4">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
             <AlertTriangle size={32} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-2">Technical Foul!</h2>
          <p className="text-zinc-400 text-sm mb-6">
            Something went wrong on the field. Our referees are reviewing the play.
          </p>
          <div className="bg-black p-4 rounded-lg border border-zinc-800 text-left mb-6 overflow-hidden">
             <code className="text-xs text-red-400 font-mono break-all">
                {error.message || "Unknown Error"}
             </code>
          </div>
          <button
            onClick={() => reset()}
            className="w-full bg-volt text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors"
          >
            <RefreshCw size={18} /> Retry Play
          </button>
        </div>
      </body>
    </html>
  );
}
