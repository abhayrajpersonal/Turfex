
import React, { useState } from 'react';
import { X, Trash2, ArrowRight, CheckCircle, CreditCard, ShoppingBag } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useUI } from '../../context/UIContext';
import Confetti from '../common/Confetti';

interface CartModalProps {
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ onClose }) => {
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useData();
  const { showToast, triggerConfetti } = useUI();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 1000 ? 0 : 99;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    // Simulate API Payment
    setTimeout(() => {
        setIsCheckingOut(false);
        setIsSuccess(true);
        triggerConfetti();
        setTimeout(() => {
            clearCart();
            onClose();
            showToast("Order Placed Successfully!", "success");
        }, 3000);
    }, 2000);
  };

  if (isSuccess) {
      return (
        <div className="fixed inset-0 bg-white dark:bg-darkbg z-[100] flex flex-col items-center justify-center p-6 animate-fade-in-up">
            <Confetti />
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-scale-in">
                <CheckCircle size={48} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-display font-black text-midnight dark:text-white mb-2">Order Confirmed!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-center">Thanks for shopping with Turfex.<br/>Your gear is on the way.</p>
            <div className="w-full max-w-sm bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between mb-2 text-sm">
                    <span className="text-gray-500">Order ID</span>
                    <span className="font-bold font-mono">TRF-{Math.floor(Math.random()*10000)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Amount Paid</span>
                    <span className="font-bold text-green-600">₹{total}</span>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-[90] flex justify-end backdrop-blur-sm">
      <div className="bg-white dark:bg-darkcard w-full max-w-md h-full flex flex-col shadow-2xl animate-slide-left relative">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-offwhite/50 dark:bg-gray-800/50">
            <h3 className="font-bold text-lg text-midnight dark:text-white flex items-center gap-2">
               <ShoppingBag size={20} /> Your Cart <span className="bg-electric text-white text-xs px-2 py-0.5 rounded-full">{cart.length}</span>
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"><X size={20}/></button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 opacity-60">
                    <ShoppingBag size={64} className="mb-4" />
                    <p className="font-bold">Your cart is empty.</p>
                    <p className="text-xs mt-1">Go add some cool gear!</p>
                </div>
            ) : (
                cart.map(item => (
                    <div key={item.cartItemId} className="flex gap-4 bg-white dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shrink-0">
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <h4 className="font-bold text-sm text-midnight dark:text-white line-clamp-1">{item.name}</h4>
                                <p className="text-xs text-gray-500 mt-1">
                                    {item.selectedSize && <span className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded mr-2">{item.selectedSize}</span>}
                                    {item.selectedColor && <span className="inline-block w-3 h-3 rounded-full border border-gray-300 align-middle" style={{backgroundColor: item.selectedColor}}></span>}
                                </p>
                            </div>
                            <div className="flex justify-between items-end">
                                <div className="font-black text-midnight dark:text-white">₹{item.price * item.quantity}</div>
                                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <button onClick={() => updateCartQuantity(item.cartItemId, -1)} className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-l-lg transition-colors">-</button>
                                    <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                                    <button onClick={() => updateCartQuantity(item.cartItemId, 1)} className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-r-lg transition-colors">+</button>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => removeFromCart(item.cartItemId)} className="text-gray-400 hover:text-red-500 self-start"><Trash2 size={16}/></button>
                    </div>
                ))
            )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
            <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-darkcard pb-safe-bottom">
                <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Shipping</span>
                        <span className={shipping === 0 ? 'text-green-500 font-bold' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                    </div>
                    <div className="flex justify-between text-lg font-black text-midnight dark:text-white pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                        <span>Total</span>
                        <span>₹{total}</span>
                    </div>
                </div>
                
                <button 
                    disabled={isCheckingOut}
                    onClick={handleCheckout}
                    className="w-full bg-electric text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:scale-100"
                >
                    {isCheckingOut ? (
                        <>Processing...</>
                    ) : (
                        <>Checkout <ArrowRight size={18} /></>
                    )}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
