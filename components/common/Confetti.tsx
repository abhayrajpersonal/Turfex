
import React, { useEffect, useState } from 'react';

const Confetti: React.FC = () => {
  const [pieces, setPieces] = useState<{id: number, left: number, delay: number, bg: string}[]>([]);

  useEffect(() => {
    const colors = ['#007BFF', '#32CD32', '#FF7043', '#FFD700', '#FF69B4'];
    const newPieces = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      bg: colors[Math.floor(Math.random() * colors.length)]
    }));
    setPieces(newPieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute top-[-20px] w-3 h-6 opacity-0 animate-[confetti_3s_ease-in-out_forwards]"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.bg,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}
      <style>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Confetti;
