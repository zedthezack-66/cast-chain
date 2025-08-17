import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Vote, Users } from 'lucide-react';
import PollsList from '@/components/PollsList';

const VoterDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <div className="flex items-center gap-2">
              <Vote className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Voter Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Card className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/20">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Welcome, Voter</h2>
                <p className="text-muted-foreground">
                  View active polls and cast your votes securely
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Active Polls</h2>
              <p className="text-muted-foreground">
                Select a poll to view details and cast your vote
              </p>
            </div>
            <PollsList />
          </section>
        </div>
      </main>
    </div>
  );
};

export default VoterDashboard;