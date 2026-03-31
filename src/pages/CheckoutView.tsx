import React, { useState } from 'react';
import { useCart, useConfig } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus, MessageCircle } from 'lucide-react';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export default function CheckoutView() {
  const { t } = useTranslation();
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { config } = useConfig();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSendOrder = () => {
    if (!address.trim()) {
      toast.error(t('address_required'));
      return;
    }
    const link = generateWhatsAppLink(config.phoneNumber, cart, address, totalPrice);
    window.location.assign(link);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-subtle)] dark:bg-zinc-950 px-6 py-24 text-center transition-colors">
        <div className="max-w-lg mx-auto bg-white dark:bg-zinc-900 p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-white/5 text-center animate-[slideUp_0.4s_ease]">
          <div className="w-24 h-24 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trash2 size={32} className="text-gray-300 dark:text-zinc-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">{t('empty_cart')}</h2>
          <p className="text-gray-500 dark:text-zinc-400 mb-8">{t('empty_cart_desc')}</p>
          <button 
            onClick={() => navigate(`/${config.slug}`)}
            className="w-full bg-black text-white py-4 rounded-xl text-lg font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg focus:outline-none"
          >
            {t('return_catalog')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-subtle)] dark:bg-zinc-950 pb-12 font-sans text-black dark:text-white selection:bg-[var(--color-primary)] selection:text-white transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-6 sm:px-0">
        <div className="flex items-center gap-4 mb-8 pt-6">
          <button onClick={() => navigate(`/${config.slug}`)} className="p-2 bg-white dark:bg-zinc-900 rounded-full shadow-sm border border-gray-200 dark:border-white/10 hover:scale-110 transition-transform focus:outline-none">
            <ArrowLeft size={24} className="text-black dark:text-white" />
          </button>
          <h1 className="text-3xl font-extrabold m-0 tracking-tight">{t('checkout_title')}</h1>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-white/5 mb-6 animate-[slideUp_0.3s_ease]">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><div className="w-2 h-8 bg-[var(--color-primary)] rounded-full"></div>{t('order_summary')}</h2>
          
          <div className="flex flex-col gap-6">
            {cart.map(item => (
              <div key={item.id} className="flex gap-4 sm:gap-6 border-b border-gray-100 dark:border-white/5 pb-6 last:border-0 last:pb-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#F9F9F9] dark:bg-zinc-800 overflow-hidden flex-shrink-0 border border-gray-50 dark:border-white/5">
                  <img src={item.imageUrls?.[0] || item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3 mb-3">
                    <h3 className="font-extrabold text-lg flex-1 m-0 text-gray-900 dark:text-white leading-tight pr-4">{item.title}</h3>
                    <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors focus:outline-none shrink-0" title="Remove">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="font-black text-xl text-black dark:text-white">R$ {(item.price * item.quantity).toFixed(2)}</span>
                      {item.quantity > 1 && (
                        <div className="text-sm font-semibold text-[var(--color-primary)]">R$ {item.price.toFixed(2)} {t('each')}</div>
                      )}
                    </div>
                    
                    <div className="flex items-center bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-full overflow-hidden shadow-inner">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 sm:p-3 hover:bg-white dark:hover:bg-zinc-700 transition-colors focus:outline-none text-gray-700 dark:text-zinc-300" disabled={item.quantity <= 1}>
                        <Minus size={16} strokeWidth={3} />
                      </button>
                      <span className="w-10 text-center font-bold text-base tracking-wide dark:text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 sm:p-3 hover:bg-white dark:hover:bg-zinc-700 transition-colors focus:outline-none text-gray-700 dark:text-zinc-300">
                        <Plus size={16} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 flex justify-between items-end">
            <span className="text-lg font-bold text-gray-500 dark:text-zinc-400">{t('total')}</span>
            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-zinc-400 tracking-tighter">R$ {totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-white/5 mb-8 animate-[slideUp_0.4s_ease]">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><div className="w-2 h-8 bg-black dark:bg-[var(--color-primary)] rounded-full"></div>{t('delivery_details')}</h2>
          <div>
            <label className="block text-sm font-bold ml-1 mb-2 text-gray-700 dark:text-zinc-300">{t('full_address')}</label>
            <textarea 
              className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-base font-medium outline-none focus:border-[var(--color-primary)] dark:focus:border-[var(--color-primary)] focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all resize-y dark:text-white dark:placeholder-zinc-500"
              rows="3"
              placeholder={t('address_placeholder')}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>
        </div>

        <button 
          onClick={handleSendOrder}
          disabled={cart.length === 0}
          className="w-full bg-[#25D366] text-white flex items-center justify-center gap-3 py-4 sm:py-5 rounded-[24px] text-xl font-bold hover:bg-[#1EBE5D] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-[#25D366]/20 hover:scale-[1.02] active:scale-[0.98] mb-12 focus:outline-none"
        >
          <MessageCircle size={28} /> {t('send_whatsapp')}
        </button>
      </div>
    </div>
  );
}
