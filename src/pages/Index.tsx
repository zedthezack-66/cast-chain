import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Shield, Fingerprint } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BiometricAuth from '@/components/BiometricAuth';
import CreatePollModal from '@/components/modals/CreatePollModal';

const Index = () => {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [authRole, setAuthRole] = useState<'voter' | 'admin'>('voter');

  const handleRoleSelect = (role: 'voter' | 'admin') => {
    if (role === 'admin') {
      // Admin goes directly to admin dashboard - auto-connect handled by RoleBasedRoute
      navigate('/admin');
    } else {
      // Voter goes to biometric auth for wallet selection
      setAuthRole(role);
      setShowAuth(true);
    }
  };

  const handleAuthComplete = () => {
    setShowAuth(false);
    // Navigation is handled internally by BiometricAuth component
  };

  if (showAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <BiometricAuth
          role={authRole}
          onAuth={handleAuthComplete}
        />
      </div>
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
              <Card className="poll-card group cursor-pointer" onClick={() => navigate('/voter')}>
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

              <Card className="poll-card group cursor-pointer" onClick={() => navigate('/admin')}>
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

      {/* Instructions Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Voter Instructions */}
            <Card className="glass-card p-8">
              <div className="text-center mb-6">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">For Voters</h3>
              </div>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary mt-0.5">1</div>
                  <p className="text-muted-foreground">Connect your MetaMask wallet to the Hardhat network</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary mt-0.5">2</div>
                  <p className="text-muted-foreground">Browse active polls and view contestant details</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary mt-0.5">3</div>
                  <p className="text-muted-foreground">Cast your vote securely on the blockchain</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary mt-0.5">4</div>
                  <p className="text-muted-foreground">View real-time results and participate in democracy</p>
                </div>
              </div>
            </Card>

            {/* Admin Instructions */}
            <Card className="glass-card p-8">
              <div className="text-center mb-6">
                <Shield className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">For Administrators</h3>
              </div>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-sm font-semibold text-secondary mt-0.5">1</div>
                  <p className="text-muted-foreground">Connect your admin wallet to access poll management</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-sm font-semibold text-secondary mt-0.5">2</div>
                  <p className="text-muted-foreground">Create new polls with custom settings and timeframes</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-sm font-semibold text-secondary mt-0.5">3</div>
                  <p className="text-muted-foreground">Add contestants to your polls before voting begins</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-sm font-semibold text-secondary mt-0.5">4</div>
                  <p className="text-muted-foreground">Monitor platform analytics and manage poll lifecycle</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
      <CreatePollModal />
    </div>
  );
};

export default Index;
