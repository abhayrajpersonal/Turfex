import React, { useState } from 'react';
import { X, Upload, Loader2, CheckCircle } from 'lucide-react';

interface KycModalProps {
  onClose: () => void;
  onComplete: () => void;
}

const KycModal: React.FC<KycModalProps> = ({ onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setStep(2);
    }, 1500);
  };

  const handleSubmit = () => {
    setIsUploading(true);
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={20}/></button>
        
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-midnight">Get Verified</h3>
          <p className="text-sm text-gray-500">Unlock social features by verifying your ID.</p>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
             <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors cursor-pointer" onClick={handleUpload}>
                {isUploading ? <Loader2 className="animate-spin text-electric mb-2" /> : <Upload className="mb-2" />}
                <span className="text-xs font-medium">Upload Government ID</span>
             </div>
             <div className="text-xs text-center text-gray-400">
               We accept Aadhar, PAN, or Driving License.
             </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-xl flex items-center gap-3">
               <CheckCircle className="text-green-600" size={24} />
               <div className="text-left">
                 <p className="text-sm font-bold text-midnight">Document Uploaded</p>
                 <p className="text-xs text-gray-500">aadhar_front.jpg</p>
               </div>
            </div>
            <button 
              onClick={handleSubmit}
              className="w-full bg-electric text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              {isUploading ? <Loader2 className="animate-spin" /> : 'Submit for Verification'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KycModal;