import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { AuthPage } from './components/AuthPage';
import { SavedPage } from './components/SavedPage';
import { CreateSalePage } from './components/CreateSalePage';
import { ProfilePage } from './components/ProfilePage';
import { MySalesPage } from './components/MySalesPage';

const API_URL = import.meta?.env?.VITE_API_URL || 'http://localhost:3001';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/user`, {
        credentials: 'include'
      });

      if (response.ok) {
        const userData = await response.json();
        setIsAuthenticated(true);
        setUser({
          username: userData.user.username,
          avatar_url: userData.user.avatarurl
        });

      }
    } catch (error) {

      console.log('Backend not available - running in frontend-only mode', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite - only works when authenticated
  const toggleFavorite = async (saleId) => {
    if (!isAuthenticated) {
      alert('Please login to save favorites!');
      return;
    }

    const isFavorited = favorites.includes(saleId);
    
    if (isFavorited) {
      setFavorites(prev => prev.filter(id => id !== saleId));
    } else {
      setFavorites(prev => [...prev, saleId]);
    }

  };

  // When user logs out
  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
    
    setIsAuthenticated(false);
    setUser(null);
    setFavorites([]);
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="size-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              isAuthenticated={isAuthenticated}
              user={user}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              onLogout={handleLogout}
            />
          } 
        />
        <Route 
          path="/auth" 
          element={<AuthPage />} 
        />
        <Route 
          path="/saved" 
          element={
            isAuthenticated ? (
              <SavedPage 
                isAuthenticated={isAuthenticated}
                user={user}
                favorites={favorites}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />
        <Route 
          path="/create" 
          element={
            isAuthenticated ? (
              <CreateSalePage 
                isAuthenticated={isAuthenticated}
                user={user}
                favoritesCount={favorites.length}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />
        <Route 
          path="/profile" 
          element={
            isAuthenticated ? (
              <ProfilePage 
                isAuthenticated={isAuthenticated}
                user={user}
                favoritesCount={favorites.length}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />
        <Route 
          path="/my-sales" 
          element={
            isAuthenticated ? (
              <MySalesPage 
                isAuthenticated={isAuthenticated}
                user={user}
                favoritesCount={favorites.length}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
    </Router>
  );
}
