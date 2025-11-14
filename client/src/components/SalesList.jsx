import { mockSales } from '../data/mockData';
import { Badge } from './Badge';
import { Clock, MapPin, Heart, Package, Filter } from 'lucide-react';

export function SalesList({ searchQuery, filters, onFilterClick, favorites, toggleFavorite, isAuthenticated }) {
  // Filter sales based on search and filters
  const filteredSales = mockSales.filter(sale => {
    const matchesSearch = searchQuery === '' || 
      sale.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filters.status === 'all' || sale.status === filters.status;
    const matchesDistance = sale.distance <= filters.distance;
    const matchesCategories = filters.categories.length === 0 ||
      filters.categories.some(cat => sale.categories.includes(cat));

    return matchesSearch && matchesStatus && matchesDistance && matchesCategories;
  });

  const happeningNow = filteredSales.filter(sale => sale.status === 'happening');
  const upcoming = filteredSales.filter(sale => sale.status === 'upcoming');

  return (
    <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-gray-900">Sales Near You</h2>
          <button 
            onClick={onFilterClick}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
          >
            <Filter className="size-5" />
            <span>Filter</span>
          </button>
        </div>
        <p className="text-gray-600">
          There are <span className="text-emerald-600">{filteredSales.length}</span> sales happening
        </p>
      </div>

      <div className="p-4 space-y-4">
        {happeningNow.length > 0 && (
          <div>
            {happeningNow.map(sale => (
              <SaleCard 
                key={sale.id}
                sale={sale}
                isFavorite={favorites.includes(sale.id)}
                onToggleFavorite={toggleFavorite}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        )}

        {upcoming.length > 0 && (
          <div>
            {upcoming.map(sale => (
              <SaleCard 
                key={sale.id}
                sale={sale}
                isFavorite={favorites.includes(sale.id)}
                onToggleFavorite={toggleFavorite}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        )}

        {filteredSales.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No sales found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SaleCard({ sale, isFavorite, onToggleFavorite, isAuthenticated }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 hover:shadow-md transition-shadow">
      {/* Status Badge */}
      <Badge status={sale.status}>
        {sale.status === 'happening' ? 'Happening Now' : 'Upcoming'}
      </Badge>

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-gray-900 mb-2">{sale.address}</h3>
            <div className="flex items-center gap-3 text-gray-600 text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="size-4" />
                <span>{sale.distance} mi</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="size-4" />
                <span>{sale.time}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => {
              if (isAuthenticated) {
                onToggleFavorite(sale.id);
              } else {
                alert('Please login to save favorites');
              }
            }}
            className={`text-red-500 hover:scale-110 transition-transform ${!isAuthenticated ? 'opacity-50' : ''}`}
            title={!isAuthenticated ? 'Login to save favorites' : isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`size-6 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Items and Categories */}
        <div className="flex items-center gap-2 mb-3 text-gray-700">
          <Package className="size-4" />
          <span>+{sale.itemCount} items</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">{sale.categories.join(', ')}</p>

        {/* Who's Going */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-sm text-gray-600 mb-2">Who's going?</p>
            <div className="flex items-center gap-1">
              {sale.attendees.slice(0, 3).map((attendee, index) => (
                <div 
                  key={index}
                  className="size-8 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs border-2 border-white -ml-2 first:ml-0"
                  title={attendee}
                >
                  {attendee.charAt(0)}
                </div>
              ))}
              {sale.attendees.length > 3 && (
                <div className="size-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs -ml-2">
                  +{sale.attendees.length - 3}
                </div>
              )}
            </div>
          </div>
          <button className="text-emerald-600 hover:text-emerald-700 text-sm">
            Check in!
          </button>
        </div>
      </div>
    </div>
  );
}
