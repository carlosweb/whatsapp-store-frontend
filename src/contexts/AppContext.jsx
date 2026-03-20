import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import i18n from '../i18n';

const ConfigContext = createContext();
const CatalogContext = createContext();
const CartContext = createContext();
const ThemeContext = createContext();

// Default values
const defaultConfig = {
  businessName: 'My Business',
  logoUrl: '',
  primaryColor: '#FF5C00', // blue-500 legacy comment
  phoneNumber: '', // e.g., '1234567890'
  language: 'en',
  isSetupComplete: false,
};

const defaultCatalog = [
  { 
    id: '1', 
    title: 'Sample Product', 
    description: 'This is a great product. You can edit this in the admin panel.', 
    price: 19.99, 
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80' 
  }
];

export function AppProvider({ children }) {
  // Config State
  const [config, setConfigState] = useState(() => {
    const saved = localStorage.getItem('wt_config');
    return saved ? JSON.parse(saved) : defaultConfig;
  });

  const setConfig = (newConfig) => {
    const updated = { ...config, ...newConfig };
    setConfigState(updated);
    localStorage.setItem('wt_config', JSON.stringify(updated));
  };

  // Catalog State
  const [catalog, setCatalogState] = useState(() => {
    const saved = localStorage.getItem('wt_catalog');
    return saved ? JSON.parse(saved) : defaultCatalog;
  });

  const setCatalog = (newCatalog) => {
    setCatalogState(newCatalog);
    localStorage.setItem('wt_catalog', JSON.stringify(newCatalog));
  };

  // Cart State
  const [cart, setCartState] = useState(() => {
    const saved = localStorage.getItem('wt_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const updateCart = (newCart) => {
    setCartState(newCart);
    localStorage.setItem('wt_cart', JSON.stringify(newCart));
  };

  const addToCart = (product, quantity = 1) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      updateCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item));
    } else {
      updateCart([...cart, { ...product, quantity }]);
    }
    toast.success(`${product.title} added to cart`);
  };

  const removeFromCart = (productId) => {
    updateCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    updateCart(cart.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    updateCart([]);
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Theme State
  const [theme, setThemeState] = useState(() => localStorage.getItem('wt_theme') || 'light');
  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('wt_theme', newTheme);
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Apply CSS Variables and Language
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', config.primaryColor);
    const userLang = localStorage.getItem('user_lang');
    if (!userLang && config.language && i18n.language !== config.language) {
      i18n.changeLanguage(config.language);
    }
  }, [config.primaryColor, config.language]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ConfigContext.Provider value={{ config, setConfig }}>
        <CatalogContext.Provider value={{ catalog, setCatalog }}>
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
export function useTheme() {
  return useContext(ThemeContext);
}
