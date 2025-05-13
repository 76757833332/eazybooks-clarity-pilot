
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarDays, PlusCircle, X, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { fetchLeaveApplications, updateLeaveApplication, deleteLeaveApplication } from '@/services/leaveService';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTheme } from '@/contexts/theme/ThemeContext';
import AppLayout from '@/components/layout/AppLayout';

const LeavesPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { resolvedTheme } = useTheme();
  const [selectedLeaveId, setSelectedLeaveId] = React.useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-500';
      case 'rejected': return 'bg-red-500/20 text-red-500';
      case 'canceled': return 'bg-yellow-500/20 text-yellow-500';
      default: return 'bg-blue-500/20 text-blue-500';
    }
  };

  const { data: leaveApplications, isLoading } = useQuery({
    queryKey: ['leave-applications'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) throw new Error('User not authenticated');
      return fetchLeaveApplications(user.user.id);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteLeaveApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-applications'] });
      toast({
        title: "Success",
        description: "Leave application canceled successfully",
      });
      setSelectedLeaveId(null);
    },
    onError: (error) => {
      console.error('Error canceling leave application:', error);
      toast({
        title: "Error",
        description: "Failed to cancel leave application",
        variant: "destructive",
      });
    },
  });

  const handleCancel = async () => {
    if (!selectedLeaveId) return;
    deleteMutation.mutate(selectedLeaveId);
  };

  return (
    <AppLayout title="Leave Applications">
      <div className="flex justify-between mb-6">
        <div></div>
        <Button
          onClick={() => navigate('/leaves/apply')}
          className="bg-eazybooks-purple hover:bg-eazybooks-purple-secondary gap-2"
        >
          <PlusCircle size={16} />
          Apply for Leave
        </Button>
      </div>
      
      <main className="flex-1">
        {isLoading ? (
          <div className="flex justify-center p-8">Loading leave applications...</div>
        ) : !leaveApplications || leaveApplications.length === 0 ? (
          <div className={`flex flex-col items-center justify-center h-64 text-center ${
            resolvedTheme === 'light' ? 'bg-white' : 'bg-secondary/40'
          } rounded-lg border border-border p-6`}>
            <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Leave Applications</h3>
            <p className="text-muted-foreground mb-6">You haven't submitted any leave applications yet.</p>
            <Button 
              onClick={() => navigate('/leaves/apply')}
              className="bg-eazybooks-purple hover:bg-eazybooks-purple-secondary"
            >
              Apply for Leave
            </Button>
          </div>
        ) : (
          <div className={`rounded-lg border border-border ${
            resolvedTheme === 'light' ? 'bg-white shadow-sm' : 'bg-secondary/40'
          }`}>
            <Table>
              <TableHeader className={resolvedTheme === 'light' ? 'bg-gray-50' : ''}>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveApplications.map((leave) => (
                  <TableRow key={leave.id} className={resolvedTheme === 'light' ? 'hover:bg-gray-50' : ''}>
                    <TableCell className="font-medium">
                      {leave.employees.first_name} {leave.employees.last_name}
                    </TableCell>
                    <TableCell className="capitalize">{leave.leave_type}</TableCell>
                    <TableCell>{format(new Date(leave.start_date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{format(new Date(leave.end_date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {leave.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedLeaveId(leave.id)}
                          className="text-red-500 border-red-500/20 hover:bg-red-500/10"
                        >
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
      
      <Dialog open={!!selectedLeaveId} onOpenChange={() => setSelectedLeaveId(null)}>
        <DialogContent className={resolvedTheme === 'light' ? 'bg-white' : ''}>
          <DialogHeader>
            <DialogTitle>Cancel Leave Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this leave application? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedLeaveId(null)}>
              No, Keep It
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancel}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Canceling..." : "Yes, Cancel Leave"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default LeavesPage;
