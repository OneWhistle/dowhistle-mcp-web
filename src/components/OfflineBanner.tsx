import React, { useEffect, useState } from 'react';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70]">
      <div className="inline-flex items-center gap-3 rounded-full border border-gray-300 bg-white/90 backdrop-blur px-4 py-2 shadow-lg">
        <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
        <span className="text-sm text-gray-700">You are offline. Some features may be unavailable.</span>
      </div>
    </div>
  );
}


