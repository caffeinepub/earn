import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAvailableBalance, useMyDepositRequests } from '../hooks/useQueries';
import { Wallet, TrendingUp, Calendar, Coins } from 'lucide-react';
import { computeAccruedEarnings } from '../utils/earnings';
import { format } from 'date-fns';
import { Variant_pending_approved_rejected } from '../backend';

export default function WalletPage() {
  const { data: balance, isLoading: balanceLoading } = useGetAvailableBalance();
  const { data: deposits, isLoading: depositsLoading } = useMyDepositRequests();

  const approvedDeposit = deposits?.find((d) => d.status === Variant_pending_approved_rejected.approved);

  const isLoading = balanceLoading || depositsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  const accrued = approvedDeposit
    ? computeAccruedEarnings(
        Number(approvedDeposit.timestamp),
        Number(approvedDeposit.plan.durationDays),
        Number(approvedDeposit.plan.dailyProfit)
      )
    : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Wallet className="h-8 w-8" />
          My Wallet
        </h1>
        <p className="text-muted-foreground mt-2">View your balance and active plan details</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Available Balance
            </CardTitle>
            <CardDescription>Your current withdrawable balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{Number(balance || 0)}</div>
          </CardContent>
        </Card>

        {approvedDeposit && accrued && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Accrued Earnings
              </CardTitle>
              <CardDescription>Total earnings from active plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{accrued.accruedEarnings}</div>
              <p className="text-sm text-muted-foreground mt-2">
                Day {accrued.daysElapsed} of {Number(approvedDeposit.plan.durationDays)}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {approvedDeposit ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Plan</CardTitle>
                <CardDescription>Your current investment plan details</CardDescription>
              </div>
              <Badge>Plan {Number(approvedDeposit.plan.planId)}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Deposit Amount</span>
                  <span className="font-bold">{Number(approvedDeposit.plan.depositAmount)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Daily Profit</span>
                  <span className="font-bold text-primary">{Number(approvedDeposit.plan.dailyProfit)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Start Date</span>
                  <span className="font-medium">
                    {format(new Date(Number(approvedDeposit.timestamp) / 1000000), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">End Date</span>
                  <span className="font-medium">
                    {accrued &&
                      format(
                        new Date(Number(approvedDeposit.timestamp) / 1000000 + accrued.endDate.getTime()),
                        'MMM dd, yyyy'
                      )}
                  </span>
                </div>
              </div>
            </div>

            {accrued && (
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Expected Return</span>
                  <span className="text-2xl font-bold text-primary">
                    {Number(approvedDeposit.plan.dailyProfit) * Number(approvedDeposit.plan.durationDays)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Active Plan</CardTitle>
            <CardDescription>You don't have an active investment plan yet</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Visit the Plans page to choose an investment plan and start earning daily profits.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
