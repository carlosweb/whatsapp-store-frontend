import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { useConfig } from './contexts/AppContext';

import CustomerView from './pages/CustomerView';
import AdminView from './pages/AdminView';
import CheckoutView from './pages/CheckoutView';
import AdminLogin from './pages/AdminLogin';
import { Loader2 } from 'lucide-react';

function App() {
  const { isLoadingStore } = useConfig();

  if (isLoadingStore) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-subtle)] dark:bg-zinc-950">
        <Loader2 className="animate-spin w-12 h-12 text-[var(--color-primary)] opacity-50" />
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <Routes>
        {/* Public Store Views */}
        <Route path="/" element={<Navigate to="/admin" />} />
        <Route path="/:storeSlug" element={<CustomerView />} />
        <Route path="/:storeSlug/checkout" element={<CheckoutView />} />
        
        {/* Admin Views */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
          <Route path="/admin/dashboard" element={<AdminView />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
