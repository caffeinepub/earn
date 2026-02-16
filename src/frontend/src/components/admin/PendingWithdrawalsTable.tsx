import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminWithdrawalRequests, useApproveWithdrawal, useRejectWithdrawal } from '../../hooks/useQueries';
import { Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { Principal } from '@icp-sdk/core/principal';
import { Variant_pending_approved_rejected, Variant_jazzCash_easypaisa } from '../../backend';

export default function PendingWithdrawalsTable() {
  const { data: allRequests, isLoading } = useAdminWithdrawalRequests();
  const approveMutation = useApproveWithdrawal();
  const rejectMutation = useRejectWithdrawal();

  const pendingRequests = allRequests?.filter((r) => r[1].status === Variant_pending_approved_rejected.pending) || [];

  const handleApprove = async (user: Principal) => {
    try {
      await approveMutation.mutateAsync(user);
      toast.success('Withdrawal approved successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve withdrawal');
    }
  };

  const handleReject = async (user: Principal) => {
    try {
      await rejectMutation.mutateAsync(user);
      toast.success('Withdrawal rejected');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject withdrawal');
    }
  };

  const getMethodLabel = (method: Variant_jazzCash_easypaisa): string => {
    return method.charAt(0).toUpperCase() + method.slice(1);
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
        <CardTitle>Pending Withdrawal Requests</CardTitle>
        <CardDescription>Review and approve or reject withdrawal requests</CardDescription>
      </CardHeader>
      <CardContent>
        {pendingRequests.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No pending withdrawal requests</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingRequests.map(([principal, request]) => (
                <TableRow key={principal.toString()}>
                  <TableCell className="font-mono text-xs">
                    {principal.toString().slice(0, 8)}...
                  </TableCell>
                  <TableCell className="font-medium">{Number(request.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {getMethodLabel(request.payoutMethod)}
                    </Badge>
                  </TableCell>
                  <TableCell>{request.accountNumber}</TableCell>
                  <TableCell>
                    {format(new Date(Number(request.timestamp) / 1000000), 'MMM dd, yyyy')}
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
