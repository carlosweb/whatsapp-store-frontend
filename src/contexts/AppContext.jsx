import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import i18n from '../i18n';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';

const ConfigContext = createContext();
const CatalogContext = createContext();
const CartContext = createContext();
const ThemeContext = createContext();

const defaultConfig = {
  businessName: 'My Business',
  slug: '',
  logoUrl: '',
  primaryColor: '#FF5C00',
  phoneNumber: '',
  language: 'en',
  isSetupComplete: false,
};

export function AppProvider({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  
  const [config, setConfig] = useState(defaultConfig);
  const [catalog, setCatalog] = useState([]);
  const [isLoadingStore, setIsLoadingStore] = useState(true);
  
  // Theme State (keep theme & cart in localStorage)
  const [theme, setThemeState] = useState(() => localStorage.getItem('wt_theme') || 'light');
  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('wt_theme', newTheme);
  };

  const [cart, setCartState] = useState(() => {
    const saved = localStorage.getItem('wt_cart');
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch (err) {
      console.warn("Cleared invalid cart data:", err);
      localStorage.removeItem('wt_cart');
      return [];
    }
  });

  const updateCart = (newCart) => {
    setCartState(newCart);
    localStorage.setItem('wt_cart', JSON.stringify(newCart));
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (config.primaryColor) {
      document.documentElement.style.setProperty('--primary-color', config.primaryColor);
    }
    const userLang = localStorage.getItem('user_lang');
    if (!userLang && config.language && i18n.language !== config.language) {
      i18n.changeLanguage(config.language);
    }
  }, [config.primaryColor, config.language]);

  // Fetch Store Data
  useEffect(() => {
    const loadStoreData = async () => {
      setIsLoadingStore(true);
      const isAdminRoute = location.pathname.startsWith('/admin');
      let storeData = null;

      try {
        if (isAdminRoute && user) {
          const { data, error } = await supabase.from('stores').select('*').eq('user_id', user.id).maybeSingle();
          if (data) storeData = data;
        } else if (!isAdminRoute && location.pathname !== '/') {
          const slug = location.pathname.split('/')[1];
          if (slug && slug !== 'checkout') {
            const { data, error } = await supabase.from('stores').select('*').eq('slug', slug).maybeSingle();
            if (data) storeData = data;
          }
        }

        if (storeData) {
          setConfig({
            id: storeData.id,
            businessName: storeData.business_name,
            slug: storeData.slug,
            logoUrl: storeData.logo_url,
            primaryColor: storeData.primary_color,
            phoneNumber: storeData.phone_number,
            language: storeData.language,
            isSetupComplete: true
          });
          
          // Fetch products
          const { data: products } = await supabase.from('products').select('*').eq('store_id', storeData.id);
          if (products) {
            setCatalog(products.map(p => ({
              id: p.id,
              title: p.title,
              description: p.description,
              price: Number(p.price),
              imageUrl: p.image_urls?.[0] || '',
              imageUrls: p.image_urls || []
            })));
          }
        } else {
          setConfig(defaultConfig);
          setCatalog([]);
        }
      } catch (err) {
        console.error("Error loading store data", err);
      } finally {
        setIsLoadingStore(false);
      }
    };

    loadStoreData();
  }, [user, location.pathname]);

  const updateConfig = async (newConfigData) => {
    if (!user) throw new Error("Must be logged in");
    const payload = {
      user_id: user.id,
      slug: newConfigData.slug,
      business_name: newConfigData.businessName,
      logo_url: newConfigData.logoUrl,
      primary_color: newConfigData.primaryColor,
      phone_number: newConfigData.phoneNumber,
      language: newConfigData.language,
    };

    if (config.id) {
      const { error } = await supabase.from('stores').update(payload).eq('id', config.id);
      if (error) throw error;
      setConfig(prev => ({ ...prev, ...newConfigData, isSetupComplete: true }));
    } else {
      const { data, error } = await supabase.from('stores').insert([payload]).select().single();
      if (error) throw error;
      setConfig(prev => ({ ...prev, ...newConfigData, id: data.id, isSetupComplete: true }));
    }
  };

  const addProduct = async (productData) => {
    if (!config.id) throw new Error("Store config not saved yet");
    const payload = {
      store_id: config.id,
      title: productData.title,
      description: productData.description,
      price: productData.price,
      image_urls: productData.imageUrls,
    };
    const { data, error } = await supabase.from('products').insert([payload]).select().single();
    if (error) throw error;
    
    const newProduct = {
      id: data.id,
      title: data.title,
      description: data.description,
      price: Number(data.price),
      imageUrl: data.image_urls?.[0] || '',
      imageUrls: data.image_urls || []
    };
    setCatalog(prev => [...prev, newProduct]);
  };

  const updateProduct = async (id, productData) => {
    const payload = {
      title: productData.title,
      description: productData.description,
      price: productData.price,
      image_urls: productData.imageUrls,
    };
    const { error } = await supabase.from('products').update(payload).eq('id', id);
    if (error) throw error;
    
    setCatalog(prev => prev.map(p => p.id === id ? {
      ...p,
      title: productData.title,
      description: productData.description,
      price: Number(productData.price),
      imageUrl: productData.imageUrls?.[0] || p.imageUrl,
      imageUrls: productData.imageUrls
    } : p));
  };

  const deleteProduct = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    setCatalog(prev => prev.filter(p => p.id !== id));
  };

  // Cart Functions
  const addToCart = (product, quantity = 1) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      updateCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item));
    } else {
      updateCart([...cart, { ...product, quantity }]);
    }
    toast.success(`${product.title} added to cart`);
  };

  const removeFromCart = (productId) => updateCart(cart.filter(item => item.id !== productId));
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    updateCart(cart.map(item => item.id === productId ? { ...item, quantity } : item));
  };
  const clearCart = () => updateCart([]);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ConfigContext.Provider value={{ config, updateConfig, isLoadingStore }}>
        <CatalogContext.Provider value={{ catalog, addProduct, updateProduct, deleteProduct }}>
          <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice }}>
            {children}
          </CartContext.Provider>
        </CatalogContext.Provider>
      </ConfigContext.Provider>
    </ThemeContext.Provider>
  );
}

export const useConfig = () => useContext(ConfigContext);
export const useCatalog = () => useContext(CatalogContext);
export const useCart = () => useContext(CartContext);
export const useTheme = () => useContext(ThemeContext);
