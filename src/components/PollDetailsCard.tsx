import { Calendar, User, Image as ImageIcon } from 'lucide-react';
import { PollStruct } from '@/utils/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PollDetailsCardProps {
  poll: PollStruct;
}

const PollDetailsCard = ({ poll }: PollDetailsCardProps) => {
  const now = Math.floor(Date.now() / 1000);
  const isActive = now >= poll.startTime && now <= poll.endTime && !poll.deleted;
  const hasStarted = now >= poll.startTime;
  const hasEnded = now > poll.endTime;

  const getStatusBadge = () => {
    if (poll.deleted) {
      return <Badge variant="destructive">Deleted</Badge>;
    }
    if (isActive) {
      return <Badge className="gradient-primary">Active</Badge>;
    }
    if (hasEnded) {
      return <Badge variant="secondary">Ended</Badge>;
    }
    return <Badge variant="outline">Not Started</Badge>;
  };

  return (
    <Card className="voting-card overflow-hidden">
      {/* Poll Image */}
      {poll.image && (
        <div className="aspect-video relative overflow-hidden rounded-t-xl">
          <img
            src={poll.image}
            alt={poll.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute top-4 right-4">
            {getStatusBadge()}
          </div>
        </div>
      )}

      <CardHeader className={poll.image ? '' : 'pb-4'}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">{poll.title}</CardTitle>
            {!poll.image && (
              <div className="mb-4">
                {getStatusBadge()}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Description */}
        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-muted-foreground leading-relaxed">
            {poll.description}
          </p>
        </div>

        {/* Poll Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Director</p>
              <p className="font-medium text-sm">
                {poll.director.slice(0, 6)}...{poll.director.slice(-4)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium text-sm">
                {new Date(poll.createdAt * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Voting Period */}
        <div className="space-y-3 pt-4 border-t border-border/50">
          <h3 className="font-semibold">Voting Period</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Starts</p>
              <p className="font-medium">
                {new Date(poll.startTime * 1000).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Ends</p>
              <p className="font-medium">
                {new Date(poll.endTime * 1000).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PollDetailsCard;