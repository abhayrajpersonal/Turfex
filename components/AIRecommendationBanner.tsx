
import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { UserProfile } from '../lib/types';

interface AIRecommendationBannerProps {
  user: UserProfile | null;
}

const AIRecommendationBanner: React.FC<AIRecommendationBannerProps> = ({ user }) => {
  const [suggestion, setSuggestion] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchSuggestion = async () => {
      try {
        // Contextual Prompt
        const hour = new Date().getHours();
        const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
        const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        
        const prompt = `
          User Profile: ${user.full_name}, plays ${user.sports_preferences.join(', ')}.
          Context: It is ${day} ${timeOfDay} in ${user.city}.
          Task: Generate a single, short, high-energy sentence suggesting they book a turf or join a match. 
          Example: "The weather in Mumbai is perfect for a 5-a-side football match tonight!"
          Output just the text.
        `;

        const res = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        if (res.ok) {
            const data = await res.json();
            setSuggestion(data.text || `Perfect time for a game of ${user.sports_preferences[0] || 'Football'}!`);
        } else {
            // Fallback if API fails
            setSuggestion(`Ready to dominate the field today, ${user.full_name.split(' ')[0]}?`);
        }

      } catch (error) {
        console.error("AI Error", error);
        setSuggestion(`Ready to dominate the field today, ${user.full_name.split(' ')[0]}?`);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestion();
  }, [user]);

  if (!user) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl p-6 mb-8 animate-fade-in-up group">
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 animate-gradient-xy"></div>
      
      {/* Floating Particles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
         <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-spin-slow"></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex items-start gap-4">
           <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl shadow-inner border border-white/20">
              {loading ? <Loader2 className="animate-spin text-volt" size={24} /> : <Sparkles className="text-volt animate-pulse" size={24} />}
           </div>
           <div>
              <h3 className="text-xs font-bold text-volt uppercase tracking-widest mb-1 flex items-center gap-2">
                 AI Insight {loading && <span className="w-1 h-1 bg-volt rounded-full animate-ping"/>}
              </h3>
              <p className="text-lg md:text-xl font-display font-bold text-white leading-tight max-w-xl">
                 {loading ? "Analyzing your playstyle..." : suggestion}
              </p>
           </div>
        </div>
        
        {!loading && (
            <button className="whitespace-nowrap px-6 py-3 bg-white text-indigo-900 font-bold text-sm rounded-xl hover:bg-volt hover:text-black transition-all shadow-lg active:scale-95 flex items-center gap-2 group-hover:translate-x-1 duration-300">
               Book Now <ArrowRight size={16} />
            </button>
        )}
      </div>
    </div>
  );
};

export default AIRecommendationBanner;
