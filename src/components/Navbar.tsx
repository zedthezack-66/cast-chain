import { useSelector, useDispatch } from 'react-redux';
import { Wallet, ChevronDown, LogOut, Plus } from 'lucide-react';
import { RootState } from '@/store';
import { connectWallet, disconnectWallet, switchToHardhatNetwork } from '@/services/blockchain';
import { openCreatePoll } from '@/store/slices/modalsSlice';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { account, chainId, isConnected, isConnecting } = useSelector((state: RootState) => state.wallet);

  const handleConnect = async () => {
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
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    toast({
      title: "Wallet Disconnected",
      description: "Successfully disconnected from wallet",
    });
  };

  const handleSwitchNetwork = async () => {
    try {
      await switchToHardhatNetwork();
      toast({
        title: "Network Switched",
        description: "Successfully switched to Hardhat network",
      });
    } catch (error: any) {
      toast({
        title: "Network Switch Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isCorrectNetwork = chainId === 31337;

  return (
    <nav className="glass-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold">D</span>
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              DappVotes
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {isConnected && (
              <Button
                onClick={() => dispatch(openCreatePoll())}
                className="web3-button gradient-primary hidden sm:flex"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Poll
              </Button>
            )}

            {!isConnected ? (
              <Button 
                onClick={handleConnect}
                disabled={isConnecting}
                className="web3-button gradient-primary"
              >
                <Wallet className="w-4 h-4 mr-2" />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    <span className="hidden sm:inline">{formatAddress(account!)}</span>
                    {!isCorrectNetwork && (
                      <Badge variant="destructive" className="ml-2">
                        Wrong Network
                      </Badge>
                    )}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>Wallet</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        {account}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {!isCorrectNetwork && (
                    <>
                      <DropdownMenuItem onClick={handleSwitchNetwork}>
                        Switch to Hardhat Network
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  
                  <DropdownMenuItem onClick={() => dispatch(openCreatePoll())} className="sm:hidden">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Poll
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={handleDisconnect}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;