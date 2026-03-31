import React from 'react';
import { Plus } from 'lucide-react';
import { useCart } from '../contexts/AppContext';
import { ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ProductCard({ product, onSelect }) {
  const { addToCart } = useCart();
  const { t } = useTranslation();

  const handleDragStart = (e) => e.preventDefault();

  return (
    <div className="group relative bg-white dark:bg-zinc-900 rounded-[24px] overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-2xl dark:border dark:border-white/5 flex flex-col">
      {/* Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-black text-white text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full">{t('new_badge')}</span>
      </div>
      
      {/* Image Area */}
      <div 
        className="w-full pt-[100%] relative cursor-pointer bg-[#F9F9F9] dark:bg-zinc-800 overflow-hidden"
        onClick={() => onSelect(product)}
      >
        <img 
          src={product.imageUrls?.[0] || product.imageUrl} 
          alt={product.title}
          onDragStart={handleDragStart} 
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      
      {/* Info Area */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 gap-4">
          <h3 
            className="m-0 text-lg font-bold text-black dark:text-white cursor-pointer leading-tight tracking-tight" 
            onClick={() => onSelect(product)}
          >
            {product.title}
          </h3>
          <button 
            className="flex-shrink-0 bg-white dark:bg-zinc-800 text-black dark:text-white border border-gray-200 dark:border-white/10 p-2 rounded-full hover:bg-[var(--color-primary)] dark:hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] hover:scale-105 transition-all shadow-sm hover:shadow-lg focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
          >
            <Plus size={18} />
          </button>
        </div>
        
        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 mb-6 line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        <div className="flex items-end justify-between mt-auto">
          <strong className="text-2xl font-black text-black dark:text-white tracking-tighter">
            R$ {product.price.toFixed(2)}
          </strong>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('in_stock')}</span>
        </div>
      </div>
    </div>
  );
}
