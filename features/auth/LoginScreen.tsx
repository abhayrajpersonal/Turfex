
import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { UserType } from '../../lib/types';
import Logo from '../../components/common/Logo';

const LoginScreen: React.FC = () => {
  const { login, verifyOtp, isLoading, user } = useAuth();
  const { showToast, setActiveTab } = useUI();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If user is already logged in, show redirecting state immediately
  // This prevents the form from resetting (flashing back to phone input) while the parent App component is updating
  if (user) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-black text-white">
              <div className="text-center">
                  <Loader2 className="animate-spin text-volt mx-auto mb-4" size={48} />
                  <h2 className="text-xl font-display font-bold uppercase tracking-wider">Entering Arena...</h2>
              </div>
          </div>
      );
  }

  const validatePhone = (phone: string) => {
    const regex = /^\d{10}$/; 
    return regex.test(phone);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault(); // Critical: prevent page reload
    setError(null);
    
    if (!validatePhone(phoneNumber)) {
        setError("Enter valid 10-digit mobile number.");
        return;
    }
    
    setIsSubmitting(true);
    try {
        await login(phoneNumber);
        setShowOtpInput(true);
    } catch (err) {
        setError("Failed to send OTP. Try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
      e.preventDefault(); // Critical: prevent page reload
      setError(null);
      
      if (otp.length !== 4 && otp.length !== 6) {
          setError("Invalid OTP length.");
          return;
      }
      
      setIsSubmitting(true);
      try {
          const success = await verifyOtp(phoneNumber, otp);
          if (!success) {
              setError("Invalid OTP. Try again.");
              setIsSubmitting(false);
          }
          // If success, the 'user' state will update, triggering the component to render the "Entering Arena..." view above
          // We do NOT set isSubmitting(false) here to prevent the form from becoming interactive again during the transition
      } catch (e) {
          setError("Verification failed.");
          setIsSubmitting(false);
      }
  };

  // Effect to handle navigation after successful login
  useEffect(() => {
    if (user) {
        showToast("Welcome to the Arena.", 'success');
        if (user.user_type === UserType.OWNER || user.user_type === UserType.MANAGER) {
            setActiveTab('dashboard');
        } else {
            setActiveTab('discover');
        }
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
      <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-volt to-transparent shadow-[0_0_30px_rgba(223,255,0,0.5)]"></div>
      
      <div className="max-w-sm w-full animate-scale-in relative z-10">
        <div className="flex flex-col items-center mb-12">
           <Logo size={64} />
           <p className="mt-4 text-zinc-500 font-bold tracking-[0.2em] text-[10px] uppercase">Elite Sports Booking</p>
        </div>
        
        <div className="bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-none p-8 relative shadow-2xl">
          {/* Decorative Corner Markers */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-volt"></div>
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-volt"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-volt"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-volt"></div>

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-display font-bold uppercase italic text-white leading-none tracking-wide">
                {showOtpInput ? 'Security Check' : 'Member Access'}
            </h2>
          </div>
          
          {!showOtpInput ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="relative">
                <label className="block text-[10px] font-bold text-volt uppercase tracking-wider mb-2">Mobile Number</label>
                <div className="flex group focus-within:border-volt border border-zinc-700 bg-black transition-colors h-14 items-center">
                  <span className="pl-4 pr-3 text-zinc-500 font-mono text-lg border-r border-zinc-800 h-full flex items-center select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    className="flex-1 bg-transparent text-white px-4 focus:outline-none font-mono text-lg placeholder-zinc-700 h-full"
                    placeholder="98765 43210"
                    value={phoneNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 10) setPhoneNumber(val);
                      setError(null);
                    }}
                    required
                    autoFocus
                  />
                </div>
                <p className="text-[10px] text-zinc-600 mt-2 font-mono">Demo: End with '9' for Owner Mode.</p>
              </div>
              
              {error && <div className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-900/10 p-3 border border-red-900/30"><AlertCircle size={14} />{error}</div>}

              <button
                type="submit"
                className="w-full bg-volt text-black font-display font-bold uppercase text-lg py-4 hover:bg-white transition-colors flex justify-center items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(223,255,0,0.15)]"
                disabled={isLoading || isSubmitting}
              >
                {(isLoading || isSubmitting) ? <Loader2 className="animate-spin text-black" /> : <>Get Code <ArrowRight size={20} /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-[10px] font-bold text-volt uppercase tracking-wider">One-Time Password</label>
                    <span className="text-[10px] text-zinc-500 font-mono">Sent to {phoneNumber}</span>
                </div>
                <input
                  type="text"
                  className="block w-full border border-zinc-700 bg-black text-volt p-4 text-center text-3xl tracking-[0.5em] font-mono focus:border-volt outline-none h-16"
                  placeholder="••••"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 6) setOtp(val);
                  }}
                  required
                  autoFocus
                />
                <div className="text-center mt-3">
                    <p className="text-xs text-zinc-500">Demo Code: <span className="text-white font-bold bg-zinc-800 px-2 py-0.5 rounded">1234</span></p>
                </div>
              </div>

              {error && <div className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-900/10 p-3 border border-red-900/30"><AlertCircle size={14} />{error}</div>}

              <button
                type="submit"
                className="w-full bg-volt text-black font-display font-bold uppercase text-lg py-4 hover:bg-white transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                disabled={isLoading || isSubmitting}
              >
                {(isLoading || isSubmitting) ? <Loader2 className="animate-spin text-black" /> : 'Verify & Enter'}
              </button>
              
              <button 
                type="button" 
                onClick={() => { setShowOtpInput(false); setOtp(''); setError(null); }}
                className="w-full text-xs text-zinc-500 font-bold hover:text-white transition-colors uppercase tracking-wider"
              >
                Change Number
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
