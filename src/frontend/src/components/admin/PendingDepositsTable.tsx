import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAdminDepositRequests, useApproveDeposit, useRejectDeposit } from '../../hooks/useQueries';
import { Check, X, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { Principal } from '@icp-sdk/core/principal';
import { Variant_pending_approved_rejected } from '../../backend';

export default function PendingDepositsTable() {
  const { data: allRequests, isLoading } = useAdminDepositRequests();
  const approveMutation = useApproveDeposit();
  const rejectMutation = useRejectDeposit();

  const pendingRequests = allRequests?.filter((r) => r[1].status === Variant_pending_approved_rejected.pending) || [];

  const handleApprove = async (user: Principal) => {
    try {
      await approveMutation.mutateAsync(user);
      toast.success('Deposit approved successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve deposit');
    }
  };

  const handleReject = async (user: Principal) => {
    try {
      await rejectMutation.mutateAsync(user);
      toast.success('Deposit rejected');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject deposit');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Deposit Requests</CardTitle>
        <CardDescription>Review and approve or reject deposit requests</CardDescription>
      </CardHeader>
      <CardContent>
        {pendingRequests.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No pending deposit requests</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Screenshot</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingRequests.map(([principal, request]) => (
                <TableRow key={principal.toString()}>
                  <TableCell className="font-mono text-xs">
                    {principal.toString().slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">Plan {Number(request.plan.planId)}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{Number(request.plan.depositAmount)}</TableCell>
                  <TableCell>
                    {format(new Date(Number(request.timestamp) / 1000000), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Payment Screenshot</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          <img
                            src={request.paymentScreenshot.getDirectURL()}
                            alt="Payment screenshot"
                            className="w-full rounded-lg"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(principal)}
                        disabled={approveMutation.isPending}
                        className="gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(principal)}
                        disabled={rejectMutation.isPending}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
