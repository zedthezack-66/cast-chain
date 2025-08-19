import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon, BarChart3, Vote, Users, Shield } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'secondary';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  variant = 'default',
  trend,
  className = '' 
}: StatsCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-success/20 bg-success/5';
      case 'warning':
        return 'border-warning/20 bg-warning/5';
      case 'secondary':
        return 'border-secondary/20 bg-secondary/5';
      default:
        return 'border-primary/20 bg-primary/5';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'secondary':
        return 'text-secondary';
      default:
        return 'text-primary';
    }
  };

  return (
    <Card className={`stats-card ${getVariantStyles()} ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-background/50 ${getIconColor()}`}>
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-sm text-muted-foreground">{title}</h3>
          </div>
          {trend && (
            <Badge 
              variant={trend.isPositive ? "default" : "secondary"}
              className="text-xs"
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </Badge>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-3xl font-bold gradient-text">{value}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

interface VotingStatsCardsProps {
  stats: {
    activePolls: number;
    totalVotes: number;
    totalVoters: number;
    verificationRate: number;
  };
  className?: string;
}

export const VotingStatsCards = ({ stats, className = '' }: VotingStatsCardsProps) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      <StatsCard
        title="Active Polls"
        value={stats.activePolls}
        description="Currently ongoing"
        icon={BarChart3}
        variant="default"
        className="animate-stagger stagger-1"
      />
      
      <StatsCard
        title="Total Votes"
        value={stats.totalVotes.toLocaleString()}
        description="Blockchain verified"
        icon={Vote}
        variant="success"
        trend={{ value: 12, isPositive: true }}
        className="animate-stagger stagger-2"
      />
      
      <StatsCard
        title="Total Voters"
        value={stats.totalVoters.toLocaleString()}
        description="Registered users"
        icon={Users}
        variant="secondary"
        className="animate-stagger stagger-3"
      />
      
      <StatsCard
        title="Verification Rate"
        value={`${stats.verificationRate}%`}
        description="Security standard"
        icon={Shield}
        variant="warning"
        trend={{ value: 0, isPositive: true }}
        className="animate-stagger stagger-4"
      />
    </div>
  );
};

export default VotingStatsCards;