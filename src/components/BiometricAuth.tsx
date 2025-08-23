import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Fingerprint, User, Shield, Loader2 } from 'lucide-react';
import { connectWallet } from '@/services/blockchain';
import { useToast } from '@/hooks/use-toast';

interface BiometricAuthProps {
  role: 'voter' | 'admin';
  onAuth: () => void;
}

const BiometricAuth = ({ role, onAuth }: BiometricAuthProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleScan = async () => {
    setIsScanning(true);
    
    try {
      // Simulate fingerprint scanning
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For voters, trigger MetaMask account selection
      if (role === 'voter') {
        await connectWallet(); // This will show MetaMask account selection
        navigate('/voter');
      }
      
      setIsScanning(false);
      onAuth();
      
      toast({
        title: "Authentication Successful",
        description: `Welcome ${role}! Wallet connected successfully.`,
      });
      
    } catch (error: any) {
      setIsScanning(false);
      toast({
        title: "Authentication Failed",
        description: error.message || "Failed to authenticate. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="glass-card p-8 max-w-md mx-auto">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          {role === 'voter' ? (
            <User className="h-12 w-12 text-primary" />
          ) : (
            <Shield className="h-12 w-12 text-primary" />
          )}
        </div>
        
        <div>
          <h3 className="text-xl font-bold mb-2">
            {role === 'voter' ? 'Voter Access' : 'Admin Access'}
          </h3>
          <p className="text-muted-foreground">
            Place your finger on the scanner to authenticate
          </p>
        </div>

        <div className="relative">
          <Button
            onClick={handleScan}
            disabled={isScanning}
            className={`w-24 h-24 rounded-full gradient-primary transition-all duration-500 ${
              isScanning ? 'animate-pulse scale-110' : 'hover:scale-105'
            }`}
          >
            {isScanning ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <Fingerprint className="h-8 w-8" />
            )}
          </Button>
          
          {isScanning && (
            <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          {isScanning ? 'Scanning fingerprint...' : 'Tap to scan'}
        </div>
      </div>
    </Card>
  );
};

export default BiometricAuth;