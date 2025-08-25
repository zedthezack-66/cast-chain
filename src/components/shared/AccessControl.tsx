import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from '@/store';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

interface AccessControlProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireVoter?: boolean;
}

export const AccessControl = ({ 
  children, 
  requireAdmin = false, 
  requireVoter = false 
}: AccessControlProps) => {
  const { account, isAdmin } = useSelector((state: RootState) => state.wallet);
  const location = useLocation();

  // Admin access control
  if (requireAdmin) {
    if (!account) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <Alert className="max-w-md">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Please connect your admin wallet to access this section.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    if (!isAdmin) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <Alert variant="destructive" className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Admin access required. You are not authorized to view this section.
            </AlertDescription>
          </Alert>
        </div>
      );
    }
  }

  // Voter access control
  if (requireVoter) {
    if (!account) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <Alert className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to access voter features.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    if (isAdmin && location.pathname.startsWith('/voter')) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <Alert variant="destructive" className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Admin accounts cannot access voter features. Please disconnect and use a voter account.
            </AlertDescription>
          </Alert>
        </div>
      );
    }
  }

  return <>{children}</>;
};