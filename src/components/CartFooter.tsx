import React from 'react';
import { useCart, useConfig } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CartFooter() {
  const { cart, totalPrice: cartTotalPrice } = useCart();
  const { config } = useConfig();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  // The totalPrice from useCart is used directly, so this manual calculation is removed.
  // const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-md z-40 animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
      <div 
        className="w-full flex items-center justify-between bg-black dark:bg-zinc-900 text-white px-5 py-3.5 rounded-2xl text-base font-bold shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] dark:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all border border-gray-800 dark:border-white/10"
      >
        <div className="flex items-center gap-4 bg-white/10 px-4 py-2 rounded-2xl">
          <div className="relative flex items-center justify-center">
            <ShoppingBag size={24} className="text-[var(--color-primary)]" strokeWidth={2.5} />
            <span className="absolute -top-1.5 -right-2 bg-[var(--color-primary)] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {totalItems}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white leading-none tracking-tighter">${cartTotalPrice.toFixed(2)}</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              {totalItems} {totalItems === 1 ? t('item') : t('items')}
            </span>
          </div>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/${config.slug}/checkout`);
          }}
          className="flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white px-6 sm:px-8 py-3.5 rounded-2xl font-bold text-sm hover:scale-[1.03] active:scale-[0.97] transition-all shadow-lg focus:outline-none shrink-0"
        >
          {t('view_cart')}
          <ArrowRight size={18} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
