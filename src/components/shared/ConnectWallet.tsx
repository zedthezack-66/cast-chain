import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, Zap } from 'lucide-react';
import { connectWallet, disconnectWallet } from '@/services/blockchain';
import { useToast } from '@/hooks/use-toast';

interface ConnectWalletProps {
  variant?: 'default' | 'hero' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const ConnectWallet = ({ 
  variant = 'default', 
  size = 'default',
  className = '' 
}: ConnectWalletProps) => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { account, chainId } = useSelector((state: RootState) => state.wallet);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask",
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const openEtherscan = () => {
    if (account && chainId !== 31337) {
      window.open(`https://etherscan.io/address/${account}`, '_blank');
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkName = () => {
    switch (chainId) {
      case 1:
        return 'Ethereum';
      case 31337:
        return 'Hardhat';
      default:
        return 'Unknown';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'hero':
        return 'gradient-primary text-primary-foreground text-lg px-8 py-4 rounded-xl web3-button glow-primary';
      case 'minimal':
        return 'text-sm';
      default:
        return 'web3-button';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'h-8 px-3 text-sm';
      case 'lg':
        return 'h-12 px-6 text-base';
      default:
        return 'h-10 px-4';
    }
  };

  if (!account) {
    return (
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        className={`${getVariantStyles()} ${getSizeStyles()} ${className}`}
      >
        <Wallet className="w-4 h-4 mr-2" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    );
  }

  if (variant === 'minimal') {
    return (
      <Badge variant="outline" className={`px-3 py-1 ${className}`}>
        <div className="w-2 h-2 rounded-full bg-success mr-2" />
        {formatAddress(account)}
      </Badge>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`${getSizeStyles()} ${className} glass-card`}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="font-mono">{formatAddress(account)}</span>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-64 glass-card">
        <div className="p-3">
          <Card className="mb-3">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Connected Wallet</span>
                <Badge variant="outline" className="text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  {getNetworkName()}
                </Badge>
              </div>
              <div className="font-mono text-sm text-muted-foreground">
                {account}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
          <Copy className="w-4 h-4 mr-2" />
          Copy Address
        </DropdownMenuItem>
        
        {chainId !== 31337 && (
          <DropdownMenuItem onClick={openEtherscan} className="cursor-pointer">
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Etherscan
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleDisconnect} className="cursor-pointer text-destructive">
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConnectWallet;