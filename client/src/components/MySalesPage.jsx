export function MySalesPage({ isAuthenticated, user, favoritesCount, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl mb-4">My Yard Sales</h1>
        <p className="text-gray-600">Your hosted sales will appear here</p>
      </div>
    </div>
  );
}
