import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Layout/Navbar';
import { HomePage } from './pages/HomePage';
import { ListingsPage } from './pages/ListingsPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { DashboardPage } from './pages/DashboardPage';
import useMetaMask from "./hooks/ConnectWallet";
import ConnectWalletModal from "./components/Layout/ConnectWalletModal";

const AppContent: React.FC = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [favorites, setFavorites] = useState(["1", "4"]);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const navigate = useNavigate();

  const { connect, accounts, isConnected } = useMetaMask();

const handleConnectWallet = async () => {
  try {
    const addresses = await connect();
    if (addresses && addresses.length > 0) {
      setWalletConnected(true);
      setShowWalletModal(false);
    } else {
      setWalletConnected(false);
    }
  } catch (e) {
    console.error("Wallet connect failed:", e);
    setWalletConnected(false);
  }
};


  useEffect(() => {
    setWalletConnected(Boolean(isConnected || (accounts && accounts.length > 0)));
  }, [isConnected, accounts]);

  const handleToggleFavorite = (propertyId: string) => {
    setFavorites(prev => 
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <>
      <Navbar 
        onConnectWallet={() => setShowWalletModal(true)}
        walletConnected={walletConnected}
      />

      <ConnectWalletModal
        show={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnectMetaMask={handleConnectWallet}
      />

      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              onToggleFavorite={handleToggleFavorite}
              onPropertyClick={handlePropertyClick}
            />
          } 
        />
        <Route 
          path="/listings" 
          element={
            <ListingsPage 
              onToggleFavorite={handleToggleFavorite}
              onPropertyClick={handlePropertyClick}
            />
          } 
        />
        <Route 
          path="/property/:id" 
          element={<PropertyDetailPage onToggleFavorite={handleToggleFavorite} />} 
        />
        <Route 
          path="/favorites" 
          element={
            <FavoritesPage 
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onPropertyClick={handlePropertyClick}
            />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <DashboardPage 
              walletConnected={walletConnected}
              onConnectWallet={handleConnectWallet}
            />
          } 
        />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;