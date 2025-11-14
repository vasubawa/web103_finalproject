export function Badge({ status, children }) {
  const styles = status === 'happening' 
    ? 'bg-emerald-500' 
    : 'bg-gray-400';

  return (
    <div className={`px-4 py-2 text-white flex items-center gap-2 ${styles}`}>
      {status === 'happening' && (
        <div className="size-2 rounded-full bg-white animate-pulse"></div>
      )}
      <span className="text-white uppercase tracking-wide">
        {children}
      </span>
    </div>
  );
}
