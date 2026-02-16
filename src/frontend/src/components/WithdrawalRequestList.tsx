import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMyWithdrawalRequests } from '../hooks/useQueries';
import { format } from 'date-fns';
import { Variant_pending_approved_rejected, Variant_jazzCash_easypaisa } from '../backend';

export default function WithdrawalRequestList() {
  const { data: requests, isLoading } = useMyWithdrawalRequests();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Withdrawal Requests</CardTitle>
          <CardDescription>No withdrawal requests yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getStatusVariant = (status: Variant_pending_approved_rejected): 'default' | 'secondary' | 'destructive' => {
    if (status === Variant_pending_approved_rejected.approved) return 'default';
    if (status === Variant_pending_approved_rejected.rejected) return 'destructive';
    return 'secondary';
  };

  const getStatusLabel = (status: Variant_pending_approved_rejected): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getMethodLabel = (method: Variant_jazzCash_easypaisa): string => {
    return method.charAt(0).toUpperCase() + method.slice(1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Withdrawal Requests</CardTitle>
        <CardDescription>Track the status of your withdrawals</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{Number(request.amount)}</TableCell>
                <TableCell className="capitalize">{getMethodLabel(request.payoutMethod)}</TableCell>
                <TableCell>{request.accountNumber}</TableCell>
                <TableCell>
                  {format(new Date(Number(request.timestamp) / 1000000), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(request.status)}>
                    {getStatusLabel(request.status)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
