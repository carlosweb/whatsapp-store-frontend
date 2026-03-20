import React, { useState } from 'react';
import { useConfig, useCatalog, useTheme } from '../contexts/AppContext';
import { Plus, Trash2, Settings, Edit, ExternalLink, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export default function AdminView() {
  const { t } = useTranslation();
  const { config, setConfig } = useConfig();
  const { catalog, setCatalog } = useCatalog();
  const { theme, setTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('config');

  const handleConfigSave = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    setConfig({
      businessName: fd.get('businessName'),
      logoUrl: fd.get('logoUrl'),
      primaryColor: fd.get('primaryColor'),
      phoneNumber: fd.get('phoneNumber'),
      language: fd.get('language'),
      isSetupComplete: true,
    });
    toast.success(t('settings_saved'));
    if (!config.isSetupComplete) {
      setActiveTab('products');
    }
  };

  const [editingProduct, setEditingProduct] = useState(null);

  const handleProductSave = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const productData = {
      title: fd.get('title'),
      description: fd.get('description'),
      price: parseFloat(fd.get('price')),
      imageUrls: fd.get('imageUrls').split('\n').map(u => u.trim()).filter(Boolean),
    };

    if (editingProduct.id) {
      setCatalog(catalog.map(p => p.id === editingProduct.id ? { ...p, ...productData } : p));
    } else {
      setCatalog([...catalog, { id: Date.now().toString(), ...productData }]);
    }
    toast.success(t('product_saved'));
    setEditingProduct(null);
  };

  const deleteProduct = (id) => {
    if(confirm(t('delete_confirm'))) {
      setCatalog(catalog.filter(p => p.id !== id));
      toast.info(t('product_deleted'));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-subtle)] dark:bg-zinc-950 p-6 font-sans text-black dark:text-white selection:bg-[var(--color-primary)] selection:text-white pb-24 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold m-0 tracking-tight">{t('dashboard')}</h1>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className="p-2 bg-white dark:bg-zinc-900 rounded-full shadow-sm border border-gray-200 dark:border-white/10 hover:border-black dark:hover:border-white/40 transition-colors focus:outline-none text-black dark:text-white flex-shrink-0"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {config.isSetupComplete && (
              <Link to="/" target="_blank" className="hidden sm:flex items-center gap-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 px-4 py-2 rounded-xl text-sm font-bold hover:border-black dark:hover:border-white/40 transition-colors shadow-sm focus:outline-none">
                {t('view_store')} <ExternalLink size={16} />
              </Link>
            )}
          </div>
        </div>
        
        {!config.isSetupComplete && (
          <div className="bg-[var(--color-primary)] text-white p-6 rounded-2xl mb-8 shadow-lg">
            <h2 className="font-extrabold text-xl mb-1">{t('welcome')}</h2>
            <p className="font-medium opacity-90">{t('welcome_desc')}</p>
          </div>
        )}

        <div className="flex gap-2 mb-8 bg-gray-100 dark:bg-zinc-900 p-1.5 rounded-2xl">
          <button 
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all focus:outline-none ${activeTab === 'config' ? 'bg-white dark:bg-zinc-800 shadow-sm text-black dark:text-white' : 'text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'}`}
            onClick={() => setActiveTab('config')}
          >
            <Settings size={18} /> {t('settings')}
          </button>
          <button 
            disabled={!config.isSetupComplete}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all focus:outline-none ${activeTab === 'products' ? 'bg-white dark:bg-zinc-800 shadow-sm text-black dark:text-white' : 'text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'} ${!config.isSetupComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Plus size={18} strokeWidth={3} /> {t('products')}
          </button>
        </div>

        {activeTab === 'config' && (
          <form onSubmit={handleConfigSave} className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-white/5 animate-[slideUp_0.3s_ease]">
            <h2 className="text-2xl font-extrabold mb-6 text-black dark:text-white">{t('store_setup')}</h2>
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-bold ml-1 mb-2 text-gray-700 dark:text-zinc-400">{t('business_name')}</label>
                <input name="businessName" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-base font-medium outline-none focus:border-[var(--color-primary)] dark:focus:border-[var(--color-primary)] focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all dark:text-white" defaultValue={config.businessName} required />
              </div>
              <div>
                <label className="block text-sm font-bold ml-1 mb-2 text-gray-700 dark:text-zinc-400">{t('logo_url')}</label>
                <input name="logoUrl" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-base font-medium outline-none focus:border-[var(--color-primary)] dark:focus:border-[var(--color-primary)] focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all dark:text-white" defaultValue={config.logoUrl} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-bold ml-1 mb-2 text-gray-700 dark:text-zinc-400">{t('primary_color')}</label>
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-xl p-2 pr-4 focus-within:border-[var(--color-primary)] dark:focus-within:border-[var(--color-primary)] focus-within:bg-white dark:focus-within:bg-zinc-900 focus-within:ring-4 focus-within:ring-[var(--color-primary)]/10 transition-all">
                  <input name="primaryColor" type="color" className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-none outline-none flex-shrink-0" defaultValue={config.primaryColor} required />
                  <span className="text-sm font-medium text-gray-500 dark:text-zinc-400">{t('primary_color_desc')}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold ml-1 mb-2 text-gray-700 dark:text-zinc-400">{t('whatsapp_num')}</label>
                <input name="phoneNumber" type="tel" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-base font-medium outline-none focus:border-[var(--color-primary)] dark:focus:border-[var(--color-primary)] focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all dark:text-white" defaultValue={config.phoneNumber} placeholder="e.g. 14155552671" required />
                <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500 mt-2 ml-1">{t('whatsapp_desc')}</p>
              </div>
              <div>
                <label className="block text-sm font-bold ml-1 mb-2 text-gray-700 dark:text-zinc-400">{t('store_language')}</label>
                <select name="language" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-base font-medium outline-none focus:border-[var(--color-primary)] dark:focus:border-[var(--color-primary)] focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all dark:text-white" defaultValue={config.language || 'en'} required>
                  <option value="en">English (US)</option>
                  <option value="pt-BR">Português (BR)</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>
            
            <button type="submit" className="w-full mt-8 bg-black dark:bg-[var(--color-primary)] text-white py-4 rounded-xl text-lg font-bold hover:scale-[1.01] active:scale-[0.98] transition-transform shadow-lg focus:outline-none">
              {config.isSetupComplete ? t('save_changes') : t('complete_setup')}
            </button>
          </form>
        )}

        {activeTab === 'products' && (
          <div className="animate-[slideUp_0.3s_ease]">
            {editingProduct ? (
              <form onSubmit={handleProductSave} className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-white/5">
                <h3 className="text-2xl font-extrabold mb-6 mt-0 text-black dark:text-white">{editingProduct.id ? t('edit_product') : t('add_product')}</h3>
                
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="block text-sm font-bold ml-1 mb-2 text-gray-700 dark:text-zinc-400">{t('product_title')}</label>
                    <input name="title" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-base font-medium outline-none focus:border-[var(--color-primary)] dark:focus:border-[var(--color-primary)] focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all dark:text-white" defaultValue={editingProduct.title} required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold ml-1 mb-2 text-gray-700 dark:text-zinc-400">{t('description')}</label>
                    <textarea name="description" rows="3" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-base font-medium outline-none resize-y focus:border-[var(--color-primary)] dark:focus:border-[var(--color-primary)] focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all dark:text-white" defaultValue={editingProduct.description} required></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold ml-1 mb-2 text-gray-700 dark:text-zinc-400">{t('price')}</label>
                    <input name="price" type="number" step="0.01" min="0" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-base font-medium outline-none focus:border-[var(--color-primary)] dark:focus:border-[var(--color-primary)] focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all dark:text-white" defaultValue={editingProduct.price} required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold ml-1 mb-2 text-gray-700 dark:text-zinc-400">{t('image_urls')}</label>
                    <textarea name="imageUrls" rows="3" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-base font-medium outline-none focus:border-[var(--color-primary)] dark:focus:border-[var(--color-primary)] focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all resize-y dark:text-white dark:placeholder-zinc-500" defaultValue={editingProduct.imageUrls ? editingProduct.imageUrls.join('\n') : editingProduct.imageUrl || ''} required placeholder="https://image1.jpg&#10;https://image2.jpg"></textarea>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button type="button" className="flex-1 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-white/10 text-black dark:text-white py-4 rounded-xl text-lg font-bold hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors focus:outline-none" onClick={() => setEditingProduct(null)}>{t('cancel')}</button>
                  <button type="submit" className="flex-1 bg-[var(--color-primary)] text-white py-4 rounded-xl text-lg font-bold hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_8px_20px_-6px_var(--color-primary)] focus:outline-none">{t('save_product_btn')}</button>
                </div>
              </form>
            ) : (
              <div>
                <button 
                  className="w-full bg-black dark:bg-[var(--color-primary)] text-white py-4 rounded-2xl text-lg font-bold hover:scale-[1.01] active:scale-[0.98] transition-transform shadow-lg mb-8 flex items-center justify-center gap-2 focus:outline-none"
                  onClick={() => setEditingProduct({ title: '', description: '', price: '', imageUrl: '' })}
                >
                  <Plus size={20} className="text-white" strokeWidth={3} />
                  {t('add_product')}
                </button>
                
                {catalog.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-[32px] border border-gray-100 dark:border-white/5">
                    <p className="text-gray-500 dark:text-zinc-400 font-medium">{t('no_products_admin')}</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {catalog.map(product => (
                      <div key={product.id} className="flex items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 p-4 rounded-2xl hover:shadow-md transition-shadow">
                        <img src={product.imageUrls?.[0] || product.imageUrl} alt={product.title} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl bg-gray-50 dark:bg-zinc-800 object-center flex-shrink-0 border border-gray-100 dark:border-white/10" />
                        <div className="flex-1 min-w-0">
                          <strong className="block text-lg font-bold truncate tracking-tight text-black dark:text-white">{product.title}</strong>
                          <div className="text-gray-500 dark:text-zinc-400 font-medium text-sm">${product.price.toFixed(2)}</div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-2 pr-2">
                          <button className="p-2 sm:p-2.5 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-black dark:text-white rounded-xl transition-colors focus:outline-none" onClick={() => setEditingProduct(product)}>
                            <Edit size={18} />
                          </button>
                          <button className="p-2 sm:p-2.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 dark:text-red-400 rounded-xl transition-colors focus:outline-none" onClick={() => deleteProduct(product.id)}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
