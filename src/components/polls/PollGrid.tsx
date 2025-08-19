import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { loadPolls } from '@/services/blockchain';
import { PollCard } from './PollCard';
import { Card, CardContent } from '@/components/ui/card';
import { Vote, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PollGridProps {
  showAdminActions?: boolean;
  className?: string;
}

export const PollGrid = ({ showAdminActions = false, className = '' }: PollGridProps) => {
  const { polls, loading } = useSelector((state: RootState) => state.polls);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadPolls();
  }, []);

  const filteredPolls = polls.filter(poll => {
    const matchesSearch = poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         poll.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    const now = Math.floor(Date.now() / 1000);
    const isActive = now >= poll.startsAt && now <= poll.endsAt && !poll.deleted;
    const hasEnded = now > poll.endsAt;
    const isUpcoming = now < poll.startsAt;

    switch (statusFilter) {
      case 'active':
        return isActive;
      case 'ended':
        return hasEnded;
      case 'upcoming':
        return isUpcoming;
      default:
        return !poll.deleted;
    }
  });

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Filter Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="h-10 bg-muted rounded-lg animate-pulse flex-1" />
          <div className="h-10 bg-muted rounded-lg animate-pulse w-40" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="poll-card animate-pulse">
              <div className="aspect-video bg-muted" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="h-8 bg-muted rounded" />
                  <div className="h-8 bg-muted rounded" />
                </div>
                <div className="h-10 bg-muted rounded" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <div className="floating-orb w-32 h-32 -top-16 -left-16" />
        <div className="floating-orb w-24 h-24 -bottom-12 -right-12" />
        
        <div className="relative">
          <Vote className="w-20 h-20 text-primary/30 mx-auto mb-6 blockchain-pulse" />
          <h3 className="text-3xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            No Polls Yet
          </h3>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            Be the first to create a poll and start the democratic process on the blockchain!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 animate-stagger stagger-1">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search polls..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 glass-card"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40 glass-card">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <SelectValue placeholder="Filter by status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Polls</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ended">Ended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground animate-stagger stagger-2">
        Showing {filteredPolls.length} poll{filteredPolls.length !== 1 ? 's' : ''}
      </div>

      {/* Poll Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPolls.map((poll, index) => (
          <div key={poll.id} className={`animate-stagger stagger-${Math.min(index + 3, 6)}`}>
            <PollCard 
              poll={poll} 
              showAdminActions={showAdminActions}
            />
          </div>
        ))}
      </div>

      {filteredPolls.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No polls found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default PollGrid;