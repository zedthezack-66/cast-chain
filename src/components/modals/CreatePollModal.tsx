import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Calendar, Image as ImageIcon, FileText, Clock, AlertCircle } from 'lucide-react';
import { RootState } from '@/store';
import { closeCreatePoll } from '@/store/slices/modalsSlice';
import { createPoll } from '@/services/blockchain';
import { getContestantCount } from '@/services/candidateManagement';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const CreatePollModal = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { createPoll: isOpen } = useSelector((state: RootState) => state.modals);
  const { loading: txLoading } = useSelector((state: RootState) => state.transaction);
  const { account, isAdmin } = useSelector((state: RootState) => state.wallet);

  const [formData, setFormData] = useState({
    image: '',
    title: '',
    description: '',
    startTime: '',
    endTime: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check admin access
    if (!account || !isAdmin) {
      toast({
        title: "Access Denied",
        description: "Admin access required to create polls",
        variant: "destructive",
      });
      return;
    }
    
    const startTime = new Date(formData.startTime);
    const endTime = new Date(formData.endTime);

    if (startTime >= endTime) {
      toast({
        title: "Invalid Time Range",
        description: "End time must be after start time",
        variant: "destructive",
      });
      return;
    }

    try {
      await createPoll({
        image: formData.image.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        startsAt: startTime,
        endsAt: endTime
      });

      toast({
        title: "Poll Created",
        description: "Your poll has been created successfully. Remember to add at least 2 candidates before activation.",
      });

      setFormData({ image: '', title: '', description: '', startTime: '', endTime: '' });
      dispatch(closeCreatePoll());
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => dispatch(closeCreatePoll())}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Poll
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Remember: You must add at least 2 candidates to your poll before voters can participate.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <Label htmlFor="image">Banner Image URL</Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Poll Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter poll title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this poll is about..."
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={txLoading || !formData.title.trim() || !formData.description.trim()}
              className="flex-1 web3-button gradient-primary"
            >
              {txLoading ? 'Creating...' : 'Create Poll'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => dispatch(closeCreatePoll())}
              disabled={txLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePollModal;