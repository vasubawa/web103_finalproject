export function MapView() {
  return (
    <div className="flex-1 bg-linear-to-br from-emerald-50 to-blue-50 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="border border-gray-400"></div>
          ))}
        </div>
      </div>

      <div className="text-center text-gray-600 z-10 p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
        <div className="text-6xl mb-4">🗺️</div>
        <p className="text-2xl font-bold text-gray-800 mb-2">Interactive Map</p>
        <p className="text-sm text-gray-600 mb-4">View all yard sales on an interactive map</p>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <span className="inline-block w-3 h-3 bg-emerald-500 rounded-full"></span>
          <span>Happening Now</span>
          <span className="inline-block w-3 h-3 bg-blue-500 rounded-full ml-3"></span>
          <span>Upcoming</span>
        </div>
      </div>
    </div>
  );
}
