import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Users, Vote, Crown, Trophy } from 'lucide-react';
import { RootState } from '@/store';
import { ContestantStruct } from '@/utils/types';
import { vote, hasUserVoted } from '@/services/blockchain';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface ContestantsListProps {
  pollId: number;
  contestants: ContestantStruct[];
  isActive: boolean;
}

const ContestantsList = ({ pollId, contestants, isActive }: ContestantsListProps) => {
  const { toast } = useToast();
  const { account } = useSelector((state: RootState) => state.wallet);
  const { loading: txLoading } = useSelector((state: RootState) => state.transaction);
  const [hasVoted, setHasVoted] = useState(false);
  const [votingFor, setVotingFor] = useState<number | null>(null);

  useEffect(() => {
    const checkVoteStatus = async () => {
      if (account && pollId) {
        const voted = await hasUserVoted(pollId, account);
        setHasVoted(voted);
      }
    };
    checkVoteStatus();
  }, [account, pollId]);

  const handleVote = async (contestantId: number) => {
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to vote",
        variant: "destructive",
      });
      return;
    }

    if (hasVoted) {
      toast({
        title: "Already Voted",
        description: "You have already voted in this poll",
        variant: "destructive",
      });
      return;
    }

    try {
      setVotingFor(contestantId);
      await vote({ pollId, contestantId });
      setHasVoted(true);
      toast({
        title: "Vote Submitted",
        description: "Your vote has been recorded on the blockchain",
      });
    } catch (error: any) {
      toast({
        title: "Vote Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setVotingFor(null);
    }
  };

  const totalVotes = contestants.reduce((sum, contestant) => sum + contestant.votes, 0);
  const sortedContestants = [...contestants].sort((a, b) => b.votes - a.votes);

  if (contestants.length === 0) {
    return (
      <Card className="voting-card">
        <CardContent className="py-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Contestants Yet</h3>
          <p className="text-muted-foreground">
            Be the first to join this poll as a contestant!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="voting-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Contestants ({contestants.length})
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedContestants.map((contestant, index) => {
          const votePercentage = totalVotes > 0 ? (contestant.votes / totalVotes) * 100 : 0;
          const isWinner = index === 0 && contestant.votes > 0;
          const canVote = isActive && account && !hasVoted;
          const isVoting = votingFor === contestant.id;

          return (
            <Card key={contestant.id} className="contestant-card relative overflow-hidden">
              {isWinner && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="gradient-primary">
                    <Crown className="w-3 h-3 mr-1" />
                    Leading
                  </Badge>
                </div>
              )}

              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  {/* Avatar */}
                  <div className="relative">
                    <img
                      src={contestant.image}
                      alt={contestant.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-border"
                      onError={(e) => {
                        e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${contestant.name}`;
                      }}
                    />
                    {isWinner && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
                        <Crown className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 truncate">
                      {contestant.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      by {contestant.voter.slice(0, 6)}...{contestant.voter.slice(-4)}
                    </p>
                    
                    {/* Vote Count */}
                    <div className="flex items-center gap-2 mb-3">
                      <Vote className="w-4 h-4 text-primary" />
                      <span className="font-semibold">{contestant.votes} votes</span>
                      <span className="text-sm text-muted-foreground">
                        ({votePercentage.toFixed(1)}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <Progress value={votePercentage} className="mb-4" />

                    {/* Vote Button */}
                    {canVote && (
                      <Button
                        onClick={() => handleVote(contestant.id)}
                        disabled={isVoting || txLoading}
                        className="w-full web3-button gradient-primary"
                      >
                        {isVoting ? 'Voting...' : 'Vote for this contestant'}
                      </Button>
                    )}

                    {hasVoted && (
                      <div className="text-center py-2">
                        <Badge variant="secondary">You have already voted</Badge>
                      </div>
                    )}

                    {!isActive && (
                      <div className="text-center py-2">
                        <Badge variant="outline">Voting period ended</Badge>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ContestantsList;