import { Routes, Route, Navigate } from 'react-router-dom';
import { useConfig } from './contexts/AppContext';

import CustomerView from './pages/CustomerView';
import AdminView from './pages/AdminView';
import CheckoutView from './pages/CheckoutView';

function App() {
  const { config } = useConfig();

  return (
    <div className="app-wrapper">
      <Routes>
        <Route path="/" element={config.isSetupComplete ? <CustomerView /> : <Navigate to="/admin" />} />
        <Route path="/admin" element={<AdminView />} />
        <Route path="/checkout" element={<CheckoutView />} />
      </Routes>
    </div>
  );
}

export default App;
