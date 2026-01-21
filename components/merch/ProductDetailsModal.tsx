
import React, { useState } from 'react';
import { X, Star, ShoppingBag, Truck, ShieldCheck, Heart } from 'lucide-react';
import { MerchItem } from '../../lib/types';
import { useData } from '../../context/DataContext';
import { useUI } from '../../context/UIContext';

interface ProductDetailsModalProps {
  product: MerchItem;
  onClose: () => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose }) => {
  const { addToCart } = useData();
  const { showToast } = useUI();
  
  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors ? product.colors[0] : null);
  const [selectedSize, setSelectedSize] = useState<string | null>(product.sizes ? product.sizes[0] : null);
  const [quantity, setQuantity] = useState(1);

  // Mock sizes if not present
  const sizes = product.sizes || ['S', 'M', 'L', 'XL'];

  const handleAddToCart = () => {
    addToCart({
      ...product,
      cartItemId: `${product.id}-${selectedColor}-${selectedSize}`,
      quantity,
      selectedColor: selectedColor || undefined,
      selectedSize: selectedSize || undefined
    });
    showToast(`Added ${quantity} ${product.name} to cart!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-white dark:bg-darkcard rounded-3xl w-full max-w-4xl h-[90vh] md:h-auto overflow-hidden shadow-2xl relative flex flex-col md:flex-row">
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-black/10 dark:bg-white/10 rounded-full text-midnight dark:text-white hover:bg-black/20 transition-colors"><X size={20}/></button>
        
        {/* Image Section */}
        <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-100 dark:bg-gray-800 relative">
           <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
           {product.is_new && <span className="absolute top-6 left-6 bg-electric text-white text-xs font-black px-3 py-1 rounded-md uppercase tracking-wider">New Drop</span>}
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
           <div className="flex justify-between items-start mb-2">
              <div>
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{product.category}</p>
                 <h2 className="text-3xl font-display font-black text-midnight dark:text-white leading-tight">{product.name}</h2>
              </div>
              <div className="flex flex-col items-end">
                 <span className="text-2xl font-black text-midnight dark:text-white">₹{product.price}</span>
                 {product.original_price && <span className="text-sm text-gray-400 line-through">₹{product.original_price}</span>}
              </div>
           </div>

           <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400">
                 <Star size={16} fill="currentColor" />
                 <Star size={16} fill="currentColor" />
                 <Star size={16} fill="currentColor" />
                 <Star size={16} fill="currentColor" />
                 <Star size={16} className="text-gray-300" fill="currentColor" />
              </div>
              <span className="text-sm font-bold text-gray-500">({product.reviews_count} reviews)</span>
           </div>

           <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-8">
              {product.description}
           </p>

           {/* Selectors */}
           <div className="space-y-6 mb-8">
              {product.colors && (
                  <div>
                      <span className="text-xs font-bold text-midnight dark:text-white uppercase tracking-wider block mb-3">Select Color</span>
                      <div className="flex gap-3">
                          {product.colors.map(color => (
                              <button 
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${selectedColor === color ? 'border-electric scale-110' : 'border-transparent hover:scale-105'}`}
                              >
                                  <div className="w-8 h-8 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: color }}></div>
                              </button>
                          ))}
                      </div>
                  </div>
              )}

              <div>
                  <span className="text-xs font-bold text-midnight dark:text-white uppercase tracking-wider block mb-3">Select Size</span>
                  <div className="flex gap-3 flex-wrap">
                      {sizes.map(size => (
                          <button 
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`min-w-[48px] h-12 rounded-xl border font-bold text-sm transition-all ${selectedSize === size ? 'bg-midnight dark:bg-white text-white dark:text-midnight border-transparent' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-400'}`}
                          >
                              {size}
                          </button>
                      ))}
                  </div>
              </div>
           </div>

           {/* Actions */}
           <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-700 flex gap-4">
               <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-4">
                   <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-lg font-bold text-gray-500 hover:text-midnight dark:hover:text-white">-</button>
                   <span className="mx-4 font-bold text-midnight dark:text-white w-4 text-center">{quantity}</span>
                   <button onClick={() => setQuantity(quantity + 1)} className="text-lg font-bold text-gray-500 hover:text-midnight dark:hover:text-white">+</button>
               </div>
               <button 
                 onClick={handleAddToCart}
                 className="flex-1 bg-electric text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all flex items-center justify-center gap-2 active:scale-95"
               >
                   <ShoppingBag size={20} /> Add to Cart - ₹{product.price * quantity}
               </button>
           </div>
           
           {/* Trust Badges */}
           <div className="mt-6 flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
               <div className="flex items-center gap-1"><Truck size={14}/> Fast Delivery</div>
               <div className="flex items-center gap-1"><ShieldCheck size={14}/> 1 Year Warranty</div>
               <div className="flex items-center gap-1"><Heart size={14}/> Easy Returns</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
