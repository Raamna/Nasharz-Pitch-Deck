import React, { useState, useEffect } from 'react';
import { DeckData } from './types';
import { getStoredData, logUserAccess } from './utils/storage';
import { LoginPage } from './components/LoginPage';
import { DeckPage } from './components/DeckPage';
import { AdminPortal } from './components/AdminPortal';

export default function App() {
  const [data, setData] = useState<DeckData>(getStoredData());
  const [page, setPage] = useState<'login' | 'deck' | 'admin'>('login');
  const [userName, setUserName] = useState<string>('');
  const [userRole, setUserRole] = useState<'client' | 'admin'>('client');

  // Load latest data on mount
  useEffect(() => {
    const loaded = getStoredData();
    setData(loaded);
  }, []);

  const handleClientLogin = (name: string) => {
    const clientName = name || 'Alaska Batteries Client';
    setUserName(clientName);
    setUserRole('client');
    logUserAccess(clientName, 'client');
    // Refresh data
    setData(getStoredData());
    setPage('deck');
  };

  const handleAdminLogin = () => {
    const adminName = 'aati';
    setUserName(adminName);
    setUserRole('admin');
    logUserAccess(adminName, 'admin');
    // Refresh data
    setData(getStoredData());
    setPage('admin');
  };

  const handleSignOut = () => {
    setUserName('');
    setUserRole('client');
    setPage('login');
  };

  return (
    <div className="min-h-screen bg-[#f4f3f0]">
      {page === 'login' && (
        <LoginPage
          branding={data.branding}
          onClientLogin={handleClientLogin}
          onAdminLogin={handleAdminLogin}
        />
      )}

      {page === 'deck' && (
        <DeckPage
          data={data}
          userName={userName}
          userRole={userRole}
          onSignOut={handleSignOut}
          onOpenAdmin={() => setPage('admin')}
        />
      )}

      {page === 'admin' && (
        <AdminPortal
          data={data}
          onUpdateData={(newData) => setData(newData)}
          onExitAdmin={() => setPage('deck')}
        />
      )}
    </div>
  );
}
