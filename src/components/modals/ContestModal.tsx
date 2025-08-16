import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Users, Image as ImageIcon, User } from 'lucide-react';
import { RootState } from '@/store';
import { closeContest } from '@/store/slices/modalsSlice';
import { contest } from '@/services/blockchain';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const ContestModal = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { contest: isOpen, selectedPollId } = useSelector((state: RootState) => state.modals);
  const { polls } = useSelector((state: RootState) => state.polls);
  const { loading: txLoading } = useSelector((state: RootState) => state.transaction);

  const selectedPoll = polls.find(poll => poll.id === selectedPollId);

  const [formData, setFormData] = useState({
    image: '',
    name: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPollId) return;

    try {
      await contest({
        pollId: selectedPollId,
        image: formData.image.trim() || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
        name: formData.name.trim()
      });

      toast({
        title: "Joined as Contestant",
        description: "You have successfully joined the poll as a contestant",
      });

      setFormData({ image: '', name: '' });
      dispatch(closeContest());
    } catch (error: any) {
      toast({
        title: "Failed to Join",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setFormData({ image: '', name: '' });
    dispatch(closeContest());
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Join as Contestant
          </DialogTitle>
        </DialogHeader>

        {selectedPoll && (
          <div className="mb-4 p-4 rounded-lg bg-muted">
            <h3 className="font-semibold mb-1">{selectedPoll.title}</h3>
            <p className="text-sm text-muted-foreground">
              {selectedPoll.description}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Contestant Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your contestant name"
              required
            />
          </div>

          {/* Avatar URL */}
          <div className="space-y-2">
            <Label htmlFor="image" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Avatar URL (Optional)
            </Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to use a random avatar
            </p>
            
            {/* Preview */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <img
                src={formData.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name || 'preview'}`}
                alt="Preview"
                className="w-12 h-12 rounded-full object-cover border-2 border-border"
                onError={(e) => {
                  e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name || 'preview'}`;
                }}
              />
              <div>
                <p className="font-medium">{formData.name || 'Your Name'}</p>
                <p className="text-sm text-muted-foreground">Preview</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={txLoading || !formData.name.trim()}
              className="flex-1 web3-button gradient-primary"
            >
              {txLoading ? 'Joining...' : 'Join Contest'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
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

export default ContestModal;