import { useSelector, useDispatch } from 'react-redux';
import { Trash2, AlertTriangle } from 'lucide-react';
import { RootState } from '@/store';
import { closeDeletePoll } from '@/store/slices/modalsSlice';
import { deletePoll } from '@/services/blockchain';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const DeletePollModal = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { deletePoll: isOpen, selectedPollId } = useSelector((state: RootState) => state.modals);
  const { polls } = useSelector((state: RootState) => state.polls);
  const { loading: txLoading } = useSelector((state: RootState) => state.transaction);

  const selectedPoll = polls.find(poll => poll.id === selectedPollId);

  const handleDelete = async () => {
    if (!selectedPoll) return;

    try {
      await deletePoll(selectedPoll.id);
      
      toast({
        title: "Poll Deleted",
        description: "The poll has been successfully deleted",
      });

      dispatch(closeDeletePoll());
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    dispatch(closeDeletePoll());
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            Delete Poll
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              This action cannot be undone. The poll will be permanently deleted and all voting will be disabled.
            </AlertDescription>
          </Alert>

          {selectedPoll && (
            <div className="p-4 rounded-lg bg-muted">
              <h3 className="font-semibold mb-2">{selectedPoll.title}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedPoll.description}
              </p>
              <div className="mt-2 text-xs text-muted-foreground">
                {selectedPoll.totalVotes} votes • {selectedPoll.totalContestants} contestants
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              onClick={handleDelete}
              disabled={txLoading}
              variant="destructive"
              className="flex-1"
            >
              {txLoading ? 'Deleting...' : 'Delete Poll'}
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              disabled={txLoading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePollModal;