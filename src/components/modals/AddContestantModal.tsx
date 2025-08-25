import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, User, ImageIcon } from 'lucide-react';
import { RootState } from '@/store';
import { closeAddContestant } from '@/store/slices/modalsSlice';
import { contest } from '@/services/blockchain';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const AddContestantModal = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { addContestant: isOpen, selectedPoll } = useSelector((state: RootState) => state.modals);
  const { loading: txLoading } = useSelector((state: RootState) => state.transaction);
  const { account, isAdmin } = useSelector((state: RootState) => state.wallet);

  const [formData, setFormData] = useState({
    image: '',
    name: '',
    walletAddress: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPoll || !account || !isAdmin) {
      toast({
        title: "Access Denied",
        description: "Admin access required to add contestants",
        variant: "destructive",
      });
      return;
    }

    try {
      await contest({
        pollId: selectedPoll.id,
        name: formData.name,
        image: formData.image
      });

      toast({
        title: "Contestant Added",
        description: "New contestant has been added to the poll",
      });

      handleClose();
    } catch (error: any) {
      toast({
        title: "Failed to Add Contestant",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setFormData({ image: '', name: '', walletAddress: '' });
    dispatch(closeAddContestant());
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Contestant to Poll
          </DialogTitle>
        </DialogHeader>

        {selectedPoll && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <h3 className="font-semibold text-sm">{selectedPoll.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {selectedPoll.description}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Contestant Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter contestant name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Avatar URL</Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          {formData.image && (
            <div className="flex justify-center">
              <Avatar className="h-16 w-16">
                <AvatarImage src={formData.image} alt={formData.name} />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={txLoading || !formData.name.trim()}
              className="flex-1 web3-button gradient-primary"
            >
              {txLoading ? 'Adding...' : 'Add Contestant'}
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

export default AddContestantModal;