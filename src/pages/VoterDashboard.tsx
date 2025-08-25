import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { RootState } from '@/store';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Vote, Users, Zap, Clock } from 'lucide-react';
import { ConnectWallet } from '@/components/shared/ConnectWallet';
import { AccessControl } from '@/components/shared/AccessControl';
import { PollGrid } from '@/components/polls/PollGrid';
import { VotingStatsCards } from '@/components/stats/VotingStatsCards';
import BiometricAuth from '@/components/BiometricAuth';
import { connectWallet, getRealPlatformStats } from '@/services/blockchain';

const VoterDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { account, isAdmin } = useSelector((state: RootState) => state.wallet);
  const [voterStats, setVoterStats] = useState({
    activePolls: 0,
    totalVotes: 0,
    totalVoters: 0,
    verificationRate: 100
  });

  const handleBiometricAuth = async () => {
    try {
      await connectWallet(); // This will trigger MetaMask account selection
    } catch (error) {
      console.error('Failed to connect wallet after biometric auth:', error);
    }
  };

  // Load real voter stats
  useEffect(() => {
    const loadStats = async () => {
      const stats = await getRealPlatformStats();
      setVoterStats(stats);
    };
    
    if (account && !isAdmin) {
      loadStats();
      // Refresh stats every 30 seconds
      const interval = setInterval(loadStats, 30000);
      return () => clearInterval(interval);
    }
  }, [account, isAdmin]);

  // Redirect admin users
  if (account && isAdmin) {
    navigate('/admin');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 hover-lift"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg gradient-primary">
                  <Vote className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Voter Portal</h1>
                  <p className="text-sm text-muted-foreground">Secure Blockchain Voting</p>
                </div>
              </div>
            </div>
            
            <ConnectWallet variant="default" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!account ? (
          /* Not Connected State */
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center max-w-md mx-auto">
              <div className="floating-orb w-32 h-32 -top-16 -left-16" />
              <div className="floating-orb w-24 h-24 -bottom-12 -right-12" />
              
              <div className="relative">
                <BiometricAuth role="voter" onAuth={handleBiometricAuth} />
              </div>
            </div>
          </div>
        ) : (
          /* Connected State */
          <div className="space-y-8">
            {/* Welcome Section */}
            <section className="animate-stagger stagger-1">
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full gradient-primary">
                    <Users className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Welcome back, Voter!</h2>
                    <p className="text-muted-foreground">
                      Your wallet is connected. Ready to participate in secure blockchain voting.
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-muted-foreground">Wallet Connected</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="animate-stagger stagger-2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Your Voting Activity</h2>
                <p className="text-muted-foreground">
                  Track your participation in the democratic process
                </p>
              </div>
              <VotingStatsCards stats={voterStats} />
            </section>

            {/* Active Polls Section */}
            <section className="animate-stagger stagger-3">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <h2 className="text-2xl font-bold">Available Polls</h2>
                    <p className="text-muted-foreground">
                      Active polls where you can cast your vote
                    </p>
                  </div>
                </div>
              </div>
              <PollGrid showAdminActions={false} />
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default VoterDashboard;