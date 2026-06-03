import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine);
  useEffect(() => {
    const on  = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  if (!offline) return null;
  return (
    <div style={{
      background: 'rgba(245,200,66,0.12)', border: '1px solid var(--border-gold)',
      borderRadius: '8px', padding: '10px 16px', display: 'flex', alignItems: 'center',
      gap: '10px', color: 'var(--gold-bright)', fontSize: '13px', margin: '8px 0',
    }}>
      <WifiOff size={16} />
      <span>You're offline. Data will be saved locally and synced when connection returns.</span>
    </div>
  );
}
export default OfflineBanner;
