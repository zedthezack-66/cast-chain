import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { connectAdminWallet, disconnectWallet } from '@/services/blockchain';

export const useRouteBasedWallet = () => {
  const location = useLocation();
  const { account, isAdmin } = useSelector((state: RootState) => state.wallet);

  useEffect(() => {
    const currentPath = location.pathname;
    const lastRoute = sessionStorage.getItem('lastRoute');

    // Handle admin routes - disconnect if wrong role, but don't auto-connect
    if (currentPath.startsWith('/admin')) {
      if (account && !isAdmin) {
        // Disconnect non-admin when entering admin section
        disconnectWallet();
      }
    }
    // Handle voter routes - disconnect if admin
    else if (currentPath.startsWith('/voter')) {
      if (account && isAdmin) {
        // Disconnect admin when entering voter section
        disconnectWallet();
      }
    }
    // Handle leaving admin/voter contexts completely
    else if (currentPath === '/' || (!currentPath.startsWith('/admin') && !currentPath.startsWith('/voter'))) {
      // Only disconnect if coming from admin/voter routes
      if (lastRoute?.startsWith('/admin') || lastRoute?.startsWith('/voter')) {
        disconnectWallet();
      }
    }

    // Store current route for next navigation
    sessionStorage.setItem('lastRoute', currentPath);
  }, [location.pathname, account, isAdmin]);

  // Cleanup when leaving routes entirely
  useEffect(() => {
    return () => {
      const currentPath = location.pathname;
      const nextPath = window.location.pathname;
      
      // Disconnect when leaving admin or voter sections entirely
      if ((currentPath.startsWith('/admin') && !nextPath.startsWith('/admin')) ||
          (currentPath.startsWith('/voter') && !nextPath.startsWith('/voter'))) {
        disconnectWallet();
      }
    };
  }, [location.pathname]);

  return null;
};