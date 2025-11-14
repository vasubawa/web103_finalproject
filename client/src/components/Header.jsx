import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Heart, Plus, User, LogOut } from 'lucide-react';
import { Button } from './Button';

export function Header({ searchQuery, setSearchQuery, isAuthenticated, user, favoritesCount, onLogout }) {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [location, setLocation] = useState('Orlando, FL');

  return (
    <header className="bg-emerald-600 text-white px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="shrink-0">
          <h1 className="text-white cursor-pointer text-2xl font-medium leading-none" onClick={() => navigate('/')}>
            YardLoop
          </h1>
        </div>

        <button 
          onClick={() => setShowLocationModal(true)}
          className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 h-10 px-4 rounded-full transition-colors"
        >
          <MapPin className="size-5" />
          <span>{location}</span>
        </button>

        {showLocationModal && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowLocationModal(false)}
            ></div>
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-96 z-50 shadow-xl">
              <h3 className="text-gray-900 mb-4 font-semibold">Change Location</h3>
              <input 
                type="text"
                placeholder="Enter city, state or zip"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-4"
              />
              <div className="flex gap-2">
                <Button 
                  variant="secondary"
                  onClick={() => setShowLocationModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary"
                  onClick={() => setShowLocationModal(false)}
                  className="flex-1"
                >
                  Update
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search yard sales..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Saved Button - only show count if authenticated */}
          <button 
            onClick={() => {
              if (isAuthenticated) {
                navigate('/saved');
              } else {
                alert('Please login to view saved sales!');
                navigate('/auth');
              }
            }}
            className="flex items-center gap-2 hover:bg-emerald-700 h-10 px-4 rounded-lg transition-colors"
          >
            <Heart className="size-5" />
            <span>Saved</span>
            {isAuthenticated && (
              <span className="text-emerald-200">({favoritesCount})</span>
            )}
          </button>

          <Button 
            variant="secondary"
            className="rounded-full h-10 px-6"
            onClick={() => {
              if (!isAuthenticated) {
                navigate('/auth');
              } else {
                navigate('/create');
              }
            }}
          >
            <Plus className="size-5 mr-2" />
            Host a Sale
          </Button>

          {/* User Profile / Login */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button 
                className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 px-3 py-2 rounded-full transition-colors"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {user.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={user.username}
                    className="size-8 rounded-full border-2 border-white object-cover"
                  />
                ) : (
                  <div className="size-8 rounded-full bg-emerald-700 flex items-center justify-center border-2 border-white">
                    <User className="size-5" />
                  </div>
                )}
                <span className="hidden lg:inline">{user.username}</span>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <>
                  {/* Backdrop to close menu */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowUserMenu(false)}
                  ></div>
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate('/my-sales');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      My Sales
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={() => {
                        onLogout();
                        setShowUserMenu(false);
                        navigate('/');
                      }}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="size-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button 
              className="flex items-center justify-center size-12 bg-emerald-800 hover:bg-emerald-900 rounded-full transition-colors"
              onClick={() => navigate('/auth')}
            >
              <User className="size-6" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
