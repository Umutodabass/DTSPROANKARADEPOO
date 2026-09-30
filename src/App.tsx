import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Deployments } from './pages/Deployments';
import { ShoppingList } from './pages/ShoppingList';
import { Personnel } from './pages/Personnel';
import { Definitions } from './pages/Definitions';
import { useStore } from './store/useStore';

function App() {
  const initialize = useStore(state => state.initialize);
  const isInitialized = useStore(state => state.isInitialized);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
        <div className="text-white text-xl animate-pulse font-semibold tracking-wide">
          Veriler Yükleniyor...
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="deployments" element={<Deployments />} />
          <Route path="shopping-list" element={<ShoppingList />} />
          <Route path="personnel" element={<Personnel />} />
          <Route path="definitions" element={<Definitions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
