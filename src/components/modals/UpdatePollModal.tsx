import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Calendar, Image as ImageIcon, FileText, Clock } from 'lucide-react';
import { RootState } from '@/store';
import { closeUpdatePoll } from '@/store/slices/modalsSlice';
import { updatePoll } from '@/services/blockchain';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const UpdatePollModal = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { updatePoll: isOpen, selectedPollId } = useSelector((state: RootState) => state.modals);
  const { polls } = useSelector((state: RootState) => state.polls);
  const { loading: txLoading } = useSelector((state: RootState) => state.transaction);

  const selectedPoll = polls.find(poll => poll.id === selectedPollId);

  const [formData, setFormData] = useState({
    image: '',
    title: '',
    description: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    if (selectedPoll) {
      setFormData({
        image: selectedPoll.image,
        title: selectedPoll.title,
        description: selectedPoll.description,
        startTime: new Date(selectedPoll.startTime * 1000).toISOString().slice(0, 16),
        endTime: new Date(selectedPoll.endTime * 1000).toISOString().slice(0, 16)
      });
    }
  }, [selectedPoll]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPoll) return;

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
      await updatePoll({
        id: selectedPoll.id,
        image: formData.image.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        startTime,
        endTime
      });

      toast({
        title: "Poll Updated",
        description: "Your poll has been updated successfully",
      });

      dispatch(closeUpdatePoll());
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    dispatch(closeUpdatePoll());
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Update Poll
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Banner Image URL
            </Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Poll Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter poll title"
              required
            />
          </div>

          {/* Description */}
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

          {/* Time Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Start Time *
              </Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                End Time *
              </Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={txLoading || !formData.title.trim() || !formData.description.trim()}
              className="flex-1 web3-button gradient-primary"
            >
              {txLoading ? 'Updating...' : 'Update Poll'}
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

export default UpdatePollModal;