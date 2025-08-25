import { useSelector, useDispatch } from 'react-redux';
import { Trash2, AlertTriangle, User } from 'lucide-react';
import { RootState } from '@/store';
import { closeDeleteContestant } from '@/store/slices/modalsSlice';
import { deleteContestant, validateAdminAccess } from '@/services/candidateManagement';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const DeleteContestantModal = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { deleteContestant: isOpen, selectedContestant } = useSelector((state: RootState) => state.modals);
  const { currentPoll } = useSelector((state: RootState) => state.polls);
  const { loading: txLoading } = useSelector((state: RootState) => state.transaction);
  const { account, isAdmin } = useSelector((state: RootState) => state.wallet);

  const handleDelete = async () => {
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

      await deleteContestant(currentPoll.id, selectedContestant.id);

      toast({
        title: "Contestant Deleted",
        description: "Contestant has been removed from the poll",
      });

      dispatch(closeDeleteContestant());
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    dispatch(closeDeleteContestant());
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            Delete Contestant
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This action cannot be undone. The contestant will be permanently removed from the poll.
            </AlertDescription>
          </Alert>

          {selectedContestant && (
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarImage src={selectedContestant.image} alt={selectedContestant.name} />
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{selectedContestant.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedContestant.votes} vote{selectedContestant.votes !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={txLoading}
              className="flex-1"
            >
              {txLoading ? 'Deleting...' : 'Delete Contestant'}
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={txLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteContestantModal;