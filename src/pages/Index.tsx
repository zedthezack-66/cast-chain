import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Shield, Fingerprint, Zap, Lock, Globe } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BiometricAuth } from '@/components/BiometricAuth';
import { PollGrid } from '@/components/polls/PollGrid';
import { VotingStatsCards } from '@/components/stats/VotingStatsCards';
import CreatePollModal from '@/components/modals/CreatePollModal';

const Index = () => {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [authRole, setAuthRole] = useState<'voter' | 'admin'>('voter');

  const handleRoleSelect = (role: 'voter' | 'admin') => {
    setAuthRole(role);
    setShowAuth(true);
  };

  const handleAuthComplete = () => {
    setShowAuth(false);
    navigate(authRole === 'voter' ? '/voter-dashboard' : '/admin-dashboard');
  };

  // Mock stats data
  const mockStats = {
    activePolls: 12,
    totalVotes: 2847,
    totalVoters: 1456,
    verificationRate: 100
  };

  if (showAuth) {
    return (
      <BiometricAuth
        role={authRole}
        onAuthComplete={handleAuthComplete}
        onCancel={() => setShowAuth(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="floating-orb w-96 h-96 -top-32 -left-32 animate-float" />
        <div className="floating-orb w-64 h-64 -bottom-20 -right-20 animate-float" />
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <Fingerprint className="w-24 h-24 mx-auto text-primary blockchain-pulse" />
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
              VoteForge
            </h1>
            <h2 className="text-2xl lg:text-4xl font-bold mb-6">
              Secure Blockchain Voting
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              Experience the future of democracy with biometric authentication and blockchain security.
            </p>

            {/* Role Selection Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-16">
              <Card className="poll-card group cursor-pointer" onClick={() => handleRoleSelect('voter')}>
                <CardContent className="p-8 text-center">
                  <div className="gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Enter as Voter</h3>
                  <p className="text-muted-foreground mb-6">Cast your vote securely</p>
                  <Button className="w-full web3-button gradient-primary">
                    Access Voter Portal
                  </Button>
                </CardContent>
              </Card>

              <Card className="poll-card group cursor-pointer" onClick={() => handleRoleSelect('admin')}>
                <CardContent className="p-8 text-center">
                  <div className="gradient-secondary p-4 rounded-full w-16 h-16 mx-auto mb-4">
                    <Shield className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Enter as Admin</h3>
                  <p className="text-muted-foreground mb-6">Manage polls and elections</p>
                  <Button className="w-full web3-button gradient-secondary">
                    Access Admin Portal
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <VotingStatsCards stats={mockStats} />
        </div>
      </section>

      {/* Active Polls Section */}
      <section id="polls" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Active Polls</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Participate in ongoing polls or explore results
            </p>
          </div>
          <PollGrid />
        </div>
      </section>

      <Footer />
      <CreatePollModal />
    </div>
  );
};

export default Index;
