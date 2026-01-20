
import React, { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { UserType } from '../../lib/types';
import Logo from '../../components/common/Logo';

const LoginScreen: React.FC = () => {
  const { login, isLoading, user } = useAuth();
  const { showToast, setActiveTab } = useUI();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validatePhone = (phone: string) => {
    const regex = /^[6-9]\d{9}$/; // Indian mobile number validation
    return regex.test(phone);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!showOtpInput) {
      if (!validatePhone(phoneNumber)) {
        setError("Please enter a valid 10-digit mobile number starting with 6-9.");
        return;
      }
      setShowOtpInput(true);
    } else {
      if (otp.length !== 4) {
        setError("Please enter the 4-digit OTP.");
        return;
      }
      setIsSubmitting(true);
      await login(phoneNumber);
      setIsSubmitting(false);
    }
  };

  // Effect to handle navigation after successful login
  React.useEffect(() => {
    if (user) {
        showToast("Welcome back!", 'success');
        if (user.user_type === UserType.OWNER) {
            setActiveTab('dashboard');
        } else {
            setActiveTab('discover');
        }
    }
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-offwhite dark:bg-darkbg p-6 transition-colors duration-200">
      <div className="max-w-md w-full animate-scale-in">
        <div className="flex justify-center mb-10">
           <Logo size={80} className="scale-125" />
        </div>
        
        <div className="bg-white dark:bg-darkcard border border-gray-100 dark:border-gray-700 shadow-xl rounded-3xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 text-midnight dark:text-white font-display">
                {showOtpInput ? 'Verify Identity' : 'Game On.'}
            </h2>
            <p className="text-courtgray text-sm">
                {showOtpInput ? 'Enter the code sent to your mobile' : 'Book turfs, find players, play hard.'}
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {!showOtpInput ? (
              <div>
                <label className="block text-xs font-bold text-courtgray uppercase tracking-wider mb-2">Phone Number</label>
                <div className="flex group focus-within:ring-2 focus-within:ring-electric rounded-xl transition-all">
                  <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-midnight dark:text-gray-300 font-bold text-sm">
                    +91
                  </span>
                  <input
                    type="tel"
                    className="flex-1 block w-full rounded-r-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-midnight dark:text-white p-3.5 focus:outline-none font-medium"
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
                <p className="text-xs text-courtgray mt-3">Try ending with '9' for Owner demo.</p>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-courtgray uppercase tracking-wider mb-2">One-Time Password</label>
                <input
                  type="text"
                  className="block w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-midnight dark:text-white p-3.5 text-center text-2xl tracking-[0.5em] font-mono focus:ring-2 focus:ring-electric/20 focus:border-electric outline-none"
                  placeholder="••••"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 4) setOtp(val);
                  }}
                  required
                  autoFocus
                />
              </div>
            )}
            
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-xs font-medium bg-red-50 dark:bg-red-900/10 p-3 rounded-lg">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-electric text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 flex justify-center items-center transform active:scale-95 disabled:opacity-50 disabled:scale-100"
              disabled={isLoading || isSubmitting}
            >
              {(isLoading || isSubmitting) ? <Loader2 className="animate-spin" /> : (showOtpInput ? 'Verify & Login' : 'Get OTP')}
            </button>
            
            {showOtpInput && (
              <button 
                type="button" 
                onClick={() => { setShowOtpInput(false); setOtp(''); setError(null); }}
                className="w-full text-sm text-courtgray font-medium mt-4 hover:text-midnight dark:hover:text-white transition-colors"
              >
                Change phone number
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
