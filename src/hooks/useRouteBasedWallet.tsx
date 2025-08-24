import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { connectAdminWallet, disconnectWallet } from '@/services/blockchain';

export const useRouteBasedWallet = () => {
  const location = useLocation();
  const { account } = useSelector((state: RootState) => state.wallet);

  useEffect(() => {
    const currentPath = location.pathname;

    // Handle admin routes
    if (currentPath === '/admin-dashboard') {
      const autoConnectAdmin = async () => {
        try {
          // Disconnect any existing connection first
          disconnectWallet();
          // Small delay to ensure state is cleared
          setTimeout(async () => {
            await connectAdminWallet();
          }, 100);
        } catch (error) {
          console.error('Failed to auto-connect admin wallet:', error);
        }
      };

      autoConnectAdmin();
    }
    // Handle voter routes - disconnect existing connections to allow fresh selection
    else if (currentPath === '/voter-dashboard') {
      // Disconnect any existing wallet to ensure fresh connection
      disconnectWallet();
    }
    // Handle leaving admin/voter routes - disconnect wallet
    else if (account && (currentPath === '/' || currentPath.startsWith('/polls/'))) {
      // Only disconnect if coming from admin/voter routes
      const wasOnAdminOrVoter = sessionStorage.getItem('lastRoute');
      if (wasOnAdminOrVoter === '/admin-dashboard' || wasOnAdminOrVoter === '/voter-dashboard') {
        disconnectWallet();
      }
    }

    // Store current route for next navigation
    sessionStorage.setItem('lastRoute', currentPath);

    // Cleanup function when component unmounts or route changes
    return () => {
      // Don't disconnect on route change within same role context
      const nextPath = window.location.pathname;
      const isLeavingAdminContext = currentPath === '/admin-dashboard' && nextPath !== '/admin-dashboard';
      const isLeavingVoterContext = currentPath === '/voter-dashboard' && nextPath !== '/voter-dashboard';
      
      if (isLeavingAdminContext || isLeavingVoterContext) {
        disconnectWallet();
      }
    };
  }, [location.pathname, account]);

  return null;
};