import { useState } from 'react';
import { Header } from './Header';
import { SalesList } from './SalesList';
import { MapView } from './MapView';
import { FilterDialog } from './FilterDialog';

export function HomePage({ isAuthenticated, user, favorites, toggleFavorite, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    distance: 10,
    status: 'all'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isAuthenticated={isAuthenticated}
        user={user}
        favoritesCount={favorites.length}
        onLogout={onLogout}
      />
      
      <div className="flex h-[calc(100vh-80px)]">
        <SalesList 
          searchQuery={searchQuery}
          filters={filters}
          onFilterClick={() => setShowFilters(true)}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          isAuthenticated={isAuthenticated}
        />
        <MapView />
      </div>

      <FilterDialog 
        open={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
}