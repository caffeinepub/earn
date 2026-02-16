import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetWithdrawalLimits, useSubmitWithdrawalRequest } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpFromLine, Info } from 'lucide-react';
import WithdrawalRequestList from '../components/WithdrawalRequestList';
import { toast } from 'sonner';

export default function WithdrawalsPage() {
  const { data: limits, isLoading } = useGetWithdrawalLimits();
  const submitMutation = useSubmitWithdrawalRequest();

  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = Number(amount);

    if (!amount || isNaN(amountNum)) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!limits) {
      toast.error('Unable to load withdrawal limits');
      return;
    }

    if (amountNum < Number(limits.min)) {
      toast.error(`Minimum withdrawal amount is ${Number(limits.min)}`);
      return;
    }

    if (amountNum > Number(limits.max)) {
      toast.error(`Maximum withdrawal amount is ${Number(limits.max)}`);
      return;
    }

    if (!accountNumber) {
      toast.error('Please enter your account number');
      return;
    }

    if (!payoutMethod) {
      toast.error('Please select a payout method');
      return;
    }

    try {
      await submitMutation.mutateAsync({
        account: accountNumber,
        amount: BigInt(amountNum),
      });

      toast.success('Withdrawal request submitted successfully!');
      setAmount('');
      setAccountNumber('');
      setPayoutMethod('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit withdrawal request');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <ArrowUpFromLine className="h-8 w-8" />
          Withdraw Funds
        </h1>
        <p className="text-muted-foreground mt-2">Request a withdrawal from your available balance</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Request</CardTitle>
              <CardDescription>Enter your withdrawal details below</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Minimum withdrawal: {Number(limits?.min || 0)} | Maximum withdrawal: {Number(limits?.max || 0)}
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min={Number(limits?.min || 0)}
                    max={Number(limits?.max || 0)}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    type="text"
                    placeholder="Enter your account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Payout Method</Label>
                  <Select value={payoutMethod} onValueChange={setPayoutMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payout method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easypaisa">Easypaisa</SelectItem>
                      <SelectItem value="jazzCash">JazzCash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={submitMutation.isPending}>
                  {submitMutation.isPending ? 'Submitting...' : 'Submit Withdrawal Request'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Processing Time</h4>
                <p className="text-muted-foreground">
                  Withdrawal requests are typically processed within 24-48 hours after approval.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Supported Methods</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Easypaisa</li>
                  <li>JazzCash</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <WithdrawalRequestList />
    </div>
  );
}
