import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Vote, Users, Clock, Calendar, Zap } from 'lucide-react';
import { PollStruct } from '@/utils/types';
import { RootState } from '@/store';

interface PollCardProps {
  poll: PollStruct;
  showAdminActions?: boolean;
  className?: string;
}

export const PollCard = ({ poll, showAdminActions = false, className = '' }: PollCardProps) => {
  const { account } = useSelector((state: RootState) => state.wallet);
  
  const now = Math.floor(Date.now() / 1000);
  const isActive = now >= poll.startsAt && now <= poll.endsAt && !poll.deleted;
  const hasEnded = now > poll.endsAt;
  const isUpcoming = now < poll.startsAt;

  const getStatusInfo = () => {
    if (poll.deleted) return { text: 'Deleted', variant: 'destructive' as const, className: '' };
    if (isActive) return { text: 'Active', variant: 'default' as const, className: 'gradient-primary' };
    if (hasEnded) return { text: 'Ended', variant: 'secondary' as const, className: '' };
    return { text: 'Upcoming', variant: 'outline' as const, className: '' };
  };

  const status = getStatusInfo();
  const timeRemaining = isActive ? poll.endsAt - now : poll.startsAt - now;
  const daysRemaining = Math.ceil(timeRemaining / (24 * 60 * 60));
  
  // Only show admin actions if user is the poll director and on admin page
  const canShowAdminActions = showAdminActions && account && 
    poll.director.toLowerCase() === account.toLowerCase();

  return (
    <Card className={`poll-card group ${className}`}>
      {/* Image Header */}
      <div className="aspect-video relative overflow-hidden bg-gradient-hero">
        {poll.image ? (
          <img
            src={poll.image}
            alt={poll.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-hero">
            <Vote className="w-16 h-16 text-primary/30" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <Badge variant={status.variant} className={status.className}>
            {isActive && <Zap className="w-3 h-3 mr-1" />}
            {status.text}
          </Badge>
        </div>

        {/* Countdown Badge */}
        {(isActive || isUpcoming) && daysRemaining > 0 && (
          <div className="absolute top-4 left-4">
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
              <Clock className="w-3 h-3 mr-1" />
              {daysRemaining}d {isActive ? 'left' : 'to go'}
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="space-y-2">
          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {poll.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {poll.description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="p-1.5 rounded bg-primary/10">
              <Vote className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-semibold">{poll.voteCount}</p>
              <p className="text-xs text-muted-foreground">Votes</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <div className="p-1.5 rounded bg-secondary/10">
              <Users className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <p className="font-semibold">{poll.contestantCount}</p>
              <p className="text-xs text-muted-foreground">Candidates</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            <span>Ends: {new Date(poll.endsAt * 1000).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button 
          asChild 
          className={`w-full web3-button ${isActive ? 'gradient-primary' : ''}`}
          variant={isActive ? "default" : "outline"}
        >
          <Link to={`/polls/${poll.id}`}>
            {isActive ? 'Vote Now' : 'View Details'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PollCard;