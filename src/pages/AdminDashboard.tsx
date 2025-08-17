import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Shield, Plus, Settings, BarChart3, Users } from 'lucide-react';
import { openCreatePoll } from '@/store/slices/modalsSlice';
import PollsList from '@/components/PollsList';
import CreatePollModal from '@/components/modals/CreatePollModal';
import UpdatePollModal from '@/components/modals/UpdatePollModal';
import DeletePollModal from '@/components/modals/DeletePollModal';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCreatePoll = () => {
    dispatch(openCreatePoll());
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
                <Shield className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              </div>
            </div>
            
            <Button
              onClick={handleCreatePoll}
              className="gradient-primary web3-button"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Poll
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Card className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/20">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Welcome, Administrator</h2>
                <p className="text-muted-foreground">
                  Manage polls, view analytics, and oversee the voting process
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Analytics</h3>
            </div>
            <p className="text-2xl font-bold text-primary mb-1">12</p>
            <p className="text-sm text-muted-foreground">Total Polls Created</p>
          </Card>
          
          <Card className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Participation</h3>
            </div>
            <p className="text-2xl font-bold text-primary mb-1">248</p>
            <p className="text-sm text-muted-foreground">Total Votes Cast</p>
          </Card>
          
          <Card className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Security</h3>
            </div>
            <p className="text-2xl font-bold text-success mb-1">100%</p>
            <p className="text-sm text-muted-foreground">Votes Verified</p>
          </Card>
        </div>

        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Poll Management</h2>
                <p className="text-muted-foreground">
                  Create, edit, and manage your voting polls
                </p>
              </div>
            </div>
            <PollsList />
          </section>
        </div>
      </main>

      <CreatePollModal />
      <UpdatePollModal />
      <DeletePollModal />
    </div>
  );
};

export default AdminDashboard;