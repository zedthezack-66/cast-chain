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

    // Handle admin routes - auto-connect if not connected or wrong role
    if (currentPath.startsWith('/admin')) {
      if (!account || !isAdmin) {
        const autoConnectAdmin = async () => {
          try {
            // Disconnect any existing non-admin connection
            if (account && !isAdmin) {
              disconnectWallet();
              // Small delay to ensure state is cleared
              await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            if (!account) {
              await connectAdminWallet();
            }
          } catch (error) {
            console.error('Failed to auto-connect admin wallet:', error);
          }
        };

        autoConnectAdmin();
      }
    }
    // Handle voter routes - allow manual connection, disconnect if admin
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

    // Cleanup function when component unmounts or route changes
    return () => {
      const nextPath = window.location.pathname;
      const isLeavingAdminContext = currentPath.startsWith('/admin') && !nextPath.startsWith('/admin');
      const isLeavingVoterContext = currentPath.startsWith('/voter') && !nextPath.startsWith('/voter');
      
      if (isLeavingAdminContext || isLeavingVoterContext) {
        disconnectWallet();
      }
    };
  }, [location.pathname, account, isAdmin]);

  return null;
};