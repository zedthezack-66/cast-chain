import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Calendar, Image as ImageIcon, FileText, Clock, AlertCircle, Users } from 'lucide-react';
import { RootState, store } from '@/store';
import { closeCreatePoll } from '@/store/slices/modalsSlice';
import { createPoll, contest } from '@/services/blockchain';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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

  const [candidates, setCandidates] = useState([
    { name: '', image: '' },
    { name: '', image: '' }
  ]);

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

    // Validate candidates
    const validCandidates = candidates.filter(c => c.name.trim());
    if (validCandidates.length < 2) {
      toast({
        title: "Insufficient Candidates",
        description: "You must add at least 2 candidates to create a poll",
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
      // First create the poll
      await createPoll({
        image: formData.image.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        startsAt: startTime,
        endsAt: endTime
      });

      // Get the latest poll ID (the one we just created)
      // Since polls are created sequentially, we can get all polls and use the last one
      const state = store.getState();
      const polls = state.polls.polls;
      const latestPoll = polls[polls.length - 1];
      
      if (latestPoll) {
        // Add candidates to the poll
        for (const candidate of validCandidates) {
          await contest({
            pollId: latestPoll.id,
            name: candidate.name.trim(),
            image: candidate.image.trim() || ''
          });
        }
      }

      toast({
        title: "Poll Created Successfully",
        description: `Poll created with ${validCandidates.length} candidates`,
      });

      // Reset form
      setFormData({ image: '', title: '', description: '', startTime: '', endTime: '' });
      setCandidates([{ name: '', image: '' }, { name: '', image: '' }]);
      dispatch(closeCreatePoll());
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateCandidate = (index: number, field: 'name' | 'image', value: string) => {
    const newCandidates = [...candidates];
    newCandidates[index][field] = value;
    setCandidates(newCandidates);
  };

  const isFormValid = () => {
    const hasBasicInfo = formData.title.trim() && formData.description.trim() && 
                        formData.startTime && formData.endTime;
    const hasValidCandidates = candidates.filter(c => c.name.trim()).length >= 2;
    return hasBasicInfo && hasValidCandidates;
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => dispatch(closeCreatePoll())}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
              Create a poll with at least 2 candidates. All fields marked with * are required.
            </AlertDescription>
          </Alert>

          {/* Poll Details Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Poll Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          {/* Candidates Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Candidates (Minimum 2 Required)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {candidates.map((candidate, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Candidate {index + 1}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`candidate-name-${index}`}>
                        Candidate Name *
                      </Label>
                      <Input
                        id={`candidate-name-${index}`}
                        value={candidate.name}
                        onChange={(e) => updateCandidate(index, 'name', e.target.value)}
                        placeholder="Enter candidate name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`candidate-image-${index}`}>
                        Candidate Image URL
                      </Label>
                      <Input
                        id={`candidate-image-${index}`}
                        type="url"
                        value={candidate.image}
                        onChange={(e) => updateCandidate(index, 'image', e.target.value)}
                        placeholder="https://example.com/candidate.jpg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Separator />

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={txLoading || !isFormValid()}
              className="flex-1 web3-button gradient-primary"
            >
              {txLoading ? 'Creating Poll...' : 'Create Poll with Candidates'}
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