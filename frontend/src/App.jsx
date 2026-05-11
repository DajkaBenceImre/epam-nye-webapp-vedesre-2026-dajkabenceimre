import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/authSlice';

import Dashboard from './pages/Dashboard';
import Vault from './pages/Vault';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import { useModal } from './context/ModalContext';

function App() {
  const { isAuthenticated, username } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showConfirm } = useModal();

  const handleLogout = () => {
    showConfirm('Biztosan ki szeretnél jelentkezni?', () => {
        dispatch(logout());
        navigate('/login');
    });
  };

  return (
    <div>
      <nav style={{ padding: '15px', background: '#282c34', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '15px', fontWeight: 'bold' }}>
            <span style={{ color: '#fff', marginRight: '20px' }}>💰 Finance Tracker</span>
            {isAuthenticated && (
              <>
                <Link to="/" style={{ color: '#61dafb', textDecoration: 'none' }}>Dashboard</Link>
                <Link to="/vault" style={{ color: '#61dafb', textDecoration: 'none' }}>Széf</Link>
              </>
            )}
        </div>
        
        <div>
            {isAuthenticated ? (
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <span>Helló, {username}!</span>
                    <button onClick={handleLogout} style={{ background: '#f44336', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                        Kijelentkezés
                    </button>
                </div>
            ) : (
                <Link to="/login" style={{ color: '#61dafb', textDecoration: 'none' }}>Bejelentkezés</Link>
            )}
        </div>
      </nav>

      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <Routes>
          {/* Védett útvonalak */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/vault" element={
            <ProtectedRoute>
              <Vault />
            </ProtectedRoute>
          } />

          {/* Publikus útvonal */}
          <Route path="/login" element={<Auth />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;