import React, { useState } from 'react';
import { useConfig, useCatalog, useCart, useTheme } from '../contexts/AppContext';
import ProductCard from '../components/ProductCard';
import CartFooter from '../components/CartFooter';
import Carousel from '../components/Carousel';
import { X, ShoppingBag, Globe, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CustomerView() {
  const { t, i18n } = useTranslation();
  const { config } = useConfig();
  const { catalog } = useCatalog();
  const { addToCart } = useCart();
  const { theme, setTheme } = useTheme();

  const changeLang = (l) => {
    i18n.changeLanguage(l);
    localStorage.setItem('user_lang', l);
  };

  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fallback to a nice minimal string if logo is missing
  const businessInitial = config.businessName ? config.businessName.charAt(0).toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-[var(--color-bg-subtle)] dark:bg-zinc-950 pb-24 font-sans text-black dark:text-white selection:bg-[var(--color-primary)] selection:text-white transition-colors duration-300">
      
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 glass-header px-6 py-4 dark:bg-zinc-950/80">
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            {config.logoUrl ? (
              <img src={config.logoUrl} alt="Logo" className="h-10 w-10 object-cover rounded-full shadow-sm" />
            ) : (
              <div className="h-10 w-10 flex items-center justify-center bg-black text-white rounded-full font-bold text-lg">
                {businessInitial}
              </div>
            )}
            <h1 className="m-0 text-xl font-bold tracking-tight">{config.businessName}</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8 ml-8">
              <a href="#" className="text-sm font-semibold hover:text-[var(--color-primary)] dark:text-zinc-300 dark:hover:text-[var(--color-primary)] transition-colors">{t('categories')}</a>
              <a href="#" className="text-sm font-semibold hover:text-[var(--color-primary)] dark:text-zinc-300 dark:hover:text-[var(--color-primary)] transition-colors">{t('products')}</a>
              <a href="#" className="text-sm font-semibold hover:text-[var(--color-primary)] dark:text-zinc-300 dark:hover:text-[var(--color-primary)] transition-colors">{t('blogs')}</a>
            </nav>
          <div className="flex items-center gap-4">
            
            <div className="relative group flex items-center">
               <button className="p-2.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors focus:outline-none">
                 <Globe size={20} className="dark:text-zinc-300" />
               </button>
               <div className="absolute top-full right-0 mt-2 bg-white dark:bg-zinc-900 shadow-xl border border-gray-100 dark:border-white/10 rounded-2xl p-2 hidden group-hover:flex flex-col w-36 z-50 animate-[slideUp_0.2s_ease]">
                 <button onClick={() => changeLang('en')} className="px-4 py-2.5 text-sm font-semibold text-left hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors dark:text-zinc-200">English</button>
                 <button onClick={() => changeLang('pt-BR')} className="px-4 py-2.5 text-sm font-semibold text-left hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors dark:text-zinc-200">Português</button>
                 <button onClick={() => changeLang('es')} className="px-4 py-2.5 text-sm font-semibold text-left hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors dark:text-zinc-200">Español</button>
               </div>
            </div>

            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className="p-2.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors focus:outline-none"
            >
              {theme === 'dark' ? <Sun size={20} className="dark:text-zinc-300" /> : <Moon size={20} />}
            </button>
            
            <button className="hidden sm:block px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black text-sm font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-md">{t('join_newsletter')}</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 sm:pt-48 sm:pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto animate-[slideUp_0.8s_ease]">
          <h2 className="text-5xl sm:text-7xl font-black text-black dark:text-white leading-[1.05] tracking-tighter mb-6">{t('hero_title_1')}<span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[#FF8A00]">{t('hero_title_highlight')}</span><br className="hidden sm:block" />{t('hero_title_2')}</h2>
          <p className="text-lg sm:text-xl text-gray-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">{t('hero_subtitle')}</p>
        </div>
      </section>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-6">
        {catalog.length === 0 ? (
             <div className="col-span-full py-24 text-center">
                <div className="w-24 h-24 bg-gray-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag size={32} className="text-gray-400 dark:text-zinc-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-black dark:text-white">{t('no_products')}</h3>
                <p className="text-gray-500 dark:text-zinc-400">{t('no_products_desc')}</p>
             </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {catalog.map(product => (
              <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
            ))}
          </div>
        )}
      </main>

      <CartFooter />

      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6 transition-all duration-300">
          <div className="bg-white dark:bg-zinc-900 w-full sm:max-w-lg max-h-[95vh] overflow-y-auto rounded-t-[32px] sm:rounded-[32px] shadow-2xl relative animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
            
            <Carousel 
              images={selectedProduct.imageUrls || [selectedProduct.imageUrl]} 
              title={selectedProduct.title} 
              onClose={() => setSelectedProduct(null)} 
            />
            
            <div className="p-8 pt-6">
              <div className="flex justify-between items-start mb-3 gap-4">
                <h3 className="text-3xl font-extrabold text-black dark:text-white leading-tight m-0 tracking-tight">{selectedProduct.title}</h3>
                <strong className="text-3xl font-black text-[var(--color-primary)] tracking-tighter">${selectedProduct.price.toFixed(2)}</strong>
              </div>
              
              <p className="text-gray-600 dark:text-zinc-400 leading-relaxed mb-6 font-medium">{selectedProduct.description}</p>
                
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-sm font-bold text-[#00A650] bg-[#00A650]/10 px-4 py-2 rounded-full">{t('in_stock')}</span>
                  <span className="text-sm font-bold text-gray-600 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 px-4 py-2 rounded-full">{t('fast_shipping')}</span>
                </div>
                
                <button 
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  className="w-full bg-black dark:bg-[var(--color-primary)] text-white py-4 rounded-2xl text-lg font-bold shadow-xl shadow-black/20 dark:shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={20} />
                  {t('add_to_cart')} — ${selectedProduct.price.toFixed(2)}
                </button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}
