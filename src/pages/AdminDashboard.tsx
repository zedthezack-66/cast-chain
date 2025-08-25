import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { RootState } from '@/store';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Plus, Settings, BarChart3, Users, Zap, TrendingUp } from 'lucide-react';
import { openCreatePoll } from '@/store/slices/modalsSlice';
import { ConnectWallet } from '@/components/shared/ConnectWallet';
import { AccessControl } from '@/components/shared/AccessControl';
import { PollGrid } from '@/components/polls/PollGrid';
import { VotingStatsCards } from '@/components/stats/VotingStatsCards';
import { getRealPlatformStats } from '@/services/blockchain';
import CreatePollModal from '@/components/modals/CreatePollModal';
import UpdatePollModal from '@/components/modals/UpdatePollModal';
import DeletePollModal from '@/components/modals/DeletePollModal';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { account, isAdmin } = useSelector((state: RootState) => state.wallet);

  const handleCreatePoll = () => {
    dispatch(openCreatePoll());
  };

  // Load real platform stats
  useEffect(() => {
    const loadStats = async () => {
      const stats = await getRealPlatformStats();
      setAdminStats(stats);
    };
    
    if (account) {
      loadStats();
      // Refresh stats every 30 seconds
      const interval = setInterval(loadStats, 30000);
      return () => clearInterval(interval);
    }
  }, [account]);

  const [adminStats, setAdminStats] = useState({
    activePolls: 0,
    totalVotes: 0,
    totalVoters: 0,
    verificationRate: 100
  });

  return (
    <AccessControl requireAdmin={true}>
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
                <div className="p-2 rounded-lg gradient-secondary">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Admin Portal</h1>
                  <p className="text-sm text-muted-foreground">Poll Management System</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {account && isAdmin ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-sm font-medium">Admin Connected</span>
                  </div>
                  <div className="text-sm text-muted-foreground font-mono">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Connecting to admin wallet...
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

        <main className="container mx-auto px-4 py-8">
          {/* Connected State */}
          <div className="space-y-8">
            {/* Welcome Section */}
            <section className="animate-stagger stagger-1">
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full gradient-secondary">
                    <Settings className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Welcome back, Administrator!</h2>
                    <p className="text-muted-foreground">
                      Manage polls, monitor voting activity, and oversee the democratic process.
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <span className="text-muted-foreground">Admin Access</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="animate-stagger stagger-2">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-bold">Platform Analytics</h2>
                </div>
                <p className="text-muted-foreground">
                  Monitor platform performance and user engagement
                </p>
              </div>
              <VotingStatsCards stats={adminStats} />
            </section>

            {/* Poll Management Section */}
            <section className="animate-stagger stagger-3">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <div>
                    <h2 className="text-2xl font-bold">Poll Management</h2>
                    <p className="text-muted-foreground">
                      Create, edit, and monitor all voting polls
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleCreatePoll}
                  className="gradient-secondary web3-button"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Poll
                </Button>
              </div>
              <PollGrid showAdminActions={true} />
            </section>
          </div>
        </main>

        {/* Modals */}
        <CreatePollModal />
        <UpdatePollModal />
        <DeletePollModal />
      </div>
    </AccessControl>
  );
};

export default AdminDashboard;