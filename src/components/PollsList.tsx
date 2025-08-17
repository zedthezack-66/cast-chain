import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Vote, Users, Calendar, Clock } from 'lucide-react';
import { RootState } from '@/store';
import { loadPolls } from '@/services/blockchain';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const PollsList = () => {
  const { polls, loading } = useSelector((state: RootState) => state.polls);

  useEffect(() => {
    loadPolls();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="voting-card animate-pulse">
            <div className="aspect-video bg-muted rounded-t-xl"></div>
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <div className="text-center py-16">
        <Vote className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-2xl font-semibold mb-2">No Polls Yet</h3>
        <p className="text-muted-foreground mb-8">Be the first to create a poll and start voting!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {polls.map((poll) => {
        const now = Math.floor(Date.now() / 1000);
        const isActive = now >= poll.startsAt && now <= poll.endsAt && !poll.deleted;
        const hasEnded = now > poll.endsAt;

        return (
          <Card key={poll.id} className="voting-card overflow-hidden">
            {poll.image && (
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={poll.image}
                  alt={poll.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80';
                  }}
                />
                <div className="absolute top-3 right-3">
                  <Badge 
                    variant={poll.deleted ? "destructive" : isActive ? "default" : hasEnded ? "secondary" : "outline"}
                    className={isActive ? "gradient-primary" : ""}
                  >
                    {poll.deleted ? "Deleted" : isActive ? "Active" : hasEnded ? "Ended" : "Not Started"}
                  </Badge>
                </div>
              </div>
            )}

            <CardHeader className={poll.image ? '' : 'pb-4'}>
              <CardTitle className="line-clamp-2">{poll.title}</CardTitle>
              <p className="text-muted-foreground text-sm line-clamp-2">
                {poll.description}
              </p>
              {!poll.image && (
                <Badge 
                  variant={poll.deleted ? "destructive" : isActive ? "default" : hasEnded ? "secondary" : "outline"}
                  className={`w-fit ${isActive ? "gradient-primary" : ""}`}
                >
                  {poll.deleted ? "Deleted" : isActive ? "Active" : hasEnded ? "Ended" : "Not Started"}
                </Badge>
              )}
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Vote className="w-4 h-4" />
                  <span>{poll.voteCount} votes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{poll.contestantCount} contestants</span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                <div className="flex items-center gap-1 mb-1">
                  <Clock className="w-3 h-3" />
                  <span>Ends: {new Date(poll.endsAt * 1000).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button asChild className="w-full" variant={isActive ? "default" : "outline"}>
                <Link to={`/polls/${poll.id}`}>
                  View Details
                </Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default PollsList;