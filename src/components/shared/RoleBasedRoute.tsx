import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { connectAdminWallet, connectWallet, disconnectWallet } from '@/services/blockchain';
import { Shield, Vote, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  role: 'admin' | 'voter';
}

const RoleBasedRoute = ({ children, role }: RoleBasedRouteProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { account, isConnected, isAdmin } = useSelector((state: RootState) => state.wallet);

  useEffect(() => {
    const handleRoleBasedConnection = async () => {
      const isAdminRoute = location.pathname.startsWith('/admin');
      const isVoterRoute = location.pathname.startsWith('/voter');

      // Disconnect if switching between admin/voter routes
      if (isConnected) {
        if ((isAdmin && isVoterRoute) || (!isAdmin && isAdminRoute)) {
          disconnectWallet();
          return;
        }
      }

      // Auto-connect admin on admin routes
      if (isAdminRoute && !isConnected) {
        try {
          await connectAdminWallet();
        } catch (error) {
          console.error('Failed to connect admin:', error);
        }
      }
    };

    handleRoleBasedConnection();
  }, [location.pathname, isConnected, isAdmin]);

  // Handle leaving role-specific routes
  useEffect(() => {
    const handleRouteLeave = () => {
      const isAdminRoute = location.pathname.startsWith('/admin');
      const isVoterRoute = location.pathname.startsWith('/voter');
      
      if (!isAdminRoute && !isVoterRoute && isConnected) {
        disconnectWallet();
      }
    };

    return () => {
      handleRouteLeave();
    };
  }, [location.pathname, isConnected]);

  // Role-based access control
  if (role === 'admin') {
    const isAdminRoute = location.pathname.startsWith('/admin');
    if (!isAdminRoute) return null;

    if (!isConnected || !isAdmin) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <div className="glass-card p-8 rounded-xl">
              <Shield className="w-16 h-16 text-secondary mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
              <p className="text-muted-foreground mb-6">
                Connecting to admin panel with first deployed account...
              </p>
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
          </div>
        </div>
      );
    }
  }

  if (role === 'voter') {
    const isVoterRoute = location.pathname.startsWith('/voter');
    if (!isVoterRoute) return null;

    // Check if voter is trying to access admin functions
    if (isConnected && isAdmin) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <div className="glass-card p-8 rounded-xl">
              <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4">Unauthorized Access</h2>
              <p className="text-muted-foreground mb-6">
                Admin accounts cannot access voter functions. Please disconnect and use a voter account.
              </p>
              <Button
                onClick={() => {
                  disconnectWallet();
                  navigate('/');
                }}
                variant="outline"
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default RoleBasedRoute;