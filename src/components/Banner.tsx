import { useSelector, useDispatch } from 'react-redux';
import { Vote, Plus, Wallet } from 'lucide-react';
import { RootState } from '@/store';
import { openCreatePoll } from '@/store/slices/modalsSlice';
import { connectWallet } from '@/services/blockchain';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Banner = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { isConnected } = useSelector((state: RootState) => state.wallet);

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

  return (
    <section className="relative overflow-hidden py-20 gradient-hero">
      <div className="absolute inset-0 bg-background/10"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary glow-primary mb-6">
              <Vote className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Decentralized
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Voting Platform
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create transparent polls, compete as contestants, and vote on-chain with complete transparency and immutability.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isConnected ? (
              <Button
                onClick={() => dispatch(openCreatePoll())}
                size="lg"
                className="web3-button gradient-primary text-lg px-8 py-4 h-auto glow-primary"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Poll
              </Button>
            ) : (
              <Button
                onClick={handleConnect}
                size="lg"
                className="web3-button gradient-primary text-lg px-8 py-4 h-auto glow-primary"
              >
                <Wallet className="w-5 h-5 mr-2" />
                Connect Wallet to Start
              </Button>
            )}
            
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 h-auto border-border/50 hover:border-primary/50"
              asChild
            >
              <a href="#polls">Explore Polls</a>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Transparent</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">On-Chain</div>
              <div className="text-muted-foreground">Immutable Votes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">Fair</div>
              <div className="text-muted-foreground">One Vote Per Address</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-primary-glow/10 blur-3xl"></div>
    </section>
  );
};

export default Banner;