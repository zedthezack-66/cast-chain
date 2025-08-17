import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Banner from '@/components/Banner';
import PollsList from '@/components/PollsList';
import CreatePollModal from '@/components/modals/CreatePollModal';
import Footer from '@/components/Footer';
import BiometricAuth from '@/components/BiometricAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Fingerprint, User, Shield } from 'lucide-react';

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [authRole, setAuthRole] = useState<'voter' | 'admin'>('voter');

  const handleRoleSelect = (role: 'voter' | 'admin') => {
    setAuthRole(role);
    setShowAuth(true);
  };

  const handleAuthComplete = () => {
    setShowAuth(false);
  };

  if (showAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <BiometricAuth role={authRole} onAuth={handleAuthComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Banner />
      
      {/* Biometric Access Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Fingerprint className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Biometric Voting Access</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Secure fingerprint authentication for verified voting and administration
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="glass-card p-8 text-center hover:scale-105 transition-smooth cursor-pointer">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Voter Access</h3>
                <p className="text-muted-foreground mb-6">
                  Authenticate as a registered voter to participate in active polls
                </p>
              </div>
              <Button
                onClick={() => handleRoleSelect('voter')}
                className="w-full gradient-primary web3-button text-lg py-6"
              >
                <Fingerprint className="h-5 w-5 mr-2" />
                Scan Fingerprint - Voter
              </Button>
            </Card>

            <Card className="glass-card p-8 text-center hover:scale-105 transition-smooth cursor-pointer">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Admin Access</h3>
                <p className="text-muted-foreground mb-6">
                  Administrative access to create and manage voting polls
                </p>
              </div>
              <Button
                onClick={() => handleRoleSelect('admin')}
                className="w-full gradient-primary web3-button text-lg py-6"
              >
                <Fingerprint className="h-5 w-5 mr-2" />
                Scan Fingerprint - Admin
              </Button>
            </Card>
          </div>
        </div>
      </section>
      
      <main className="container mx-auto px-4 py-12">
        <section id="polls">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Active Polls</h2>
            <p className="text-xl text-muted-foreground">
              Participate in decentralized voting and make your voice heard
            </p>
          </div>
          
          <PollsList />
        </section>
      </main>

      <CreatePollModal />
      <Footer />
    </div>
  );
};

export default Index;
