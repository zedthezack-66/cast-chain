import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Edit, User, ImageIcon } from 'lucide-react';
import { RootState } from '@/store';
import { closeUpdateContestant } from '@/store/slices/modalsSlice';
import { updateContestantData, validateAdminAccess } from '@/services/candidateManagement';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const UpdateContestantModal = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { updateContestant: isOpen, selectedContestant } = useSelector((state: RootState) => state.modals);
  const { currentPoll } = useSelector((state: RootState) => state.polls);
  const { loading: txLoading } = useSelector((state: RootState) => state.transaction);
  const { account, isAdmin } = useSelector((state: RootState) => state.wallet);

  const [formData, setFormData] = useState({
    name: '',
    image: ''
  });

  useEffect(() => {
    if (selectedContestant) {
      setFormData({
        name: selectedContestant.name,
        image: selectedContestant.image
      });
    }
  }, [selectedContestant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account || !isAdmin || !selectedContestant || !currentPoll) {
      toast({
        title: "Access Denied",
        description: "Admin access required",
        variant: "destructive",
      });
      return;
    }

    try {
      // Validate admin access and poll ownership
      validateAdminAccess(account, currentPoll.director);

      await updateContestantData(
        currentPoll.id,
        selectedContestant.id,
        formData.name,
        formData.image
      );

      toast({
        title: "Contestant Updated",
        description: "Contestant information has been updated successfully",
      });

      handleClose();
    } catch (error: any) {
      toast({
        title: "Update Failed", 
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setFormData({ name: '', image: '' });
    dispatch(closeUpdateContestant());
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Update Contestant
          </DialogTitle>
        </DialogHeader>

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
              {txLoading ? 'Updating...' : 'Update Contestant'}
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

export default UpdateContestantModal;