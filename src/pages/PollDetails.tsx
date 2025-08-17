import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, Edit, Trash2, Plus, Users, Clock, Vote } from 'lucide-react';
import { RootState } from '@/store';
import { loadPoll, loadContestants } from '@/services/blockchain';
import { openUpdatePoll, openDeletePoll, openContest } from '@/store/slices/modalsSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import PollDetailsCard from '@/components/PollDetailsCard';
import ContestantsList from '@/components/ContestantsList';
import UpdatePollModal from '@/components/modals/UpdatePollModal';
import DeletePollModal from '@/components/modals/DeletePollModal';
import ContestModal from '@/components/modals/ContestModal';
import Footer from '@/components/Footer';

const PollDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { currentPoll, contestants, loading } = useSelector((state: RootState) => state.polls);
  const { account } = useSelector((state: RootState) => state.wallet);
  
  const pollId = id ? parseInt(id) : 0;

  useEffect(() => {
    if (pollId) {
      loadPoll(pollId);
      loadContestants(pollId);
    }
  }, [pollId]);

  if (!currentPoll && !loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Poll Not Found</h1>
            <p className="text-muted-foreground mb-8">The poll you're looking for doesn't exist or has been deleted.</p>
            <Link to="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Polls
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const isDirector = account && currentPoll?.director.toLowerCase() === account.toLowerCase();
  const now = Math.floor(Date.now() / 1000);
  const isActive = currentPoll && now >= currentPoll.startsAt && now <= currentPoll.endsAt && !currentPoll.deleted;
  const hasStarted = currentPoll && now >= currentPoll.startsAt;
  const hasEnded = currentPoll && now > currentPoll.endsAt;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Polls
            </Button>
          </Link>
        </div>

        {currentPoll && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Poll Details */}
            <div className="lg:col-span-2 space-y-6">
              <PollDetailsCard poll={currentPoll} />
              
              {/* Director Actions */}
              {isDirector && !currentPoll.deleted && (
                <Card className="voting-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Edit className="w-5 h-5" />
                      Poll Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex gap-4">
                    <Button
                      onClick={() => dispatch(openUpdatePoll(currentPoll.id))}
                      variant="outline"
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Update Poll
                    </Button>
                    <Button
                      onClick={() => dispatch(openDeletePoll(currentPoll.id))}
                      variant="destructive"
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Poll
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Contest Button */}
              {account && isActive && (
                <Card className="voting-card">
                  <CardContent className="pt-6">
                    <Button
                      onClick={() => dispatch(openContest(currentPoll.id))}
                      className="w-full web3-button gradient-primary"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Join as Contestant
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Poll Stats & Status */}
            <div className="space-y-6">
              <Card className="voting-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Vote className="w-5 h-5" />
                    Poll Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Votes:</span>
                    <Badge variant="secondary">{currentPoll.voteCount}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contestants:</span>
                    <Badge variant="secondary">{currentPoll.contestantCount}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge 
                      variant={
                        currentPoll.deleted 
                          ? "destructive" 
                          : isActive 
                            ? "default" 
                            : hasEnded 
                              ? "secondary" 
                              : "outline"
                      }
                    >
                      {currentPoll.deleted 
                        ? "Deleted" 
                        : isActive 
                          ? "Active" 
                          : hasEnded 
                            ? "Ended" 
                            : "Not Started"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="voting-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Starts</p>
                    <p className="font-medium">
                      {new Date(currentPoll.startsAt * 1000).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ends</p>
                    <p className="font-medium">
                      {new Date(currentPoll.endsAt * 1000).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Contestants Section */}
        <div className="mt-12">
          <ContestantsList 
            pollId={pollId}
            contestants={contestants}
            isActive={isActive || false}
          />
        </div>
      </main>

      {/* Modals */}
      <UpdatePollModal />
      <DeletePollModal />
      <ContestModal />
      
      <Footer />
    </div>
  );
};

export default PollDetails;